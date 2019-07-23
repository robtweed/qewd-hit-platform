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

 27 September 2018

*/

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');

var {
  Button,
  Modal
} = ReactBootstrap;

var LoginModal = createReactClass({

  componentWillMount: function() {
    this.controller = require('./controller-LoginModal').call(this, this.props.controller);
  },

  render: function() {

    //console.log('LoginModal rendering');
    //var componentPath = this.controller.updateComponentPath(this);

    if (this.props.hideUsername) {
      this.modalTitle = 'Login with the QEWD Management Password';
      this.username = 'dummy';
    }

    return (

      <Modal
        show={this.props.show}
        backdrop='static'
        bsStyle='primary' 
        animation={true} 
        onKeyPress={this.handleKeyDown}
      >

        <Modal.Header>
          <Modal.Title>{this.modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <iframe
            id = "loginFrame"
            height = "50%"
            width = "100%"
            src = {this.props.redirectUrl}
          >
            Content will go here
          </iframe>

        </Modal.Body>

        <Modal.Footer>
        </Modal.Footer>

      </Modal>
    )
  }
});

module.exports = LoginModal;
