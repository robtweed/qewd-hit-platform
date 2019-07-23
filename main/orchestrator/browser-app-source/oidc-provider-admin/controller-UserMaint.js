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

 26 September 2018

*/

module.exports = function (controller) {

  var _this = this;

  this.users = [];
  this.show = {
    table: 'visible',
    editUser: 'hidden',
    confirm: false
  }
  this.user = {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    nhsNumber: '',
    hcp_name: ''
  };
  this.userToDelete = {
    email: ''
  };
  this.editUserTitle = 'Add a New User';

  controller.on('getUsers', function(responseObj) {
    if (!responseObj.message.error) {
      _this.users = responseObj.message.users;
      _this.setState({
        status: 'gotUsers'
      });
    }
  });

  controller.send({
    type: 'getUsers',
    params: {
      client: _this.props.client.client_id
    }
  });

  this.goBack = function() {
    controller.emit('backToClients');
  };

  this.addUser = function() {
    _this.show = {
      table: 'hidden',
      editUser: 'visible',
      confirm: false
    }

    _this.user = {
      id: '',
      email: '',
      claims: ''
    };

    _this.editUserTitle = 'Add a New User to Client: ' + _this.props.client.client_id;

    _this.setState({
      status: 'addUser'
    });
  };

  controller.on('cancelAddUser', function() {
    _this.show = {
      table: 'visible',
      editUser: 'hidden',
      confirm: false
    }
    _this.setState({
      status: 'cancelAddUser'
    });
  });

  controller.on('editUser', function(user) {
    _this.show = {
      table: 'hidden',
      editUser: 'visible',
      confirm: false
    };
    _this.user = user;
    _this.editUserTitle = 'Edit User';

    _this.setState({
      status: 'editUser'
    });
  });

  controller.on('saveUser', function(responseObj) {
    if (!responseObj.message.error) {
      _this.show = {
        table: 'visible',
        editUser: 'hidden',
        confirm: false
      }
      controller.send({
        type: 'getUsers',
        params: {
          client: _this.props.client.client_id
        }
      });
    }
  });

  controller.on('deleteThisUser', function(user) {
    _this.show = {
      table: 'visible',
      editUser: 'hidden',
      confirm: true
    };
    
    _this.userToDelete = {
      email: user.email
    };
    _this.setState({
      status: 'confirmDeleteUser'
    });
  });

  this.cancelDelete = function() {
    _this.show = {
      table: 'visible',
      editUser: 'hidden',
      confirm: false
    };
    _this.setState({
      status: 'deleteCancelled'
    });
  };

  controller.on('deleteUser', function() {
    _this.show = {
      table: 'visible',
      editUser: 'hidden',
      confirm: false
    }
    controller.send({
      type: 'getUsers',
      params: {
        client: _this.props.client.client_id
      }
    });
  });

  this.confirmDelete = function() {
    controller.send({
      type: 'deleteUser',
      params: {
        email: _this.userToDelete.email,
        client: _this.props.client.client_id
      }
    });
  };

  controller.on('sendEmail', function(id) {
    // when response returned from back-end
    // update user details (to unset email send button)
    controller.send({
      type: 'getUsers',
      params: {
        client: _this.props.client.client_id
      }
    });
  });

  controller.on('sendUserEmail', function(id) {
    controller.send({
      type: 'sendEmail',
      params: {
        type: 'User',
        id: id
      }
    });
  });

  return controller;
};
