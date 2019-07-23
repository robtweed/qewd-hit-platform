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

 12 October 2018

*/

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');
import Select from 'react-select';
var FormField = require('./FormField');

var {
  Button,
  ControlLabel,
  Panel
} = ReactBootstrap;

var EditAccess = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-EditAccess').call(this, this.props.controller);

    this.title = (
      <span>
          <b>{this.props.title}</b>
          <Button 
            bsClass="btn btn-primary pull-right"
            onClick = {this.cancel}
          >
            Cancel
          </Button>
      </span>
    );
  },

  componentDidMount: function() {
  },
  
  componentWillReceiveProps: function(newProps) {
    this.data = newProps.data;
    console.log('EditAccess newProps.data = ' + JSON.stringify(newProps.data, null, 2)); 
    this.userType.value = {
      label: this.userType.labels[newProps.data.userType],
      value: newProps.data.userType
    };
    this.title = (
      <span>
          <b>{newProps.title}</b>
          <Button 
            bsClass="btn btn-primary pull-right"
            onClick = {this.cancel}
          >
            Cancel
          </Button>
      </span>
    );
  },

  render: function() {

    //console.log('rendering EditAccess - show = ' + this.props.show);

    console.log('EditAccess - userType value = ' + JSON.stringify(this.userType.value));

    return (
      <div
        className = {this.props.show}
      >
        <Panel
          bsStyle="info"
        >
          <Panel.Heading>
   	     {this.title}
          </Panel.Heading>
          <Panel.Body>

            <FormField
              fieldname='email'
              label='Email Address'
              type='email'
              controller = {this.controller}
              focus={true}
              value = {this.data.email}
              formModule = 'EditAccess'
            />

            <FormField
              fieldname='name'
              label='Name'
              type='text'
              controller = {this.controller}
              focus={false}
              value = {this.data.name}
              formModule = 'EditAccess'
              onFocus = {this.checkEmail}
            />

            <FormField
              fieldname='mobileNo'
              label='Mobile Phone Number'
              type='tel'
              controller = {this.controller}
              focus={false}
              value = {this.data.mobileNo}
              pattern = "\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$"
              formModule = 'EditAccess'
            />

            <ControlLabel>User Type</ControlLabel>
            <Select
              name = "userType"
              value = {this.userType.value}
              options = {this.userType.options}
              onChange = {this.userType.change}
            />

            <Button 
              bsClass="btn btn-success"
              onClick = {this.saveAccess}
            >
              Save
            </Button>

          </Panel.Body>
        </Panel>
      </div>
    );
  }
});

module.exports = EditAccess;
