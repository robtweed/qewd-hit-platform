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

  30 April 2019

*/

var claimsByScope = require('../../qewd-apps/oidc-provider/claimsByScope.json');

module.exports = function(data, finished) {

  var name = data.name;
  if (!name || name === '') {
    return finished({error: 'Missing or empty Claim name'});
  }

  var oidcDoc = this.db.use(this.oidc.documentName);
  var claimDoc = oidcDoc.$(['Claims', name]);

  var customList = data.custom;
  // replace any new lines with commas (empty values will be ignored later)
  // remove any extra spaces
  customList = customList.replace(/ {1,}/g," ");
  customList = customList.split('\r\n').join(',');
  customList = customList.split('\n').join(',');
  customList = customList.split(', ').join(',');

  console.log('Tidied customList: ' + customList);
  if (!claimDoc.exists) {
    // must be new custom claim, so custom list must be defined
    if (!customList || customList === '') {
      return finished({error: 'No claim fields were defined'});
    }
  }

  // first reset claim to just standard ones (if applicable) 

  claimDoc.delete();
  if (claimsByScope[name]) {
    claimDoc.setDocument(claimsByScope[name]);
  }

  // save any custom claims to own record

  var customClaimsDoc = oidcDoc.$(['Custom_Claims', name]);
  customClaimsDoc.delete();
  var claimsArr;
  if (customList && customList !=="") {
    claimsArr = customList.split(',').filter(Boolean);
    customClaimsDoc.setDocument(claimsArr);
  }
  console.log('claimsArr = ' + JSON.stringify(claimsArr));

  // now append any custom claims to the claims document for this name

  if (claimsArr) {
    var index = -1;
    if (claimDoc.exists) {
      index = claimDoc.lastChild.name;
    }
    claimsArr.forEach(function(claim) {
      if (claim !== '') {
        index++;
        claimDoc.$(index).value = claim;
      }
    });
  }

  return finished({
    ok: true
  });

};
