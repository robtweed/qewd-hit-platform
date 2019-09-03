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

  3 September 2019

  POST /openehr/heading/:heading/:patientId

*/

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var postPatientCompositionByTemplateId = require('../../utils/postPatientCompositionByTemplateId');
var headingHelpers = require('../../utils/templateHelpers');
var transform = require('qewd-transform-json').transform;
var flatten = require('../../utils/flatten');

module.exports = function(args, finished) {

  var patientId = args.patientId;
  if (!isNumeric(patientId)) {
    return finished({error: 'Invalid patient Id'});
  }

  // Only IDCR users can access other NHS Numbers. Get the user's role and 
  // NHS Number from the decoded JWT (args.session)

  if (args.session.openid.role === 'phr') {
    if (args.session.openid.userId !== patientId) {
      return finished({error: 'You only have access to your own information'});
    }
  }

  var heading = args.heading;
  if (!this.openehr.headings[heading]) {
    return finished({error: 'Invalid heading or not configured for use'});
  }

  var format = 'ui';
  if (args.req.query && args.req.query.format) {
    format = args.req.query.format;
  }

  var _this = this;
  var templateId = this.openehr.headings[heading].templateId;
  var data = args.req.body;
  if (!data) {
    return finished({error: 'Missing data'});
  }

  console.log('patientId: ' + patientId);
  console.log('heading: ' + heading);
  console.log('templateId: ' + templateId);

  if (format !== 'openehr') {
    data.now = new Date().toISOString();
    data.composer = args.session.firstName + ' ' + args.session.lastName;
  }
  var json = data;
  if (format !== 'openehr') {
    var template = require('../../templates/' + heading + '/' + format + '_to_openehr.json');
    json = transform(template, data, headingHelpers);
  }
  var flatJson = flatten(json);

  postPatientCompositionByTemplateId.call(this, patientId, templateId, flatJson, args, function(response) {
    if (response.error) {
      return finished({error: response.error});
    }
    if (format === 'pulsetile') {
      var uid = response.response.compositionUid;
      var uid = 'ethercis-' + response.response.compositionUid.split('::')[0];
      args.req.qewdSession.data.$(['openEHR', 'sourceIdMap', uid]).value = response.response.compositionUid;
      response.response.compositionUid = uid;
    }
    return finished(response.response);
  });

};
