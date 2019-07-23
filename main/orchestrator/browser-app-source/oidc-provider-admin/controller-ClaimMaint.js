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

  var _this = this;

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
      _this.claims = responseObj.message.claims;
      _this.setState({
        status: 'gotClaims'
      });
    }
  });

  controller.send({
    type: 'getClaims'
  });

  this.addClaim = function() {
    _this.show = {
      table: 'hidden',
      editClaim: 'visible',
      confirm: false
    }

    _this.claim = {
      id: '',
      name: '',
      std: '',
      custom: ''
    };

    _this.editClaimTitle = 'Add a New Claim';

    _this.setState({
      status: 'addClaim'
    });
  };

  controller.on('cancelAddClaim', function() {
    _this.show = {
      table: 'visible',
      editClaim: 'hidden',
      confirm: false
    }
    _this.setState({
      status: 'cancelAddClaim'
    });
  });

  controller.on('editClaim', function(claim) {
    _this.show = {
      table: 'hidden',
      editClaim: 'visible',
      confirm: false
    };
    _this.claim = claim;
    _this.claim.exists = true;
    _this.editClaimTitle = 'Edit Claim';

    _this.setState({
      status: 'editClaim'
    });
  });

  controller.on('saveClaim', function(responseObj) {
    if (!responseObj.message.error) {
      _this.show = {
        table: 'visible',
        editClaim: 'hidden',
        confirm: false
      }
      controller.send({
        type: 'getClaims'
      });
    }
  });

  controller.on('deleteThisClaim', function(claim) {
    _this.show = {
      table: 'visible',
      editClaim: 'hidden',
      confirm: true
    };
    
    _this.claimToDelete = {
      id: claim.id,
      name: claim.name
    };
    _this.setState({
      status: 'confirmDeleteClaim'
    });
  });

  this.cancelDelete = function() {
    _this.show = {
      table: 'visible',
      editClaim: 'hidden',
      confirm: false
    };
    _this.setState({
      status: 'deleteCancelled'
    });
  };

  controller.on('deleteClaim', function() {
    _this.show = {
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
      type: 'deleteClaim',
      params: {
        name: _this.claimToDelete.name
      }
    });

    _this.show = {
      table: 'visible',
      editClaim: 'hidden',
      confirm: false
    };
    _this.setState({
      status: 'deleteCancelled'
    });

  };

  return controller;
};
