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

  11 June 2019

*/

// Handler for OIDC Callback URL: /auth/token

var jwt = require('jwt-simple');
var uuid = require('uuid/v4');

var errorCallback;
var extract_idToken_fields;
var try_loading = true;

process.on('unhandledRejection', function(reason, p){
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging here
  errorCallback({error: reason});
});

function getCookie(cookie, name) {
  var pieces = cookie.split(name + '=');
  if (!pieces[1]) return '';
  return pieces[1].split(';')[0];
}

module.exports = function(args, finished) {

  console.log('oidc_callback handler args: ' + JSON.stringify(args, null, 2));

  errorCallback = finished;

  if (args.req.query.error) {
    var error = args.req.query.error;
    if (args.req.query.error_description) {
      error = error + ': ' + args.req.query.error_description;
    }
    return finished({error: error});
  }

  var client_id = args.client_id;
  var orchestrator = this.oidc_client.orchestrator;

  var indexUrl = '/index.html';
  var callbackURL = '/api/auth/token';

  //console.log('&&& this.oidc_client = ' + JSON.stringify(this.oidc_client, null, 2));

  var clients = this.oidc_client.oidc_provider.clients;

  if (clients && clients[client_id]) {
    if (clients[client_id].callback_url) {
      callbackURL = clients[client_id].callback_url;
    }
    else {
      callbackURL = callbackURL + '/' + client_id;
    }
    if (clients[client_id].index_url) {
      indexUrl = clients[client_id].index_url;
    }
  }

  callbackURL = orchestrator.host + callbackURL;

  var setCookie = orchestrator.set_cookie;
  var cookiePath;
  var cookieName;
  if (setCookie) {
    if (setCookie.path) {
      cookiePath = setCookie.path;
    }
    if (setCookie.name) {
      cookieName = setCookie.name;
    }
  }
  if (!cookiePath) {
    var pieces = indexUrl.split('/');
    pieces.pop();
    cookiePath = pieces.join('/');
    if (cookiePath === '') cookiePath = '/';
  }
  if (!cookieName) {
    cookieName = 'JSESSIONID';
  }

  if (this.oidc_client.extract_idToken_fields && try_loading) {
    try {
      extract_idToken_fields = require(this.oidc_client.extract_idToken_fields);
    }
    catch(err) {
      return finished({error: 'Unable to load idToken field extraction module from ' + this.oidc_client.extract_idToken_fields});
    }
    try_loading = false;
  }

  var client;
  if (this.oidc_client.client) {
    client = this.oidc_client.client;
  }
  if (this.oidc_client.clients && this.oidc_client.clients[client_id]) {
    client = this.oidc_client.clients[client_id].client;
  }

  console.log('callbackURL = ' + callbackURL);
  console.log('args.req.query = ' + JSON.stringify(args.req.query, null, 2));

  client.authorizationCallback(callbackURL, args.req.query)
    .then(function (tokenSet) {

      console.log('\nTokenSet: ' + JSON.stringify(tokenSet));

      var session = args.session;
      if (args.req.headers.cookie) {
        var app = getCookie(args.req.headers.cookie, 'qewd-application');
        if (app !== '') {
          session.application = app;
        }
      }
      session.authenticated = true;
      session.isAuthenticated = true;
      var verify_jwt = jwt.decode(tokenSet.id_token, null, true);

      // custom IdToken field extraction and normalisation into JWT:

      if (extract_idToken_fields) {
        var status = extract_idToken_fields(verify_jwt, session);
        if (status.error) {
          return finished(status);
        }
      }

      if (tokenSet.refresh_expires_in) {
        session.timeout = tokenSet.refresh_expires_in;
      }
      else {
        session.timeout = verify_jwt.exp - verify_jwt.iat;
      }
      session.uid = tokenSet.session_state || uuid();
      session.openid = verify_jwt;
      session.openid.id_token = tokenSet.id_token;

      finished({
        ok: true,
        oidc_redirect: indexUrl,
        cookiePath: cookiePath,
        cookieName: cookieName
      });
  });
};
