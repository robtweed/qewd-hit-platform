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

  18 March 2019

*/

var bcrypt = require('bcrypt');
var zxcvbn = require('zxcvbn'); // Dropbox password strength checker

module.exports = function(messageObj, session, send, finished) {
  if (!messageObj.params) return finished({error: 'No parameters were sent'});

  var password = messageObj.params.password;
  if (!password || password === '') return finished({error: 'Missing or blank Password'});

  // at least 1 upper case
  // at least 1 lower case
  // at least 1 number
  // at least 7 characters long
  var passwordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,})");

  if (!passwordPattern.test(password)) {
    return finished({error: 'Your password does not meet the necessary requirements'});
  }

  var errorMessage;
  var dbResults = zxcvbn(password);
  if (dbResults.score < 3) {
    errorMessage = 'That password would be too easy to guess - try again';
    if (dbResults.feedback && dbResults.feedback.warning !== '') {
      errorMessage = dbResults.feedback.warning;
      if (dbResults.feedback.suggestions) {
        dbResults.feedback.suggestions.forEach(function(suggestion) {
          errorMessage = errorMessage + '<br />' + suggestion;
        });
        errorMessage = '<center>' + errorMessage + '</center>';
      }
    }
    return finished({error: errorMessage});
  }

  var grant = messageObj.params.grant;
  if (!grant || grant === '') return finished({error: 'Missing or blank Grant identifier'});

  // Get the user Id from the 2fa session data, using the grant id, ie from

  /*
    session.data.$(['2fa', grant]).setDocument({
      code: hash,
      id: userId,
      accountId: accountId,
      expiry: Date.now() + 300000
     });
  */

  var use2FA = (this.oidc.use2FA !== false);
  var twoFaDoc;
  var twoFa;
  var now;
  var id;

  if (use2FA) {

    twoFaDoc = session.data.$(['2fa', grant]);
    if (!twoFaDoc.exists) {
      return finished({error: 'Invalid request'});
    }

    twoFa = twoFaDoc.getDocument();
    now = Date.now();

    if (twoFa.expiry < now) {
      return finished({
        error: 'Sorry, you took too long to change your password',
        expired: true
      });
    }
    id = twoFa.id;
  }
  else {
    id = session.data.$(['resetPassword', grant]).value
  }

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  // Update the user's password details and flag as verified password

  var userDoc = this.db.use(this.oidc.documentName, 'Users', 'by_id', id);
  userDoc.$('password').value = hash;
  userDoc.$('updatedAt').value = new Date().toISOString();
  userDoc.$('verified').value = true;
  userDoc.$('modifiedBy').value = id;

  // ok, we're finished with the 2FA session code data for this user

  // get rid of any expired 2fa codes while we're here

  if (use2FA) {
    twoFaDoc.delete();
    session.data.$('2fa').forEachChild(function(grant, node) {
      if (node.$('expiry').value < now) node.delete();
    });

    finished({
      ok: true,
      accountId: twoFa.accountId
    });
  }
  else {
    finished({
      ok: true,
      accountId: userDoc.$('email').value
    });
  }

};
