/*

 ----------------------------------------------------------------------------
 | QEWD HIT Platform: Quick Single-Platform Installer                       |
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

  11 November 2019

*/

module.exports = function() {

  var fs = this.fs;
  var requestSync = this.requestSync;

  var oidc_params;
  var oidc_params_path = '/node/oidc-client/configuration/oidc.json';
  if (!fs.existsSync(oidc_params_path)) {
    console.log('Error: unable to find ' +  oidc_params_path);
    console.log('*** Unable to continue shutting down the QEWD Containers');
    return;
  }
  try {
    oidc_params = require(oidc_params_path);
  }
  catch(err) {
    console.log('Error: unable to load ' +  oidc_params_path);
    console.log(err);
    console.log('*** Unable to continue shutting down the QEWD Containers');
    return;
  }

  var client_id = 'qewd-monitor-ms';
  var client_secret = oidc_params.oidc_provider.clients['qewd-monitor-ms'].client_secret;
  var auth = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64');

  var oidc_provider = oidc_params.oidc_provider.host;
  var orchestrator = oidc_params.orchestrator.host;

  var options = {
    url: oidc_provider + '/openid/token',
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=client_credentials'
  };
  var result = this.requestSync.send(options);
  if (!result.content || result.content === '') {
    console.log('Error: No body returned by OpenId Connect Provider');
    console.log('*** Unable to continue shutting down the QEWD Containers');
    return;
  }

  console.log(result);

  try {
    var body = JSON.parse(result.content);
    access_token = body.access_token;
    options = {
      url: orchestrator + '/qewd/shutdown_all',
      headers: {
        Authorization: 'Bearer ' + access_token,
        'Content-type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        'x-authorization': auth
      },
      method: 'GET'
    };
    var response = this.requestSync.send(options);
    console.log(response);
    console.log('All QEWD Containers have been signalled to shut down');
  }
  catch(err) {
    console.log('Error: Unable to parse response from OpenId Connect Provider');
    console.log(err);
    console.log('*** Unable to continue shutting down the QEWD Containers');
    return;
  }

};
