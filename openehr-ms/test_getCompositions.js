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
var getEhrId = require('./interfaces/getEhrId');
var getPatientCompositionsByTemplateId = require('./interfaces/getPatientCompositionsByTemplateId');
var getComposition = require('./interfaces/getCompositionFlatJson');
var unflatten = require('./utils/unflatten');

var q = {
  openehr: require('./configuration/openehr.json')
};

var nhsNumber = '9999999001';
//var templateName = 'Adverse reaction list';
//var templateName = 'NSS RESPECT Form';
//var templateId = 'RESPECT_NSS-v0';
var templateId = 'IDCR - Adverse Reaction List.v1';
//var version = 'all';
var version;

function getNext(uidArray, index, sessionId) {
  index++;
  if (index === uidArray.length) return;
  var uid = uidArray[index];
  getComposition.call(q, uid, sessionId, function(response) {
    console.log('uid: ' + uid + ' - ');
    console.log('response: ' + JSON.stringify(response, null, 2));

    var json = unflatten(response.composition);
    console.log(JSON.stringify(json, null, 2));

    getNext(uidArray, index, sessionId);
  });
};

getSession.call(q, function(response) {
  var sessionId = response.sessionId;
  getEhrId.call(q, nhsNumber, sessionId, function(response) {
    //var ehrId = '7bbc1ebe-12a3-4f99-827e-86aa013e1349';
    var ehrId = response.ehrId;
    getPatientCompositionsByTemplateId.call(q, ehrId, templateId, sessionId, version, function(response) {
      getNext(response.uids, -1, sessionId);
    });
  });
});

