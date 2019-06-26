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

  4 April 2019


  The beforeHandler module is invoked for EVERY incoming request handled by
  the OpenEHR MicroService.

  Here we use it to set up and maintain a QEWD session for the user - this
  QEWD Session is used for data cacheing.

  The QEWD function - this.qewdSessionByJWT - handles this

  If this is the first time this user's JWT has been received, it will
  create a new QEWD Session.  It uses the unique user-specific "uuid" 
  claim/property in the JWT as the QEWD Session token identifier

  On subsequent incoming requests from the user, the JWT's uuid claim will
  be recognised as a pointer to an existing session, and that QEWD Session will
  be re-allocated to the incoming request object.

  The module always returns true to signal that the incoming request is to be
  handled by its allocated handler module.


*/

module.exports = function(req, finished) {

  console.log('beforeHandler in openehr_service invoked!');

  req.qewdSession = this.qewdSessionByJWT.call(this, req);
  return true;

};
