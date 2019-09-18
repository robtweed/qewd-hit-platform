# FHIR MPI Service

- [Background](#background)
- [Configuring](#configuring-the-fhir-mpi-service)
- [Starting/Re-starting](#re-starting-the-fhir-mpi-microService)
- [Persisting Data on the FHIR MPI MicroService](#persisting-data-on-the-fhir-mpi-microService)



## Background

This MicroService maintains patient demographic data, interfaced in FHIR Patient Resource format.

It is a very simple, stripped-back service.  You may want to replace it with a proper
FHIR service, for example the 
[Synanetics ROQR FHIR server](https://github.com/nhsx/open-source-fhir-server/tree/development).


The FHIR MPI Service needs to be configured in order to get it working.

## Configuring the FHIR MPI Service

Make sure you have first followed the steps for configuring the Orchestrator. Assuming 
you have done, you'll now have the *settings.json* file available for use on the
FHIR MPI MicroService.


### Applying the Settings File

If you look in the */fhir-mpi/configuration* folder, you'll see a *config.json* file.  This is
pre-built for you and will start up the FHIR MPI MicroService's QEWD system in a basic installation mode.
You can then apply the settings to fully configure it for use as the QEWD HIT Platform
 FHIR MPI MicroService.

Here's the steps:

1) Start the FHIR MPI MicroService:

        docker run -it --name mpi_service --rm -v ~/qewd-hit-platform/fhir-mpi:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

2) From another process, shell into the Container:

        docker exec -it mpi_service bash

You should see a prompt similar to this:

        root@f49e55e68ae2:/opt/qewd#

Now type the commands:

        cd mapped
        node install

Provided you haven't introduced any JSON syntax errors into the *settings.json* file, you should see:

        Successfully configured the mpi_service MicroService
        Restart the mpi_service container


You'll find a newly edited file in the */fhir-mpi/configuration* folder:

- config.json: now ready for full QEWD HIT Platform use


Exit from the Container's shell by typing the command:

        exit


3) You can now stop the FHIR MPI MicroService Container by typing *CTRL & C*


## Re-starting the FHIR MPI MicroService

You can now restart the Container, which will now run as the fully-configured FHIR MPI MicroService.

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

Note, the listener port (the first one before the colon) must correspond to the port 
defined in the *settings.json* file for the FHIR MPI MicroService.


## Persisting Data on the FHIR MPI MicroService

The FHIR MPI MicroService stores patient FHIR data within its integrated YottaDB database, but that
 data will be lost if you stop and restart the FHIR MPI MicroService container.  If you want to
ensure that any YottaDB data is retained between restarts, you can map the YottaDB database files to
copies held on the host machine.  

[See here for further information](https://github.com/robtweed/yotta-gbldir-files) on how to do this, and
where to obtain pre-initialised versions of the YottaDB database files.

