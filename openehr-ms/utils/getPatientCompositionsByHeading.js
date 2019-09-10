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

*/

var getEhrId = require('./getEhrId');
var getPatientCompositionsByTemplateId = require('../interfaces/getPatientCompositionsByTemplateId');

function cacheCompositions(ehrId, heading, uidArr, cachedCompositions) {
  var cachedHeading = cachedCompositions.$(['by_heading', heading, ehrId]);
  uidArr.forEach(function(uid) {
    cachedCompositions.$(['by_ehrId', ehrId, uid]).value = '';
    var cachedComposition = cachedCompositions.$(['by_uid', uid]);
    cachedComposition.$('ehrId').value = ehrId;
    cachedComposition.$('heading').value = heading;
    cachedHeading.$(uid).value = '';
  });
}

function getCachedHeadingUids(cachedHeadings) {
  var arr = [];
  cachedHeadings.forEachChild(function(uid) {
    arr.push(uid);
  });
  return arr;
}

module.exports = function(nhsNumber, heading, args, callback) {
  var _this = this;
  getEhrId.call(this, nhsNumber, args, function(response) {
    if (response.error) {
      callback(response);
    }
    else {
      var ehrId = response.ehrId;
      var sessionId =response.sessionId;

      var cachedCompositions = args.req.qewdSession.data.$(['openEHR', 'compositions']);
      var cachedHeadings = cachedCompositions.$(['by_heading', heading, ehrId]);
      if (cachedHeadings.exists) {
        callback({
          uids: getCachedHeadingUids(cachedHeadings),
          sessionId: sessionId,
          ehrId: ehrId
        });
      }
      else {

        var templateId = _this.openehr.headings[heading].templateId;

        getPatientCompositionsByTemplateId.call(_this, ehrId, templateId, sessionId, function(response) {
          if (response.error) {
            return callback(response);
          }
          cacheCompositions(ehrId, heading, response.uids, cachedCompositions);
          callback({
            uids: response.uids,
            sessionId: sessionId,
            ehrId: ehrId
          });
        });
      }
    }
  });
};