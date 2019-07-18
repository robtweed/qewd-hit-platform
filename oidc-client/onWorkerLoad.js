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


  This module is loaded by QEWD-Up when a QEWD Worker starts

  It initialises the OpenId Connect (OIDC) Client which is used for accessing the OIDC Server/Provider
  It uses the "oidc-client" custom configuration details in the /configuration/oidc.json file

  The OIDC Client is added to QEWD's "this" object as this.oidc_client, so it
  becomes available to the handlers within the Authentication MicroService

*/

var fs = require('fs');
var jose = require('node-jose');
const Issuer = require('openid-client').Issuer;
var rootPath = '/opt/qewd/mapped/';
if (process.env.qewd_service_name) {
  rootPath = process.cwd() + '/' + process.env.qewd_service_name + '/';
}
if (process.env.mode && process.env.microservice) {
  rootPath = process.cwd() + '/' + process.env.microservice + '/';
}
var oidc_config = require(rootPath + 'configuration/oidc.json');

function configureClients(issuer, keystore) {
  var oidc_provider = oidc_config.oidc_provider;
  var client_id;
  var client_secret;
  this.oidc_client.clients = {};
  var result;

  if (!oidc_provider.clients) {
    client_id = oidc_provider.client_id;
    client_secret = oidc_provider.client_secret;
    result = configureClient(issuer, keystore, client_id, client_secret);
    this.oidc_client.client = result.client;
    this.oidc_client.getRedirectURL = result.getRedirectURL;
    this.oidc_client.clients[client_id] = {
      client: result.client,
      getRedirectURL: result.getRedirectURL
    };
  }
  else {
    for (client_id in oidc_provider.clients) {
      client_secret = oidc_provider.clients[client_id].client_secret;
      result = configureClient(issuer, keystore, client_id, client_secret);
      this.oidc_client.clients[client_id] = {
        client: result.client,
        getRedirectURL: result.getRedirectURL
      };
    }
  }
}

function configureClient(issuer, keystore, client_id, client_secret) {

  var oidc_provider = oidc_config.oidc_provider;
  var clientObj = {
    client_id: client_id,
    client_secret: client_secret,
    token_endpoint_auth_method: oidc_provider.token_endpoint_auth_method || 'client_secret_basic'
  };
  if (oidc_provider.token_endpoint_auth_method) {
    var alg = oidc_provider.token_endpoint_auth_signing_alg || 'RS512';
    clientObj.token_endpoint_auth_signing_alg = alg;
    clientObj.token_endpoint_auth_signing_alg_values_supported = oidc_provider.token_endpoint_auth_signing_alg_values_supported || [alg];
    clientObj.id_token_signed_response_alg = oidc_provider.id_token_signed_response_alg || alg;
  }

  var client = new issuer.Client(clientObj, keystore);
  var redirect_uri = oidc_config.orchestrator.host;
  console.log('client_id: ' + client_id);
  if (oidc_provider.clients && oidc_provider.clients[client_id]) {
    if (oidc_provider.clients[client_id].callback_url) {
      redirect_uri = redirect_uri + oidc_provider.clients[client_id].callback_url;
      console.log('1 redirect_uri = ' + redirect_uri);
    }
    else {
      redirect_uri = redirect_uri + '/auth/token/' + client_id;
      console.log('2 redirect_uri = ' + redirect_uri);
    }
  }
  else {
    if (oidc_config.orchestrator.urls && oidc_config.orchestrator.urls.callback_url) {
      redirect_uri = redirect_uri + oidc_config.orchestrator.urls.callback_url;
      console.log('3 redirect_uri = ' + redirect_uri);
    }
    else {
      redirect_uri = redirect_uri + '/auth/token/' + client_id;
      console.log('4 redirect_uri = ' + redirect_uri);
    }   
  }

  var getRedirectURL = function(scope) {
    scope = scope || oidc_provider.scope.login;
    var authorizeQuery = {
      redirect_uri: redirect_uri,
      scope: scope
    };
    if (oidc_provider.authorize_additional_query_string_values) {
      for (var name in oidc_provider.authorize_additional_query_string_values) {
        authorizeQuery[name] = oidc_provider.authorize_additional_query_string_values[name];
      }
    }
    return client.authorizationUrl(authorizeQuery);
  };
  return {
    client: client,
    getRedirectURL: getRedirectURL
  };
}

module.exports = function() {

  console.log('OIDC Client initialising in QEWD Worker Process ' + process.pid);

  this.oidc_client = oidc_config;
  var oidc_provider = oidc_config.oidc_provider;

  if (oidc_provider.defaultHttpOptions) {
    Issuer.defaultHttpOptions = oidc_provider.defaultHttpOptions;
  }

  //this.oidc_client.issuer = new Issuer({
  var issuer = new Issuer({
    issuer: oidc_provider.host + oidc_provider.urls.issuer,
    authorization_endpoint: oidc_provider.host + oidc_provider.urls.authorization_endpoint,
    token_endpoint: oidc_provider.host + oidc_provider.urls.token_endpoint,
    userinfo_endpoint: oidc_provider.host + oidc_provider.urls.userinfo_endpoint,
    introspection_endpoint: oidc_provider.host + oidc_provider.urls.introspection_endpoint,
    jwks_uri: oidc_provider.host + oidc_provider.urls.jwks_endpoint,
  });
  //var issuer = this.oidc_client.issuer;

  if (oidc_provider.token_endpoint_auth_method && oidc_provider.token_endpoint_auth_method === 'private_key_jwt') {
    var pem_file = oidc_provider.private_key_file_path;
    var pem_data = fs.readFileSync(pem_file);
    var keystore = jose.JWK.createKeyStore();
    var _this = this;
    this.oidc_client.isReady = false;
    keystore.add(pem_data, 'pem').
      then(function(result) {
        console.log(JSON.stringify(keystore.all(), null, 2));
        configureClients.call(_this, issuer, keystore);
        _this.oidc_client.isReady = true;
        _this.emit('oidc_client_ready');
    });
  }
  else {
    configureClients.call(this, issuer);
    this.oidc_client.isReady = true;
  }
};
