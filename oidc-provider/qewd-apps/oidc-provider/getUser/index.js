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

  12 April 2019

*/

module.exports = function(messageObj, session, send, finished) {

  var email;
  if (messageObj.params) email = messageObj.params.id;
  if (!email || email === '') {
    return finished({error: 'Missing or empty id'});
  }
  var client_id = messageObj.params.client_id;
  if (!client_id || client_id == '') {
    return finished({error: 'Missing or empty client_id'});
  }

  var usersDoc = this.db.use(this.oidc.documentName, 'Users', client_id);
  var emailIndex = usersDoc.$(['by_email', email]);
  if (!emailIndex.exists) {
    return finished({error: 'No such user'});
  }
  var id = emailIndex.value;
  var userDoc = usersDoc.$(['by_id', id]);

  if (userDoc.exists) {
    var data = {
      sub: id,
    }; 
    var scope = messageObj.params.scope;
    var scopes = scope.split(' ');
    var claimsDoc = this.db.use(this.oidc.documentName, 'Claims');
    var userClaimsDoc = userDoc.$('claims');

    scopes.forEach(function(scope) {
      claimsDoc.$(scope).forEachChild(function(index, node) {
        var claim = node.value;
        if (claim === 'email') {
          data[claim] = email;
        }
        else {
          var value = userClaimsDoc.$(claim).value;
          if (value !== '') {
            data[claim] = value;
          }
        }
      });
    });

    finished(data);
  }
  else {
    finished({error: 'No such User'});
  }
};
