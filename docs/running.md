# qewd-hit-platform: QEWD Modular Platform for Health IT Demonstrator
 
Rob Tweed <rtweed@mgateway.com>  
26 June 2019, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed


- [Installing Docker](#install-docker)
- [Installing the HIT Platform Modules](#clone-the-github-repository)
- [Creating a Docker Bridged Network](#creating-a-docker-bridged-network)
- [Configuring and Running the Orchestrator](./installation/orchestrator.md)
- [Configuring and Running the OpenID Connect Provider](./installation/oidc-provider.md)
- [Configuring and Running the OpenID Connect Client](./installation/oidc-client.md)
- [Configuring and Running the FHIR MPI Service](./installation/fhir-mpi.md)

# Installation

## Install Docker 

  (unless already installed)

        curl -sSL https://get.docker.com | sh

To avoid using *sudo* when running *docker* commands:

        sudo usermod -aG docker ${USER}
        su - ${USER}

  NB: You'll be asked to enter your Linux password


## Clone the Github Repository

        git clone https://github.com/robtweed/qewd-hit-platform

Inside this repository, you'll find the following MicroServices and Sub-systems:

- Orchestrator (*main*)
- OIDC Provider
- OIDC Client
- FHIR-based Master Patient Index (MPI)
- OpenEHR interface
- Audit service


## Creating a Docker Bridged Network

If you are going to run all the MicroServices on the same physical host, then you should create
and use a Docker Bridged network which will allow them to intercommunicate very simply.  

To create one named *qewd-hit*:

        docker network create qewd-hit

You can confirm that it has been created by typing:

        docker network ls

You should see something like this:

        rtweed@ubuntu:~/qewd-hit-platform$ docker network ls

        NETWORK ID          NAME                DRIVER              SCOPE
        dab60e86ada9        bridge              bridge              local
        5841bb025492        host                host                local
        1ae43f266662        none                null                local
        164c6f96ed76        qewd-hit            bridge              local


## OpenEHR Interface Service

This service provides a simple-to-use REST interface to an OpenEHR server (eg EtherCIS).

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

You can now start the OpenEHR Interface MicroService:

        docker run -it --name openehr_service --rm --network qewd-hit -p 8084:8080 -v ~/qewd-hit-platform/openehr-ms:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server



## Audit Service

This service maintains a log / audit trail of all incoming API requests that were handled by
the Orchestrator.  They are saved to the YottaDB database on this MicroService instance.

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


### Starting the Audit MicroService

You can now start the Audit MicroService:

        docker run -it --name audit_service --rm --network qewd-hit -p 8085:8080 -v ~/qewd-hit-platform/audit-ms:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

