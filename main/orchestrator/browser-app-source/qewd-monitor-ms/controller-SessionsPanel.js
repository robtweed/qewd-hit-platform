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

  this.serverName = controller.destination + ' QEWD Server';
  var _this = this;
  var sessionsById = {};

  this.refresh = function() {
    var message = {
      type: 'getSessions',
      qewd_destination: controller.destination,
      qewd_application: 'qewd-monitor'
    };
    controller.ms_send(message, function(responseObj) {
      _this.sessions = responseObj.message;
      sessionsById = {};
      responseObj.message.forEach(function(data) {
        sessionsById[data.id] = data.token;
      });
      _this.setState({status: 'gotSessions'});
    });
  };

  controller.on('stopSession', function(responseObj) {
    _this.refresh();
  });

  controller.on('refreshSessionDisplay', function() {
    _this.sessionData = {};
    _this.refresh();
  });

  controller.on('showSession', function(responseObj) {

    if (responseObj.message.error) {
      // the selected session no longer exists, so refresh the session table
      _this.sessionData = {};
      _this.refresh();
    }
    else {
      _this.sessionData = responseObj.message;
      // replace session token with actual one for remote microservice
      _this.sessionData.token = sessionsById[responseObj.message.id];
      console.log('_this.sessionData = ' + JSON.stringify(_this.sessionData, null, 2));
      _this.setState({status: 'showSession'});
    }
  });

  this.onNewProps = function(newProps) {
  };

  this.sessions = [];
  this.sessionData = {};

  this.onToggle = function() {};
  this.expanded = true;

  controller.ms_send({
    type: 'getServerName',
    qewd_destination: controller.destination,
    qewd_application: 'qewd-monitor'
  }, function(responseObj) {
    console.log('!! server name: ' + responseObj.message.serverName);
    if (responseObj.message.serverName && responseObj.message.serverName !== '') {
      _this.serverName = responseObj.message.serverName;
      _this.setState({
        status: 'updated'
      });
    }
  });

  return controller;
};
