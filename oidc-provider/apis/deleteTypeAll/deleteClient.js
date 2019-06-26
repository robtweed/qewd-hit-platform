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

module.exports = function(query, finished) {

  var id = query.id;
  if (typeof id === 'undefined' || id === '') {
    return finished({error: 'Missing or invalid Client Id'});
  }

  var clientDoc = this.db.use(this.oidc.documentName, 'Clients', 'by_id', id);
  if (!clientDoc.exists) {
    return finished({error: 'Client with id ' + id + ' not found'});
  }

  var client_id = clientDoc.$('client_id').value;
  var usersDoc = this.db.use(this.oidc.documentName, 'Users', client_id, 'by_id');
  if (usersDoc.exists) {
    return finished({error: 'Users exist for this client, so it cannot be deleted'});
  }

  clientDoc.delete();

  return finished({
    ok: true
  });

};
