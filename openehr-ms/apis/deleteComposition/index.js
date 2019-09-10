/*

 ----------------------------------------------------------------------------
 | openehr-ms: OpenEHR Interface QEWD-Up MicroService                       |
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

  10 September 2019

  DELETE /openehr/composition/:uid

*/

var startSession = require('../../utils/startSession');
var deleteComposition = require('../../interfaces/deleteComposition');

module.exports = function(args, finished) {

  // for safety, only compositions that are cached in the user's session
  //  can be deleted.  These get there originally via the 
  //  getCompositionsData handler

  var _this = this;
  var uid = args.uid;

  var mappedUid = args.req.qewdSession.data.$(['openEHR', 'sourceIdMap', uid]);
  if (mappedUid.exists) {
    uid = mappedUid.value;
  }

  var cachedCompositions = args.req.qewdSession.data.$(['openEHR', 'compositions']);
  var cachedComposition = cachedCompositions.$(['by_uid', uid]);
  if (!cachedComposition.exists) {
    return finished({error: 'You do not have access to a Composition with uid ' + uid});
  }

  startSession.call(this, args, function(response) {

    if (response.error) {
      return callback(response);
    }

    deleteComposition.call(_this, uid, response.sessionId, function(responseObj) {
      console.log('*** apis/deleteComposition response: ' + JSON.stringify(responseObj, null, 2));

      // remove from cache
      var ehrId = cachedComposition.$('ehrId').value;
      cachedCompositions.$(['by_ehrId', ehrId, uid]).delete();
      cachedCompositions.$(['by_heading', ehrId, uid]).delete();
      cachedComposition.delete();

      finished(responseObj);
    });
  });

};
