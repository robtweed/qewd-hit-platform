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

var claimsByScope = require('../../qewd-apps/oidc-provider/claimsByScope.json');

module.exports = function(query, finished) {

  var name = query.name;
  if (typeof name === 'undefined' || name === '') {
    return finished({error: 'Missing or invalid Claim Name'});
  }

  if (claimsByScope[name]) {
    return finished({error: 'Standard claims cannot be deleted'});
  }

  var oidcDoc = this.db.use(this.oidc.documentName);
  var claimDoc = oidcDoc.$(['Claims', name]);
  if (!claimDoc.exists) {
    return finished({error: 'Claim not found with name ' + name});
  }

  claimDoc.delete();
  oidcDoc.$(['Custom_Claims', name]).delete();

  return finished({
    ok: true
  });

};
