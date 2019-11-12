
var request = require('request');

module.exports = function(responseObj, req, forwardToMS, sendResponse, getJWTproperty) {

  if (responseObj.message.ok) {
    // the shutdown request was authenticated against the OIDC Provider so
    // we can now send shutdown messages to each microservice

    var count = 0;
    var all = 4;
    var _this = this;

    var msg = {
      path: '/qewd/shutdown/audit_service',
      method: 'GET'
    };
    forwardToMS(msg, function(responseObj) {
      console.log('Audit Service requested to shut down');
      count++;
      if (count === all) {
        // now cleanly shut down the orchestrator
        _this.stop();
      }
    });

    msg.path = '/qewd/shutdown/oidc_client';
    forwardToMS(msg, function(responseObj) {
      console.log('OIDC Client requested to shut down');
      count++;
      if (count === all) {
        // now cleanly shut down the orchestrator
        _this.stop();
      }
    });

    msg.path = '/qewd/shutdown/mpi_service';
    forwardToMS(msg, function(responseObj) {
      console.log('FHIR MPI requested to shut down');
      count++;
      if (count === all) {
        // now cleanly shut down the orchestrator
        _this.stop();
      }
    });

    msg.path = '/qewd/shutdown/openehr_service';
    forwardToMS(msg, function(responseObj) {
      console.log('openEHR requested to shut down');
      count++;
      if (count === all) {
        // now cleanly shut down the orchestrator
        _this.stop();
      }
    });

    // send shutdown API message to oidc_provider
    // message.authorization should be used for basic authentication header

    var options = {
      url: responseObj.message.oidc_provider + '/qewd/shutdown',
      headers: {
        Authorization: responseObj.message.authorization,
        'x-requested-with': 'XMLHttpRequest'
      },
      method: 'GET',
      json: true
    };
    request(options, function(error, response, body) {
      console.log(error);
      console.log(response);
    });

  }

};