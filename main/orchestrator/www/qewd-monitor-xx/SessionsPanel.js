/*

 ------------------------------------------------------------------------------------
 | qewd-monitor: React.js-based Monitor/Management Application for QEWD             |
 |                                                                                  |
 | Copyright (c) 2017-18 M/Gateway Developments Ltd,                                |
 | Redhill, Surrey UK.                                                              |
 | All rights reserved.                                                             |
 |                                                                                  |
 | http://www.mgateway.com                                                          |
 | Email: rtweed@mgateway.com                                                       |
 |                                                                                  |
 |                                                                                  |
 | Licensed under the Apache License, Version 2.0 (the "License");                  |
 | you may not use this file except in compliance with the License.                 |
 | You may obtain a copy of the License at                                          |
 |                                                                                  |
 |     http://www.apache.org/licenses/LICENSE-2.0                                   |
 |                                                                                  |
 | Unless required by applicable law or agreed to in writing, software              |
 | distributed under the License is distributed on an "AS IS" BASIS,                |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.         |
 | See the License for the specific language governing permissions and              |
 |  limitations under the License.                                                  |
 ------------------------------------------------------------------------------------

  24 September 2018

*/

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');
var Inspector = require('react-json-inspector');
var SessionTable = require('./SessionTable');
var SessionDetails = require('./SessionDetails');

var {
  Button,
  Col,
  Glyphicon,
  Grid,
  OverlayTrigger,
  Panel,
  Row,
  Tooltip
} = ReactBootstrap;

var SessionsPanel = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-SessionsPanel').call(this, this.props.controller);

    this.tooltip = (
      <Tooltip 
        id = "SessionsRefreshBtn"
      >
        Refresh
      </Tooltip>
    );

    this.title = (
      <span>
        <b>Sessions</b>
        <OverlayTrigger 
          placement="top" 
            overlay={this.tooltip}
                >
          <Button 
            bsClass="btn btn-success pull-right"
            onClick = {this.refresh}
          >
            <Glyphicon 
              glyph="refresh"
            />
          </Button>
        </OverlayTrigger>
      </span>
    );
  },

  componentDidMount: function() {
    // fetch current session list
    this.refresh();
  },
  
  componentWillReceiveProps: function(newProps) {
    this.onNewProps(newProps);
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

   //console.log('rendering SessionsPanel: ' + JSON.stringify(this.sessionData));

    return (
      <Panel
        bsStyle="primary"
      >

        <Panel.Heading>
          <Panel.Title>
            {this.title}
          </Panel.Title>
        </Panel.Heading>

          <Panel.Body>

            <Grid
              fluid = {true}
            >
              <Row>
                <Col md={5}>
                  <SessionTable
                    controller = {this.controller}
                    sessions = {this.sessions}
                  />
                </Col>
                <Col md={7}>
                  <SessionDetails
                    controller = {this.controller}
                    data = {this.sessionData}
                  />
                </Col>
              </Row>
            </Grid>
          </Panel.Body>

      </Panel>
    );
  }
});

module.exports = SessionsPanel;
