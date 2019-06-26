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

  13 March 2019

*/

module.exports = function(query, finished) {

  var users = [];
  var useEmail = this.oidc.useEmail;
  if (typeof useEmail === 'undefined') {
    useEmail = true;
  }
  var usersDoc = this.db.use(this.oidc.documentName, 'Users', query.client);
  usersDoc.$('by_id').forEachChild(function(id, node) {
    var record = {
      id: id,
      email: node.$('email').value,
      claims: node.$('claims').getDocument(),
      useEmail: useEmail
    };

    users.push(record);
  });

  finished({
    users: users
  });
};
