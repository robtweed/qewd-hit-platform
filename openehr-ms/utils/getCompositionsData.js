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

  10 September 2019

  Serially get the unflattened
  JSON data from OpenEHR 
  for an array of compositions 
  (each identified by its uid)

*/


var unflatten = require('./unflatten');
var startSession = require('./startSession');
var getComposition = require('../interfaces/getCompositionFlatJson');

module.exports = function(uidArray, args, callback) {
  var results = {};
  if (uidArray.length === 0) {
    return callback(results);
  }

  var cachedCompositions = args.req.qewdSession.data.$(['openEHR', 'compositions', 'by_uid'])

  var lastIndex = uidArray.length - 1;
  var _this = this;

  function getNext(index) {
    index++;
    var uid = uidArray[index];
    var cachedComposition = cachedCompositions.$([uid, 'data']);
    if (cachedComposition.exists) {
      results[uid] = cachedComposition.getDocument(true);
      if (index === lastIndex) {
        return callback(results);
      }
      else {
        getNext.call(_this, index);
      }
    }
    else {
      startSession.call(_this, args, function(response) {
        getComposition.call(_this, uid, response.sessionId, function(response) {

          var json = unflatten(response.composition);
          results[uid] = json;
          cachedComposition.setDocument(json);
          if (index === lastIndex) {
            return callback(results);
          }
          else {
            getNext.call(_this, index);
          }
        });
      });
    }
  }

  getNext.call(this, -1);
};
