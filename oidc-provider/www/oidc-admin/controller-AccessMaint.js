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

  this.maintainers = [];
  this.show = {
    table: 'visible',
    editAccess: 'hidden',
    confirm: false
  }
  this.access = {
    id: '',
    email: '',
    mobileNo: '',
    name: '',
    userType: 'userMaint'
  };
  this.userToDelete = {
    email: ''
  };
  this.editAccessTitle = 'Add a New Person who can maintain User Details';

  controller.on('getMaintainers', function(responseObj) {
    if (!responseObj.message.error) {
      self.maintainers = responseObj.message.maintainers;
      self.maintainers.forEach(function(user, index) {
        var type = user.userType;
        var typeDesc = 'Administrator';
        if (type === 'userMaint') typeDesc = 'User Maintainance Only';
        self.maintainers[index].typeDesc = typeDesc;
      });
      //console.log('*** this.maintainers = ' + JSON.stringify(self.maintainers, null, 2));

      self.setState({
        status: 'gotMaintainers'
      });
    }
  });

  controller.send({
    type: 'getMaintainers'
  });

  this.addAccess = function() {
    self.show = {
      table: 'hidden',
      editAccess: 'visible',
      confirm: false
    }

    self.access = {
      id: '',
      email: '',
      mobileNo: '',
      name: '',
      userType: 'userMaint'
    };

    self.editAccessTitle = 'Add a New Person who can maintain User Details';

    self.setState({
      status: 'addAccess'
    });
  };

  controller.on('cancelAddAccess', function() {
    self.show = {
      table: 'visible',
      editAccess: 'hidden',
      confirm: false
    }
    self.setState({
      status: 'cancelAddAccess'
    });
  });

  controller.on('editAccess', function(user) {
    console.log('&& editAccess - user = ' + JSON.stringify(user, null, 2));
    self.show = {
      table: 'hidden',
      editAccess: 'visible',
      confirm: false
    };
    self.access = user;
    self.editAccessTitle = 'Edit Person who can maintain User Details';

    self.setState({
      status: 'editAccess'
    });
  });

  controller.on('saveMaintainer', function(responseObj) {
    if (!responseObj.message.error) {
      self.show = {
        table: 'visible',
        editAccess: 'hidden',
        confirm: false
      }
      controller.send({
        type: 'getMaintainers'
      });
    }
  });

  controller.on('deleteAccess', function(user) {
    self.show = {
      table: 'visible',
      editAccess: 'hidden',
      confirm: true
    };
    
    self.userToDelete = {
      email: user.email
    };
    self.setState({
      status: 'confirmDeleteAccess'
    });
  });

  this.cancelDelete = function() {
    self.show = {
      table: 'visible',
      editAccess: 'hidden',
      confirm: false
    };
    self.setState({
      status: 'deleteCancelled'
    });
  };

  controller.on('deleteMaintainer', function() {
    self.show = {
      table: 'visible',
      editAccess: 'hidden',
      confirm: false
    }
    controller.send({
      type: 'getMaintainers'
    });
  });

  this.confirmDelete = function() {
    controller.send({
      type: 'deleteMaintainer',
      params: {
        id: self.userToDelete.email
      }
    });
  };

  controller.on('sendEmail', function(id) {
    // when response returned from back-end
    // update maintainer details (to unset email send button)
    controller.send({
      type: 'getMaintainers'
    });
  });

  controller.on('sendAccessEmail', function(id) {
    controller.send({
      type: 'sendEmail',
      params: {
        type: 'Access',
        id: id
      }
    });
  });

  return controller;
};
