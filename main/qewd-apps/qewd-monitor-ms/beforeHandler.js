  module.exports = function(messageObj, session, send, finished) {
    //if (messageObj.params && messageObj.params.ms_name) {
    if (messageObj.qewd_destination) {
      // redirect to microservice using route

      /*
      var response = {
        use_microservice: true,
        request: {
          path: '/qewd-monitor-api/' + messageObj.params.ms_name + '/' + messageObj.type,
          method: 'ws:qewd-monitor',
          query: messageObj.params.query,
          body: messageObj.params
        }
      };
      */

      //finished(response);

      finished(messageObj);
      return false;
    }
  };