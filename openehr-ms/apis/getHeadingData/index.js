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

  22 July 2019

  GET /openehr/heading/:heading/:patientId

*/

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var getPatientCompositionsByTemplateId = require('../../utils/getPatientCompositionsByTemplateId');
var getCompositionsData = require('../../utils/getCompositionsData');

var headingHelpers = require('../../utils/templateHelpers');
var transform = require('qewd-transform-json').transform;

module.exports = function(args, finished) {

  var patientId = args.patientId;
  if (!isNumeric(patientId)) {
    return finished({error: 'Invalid patient Id'});
  }

  // Only IDCR users can access other NHS Numbers. Get the user's role and 
  // NHS Number from the decoded JWT (args.session)

  if (args.session.openid.role !== 'idcr') {
    if (args.session.openid.userId !== patientId) {
      return finished({error: 'You only have access to your own information'});
    }
  }

  var heading = args.heading;
  if (!this.openehr.headings[heading]) {
    return finished({error: 'Invalid heading or not configured for use'});
  }

  var patientName = args.session.firstName + ' ' + args.session.lastName;

  var format = args.req.query.format;

  var _this = this;
  var templateId = this.openehr.headings[heading].templateId;
  console.log('patientId: ' + patientId);
  console.log('heading: ' + heading);
  console.log('templateId: ' + templateId);
  getPatientCompositionsByTemplateId.call(this, patientId, templateId, args, function(response) {

    if (response.error) {
      return finished(response);
    }

    // so now we have the patient's composition Uids, we';; fetch the content for each one

    getCompositionsData.call(_this, response.uids, args, function(results) {
      if (format === 'flat' || format === 'openehr') {
        return finished({
          data: results
        });
      }
      var template;
      if (format === 'ui') {
        template = require('../../templates/' + heading + '/openehr_to_ui.json');
      }
      if (format === 'fhir') {
        template = require('../../templates/' + heading + '/openehr_to_fhir.json');
      }
      if (format === 'summaryHeadings') {
        template = require('../../templates/' + heading + '/openehr_to_summaryHeadings.json');
      }
      if (!template) {
        return finished({
          data: results
        });
      }
      var transformedData = {};
      var record;
      var uid;
      for (uid in results) {
        record = results[uid];
        record.uid = uid;
        record.patientId = patientId;
        record.patientName = patientName;
        transformedData[uid] = transform(template, record, headingHelpers);
      }
      if (format === 'summaryHeadings') {
        var summary = [];
        for (uid in transformedData) {
          summary.push(transformedData[uid]);
        }
        return finished({
          data: summary
        });
      }
      if (format === 'fhir') {
        var bundle = {
          resourceType: 'Bundle',
          type: 'searchset',
          total: 0,
          timestamp: new Date().toISOString(),
          entry: []
        };
        var count = 0;
        for (uid in transformedData) {
          bundle.entry.push({
            resource: transformedData[uid]
          });
          count++;
        }
        bundle.total = count;
        return finished({
          data: bundle
        });
      }
      else {
        return finished({
          data: transformedData
        });
      }
      
    });

  });

};
