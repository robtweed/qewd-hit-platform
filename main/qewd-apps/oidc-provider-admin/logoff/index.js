module.exports = function(messageObj, session, send, finished) {

  var response = {
    use_microservice: true,
    request: {
      path: '/auth/logout',
      method: 'GET',
      query: {
        client_id: 'admin'
      }
    }
  };

  if (messageObj.params && messageObj.params.jwt) {
    response.request.headers = {
      authorization: 'Bearer ' + messageObj.params.jwt
    };
  }

  finished(response);
};