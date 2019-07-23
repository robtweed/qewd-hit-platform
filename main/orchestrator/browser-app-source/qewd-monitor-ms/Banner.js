/*

 ----------------------------------------------------------------------------
 | qewd-oidc-admin: Administration Interface for QEWD OpenId Connect Server |
 |                                                                          |
 | Copyright (c) 2018 M/Gateway Developments Ltd,                           |
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

 02 October 2018

*/

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');
var {
  Nav,
  Navbar,
  NavItem
} = ReactBootstrap;

var Banner = createReactClass({

  componentWillMount: function() {
    this.controller = require('./controller-Banner').call(this, this.props.controller);
  },

  componentDidUpdate: function() {
    console.log('Banner updated');
  },

  render: function() {
    console.log('render Banner');
    //this.props.controller.updateComponentPath(this);

    console.log('this.props.activeKey = ' + this.props.activeKey);

    var _this = this;
    this.navItems = [];
    var navItem;
    var count = 0;
    this.navs.forEach(function(nav) {
      //if (nav.default) _this.activeKey = nav.eventKey;

      navItem = (
        <NavItem
          eventKey = {nav.eventKey}
          key = {count}
        >
          {nav.text}
        </NavItem>
      );
      _this.navItems.push(navItem);
      count++;
    });

    return (
      <div>
        <Navbar inverse >
          <Navbar.Brand>
            {this.props.controller.app.title}
          </Navbar.Brand>
          <Nav 
            activeKey = {this.props.activeKey}
            onSelect = {this.props.controller.navOptionSelected}
          >
            {this.navItems}
          </Nav>
          <Nav
            pullRight
            onSelect = {this.props.controller.navOptionSelected}
          >
            <NavItem
              eventKey = "reload"
            >
              Back
            </NavItem>
            <NavItem
              eventKey = "logout"
            >
              Logout
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
});

module.exports = Banner;


