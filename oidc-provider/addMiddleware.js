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

  12 March 2019

*/

function sendError(error, res, status) {
  status = status || 400;
  res.set('content-length', error);
  res.status(status).send(error);
}

module.exports = async function(bodyParser, app, qewdRouter, config) {
  this.bodyParser = bodyParser;
  var _this = this;
  app.all('/oidc/*', async function(req, res, next) {
    console.log('!!! intercepted /oidc request');
    console.log('req.query: ' + JSON.stringify(req.query, null, 2));
    var jwt = req.headers.authorization;
    console.log('jwt = ' + jwt);
    jwt = jwt.split('Bearer ')[1];
    var client = await _this.oidc.Provider.Client.find('admin');
    console.log('client = ' + JSON.stringify(client, null, 2));
    var result;
    try {
      result = await _this.oidc.Provider.IdToken.validate(jwt, client);
    }
    catch(err) {
      console.log('Error validating IdToken: ' + err);
      sendError('Invalid IdToken', res);
      return;
    }
    //console.log('result of validate = ' + JSON.stringify(result, null, 2));
    if (req.query && req.query.ignore_idToken_expiry === 'true') {
      next();
      return;
    }
    var now = parseInt(Date.now()/1000);
    if (result.payload.exp < now) {
      sendError('IdToken expired', res);
      return;
    }
    next();
  });
};