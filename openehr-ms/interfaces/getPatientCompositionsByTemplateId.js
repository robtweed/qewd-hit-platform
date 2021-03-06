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

module.exports = function(ehrId, templateId, sessionId, version, callback) {
  if (!callback) {
    callback = version;
  }

  var aql = 'select a/uid/value as uid from EHR e[ehr_id/value = ';
  aql = aql + "'" + ehrId + "']";

  if (version === 'all') {
    aql = aql + ' contains VERSIONED_OBJECT b contains VERSION v[all_versions]';
  }

  aql = aql + ' contains COMPOSITION a where a/archetype_details/template_id/value = ';
  aql = aql + "'" + templateId + "'";


  aql = aql + ' ORDER BY a/context/start_time/value DESC';

  var options = {
    url: this.openehr.host + '/rest/v1/query',
    headers: {
      'Ehr-Session': sessionId
    },
    method: 'GET',
    qs: {
      aql: aql
    },
    json: true
  };

  //console.log('OpenEHR Get Patient Compositions By Template Id: ' + JSON.stringify(options, null, 2));
  request(options, function(error, response, body) {
    console.log('OpenEHR Get Patient Compositions By Template Id: ' + JSON.stringify(response, null, 2));
    if (response.statusCode !== 200) {
      callback({
        error: response.headers['x-error-message'],
        status: {
          code: response.statusCode
        }
      });
    }
    else {
      var uids = [];
      body.resultSet.forEach(function(result) {
        uids.push(result.uid);
      });
      callback({uids: uids});
    }
  });
};
