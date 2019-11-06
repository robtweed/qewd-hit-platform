# qewd-hit-platform: QEWD Modular Platform for Health IT Demonstrator
 
Rob Tweed <rtweed@mgateway.com>  
26 June 2019, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

# Background

The QEWD HIT Platform is a set of modular QEWD Containers that interoperate as a demonstrator 
for Healthcare IT integration, and which provide the basic building blocks for an operational system.

The Platform's Containers will run on any Linux server or virtual machine, and also on
a Raspberry Pi (Models 3 or 4).

The HIT Platform is based around some important standard building blocks:

- OpenID Connect (OIDC) for user authentication (*cf* NHS Login)
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

In the [QEWD HIT Platform Github Repository](https://github.com/robtweed/qewd-hit-platform), you'll
see the files for each of these Containers in their own specific folders as follows:

- **main**: the Orchestrator Container
- **oidc-provider**: the OIDC Provider Container
- **oidc-client**: the OIDC Client MicroService Container
- **fhir-mpi**: the FHIR-based MPI MicroService Container
- **openehr-ms**: the OpenEHR Interface MicroService Container
- **audit-ms**: the Audit MicroService Container

The key idea of the QEWD HIT Platform is to remove much of the normal learning curve 
associated with OpenEHR, allowing you to build applications around OpenEHR quickly and simply,
but in a way that can be scaled to enterprise production levels.

See the [presentation slides](http://ec2.mgateway.com/QEWD-HIT-Platform.pdf) for further background
and rationale behind the QEWD HIT Platform.


# Quick Start

If you'd like to try out the QEWD HIt Platform, and also experience its use with the 
[PulseTile](https://ripple.foundation/pulsetile-2/) User Interface, along with a working,
Dockerised openEHR System ([EtherCIS](http://ethercis.org/)), follow these quick and simple
steps:

1) You'll need a Linux server or Virtual Machine, or a Raspberry Pi (Model 3 or 4).

2) [Install Docker](https://github.com/robtweed/qewd-hit-platform/blob/master/docs/running.md#install-docker)
 (if you don't already have it installed)

3) Make sure you are using a non-root user with *sudu* privileges, 
and ensure the user can invoke *docker* commands without needing to
use *sudo* (for the latter, see the instructions in the link for step 2 above)

4) Now, simply run the following commands:

        cd ~
        git clone https://github.com/robtweed/qewd-hit-platform
        cd ~/qewd-hit-platform
        source quick-install.sh

Carefully read the on-screen instructions and answer all the questions.  In most cases, you
 should be able to accept the default that is offered for each question.

5) When the installer is finished, make sure that ports 8000, 8080 and 8081 are externally-accessible.
For example, on Digital Ocean Droplets, you'll need to do the following:

        ufw allow 8000
        ufw allow 8080
        ufw allow 8081

Note: you shouldn't need to do anything on a Raspberry Pi to enable these ports.

6) Fire up all the Docker Containers using:

        source startup.sh

The first time you run this, it has to download the various Docker Containers.  Next time(s)
you run the *startup* command, they will start pretty quickly.

7) You should now have a fully operational system running on your server, and
all the applications provided with the QEWD HIT Platform should be available for use.

For example, to try out the PulseTile UX/UI, in a browser go to:

        http://xx.xx.xx.xx:8080/pulsetile

        where xx.xx.xx.xx is the IP address or domain name of your Linux server


You can watch [this video](https://www.youtube.com/watch?v=nZgSmL2FxMw) which shows 
the quick install process in action.


8) To stop all the Docker Containers:

        cd ~/qewd-hit-platform
        source shutdown.sh


For further details about the QEWD HIT Platform, its moving parts and applications, read the
rest of the documentation shown and linked below.


# OpenEHR

## The QEWD HIT Platform and OpenEHR

The primary aim of the QEWD HIT Platform is to provide a simple, easy-to-understand and
easy-to-use interface to OpenEHR systems, and therefore reduce the otherwise significant
learning curve for which OpenEHR systems are renowned.

The QEWD HIT Platform can integrate with any OpenEHR system.

If you already have access to an OpenEHR system, then you can install and configure the QEWD
HIT Platform to interface with it.

## Running your own OpenEHR System

If you want to set up your own OpenEHR server to use with the QEWD HIT Platform, 
the simplest approach is to use one of the available Dockerised versions of 
[EtherCIS](http://ethercis.org/).  These usually actually consist
of two Docker Containers, one of which provides the REST front-end, whilst the 
other provides the Postgres Database that EtherCIS uses for data storage.

These EtherCIS Docker Containers are used for the Quick Install process described
in the previous section. They implement the latest EtherCIS version 1.3. 

If you're installing manually, then it's best to
install the EtherCIS Containers in the sequence below.  Detailed installation/configuration 
instructions are provided in each of the Github repositories:

- [EtherCIS database server](https://github.com/robtweed/ethercis-db-1.3)
- [EtherCIS front-end server](https://github.com/robtweed/ethercis-server-1.3)



## The QEWD HIT Platform Interface to OpenEHR

The QEWD HIT Platform focuses on the creation, reading and updating of instances of 
a patient's *Clinical Headings* (eg Allergies, Procedures, Medications, etc),
 represented in an OpenEHR system by *Templates*.

It turns out that these interfacing operations (create, read, update) primarily involve the
transformation of one JSON format into another (eg FHIR JSON format to/from
the JSON format used by OpenEHR).

A key feature of the QEWD HIT Platform is that these transformations are performed in a declarative way, 
rather than programmatically, using a transformation template which is, itself, a JSON document.

A key goal of the QEWD HIT Platform is to create, as a result of this declarative JSON transformation
approach, a straightforward, scalable solution that does not require specific programming skills, to
create a set of definitive transformation template documents that can be jointly developed, agreed and shared
across the NHS (and beyond), therefore avoiding the otherwise all too common reinvention of the same 
wheels.

This aspect of the QEWD HIT Platform is therefore important to understand, and is
[documented in detail here](./docs/openehr.md)


# Built-in Applications

The QEWD HIT Platform includes 4 browser-based applications: three for maintenance, configuration
and monitoring of the Platform, and one that demonstrates a simple user interface around the
core MPI and OpenEHR APIs:

- **demo application**: a simple browser-based application that demonstrates the core 
HIT Platform's MPI and OpenEHR APIs

- **openehr-maint**: A browser-based (React) application that allows you to populate and maintain clinical
heading data in your OpenEHR system

- **oidc-provider-admin**: A browser-based (React) application that allows you to maintain the configuration
and user database of your OIDC Provider

- **qewd-monitor-ms**: A browser-based (React) application that allows you to monitor and control the
QEWD environment of each of your QEWD HIT Platform MicroServices.

Note: all four applications use the OIDC Provider for user authentication.



# QEWD HIT Platform Documentation

Installing, configuring, running and using the QEWD HIT Platform is described in the following
documentation:

- [Installation, Configuration & Starting](./docs/running.md)
- [The Demo Application](./docs/demo.md)
- [The OpenEHR Maintenance Application](./docs/openehr-maint.md)
- [The OIDC Provider Administration Application](./docs/oidc-provider-admin.md)
- [The MicroService-Enabled QEWD Monitoring Application](./docs/qewd-monitor-ms.md)

