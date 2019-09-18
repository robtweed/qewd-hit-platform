# OpenEHR Interface Service

- [Background](#background)
- [Configuring the Container](#configuring-the-container)
  - [Applying the Settings File](#applying-the-settings-file)
  - [Configuring your OpenEHR server](#configuring-your-openehr-server)
- [Restarting the OpenEHR Interface MicroService](#re-starting-the-openehr-interface-microService)
- [Persisting Data on the OpenEHR Interface Service](#persisting-data-on-the-openehr-interface-service)


## Background

This service provides a simple-to-use REST interface to an OpenEHR server (eg EtherCIS).

It allow the retrieval and posting/updating of instances of templates against a patient, using
the Flat JSON representation of a template as the basis of the input and output of patient
clinical data.

The OpenEHR Service needs to be configured in order to get it working.  There are 2 steps to this:

- configuring the container using the *settings.json* file
- configuring access to the OpenEHR machine to which this MicroService will provide the interface


## Configuring the Container

Make sure you have first followed the steps for configuring the Orchestrator. Assuming 
you have done, you'll now have the *settings.json* file available for use on the
OpenEHR MicroService.


### Applying the Settings File

If you look in the */openehr-ms/configuration* folder, you'll see a *config.json* file.  This is
pre-built for you and will start up the OpenEHR MicroService's QEWD system in a basic installation mode.
You can then apply the settings to fully configure it for use as the QEWD HIT Platform
 OpenEHR MicroService.

Here's the steps:

1) Start the OpenEHR MicroService:

        docker run -it --name openehr_service --rm -v ~/qewd-hit-platform/openehr-ms:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

2) From another process, shell into the Container:

        docker exec -it openehr_service bash

You should see a prompt similar to this:

        root@f49e55e68ae2:/opt/qewd#

Now type the commands:

        cd mapped
        node install

Provided you haven't introduced any JSON syntax errors into the *settings.json* file, you should see:

        Successfully configured the openehr_service MicroService
        Restart the openehr_service container


You'll find a newly edited file in the */openehr-ms/configuration* folder:

- config.json: now ready for full QEWD HIT Platform use


Exit from the Container's shell by typing the command:

        exit


3) You can now stop the OpenEHR MicroService Container by typing *CTRL & C*


### Configuring your OpenEHR server

Assuming you cloned the repository into your home directory, you now need to edit the file:

        ~/qewd-hit-platform/openehr-ms/configuration/openehr.json


YOu need to change the second line:

        "host": "http://192.168.1.200:8080",

to point instead to the IP address/Domain name and port of your OpenEHR server


In most cases this is all you will need to change.


## Restarting the OpenEHR Interface MicroService

You can now re-start the Container which will now run as the fully-configured OpenEHR Interface MicroService.

If you are running all the Microservices on the same host machine, assuming you've created
a Docker network named *qewd-hit*:

        docker run -it --name openehr_service --rm --network qewd-hit -v ~/qewd-hit-platform/openehr-ms:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

To run the OpenEHR Interface Container as a background daemon process, change the *-it* parameter to *-d*:

        docker run -d --name openehr_service --rm --network qewd-hit -v ~/qewd-hit-platform/openehr-ms:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

If you are running the OpenEHR Interface service on its own physical host machine, leave out 
the *--network* parameter, and instead, specify the port on which it will listen, eg:

        docker run -d --name openehr_service --rm -p 8080:8080 -v ~/qewd-hit-platform/openehr-ms:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

The OpenEHR Interface service will listen on port 8080.  To listen on a different port, 
change the *-p* parameter, eg:

        -p 3000:8080

Note, the listener port (the first one before the colon) must correspond to the port 
defined in the *settings.json* file for the OpenEHR MicroService.


## Persisting Data on the OpenEHR Interface Service

The OpenEHR Interface service does not store any permanent data within its integrated YottaDB database, but any
ephemeral data will be lost if you stop and restart the Orchestrator container.  If you want to
ensure that any YottaDB data is retained between restarts, you can map the YottaDB database files to
copies held on the host machine.  

[See here for further information](https://github.com/robtweed/yotta-gbldir-files) on how to do this, and
where to obtain pre-initialised versions of the YottaDB database files.
