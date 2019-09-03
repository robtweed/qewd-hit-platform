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

  30 August 2019

*/

var fs = require('fs');

module.exports = function(args, finished) {

  var filter = args.req.query.filter;
  if (filter !== 'input') filter = 'all';

  var transforms = {};
  var folder = __dirname + '/../../templates';
  var headings = fs.readdirSync(folder);
  headings.forEach(function(heading) {
    transforms[heading] = [];
    var dir = folder + '/' + heading;
    var files = fs.readdirSync(dir);
    if (filter === 'all') {
      transforms[heading] = files;
     }
     else {
       files.forEach(function(file) {
         if (file.indexOf('_to_openehr.json') !== -1) {
           var name = file.split('_to_openehr.json')[0];
           transforms[heading].push(name);
         }
       });
       transforms[heading].push('openehr');
     }
  });

  finished({transforms: transforms});

};
