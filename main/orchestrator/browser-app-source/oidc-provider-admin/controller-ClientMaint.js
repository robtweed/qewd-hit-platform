/*

 ----------------------------------------------------------------------------
 | qewd-oidc-admin: Administration Interface for QEWD OpenId Connect Server |
 |                                                                          |
 | Copyright (c) 2019 M/Gateway Developments Ltd,                           |
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

 11 April 2019

*/

module.exports = function (controller) {

  var _this = this;

  this.clients = [];
  this.show = {
    table: 'visible',
    editClient: 'hidden',
    confirm: false,
    credentials: false
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
      _this.clients = responseObj.message.clients;
      _this.conductor = responseObj.message.conductor.host + ':' + responseObj.message.conductor.port;
      _this.setState({
        status: 'gotClients'
      });
    }
  });

  controller.send({
    type: 'getClients'
  });

  this.addClient = function() {
    _this.show = {
      table: 'hidden',
      editClient: 'visible',
      confirm: false,
      credentials: false
    }

    _this.client = {
      id: '',
      client_id: '',
      client_secret: '',
      redirect_uri_path: '/api/auth/token',
      post_logout_uri_path: '/'
    };

    _this.editClientTitle = 'Add a New Client';

    _this.setState({
      status: 'addClient'
    });
  };

  controller.on('cancelAddClient', function() {
    _this.show = {
      table: 'visible',
      editClient: 'hidden'
    }
    _this.setState({
      status: 'cancelAddClient'
    });
  });

  controller.on('editClient', function(client) {
    _this.show = {
      table: 'hidden',
      editClient: 'visible',
      confirm: false,
      credentials: false
    };
    _this.client = client;
    _this.editClientTitle = 'Edit Client';

    _this.setState({
      status: 'editClient'
    });
  });

  controller.on('saveClient', function(responseObj) {
    if (!responseObj.message.error) {
      _this.show = {
        table: 'visible',
        editClient: 'hidden',
        confirm: false,
        credentials: false
      }
      controller.send({
        type: 'getClients'
      });
    }
  });

  controller.on('deleteThisClient', function(client) {
    _this.show = {
      table: 'visible',
      editClient: 'hidden',
      confirm: true,
      credentials: false
    };
    
    _this.clientToDelete = {
      id: client.id,
      name: client.client_id
    };
    _this.setState({
      status: 'confirmDeleteClient'
    });
  });

  this.cancelDelete = function() {
    _this.show = {
      table: 'visible',
      editClient: 'hidden',
      confirm: false,
      credentials: false
    };
    _this.setState({
      status: 'deleteCancelled'
    });
  };

  controller.on('deleteClient', function() {
    _this.show = {
      table: 'visible',
      editClient: 'hidden',
      confirm: false,
      credentials: false
    };
    controller.send({
      type: 'getClients'
    });
  });

  this.confirmDelete = function() {
    console.log('sending deleteClient message');
    controller.send({
      type: 'deleteClient',
      params: {
        id: _this.clientToDelete.id
      }
    });
    _this.show = {
      table: 'visible',
      editClient: 'hidden',
      confirm: false,
      credentials: false
    };
    _this.setState({
      status: 'deleteCancelled'
    });
  };

  controller.on('backToClients', function() {
    _this.setState({
      status: 'initial'
    });
  });

  controller.on('maintainUsers', function(client) {
    _this.client = client;
    console.log('selected client: ' + JSON.stringify(client, null, 2));
    _this.setState({
      status: 'userMaint'
    });
  });

  controller.on('displayCredentials', function(client) {
    _this.show = {
      table: 'visible',
      editClient: 'hidden',
      confirm: false,
      credentials: true
    };
    
    _this.clientCredentials = 'Basic ' + Buffer.from(client.client_id + ':' + client.client_secret).toString('base64');
    _this.setState({
      status: 'displayCredentials'
    });
  });

  this.hideCredentials = function() {
    _this.show = {
      table: 'visible',
      editClient: 'hidden',
      confirm: false,
      credentials: false
    };
    _this.setState({
      status: 'hideCredentials'
    });
  };

  return controller;
};
