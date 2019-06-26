/*

 ------------------------------------------------------------------------------------
 | qewd-monitor: React.js-based Monitor/Management Application for QEWD             |
 |                                                                                  |
 | Copyright (c) 2017-18 M/Gateway Developments Ltd,                                |
 | Redhill, Surrey UK.                                                              |
 | All rights reserved.                                                             |
 |                                                                                  |
 | http://www.mgateway.com                                                          |
 | Email: rtweed@mgateway.com                                                       |
 |                                                                                  |
 |                                                                                  |
 | Licensed under the Apache License, Version 2.0 (the "License");                  |
 | you may not use this file except in compliance with the License.                 |
 | You may obtain a copy of the License at                                          |
 |                                                                                  |
 |     http://www.apache.org/licenses/LICENSE-2.0                                   |
 |                                                                                  |
 | Unless required by applicable law or agreed to in writing, software              |
 | distributed under the License is distributed on an "AS IS" BASIS,                |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.         |
 | See the License for the specific language governing permissions and              |
 |  limitations under the License.                                                  |
 ------------------------------------------------------------------------------------

  24 September 2018

*/

module.exports = function (controller) {

  var self = this;

  this.password = '';

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

    if (self.password === '') {
      controller.displayError('You must enter the Management Password');
      return;
    }

    // send login message
    //   response handler subscription is in parent component (MainPage)

    controller.send({
      type: 'login',
      params: {
        password: self.password
      }
    });
  };

  return controller;
};
