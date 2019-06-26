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

  this.userType = {
    value: 'userMaint',
    labels: {
      admin: 'OIDC Administrator',
      userMaint: 'User Maintenance Only'
    },
    change: function(selectedOption) {
      console.log('userType change - selectedOption - ' + JSON.stringify(selectedOption, null, 2));

      self.userType.value = {
        label: self.userType.labels[selectedOption.value],
        value: selectedOption.value
      };

      self.data = {
        id: self.data.id,
        email: self.email,
        mobileNo: self.mobileNo,
        name: self.name,
        userType: selectedOption.value
      };

      self.setState({
        status: 'userTypeSelected'
      });
    }    
  };

  this.userType.options = [];
  for (var value in this.userType.labels) {
    this.userType.options.push({
      value: value,
      label: this.userType.labels[value]
    });
  }

  this.data = this.props.data;
  this.userType.value = this.props.data.userType;

  this.cancel = function() {
    controller.emit('cancelAddAccess');      
  };

  controller.EditAccess = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      self[inputObj.ref] = inputObj.value;
      controller.EditAccess.refs[inputObj.ref] = inputObj.inputRef;
    },
    refs: {}
  };

  this.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      self.saveAccess();
    }
  };

  this.checkEmail = function() {
    // get browser to display any email error

    if (!controller.EditAccess.refs || !controller.EditAccess.refs.email) {
      return;
    }

    var valid = true;
    if (typeof controller.EditAccess.refs.email.reportValidity === 'function') {
      valid = controller.EditAccess.refs.email.reportValidity();
    }

    if (valid) {/* nothing in this instance */}
  };

  this.saveAccess = function() {

    var id = self.data.id || '';

    if (typeof self.email !== 'string' || self.email === '') {
      controller.displayError('You must enter an Email Address');
      return;
    }

    if (!self.mobileNo || self.mobileNo === '') {
      controller.displayError('You must enter a Mobile Phone Number');
      return;
    }

    if (typeof self.name !== 'string' || self.name === '') {
      controller.displayError('You must enter a Name');
      return;
    }

    console.log('saveAccess: this.userType = ' + JSON.stringify(self.userType, null, 2));
    console.log('saveAccess: this.data.userType = ' + self.data.userType);

    if (self.data.userType !== 'userMaint' && self.data.userType !== 'admin') {
      controller.displayError('Invalid User Type');
      return;
    }

    // send save message
    //   response handlersubscription - on('saveMaintainer') - is in parent component (AccessMaint)

    controller.send({
      type: 'saveMaintainer',
      params: {
        id: id,
        email: self.email,
        mobileNo: self.mobileNo,
        name: self.name,
        userType: self.data.userType
      }
    });

  };

  return controller;
};
