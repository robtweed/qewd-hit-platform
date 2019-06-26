module.exports = function(params, finished) {

  var response = {
    use_microservice: true,
    request: {
      path: '/qewd-monitor/' + params.ms_name + '/' + params.resource,
      method: params.method || 'GET',
      query: params.query,
      body: params.body
    }
  };

  finished(response);

};