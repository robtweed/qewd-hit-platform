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

  28 August 2019

*/

var getSession = require('../../interfaces/getSession');
var getTemplateSchema = require('../../interfaces/getTemplateSchema');
var unflatten = require('../../utils/unflatten');
var toFlatJsonSchema = require('../../utils/toFlatJsonSchema');
var traverse = require('traverse');

module.exports = function(args, finished) {

  var heading = args.heading;
  if (!this.openehr.headings[heading]) {
    return finished({error: 'Invalid heading or not configured for use'});
  }

  var templateId = this.openehr.headings[heading].templateId;

  var format = args.req.query.format || 'in';

  var _this = this;

  getSession.call(this, function(response) {
    if (response.error) {
      return finished(response);
    }
    var type = 'INPUT';
    getTemplateSchema.call(_this, templateId, response.sessionId, type, function(response) {
      var json = unflatten(response.schema);
      var schema = json;
      if (format === 'in') {
        schema = toFlatJsonSchema(json);
      }
      finished({
        templateId: templateId,
        schema: schema
      });
    });
  });

};
