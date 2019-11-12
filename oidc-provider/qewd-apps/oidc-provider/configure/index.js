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

  12 November 2019

*/

var bcrypt = require('bcrypt');
var uuid = require('uuid/v4');
var claimsByScope = require('../claimsByScope.json');

module.exports = function(messageObj, session, send, finished) {

  // Configure with initial data if present

  var oidcDoc = this.db.use(this.oidc.documentName);

  // initialise standard Claims if not already saved
  var claimsDoc = oidcDoc.$('Claims');
  if (!claimsDoc.exists) {
    claimsDoc.setDocument(claimsByScope);
  }

  var data;

  try {
    data = require('/opt/qewd/mapped/configuration/data.json');
  }
  catch(err) {
  }

  var customClaimsDoc = oidcDoc.$('Custom_Claims');
  if (!customClaimsDoc.exists && data.Custom_Claims) {
    customClaimsDoc.setDocument(data.Custom_Claims);
    for (var name in data.Custom_Claims) {
      claimDoc = claimsDoc.$(name);
      var index = claimDoc.lastChild.name;
      data.Custom_Claims[name].forEach(function(claim) {
        index++;
        claimDoc.$(index).value = claim;
      });
    }
  }

  var id;
  var now = new Date().toISOString();
  var salt = bcrypt.genSaltSync(10);
  var password;


  var clientsDoc = oidcDoc.$('Clients')
  if (clientsDoc.exists) {
    if (data && data.Clients) {
      // update HIT client details from data, as user may have
      // rerun installer.  Client secrets in particular may have changed
      data.Clients.forEach(function(record) {
        var ix = clientsDoc.$(['by_client_id', record.client_id]).value;
        clientsDoc.$(['by_id', ix]).setDocument(record);
      });      
    }
  }
  else {
    if (data) {
      if (data.Clients) {
        data.Clients.forEach(function(record) {
          id = clientsDoc.$('next_id').increment();
          clientsDoc.$(['by_id', id]).setDocument(record);
        });
      }
      if (data.Users) {
        var usersDoc = oidcDoc.$('Users');
        var userClientDoc;
        var clientObj;
        for (var client in data.Users) {
          userClientDoc = usersDoc.$(client);
          clientObj = data.Users[client];
          clientObj.forEach(function(record) {
            id = userClientDoc.$('next_id').increment();
            password = record.password || 'password';
            record.password = bcrypt.hashSync(password, salt);
            record.sub = uuid();
            record.verified = true;
            record.createdBy = 1;
            record.createdAt = now;
            record.updatedBy = 1;
            record.updatedAt = now;
            userClientDoc.$(['by_id', id]).setDocument(record);
          });
        }
      }
    }
  }

  finished({ok: true});
};
