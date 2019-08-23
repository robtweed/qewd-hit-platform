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

  22 August 2019

  PUT /openehr/composition/:uid

*/

var putComposition = require('../../utils/putComposition');

module.exports = function(args, finished) {

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

  var _this = this;

  if (!args.req.body) {
    return finished({error: 'Missing data'});
  }

  args.req.body.now = new Date().toISOString();
  args.req.body.composer = args.session.firstName + ' ' + args.session.lastName;

  putComposition.call(this, uid, args, function(response) {
    if (response.error) {
      return finished({error: response.error});
    }

    return finished(response.response);
  });

};
