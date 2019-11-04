/*

 ----------------------------------------------------------------------------
 | QEWD HIT Platform: Quick Single-Platform Installer                       |
 |                                                                          |
 | Copyright (c) 2019 M/Gateway Developments Ltd,                           |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  4 November 2019

*/

module.exports = function() {

  var ask = this.ask;
  var fs = this.fs;
  var isNumeric = this.isNumeric;
  var npm_install = this.install_module;
  var path = require('path');
  var transform = this.transform;
  var uuid = this.uuid;

  var createJSONFile = fs.createJSONFile;
  var createFile = fs.createFile;

  var helpers = {
    createUuid: function() {
      return uuid();
    },
    createHost: function(protocol, host) {
      if (!host || host === '') {
        return '<!delete>';
      }
      protocol = protocol || 'http';
      return protocol + '://' + host;
    },
    createUri: function(protocol, host, port, path) {
      var uri = protocol + '://' + host;
      if (port === 80 || port === 443) {
        port = '';
      }
      if (port && port !== '') {
        uri = uri + ':' + port;
      }
      if (path) {
        uri = uri + path;
      }
      return uri;
    },
    getExpiry: function(expiry) {
      return expiry/1000;
    }
  };

  function createConfig(serviceName, settings) {
    var config_template_path = '/node/' + serviceName + '/configuration/config_template.json';
    var config_path = '/node/' + serviceName + '/configuration/config.json';

    try {
      var config_template = require(config_template_path);
    }
    catch(err) {
      console.log('Error! Unable to load ' + config_template_path);
      console.log('**** Unable to continue, so Installation has been cancelled ****');
      return false;
    }

    var config = transform(config_template, settings, helpers);
    createJSONFile(config, config_path);
    return true;
  }

  var loggedInText = [
    '<html xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">',
    '  <head>',
    '    <title id="{{title}}"></title>',
    '  </head>',
    '  <body>',
    '    <script>',
    '      window.parent.postMessage("loggedIn", "{{uri}}");',
    '    </script>',
    '    <div>',
    '      Logged In.  Please wait...',
    '    </div>',
    '  </body>',
    '</html>'
  ];

  var start_containers = [
    "#!/usr/bin/env bash",
    "# This script will correctly start all the containers that constitute the QEWD HIT Platform",
    "#",
    "#  You will need to change ownership of this file from root, eg:",
    "#",
    "#     sudo chown ripple:ripple startup.sh",  
    "#",
    "#  Then run this startup script from the QEWD HIT Platform folder using:",
    "#",
    "#     source startup.sh",  
    "#",
    "docker run -d --name orchestrator --rm --network {{docker_network.qewd}} -p {{orchestrator.port}}:8080 -v {{volume_path}}/main:/opt/qewd/mapped rtweed/qewd-server",
    "docker run -d --name oidc_provider --rm -p {{oidc_provider.port}}:8080 -v {{volume_path}}/oidc-provider:/opt/qewd/mapped rtweed/qewd-server",
    "docker run -d --name oidc_client --rm --network {{docker_network.qewd}} -v {{volume_path}}/oidc-client:/opt/qewd/mapped -e mode=\"microservice\" rtweed/qewd-server",
    "docker run -d --name mpi_service --rm --network {{docker_network.qewd}} -v {{volume_path}}/fhir-mpi:/opt/qewd/mapped -e mode=\"microservice\" rtweed/qewd-server",
    "docker run -d --name openehr_service --rm --network {{docker_network.qewd}} -v {{volume_path}}/openehr-ms:/opt/qewd/mapped -e mode=\"microservice\" rtweed/qewd-server",
    "docker run -d --name audit_service --rm --network {{docker_network.qewd}} -v {{volume_path}}/audit-ms:/opt/qewd/mapped -e mode=\"microservice\" rtweed/qewd-server",
    "docker run -d --rm --name ethercis-db --net {{docker_network.ethercis}} -p 5432:5432 rtweed/ethercis-db",
    "docker run -d --rm --name ethercis-server --net {{docker_network.ethercis}} -e DB_IP=ethercis-db -e DB_PORT=5432 -e DB_USER=postgres -e DB_PW=postgres -p {{openehr.port}}:8080 rtweed/ethercis-server"
  ];

  var stop_containers = [
    "#!/usr/bin/env bash",
    "# This script will stop ALL the containers that constitute the QEWD HIT Platform",
    "#",
    "#  You will need to change ownership of this file from root, eg:",
    "#",
    "#     sudo chown ripple:ripple shutdown.sh",
    "#",
    "#  The run this script from the QEWD HIT Platform folder using:",
    "#",
    "#     source shutdown.sh",
    "#",
    "docker stop orchestrator",
    "docker stop oidc_provider",
    "docker stop oidc_client",
    "docker stop mpi_service",
    "docker stop openehr_service",
    "docker stop audit_service",
    "docker stop ethercis-db",
    "docker stop ethercis-server"
  ];

  console.log('*************** QEWD HIT Platform Installer ***************');
  console.log(' ');
  console.log('  Running this script will configure the entire');
  console.log('  QEWD HIT Platform to run on a single server');

  var ok = ask.keyInYNStrict('Is this what you want to do?');

  if (!ok) {
    console.log('**** Installation has been cancelled ****');
    return;
  }

  console.log('*** Installation will now begin ****');
  console.log(' ');
  console.log('You first need to specify the IP address or domain name of this');
  console.log('server, on which you\'ll be running the QEWD HIT Platform components');
  console.log('This IP address or domain name MUST be externally accessible');

  var ok = false;
  var ipAddress;
  var proceed;
  do {
    console.log(' ');
    ipAddress = ask.question('Server IP addresss or domain name: ', {});
    if (ipAddress !== '' && ipAddress !== 'localhost' && ipAddress !== '127.0.0.1') {
      console.log(' ');
      console.log('*** QEWD HIT Platform is to be configured using ' + ipAddress);
      proceed = ask.keyInYNStrict('Is this what you want to do?');
      if (proceed) {
        ok = true;
      }
    }
    else if (ipAddress === '') {
      ok = true;
    }
    else {
      console.log('*** Error: you cannot use localhost or 127.0.0.1');
    }
  } while (!ok);

  if (ipAddress === '') {
    console.log('**** Installation has been cancelled ****');
    return;
  }

  console.log('*** Installation will now commence');

  // Orchestrator

  var settingsTemplatePath = '/node/main/configuration/settings.json.same_host_example';
  var settingsPath = '/node/main/configuration/settings.json';

  if (!fs.existsSync(settingsTemplatePath)) {
    console.log('Unable to find settings file: ' + settingsTemplatePath);
    console.log('**** Unable to continue, so Installation has been cancelled ****');
    return;
  }

  var settings;
  fs.copySync(settingsTemplatePath, settingsPath, {overwrite: true});

  try {
    settings = require(settingsPath);
  }
  catch(err) {
    console.log(err);
    console.log('Error! Unable to load ' + settingsPath);
    console.log('**** Unable to continue, so Installation has been cancelled ****');
    return;
  }

  settings.orchestrator.host = ipAddress;
  settings.oidc_provider.host = ipAddress;
  settings.openehr.host = ipAddress;
  var port;

  // Orchestrator Port

  ok = false;
  port = settings.orchestrator.port;
  do {
    console.log(' ');
    console.log('Now specify the port on which the Orchestrator will listen.');
    console.log('Note: this port must be externally-accessible'); 
    console.log(' ');
    port = ask.question('Orchestrator port (' + port + '): ', {defaultInput: port});
    if (port !== '' && isNumeric(port)) {
      ok = true;
    }
    else {
      console.log('*** Error: you must enter a valid port number');
      port = settings.orchestrator.port;
    }
  } while (!ok);

  console.log(' ');
  console.log('Orchestrator Port will be ' + port);
  if (port === 80) {
    port = '';
  }
  settings.orchestrator.port = port;

  settings = transform(settings, {}, helpers);

  //console.log('settings: ' + JSON.stringify(settings, null, 2));

  //createJSONFile(settings, 'settings.json');

  var config_template;
  var config_template_path = '/node/main/configuration/config_template.json';
  var config_path = '/node/main/configuration/config.json';
  var config;

  try {
    config = require(config_path);
    if (config.jwt && config.jwt.secret) {
      settings.jwt_secret = config.jwt.secret;
    }
  }
  catch(err) {
    console.log('Error! Unable to load ' + config_path);
  }

  try {
    config_template = require(config_template_path);
  }
  catch(err) {
    console.log('Error! Unable to load ' + config_template_path);
    console.log('**** Unable to continue, so Installation has been cancelled ****');
    return;
  }

  var config = transform(config_template, settings, helpers);

  //console.log('config: ' + JSON.stringify(config, null, 2));

  createJSONFile(config, config_path);

  var params;
  var html;
  var fileName;
  var filePath;
  for (var appName in settings.orchestrator.applications) {
    params = {
      title: settings.orchestrator.applications[appName],
      uri: helpers.createUri(settings.orchestrator.protocol, settings.orchestrator.host, settings.orchestrator.port)
    };
    html = transform(loggedInText, params, helpers);
    filePath = path.join('/node/main/orchestrator/www', appName, 'loggedIn.html');
    createFile(html, filePath);
  }

  console.log('Successfully configured the HIT Platform Orchestrator');

  //  openEHR MicroService

  ok = false;
  port = settings.openehr.port;
  do {
    console.log(' ');
    console.log('Now specify the port on which the EtherCIS openEHR Server \nContainer will listen.');
    console.log('Note: this port must be externally-accessible'); 
    console.log(' ');
    port = ask.question('openEHR port (' + port + '): ', {defaultInput: port});
    if (port !== '' && isNumeric(port)) {
      if (port === settings.orchestrator.port) {
        console.log('*** Error: that port is assigned to the Orchestrator');
      }
      else {
        ok = true;
      }
    }
    else {
      console.log('*** Error: you must enter a valid port number');
      port = settings.openehr.port;
    }
  } while (!ok);

  console.log(' ');
  console.log('openEHR Port will be ' + port);
  if (port === 80) {
    port = '';
  }
  settings.openehr.port = port;

  ok = createConfig('openehr-ms', settings);
  if (!ok) return;

  var openehr;
  var openehr_path = '/node/openehr-ms/configuration/openehr.json';
  try {
    openehr = require(openehr_path);
  }
  catch(err) {
    console.log('Error! Unable to load ' + openehr_path);
    console.log('**** Unable to continue, so Installation has been cancelled ****');
    return;
  }

  openehr.host = 'http://' + ipAddress;
  if (port !== '') {
    openehr.host = openehr.host + ':' + port;
  }
  createJSONFile(openehr, openehr_path);

  console.log('Successfully configured the openehr_service MicroService');


  //  OIDC Provider

  ok = false;
  port = settings.oidc_provider.port;
  do {
    console.log(' ');
    console.log('Now specify the port on which the OpenID Connect (OIDC) Provider \nContainer will listen.');
    console.log('Note: this port must be externally-accessible'); 
    console.log(' ');
    port = ask.question('OIDC Provider port (' + port + '): ', {defaultInput: port});
    if (port !== '' && isNumeric(port)) {
      if (port === settings.orchestrator.port) {
        console.log('*** Error: that port is assigned to the Orchestrator');
      }
      else if (port === settings.openehr.port) {
        console.log('*** Error: that port is assigned to the openEHR server');
      }
      else {
        ok = true;
      }
    }
    else {
      console.log('*** Error: you must enter a valid port number');
      port = settings.oidc_provider.port;
    }
  } while (!ok);

  console.log(' ');
  console.log('OIDC Provider Port will be ' + port);
  if (port === 80) {
    port = '';
  }
  settings.oidc_provider.port = port;

  ok = createConfig('oidc-provider', settings);
  if (!ok) return;

  var oidc_template;
  var oidc_template_path = '/node/oidc-provider/configuration/oidc_template.json';
  var oidc_path = '/node/oidc-provider/configuration/oidc.json';

  try {
    oidc_template = require(oidc_template_path);
  }
  catch(err) {
    console.log('Error! Unable to load ' + oidc_template_path);
    console.log('**** Unable to continue, so Installation has been cancelled ****');
    return;
  }

  var oidc = transform(oidc_template, settings, helpers);
  //console.log('oidc: ' + JSON.stringify(oidc, null, 2));
  createJSONFile(oidc, oidc_path);

  var data_template;
  var data_template_path = '/node/oidc-provider/configuration/data_template.json';
  var data_path = '/node/oidc-provider/configuration/data.json';
  try {
    data_template = require(data_template_path);
  }
  catch(err) {
    console.log('Error! Unable to load ' + data_template_path);
    console.log('**** Unable to continue, so Installation has been cancelled ****');
    return;
  }

  var data = transform(data_template, settings, helpers);
  //console.log('data: ' + JSON.stringify(data, null, 2));
  createJSONFile(data, data_path);

  console.log('Successfully configured the oidc-provider MicroService');

  //  OIDC Client

  ok = createConfig('oidc-client', settings);
  if (!ok) return;

  var oidc_template;
  var oidc_template_path = '/node/oidc-client/configuration/oidc_template.json';
  var oidc_path = '/node/oidc-client/configuration/oidc.json';

  try {
    oidc_template = require(oidc_template_path);
  }
  catch(err) {
    console.log('Error! Unable to load ' + oidc_template_path);
    console.log('**** Unable to continue, so Installation has been cancelled ****');
    return;
  }

  var oidc = transform(oidc_template, settings, helpers);
  //console.log('oidc: ' + JSON.stringify(oidc, null, 2));
  createJSONFile(oidc, oidc_path);

  console.log('Successfully configured the oidc-client MicroService');


  //  FHIR MPI

  ok = createConfig('fhir-mpi', settings);
  if (!ok) return;
  console.log('Successfully configured the fhir-mpi MicroService');


  //  Audit Service

  ok = createConfig('audit-ms', settings);
  if (!ok) return;
  console.log('Successfully configured the audit-ms MicroService');

  console.log(' ');
  console.log('Now installing microservice dependencies from NPM...');

  var ms_names = fs.getDirectories('/node');

  ms_names.forEach(function(ms) {
    var install_modules_path = '/node/' + ms + '/install_modules.json';

    if (fs.existsSync(install_modules_path)) {
      var modules;
      try {
        modules = require(install_modules_path);
        modules.forEach(function(module) {
          npm_install(module, ms);
        });
      }
      catch(err) {
        console.log('Error! Unable to load ' + modules_path);
        console.log(err);
        return;
      }
    }
  });


  // QEWD Container Docker Network name

  console.log(' ');
  console.log('In order to run the QEWD HIT Containers, you must create');
  console.log('a Docker Bridged Network, to which you\'ll assign a name.');
  console.log('eg you should have invoked a command on your host system such as:');
  console.log(' ');
  console.log('      docker network create qewd-hit');
  console.log(' ');
  console.log('  which would create a Docker network named "qewd-hit"');
  console.log(' ');

  ok = false;
  var network_name = settings.docker_network.qewd;
  do {
    console.log(' ');
    console.log('You now need to confirm the name of the Docker Bridged Network');
    console.log('that you wish to use for your QEWD HIT Platform Containers'); 
    console.log(' ');
    network_name = ask.question('QEWD Docker Network (' + network_name + '): ', {defaultInput: network_name});
    if (network_name !== '') {
      ok = true;
    }
    else {
      console.log('*** Error: you must enter a valid network name');
      network_name = settings.docker_network.qewd;
    }
  } while (!ok);

  console.log(' ');
  console.log('The QEWD Container Docker Network name that will be used is ' + network_name);
  settings.docker_network.qewd = network_name;


  // EtherCIS Bridged Network name

  console.log(' ');
  console.log('In order to run the EtherCIS Containers, you must create');
  console.log('a Docker Bridged Network, to which you\'ll assign a name.');
  console.log('eg you should have invoked a command on your host system such as:');
  console.log(' ');
  console.log('      docker network create ecis-net');
  console.log(' ');
  console.log('  which would create a Docker network named "ecis-net"');
  console.log(' ');
  ok = false;
  network_name = settings.docker_network.ethercis;
  do {
    console.log(' ');
    console.log('You now need to confirm the name of the Docker Bridged Network');
    console.log('that you wish to use for your EtherCIS Containers'); 
    console.log(' ');
    network_name = ask.question('EtherCIS Docker Network (' + network_name + '): ', {defaultInput: network_name});
    if (network_name !== '') {
      ok = true;
    }
    else {
      console.log('*** Error: you must enter a valid network name');
      network_name = settings.docker_network.ethercis;
    }
  } while (!ok);

  console.log(' ');
  console.log('The EtherCIS Container Docker Network name that will be used is ' + network_name);
  settings.docker_network.ethercis = network_name;


  // QEWD HIT Platform Folder for volume mapping

  console.log(' ');
  console.log('The QEWD Docker Containers must map the QEWD HIT Platform folder,');
  console.log('so you need to confirm what the correct folder is.');
  console.log('This installer can then automatically create the correct')
  console.log('"docker run" commands for you in the startup file');
  console.log(' ');
  ok = false;
  var volume_path = settings.volume_path;
  do {
    console.log(' ');
    volume_path = ask.question('QEWD HIT Platform folder (' + volume_path + '): ', {defaultInput: volume_path});
    if (volume_path !== '') {
      ok = true;
    }
    else {
      console.log('*** Error: you must enter a valid volume path');
      volume_path = settings.volume_path;
    }
  } while (!ok);

  console.log(' ');
  console.log('The path that will be volume mapped is ' + volume_path);
  settings.volume_path = volume_path;


  // Create startup file for containers

  console.log(' ');
  console.log('Now creating a startup file for you to use to start all the');
  console.log('Containers on your server');

  var content = transform(start_containers, settings, helpers);
  var filePath = '/node/startup.sh';
  createFile(content, filePath);

  filePath = '/node/shutdown.sh';
  createFile(stop_containers, filePath);

  console.log(' ');
  console.log('*** Installation and Configuration was successful');
  console.log(' ');
  console.log('You can now start up the QEWD MicroService Containers');

  return;

};


