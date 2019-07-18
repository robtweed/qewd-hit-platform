# FHIR MPI Service

- [Background](#background)
- [Configuring](#configuring-the-fhir-mpi-service)
- [Starting](#starting-the-fhir-mpi-microService)
- [Persisting Data on the FHIR MPI MicroService](#persisting-data-on-the-fhir-mpi-microService)



## Background

This MicroService maintains patient demographic data, interfaced in FHIR Patient Resource format.

It is a very simple, stripped-back service.  You may want to replace it with a proper
FHIR service, for example the 
[Synanetics ROQR FHIR server](https://github.com/nhsx/open-source-fhir-server/tree/development).


## Configuring the FHIR MPI Service

All you need to do is to add the Orchestrator's JWT secret to its *config.json* file, as follows:

Take a look at the Orchestrator's *config.json* file, eg:

        ~/qewd-hit-platform/main/configuration/config.json

and locate the lines at the end that define the JWT secret (this will have been
assigned automatically with a randomly-generated uid value).  For example:


        "jwt": {
          "secret": "d7060194-7737-4052-a98a-c7cc364391fa"
        }

Copy and paste these lines to the end of the FHIR MPI service's *config.json* file, eg:

        ~/qewd-hit-platform/fhir-mpi/configuration/config.json

For example, it should look something like this:


        {
          "qewd_up": true,
          "ms_name": "mpi_service",
          "qewd": {
            "serverName": "FHIR MPI QEWD Service",
            "poolSize": 3
          },
          "imported": true,
          "jwt": {
            "secret": "d7060194-7737-4052-a98a-c7cc364391fa"
          }
        }


## Starting the FHIR MPI MicroService

You can now start the FHIR MPI MicroService.

If you are running all the Microservices on the same host machine, assuming you've created
a Docker network named *qewd-hit*:

        docker run -it --name mpi_service --rm --network qewd-hit -v ~/qewd-hit-platform/fhir-mpi:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

To run the FHIR MPI Container as a background daemon process, change the *-it* parameter to *-d*:

        docker run -d --name mpi_service --rm --network qewd-hit -v ~/qewd-hit-platform/fhir-mpi:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server


If you are running the FHIR MPI service on its own physical host machine, leave out the *--network* parameter, 
and instead, specify the port on which it will listen, eg:


        docker run -it --name mpi_service --rm -p 8080:8080 -v ~/qewd-hit-platform/fhir-mpi:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server


The FHIR MPI service will listen on port 8080.  To listen on a different port, change the *-p* parameter, eg:

        -p 3000:8080


## Persisting Data on the FHIR MPI MicroService

The OIDC Client does not store any permanent data within its integrated YottaDB database, but any
ephemeral data will be lost if you stop and restart the Orchestrator container.  If you want to
ensure that any YottaDB data is retained between restarts, you can map the YottaDB database files to
copies held on the host machine.  

[See here for further information](https://github.com/robtweed/yotta-gbldir-files) on how to do this, and
where to obtain pre-initialised versions of the YottaDB database files.

