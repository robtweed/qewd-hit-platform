/*

 ----------------------------------------------------------------------------
 | QEWD HIT Platform: Audit MicroService Installer                          |
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

  16 September 2019

*/

var fs = require('fs-extra');
var path = require('path');
var transform = require('qewd-transform-json').transform;

function createJSONFile(obj, filename) {
  var filePath = path.join('/opt/qewd/mapped/configuration', filename);
  //console.log('file path: ' + filePath);
  fs.outputJsonSync(filePath, obj, {spaces: 2});
  //fs.chmodSync(packageJsonFile, '0664');
}

var helpers = {
  createUri: function(protocol, host, port, path) {
    var uri = protocol + '://' + host;
    if (port === 80 || port === 443) {
      port = '';
    }
    if (port && port !== '') {
      uri = uri + ':' + port;
    }
    if (path) {
      uri = uri + path;
    }
    return uri;
  }
};

var settings;

try {
  settings = require('./configuration/settings.json');
}
catch(err) {
  console.log('Error! Unable to load ./configuration/settings.json');
  return;
}

//console.log('settings: ' + JSON.stringify(settings, null, 2));

var config_template;

try {
  config_template = require('./configuration/config_template.json');
}
catch(err) {
  console.log('Error! Unable to load ./configuration/config_template.json');
  return;
}

var config = transform(config_template, settings, helpers);

//console.log('config: ' + JSON.stringify(config, null, 2));

createJSONFile(config, 'config.json');

console.log('Successfully configured the audit_service MicroService');
console.log('Restart the audit_service container');

