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

 26 September 2018

*/

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');

var {
  ControlLabel,
  FormControl,
  FormGroup
} = ReactBootstrap;

var LoginField = createReactClass({

  getInitialState: function() {
    return {value:''}
  },

  componentWillMount: function() {
    this.controller = require('./controller-LoginField').call(this, this.props.controller);
  },

  render: function() {

    //console.log('LoginField rendering');
    //this.controller.updateComponentPath(this);

    if (this.props.hide === true) {
      return (
        <span></span>
      );
    }

    return (
      <FormGroup>
        <ControlLabel>{this.props.label}</ControlLabel>
        <FormControl
          autoFocus = {this.autofocus}
          type={this.props.type}
          value={this.state.value}
          placeholder={this.props.placeholder}
          bsStyle={this.validationState()}
          /*ref={this.props.fieldname}*/
          onChange={this.handleChange}
        />
        <FormControl.Feedback />
     </FormGroup>
    )
  }
});

module.exports = LoginField;
