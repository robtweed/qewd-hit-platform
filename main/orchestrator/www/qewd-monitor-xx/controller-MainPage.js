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

  23 September 2018

*/

module.exports = function (controller) {

  var self = this;

  //controller.log = true;

  controller.toastr = function(type, text) {
    if (type && type !== '' && self.toastContainer && self.toastContainer[type]) {
      self.toastContainer[type](text);
    }
  };

  controller.displayError = function(error) {
    controller.toastr('error', error);
  };

  // display generic EWD.js errors using toastr:

  controller.on('error', function(messageObj) {
    var error = messageObj.message.error || messageObj.message;
    controller.displayError(error);
  });

  // publish the login response handler in this
  // component to force re-render of main page

  controller.on('login', function(messageObj) {
    if (!messageObj.message.error && messageObj.message.ok) {
      // logged in
      self.showLoginModal = false;
      self.setState({
        status: 'loggedIn'
      });
    }
  });

  controller.on('stopMasterProcess', function(messageObj) {
    console.log('Master Process was shut down');
  });

  controller.stopTimers = function() {
    for (var name in controller.timers) {
      clearInterval(controller.timers[name]);
    }
    delete controller.timers;
  };

  controller.on('socketDisconnected', function() {
    controller.toastr('warning', 'EWD Back-end has been shut down');
    //controller.emit('logout');
    controller.stopTimers();
  });

  controller.on('logout', function() {
    // stop all timers
    controller.stopTimers();
    // switch view to logout / shutdown
    controller.disconnectSocket();
    self.setState({
      status: 'shutdown'
    });
  });

  controller.on('overview', function() {
    self.setState({
        status: 'overview'
      });
  });

  controller.on('docstore', function() {
    self.setState({
        status: 'docstore'
      });
  });

  controller.on('sessions', function() {
    self.setState({
      status: 'sessions'
    });
  });

  controller.on('ewd-reregistered', function() {
    console.log('Re-registered - restart the timers');
    // back-end has come back - restart everything
    controller.timers = {};
    controller.emit('startTimers');
    controller.toastr('warning', 'EWD Back-end has been restarted');
  });

  controller.navOptionSelected = function(eventKey) {
    controller.emit(eventKey);
  };

  controller.timers = {};

  this.showLoginModal = true;

  return controller;
};