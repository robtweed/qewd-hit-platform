/*

 ----------------------------------------------------------------------------
 | openehr-ms: QEWD-Up REST OpenEHR Interface Service                       |
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

  27 March 2019

*/

module.exports = function() {

  var heading;

  try {
    this.openehr = require('/opt/qewd/mapped/configuration/openehr.json');
    if (!this.openehr.sessions) {
      this.openehr.sessions = {};
    }
    this.openehr.sessions.timeout = this.openehr.sessions.timeout || 120000;
    this.openehr.sessions.max_number = this.openehr.sessions.max_number || 75;
    if (this.openehr.headings) {
      this.openehr.templates = {};
      for (var name in this.openehr.headings) {
        heading = this.openehr.headings[name];
        this.openehr.templates[heading.templateId] = name;
      }
    }
    console.log('** loaded openehr config: ' + JSON.stringify(this.openehr, null, 2));
  }
  catch(err) {
  }

};
