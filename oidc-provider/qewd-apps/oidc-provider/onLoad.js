var oidc_config = require('/opt/qewd/mapped/configuration/oidc.json');

module.exports = function() {
  this.oidc = oidc_config;
};