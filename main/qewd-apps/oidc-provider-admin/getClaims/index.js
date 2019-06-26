var redirect = require('../redirect');

module.exports = function(messageObj, session, send, finished) {

  var params = {
    type: 'claims',
    method: 'GET'
  };

  redirect(params, finished);

};