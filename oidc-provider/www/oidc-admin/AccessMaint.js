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

var AccessTableRow = require('./AccessTableRow');
var EditAccess = require('./EditAccess');

var {
  Button,
  Glyphicon,
  Modal,
  OverlayTrigger,
  Panel,
  Table,
  Tooltip
} = ReactBootstrap;

var AccessMaint = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-AccessMaint').call(this, this.props.controller);

      this.tooltip = (
        <Tooltip 
          id = "addUserBtn"
        >
          Add a new person who can maintain users via this service
        </Tooltip>
      );

      this.title = (
        <span>
          <b>People with Access to This Service</b>

          <OverlayTrigger 
            placement="top" 
            overlay={this.tooltip}
          >
            <Button 
              bsClass="btn btn-success pull-right"
              onClick = {this.addAccess}
            >
              <Glyphicon 
                glyph="plus"
              />
            </Button>
          </OverlayTrigger>
        </span>
      );

  },
  
  componentWillReceiveProps: function(newProps) {
  },

  render: function() {

    console.log('Rendering AccessMaint');

    if (this.maintainers.length === 0) {
      console.log('Empty Access array');

      return (
        <span>
          <div
            className = {this.show.table}
          >
            <Panel
              bsStyle="info"
            >
              <Panel.Heading>
    	         <Panel.Title>
                  {this.title}
        	  </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                No Users Set up to access this service yet
              </Panel.Body>
            </Panel>
          </div>

          <EditAccess
            controller = {this.props.controller}
            show = {this.show.editAccess}
            data = {this.access}
            conductor = {this.conductor}
            title = {this.editAccessTitle}
          />
        </span>

      );
    }

    var rows = [];
    var row;

    var self = this;
    this.maintainers.forEach(function(user) {
      row = (
        <AccessTableRow
          key = {user.id}
          data = {user}
          controller={self.controller}
        />
      );
      rows.push(row);
    });    

    return (
      <span>

        <Modal
          container = {document.body}
          show = {this.show.confirm}
        >
          <Modal.Header>
            <Modal.Title>Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You are about to delete this User ({this.userToDelete.email}) 
            Are you sure you want to do this?
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick = {this.cancelDelete}
            >
              No - Cancel
            </Button>
            <Button
              bsStyle="danger"
              onClick = {this.confirmDelete}
            >
              Yes - Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <div
          className = {this.show.table}
        >
          <Panel
            bsStyle="info"
          > 
            <Panel.Heading>
              <Panel.Title>
                {this.title}
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <Table 
                responsive  
                className = "accessTable"
              >
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Mobile Tel No</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </Table>
            </Panel.Body>
          </Panel>
        </div>

        <EditAccess
          controller = {this.props.controller}
          show = {this.show.editAccess}
          data = {this.access}
          conductor = {this.conductor}
          title = {this.editAccessTitle}
        />
      </span>

    );
  }
});

module.exports = AccessMaint;
