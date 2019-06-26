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

var {
  Button,
  Glyphicon,
  OverlayTrigger,
  Panel,
  Tooltip
} = ReactBootstrap;

var DocumentStorePanel = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-DocumentStorePanel').call(this, this.props.controller);

    this.tooltip = (
      <Tooltip
        id = "DocumentRefreshBtn"
      >
        Refresh
      </Tooltip>
    );

    this.title = (
      <span>
        <b>Documents</b>
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

  componentDidUpdate: function() {

    //console.log('status: ' + this.state.status);
    var that = this;

    setTimeout(function() {
      $('.json-inspector__leaf').each(function(ix, item) {
        var id = $(item).attr('id');
        var name = id.split('root.')[1];
        if (!name) {
          $(item).find('span.json-inspector__key').first().hide();
          $(item).find('span.json-inspector__value').first().hide();
        }
        else if (name.indexOf('.') === -1 && that.data[name]) {
          $(item).find('span.json-inspector__key').first().addClass('json-inspector__docName');
        }
      });
    }, 100);
  },
  
  componentWillReceiveProps: function(newProps) {
    this.onNewProps(newProps);
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

    if (!this.data) {
      return (
        <div></div>
      );
    }

    // create a clone of data to ensure re-rendering
    var newData = {};
    Object.assign(newData, this.data);
   
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
          <Inspector 
            data={newData}
            isExpanded = {this.isExpanded}
            onClick={this.nodeClicked}
            search={false}
          />
        </Panel.Body>
      </Panel>
    );
  }
});

module.exports = DocumentStorePanel;
