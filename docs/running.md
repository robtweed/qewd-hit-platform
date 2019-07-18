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
- [Configuring and Running the OpenEHR Interface Service](./installation/openehr.md)
- [Configuring and Running the Audit Service](./installation/audit.md)

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



