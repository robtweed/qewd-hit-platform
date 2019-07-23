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

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');
var FormField = require('./FormField');

import Select from 'react-select';

var {
  Alert,
  Button,
  ControlLabel,
  Panel
} = ReactBootstrap;

var RegisterUser = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-RegisterUser').call(this, this.props.controller);
  },

  componentDidMount: function() {
  },
  
  componentWillReceiveProps: function(newProps) {
    //this.show = newProps.data.show;
    //this.options = newProps.data.options;
    //this.prefix = newProps.data.prefix || '';
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

    console.log('rendering RegisterUser - loginStatus = ' + this.props.loginStatus);

    if (this.state.status === 'alert') {
      return (
        <Alert bsStyle="danger" onDismiss={this.reload}>
          <h4>You've created an Admin User</h4>
          <p>
            Click OK and log in as the user you've just created.
          </p>
          <p>
            <Button 
              bsStyle="danger"
              onClick = {this.reload}
            >
              Login
            </Button>
          </p>
        </Alert>
      );
    }

    var style = {};
    var panelTitle = 'Register a New Admin or IDCR User';
    if (this.props.loginStatus === 'addAdminUser') {
      style = {display: 'none'};
      panelTitle = 'Register the First Admin User';
    }

    console.log('userType: ' + JSON.stringify(this.userType));

    return (
      <div>
        <Panel
          bsStyle="info"
        >
          <Panel.Heading>
   	     {panelTitle}
          </Panel.Heading>
          <Panel.Body>

            <div style = {style}>
              <ControlLabel>User Type</ControlLabel>
              <Select
                name="userType"
                value = {this.userType.value}
                options={this.userType.options}
                onChange={this.userType.change}
              />
            </div>
            <FormField
              fieldname='email'
              label='Email'
              type='email'
              controller = {this.controller}
              focus={true}
              value = {this.email}
              formModule = 'RegisterUser'
            />
            <FormField
              fieldname='password'
              label='Password'
              type='password'
              controller = {this.controller}
              focus={false}
              value = {this.password}
              formModule = 'RegisterUser'
              onFocus = {this.checkEmail}
            />
            <FormField
              fieldname='password2'
              label='Re-Enter Password'
              type='password'
              controller = {this.controller}
              focus={false}
              value = {this.password2}
              formModule = 'RegisterUser'
            />

            <FormField
              fieldname='name'
              label='Name'
              type='text'
              controller = {this.controller}
              focus={false}
              value = {this.name}
              formModule = 'RegisterUser'
            />

            <FormField
              fieldname='mobileNo'
              label='Mobile Phone Number'
              type='tel'
              controller = {this.controller}
              focus={false}
              value = {this.mobileNo}
              pattern = "^\s*\(?(020[7,8]{1}\)?[ ]?[1-9]{1}[0-9{2}[ ]?[0-9]{4})|(0[1-8]{1}[0-9]{3}\)?[ ]?[1-9]{1}[0-9]{2}[ ]?[0-9]{3})\s*$"
              formModule = 'RegisterUser'
            />

            <Button 
              bsClass="btn btn-success"
              onClick = {this.addUser}
            >
              Save
            </Button>

          </Panel.Body>
        </Panel>
      </div>
    );
  }
});

module.exports = RegisterUser;

            /*
             <input type="tel" required="" 
             pattern="^\s*\(?(020[7,8]{1}\)?[ ]?[1-9]{1}[0-9{2}[ ]?[0-9]{4})|(0[1-8]{1}[0-9]{3}\)?[ ]?[1-9]{1}[0-9]{2}[ ]?[0-9]{3})\s*$"
             value="" name="phones_pattern1" id="phones_pattern1" list="phones_pattern1_datalist" 
             placeholder="Try it out.">
             */
