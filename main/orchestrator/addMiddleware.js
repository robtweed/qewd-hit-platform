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

  5 November 2019

*/

module.exports = function(bodyParser, app, qewdRouter, config, qx) {

  var routeParser = require('route-parser');
  var routes = {};
  var rewrite;

  try {
    rewrite = require('./rewrite.json');
  }
  catch(err) {
  }

  function processUrl(url, req) {
    var pieces;
    var nvp;
    if (url.includes('?')) {
      pieces = url.split('?'); 
      req.url = pieces[0];
      pieces = pieces[1].split('&');
      pieces.forEach(function(piece) {
        nvp = piece.split('=');
        req.query[nvp[0]] = nvp[1];
      });
    }
    else {
      req.url = url;
    }
  }

  function getRoute(path) {
    var route;
    if (!routes[path]) {
      route = new routeParser(path);
      routes[path] = route;
      return route;
    }
    else {
      return routes[path];
    }
  }

  app.use(function(req, res, next) {

    req.qx = qx;
    return next();

  });

  app.use(function(req, res, next) {

    // Optional URL Rewriting middleware
    //  Uses rules defined in ./rewrite.json in Orchestrator's /main/orchestrator path

    console.log('** incoming url: ' + req.url + ': ' + req.method + ' *****');
    if (!rewrite) {
      return next();
    }
    var url;
    var pieces;
    var path;
    var fromRoute;
    var toRoute;
    var match;
    if (req.url !== '' && rewrite && rewrite.exact && rewrite.exact[req.url] && rewrite.exact[req.url][req.method]) {
      url = rewrite.exact[req.url][req.method];
      processUrl(url, req)
      req.originalUrl = req.url;
      return next();
    }
    var pieces;
    if (rewrite.startswith) {
      for (match in rewrite.startswith) {
        if (req.url.startsWith(match)) {
          url = req.url.replace(match, rewrite.startswith[match]);
          processUrl(url, req);
          req.originalUrl = req.url;
          console.log('url rewritten to ' + req.url);
          return next();
        }
      }
    }
    if (rewrite.routes) {
      for (path in rewrite.routes) {
        fromRoute = getRoute(path);
        if (rewrite.routes[path][req.method]) {
          toRoute = getRoute(rewrite.routes[path][req.method]);
          match = fromRoute.match(req.url);
          if (match) {
            url = toRoute.reverse(match);
            processUrl(url, req);
            req.originalUrl = req.url;
            console.log('parsed url rewritten to ' + req.url);
            return next();
          }
        }
      }
    }
    
    return next();
  });

};
