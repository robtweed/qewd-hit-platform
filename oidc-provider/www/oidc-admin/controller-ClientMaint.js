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

module.exports = function (controller) {

  var self = this;

  this.clients = [];
  this.show = {
    table: 'visible',
    editClient: 'hidden',
    confirm: false
  }
  this.conductor = '';
  this.client = {
    client_id: '',
    client_secret: '',
    redirect_uri_path: '/api/auth/token',
    post_logout_uri_path: '/'
  };
  this.clientToDelete = {
    id: '',
    name: ''
  };
  this.editClientTitle = 'Add a New Client';

  controller.on('getClients', function(responseObj) {
    if (!responseObj.message.error) {
      self.clients = responseObj.message.clients;
      self.conductor = responseObj.message.conductor.host + ':' + responseObj.message.conductor.port;
      self.setState({
        status: 'gotClients'
      });
    }
  });

  controller.send({
    type: 'getClients'
  });

  this.addClient = function() {
    self.show = {
      table: 'hidden',
      editClient: 'visible',
      confirm: false
    }

    self.client = {
      id: '',
      client_id: '',
      client_secret: '',
      redirect_uri_path: '/api/auth/token',
      post_logout_uri_path: '/'
    };

    self.editClientTitle = 'Add a New Client';

    self.setState({
      status: 'addClient'
    });
  };

  controller.on('cancelAddClient', function() {
    self.show = {
      table: 'visible',
      editClient: 'hidden'
    }
    self.setState({
      status: 'cancelAddClient'
    });
  });

  controller.on('editClient', function(client) {
    self.show = {
      table: 'hidden',
      editClient: 'visible',
      confirm: false
    };
    self.client = client;
    self.editClientTitle = 'Edit Client';

    self.setState({
      status: 'editClient'
    });
  });

  controller.on('saveClient', function(responseObj) {
    if (!responseObj.message.error) {
      self.show = {
        table: 'visible',
        editClient: 'hidden',
        confirm: false
      }
      controller.send({
        type: 'getClients'
      });
    }
  });

  controller.on('deleteClient', function(client) {
    self.show = {
      table: 'visible',
      editClient: 'hidden',
      confirm: true
    };
    
    self.clientToDelete = {
      id: client.id,
      name: client.client_id
    };
    self.setState({
      status: 'confirmDeleteClient'
    });
  });

  this.cancelDelete = function() {
    self.show = {
      table: 'visible',
      editClient: 'hidden',
      confirm: false
    };
    self.setState({
      status: 'deleteCancelled'
    });
  };

  controller.on('deleteClientRecord', function() {
    self.show = {
      table: 'visible',
      editClient: 'hidden',
      confirm: false
    }
    controller.send({
      type: 'getClients'
    });
  });

  this.confirmDelete = function() {
    controller.send({
      type: 'deleteClientRecord',
      params: {
        id: self.clientToDelete.id
      }
    });
  };

  return controller;
};
