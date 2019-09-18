# Configuring and Running the Orchestrator

- [Background](#background)
- [Configuring](#configuring)
- [Starting the Orchestrator in Installation Mode](#starting-the-orchestrator-in-installation-mode)
- [Install/Configure and Start the other MicroServices](#installconfigure-and-start-the-other-microservices)
- [Restart the Orchestrator](#restart-the-orchestrator)
- [Correcting Mistakes in your Settings File](#correcting-mistakes-in-your-settings-file)
- [Persisting Data on the Orchestrator](#persisting-data-on-the-orchestrator)


## Background

The Orchestrator provides the externally-facing interface to the QEWD HIT Platform.  It routes
incoming requests to the appropriate MicroServices.


## Configuring

Before starting the HIT Platform's Orchestrator service, you need to configure it.

The first decision you need to make is whether you want to run each of the Docker Containers
that constitute the QEWD HIT Platform:

- on the same physical host server
- on different servers

The QEWD HIT Platform can accomodate both options.

The QEWD HIT Platform includes a semi-automated set of mechanisms for initially configuring your
system.  The starting point for this process is a file named *settings.json* that you need to
create in your QEWD HIT Platform's */main/configuration* folder.

In fact, if you look in the */main/configuration* folder, you'll find two example template versions 
of this file that you can use as your starting point:

- *settings.json.same_host_example*
- *settings.json.different_host_example*


### If Running All Microservices on the same Host Machine

If you are going to run all the MicroServices on the same physical host, then 
you should choose the file *settings.json.same_host_example* and rename it
to *settings.json*.

Next, you need to edit it (using any text editor).

Specifically you need to find and change the following lines:

        "orchestrator": {
          "protocol": "http",
          "host": "192.168.1.100",
          "port": 8080,

and:

        "oidc_provider": {
          "protocol": "http",
          "host": "192.168.1.100",
          "port": 8081,

These parameters are used to define the externally-facing endpoint URLs for the Orchestrator and
OIDC Provider respectively.  You are going to be running them both on the same physical server, so
they need to be accessible on different ports on that server.  The parameters are as follows:

- protocol: either *http* or *https*
- host: the externally-facing IP address or domain name of the host server
- port: the externally-accessible host port on which the container will listen

So in the template example (as above):

- The host machine has an externally-facing IP address of *192.168.1.100*
- the host machine ports 8080 and 8081 will be externally accessible
- the Orchestrator Container will be started with its QEWD listener port mapped to the host's port 8080
- the OIDC Provider Container will be started with its QEWD listener port mapped to the host's port 8081
- the endpoint URL for accessing the Orchestrator will therefore be *http://192.168.1.100:8080*
- the endpoint URL for accessing the OIDC Provider will therefore be *http://192.168.1.100:8081*

Edit these parameters to match your own particular requirements and save the edited file as 
*/main/configuration/settings.json*

It is recommended that you **do not** change any of the other settings in the *settings.json* file.


**IMPORTANT**: Make sure that you have created a 
[Docker Bridged Network](../running.md#creating-a-docker-bridged-network).


### If Running All Microservices on different Host Machines

If you are going to run the MicroServices on different physical host machines, then 
you should choose the file *settings.json.different_host_example* and rename it
to *settings.json*.

Next, you need to edit it (using any text editor).

#### Configuring the Externally-Facing Services

First you need to find and change the following lines:

        "orchestrator": {
          "protocol": "http",
          "host": "192.168.1.100",
          "port": 8080,

and:

        "oidc_provider": {
          "protocol": "http",
          "host": "192.168.1.105",
          "port": 8080,

These parameters are used to define the externally-facing endpoint URLs for the Orchestrator and
OIDC Provider respectively.  The parameters are as follows:

- protocol: either *http* or *https*
- host: the externally-facing IP address or domain name of the host server on which the Container will run
- port: the externally-accessible host port on which the Container will listen

So in the template example (as above):

- The host machine on which the Orchestrator will run has an externally-facing IP 
address of *192.168.1.100*, and its externally accessible port is 8080
- The host machine on which the OIDC Provider will run has an externally-facing IP 
address of *192.168.1.105*, and its externally accessible port is 8080
- the Orchestrator and OIDC Provider Containers will both be started with their
 QEWD listener port mapped to the host's port 8080 (this is done within the *docker run* command
that is used to start the Container)
- the endpoint URL for accessing the Orchestrator will therefore be *http://192.168.1.100:8080*
- the endpoint URL for accessing the OIDC Provider will therefore be *http://192.168.1.105:8080*


#### Configuring the Internal MicroServices

You should then edit the corresponding parameters for each of the MicroServices, ie 
find and edit this section:


        "microservices": {
          "oidc_client": {
            "protocol": "http",
            "host": "192.168.1.101",
            "port": 8080,
            "poolSize": 3
          },
          "mpi_service": {
            "protocol": "http",
            "host": "192.168.1.102",
            "port": 8080,
            "poolSize": 3
          },
          "audit_service": {
            "protocol": "http",
            "host": "192.168.1.103",
            "port": 8080,
            "poolSize": 3
          },
          "openehr_service": {
            "protocol": "http",
            "host": "192.168.1.104",
            "port": 8080,
            "poolSize": 3
          }
        },

The *protocol, host and port* parameters are as per the Orchestrator and OIDC Provider (see above).

Ideally the IP addresses/domain names and ports for these internal MicroServices should not be accessible
externally, but, of course, must be accessible from the Orchestrator.  Unless you have a 
special need to use a different port for them, port 8080 is probably as good a choice as any other
for each of these MicroServices, and provided they reside within a private sub-net that is not
accessible to the outside world, the *http* protocol is probably adequate for them.


When you have finished your edits, save the edited file as 
*/main/configuration/settings.json*

It is recommended that you **do not** change any of the other settings in the *settings.json* file,
unless you really know what you are doing and understand the workings of QEWD and the QEWD HIT Platform.


## Starting the Orchestrator in Installation Mode

If you look in the */main/configuration* folder, you'll see a *config.json* file.  This is
pre-built for you and will start up the Orchestrator's QEWD system in a basic installation mode.
From this mode, you can then apply the configuration parameters in your *settings.json* file
 to fully configure it for use as the QEWD HIT Platform Orchestrator.

Here's the steps:

1) Start the Orchestrator in its basic installation mode:


        docker run -it --name orchestrator --rm -v ~/qewd-hit-platform/main:/opt/qewd/mapped rtweed/qewd-server

2) From another process, shell into the Orchestrator Container:

        docker exec -it orchestrator bash

You should see a prompt similar to this:

        root@f49e55e68ae2:/opt/qewd#

Now type the commands:

        cd mapped
        node install

Provided you haven't introduced any JSON syntax errors into the *settings.json* file, you should see:

        Successfully configured the HIT Platform Orchestrator
        Restart the Orchestrator (main) container

Exit from the Container's shell by typing the command:

        exit


3) You should now stop the Orchestrator Container by typing *CTRL & C*


4) Configuration changes will have been made to a number of the Orchestrator's files based on the information
in your *settings.json* file, including to the *settings.json* file itself.  This modified
version of the *settings.json* file now needs copying to all the other MicroService folders.

### If Running All MicroServices on the Same Host

If you are going to be running all the MicroServices on the one physical host, you can 
very simply do the following:

        cd ~/qewd-hit-platform
        source copySettings.sh

### If Running All MicroServices on Different Hosts

If you are running the MicroServices on different physical hosts, the process is a little
less slick: you will need to physically
copy the *settings.json* file from the Orchestrator to each of the other machines.  

For example,
on the machine on which you'll be running the OIDC Client, you'll have cloned at the very least the 
*oidc-client* part of the QEWD HIT Platform repository, and so, on that machine, you should 
already have the folder:

        ~/qewd-hit-platform/oidc-client

Copy the Orchestrator's *settings.json* file into the OIDC Client's *configuration* subfolder, ie to create:

        ~/qewd-hit-platform/oidc-client/configuration/settings.json

Repeat this for all the other MicroServices, creating on the respective machines:

        ~/qewd-hit-platform/oidc-provider/configuration/settings.json
        ~/qewd-hit-platform/fhir-mpi/configuration/settings.json
        ~/qewd-hit-platform/audit-ms/configuration/settings.json
        ~/qewd-hit-platform/openehr-ms/configuration/settings.json



## Install/Configure and Start the other MicroServices

At this point you should install/configure the other MicroServices.

See the respective instructions:  

- [Configuring the OIDC Provider](./oidc-provider.md)
- [Configuring the OIDC Client](./oidc-client.md)
- [Configuring the FHIR MPI Service](./fhir-mpi.md)
- [Configuring the Audit Service](./audit.md)
- [Configuring the OpenEHR Service](./openehr.md)

Make sure you have re-started each MicroService Container after 
installation/configuration, as per the instructions.

When you have completed the configuration of the MicroServices, proceed to the next
step below.


## Restart the Orchestrator

When you have finished installing/configuring and restarting the other MicroService Containers, 
you can now restart the Orchestrator.  

When you ran the *install* script on the Orchestrator, it modified the *config.json* file, now
configured for use as the full QEWD HIT Platform Orchestrator, with all the information it needs
to connect to the MicroServices.  So everything should now be ready to start the orchestrator
and bring your QEWD HIT Platform to life.


To start the Orchestrator:

If you are running all the Microservices on the same host machine, assuming you've created
a Docker network named *qewd-hit*:

        docker run -it --name orchestrator --rm --network qewd-hit -p 8080:8080 -v ~/qewd-hit-platform/main:/opt/qewd/mapped rtweed/qewd-server

The Orchestrator will listen on port 8080.  To listen on a different port, change the *-p* parameter, eg:

        -p 3000:8080

Note, the listener port (the first one before the colon) must correspond to the port 
you defined in the *settings.json* file for the Orchestrator.


To run the orchestrator container as a background daemon process, change the *-it* parameter to *-d*:

        docker run -d --name orchestrator --rm --network qewd-hit -p 8080:8080 -v ~/qewd-hit-platform/main:/opt/qewd/mapped rtweed/qewd-server


If you are running the Orchestrator on its own physical host machine, leave out the *--network* parameter, eg:


        docker run -d --name orchestrator --rm -p 8080:8080 -v ~/qewd-hit-platform/main:/opt/qewd/mapped rtweed/qewd-server



## Correcting Mistakes in your Settings File

It is possible that you'll have made some mistake(s) in your *settings.json* file parameters. If so,
you'll need to shut down all your Containers and repeat the steps above.  

However, before you do so,
you'll need to revert the Orchestrator's *config.json* file back to its initial installation mode.

The easiest way to do this is to look in the *~/qewd-hit-platform/main/configuration* folder
where you'll find a file named
*config.json.initial*.  Overwrite the *config.json* file with the contents of this *config.json.initial* file.

It is recommended that you retain the original *config.json.initial* file, in case you need to
revert back to installation mode again in the future.
 
You're now ready to [try again](#configuring).



## Persisting Data on the Orchestrator

The Orchestrator does not store any permanent data within its integrated YottaDB database, but any
ephemeral data will be lost if you stop and restart the Orchestrator container.  If you want to
ensure that any YottaDB data is retained between restarts, you can map the YottaDB database files to
copies held on the host machine.  

[See here for further information](https://github.com/robtweed/yotta-gbldir-files) on how to do this, and
where to obtain pre-initialised versions of the YottaDB database files.



