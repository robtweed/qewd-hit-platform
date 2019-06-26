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

  10 April 2019

*/


module.exports = function(args, finished) {

  var usersDoc;
  var users;
  var user;
  var client_id = args.req.query.client_id;

  if (client_id) {
    var clientsDoc = this.db.use(this.oidc.documentName, 'Clients', 'by_client_id', client_id);
    if (!clientsDoc.exists) {
      return finished({error: ' No such Client: ' + client_id}); 
    }
    users = [];
    usersDoc = this.db.use(this.oidc.documentName, 'Users', client_id, 'by_id');
    usersDoc.forEachChild(function(id, node) {
      user = node.getDocument(true);
      delete user.password;
      delete user.createdBy;
      delete user.updatedBy;
      delete user.verified;
      users.push(user);
    });
    return finished(users);
  }
  users = {};
  usersDoc = this.db.use(this.oidc.documentName, 'Users');
  usersDoc.forEachChild(function(client_id, clientNode) {
    users[client_id] = [];
    clientNode.$('by_id').forEachChild(function(id, node) {
      user = node.getDocument(true);
      delete user.password;
      delete user.createdBy;
      delete user.updatedBy;
      delete user.verified;
      users[client_id].push(user);
    });
  });
  finished(users);
};
