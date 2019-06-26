
module.exports = function(messageObj, session, send, finished) {

  var heading = messageObj.params.heading;
  var patientId = messageObj.params.patientId;
  var records;
  var dataPath = './data/' + heading + '.json';

  try {
    records = require(dataPath);
  }
  catch(err) {
    return finished({error: 'Unable to load ' + dataPath});
  }

  var response = {
    use_microservice: true,
    request: {
      path: '/openehr/populate/' + heading + '/' + patientId,
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + messageObj.token
      },
      body: records
    }
  };

  finished(response);

};