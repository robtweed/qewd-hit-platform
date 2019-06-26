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
var nodemailer = require('nodemailer');
var randomstring = require('randomstring');
var mustache = require('mustache');
var fs = require('fs');

function getTextFromFile(fileName) {
  var text = '';
  if (fs.existsSync(fileName)) {
    text = '';
    fs.readFileSync(fileName).toString().split(/\r?\n/).forEach(function(line){
      text = text + ' ' + line;
    });
  }
  return text;
}

var transporter;

module.exports = function(messageObj, session, send, finished) {

  var email = messageObj.params.email;

  var usersDoc = this.db.use(this.oidc.documentName, 'Users');
  var emailIndex = usersDoc.$(['by_email', email]);

  if (!emailIndex.exists) {
    if (this.oidc.useEmail === false) {
      return finished({
        ok: false,
        temporary_password: ''
      });
    }
    return finished({error: 'Unrecognised email address'});
  }

  var id = emailIndex.value;
  var userDoc = usersDoc.$(['by_id', id]);
  if (!userDoc.exists) {
    return finished({error: 'A problem occurred when accessing your account.  Please contact your Administrator'});
  }

  var password = randomstring.generate({
    length: 6,
    charset: 'numeric'
  });
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  userDoc.$('verified').value = 'pending_first_login';
  userDoc.$('password').value = hash;
  userDoc.$('updatedAt').value = new Date().toISOString();
  userDoc.$('modifiedBy').value = id;

  if (this.oidc.useEmail === false) {
    return finished({
      ok: true,
      temporary_password: password
    });
  }

  var nodemailer_params = this.oidc.email_server;
  if (!transporter) {
    transporter = nodemailer.createTransport(nodemailer_params);
  }
  var oidc_server = this.oidc.oidc_provider.issuer.host;
  var port = this.oidc.oidc_provider.issuer.port;
  if (!oidc_server.startsWith('https://')) {
    if (port && port !== 80) {
      oidc_server = oidc_server + ':' + port;
    }
  }
  var email_options = this.oidc.user_verify_email;

  var text = getTextFromFile(__dirname + '/requestNewPasswordEmail.txt');

  var subst = {
    password: password,
    applicationName: email_options.application_name,
    contactEmail: email_options.contact_email
  };

  var html = mustache.render(text, subst);

  var mailOptions = {
    from: email_options.from,
    to: email,
    subject: email_options.subject,
    html: html
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('** emailing error: ' + error);
      return finished({error: error});
    }
    console.log('** email info: ' + JSON.stringify(info, null, 2));
    finished({
      ok: true,
      info: info
    });
  });

};
