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

  29 May 2019

*/

const Provider = require('oidc-provider');
const account = require('./account');
const adapter = require('./adapter');
const logoutSource = require('./logoutSource');

var path = require('path');
//var util = require('util');

module.exports = function(app, bodyParser, params) {

  var configuration_options;
  try {
    configuration_options = require('../configuration/configuration_options');
  }
  catch(err) {
  }

  console.log('OpenId Connect Server Loader starting with params:');
  console.log(JSON.stringify(params, null, 2));

  var qewd_adapter = adapter(this);
  var Account = account(this);
  var _this = this;
  var oidc_provider = this.oidc.oidc_provider;

  var configuration = {
    claims: params.Claims,
    findById: Account.findById,

    interactionUrl(ctx) {
      return `/openid/interaction/${ctx.oidc.uuid}`;
    },

    logoutSource: logoutSource,

    features: {
      devInteractions: false,
      clientCredentials: true,
      introspection: true,
      sessionManagement: true,
      conformIdTokenClaims: false
    }
  };

  // for function-based configuration options:

  if (configuration_options) {
    for (var name in configuration_options) {
      configuration[name] = configuration_options[name];
    }
  }

  // for fixed-value configuration options

  if (oidc_provider.configuration_options) {
    for (var name in oidc_provider.configuration_options) {
      configuration[name] = oidc_provider.configuration_options[name];
    }
  }

  if (!configuration.cookies) configuration.cookies = {};
  if (!configuration.cookies.keys) {
    configuration.cookies.keys = ['mySecret1', 'mySecret2', 'mySecret3'];
  }
  if (!configuration.cookies.thirdPartyCheckUrl) {
    configuration.cookies.thirdPartyCheckUrl = 'https://cdn.rawgit.com/panva/3rdpartycookiecheck/92fead3f/start.html';
  }

  var issuer = params.issuer.host;
  if (params.issuer.port) issuer = issuer + ':' + params.issuer.port;
  issuer = issuer + params.path_prefix;

  console.log('creating Provider with configuration: ' + JSON.stringify(configuration, null, 2));

  const oidc = new Provider(issuer, configuration);

  this.oidc.Provider = oidc;

  oidc.initialize({
    keystore: params.keystore,
    adapter: qewd_adapter
  }).then(() => {

    oidc.proxy = true;

    app.set('trust proxy', true);
    app.set('view engine', 'ejs');
    app.set('views', '/opt/qewd/mapped/ui');

    const parse = bodyParser.urlencoded({ extended: false });

    app.get('/openid/interaction/logout', async (req, res) => {
      //console.log('*** logout redirection page');
      res.render('logout');
    });

    app.get('/openid/interaction/:grant', async (req, res, next) => {
      try {
        const details = await oidc.interactionDetails(req);
        //console.log(util.inspect(req));
        var client_id;
        if (details.params.client_id) {
          client_id = details.params.client_id;
        }
        console.log('** interactionDetails: ' + JSON.stringify(details, null, 2));
        if (details.uuid && details.params && details.params.scope) {
          var scope = details.params.scope;
          _this.handleMessage({
            type: 'saveGrant',
            params: {
              grant: details.uuid,
              client_id: client_id,
              expiry: details.exp,
              scope: scope
            },
            token: _this.oidc.token
          });
        }
        var loginFormTitle = "OpenId-Connect Authentication Service Log In";
        var homePageUrl = '/';
        if (oidc_provider.ui) {
          if (oidc_provider.ui.login_form_title) {
            loginFormTitle = oidc_provider.ui.login_form_title;
          }
          if (oidc_provider.ui.home_page_url) {
            homePageUrl = oidc_provider.ui.home_page_url;
          }
        }
        if (params.ui && params.ui[client_id]) {
          if (params.ui[client_id].login_form_title) {
            loginFormTitle = params.ui[client_id].login_form_title;
          }
          if (params.ui[client_id].home_page_url) {
            homePageUrl = params.ui[client_id].home_page_url;
          }
        }
        if (details.params && details.params.ui_app) {
          // override home page url (for timed out logins)
          // using app defined by additional redirect_uri param
          if (oidc_provider.ui_app && oidc_provider.ui_app[details.params.ui_app] && oidc_provider.ui_app[details.params.ui_app].home_page_url) {
            homePageUrl = oidc_provider.ui_app[details.params.ui_app].home_page_url;
          }
        }

        details.loginFormTitle = loginFormTitle;
        details.homePage = homePageUrl;
        var timeout = 600;
        if (oidc_provider.configuration_options && oidc_provider.configuration_options.cookies) {
          timeout = oidc_provider.configuration_options.cookies.long.maxAge;
        }
        details.cookieTimeout = timeout;

        res.render('login', { details });
      }
      catch(err) {
        console.log('**** error: ' + err);
        return next('Invalid request');
      }
    });

    app.post('/openid/interaction/:grant/confirm', parse, (req, res, next) => {
      try {
        oidc.interactionFinished(req, res, {
          consent: {},
        });
      } 
      catch (err) {
        next(err);
      }
    });

    app.post('/openid/interaction/:grant/login', parse, (req, res, next) => {
      console.log('*** interaction login function');
      //console.log('req = ' + util.inspect(req));
      var ip = '';
      if (req.headers && req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'];
      }

      Account.authenticate(req.body.email, req.body.password, req.params.grant, ip).then((account) => {
        if (account.error) {
          var details = {
            params: {
              error: account.error
            },
            uuid: req.params.grant,
            loginFormTitle: oidc_provider.ui.login_form_title,
            homePage: oidc_provider.ui.home_page_url
          };

          var timeout = 600;
          if (oidc_provider.configuration_options && oidc_provider.configuration_options.cookies) {
            timeout = oidc_provider.configuration_options.cookies.long.maxAge;
          }
          details.cookieTimeout = timeout;

          if (account.error === 'Maximum Number of Attempts Exceeded') {
            res.render('maxAttempts');
            return;
          }

          res.render('login', {details});
          return;
        }

        if (account.accountId) {

          // gets here if 2FA not enabled

          if (account.resetPassword) {
            var details = {
              params: {},
              uuid: req.params.grant,
              homePage: oidc_provider.ui.home_page_url
            }
            res.render('resetPassword', {details});
            return;
          }

          oidc.interactionFinished(req, res, {
            login: {
              account: account.accountId,
              acr: '1',
              remember: false,
              ts: Math.floor(Date.now() / 1000),
            },
            consent: {
              // TODO: remove offline_access from scopes if remember is not checked
            },
          });
          return;
        }

        var details = {
          params: {},
          uuid: req.params.grant,
          homePage: oidc_provider.ui.home_page_url
        }
        res.render('confirmCode', {details});
      }).catch(next);
    });

    app.post('/openid/interaction/:grant/confirmCode', parse, (req, res, next) => {
      Account.confirmCode(req.body.confirmCode, req.params.grant).then((results) => {
        if (results.error) {
          var details = {
            params: {
              error: results.error
            },
            uuid: req.params.grant,
            homePage: oidc_provider.ui.home_page_url
          };

          if (results.error === 'Maximum Number of Attempts Exceeded') {
            res.render('maxAttempts');
            return;
          }

          res.render('confirmCode', {details});
          return;
        }

        console.log('** account: ' + JSON.stringify(results.accountId));

        // now we need to force a password change if this is the first login with temporary password
        // if results.resetPassword is true

        if (results.resetPassword) {
          var details = {
            params: {},
            uuid: req.params.grant,
            homePage: oidc_provider.ui.home_page_url
          }
          res.render('resetPassword', {details});
        }
        else {
          try {
            oidc.interactionFinished(req, res, {
              login: {
                account: results.accountId,
                acr: '1',
                remember: false,
                ts: Math.floor(Date.now() / 1000),
              },
              consent: {
                // TODO: remove offline_access from scopes if remember is not checked
              },
            });
          }
          catch(err) {
            // grant has timed out
            location.reload();
          }
        }
      }).catch(next);
    });

    app.post('/openid/interaction/:grant/changePassword', parse, (req, res, next) => {
      Account.changePassword(req.body.password, req.body.password2, req.params.grant).then((results) => {
        if (results.error) {
          var details = {
            params: {
              error: results.error
            },
            uuid: req.params.grant
          };
          if (results.expired) {
            details.loginFormTitle = oidc_provider.ui.login_form_title;
            details.homePage = oidc_provider.ui.home_page_url;
            var timeout = 600;
            if (oidc_provider.configuration_options && oidc_provider.configuration_options.cookies) {
              timeout = oidc_provider.configuration_options.cookies.long.maxAge;
            }
            details.cookieTimeout = timeout;
            res.render('login', {details});
          }
          else {
            res.render('resetPassword', {details});
          }
          return;
        }

        // successfully logged in and password updated

        oidc.interactionFinished(req, res, {
          login: {
            account: results.accountId,
            acr: '1',
            remember: false,
            ts: Math.floor(Date.now() / 1000),
          },
          consent: {
            // TODO: remove offline_access from scopes if remember is not checked
          },
        });
      }).catch(next);
    });

    app.get('/openid/interaction/:grant/forgotPassword', parse, (req, res, next) => {
      var details = {
        params: {},
        uuid: req.params.grant,
        homePage: oidc_provider.ui.home_page_url
      };
      res.render('forgotPassword', {details});
    });

    app.post('/openid/interaction/:grant/requestNewPassword', parse, (req, res, next) => {
      Account.requestNewPassword(req.body.email).then((results) => {

        console.log('** requestNewPassword results: ' + JSON.stringify(results, null, 2));

        var details = {
          uuid: req.params.grant,
          loginFormTitle: oidc_provider.ui.login_form_title,
          homePage: oidc_provider.ui.home_page_url
        };

          var timeout = 600;
          if (oidc_provider.configuration_options && oidc_provider.configuration_options.cookies) {
            timeout = oidc_provider.configuration_options.cookies.long.maxAge;
          }
          details.cookieTimeout = timeout;

        if (typeof results.temporary_password !== 'undefined') {
          if (!results.ok) {
            details.params = {
              error: '<center>That email address could not be found</center>'
            };
          }
          else {
            details.params = {
              error: '<center>Your temporary password is ' + results.temporary_password + '</center>'
            };
          }
        }
        else {
          details.params = {
            error: '<center>If an account exists with this email address<br /> a password reset email will be sent</center>'
          };
        }
        res.render('login', {details});
      }).catch(next);
    });

    app.use('/openid', oidc.callback);

    app.use((err, req, res, next) => {
      console.log('**** Error occurred: ' + err);
      var details = {
        homePage: oidc_provider.ui.home_page_url
      };
      res.render('error', {details});
    });
  });

};
