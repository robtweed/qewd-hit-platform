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

 02 October 2018

*/

module.exports = function (controller) {

  var self = this;

  this.password = '';
  this.password2 = '';
  this.modalTitle = 'You must now replace your temporary password with a permanent one';

  controller.ChangePasswordModal = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      self[inputObj.ref] = inputObj.value;
      controller.ChangePasswordModal.refs[inputObj.ref] = inputObj.inputRef;
    },
    refs: {}
  };

  this.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      self.changePassword();
    }
  };

  this.changePassword = function() {

    if (typeof self.password !== 'string' || self.password === '') {
      controller.displayError('You must enter a new password');
      return;
    }

    if (typeof self.password2 !== 'string' || self.password2 === '') {
      controller.displayError('You must re-enter your new password');
      return;
    }

    if (self.password !== self.password2) {
      controller.displayError('Those passwords do not match!');
      return;
    }

    // at least 1 upper case
    // at least 1 lower case
    // at least 1 number
    // at least 7 characters long
    var passwordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,})");

    if (!passwordPattern.test(self.password)) {
      controller.displayError('Your password does not meet the necessary requirements');
      return;
    }

    // send new password message
    //   response handler subscription is in parent component (MainPage)

    controller.send({
      type: 'changePassword',
      params: {
        password: self.password,
        modal: true
      }
    });
  };

  return controller;
};
