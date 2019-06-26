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

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactToastr = require('react-toastr');
var jQuery = require('jquery');
window.$ = window.jQuery = jQuery;

var {ToastContainer} = ReactToastr;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

var LoginModal = require('./LoginModal');
var Banner = require('./Banner');
var Content = require('./Content');
var Shutdown = require('./Shutdown');

var controller;
var title = 'QEWD Monitor';

var MainPage = createReactClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    controller = require('./controller-MainPage').call(this, this.props.controller);
  },

  render: function() {

     //console.log('rendering MainPage');
     //var componentPath = controller.updateComponentPath(this);

     if (this.state.status === 'shutdown') {
       return (
         <Shutdown
           title = {title} 
         />
       );
     }

     return (
      <div>
        <Banner
          title = {title}
          controller = {controller}
        />

        <ToastContainer 
          ref={ref => this.toastContainer = ref}
          className="toast-top-right"
          newestOnTop={true}
          target="body"
        />

        <LoginModal
          controller = {controller}
          show = {this.showLoginModal}
        />

        <Content
          controller = {controller}
          status = {this.state.status}
        />

      </div>

    );
  }
});

module.exports = MainPage;
