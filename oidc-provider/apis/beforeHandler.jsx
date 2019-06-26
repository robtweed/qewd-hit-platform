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

  10 April 2019


  The beforeHandler module is invoked for EVERY incoming request handled by
  the OIDC Provider MicroService.

  It is used to check the Basic authentication for each request


*/

module.exports = function(req, finished) {

  var auth = req.headers.authorization;
  console.log('auth = ' + auth);

  if (!auth) {
    finished({error: 'Missing Authentication Header'});
    return false;
  }

  var credentials = auth.split('Basic ')[1];
  if (!credentials || credentials === '') {
    finished({error: 'Missing or empty Authentication Credentials'});
    return false;
  }

  var decoded = Buffer.from(credentials, 'base64').toString();
  var pieces = decoded.split(':');
  var client_id = pieces[0];
  var client_secret = pieces[1];
  console.log('client_id: ' + client_id);
  console.log('client_secret: ' + client_secret);

  if (client_id === '' || client_secret === '') {
    finished({error: 'Invalid Authentication Credentials'});
    return false;
  }

  var clientsDoc = this.db.use(this.oidc.documentName, 'Clients');
  var byName = clientsDoc.$(['by_client_id', client_id]);
  if (!byName.exists) {
    finished({error: 'Invalid Authentication Credentials'});
  }

  var id = byName.value;
  console.log('id = ' + id);
  var secret = clientsDoc.$(['by_id', id, 'client_secret']).value;
  console.log('secret = ' + secret);

  if (client_secret !== secret) {
    finished({error: 'Invalid Authentication Credentials'});
    return false;
  }

  // Authenticated OK


  return true;

};
