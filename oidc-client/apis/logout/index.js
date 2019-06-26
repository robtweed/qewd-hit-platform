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

  15 March 2019

*/

var request = require('request');

module.exports = function(args, finished) {

  var client_id = args.req.query.client_id;
  var oidc_provider = this.oidc_client.oidc_provider;
  var orchestrator = this.oidc_client.orchestrator;
  var redirectUri = orchestrator.host + oidc_provider.clients[client_id].post_logout_redirect_uri;
  var endSessionEndpoint = oidc_provider.host + oidc_provider.urls.end_session_endpoint;

  var id_token = args.session.openid.id_token;

  if (oidc_provider.logout_approach === 'client') {

    var uri = endSessionEndpoint + '?id_token_hint=' + id_token;
    uri = uri + '&post_logout_redirect_uri=' + redirectUri;

    return finished({
      redirectURL: uri
    });
  }

  if (args.session.openid && args.session.openid.id_token) {

    var options = {
      url: endSessionEnpoint,
      method: 'GET',
      qs: {
        id_token_hint: id_token,
        //post_logout_redirect_uri: redirectUri
      },
      json: true
    };

    console.log('**** OpenId end session / logout: options - ' + JSON.stringify(options, null, 2));

    request(options, function(error, response, body) {
      console.log('*** logout - response = ' + JSON.stringify(response));

      finished({
        ok: true,
        redirectURL: redirectUri,
      });
    });
  }
  else {
    finished({
      ok: false
    });
  }
};
