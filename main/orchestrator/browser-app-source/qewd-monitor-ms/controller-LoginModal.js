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

 28 September 2018

*/

module.exports = function (controller) {

  var self = this;

  this.password = '';
  this.username = '';

  controller.LoginModal = {
    onLoginFieldChange: function(inputObj) {
      //console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      self[inputObj.ref] = inputObj.value;
    }
  };

  this.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      self.handleLogin();
    }
  };

  this.handleLogin = function() {

    if (typeof self.username !== 'string' || self.username === '') {
      controller.displayError('You must enter your username');
      return;
    }

    if (typeof self.password !== 'string' || self.password === '') {
      controller.displayError('You must enter your password');
      return;
    }

    // send login message
    //   response handler subscription is in parent component (MainPage)

    controller.send({
      type: 'login',
      params: {
        username: self.username,
        password: self.password
      }
    });

  };

  this.modalTitle = 'Login';
  this.username = {
    placeholder: 'Enter your Email Address',
    label: 'Email Address'
  };
  this.password = {
    placeholder: 'Enter your password',
    label: 'Password'
  };
  if (controller.app.loginModal) {
    if (controller.app.loginModal.title) {
      this.modalTitle = controller.app.loginModal.title;
    }
    if (controller.app.loginModal.username) {
      if (controller.app.loginModal.username.label) {
        this.username.label = controller.app.loginModal.username.label;
      }
      if (controller.app.loginModal.username.placeholder) {
        this.username.placeholder = controller.app.loginModal.username.placeholder;
      }
    }
    if (controller.app.loginModal.password) {
      if (controller.app.loginModal.password.label) {
        this.password.label = controller.app.loginModal.password.label;
      }
      if (controller.app.loginModal.password.placeholder) {
        this.password.placeholder = controller.app.loginModal.password.placeholder;
      }
    }
  }

  return controller;
};
