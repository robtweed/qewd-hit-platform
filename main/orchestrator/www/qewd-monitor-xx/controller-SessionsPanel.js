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

module.exports = function (controller) {

  var self = this;

  this.refresh = function() {
    var message = {
      type: 'getSessions'
    };
    controller.send(message, function(responseObj) {
      self.sessions = responseObj.message;
      self.setState({status: 'gotSessions'});
    });
  };

  controller.on('stopSession', function(responseObj) {
    self.refresh();
  });

  controller.on('refreshSessionDisplay', function() {
    self.sessionData = {};
    self.refresh();
  });

  controller.on('showSession', function(responseObj) {

    if (responseObj.message.error) {
      // the selected session no longer exists, so refresh the session table
      self.sessionData = {};
      self.refresh();
    }
    else {
      self.sessionData = responseObj.message;
      self.setState({status: 'showSession'});
    }
  });

  this.onNewProps = function(newProps) {
  };

  this.sessions = [];
  this.sessionData = {};

  this.onToggle = function() {};
  this.expanded = true;

  return controller;
};
