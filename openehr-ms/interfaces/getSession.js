var request = require('request');

module.exports = function(callback) {

  var loginType = this.openehr.loginType || 'username';  // or 'jwt'
  var options;

  if (loginType === 'username') {

    options = {
      url: this.openehr.host + '/rest/v1/session',
      headers: {
        'x-max-session': this.openehr.sessions.max_number,
        'x-session-timeout': this.openehr.sessions.timeout
      },
      qs: {
        username: this.openehr.username,
        password: this.openehr.password
      },
      method: 'POST',
      json: true
    };

    //console.log('OpenEHR Get Session Options: ' + JSON.stringify(options, null, 2));
    request(options, function(error, response, body) {
      console.log('OpenEHR Get Session: ' + JSON.stringify(response, null, 2));
      console.log('error = ' + JSON.stringify(error));
      if (error && typeof error === 'object') {
        if (error.code === 'ECONNREFUSED') {
          error = error.code + ' on ' + error.address + ':' + error.port +'. OpenEHR system may not be running';
        }
      }
      if (error && error !== '') {
        return callback({
          error: error,
          status: {
            code: 500
          }
        });
      }
      if (response.statusCode !== 200) {
        callback({
          error: response.headers['x-error-message'],
          status: {
            code: response.statusCode
          }
        });
      }
      else {
        callback({sessionId: body.sessionId});
      }
    });

  }
  else {
    callback({error: 'Invalid login type configured: ' + loginType});
  }

};
