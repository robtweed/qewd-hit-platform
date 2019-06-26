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

 01 October 2018

*/

"use strict"

var React = require('react');
var createReactClass = require('create-react-class');
var ReactBootstrap = require('react-bootstrap');

var {
  Button,
  Modal
} = ReactBootstrap;

var FormField = require('./FormField');

var ChangePasswordModal = createReactClass({

  componentWillMount: function() {
    this.controller = require('./controller-ChangePasswordModal').call(this, this.props.controller);
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

    return (

      <Modal
        show={true}
        backdrop='static'
        bsStyle='primary' 
        animation={true} 
        onKeyPress={this.handleKeyDown}
      >

        <Modal.Header>
          <Modal.Title>{this.modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Your new password should be at least 7 characters in length, and contain a mixture of
            upper-case letters, lower-case letters and numbers.
          </p>

          <FormField
            fieldname='password'
            label='Enter your new password'
            type='password'
            controller = {this.controller}
            focus={true}
            value = {this.password}
            formModule = 'ChangePasswordModal'
          />
          <FormField
            fieldname='password2'
            label='Re-enter your new password'
            type='password'
            controller = {this.controller}
            focus={false}
            value = {this.password2}
            formModule = 'ChangePasswordModal'
          />
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.changePassword} bsStyle='primary'>Confirm</Button>
        </Modal.Footer>

      </Modal>
    )
  }
});

module.exports = ChangePasswordModal;
