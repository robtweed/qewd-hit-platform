/*

 ----------------------------------------------------------------------------
 | oidc-provider: OIDC Provider QEWD-Up MicroService                        |
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

  30 April 2019

*/

var postClient = require('./postClient');
var postClaim = require('./postClaim');
var postUser = require('./postUser');

module.exports = function(args, finished) {

  if (args.type === 'client') {
    return postClient.call(this, args.req.body, finished);
  }
  if (args.type === 'claim') {
    return postClaim.call(this, args.req.body, finished);
  }
  if (args.type === 'user') {
    return postUser.call(this, args.req.body, finished);
  }
  finished({error: args.type + ' is not a valid type'});

};
