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

  13 March 2019

*/

var noAuthAllowed = [
  'login',
  'getAdminStatus',
  'confirmCode',
  'resendCode' 
];

module.exports = function(messageObj, session, send, finished) {

  // bypass authentication test for certain messages:

  if (noAuthAllowed.includes(messageObj.type)) return;

  // for all other messages, check if user is already authenticated:

  if (!session.authenticated) {
    // if not return an error message and release the Worker process:

    finished({error: 'User MUST be authenticated'});
    return false;
  }
};
