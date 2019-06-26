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

  21 June 2019

  POST /openehr/populate/:heading/:patientId

*/

var postHeadingData = require('../postHeadingData');

module.exports = function(args, finished) {

  var records = args.req.body;
  var max = records.length;
  var results = [];
  var _this = this;

  function postARecord(no) {
    var argsCopy = Object.assign({}, args);
    argsCopy.req.body = records[no];

    postHeadingData.call(_this, argsCopy, function(response) {
      results.push(response);
      no++;
      if (no === max) {
        return finished(results); 
      }
      else {
        postARecord(no);
      }
    });
  }

  postARecord(0);

};
