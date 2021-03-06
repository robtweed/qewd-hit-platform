/*

 ----------------------------------------------------------------------------
 | ripple-admin: Ripple User Administration MicroService                    |
 |                                                                          |
 | Copyright (c) 2018 Ripple Foundation Community Interest Company          |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://rippleosi.org                                                     |
 | Email: code.custodian@rippleosi.org                                      |
 |                                                                          |
 | Author: Rob Tweed, M/Gateway Developments Ltd                            |
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

  16 February 2018

*/

module.exports = function (controller, component) {

  component.handleChange = function(e) {
    // update display of field in input component:

    var fieldName = component.props.fieldname;
    var value = e.target.value;

    component.setState({
      value: value
    });

    // and then pass up to LoginModal parent component:

    controller.LoginModal.onLoginFieldChange({
      value: value,
      ref: fieldName
    });
  };

  component.validationState = function() {
    if (component.state.value.length === 0) return 'error';
  };

  component.autofocus = component.props.focus;

  return controller;
};
