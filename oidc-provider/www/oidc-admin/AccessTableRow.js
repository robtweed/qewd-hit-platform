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
  ButtonGroup,
  Glyphicon,
  OverlayTrigger,
  Tooltip
} = ReactBootstrap;

var AccessTableRow = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-AccessTableRow').call(this, this.props.controller);

    this.editTooltip = (
      <Tooltip 
        id = "editAccessBtn"
      >
        Edit the details of this person who can maintain users on this system
      </Tooltip>
    );

    this.deleteTooltip = (
      <Tooltip 
        id = "deleteAccessBtn"
      >
        Delete this person who can currently maintain users on this system
      </Tooltip>
    );

    this.sendEmailBtnTooltip = (
      <Tooltip 
        id = "sendEmailTTBtn"
      >
        This user has not yet been verified.  Click this button to send an email to the user
      </Tooltip>
    );

  },

  componentWillReceiveProps: function(newProps) {
    this.onNewProps(newProps);
  },

  render: function() {

    console.log('Rendering AccessTableRow');
    //var componentPath = this.controller.updateComponentPath(this);

    if (this.props.data.verified) {
      this.sendEmailBtnVisibility = 'hidden';
    }
    else {
      this.sendEmailBtnVisibility = 'btn btn-warning';
    }

    return (
      <tr>
        <td>
            {this.props.data.email}
        </td>
        <td>
            {this.props.data.name}
        </td>
        <td>
            {this.props.data.typeDesc}
        </td>
        <td>
            {this.props.data.mobileNo}
        </td>
        <td>
          <ButtonGroup
            bsClass="pull-right"
          >

            <OverlayTrigger 
              placement="top" 
              overlay={this.sendEmailBtnTooltip}
            >
              <Button 
                bsStyle="warning"
                bsClass = {this.sendEmailBtnVisibility}
                onClick = {this.sendEmail}
              >
                <Glyphicon 
                  glyph="warning-sign"
                />
              </Button>
            </OverlayTrigger>


            <OverlayTrigger 
              placement="top" 
              overlay={this.editTooltip}
            >
              <Button 
                bsStyle="info"
                onClick = {this.editAccess}
                bsSize="small"
              >
                <Glyphicon 
                  glyph="info-sign"
                />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger 
              placement="top" 
              overlay={this.deleteTooltip}
            >
              <Button 
                bsStyle="danger"
                onClick = {this.deleteAccess}
                bsSize="small"
              >
                <Glyphicon 
                  glyph="scissors"
                />
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
        </td>
      </tr>
    );
  }
});

module.exports = AccessTableRow;
