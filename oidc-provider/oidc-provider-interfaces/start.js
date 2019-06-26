/*

 ----------------------------------------------------------------------------
 | oidc-provider: OIDC Provider QEWD-Up MicroService                        |
 |                                                                          |
 | Copyright (c) 2019 M/Gateway Developments Ltd,                           |
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

  14 March 2019

*/

var load = require('./loader');
var keepAlive = require('./keepAlive');
//var loadInitialData = require('./loadInitialData');
var qewd_interface = require('./qewd_interface');
var oidc_config = require('/opt/qewd/mapped/configuration/oidc.json');

function start(app, bodyParser) {

  // create the Promise-based QEWD send() method version

  qewd_interface.call(this);

  this.oidc = oidc_config;

  var _this = this;

  // start the QEWD session for database interactions

  this.send_promise({
    type: 'ewd-register',
    application: 'oidc-provider'
  })
  .then (function(result) {
    _this.oidc.token = result.message.token;

    _this.send_promise({
      type: 'login',
      params: {
        password: _this.userDefined.config.managementPassword
      }
    }
  )
  .then (function(result) {
  
    // configure the OIDC Provider using the /configuration/data.json file
    //  unless already populated

    var msg = {type: 'configure'};
    _this.send_promise(msg)

  .then (function(result) {

    // fetch or generate the keystore & config params

    var msg = {type: 'getParams'};
    _this.send_promise(msg)

  .then (function(result) {

    // start up the OIDC Provider
    load.call(_this, app, bodyParser, result.message);

    // start timed keepalive messages to maintain session
            
    keepAlive.call(_this);
  });
  });
  });
  });
}

module.exports = start;
