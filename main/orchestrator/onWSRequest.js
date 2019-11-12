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

  8 November 2019

  This module is invoked for EVERY incoming REST request.

  It is doing 2 things:

  1) It checks that all requests have CRSF protection - by testing for a valid
     x-requested-with header.  The one legitimate request that WON'T have this
     header is the OpenId Connect callback URL: /api/auth/token - so it's allowed
     to pass through

  2) Sending a copy

*/

module.exports = function(req, res, next) {

  // Apply CSRF protection to all incoming requests
  // except the Callback URL (/api/auth/token) from the OIDC server:

  function sendError(message) {
    res.set('content-length', message.length);
    res.status(400).send(message);
  }

   if (req.originalUrl === '/audit/record') {
     console.log('incoming /audit/record request rejected');
     return sendError('Invalid request');
   }

  // allow OIDC redirection URL from OID provider

  if (!req.originalUrl.startsWith('/auth/token')) {
    if (!req.headers) {
      return sendError('Invalid request: headers missing');
    }
    if (!req.headers['x-requested-with']) {
      return sendError('Invalid request: x-requested-with header missing');
    }
    if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
      return sendError('Invalid request: x-requested-with header invalid');
    }
  }

  if (req.originalUrl !== '/auth/redirect' && !req.originalUrl.startsWith('/auth/token')) {

    // copy to audit_service for logging

    var jwt;
    var ckie;
    if (req.headers.cookie) {
      ckie = req.headers.cookie.split('JSESSIONID=')[1];
      if (typeof ckie !== 'undefined') {
        jwt = ckie.split(';')[0];
      }
    }

    var content = {
      url: req.originalUrl,
      method: req.method,
      ip: req.headers['x-forwarded-for'],
      user_agent: req.headers['user-agent'],
      jwt: jwt,
      query: req.query,
      body: req.body
    };

    var params = {
      url: '/audit/record',
      body: content
    };

    req.sendFireAndForgetMsg(req, params);

  }

  if (req.originalUrl.startsWith('/qewd/shutdown/')) {
    return sendError('Invalid request');
  }

  if (req.originalUrl.startsWith('/qewd/')) {
    // For Access Token-authenticated messages
    // we need to change the Authorization header because QEWD
    // expects a Bearer token to be a JWT.  We'll change it to 
    // a custom type of Access to allow the incoming message to
    // not get rejected by the Orchestrator

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      var token = req.headers.authorization.split('Bearer ')[1];
      req.headers.authorization = 'AccessToken ' + token;
    }
  }

  next();
};
