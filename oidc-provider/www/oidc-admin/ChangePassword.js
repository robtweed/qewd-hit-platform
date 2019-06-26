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

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');

var FormField = require('./FormField');

var {
  Button
} = ReactBootstrap;

var ChangePassword = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-ChangePassword').call(this, this.props.controller);
  },

  componentWillUpdate: function() {
    console.log('ChangePassword updating');
    this.password = '';
    this.password2 = '';
  },

  render: function() {

    console.log('rendering ChangePassword');

    return (

      <div>

          <p>
            Your new password should be at least 7 characters in length, and contain a mixture of
            upper-case letters, lower-case letters and numbers.
          </p>

          <FormField
            fieldname='password'
            label='Enter your new password'
            type='password'
            controller = {this.controller}
            focus={true}
            value = {this.password}
            formModule = 'ChangePassword'
          />
          <FormField
            fieldname='password2'
            label='Re-enter your new password'
            type='password'
            controller = {this.controller}
            focus={false}
            value = {this.password2}
            formModule = 'ChangePassword'
          />
          <Button 
            bsClass="btn btn-success"
            onClick = {this.changePassword}
          >
            Update Password
          </Button>
      </div>
    );    
  }
});

module.exports = ChangePassword;
