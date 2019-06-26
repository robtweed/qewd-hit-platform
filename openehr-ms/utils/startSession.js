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

var getSession = require('../interfaces/getSession');

module.exports = function(args, callback) {

  //console.log('args.req = ' + JSON.stringify(args.req, null, 2));

  var cachedSession = args.req.qewdSession.data.$(['openEHR', 'session']);
  if (cachedSession.exists) {
    var now = new Date().getTime();
    if ((now - cachedSession.$('creationTime').value) < this.openehr.sessions.timeout) {
      // use cached session Id
      return callback({sessionId: cachedSession.$('id').value});
    }
    else {
      cachedSession.delete();
    }
  }

  getSession.call(this, function(response) {
    if (!response.error) {
      cachedSession.setDocument({
        creationTime: new Date().getTime(),
        id: response.sessionId
      });
    }
    callback(response);
  });

};
