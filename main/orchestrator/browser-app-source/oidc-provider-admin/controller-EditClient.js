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

  this.cancel = function() {
    controller.emit('cancelAddClient');      
  };

  controller.EditClient = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      _this[inputObj.ref] = inputObj.value;
    }
  };

  this.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      _this.saveClient();
    }
  };

  this.saveClient = function() {

    var id = _this.props.data.id || '';

    if (typeof _this.client_id !== 'string' || _this.client_id === '') {
      controller.displayError('You must enter a Client Id');
      return;
    }

    if (typeof _this.client_secret !== 'string' || _this.client_secret === '') {
      controller.displayError('You must enter a Client Secret');
      return;
    }

    if (typeof _this.redirect_uri_path !== 'string' || _this.redirect_uri_path === '') {
      controller.displayError('You must enter a Redirect URI Path, eg /api/auth/token');
      return;
    }

    if (typeof _this.post_logout_uri_path !== 'string') {
      controller.displayError('You must enter a valid Post-Logout Redirect URI Path, eg /');
      return;
    }

    // send save message
    //   response handlersubscription - on('saveClient') - is in parent component (ClientMaint)

    controller.send({
      type: 'saveClient',
      params: {
        id: id,
        client_id: _this.client_id,
        client_secret: _this.client_secret,
        redirect_uri_path: _this.redirect_uri_path,
        post_logout_uri_path: _this.post_logout_uri_path,
        home_page_url: _this.home_page_url,
        login_form_title: _this.login_form_title
      }
    });

  };

  return controller;
};
