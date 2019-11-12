/*

 ----------------------------------------------------------------------------
 | oidc-client: OIDC Client QEWD-Up MicroService                            |
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

  8 November 2019

*/

var request = require('request');
var oidc = require('../../configuration/oidc.json');

module.exports = function(args, finished) {
  var auth = args.req.headers.authorization;
  var basicAuth = args.req.headers['x-authorization'];
  if (!auth) {
    return finished({error: 'Missing authorization header'});
  }
  if (!auth.startsWith('AccessToken ')) {
    return finished({error: 'Invalid authorization header'});
  }
  var access_token = auth.split('AccessToken ')[1];
  var client_id = 'qewd-monitor-ms';
  var client_secret = oidc.oidc_provider.clients[client_id].client_secret;
  var auth = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64');
  
  var options = {
    url: oidc.oidc_provider.host + '/openid/token/introspection',
    headers: {
      Authorization: auth
    },
    form: {
      token: access_token
    },
    strictSSL: false
  };

  request.post(options, function(error, response, body) {

    var results;
    try {
      results = JSON.parse(body);
    }
    catch(err) {
      results = {};
    }
    //console.log('results = ' + JSON.stringify(results, null, 2));
    if (results.active === true) {
      // OK the access token was valid, so we can now send shutdown
      // messages to all microservices
      finished({
        ok: true,
        authorization: basicAuth,
        oidc_provider: oidc.oidc_provider.host
      });
    }
    else {
      finished({error: 'Invalid request'});
    }
  });
};
