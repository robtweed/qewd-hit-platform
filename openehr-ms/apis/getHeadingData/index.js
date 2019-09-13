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

  13 September 2019

  GET /openehr/heading/:heading/:patientId

*/

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var getPatientCompositionsByHeading = require('../../utils/getPatientCompositionsByHeading');
var getCompositionsData = require('../../utils/getCompositionsData');

var headingHelpers = require('../../utils/templateHelpers');
var transform = require('qewd-transform-json').transform;

module.exports = function(args, finished) {

  var patientId = args.patientId;
  //if (!isNumeric(patientId)) {
  //  return finished({error: 'Invalid patient Id'});
  //}

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

  var patientName = args.session.firstName + ' ' + args.session.lastName;

  var format = args.req.query.format || 'ui';
  var selectedUid;
  var sourceIdMap = args.req.qewdSession.data.$(['openEHR', 'sourceIdMap']);

  //console.log('format = ' + format + '; uid = ' + args.req.query.uid);

  if (format === 'pulsetile_detail' && args.req.query.uid) {
    selectedUid = args.req.query.uid;
    var mappedUid = sourceIdMap.$(selectedUid);

    if (mappedUid.exists) {
      //selectedUid = selectedUid.split('ethercis-')[1] + '::local.ethercis.com::1';
      selectedUid = mappedUid.value;
    }
    else {
      return finished({error: 'Source Id ' + args.req.query.uid + ' was not recognised'});
    }
    //console.log('** pulsetile_detail - selectedUid = ' + selectedUid);
  }

  var _this = this;
  //var templateId = this.openehr.headings[heading].templateId;
  //console.log('patientId: ' + patientId);
  //console.log('heading: ' + heading);
  //console.log('templateId: ' + templateId);
  getPatientCompositionsByHeading.call(this, patientId, heading, args, function(response) {

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
      if (format !== '') {
        try {
          template = require('../../templates/' + heading + '/openehr_to_' + format + '.json');
        }
        catch(err) {
          return finished({error: 'No template for ' + heading + ' format: ' + format});
        }
      }
      if (!template) {
        return finished({
          data: results
        });
      }
      var transformedData = {};
      var record;
      var uid;

      //console.log('format = ' + format + '; selectedUid = ' + selectedUid);

      if (format === 'pulsetile_detail' && selectedUid) {
        //console.log('specific pulsetile_detail record');
        record = results[selectedUid];
        record.uid = selectedUid;
        record.sourceId = args.req.query.uid;
        record.patientId = patientId;
        record.patientName = patientName;
        return finished(transform(template, record, headingHelpers));
      }

      //console.log('looping through and transforming all results');

      for (uid in results) {
        //console.log('uid = ' + uid);

        record = results[uid];
        record.uid = uid;
        if (format === 'pulsetile_synopsis' || format === 'pulsetile_summary' || format === 'pulsetile_detail') {
          // set up sourceId to full uid mapping in session cache

          record.sourceId = 'ethercis-' + uid.split('::')[0];
          sourceIdMap.$(record.sourceId).value = uid;
        }

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
      if (format === 'pulsetile_synopsis') {
        var results = {
          heading: heading,
          synopsis: []
        };
        for (uid in transformedData) {
          results.synopsis.push(transformedData[uid]);
        }
        return finished(results);
      }
      if (format === 'pulsetile_summary') {
        var results = [];
        for (uid in transformedData) {
          results.push(transformedData[uid]);
        }
        return finished({return_as_array: results});
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
