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

  this.onNewProps = function(newProps) {
    //console.log('MasterProcessDetails newProps: ' + JSON.stringify(newProps));
  };

  this.stopMasterProcess = function() {
    controller.send({type: 'stopMasterProcess'});
  };

  this.pid = '';
  this.started = '';
  this.upTime = '';
  this.master = {
    memory: {
      rss: 'Not available',
      heapTotal: 'Not available',
      heapUsed: 'Not available'
    }
  };

  controller.on('startTimers', function() {
    if (!controller.timers.masterProcess) {
      controller.timers.masterProcess = setInterval(function() {
        controller.send({type: 'getMasterProcessDetails'});
      },30000);
    }
  });

  controller.on('getMasterProcessDetails', function(messageObj) {
    self.pid = messageObj.message.pid;
    self.started = messageObj.message.startTime;
    self.upTime = messageObj.message.upTime;
    self.master.memory = messageObj.message.memory;

    controller.emit('startTimers');

    if (!controller.timers.masterProcess) {
      controller.timers.masterProcess = setInterval(function() {
        controller.send({type: 'getMasterProcessDetails'});
      },30000);
    }

    self.setState({
      status: 'dataAvailable'
    });
  });

  controller.send({type: 'getMasterProcessDetails'});

  return controller;
};
