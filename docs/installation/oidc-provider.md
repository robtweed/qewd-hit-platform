# OIDC Provider


- [Background](#background)
- [Defining the IP Addresses/Domain Names](#defining-the-ip-addressesdomain-names)
- [Defining/Adding Custom Data](#definingadding-custom-data)
- [Starting the OIDC Provider](#starting-the-oidc-provider)
- [Persisting Data on the OIDC Provider](#persisting-data-on-the-oidc-provider)


## Background

The OIDC Provider is an OpenID COnnect (OIDC) Provider that acts as a Single Sign On (SSO) service.
It can be set up to emulate the behaviour of 
[*NHS Login*](https://www.nhs.uk/using-the-nhs/nhs-services/nhs-login/).

However, it's actually a fully-functioning OpenID Connect (OIDC) Provider, so you can use it for your
own user authentication purposes instead of/in addition to using it to emulate *NHS Login*.

Although it is provided as part of the HIT Platform repository, it does not, strictly-speaking,
 behave as a MicroService: rather it is a standalone QEWD-Up System to which users' browsers 
will be redirected in order for them to login.

The OIDC Provider is largely pre-configured for you, but you'll need to make a few, relatively minor,
adjustments in order to get it working.

## Configuring the OIDC Provider

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

You can pre-define any custom data by using a pre-defined JSON file which is loaded
when you start the OIDC Provider Container.  Alternatively you can use the
*oidc-provider-admin* browser-based application to add and edit the OIDC Provider's
configuration parameters and user database.

#### Using the Pre-defined JSON file

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


This OIDC Client is used by the OpenEHR demo application.

When you start the OIDC Provider, it will use this information to create a user of the
"test_client" application named *Rob Tweed*, with an NHS Number of 9999999001.  You can either edit
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

You can now start the OIDC Provider.

If you are running the OIDC Provider on the same physical host as the other MicroServices, 
make sure that you have defined a Docker Bridged Network and make use of it when starting up:


        docker run -it --name oidc_provider --rm --network qewd-hit -p 8081:8080 -v ~/qewd-hit-platform/oidc-provider:/opt/qewd/mapped rtweed/qewd-server


The OIDC Provider will listen on port 8081.  To listen on a different port, change the *-p* parameter, eg:

        -p 3001:8080

To run the OIDC Provider container as a background daemon process, change the *-it* parameter to *-d*:

        docker run -d --name oidc_provider --rm --network qewd-hit -p 8081:8080 -v ~/qewd-hit-platform/oidc-provider:/opt/qewd/mapped rtweed/qewd-server


If you are running the OIDC Provider on its own physical host machine, leave out the *--network* 
parameter, eg:

        docker run -d --name oidc_provider --rm -p 8081:8080 -v ~/qewd-hit-platform/oidc-provider:/opt/qewd/mapped rtweed/qewd-server


Note: when you first start it, you will see it loading a number of Node.js modules from NPM.  On subsequent
starts, it will bypass these steps as it will notice that the modules have already been loaded.

The OIDC Provider takes a few seconds to load and configure itself.  It is ready for use when you 
see this line in its console output:


        NOTICE: a draft/experimental feature (sessionManagement) enabled, future updates to this feature will be released as MINOR releases


## Persisting Data on the OIDC Provider

The OIDC Provider uses its YottaDB database to store its configuration and user information.
This data will be lost if you stop and restart the Orchestrator container.  When you restart the
OIDC Provider container, it will use any data in the */configuration/data.json* file to 
repopulate its database.

If, instead, you want to ensure that the data is retained between restarts, you can map the YottaDB database files to
copies held on the host machine.  

[See here for further information](https://github.com/robtweed/yotta-gbldir-files) on how to do this, and
where to obtain pre-initialised versions of the YottaDB database files.

If you choose to persist the YottaDB database, then after you first start the OIDC Provider container, you
should delete or rename the */configuration/data.json* file.  This will prevent it overwriting the
YottaDB database with any data from the */configuration/data.json* file.

