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

var util = require('util');

module.exports = function (controller) {

  var self = this;

  this.email = '';
  this.password = '';
  this.password2 = '';
  this.name = '';
  this.mobileNo = '';

  this.userType = {
    value: 'userMaint',
    options: [
      {
        value: 'userMaint',
        label: 'User Maintenance Only'
      },
      {
        value: 'admin',
        label: 'OIDC Administrator'
      }
    ],
    change: function(selectedOption) {
      self.userType.value = selectedOption.value;
      self.setState({
        status: 'userTypeSelected'
      });
    }    
  };

  this.cancel = function() {
    controller.emit('cancelRegisterUser');
  };

  controller.RegisterUser = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      self[inputObj.ref] = inputObj.value;
      controller.RegisterUser.refs[inputObj.ref] = inputObj.inputRef;
    },
    refs: {}
  };

  this.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      self.addUser();
    }
  };

  this.checkEmail = function() {
    // get browser to display any email error

    if (!controller.RegisterUser.refs || !controller.RegisterUser.refs.email) {
      return;
    }

    var valid = true;
    if (typeof controller.RegisterUser.refs.email.reportValidity === 'function') {
      valid = controller.RegisterUser.refs.email.reportValidity();
    }

    if (valid) {/* nothing in this instance */}
  };

  controller.on('registerUser', function(messageObj) {
    console.log('registerUser event: ' + JSON.stringify(messageObj));
    if (!messageObj.message.error) {
      console.log('registerUser - no error');
      controller.token = messageObj.token;
      var status = 'userAdded';
      if (self.props.loginStatus === 'addAdminUser') status = 'alert';
      controller.toastr('info', 'New User Registered Successfully');
      setTimeout(function() {
        self.setState({
          status: status
        });
      }, 500);
    }
  });

  this.addUser = function() {

    if (!self.email || self.email === '') {
      controller.displayError('You must enter a valid Email Address');
      return;
    }

    if (!self.password || self.password === '') {
      controller.displayError('You must enter a password');
      return;
    }

    if (!self.password2 || self.password2 === '') {
      controller.displayError('You must re-enter the password');
      return;
    }

    if (self.password !== self.password2) {
      controller.displayError('Passwords must match!');
      return;
    }

    if (self.props.loginStatus === 'addAdminUser') {
      self.userType.value = 'admin';
    }

    if (!self.name || self.name === '') {
      controller.displayError("You must enter the user's Name");
      return;
    }

    if (!self.mobileNo || self.mobileNo === '') {
      controller.displayError('You must enter a Mobile Phone Number');
      return;
    }

    controller.send({
      type: 'registerUser',
      params: {
        email: self.email,
        password: self.password,
        userType: self.userType.value,
        name: self.name,
        mobileNo: self.mobileNo,
      }
    });

  };

  this.reload = function() {
    window.location = '/oidc-admin/index.html';
  };

  return controller;
};
