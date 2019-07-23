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
    //console.log('OverviewPanel newProps: ' + JSON.stringify(newProps));
  };

  this.expanded = true;
  this.serverName = controller.destination + ' QEWD Server';

  controller.on('getServerName', function(responseObj) {
    if (responseObj.message.serverName && responseObj.message.serverName !== '') {
      self.serverName = responseObj.message.serverName;
      self.setState({
        status: 'updated'
      });
    }
  });

  controller.ms_send({
    type: 'getServerName',
    qewd_destination: controller.destination,
    qewd_application: 'qewd-monitor'
  });

  this.onToggle = function() {};

  return controller;
};
