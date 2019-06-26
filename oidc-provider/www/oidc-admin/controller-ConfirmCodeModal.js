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

  this.code = '';
  this.modalTitle = 'You should receive a code on your Mobile Phone';

  controller.ConfirmCodeModal = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      self[inputObj.ref] = inputObj.value;
      controller.ConfirmCodeModal.refs[inputObj.ref] = inputObj.inputRef;
    },
    refs: {}
  };

  this.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      self.confirmCode();
    }
  };

  this.confirmCode = function() {

    if (typeof self.code !== 'string' || self.code === '') {
      controller.displayError('You must enter the code that was sent to your mobile phone');
      return;
    }

    // send code confirmation message
    //   response handler subscription is in parent component (MainPage)

    controller.send({
      type: 'confirmCode',
      params: {
        code: self.code
      }
    });
  };

  var max = 3;
  var count = 0;

  this.resendCode = function() {
    count++;
    if (count > max) {
      controller.displayError('You have reached the maximum number of re-sends. Please log in again');
      setTimeout(function() {
        location.reload();
      }, 2000);
      return;
    }

    controller.send({
      type: 'resendCode'
    });

  };

  return controller;
};
