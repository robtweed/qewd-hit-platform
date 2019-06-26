/*

 ----------------------------------------------------------------------------
 | audit-ms: QEWD-Up REST Audit Service                                     |
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

  26 March 2019

*/

var jwt_simple = require('jwt-simple');
module.exports = function(args, finished) {

  var auditDoc = this.db.use('Audit');
  var id = auditDoc.$('next_id').increment();

  var data = args.req.body;
  if (data.jwt) {
    var decoded = jwt_simple.decode(data.jwt, null, true)
    data.userId = decoded.nhsNumber;
  }
  data.time = Date.now();

  auditDoc.$(['by_id', id]).setDocument(data);

  finished({
    ok: true
  });

};
