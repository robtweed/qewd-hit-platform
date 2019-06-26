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
};

function deleteCookie() {
  document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

module.exports = function (controller) {

  var self = this;

  controller.log = true;

  controller.on('socketDisconnected', function() {
    controller.displayError('Your session has expired.  Please log in again');
    setTimeout(function() {
      location.reload();
    }, 3000);
  });

  controller.formFieldHandler = function(formModuleName, fieldName) {
    var self = this;
    this.controller[formModuleName] = {
      onFieldChange: function(inputObj) {
        console.log('FieldChange - ' + inputObj.ref + '; ' + inputObj.value);
        self[inputObj.ref] = inputObj.value;
        self.controller[formModuleName][fieldName] = inputObj.value;
      }
    };
    this.controller[formModuleName][fieldName] = '';
  };

  controller.toastr = function(type, text) {
    if (type && type !== '' && self.toastContainer && self.toastContainer[type]) {
      self.toastContainer[type](text);
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
  });

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

      self.showLoginModal = false;
      //var status = messageObj.message.mode || 'loggedIn';

      var status = 'confirmMobileCode';
      //if (messageObj.message.mode === 'addAdminUser') status = 'addAdminUser';
      if (messageObj.message.mode) status = messageObj.message.mode;

      controller.userMode = messageObj.message.mode || 'unknown';
      
      // if 2FA enabled, status at login will be 'confirmMobileCode' 
      //  which will bring up modal panel for 2FA code confirmation

      self.setState({
        status: status
      });
    }
  });

  // Results of validating the 2FA code sent to the user's phone

  controller.on('confirmCode', function(messageObj) {

    if (!messageObj.message.error) {
      if (messageObj.message.ok) {
        // code was confirmed and user is logged in

        self.showLoginModal = false;
        controller.userMode = messageObj.message.mode;

        self.setState({
          status: messageObj.message.mode
        });
        return;
      }
      if (messageObj.message.expired) {
        controller.displayError('Your verification code has expired.  Please log in again');

        // wait 3 seconds then reset to initial state

        setTimeout(function() {
          self.showLoginModal = true;
          self.setState({
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

      self.showLoginModal = false;
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

      self.setState({
        status: messageObj.message.mode
      });
    }
  });


  controller.on('logout', function() {
    controller.disconnectSocket();
    self.setState({
      status: 'shutdown'
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
    this.navs = this.props.config.navs
  }

  this.navs.forEach(function(nav) {
    controller.on(nav.eventKey, function() {
      self.setState({
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

  if (self.navs.length === 1) {
    if (!self.navs[0].default) self.navs[0].default = true;
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

  this.checkAdminDoc = function() {
    // Has at least one administrator been defined yet?

    console.log('Checking Admin Document Status....');

    controller.send({
      type: 'getAdminStatus'
      }, function(responseObj) {
        console.log('getAdminStatus response: ' + JSON.stringify(responseObj));

        if (!responseObj.message.error) {
          self.setState({
            status: responseObj.message.status
          });
        }
      }
    );
  };

  this.hideUsername = false;

  this.startLogin = function() {
    console.log('startLogin: state.status = ' + self.state.status);
    if (self.state.status === 'docEmpty') self.hideUsername = true;
    self.setState({
      status: 'initial'
    });
  };


  return controller;
};
