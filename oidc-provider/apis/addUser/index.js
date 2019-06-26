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

var bcrypt = require('bcrypt');
var uuid = require('uuid/v4');

module.exports = function(args, finished) {

  var client_id = args.client_id;

  var clientsDoc = this.db.use(this.oidc.documentName, 'Clients', 'by_client_id', client_id);
  if (!clientsDoc.exists) {
    return finished({error: ' No such Client: ' + client_id}); 
  }

  var data = args.req.body;
  if (!data) {
    return finished({error: 'Empty body!'}); 
  }

  var now = new Date().toISOString();
  var usersDoc = this.db.use(this.oidc.documentName, 'Users', client_id);
  var id = usersDoc.$('next_id').increment();
  var password = data.password || 'password';
  var salt = bcrypt.genSaltSync(10);
  data.password = bcrypt.hashSync(password, salt);
  data.sub = uuid();
  data.verified = true;
  data.createdBy = 1;
  data.createdAt = now;
  data.updatedBy = 1;
  data.updatedAt = now;
  usersDoc.$(['by_id', id]).setDocument(data);

  finished({
    ok: true,
    sub: data.sub
  });
};
