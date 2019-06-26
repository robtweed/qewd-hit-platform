var redirect = require('../redirect');

module.exports = function(messageObj, session, send, finished) {

  var params = {
    type: 'user',
    method: 'DELETE',
    query: messageObj.params
  };

  redirect(params, finished);

};