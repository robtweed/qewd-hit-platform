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

var request = require('request');

module.exports = function(nhsNumber, sessionId, callback) {

  var options = {
    url: this.openehr.host + '/rest/v1/ehr',
    headers: {
      'Ehr-Session': sessionId
    },
    qs: {
      subjectId: nhsNumber,
      subjectNamespace: 'uk.nhs.nhs_number'
    },
    method: 'POST',
    body: {
      subjectId: nhsNumber,
      subjectNamespace: 'uk.nhs.nhs_number',
      queryable: 'true',
      modifiable: 'true'
    },
    json: true
  };

  //console.log('OpenEHR Create Patient: ' + JSON.stringify(options, null, 2));
  request(options, function(error, response, body) {
    console.log('OpenEHR Create Patient: ' + JSON.stringify(response, null, 2));
    if (response.statusCode !== 200) {
      callback({
        error: response.headers['x-error-message'],
        status: {
          code: response.statusCode
        }
      });
    }
    else {
      callback({ehrId: body.ehrId});
    }
  });
};
