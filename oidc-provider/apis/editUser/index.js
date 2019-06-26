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

  var email = args.req.query.email;
  var sub = args.req.query.sub;
  if (!email && !sub) {
    return finished({error: 'Invalid request: you must specify either an email address or sub value'});
  }

  var usersDoc = this.db.use(this.oidc.documentName, 'Users', client_id);
  var id;

  if (email) {
    var byEmail = usersDoc.$(['by_email', email]);
    if (!byEmail.exists) {
      return finished({error: 'Email address ' + email + ' does not exist'});
    }
    id = byEmail.value;
  }

  if (sub) {
    var bySub = usersDoc.$(['by_sub', sub]);
    if (!bySub.exists) {
      return finished({error: 'No user with a sub value of ' + sub + ' was found'});
    }
    id = bySub.value;
  }

  var userDoc = usersDoc.$(['by_id', id]);
  var old_data = userDoc.getDocument(true);
  userDoc.delete();

  var now = new Date().toISOString();
  var password = data.password || 'password';
  var salt = bcrypt.genSaltSync(10);
  if (email) data.email = email;
  data.password = bcrypt.hashSync(password, salt);
  data.sub = old_data.sub;
  data.verified = old_data.verified;
  data.createdBy = old_data.createdBy;
  data.createdAt = old_data.createdAt;
  data.updatedBy = 1;
  data.updatedAt = now;
  userDoc.setDocument(data);

  finished({
    ok: true,
    sub: data.sub
  });
};
