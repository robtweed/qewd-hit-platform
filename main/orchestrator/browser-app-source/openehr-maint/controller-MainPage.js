/*

 ----------------------------------------------------------------------------
 | openehr-maint: OpenEHR Maintenance Interface                             |
 |                                                                          |
 | Copyright (c) 2018-19 M/Gateway Developments Ltd,                        |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

 19 June 2019

*/

function setCookie(value, name) {
  name = name || 'JSESSIONID';
  document.cookie = name + "=" + value + '; path=/';
  console.log('cookie set to: ' + name + "=" + value + '; path=/');
}

function deleteCookie(name) {
  name = name || 'JSESSIONID';
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

module.exports = function (controller) {

  var _this = this;

  controller.log = true;

  controller.request = function(message, callback) {
    controller.send(message, function(responseObj) {
      setCookie(responseObj.message.token);
      callback(responseObj);
    });
  };

  controller.on('socketDisconnected', function() {
    controller.displayError('Your session has expired.  Please log in again');
    setTimeout(function() {
      location.reload();
    }, 3000);
  });

  controller.formFieldHandler = function(formModuleName, fieldName) {
    var _this = this;
    this.controller[formModuleName] = {
      onFieldChange: function(inputObj) {
        console.log('FieldChange - ' + inputObj.ref + '; ' + inputObj.value);
        _this[inputObj.ref] = inputObj.value;
        _this.controller[formModuleName][fieldName] = inputObj.value;
      }
    };
    this.controller[formModuleName][fieldName] = '';
  };

  controller.toastr = function(type, text) {
    if (type && type !== '' && _this.toastContainer && _this.toastContainer[type]) {
      _this.toastContainer[type](text);
    }
  };

  controller.displayError = function(error) {
    console.log('toastr display error: ' + error);
    controller.toastr('error', error);
  };

  // display generic EWD.js errors using toastr:

  controller.on('error', function(messageObj) {
    console.log('&&& error event: messageObj = ' + JSON.stringify(messageObj));
    var error = messageObj.message.error || messageObj.message;
    console.log('displayError: ' + error);
    controller.displayError(error);
  });

  this.handleIframeMsg = function(e) {
    if (e.data === 'loggedIn') {
      console.log('received loggedIn message from iframe');
      controller.updateTokenFromJWT();
      _this.setState({
        status: 'loggedIn'
      });
    }
  };

  // publish the login response handler in this
  // component to force re-render of main page

  controller.on('login', function(messageObj) {

    if (messageObj.message.error && messageObj.message.error === 'Too many attempts to login') {
      setTimeout(function() {
        location.reload();
      }, 4000);
      return;
    }

    if (!messageObj.message.error && messageObj.message.ok) {
      // logged in

      _this.showLoginModal = false;
      //var status = messageObj.message.mode || 'loggedIn';

      var status = 'confirmMobileCode';
      //if (messageObj.message.mode === 'addAdminUser') status = 'addAdminUser';
      if (messageObj.message.mode) status = messageObj.message.mode;

      controller.userMode = messageObj.message.mode || 'unknown';
      
      // if 2FA enabled, status at login will be 'confirmMobileCode' 
      //  which will bring up modal panel for 2FA code confirmation

      _this.setState({
        status: status
      });
    }
  });

  // Results of validating the 2FA code sent to the user's phone

  controller.on('confirmCode', function(messageObj) {

    if (!messageObj.message.error) {
      if (messageObj.message.ok) {
        // code was confirmed and user is logged in

        _this.showLoginModal = false;
        controller.userMode = messageObj.message.mode;

        _this.setState({
          status: messageObj.message.mode
        });
        return;
      }
      if (messageObj.message.expired) {
        controller.displayError('Your verification code has expired.  Please log in again');

        // wait 3 seconds then reset to initial state

        setTimeout(function() {
          _this.showLoginModal = true;
          _this.setState({
            status: 'initial'
          });
        }, 3000);
      }
      
    }
  });


  controller.on('logout', function() {
    deleteCookie();
    controller.send({
      type: 'logoff'
    }, function(responseObj) {
      console.log('logout response: ' + JSON.stringify(responseObj, null, 2));
      window.location.replace(responseObj.message.redirectURL);
    });
  });

  this.navs = [
    {
      text: 'Main',
      eventKey: 'main',
      default: true,
      panel: {
        title: 'Main Panel'
      }
    }
  ];

  if (this.props.config && this.props.config.navs) {
    this.navs = this.props.config.navs;
  }

  this.navs.forEach(function(nav) {
    controller.on(nav.eventKey, function() {
      if (nav.eventKey === 'admin') return;
      _this.setState({
        status: nav.eventKey
      });
    });
    if (!nav.text) nav.text = 'Unspecified';
    if (!nav.eventKey) nav.eventKey = 'unspecified';
    if (!nav.panel) nav.panel = {};
    if (!nav.panel.bsStyle) nav.panel.bsStyle = 'primary';
    if (!nav.panel.title) nav.panel.title = nav.text + ' Panel';
    if (!nav.panel.titleComponentClass) nav.panel.titleComponentClass = 'h3';
  });

  if (_this.navs.length === 1) {
    if (!_this.navs[0].default) _this.navs[0].default = true;
  }

  controller.navOptionSelected = function(eventKey) {
    controller.emit(eventKey);
  };

  controller.app = this.props.config || {};
  if (!controller.app.navs) controller.app.navs = this.navs;
  if (!controller.app.title) controller.app.title = 'Un-named Application';

  if (controller.app.loginModal && controller.app.mode !== 'local') {
    this.showLoginModal = true;
  }
  else {
    this.showLoginModal = false;
    this.setState({
      status: 'loggedIn'
    });
  }

  this.hideUsername = false;

  this.startLogin = function() {
    //_this.showLoginModal = false;
    _this.setState({
      status: 'redirect'
    });
  };

  var jwt = getCookie('JSESSIONID');
  setCookie(controller.application, 'qewd-application');

  controller.getJWT = function() {
    return getCookie('JSESSIONID');
  };

  controller.request({
    type: 'getOIDCRedirect',
    params: {
      jwt: jwt
    }
  }, function(responseObj) {
    console.log('getOIDCRedirect response: ' + JSON.stringify(responseObj, null, 2));
    if (responseObj.message.error) {
      _this.error = responseObj.message.error;
      deleteCookie();
      _this.setState({
        status: 'redirectError'
      });
      return;
    }
    if (responseObj.message.authenticated) {
      _this.setState({
        status: 'loggedIn'
      });
    }
    else if (responseObj.message.redirectURL) {
      _this.redirectUrl = responseObj.message.redirectURL;
      _this.startLogin();
    }
  });

  return controller;
};
