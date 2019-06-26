var redirect = require('../redirect');

module.exports = function(messageObj, session, send, finished) {

  var params = {
    type: 'users',
    method: 'GET',
    query: {
      client: messageObj.params.client
    }
  };

  redirect(params, finished);

};