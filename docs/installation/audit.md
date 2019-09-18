# Audit Service

- [Background](#background)
- [Configuration](#configuration)
- [Re-Starting the Audit MicroService](#re-starting-the-audit-microservice)
- [Persisting Data on the Audit Service](#persisting-data-on-the-audit-service)


## Background

This service maintains a log / audit trail of all incoming API requests that were handled by
the Orchestrator.  They are saved to the YottaDB database on this MicroService instance.

The Audit Service needs to be configured in order to get it working.


## Configuration

Make sure you have first followed the steps for configuring the Orchestrator. Assuming 
you have done, you'll now have the *settings.json* file available for use on the
Audit MicroService.


### Applying the Settings File

If you look in the */audit-ms/configuration* folder, you'll see a *config.json* file.  This is
pre-built for you and will start up the Audit MicroService's QEWD system in a basic installation mode.
You can then apply the settings to fully configure it for use as the QEWD HIT Platform
 Audit MicroService.

Here's the steps:

1) Start the Audit MicroService:

        docker run -it --name audit_service --rm -v ~/qewd-hit-platform/audit-ms:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

2) From another process, shell into the Container:

        docker exec -it audit_service bash

You should see a prompt similar to this:

        root@f49e55e68ae2:/opt/qewd#

Now type the commands:

        cd mapped
        node install

Provided you haven't introduced any JSON syntax errors into the *settings.json* file, you should see:

        Successfully configured the audit_service MicroService
        Restart the audit_service container


You'll find a newly edited file in the */audit-ms/configuration* folder:

- config.json: now ready for full QEWD HIT Platform use


Exit from the Container's shell by typing the command:

        exit


3) You can now stop the Audit MicroService Container by typing *CTRL & C*


## Re-starting the Audit MicroService

You can now re-start the Container which will now run as the fully-configured Audit MicroService.

If you are running all the Microservices on the same host machine, assuming you've created
a Docker network named *qewd-hit*:

        docker run -it --name audit_service --rm --network qewd-hit -v ~/qewd-hit-platform/audit-ms:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

To run the Audit Service Container as a background daemon process, change the *-it* parameter to *-d*:

        docker run -d --name audit_service --rm --network qewd-hit -v ~/qewd-hit-platform/audit-ms:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

If you are running the Audit Service on its own physical host machine, leave out the *--network* parameter, 
and instead, specify the port on which it will listen, eg:

        docker run -it --name audit_service --rm -p 8080:8080 -v ~/qewd-hit-platform/audit-ms:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

The Audit Service will listen on port 8080.  To listen on a different port, change the *-p* parameter, eg:

        -p 3000:8080

Note, the listener port (the first one before the colon) must correspond to the port 
defined in the *settings.json* file for the Audit MicroService.


## Persisting Data on the Audit Service

The Audit Service stores the request details within its integrated YottaDB database. This data will be lost
 if you stop and restart the Audit Service Container.  

If you want to ensure that the audit data is retained between restarts, you can map the YottaDB database files to
copies held on the host machine.  

[See here for further information](https://github.com/robtweed/yotta-gbldir-files) on how to do this, and
where to obtain pre-initialised versions of the YottaDB database files.

