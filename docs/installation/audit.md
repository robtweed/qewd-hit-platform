# Audit Service

- [Background](#background)
- [Configuration](#configuration)
- [Starting the Audit MicroService](#starting-the-audit-microservice)
- [Persisting Data on the Audit Service](#persisting-data-on-the-audit-service)


## Background

This service maintains a log / audit trail of all incoming API requests that were handled by
the Orchestrator.  They are saved to the YottaDB database on this MicroService instance.


## Configuration

All you need to do is to add the Orchestrator's JWT secret to its *config.json* file, as follows:

Take a look at the Orchestrator's *config.json* file, eg:

        ~/qewd-hit-platform/main/configuration/config.json

and locate the lines at the end that define the JWT secret (this will have been
assigned automatically with a randomly-generated uid value).  For example:


        "jwt": {
          "secret": "d7060194-7737-4052-a98a-c7cc364391fa"
        }

Copy and paste these lines to the end of the Audit service's *config.json* file, eg:

        ~/qewd-hit-platform/audit-ms/configuration/config.json

For example, it should look something like this:


        {
          "qewd_up": true,
          "ms_name": "audit_service",
          "qewd": {
            "serverName": "Audit Service",
            "poolSize": 3
          },
          "imported": true,
          "jwt": {
            "secret": "d7060194-7737-4052-a98a-c7cc364391fa"
          }
        }



## Starting the Audit MicroService

You can now start the Audit MicroService.

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


## Persisting Data on the Audit Service

The Audit Service stores the request details within its integrated YottaDB database. This data will be lost
 if you stop and restart the Audit Service Container.  

If you want to ensure that the audit data is retained between restarts, you can map the YottaDB database files to
copies held on the host machine.  

[See here for further information](https://github.com/robtweed/yotta-gbldir-files) on how to do this, and
where to obtain pre-initialised versions of the YottaDB database files.

