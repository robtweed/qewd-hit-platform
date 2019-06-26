/*
  Example OIDC Provider Configuration Option settings/overrides
*/


var ttl = {
  IdToken() {
    return 600;
  }
};

module.exports = {
  ttl: ttl
};
