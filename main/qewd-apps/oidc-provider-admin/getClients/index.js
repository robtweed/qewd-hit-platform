var redirect = require('../redirect');

module.exports = function(messageObj, session, send, finished) {

  var params = {
    type: 'clients',
    method: 'GET'
  };

  redirect(params, finished);

};