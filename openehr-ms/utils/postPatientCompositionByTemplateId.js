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
var postPatientCompositionByTemplateId = require('../interfaces/postPatientCompositionByTemplateId');

module.exports = function(nhsNumber, templateId, flatJson, args, callback) {
  var _this = this;
  getEhrId.call(this, nhsNumber, args, function(response) {
    if (response.error) {
      callback(response);
    }
    else {
      var ehrId = response.ehrId;
      var sessionId = response.sessionId;
      postPatientCompositionByTemplateId.call(_this, ehrId, templateId, flatJson, sessionId, function(response) {
        if (response.error) {
          callback({
            error: response.error,
            sessionId: sessionId,
            ehrId: ehrId
          });
        }
        else {

          // delete cache
          var cachedCompositions = args.req.qewdSession.data.$(['openEHR', 'compositions']);
          var cachedCompositionsForEhrId = cachedCompositions.$(['by_ehrId', ehrId]);
          cachedCompositionsForEhrId.forEachChild(function(uid) {
            var cachedComposition = cachedCompositions.$(['by_uid', uid]);
            var heading = cachedComposition.$('heading').value;
            cachedCompositions.$(['by_heading', heading, ehrId, uid]).delete();
            cachedComposition.delete();
          });

          cachedCompositionsForEhrId.delete();

          callback({
            response: response,
            sessionId: sessionId,
            ehrId: ehrId
          });
        }
      });
    }
  });
};