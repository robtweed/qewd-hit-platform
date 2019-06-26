var request = require('request');

module.exports = function(args, finished) {

  console.log('oidc_admin args: ' + JSON.stringify(args, null, 2));
  var url = this.oidc_client.oidc_provider.host + args.req.path;

  var idToken = args.session.openid.id_token;
  var type = args.type;
  var method = args.req.method;
  var query = args.req.query;
  var body = args.req.body;

  var options = {
    url: url,
    method: method,
    headers: {
      authorization: 'Bearer ' + idToken
    },
    qs: {
      ignore_idToken_expiry: true
    },
    json: true
  };

  if (type === 'users') {
    options.qs.client = query.client;
  }
  if (method === 'DELETE') {
    options.qs = {...options.qs, ...query};
  }
  if (args.req.method === 'POST' || args.req.method === 'PUT') {
    options.body = body;
  }

  console.log('request options: ' + JSON.stringify(options, null, 2));

  request(options, function(error, response, body) {
    if (error) {
      return finished({error: error});
    }
    console.log('** oidc_admin response: ' + JSON.stringify(response, null, 2));
    if (response.statusCode !== 200) {
      var error = response.body;
      if (typeof response.body === 'object') {
        if (response.body.error) {
          error = response.body.error;
        }
        else {
          error = JSON.stringify(response.body);
        }
      }
      finished({error: 'Rejected by OIDC Provider: ' + error});
    }
    else {
      finished(body);
    }
  });
  
};
