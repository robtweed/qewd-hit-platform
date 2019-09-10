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

var putComposition = require('../interfaces/putComposition');
var startSession = require('./startSession');
var headingHelpers = require('./templateHelpers');
var transform = require('qewd-transform-json').transform;
var flatten = require('./flatten');

module.exports = function(compositionId, args, callback) {
  var _this = this;
  startSession.call(this, args, function(response) {

    if (response.error) {
      return callback(response);
    }

    var sessionId = response.sessionId;

    var cachedCompositions = args.req.qewdSession.data.$(['openEHR', 'compositions']);
    var cachedComposition = cachedCompositions.$(['by_uid', compositionId]);
    var heading = cachedComposition.$('heading').value;
    var templateId = _this.openehr.headings[heading].templateId;

    var format = 'ui';
    if (args.req.query && args.req.query.format) {
      format = args.req.query.format;
    }

    var template = require('../templates/' + heading + '/' + format + '_to_openehr.json');
    var json = transform(template, args.req.body, headingHelpers);
    var flatJson = flatten(json);

    putComposition.call(_this, compositionId, templateId, flatJson, sessionId, function(response) {

      var ehrId = cachedComposition.$('ehrId').value;

      if (response.error) {
        callback({
          error: response.error,
          sessionId: sessionId,
          ehrId: ehrId
        });
      }
      else {

        // delete cache

        cachedCompositions.$(['by_ehrId', ehrId, compositionId]).delete();
        cachedComposition.delete();
        cachedCompositions.$(['by_heading', heading, ehrId]).delete();

        if (format === 'pulsetile') {
          var uid = 'ethercis-' + response.compositionUid.split('::')[0];
          response.compositionUid = uid;
          args.req.qewdSession.data.$(['openEHR', 'sourceIdMap', uid]).value = response.compositionUid;
        }

        callback({
          response: response,
          sessionId: sessionId,
          ehrId: ehrId
        });
      }
    });
  });
};
