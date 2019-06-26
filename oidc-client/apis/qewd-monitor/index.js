module.exports = function(args, finished) {

  console.log('** executing qewd-monitor/index.js');

  console.trace();

  console.log('** end of trace');

  finished({servername: 'oidc-client'});
};