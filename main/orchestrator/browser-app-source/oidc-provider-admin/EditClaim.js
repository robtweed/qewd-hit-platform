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

var {
  Button,
  Panel
} = ReactBootstrap;

var EditClaim = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-EditClaim').call(this, this.props.controller);

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

    console.log('rendering EditClaim');
    delete this.name;
    delete this.customClaims;

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
              fieldname='name'
              label='Claim Id/Name'
              type='text'
              readOnly = {this.props.data.exists}
              controller = {this.controller}
              focus={false}
              value = {this.props.data.name}
              formModule = 'EditClaim'
            />
            <FormField
              fieldname='stdClaims'
              label='Standard Claims'
              type='textarea'
              readOnly = {true}
              controller = {this.controller}
              focus={false}
              value = {this.props.data.std}
              height='100px'
            />

            <FormField
              fieldname='customClaims'
              label='Custom Claims (Enter as comma-delimited list)'
              type='textarea'
              controller = {this.controller}
              focus={true}
              value = {this.props.data.custom}
              formModule = 'EditClaim'
              height='100px'
            />

            <Button 
              bsClass="btn btn-success"
              onClick = {this.saveClaim}
            >
              Save
            </Button>

          </Panel.Body>
        </Panel>
      </div>
    );
  }
});

module.exports = EditClaim;
