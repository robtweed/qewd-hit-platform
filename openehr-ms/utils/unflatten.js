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

  2 September 2019

*/

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function rev(str) {
  return str.split('').reverse().join('');
}

module.exports = function(flatJson) {
  var value;
  var json = {};

  for (var path in flatJson) {
    value = flatJson[path];

    // pre-process to sort out | anomalies

    if (path.indexOf('|') !== -1) {
      var pieces = path.split('|');
      var prev;
      var lc;
      var found = false;
      var xpcs;
      var prevRev;
      for (var i = 1; i < pieces.length; i++) {
        prev = pieces[i - 1];
        lc = prev[prev.length - 1];
        if (isNumeric(lc)) {
          prevRev = rev(prev);
          xpcs = prevRev.split(':');
          if (isNumeric(rev(xpcs[0]))) {
            pieces[0] = pieces[0] + '/';
            found = true;
          }
        }
      }
      if (found) {
        path = pieces.join('|');
      }
    }

    // now begin processing

    pieces = path.split('/');
    var ref = json;
    var lastIndex = pieces.length - 1;
    pieces.forEach(function(piece, ix) {
      var pieces = piece.split(':');
      var name = pieces[0];
      var index = pieces[1];
      if (typeof index === 'undefined') {
        if (typeof ref[name] === 'undefined') {
          if (ix === lastIndex) {
            ref[name] = value;
          }
          else {
            ref[name] = {};
          }
        }
        ref = ref[name];
      }
      else {
        if (typeof ref[name] === 'undefined') {
          ref[name] = [];
          if (ix === lastIndex) {
            ref[name][index] = value;
          }
          else {
            ref[name][index] = {};
          }
        }
        if (typeof ref[name][index] === 'undefined') {
          ref[name][index] = {};
        }
        ref = ref[name][index];
      }
    });
  }
  return json;
}
