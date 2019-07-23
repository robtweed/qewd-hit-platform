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

 01 October 2018

*/

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');

var UserTableRow = require('./UserTableRow');
var EditUser = require('./EditUser');

var {
  Button,
  Glyphicon,
  Modal,
  OverlayTrigger,
  Panel,
  Table,
  Tooltip
} = ReactBootstrap;

var UserMaint = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-UserMaint').call(this, this.props.controller);

      this.tooltip = (
        <Tooltip 
          id = "addUserBtn"
        >
          Add a new User
        </Tooltip>
      );

      this.backTooltip = (
        <Tooltip 
          id = "backBtn"
        >
          Go Back to Client Maintenance
        </Tooltip>
      );
  },
  
  componentWillReceiveProps: function(newProps) {
    console.log('will receive props: ' + JSON.stringify(newProps, null, 2));
  },

  render: function() {

    console.log('Rendering UserMaint');

    this.title = (
      <Panel.Title>
        <b>Users for Client: {this.props.client.client_id}</b>

        <OverlayTrigger 
          placement="top" 
          overlay={this.backTooltip}
        >
          <Button 
            bsClass="btn btn-success pull-right"
            onClick = {this.goBack}
          >
            <Glyphicon 
              glyph="arrow-up"
            />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger 
          placement="top" 
          overlay={this.tooltip}
        >
          <Button 
            bsClass="btn btn-success pull-right"
            onClick = {this.addUser}
          >
            <Glyphicon 
              glyph="plus"
            />
          </Button>
        </OverlayTrigger>
      </Panel.Title>
    );

    if (this.users.length === 0) {
      console.log('Empty User array');

      return (
        <span>
          <div
            className = {this.show.table}
          >
            <Panel
              bsStyle="info"
            >
              <Panel.Heading>
                {this.title}
              </Panel.Heading>
              <Panel.Body>
                No Users Defined Yet
              </Panel.Body>
            </Panel>
          </div>

          <EditUser
            controller = {this.props.controller}
            show = {this.show.editUser}
            data = {this.user}
            client = {this.props.client.client_id}
            conductor = {this.conductor}
            title = {this.editUserTitle}
          />
        </span>

      );
    }

    var rows = [];
    var row;

    var _this = this;
    this.users.forEach(function(user) {
      row = (
        <UserTableRow
          key = {user.id}
          client = {_this.props.client.client_id}
          data = {user}
          controller={_this.controller}
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
              {this.title}
            </Panel.Heading>
            <Panel.Body>
              <Table 
                responsive  
                className = "userTable"
              >
                <thead>
                  <tr>
                    <th>Email</th>
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

        <EditUser
          controller = {this.props.controller}
          show = {this.show.editUser}
          data = {this.user}
          client = {this.props.client.client_id}
          conductor = {this.conductor}
          title = {this.editUserTitle}
        />
      </span>

    );
  }
});

module.exports = UserMaint;
