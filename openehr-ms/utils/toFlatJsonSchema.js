/*

 ----------------------------------------------------------------------------
 | openehr-ms: OpenEHR Interface QEWD-Up MicroService                       |
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

  24 June 2019

*/

var traverse = require('traverse');

function isInteger(value) {
  return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

module.exports = function(json) {
  var deletions = [
    '_uid',
    'language|code',
    'language|terminology',
    'territory|code',
    'territory|terminology',
    'composer|id',
    'composer|id_scheme',
    'composer|id_namespace',
    'composer|name'
  ];

  var newPaths = [];
  var schema = traverse(json).forEach(function(node) {
    var _this = this;
    var rootPath;
    var newPath;
    var key;
    if (this.isLeaf) {
      console.log('path: ' + this.path);
      console.log('this.node: ' + this.node);
      console.log('this.key: ' + this.key);
      deletions.forEach(function(value) {
        if (_this.path[1] === value) {
          _this.delete();
          return;
        }
      });
    }
    if (this.path[1] === 'context') {
      this.delete();
      return;
    }
    if (this.path[1] === 'composer') {
      this.delete();
      return;
    }
    if (this.node === 'DEFAULT_TEXT_VALUE') {
      rootPath = this.path.slice(0);
      key = '';
      console.log('initial rootPath = ' + rootPath);
      if (!isInteger(this.key)) {
        console.log('this.key is not integer');
        rootPath = this.path.slice(0, -1);
        key = this.key;
      }
      console.log('** new rootPath = ' + rootPath);
      console.log('key = ' + key);
      this.delete();
      newPath = rootPath.concat([key + '|value']);
      console.log('newPath = ' + newPath);
      traverse(json).set(newPath, '{{obj.value}}');
      newPath = rootPath.concat([key + '|code']);
      traverse(json).set(newPath, '{{obj.code}}');
      newPath = rootPath.concat([key + '|terminology']);
      traverse(json).set(newPath, '{{obj.terminology}}');
    }
  });

  console.log('json = ' + JSON.stringify(json, null, 2));
  console.log('schema = ' + JSON.stringify(schema, null, 2));


  var ctx = {
    ctx: {
      composer_name: '{{composer}}',
      'health_care_facility|id': '999999-345',
      'health_care_facility|name': 'Home',
      id_namespace: 'NHS-UK',
      id_scheme: '2.16.840.1.113883.2.1.4.3',
      language: 'en',
      territory: 'GB',
      time: '{{now}}'
    }
  };

  return {...ctx, ...schema};
};
