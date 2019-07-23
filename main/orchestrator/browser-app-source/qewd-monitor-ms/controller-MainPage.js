/*

 ----------------------------------------------------------------------------
 | qewd-oidc-admin: Administration Interface for QEWD OpenId Connect Server |
 |                                                                          |
 | Copyright (c) 2018 M/Gateway Developments Ltd,                           |
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

 14 November 2018

*/

function setCookie(value, name) {
  name = name || 'JSESSIONID';
  document.cookie = name + "=" + value + '; path=/';
  console.log('cookie set to: ' + name + "=" + value + '; path=/');
}

function deleteCookie() {
  document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

module.exports = function (controller) {

  var _this = this;
  var jwt = getCookie('JSESSIONID');

  controller.log = true;
  controller.timers = {};

  controller.request = function(message, callback) {
    controller.send(message, function(responseObj) {
      setCookie(responseObj.message.token);
      callback(responseObj);
    });
  };

  controller.ms_send = function(message, callback) {
    if (message.qewd_destination === 'orchestrator') {
      message.service = message.qewd_application;
      delete message.qewd_destination;
      delete message.qewd_application;
    }
    controller.send(message, callback);
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
    controller.toastr('error', error);
  };

  // display generic EWD.js errors using toastr:

  controller.on('error', function(messageObj) {
    console.log('&&& error event: messageObj = ' + JSON.stringify(messageObj));
    var error = messageObj.message.error || messageObj.message;
    console.log('displayError: ' + error);
    controller.displayError(error);
    if (messageObj.message.error === 'MicroService connection is down') {
      setTimeout(function() {
        location.reload();
      }, 3000);
    }
  });

  this.getMicroServices = function() {
    var defOption = 'orchestrator';
    controller.send({
      type: 'getMicroServices',
      params: {
        jwt: jwt
      }
    }, function(responseObj) {
      console.log('** response for getMicroServices: ' + JSON.stringify(responseObj, null, 2));
      var options = [{
        value: defOption,
        label: defOption
      }]; // Orchestrator (ie local service) always first option
      responseObj.message.microservices.forEach(function(ms_name) {
        options.push({
          value: ms_name,
          label: ms_name
        });
      });

      _this.destination = {
        //value: responseObj.message.microservices[0],
        //label: responseObj.message.microservices[0],
        value: defOption,
        label: defOption,
        options: options,
        change: function(selectedOption) {
          _this.destination.value = selectedOption.value;
          _this.destination.label = selectedOption.label;
          _this.setState({
            status: 'loggedIn'
          });
        }    
      };

      console.log('Destination initial value: ' + _this.destination.value);

      _this.setState({
        status: 'selectMicroservice'
      });
    });
  };

  this.handleIframeMsg = function(e) {
    if (e.data === 'loggedIn') {
      console.log('received loggedIn message from iframe');
      controller.updateTokenFromJWT();
      /*
      _this.setState({
        status: 'loggedIn'
      });
      */
      _this.getMicroServices();
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

  // Results of updating the user password

  controller.on('changePassword', function(messageObj) {

    if (!messageObj.message.error) {
      // password was successfully updated

      _this.showLoginModal = false;
      controller.userMode = messageObj.message.mode;

      console.log('controller-MainPage: changePassword Event; messageObj = ' + JSON.stringify(messageObj));

      controller.app.navs.activeKey = 'admin';

      if (messageObj.message.modal === false) {
        controller.toastr('success', 'You successfully updated your password');
        setTimeout(function() {
          // switch back to Admin screen
          controller.emit('admin');
        }, 2000);
        return;
      }

      _this.setState({
        status: messageObj.message.mode
      });
    }
  });


  controller.on('logout', function() {

    controller.send({
      type: 'logoff'
      }, function(responseObj) {
        console.log('response: ' + JSON.stringify(responseObj, null, 2));
        deleteCookie();
        window.location.replace(responseObj.message.redirectURL);
    });
    
    //controller.disconnectSocket();
    //_this.setState({
    //  status: 'shutdown'
    //});
  });

  controller.on('reload', function() {
    location.reload();
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
     console.log('on ' + nav.eventKey + ' triggered');
      _this.activeKey = nav.eventKey;
      _this.setState({
        status: nav.eventKey
      });
    });
    if (!nav.text) nav.text = 'Unspecified';
    if (!nav.eventKey) nav.eventKey = 'unspecified';
    if (nav.default) _this.activeKey = nav.eventKey;
    if (!nav.panel) nav.panel = {};
    if (!nav.panel.bsStyle) nav.panel.bsStyle = 'primary';
    if (!nav.panel.title) nav.panel.title = nav.text + ' Panel';
    if (!nav.panel.titleComponentClass) nav.panel.titleComponentClass = 'h3';
  });

  if (_this.navs.length === 1) {
    if (!_this.navs[0].default) _this.navs[0].default = true;
  }

  controller.navOptionSelected = function(eventKey) {
    console.log('navOptionSelected: ' + eventKey);
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

  this.checkAdminDoc = function() {
    // Has at least one administrator been defined yet?

    console.log('Checking Admin Document Status....');

    controller.send({
      type: 'getAdminStatus'
      }, function(responseObj) {
        console.log('getAdminStatus response: ' + JSON.stringify(responseObj));

        if (!responseObj.message.error) {
          _this.setState({
            status: responseObj.message.status
          });
        }
      }
    );
  };

  this.hideUsername = false;

  setCookie(controller.application, 'qewd-application');

  controller.request({
    type: 'getOIDCRedirect',
    params: {
      jwt: jwt
    }
  }, function(responseObj) {
    console.log('getOIDCRedirect response: ' + JSON.stringify(responseObj, null, 2));

    if (responseObj.message.error) {
      controller.displayError(responseObj.message.error);
      return;
    }

    var message = responseObj.message;

    if (!message.authenticated) {
      if (message.redirectURL) {
        _this.redirectUrl = message.redirectURL + '&ui_app=qewd-monitor-ms';
        _this.setState({
          status: 'redirect'
        });
      }
      else {
        // unlikely but need to do something just in case...
      }
      return;
    }

    _this.getMicroServices(jwt);


  });

  return controller;
};
