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

  var email = query.email;
  if (typeof email === 'undefined' || email === '') {
    return finished({error: 'Missing or invalid email address'});
  }

  var client = query.client;
  if (typeof client === 'undefined' || client === '') {
    return finished({error: 'Missing or invalid client'});
  }

  var usersDoc = this.db.use(this.oidc.documentName, 'Users', client);
  var userIndex = usersDoc.$(['by_email', email]);
  if (!userIndex.exists) {
    return finished({error: 'User with email address ' + email + ' not found'});
  }
  var id = userIndex.value;
  usersDoc.$(['by_id', id]).delete();

  return finished({
    ok: true
  });

};
