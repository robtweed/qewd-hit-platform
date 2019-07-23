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

 05 October 2018

*/

module.exports = function (controller) {

  var _this = this;

  this.cancel = function() {
    _this.controller.emit('cancelAddUser');      
  };

  controller.EditUser = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      _this[inputObj.ref] = inputObj.value;
      controller.EditUser.refs[inputObj.ref] = inputObj.inputRef;
    },
    refs: {}
  };

  this.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      _this.saveUser();
    }
  };

  this.handleDateChange = function(value, modifier, dayPickerInput) {
    console.log('*** date value = ' + value);
    console.log('*** dayPickerInput value = ' + dayPickerInput.getInput().value);
    //console.log(typeof value);
    //console.log(new Date(value).getTime());

    if (typeof value !== 'undefined') {
      //console.log('*** date value = ' + value);
      _this.dob = dayPickerInput.getInput().value;
    }
  };

  this.checkEmail = function() {
    // get browser to display any email error

    if (!controller.EditUser.refs || !controller.EditUser.refs.email) {
      return;
    }

    var valid = true;
    if (typeof controller.EditUser.refs.email.reportValidity === 'function') {
      valid = controller.EditUser.refs.email.reportValidity();
    }

    if (valid) {/* nothing in this instance */}
  };

  this.saveUser = function() {

    var id = _this.props.data.id || '';
    var client = _this.props.client;

    if (typeof _this.email !== 'string' || _this.email === '') {
      controller.displayError('You must enter an Email Address');
      return;
    }

    console.log('claims: ' + _this.claims);

    if (typeof _this.claims === 'string') {
      if (_this.claims !== '') {
        try {
          _this.claims = JSON.parse(_this.claims);
          console.log('successfully parsed the claims');
        } 
        catch(err) {
          controller.displayError('Invalid claims JSON: ' + err);
          return;
        }
      }
      else {
        delete _this.claims;
      }
    }

    // send save message
    //   response handlersubscription - on('saveUser') - is in parent component (UserMaint)

    console.log('sending saveUser message');

    controller.send({
      type: 'saveUser',
      params: {
        client: client,
        id: id,
        email: _this.email,
        password: _this.password,
        claims: _this.claims
      }
    });

    console.log('sent');

  };

  return controller;
};
