/*

 ------------------------------------------------------------------------------------
 | qewd-monitor: React.js-based Monitor/Management Application for QEWD             |
 |                                                                                  |
 | Copyright (c) 2017-18 M/Gateway Developments Ltd,                                |
 | Redhill, Surrey UK.                                                              |
 | All rights reserved.                                                             |
 |                                                                                  |
 | http://www.mgateway.com                                                          |
 | Email: rtweed@mgateway.com                                                       |
 |                                                                                  |
 |                                                                                  |
 | Licensed under the Apache License, Version 2.0 (the "License");                  |
 | you may not use this file except in compliance with the License.                 |
 | You may obtain a copy of the License at                                          |
 |                                                                                  |
 |     http://www.apache.org/licenses/LICENSE-2.0                                   |
 |                                                                                  |
 | Unless required by applicable law or agreed to in writing, software              |
 | distributed under the License is distributed on an "AS IS" BASIS,                |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.         |
 | See the License for the specific language governing permissions and              |
 |  limitations under the License.                                                  |
 ------------------------------------------------------------------------------------

  24 September 2018

*/

module.exports = function (controller) {

  var _this = this;

  this.data = {};
  this.token = '';
  this.sessionId = '';

  this.title = 'Session Data';

  this.onNewProps = function(newProps) {
    console.log('controller-SessionDetails newProps: ' + JSON.stringify(newProps));
    _this.data = newProps.data.data || {};
    if (typeof newProps.data.id !== 'undefined' && newProps.data.id !== '') {
      _this.title = 'Session ' + newProps.data.id;
    }
    else {
      // previously-displayed session no longer exists
      _this.title = 'Session Data';
      _this.data = {};
    }
    if (newProps.data.token) _this.token = newProps.data.token;
  };

  this.expanded = true;

  var expandText = ' -->';	
  this.expand = false;
  this.isExpanded = function(keypath, value) {
    return _this.expand;
  };


  function index(obj,is, value) {
    if (typeof is == 'string') {
      return index(obj,is.split('.'), value);
    }
    else if (is.length==1 && value!==undefined) {
      return obj[is[0]] = value;
    }
    else if (is.length==0) {
      return obj;
    }
    else {
      return index(obj[is[0]],is.slice(1), value);
    }
  }

  this.nodeClicked = function(obj) {
    if (obj.value === expandText) {
      var message = {
        type: 'getSessionSubscripts',
        params: {
          path: obj.path,
          expandText: expandText,
          token: _this.props.data.token,
          id: _this.props.data.id
        },
        qewd_destination: controller.destination,
        qewd_application: 'qewd-monitor'
      };
      controller.ms_send(message, function(responseObj) {
        if (responseObj.message.error) {
          // session no longer exists, so refresh the entire session display
          //console.log('session no longer exists so refresh session display');
          controller.emit('refreshSessionDisplay');
        }
        else {
          index(_this.data, obj.path, responseObj.message.data);
          _this.expand = true;
          _this.setState({status: 'updated'});
        }
      });
    }
  };

  return controller;
};
