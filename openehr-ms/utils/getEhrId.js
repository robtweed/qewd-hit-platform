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

var patientExists = require('./patientExists');
var registerPatient = require('../interfaces/registerPatient');

module.exports = function(nhsNumber, args, callback) {

  var _this = this;

  patientExists.call(this, nhsNumber, args, function(response) {
    if (response.error && typeof response.error !== 'string') {
      console.log('patientExists error: ' + JSON.stringify(response.error, null, 2))
      return callback(response);
    }
    var sessionId = response.sessionId;
    if (response.exists) {
      callback({
        ehrId: response.ehrId,
        sessionId: sessionId
      });
    }
    else {
      // register the patient
      registerPatient.call(_this, nhsNumber, sessionId, function(response) {
        if (!response.error) {
          args.req.qewdSession.data.$(['openEHR', 'ehrIdByNHSNo', nhsNumber]).value = response.ehrId;
          callback({
            ehrId: response.ehrId,
            sessionId: sessionId
          });
        }
        else {
          callback(response);
        }
      });
    }
  });

};
