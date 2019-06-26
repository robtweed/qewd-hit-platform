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

var getSession = require('./interfaces/getSession');
var getTemplateSchema = require('./interfaces/getTemplateSchema');
var unflatten = require('./utils/unflatten');

var q = {
  openehr: require('./configuration/openehr.json')
};

//var templateId = 'RESPECT_NSS-v0';
var templateId = 'IDCR - Adverse Reaction List.v1';
var type = 'input';

getSession.call(q, function(response) {
  getTemplateSchema.call(q, templateId, response.sessionId, type, function(response) {
    console.log('getTemplateSchema response: ' + JSON.stringify(response, null, 2));
    if (type !== 'WEB') {
      var json = unflatten(response.schema);
      console.log('\nSchema for ' + templateId);
      console.log(JSON.stringify(json, null, 2));
    }
  });
});

