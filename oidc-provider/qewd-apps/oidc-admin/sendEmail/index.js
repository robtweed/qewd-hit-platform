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

var nodemailer = require('nodemailer');
var mustache = require('mustache');
var uuid = require('uuid/v4');
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

  var nodemailer_params = this.oidc.email_server;
  if (!transporter) {
    transporter = nodemailer.createTransport(nodemailer_params);
  }
  var oidc_server = this.oidc.oidc_provider.issuer.host;
  var port = this.oidc.oidc_provider.issuer.port;
  var oidc_path_prefix = this.oidc.oidc_provider.path_prefix;
  if (!oidc_server.startsWith('https://')) {
    if (port && port !== 80) {
      oidc_server = oidc_server + ':' + port;
    }
  }
  var email_options = this.oidc.user_verify_email;

  var type = messageObj.params.type;
  var id = messageObj.params.id;
  var openIdDoc = this.db.use(this.oidc.documentName);
  var usersDoc;
  var token = uuid();
  var now = new Date().toISOString();
  var email;

  if (type === 'Access') {
    userDoc = openIdDoc.$(['Access', 'by_id', id]);
    email = userDoc.$('email').value;

    openIdDoc.$(['verify_pending', token]).setDocument({
      type: type,
      id: id,
      created: now
    });
    userDoc.$('verify_pending_token').value = token;
    userDoc.$('verified').value = 'email_sent';
  }
  else if (type === 'User') {
    userDoc = openIdDoc.$(['Users', 'by_id', id]);
    email = userDoc.$('email').value;

    openIdDoc.$(['verify_pending', token]).setDocument({
      type: type,
      id: id,
      created: now
    });
    userDoc.$('verify_pending_token').value = token;
    userDoc.$('verified').value = 'email_sent';
  }
  else {
    return finished({error: 'Invalid request 2'});
  }

  var text = getTextFromFile(__dirname + '/emailTemplate.txt');

  var subst = {
    domain: oidc_server,
    token: token
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
