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

 27 September 2018

*/

module.exports = function (controller) {

  var _this = this;

  this.cancel = function() {
    controller.emit('cancelAddClaim');      
  };

  controller.EditClaim = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      _this[inputObj.ref] = inputObj.value;
    }
  };

  this.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      _this.saveClaim();
    }
  };

  this.saveClaim = function() {

    if (!_this.props.data.exists) {
      // checks if adding a new custom Claim
      if (typeof _this.customClaims !== 'string' || _this.customClaims === '') {
        controller.displayError('You must enter at least one custom claim field');
        return;
      }
    }

    if (typeof _this.name !== 'string' || _this.name === '') {
      controller.displayError('You must enter a Claim Id/Name');
      return;
    }

    // send save message
    //   response handlersubscription - on('saveClaim') - is in parent component (ClaimMaint)

    controller.send({
      type: 'saveClaim',
      params: {
        name: _this.name,
        custom: _this.customClaims
      }
    });
    delete _this.name;
    delete _this.customClaims;

  };

  return controller;
};
