var redirect = require('../redirect');

module.exports = function(messageObj, session, send, finished) {

  var params = {
    type: 'user',
    method: 'POST',
    body: messageObj.params
  };

  redirect(params, finished);

};