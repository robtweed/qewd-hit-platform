# qewd-hit-platform: QEWD Modular Platform for Health IT Demonstrator
 
Rob Tweed <rtweed@mgateway.com>  
26 June 2019, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

# Background

A set of modular QEWD Containers that interoperate as a demonstrator for Healthcare IT integration


# Installation

## Install Docker 

  (unless already installed)

        curl -sSL https://get.docker.com | sh

To avoid using *sudo* when running *docker* commands:

        sudo usermod -aG docker ${USER}
        su - ${USER}

  NB: You'll be asked to enter your Linux password


## Clone the Github repository:

        git clone https://github.com/robtweed/qewd-hit-platform

Inside this repository, you'll find the following MicroServices and Sub-systems:

- Orchestrator (*main*)
- OIDC Provider
- OIDC Client
- FHIR-based Master Patient Index (MPI)
- OpenEHR interface
- Audit service


## Orchestrator

Before starting the HIT Platform's Orchestrator service, you need to configure it.

How you configure the HIT Platform's QEWD-Up Orchestrator depends on whether you want to 
run all the microservices on the same physical host machine, or whether you want to run them
on their own separate servers.


### Running All Microservices on the same Host Machine

If you are going to run all the MicroServices on the same physical host, then you should create
and use a Docker Bridged network for them to intercommunicate.  To create one named *qewd-hit*:

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


Now you need to create the Orchestrator's *config.json* file.  This is simply a matter of
renaming a pre-built file that has been created for you in the repository.  Assuming you
cloned the repository into your home directory, run the following commands:

        cd ~/qewd-hit-platform/main/configuration
        mv config.json.same_host config.json


### Starting the Orchestrator

You can now start the Orchestrator:


        docker run -it --name orchestrator --rm --network qewd-hit -p 8080:8080 -v ~/qewd-hit-platform/main:/opt/qewd/mapped rtweed/qewd-server



## OIDC Provider

The OIDC Provider acts as a Single Sign On (SSO) service which emulates the behaviour of NHS Login.
It's actually a fully-functioning OpenID Connect (OIDC) Provider.

Although it is provided as part of the HIT Platform repository, it does not behave as a MicroService:
 rather it is a standalone QEWD-Up System to which users' browsers will be redirected in order for
them to login.

The OIDC Provider is largely pre-configured for you, but you'll need to make a few, relatively minor,
adjustments in order to get it working.

There are 2 steps to configuring the OIDC Provider.

- properly defining its IP address or Domain Name and that of the Orchestrator (to which it
needs to redirect)

- adding any custom data to its user database.  Typically you'll want to add one or more patient
names with their associated NHS Numbers (which will probably be fictitious). Once again, you'll find
that some initial data has been pre-configured, but you can amend and/or add to that data.


### Defining the IP Addresses/Domain Names

Assuming you cloned the repository into your home directory, you need to edit the file:

        ~/qewd-hit-platform/oidc-provider/configuration/oidc.json

Find every line containing *http://192.168.1.100* and replace this with the IP address or
Domain name for the host system on which you'll be running the OIDC Provider.

You'll see from these lines in the *oidc.json* file that it's expecting that you'll start
the OIDC provider with it listening on port 8081 (you'll specify this in the *docker run* command
when you start it). 

        "oidc_provider": {
          "issuer": {
            "host": "http://192.168.1.100",
            "port": 8081


 If you want to use a different listener port for the OIDC Provider, change the *"port"* value appropriately.


You'll see from these lines in the *oidc.json* file that it's expecting that you'll be running
the Orchestrator with it listening on port 8080 (you specified this in the *docker run* command
when you started the Orchestrator). 

          "ui": {
            "login_form_title": "OpenId-Connect Authentication Service Log In",
            "home_page_url": "http://192.168.1.100:8080/demo"
          },
          "ui_app": {
            "qewd-monitor-ms": {
              "home_page_url": "http://192.168.1.100:8080/qewd-monitor-ms/reload.html"
            }
          }
        },
        "orchestrator": {
          "host": "http://192.168.1.100",
          "port": 8080
        },


 If you started the Orchestrator using a different listener port, 
 change the *8080* in the lines above to the appropriate port number.


### Defining/Adding Custom Data

Assuming you cloned the repository into your home directory, you need to edit the file:

        ~/qewd-hit-platform/oidc-provider/configuration/data.json

You'll see that this file defines a user named Rob Tweed for a number of applications 
(or Clients in OIDC parlance):

        "Users": {
          "test_client": [
            {
              "email": "rob.tweed@example.com",
              "claims": {
                "userId": 9999999001,
                "given_name": "Rob",
                "family_name": "Tweed",
                "role": "idcr"
              }
            }
          ],
          "openehr-maint": [
            {
              "email": "rob.tweed@example.com",
              "claims": {
                "given_name": "Rob",
                "family_name": "Tweed",
                "role": "admin"
              }
            }
          ],
          "admin": [
            {
              "email": "rob.tweed@example.com",
              "claims": {
                "given_name": "Rob",
                "family_name": "Tweed",
                "role": "admin"
              }
            }
          ],
          "qewd-monitor-ms": [
            {
              "email": "rob.tweed@example.com",
              "claims": {
                "given_name": "Rob",
                "family_name": "Tweed",
                "role": "admin"
              }
            }
          ]
        }


The important one for now is the first one:

          "test_client": [
            {
              "email": "rob.tweed@example.com",
              "claims": {
                "userId": 9999999001,
                "given_name": "Rob",
                "family_name": "Tweed",
                "role": "idcr"
              }
            }
          ]

When you start the OIDC Provider, it will use this information to create a user of the
"test_client" application named Rob Tweed, with an NHS Number of 9999999001.  You can either edit
this user information and replace it with a name, email address and NHS Number of your choosing, and/or
add one or more additional users, eg:

          "test_client": [
            {
              "email": "rob.tweed@example.com",
              "claims": {
                "userId": 9999999001,
                "given_name": "Rob",
                "family_name": "Tweed",
                "role": "idcr"
              }
            },
            {
              "email": "john.smith@example.com",
              "claims": {
                "userId": 2345678791,
                "given_name": "John",
                "family_name": "Smith",
                "role": "idcr"
              }
            }
          ]


Note that the email addresses can be non-existent dummy ones - they are not used for any other
purpose than as a login username.


### Starting the OIDC Provider

You can now start the OIDC Provider:


        docker run -it --name oidc_provider --rm --network qewd-hit -p 8081:8080 -v ~/qewd-hit-platform/oidc-provider:/opt/qewd/mapped rtweed/qewd-server


When started it will be listening on port 8081.

Note: when you first start it, you will see it loading a number of Node.js modules from NPM.  On subsequent
starts, it will bypass these steps as it will notice that the modules have already been loaded.

The OIDC Provider takes a few seconds to load and configure itself.  It is ready for use when you 
see this line in its console output:


        NOTICE: a draft/experimental feature (sessionManagement) enabled, future updates to this feature will be released as MINOR releases



## OIDC Client

The Orchestrator needs to know how to redirect to and from the OIDC Provider.  This task is
devolved to the OIDC Client MicroService.

Although it is pre-configured, you'll need to adjust the configuration settings to match those of
your Orchestrator and the OIDC Provider.


### Configuring the OIDC Client

There are two cpnfiguration steps:

- configuring the IP addresses/Domain names for your Orchestrator and the OIDC Provider
- setting the JWT Secret to match that of the Orchestrator


1) Assuming you cloned the repository into your home directory, you need to edit the file:

        ~/qewd-hit-platform/oidc-client/configuration/oidc.json


YOu need to locate and change the following lines:

        "oidc_provider": {
          "host": "http://192.168.1.100:8081",


and


        "orchestrator": {
          "host": "http://192.168.1.100:8080",


Change the IP address to the correct IP address or Domain Name of the host(s) running the
OIDC Provider and Orchestrator respectively.  If you started the OIDC Provider and/or the 
Orchestrator to listen to different ports than 8081 and 8080 respectively, change these too
within the lines above.


2) Take a look at the Orchestrator's *config.json* file, eg:

        ~/qewd-hit-platform/main/configuration/config.json

and locate the lines at the end that define the JWT secret (this will have been
assigned automatically with a randomly-generated uid value).  For example:


        "jwt": {
          "secret": "d7060194-7737-4052-a98a-c7cc364391fa"
        }

Copy and paste these lines to the end of the OIDC Client's *config.json* file, eg:

        ~/qewd-hit-platform/oidc-client/configuration/config.json

For example, it should look something like this:


        {
          "qewd_up": true,
          "qewd": {
            "serverName": "OIDC Client QEWD Server"
          },
          "ms_name": "oidc-client",
          "imported": true,
          "jwt": {
            "secret": "d7060194-7737-4052-a98a-c7cc364391fa"
          }
        }


### Starting the OIDC Client

You can now start the OIDC Client MicroService:

        docker run -it --name oidc-client --rm --network qewd-hit -p 8082:8080 -v ~/qewd-hit-platform/oidc-client:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server


ALthough you haven't yet got everything else set up and working, you can test that the Orchestrator, 
OIDC Client and OIDC Provider are correctly configured and integrated.

Point a browser at the *demo* application that is already pre-installed and configured on the
Orchestrator, eg:


        http://192.168.1.100:8080/demo


You should see this initially bring up a set of buttons and then redirect to the OIDC Provider's
login screen, which should be asking you for the user's Email address and password.

If not, it will be due to an error/mismatch in the configuration settings for the Orchestrator, 
OIDC Client and/or OIDC Provider.  Check them, restart the services if you changed anything, and
try the URL above again.

If it's all working properly, login using an email address that you added to the OIDC Provider's
*data.json* file earlier (eg *rob.tweed@example.com*).  The password for *ALL* users in this
test/hacking environment is *password*.

If you logged in correctly, you should then be redirected to the *demo* application's home page which
is a set of HTML buttons.

That's as much as we'll do with the *demo* application for now, but at this stage we know we have the
most complex part - configuring the OIDC Client and Provider - done and working.


## FHIR MPI Service

This service maintains patient demographic data, interfaced in FHIR Patient Resource format.

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


### Starting the FHIR MPI MicroService

You can now start the FHIR MPI MicroService:

        docker run -it --name mpi_service --rm --network qewd-hit -p 8083:8080 -v ~/qewd-hit-platform/fhir-mpi:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server



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

