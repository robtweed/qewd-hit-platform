module.exports = function(application) {
  if (!this.permit_application_switch) {
    this.permit_application_switch = {};
  }
  this.permit_application_switch[application] = {
    "qewd-monitor": true
  };
};