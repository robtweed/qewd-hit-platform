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

  16 March 2019

*/

module.exports = function(messageObj, session, send, finished) {

  var orchestrator = this.oidc.orchestrator;
  var orchestratorHost = orchestrator.host + ':' + orchestrator.port;

  var clientsDoc = this.db.use(this.oidc.documentName, 'Clients');
  var clients = [];
  clientsDoc.$('by_id').forEachChild(function(id, node) {
    var client = node.getDocument(true);
    var post_logout_uri_path = client.post_logout_uri_path;
    clients.push({
      id: id,
      client_id: client.client_id,
      client_secret: client.client_secret,
      redirect_uri_path: client.redirect_uri_path,
      post_logout_uri_path: post_logout_uri_path,
      redirect_uri: orchestratorHost + client.redirect_uri_path,
      post_logout_redirect_uri: orchestratorHost + post_logout_uri_path,
    });
  });
  finished({
    clients: clients,
    conductor: orchestrator
  });
};
