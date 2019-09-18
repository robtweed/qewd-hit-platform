# OIDC Client


- [Background](#background)
- [Configuring the OIDC Client](#configuring-the-oidc-client)
- [Re-starting the OIDC Client](#re-starting-the-oidc-client)
- [Prelimiinary Testing](#testing-the-orchestrator-oidc-provider-and-oidc-client)
- [Persisting Data on the OIDC Client](#persisting-data-on-the-oidc-client)


## Background

The Orchestrator needs to know how to redirect to and from the OpenId Connect (OIDC) Provider.  This task is
devolved to the OIDC Client MicroService.

The OIDC Client needs to be configured in order to get it working.


## Configuring the OIDC Client

Make sure you have first followed the steps for configuring the Orchestrator. Assuming 
you have done, you'll now have the *settings.json* file available for use on the
OIDC Client MicroService.


### Applying the Settings File

If you look in the */oidc-client/configuration* folder, you'll see a *config.json* file.  This is
pre-built for you and will start up the OIDC Client's QEWD system in a basic installation mode.
You can then apply the settings to fully configure it for use as the QEWD HIT Platform OIDC Client.

Here's the steps:

1) Start the OIDC Client:

        docker run -it --name oidc_client --rm -v ~/qewd-hit-platform/oidc-client:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

2) From another process, shell into the Container:

        docker exec -it oidc_client bash

You should see a prompt similar to this:

        root@f49e55e68ae2:/opt/qewd#

Now type the commands:

        cd mapped
        node install

Provided you haven't introduced any JSON syntax errors into the *settings.json* file, you should see:

        Successfully configured the oidc_client Service
        Restart the oidc_client container


You'll find 2 new or edited files in the */oidc-client/configuration* folder:

- config.json: now ready for full QEWD HIT Platform use
- oidc.json: the OIDC settings it will use at startup


Exit from the Container's shell by typing the command:

        exit


3) You can now stop the OIDC Client Container by typing *CTRL & C*


## Re-starting the OIDC Client

You can now start the operational OIDC Client MicroService.

If you are running all the Microservices on the same host machine, assuming you've created
a Docker network named *qewd-hit*:

        docker run -it --name oidc_client --rm --network qewd-hit -v ~/qewd-hit-platform/oidc-client:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

To run the OIDC Client Container as a background daemon process, change the *-it* parameter to *-d*:

        docker run -d --name oidc_client --rm --network qewd-hit -v ~/qewd-hit-platform/oidc-client:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server


If you are running the OIDC Client on its own physical host machine, leave out the *--network* parameter, 
and instead, specify the port on which it will listen, eg:

        docker run -d --name oidc_client --rm -p 8080:8080 -v ~/qewd-hit-platform/oidc-client:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server

The OIDC Client will listen on port 8080.  To listen on a different port, change the *-p* parameter, eg:

        -p 3000:8080

Note, the listener port (the first one before the colon) must correspond to the port 
defined in the *settings.json* file for the OIDC Client MicroService.


## Testing the Orchestrator, OIDC Provider and OIDC Client

If you've got this far and configured and started the Orchestrator, OIDC Provider and OIDC Client, 
athough you haven't yet got everything else set up and working, you can run a preliminary test 
to confirm that these most critical and complex parts of the platform are correctly working and
properly integrated.

Point a browser at the *demo* application that is already pre-installed and configured on the
Orchestrator, eg:


        http://192.168.1.100:8080/demo

Change the IP address and port appropriately for your host system on which you're running
the Orchestrator.


You should see this initially and briefly display a set of buttons before it redirects
 to the OIDC Provider's login screen, which should be asking you for the user's Email address and password.

If not, it will be due to an error/mismatch in the configuration settings for the Orchestrator, 
OIDC Client and/or OIDC Provider.  Check them, restart the services if you changed anything, and
try the URL above again.

If it's all working properly, login using an email address that you added to the OIDC Provider's
*data.json* file earlier (eg *rob.tweed@example.com*).  The password for *ALL* users in this
test/hacking environment is *password*.

If you logged in correctly, you should then be redirected back to the *demo* application's home page which
is a set of HTML buttons.

That's as much as we'll do with the *demo* application for now, but at this stage we know we have the
most complex part - configuring the OIDC Client and Provider - done and working.


## Persisting Data on the OIDC Client

The OIDC Client does not store any permanent data within its integrated YottaDB database, but any
ephemeral data will be lost if you stop and restart the Orchestrator container.  If you want to
ensure that any YottaDB data is retained between restarts, you can map the YottaDB database files to
copies held on the host machine.  

[See here for further information](https://github.com/robtweed/yotta-gbldir-files) on how to do this, and
where to obtain pre-initialised versions of the YottaDB database files.

