module.exports = function(messageObj, session, send, finished) {

  console.log('getOIDCRedirect handler - session - ' + JSON.stringify(session, null, 2));

  var response = {
    use_microservice: true,
    request: {
      path: '/auth/redirect',
      method: 'GET',
      query: {
        client_id: 'qewd-monitor-ms',
        scope: 'openid profile email'
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