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

  var self = this;

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
      self.users = responseObj.message.users;
      self.setState({
        status: 'gotUsers'
      });
    }
  });

  controller.send({
    type: 'getUsers'
  });

  this.addUser = function() {
    self.show = {
      table: 'hidden',
      editUser: 'visible',
      confirm: false
    }

    self.user = {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      mobileNumber: '',
      nhsNumber: '',
      hcp_email: '',
      hcp_name: ''
    };

    self.editUserTitle = 'Add a New User';

    self.setState({
      status: 'addUser'
    });
  };

  controller.on('cancelAddUser', function() {
    self.show = {
      table: 'visible',
      editUser: 'hidden',
      confirm: false
    }
    self.setState({
      status: 'cancelAddUser'
    });
  });

  controller.on('editUser', function(user) {
    self.show = {
      table: 'hidden',
      editUser: 'visible',
      confirm: false
    };
    self.user = user;
    self.editUserTitle = 'Edit User';

    self.setState({
      status: 'editUser'
    });
  });

  controller.on('saveUser', function(responseObj) {
    if (!responseObj.message.error) {
      self.show = {
        table: 'visible',
        editUser: 'hidden',
        confirm: false
      }
      controller.send({
        type: 'getUsers'
      });
    }
  });

  controller.on('deleteUser', function(user) {
    self.show = {
      table: 'visible',
      editUser: 'hidden',
      confirm: true
    };
    
    self.userToDelete = {
      email: user.email
    };
    self.setState({
      status: 'confirmDeleteUser'
    });
  });

  this.cancelDelete = function() {
    self.show = {
      table: 'visible',
      editUser: 'hidden',
      confirm: false
    };
    self.setState({
      status: 'deleteCancelled'
    });
  };

  controller.on('deleteUserRecord', function() {
    self.show = {
      table: 'visible',
      editUser: 'hidden',
      confirm: false
    }
    controller.send({
      type: 'getUsers'
    });
  });

  this.confirmDelete = function() {
    controller.send({
      type: 'deleteUserRecord',
      params: {
        id: self.userToDelete.email
      }
    });
  };

  controller.on('sendEmail', function(id) {
    // when response returned from back-end
    // update user details (to unset email send button)
    controller.send({
      type: 'getUsers'
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
