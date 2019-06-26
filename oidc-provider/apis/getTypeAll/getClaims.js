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

  16 March 2019

*/

var claimsByScope = require('../../qewd-apps/oidc-provider/claimsByScope.json');

module.exports = function(finished) {

  var customClaimsDoc = this.db.use(this.oidc.documentName, 'Custom_Claims');

  var claims = {};
  var delim;
  for (var name in claimsByScope) {
    claims[name] = {
      type: 'standard',
      name: name,
      std: '',
      custom: ''
    }
    delim = '';
    claimsByScope[name].forEach(function(claim) {
     claims[name].std = claims[name].std + delim + claim;
     delim = ', ';
    });
  }

  delim = '';
  customClaimsDoc.forEachChild(function(name, claimNode) {
    if (!claims[name]) {
      claims[name] = {
        type: 'custom',
        name: name,
        std: '',
        custom: ''
      }
    }
    claimNode.forEachChild(function(index, node) {
     claims[name].custom = claims[name].custom + delim + node.value;
     delim = ', ';
    });
  });

  finished({
    claims: claims
  });
};
