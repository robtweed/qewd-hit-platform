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

  14 April 2019

*/

function getCookie(cookie, name) {
  var pieces = cookie.split(name + '=');
  if (!pieces[1]) return '';
  return pieces[1].split(';')[0];
}

module.exports = function(args, finished) {

  var validJWT;
  if (args.req.headers && args.req.headers.authorization) {
    var fin = function(obj) {
      // dummy function to allow us to validate the JWT without finishing
      //  the replacement function simply logs any JWT errors to the console / log
      console.log('JWT Authorization header error:');
      console.log(JSON.stringify(obj));
    };

    validJWT = this.jwt.handlers.validateRestRequest.call(this, args.req, fin, true, true);

    if (validJWT) {

      var session = args.session;
      if (args.req.headers.cookie) {
        var app = getCookie(args.req.headers.cookie, 'qewd-application');
        if (app !== '') {
          session.application = app;
        }
      }

      return finished({
        authenticated: true
      });
    }
  }

  // either no JWT authorisation header was present at all,
  //  or the JWT was invalid or expired, so tell PulseTile to redirect to OIDC server

  var getRedirectURL;
  var scope;
  var client_id;
  if (args.req.query) {
    scope = args.req.query.scope;
    client_id = args.req.query.client_id;
  }

  console.log('client_id = ' + client_id);
  console.log('this.oidc_client = ' + JSON.stringify(this.oidc_client, null, 2));

  if (client_id) {
    if (!this.oidc_client.clients || !this.oidc_client.clients[client_id]) {
      return finished({error: 'No such OIDC Client defined on OIDC Client Microservice: ' + client_id});
    }
    getRedirectURL = this.oidc_client.clients[client_id].getRedirectURL;
  }
  else {
    getRedirectURL = this.oidc_client.getRedirectURL;
  }

  if (!getRedirectURL) {
    return finished({error: 'Unable to redirect, probably because no client_id was defined in the request'});
  }

  args.session.authenticated = false;
  if (!this.oidc_client.isReady) {
    var _this = this;
    this.on('oidc_client_ready', function() {
      finished({
        redirectURL: getRedirectURL(scope)
      });
    });
  }
  else {
    finished({
      redirectURL: getRedirectURL(scope)
    });
  }
};
