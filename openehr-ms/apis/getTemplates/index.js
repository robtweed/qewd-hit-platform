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

*/

var getSession = require('../../interfaces/getSession');
var getTemplates = require('../../interfaces/getTemplates');

module.exports = function(args, finished) {

  var _this = this;

  getSession.call(this, function(response) {
    if (response.error) {
      return finished(response);
    }
    getTemplates.call(_this, response.sessionId, function(response) {
      if (response.error) {
        return finished(response);
      }
      var templates = [];
      response.templates.forEach(function(template) {
        templates.push(template.templateId);
      });
      finished({templates: templates});
    });
  });

};
