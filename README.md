# qewd-hit-platform: QEWD Modular Platform for Health IT Demonstrator
 
Rob Tweed <rtweed@mgateway.com>  
26 June 2019, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

# Background

The QEWD HIT Platform is a set of modular QEWD Containers that interoperate as a demonstrator 
for Healthcare IT integration, and which provide the basic building blocks for an operational system.

The HIT Platform is based around some important standard building blocks:

- OpenID Connect (OIDC) for user authentication (cf NHS Login)
- OpenEHR for clinical information
- FHIR for demographic and other non-clinical information

As such, these very much conform to the vision set out by [NHSX](https://www.nhsx.nhs.uk/).

The platform consists of a set of [QEWD](https://github.com/robtweed/qewd) Containers, 
each of which plays a specific role:

- an **OIDC Provider** which can emulate NHS Login, and which also provides user authentication for
the demonstration and configuration/maintenance applications that are included with the Platform
- an **Orchestrator** service that provides the externally-facing interface to the suite of applications
and MicroServices
- a set of MicroServices:
  - an **OIDC Client** which is responsible for interfacing with the OIDC Provider
  - a simple **FHIR-based Master Patient Index** (MPI) which maintains and serves up patient demographic
information
  - an **OpenEHR Interface** service which greatly simplifies how to maintain and fetch data from OpenEHR
  - an **Audit service** which keeps a log of all incoming requests received by the Orchestrator.

The key idea of the QEWD HIT Platform is to remove much of the normal learning curve 
associated with OpenEHR, allowing you to build applications around OpenEHR quickly and simply,
but in a way that can be scaled to enterprise production levels.

See the [presentation slides](http://ec2.mgateway.com/QEWD-HIT-Platform.pdf) for further background
and rationale behind the QEWD HIT Platform.

In the [QEWD HIT Platform Github Repository](https://github.com/robtweed/qewd-hit-platform), you'll
see the files for each of these Containers in their own specific folders as follows:

- **main**: the Orchestrator Container
- **oidc-provider**: the OIDC Provider Container
- **oidc-client**: the OIDC Client MicroService Container
- **fhir-mpi**: the FHIR-based MPI MicroService Container
- **openehr-ms**: the OpenEHR Interface MicroService Container
- **audit-ms**: the Audit MicroService Container


# OpenEHR

The QEWD HIT Platform can integrate with any OpenEHR system.

If you already have access to an OpenEHR system, then you can install and configure the QEWD
HIT Platform to interface with it.

If you want to set up your own OpenEHR server to use with the QEWD HIT Platform, 
the simplest approach is to use one of the available Dockerised versions of 
[EtherCIS](http://ethercis.org/).  These usually actually consist
of two Docker Containers, one of which provides the REST front-end, whilst the 
other provides the Postgres Database that EtherCIS uses for data storage.

You can try this one which implements the latest EtherCIS version 1.3. It's best to
install them in the sequence below.  Detailed installation/configuration 
instructions are provided in each of the Github repositories:

- [EtherCIS database server](https://github.com/robtweed/ethercis-db-1.3)
- [EtherCIS front-end server](https://github.com/robtweed/ethercis-server-1.3)

Once these are up and running, you can install and configure the QEWD HIT Platform.



# QEWD HIT Platform Documentation

Installing, configuring, running and using the QEWD HIT Platform is described in the following
documentation:

- [Installation, Configuration & Starting](./docs/running.md)
- [The Demo Application](./docs/demo.md)

