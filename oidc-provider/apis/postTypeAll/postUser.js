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

  26 April 2019

*/

var emailValidator = require('email-validator');
var bcrypt = require('bcrypt');
var uuid = require('uuid/v4');

function isEmpty(obj) {
  for (var name in obj) {
    return false;
  }
  return true;
}

module.exports = function(data, finished) {

  var client = data.client;
  var email = data.email;
  if (!email || email === '') {
    return finished({error: 'Missing or empty Email Address'});
  }

  if (!emailValidator.validate(email) || email.length > 255) {
    return finished({error: 'Invalid Email Address'});
  }

  var id = data.id;
  if (typeof id === 'undefined') {
    return finished({error: 'Invalid request'});
  }

  var password = data.password || '';
  if (id === '') {
    // new record
    if (password === '') {
      return finished({error: 'You must provide an initial password for new users'});
    }
  }
  if (password !== '') {
    var salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);
  }

  var claims = data.claims;
  if (typeof claims !== 'undefined') {

    var claimsDoc = this.db.use(this.oidc.documentName, 'Claims');
    var allowedNames = {};
    claimsDoc.forEachChild(function(claim, node) {
      var names = node.getDocument(true);
      names.forEach(function(name) {
        allowedNames[name] = true;
      });
    });
    var errors = '';
    var delim = '';
    for (var name in claims) {
      if (!allowedNames[name]) {
        errors = errors + delim + name;
        delim = '; ';
      }
    }
    if (errors !== '') {
      return finished({error: 'Invalid names found in claims JSON: ' + errors});
    }
  }

  var now = new Date().toISOString();
  var verified;

  var usersDoc = this.db.use(this.oidc.documentName, 'Users', client);

  if (id === '') {
    // saving a new record

    if (usersDoc.$(['by_email', email]).exists) {
      return finished({error: 'A User with email address ' + email + ' already exists'});
    }

    if (!claims || isEmpty(claims)) {
      return finished({error: 'No claims defined for user'});
    }

    id = usersDoc.$('next_id').increment();
    verified = !this.oidc.use2FA;

    usersDoc.$(['by_id', id]). setDocument({
      email: email,
      password: password,
      claims: claims,
      sub: uuid(),
      createdAt: now,
      updatedAt: now,
      verified: verified
    });
  }
  else {
    // updating existing record
    var userDoc = usersDoc.$(['by_id', id]);
    if (!userDoc) {
      return finished({error: 'No such User Id'});
    }
    var old_email = userDoc.$('email').value;

    if (email !== old_email) {
      if (usersDoc.$(['by_email', email]).exists) {
        return finished({error: 'A user with email address ' + email + ' already exists'});
      }
    }

    var old_password = userDoc.$('password').value;
    if (password === '') {
      password = old_password; // leave unchanged
    }
    var createdAt = userDoc.$('createdAt').value;
    verified = userDoc.$('verified').value;
    var sub = userDoc.$('sub').value;

    if (!claims) {
      claims = userDoc.$('claims').getDocument();
    }

    userDoc. setDocument({
      email: email,
      password: password,
      claims: claims,
      sub: sub,
      createdAt: createdAt,
      updatedAt: now,
      verified: verified
    });

  }

  return finished({
    ok: true
  });

};
