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

  4 April 2019

*/

var getEhrId = require('./getEhrId');
var getPatientCompositionsByTemplateId = require('../interfaces/getPatientCompositionsByTemplateId');

function getUidArray(cachedPatientCompositions) {
  var arr = [];
  cachedPatientCompositions.forEachChild(function(uid) {
    arr.push(uid);
  });
  return arr;
}

function setUidArray(ehrId, uidArr, cachedCompositions) {
  uidArr.forEach(function(uid) {
    cachedCompositions.$(['by_ehrId', ehrId, uid]).value = '';
    cachedCompositions.$(['by_uid', uid, 'ehrId']).value = ehrId;
  });
}

module.exports = function(nhsNumber, templateId, args, callback) {
  var _this = this;
  getEhrId.call(this, nhsNumber, args, function(response) {
    if (response.error) {
      callback(response);
    }
    else {
      var ehrId = response.ehrId;
      var sessionId =response.sessionId;

      var cachedCompositions = args.req.qewdSession.data.$(['openEHR', 'compositions']);
      var cachedPatientCompositions = cachedCompositions.$(['by_ehrId', ehrId]);
      if (cachedPatientCompositions.exists) {
        callback({
          //uids: cachedPatientCompositions.getDocument(true),
          uids: getUidArray(cachedPatientCompositions),
          sessionId: sessionId,
          ehrId: ehrId
        });
      }
      else {
        getPatientCompositionsByTemplateId.call(_this, ehrId, templateId, sessionId, function(response) {
          if (response.error) {
            return callback(response);
          }
          setUidArray(ehrId, response.uids, cachedCompositions);
          //cachedPatientCompositions.setDocument(response.uids)
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