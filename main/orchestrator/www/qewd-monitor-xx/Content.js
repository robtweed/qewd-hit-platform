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

var OverviewContainer = require('./OverviewContainer');
var DocumentStoreContainer = require('./DocumentStoreContainer');
var SessionsContainer = require('./SessionsContainer');

var Content = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-Content').call(this, this.props.controller);
  },

  componentWillReceiveProps: function(newProps) {
    this.onNewProps(newProps);
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

    if (this.status === 'initial') {
      return (
        <div></div>
      );
    }
    else {
      return (
        <div>
          <OverviewContainer
            controller = {this.controller}
            status = {this.status} 
          /> 
          <DocumentStoreContainer
            controller = {this.controller}
            status = {this.status} 
          />
          <SessionsContainer
            controller = {this.controller}
            status = {this.status} 
          />
        </div>
      );
    }
  }
});

module.exports = Content;
