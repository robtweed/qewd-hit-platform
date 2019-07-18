# OpenEHR Interface Service

- [Background](#background)
- [Configuration](#configuration)
- [Starting the OpenEHR Interface MicroService](#starting-the-openehr-interface-microService)
- [Persisting Data on the OpenEHR Interface Service](#persisting-data-on-the-openehr-interface-service)


## Background

This service provides a simple-to-use REST interface to an OpenEHR server (eg EtherCIS).

It allow the retrieval and posting/updating of instances of templates against a patient, using
the Flat JSON representation of a template as the basis of the input and output of patient
clinical data.



## Configuration

There are two steps to configuring it:

- set the correct IP address/Domain Name for the OpenEHR server that you are interfacing

- add the Orchestrator's JWT secret to its *config.json* file.


### Configuring your OpenEHR server

Assuming you cloned the repository into your home directory, you need to edit the file:

        ~/qewd-hit-platform/openehr-ms/configuration/openehr.json


YOu need to change the second line:

        "host": "http://192.168.1.200:8080",

to point instead to the IP address/Domain name and port of your OpenEHR server



### Adding the Orchestrator's JWT Secret

Take a look at the Orchestrator's *config.json* file, eg:

        ~/qewd-hit-platform/main/configuration/config.json

and locate the lines at the end that define the JWT secret (this will have been
assigned automatically with a randomly-generated uid value).  For example:


        "jwt": {
          "secret": "d7060194-7737-4052-a98a-c7cc364391fa"
        }

Copy and paste these lines to the end of the OpenEHR service's *config.json* file, eg:

        ~/qewd-hit-platform/openehr-ms/configuration/config.json

For example, it should look something like this:


        {
          "qewd_up": true,
          "ms_name": "openehr_service",
          "qewd": {
            "serverName": "OpenEHR Service",
            "poolSize": 3
          },
          "imported": true,
          "jwt": {
            "secret": "d7060194-7737-4052-a98a-c7cc364391fa"
          }
        }


### Starting the OpenEHR Interface MicroService

You can now start the OpenEHR Interface MicroService.

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


## Persisting Data on the OpenEHR Interface Service

The OpenEHR Interface service does not store any permanent data within its integrated YottaDB database, but any
ephemeral data will be lost if you stop and restart the Orchestrator container.  If you want to
ensure that any YottaDB data is retained between restarts, you can map the YottaDB database files to
copies held on the host machine.  

[See here for further information](https://github.com/robtweed/yotta-gbldir-files) on how to do this, and
where to obtain pre-initialised versions of the YottaDB database files.
