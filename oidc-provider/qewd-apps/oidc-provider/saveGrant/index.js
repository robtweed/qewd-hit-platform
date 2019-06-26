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

  11 April 2019

*/

module.exports = function(messageObj, session, send, finished) {
  var grantsDoc = this.db.use(this.oidc.documentName, 'grants');
  grantsDoc.$([messageObj.params.grant]).setDocument(messageObj.params);

  // delete any expired grants

  var now = parseInt(Date.now() / 1000);
  grantsDoc.forEachChild(function(grant, node) {
    console.log('checking grant ' + grant);
    var expNode = node.$('expiry');
    if (!expNode.exists) {
      node.delete();
      return;
    }
    if (expNode.value < now) {
      console.log('deleting grant ' + grant);
      node.delete();
    }
  });

  finished({ok: true});
};
