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

var ClaimTableRow = require('./ClaimTableRow');
var EditClaim = require('./EditClaim');

var {
  Button,
  Glyphicon,
  Modal,
  OverlayTrigger,
  Panel,
  Table,
  Tooltip
} = ReactBootstrap;

var ClaimMaint = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-ClaimMaint').call(this, this.props.controller);

      this.tooltip = (
        <Tooltip 
          id = "addClaimBtn"
        >
          Add a new Claim
        </Tooltip>
      );

      this.title = (
        <span>
          <b>Claims</b>

          <OverlayTrigger 
            placement="top" 
            overlay={this.tooltip}
          >
            <Button 
              bsClass="btn btn-success pull-right"
              onClick = {this.addClaim}
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

    console.log('Rendering ClaimMaint');

    if (this.claims.length === 0) {
      console.log('Empty claims array');

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
                No Claims Defined Yet
              </Panel.Body>
            </Panel>
          </div>

          <EditClaim
            controller = {this.props.controller}
            show = {this.show.editClaim}
            data = {this.claim}
            conductor = {this.conductor}
            title = {this.editClaimTitle}
          />
        </span>

      );
    }

    var rows = [];
    var row;

    var self = this;
    this.claims.forEach(function(claim) {
      row = (
        <ClaimTableRow
          key = {claim.id}
          data = {claim}
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
            You are about to delete this Claim ({this.claimToDelete.name}) 
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
                className = "claimTable"
              >
                <thead>
                  <tr>
                    <th>Claim Id/Name</th>
                    <th>Field Names</th>
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

        <EditClaim
          controller = {this.props.controller}
          show = {this.show.editClaim}
          data = {this.claim}
          conductor = {this.conductor}
          title = {this.editClaimTitle}
        />
      </span>

    );
  }
});

module.exports = ClaimMaint;
