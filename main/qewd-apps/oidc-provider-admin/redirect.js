module.exports = function(params, finished) {

  var response = {
    use_microservice: true,
    request: {
      path: '/oidc/admin/' + params.type,
      method: params.method || 'GET',
      query: params.query,
      body: params.body
    }
  };

  finished(response);

};