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

module.exports = function(messageObj, session, send, finished) {

  var id = messageObj.params.id;
  if (typeof id === 'undefined' || id === '') {
    return finished({error: 'Missing or invalid Claim Id'});
  }

  var claimsDoc = this.db.use(this.oidc.documentName, 'Claims');
  var claimDoc = claimsDoc.$(['by_id', id]);

  if (!claimDoc.exists) {
    return finished({error: 'Claim with id ' + id + ' not found'});
  }

  var name = claimDoc.$('name').value;
  claimDoc.delete();
  //claimsDoc.$(['by_name', name]).delete();

  return finished({
    ok: true
  });

};
