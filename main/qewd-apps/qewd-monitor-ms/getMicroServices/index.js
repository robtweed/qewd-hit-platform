var config = require('/opt/qewd/mapped/configuration/config.json');

module.exports = function(messageObj, session, send, finished) {

  console.log('running handler for getMicroServices');

  var msArr = [];
  config.microservices.forEach(function(ms) {
    msArr.push(ms.name);
  });

  finished({microservices: msArr});

};
