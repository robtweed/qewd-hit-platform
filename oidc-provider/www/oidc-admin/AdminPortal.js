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

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');

var RegisterUser = require('./RegisterUser');
var ClientMaint = require('./ClientMaint');
var ClaimMaint = require('./ClaimMaint');
var UserMaint = require('./UserMaint');
var AccessMaint = require('./AccessMaint');

var {
  Tab,
  Tabs
} = ReactBootstrap;

var AdminPortal = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    //this.controller = require('./controller-SessionsPanel').call(this, this.props.controller);
  },

  componentDidMount: function() {
  },
  
  componentWillReceiveProps: function(newProps) {
    //this.onNewProps(newProps);
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

    console.log('rendering AdminPortal - loginStatus = ' + this.props.loginStatus);

    if (this.props.loginStatus === 'addAdminUser') {
      // no records are in the Admin Login Database yet
      //  Only allow this user to add 1 User, which must be an admin user
      //  They can then login

      return (
        <div>
          <RegisterUser
            controller = {this.props.controller}
            loginStatus = {this.props.loginStatus}
          />
        </div>
      );
    }


    if (this.props.loginStatus === 'exists') {
      // Initial admin user has logged in using management password
      //  so now they can register an initial admin user
      return (
        <RegisterUser
          controller = {this.props.controller}
          loginStatus = {this.props.loginStatus}
        />
      );
    }

    // normal login

    //  userMode will be either admin or userMaint

    //console.log('this.props.controller.userMode = ' + this.props.controller.userMode);

    if (this.props.loginStatus === 'userMaint') {

      return (
        <UserMaint
          controller = {this.props.controller}
          userType = {this.props.loginStatus}
        />
      );

    }

    return (
      <Tabs defaultActiveKey={1} id="Options">
        <Tab eventKey={1} title="Clients">
          <ClientMaint
            controller = {this.props.controller}
            userType = {this.props.loginStatus}
          />
        </Tab>
        <Tab eventKey={2} title="Claims">
          <ClaimMaint
            controller = {this.props.controller}
            userType = {this.props.loginStatus}
          />
        </Tab>
        <Tab eventKey={3} title="Users">
          <UserMaint
            controller = {this.props.controller}
            userType = {this.props.loginStatus}
          />
        </Tab>
        <Tab eventKey={4} title="Access">
          <AccessMaint
            controller = {this.props.controller}
            userType = {this.props.loginStatus}
          />
        </Tab>
      </Tabs>
    );    
  }
});

module.exports = AdminPortal;
