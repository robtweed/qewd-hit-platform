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

  31 March 2019

*/

var startSession = require('./startSession');
var getEhrId = require('../interfaces/getEhrId');

module.exports = function(nhsNumber, args, callback) {

  var _this = this;

  startSession.call(this, args, function(response) {

    if (response.error) {
      return callback(response);
    }

    var sessionId = response.sessionId;

    var cachedEhrId = args.req.qewdSession.data.$(['openEHR', 'ehrIdByNHSNo', nhsNumber]);
    if (cachedEhrId.exists) {
      return callback({
        exists: true,
        ehrId: cachedEhrId.value,
        sessionId: sessionId
      });
    }

    getEhrId.call(_this, nhsNumber, response.sessionId, function(response) {
      if (response.error) {
        callback({
          exists: false,
          ehrId: '',
          error: response.error,
          sessionId: sessionId
        });
      }
      else {
        cachedEhrId.value = response.ehrId;
        callback({
          exists: true,
          ehrId: cachedEhrId.value,
          sessionId: sessionId
        });
      }
    });
  });

};
