/*

 ----------------------------------------------------------------------------
 | fhir-mpi: Demonstration QEWD-Up FHIR-based MPI MicroService              |
 |                                                                          |
 | Copyright (c) 2019-20 M/Gateway Developments Ltd,                        |
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

  15 July 2020

*/

var request = require('request');

module.exports = function(args, finished) {

  // example includes sending QEWD's JWT as a bearer authorization token to the remote service

  var options = {
    url: 'https://jsonplaceholder.typicode.com/comments',
    headers: {
      authorization: 'Bearer ' + args.req.token
    },
    method: 'GET',
    json: true
  };

  request(options, function(error, response, body) {
    if (response.statusCode !== 200) {
      callback({
        error: response.headers['x-error-message'],
        status: {
          code: response.statusCode
        }
      });
    }
    else {
      finished({comments: body});
    }
  });

};
