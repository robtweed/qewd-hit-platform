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

  this.claims = [];
  this.show = {
    table: 'visible',
    editClaim: 'hidden',
    confirm: false
  }
  this.claim = {
    name: '',
    fields: ''
  };
  this.claimToDelete = {
    id: '',
    name: ''
  };
  this.editClaimTitle = 'Add a New Claim';

  controller.on('getClaims', function(responseObj) {
    if (!responseObj.message.error) {
      self.claims = responseObj.message.claims;
      self.setState({
        status: 'gotClaims'
      });
    }
  });

  controller.send({
    type: 'getClaims'
  });

  this.addClaim = function() {
    self.show = {
      table: 'hidden',
      editClaim: 'visible',
      confirm: false
    }

    self.claim = {
      id: '',
      name: '',
      fields: ''
    };

    self.editClaimTitle = 'Add a New Claim';

    self.setState({
      status: 'addClaim'
    });
  };

  controller.on('cancelAddClaim', function() {
    self.show = {
      table: 'visible',
      editClaim: 'hidden',
      confirm: false
    }
    self.setState({
      status: 'cancelAddClaim'
    });
  });

  controller.on('editClaim', function(claim) {
    self.show = {
      table: 'hidden',
      editClaim: 'visible',
      confirm: false
    };
    self.claim = claim;
    self.editClaimTitle = 'Edit Claim';

    self.setState({
      status: 'editClaim'
    });
  });

  controller.on('saveClaim', function(responseObj) {
    if (!responseObj.message.error) {
      self.show = {
        table: 'visible',
        editClaim: 'hidden',
        confirm: false
      }
      controller.send({
        type: 'getClaims'
      });
    }
  });

  controller.on('deleteClaim', function(claim) {
    self.show = {
      table: 'visible',
      editClaim: 'hidden',
      confirm: true
    };
    
    self.claimToDelete = {
      id: claim.id,
      name: claim.name
    };
    self.setState({
      status: 'confirmDeleteClaim'
    });
  });

  this.cancelDelete = function() {
    self.show = {
      table: 'visible',
      editClaim: 'hidden',
      confirm: false
    };
    self.setState({
      status: 'deleteCancelled'
    });
  };

  controller.on('deleteClaimRecord', function() {
    self.show = {
      table: 'visible',
      editClaim: 'hidden',
      confirm: false
    }
    controller.send({
      type: 'getClaims'
    });
  });

  this.confirmDelete = function() {
    controller.send({
      type: 'deleteClaimRecord',
      params: {
        id: self.claimToDelete.id
      }
    });
  };

  return controller;
};
