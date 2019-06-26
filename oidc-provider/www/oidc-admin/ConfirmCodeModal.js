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
  Button,
  ButtonGroup,
  Modal
} = ReactBootstrap;

var FormField = require('./FormField');

var ConfirmCodeModal = createReactClass({

  componentWillMount: function() {
    this.controller = require('./controller-ConfirmCodeModal').call(this, this.props.controller);
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
          <FormField
            fieldname='code'
            label='Confirm that code here'
            type='number'
            controller = {this.controller}
            focus={true}
            value = {this.code}
            formModule = 'ConfirmCodeModal'
          />
        </Modal.Body>

        <Modal.Footer>

          <Button onClick={this.confirmCode} bsStyle='primary'>Confirm</Button>

          <hr />
          <center>
            If you don't receive a code within a couple of minutes,<br />
            click the button below to re-send a new code to your phone<br />
          </center>

          <Button
            onClick = {this.resendCode}
            bsStyle = "info"
            bsSize = "small"
          >
            Send New Code
          </Button>

        </Modal.Footer>

      </Modal>
    )
  }
});

module.exports = ConfirmCodeModal;
