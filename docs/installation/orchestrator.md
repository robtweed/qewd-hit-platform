# Configuring and Running the Orchestrator

- [Background](#background)
- [Configuring](#configuring)
- [Starting the Orchestrator](#starting-the-orchestrator)
- [Persisting Data on the Orchestrator](#persisting-data-on-the-orchestrator)


## Background

The Orchestrator provides the externally-facing interface to the QEWD HIT Platform.  It routes
incoming requests to the appropriate MicroServices.


## Configuring

Before starting the HIT Platform's Orchestrator service, you need to configure it.

How you configure the HIT Platform's QEWD-Up Orchestrator depends on whether you want to 
run all the microservices on the same physical host machine, or whether you want to run them
on their own separate servers.


### If Running All Microservices on the same Host Machine

If you are going to run all the MicroServices on the same physical host, then 
you need to create the Orchestrator's *config.json* file.  This is simply a matter of
renaming a pre-built file that has been created for you in the repository.  Assuming you
cloned the repository into your home directory, run the following commands:

        cd ~/qewd-hit-platform/main/configuration
        mv config.json.same_host config.json

You must also ensure that you create a Docker Bridged Network.


### If Running All Microservices on different Host Machines

If you are going to run the MicroServices on different physical host machines, then 
you need to create the Orchestrator's *config.json* file.  This is simply a matter of
renaming and editing a pre-built file that has been created for you in the repository.  

Assuming you cloned the repository into your home directory, run the following commands:

        cd ~/qewd-hit-platform/main/configuration
        mv config.json.different_hosts config.json

Within the *microservices* property of this JSON file, you'll see that each MicroService
has been assigned an IP address and port.  Edit these to match the IP addresses of the host
machines on which you'll be running each MicroService, and, if necessary, edit the port if
you want each MicroService container to listen on a port other than 8080.


## Starting the Orchestrator

You can now start the Orchestrator:

If you are running all the Microservices on the same host machine, assuming you've created
a Docker network named *qewd-hit*:

        docker run -it --name orchestrator --rm --network qewd-hit -p 8080:8080 -v ~/qewd-hit-platform/main:/opt/qewd/mapped rtweed/qewd-server

The Orchestrator will listen on port 8080.  To listen on a different port, change the *-p* parameter, eg:

        -p 3000:8080

To run the orchestrator container as a background daemon process, change the *-it* parameter to *-d*:

        docker run -d --name orchestrator --rm --network qewd-hit -p 8080:8080 -v ~/qewd-hit-platform/main:/opt/qewd/mapped rtweed/qewd-server


If you are running the Orchestrator on its own physical host machine, leave out the *--network* parameter, eg:


        docker run -d --name orchestrator --rm -p 8080:8080 -v ~/qewd-hit-platform/main:/opt/qewd/mapped rtweed/qewd-server


## Persisting Data on the Orchestrator

The Orchestrator does not store any permanent data within its integrated YottaDB database, but any
ephemeral data will be lost if you stop and restart the Orchestrator container.  If you want to
ensure that any YottaDB data is retained between restarts, you can map the YottaDB database files to
copies held on the host machine.  

[See here for further information](https://github.com/robtweed/yotta-gbldir-files) on how to do this, and
where to obtain pre-initialised versions of the YottaDB database files.



