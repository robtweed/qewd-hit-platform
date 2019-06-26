/*

 ----------------------------------------------------------------------------
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


  This module intercepts the response from the OIDC callback URL: /api/auth/token

  It detects this response by looking for 'oidc_redirect', which contains the 
  URL to which the UI should be redirected

    That redirection URL comes from the global_config.oidc_client property: "index_url"

    Additionally, the JWT in the raw response object is returned to the UI as a cookie

  ALL OTHER responses are passed through unchanged - however, in QEWD-Up, if a 
  onWSResponse event hook module is defined, then it is the responsibility of that
  module to send responses (QEWD's default processing of this stage is bypassed).  So
  you'll see the "pass-through" response handling logic at the end, for both valid and
  error responses.

*/

module.exports = function(req, res, next) {

  // a response message coming back from the worker will be saved in res.locals.message 

  var messageObj = res.locals.message;

  console.log('*** messageObj = ' + JSON.stringify(messageObj, null, 2));

  if (messageObj.oidc_redirect) {

    // Special processing for the /api/auth/token response which, if successful
    // will include the redirection URL for the browser (messageObj.oidc_redirect)

    // The JWT will be returned in a cookie name/value pair, which
    // will also be in the response from /api/auth/token  

    if (messageObj.cookieName) {
      var value = messageObj.cookieValue || messageObj.token;
      var options = {path: messageObj.cookiePath};
      if (messageObj.cookieDelete) {
        res.clearCookie(messageObj.cookieName, options);
      }
      else {
        console.log('cookie name: ' + messageObj.cookieName + '; value = ' + value + '; ' + JSON.stringify(options, null, 2));
        res.cookie(messageObj.cookieName, value, options);
      }
    }

    if (messageObj.cors) {
      console.log('** adding CORS headers');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, POST, OPTIONS');
      res.header('Access-Control-Allow-Origin', '*');
    }

    console.log('redirecting browser to ' + messageObj.oidc_redirect);
    res.redirect(messageObj.oidc_redirect);
  }

  else {

    // Pass-through response handler logic

    // send response message unchanged as QEWD itself would have done it:

    if (messageObj.error) {
      // handling error responses

      var code = 400;
      var status = messageObj.status;
      if (status && status.code) code = status.code;
      res.set('content-length', messageObj.length);
      res.status(code).send(messageObj);
    }

    else {
      // all other valid responses

      res.send(messageObj);
    }
  }
};
