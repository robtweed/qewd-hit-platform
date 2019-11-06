# qewd-hit-platform: QEWD Modular Platform for Health IT Demonstrator
 
Rob Tweed <rtweed@mgateway.com>  
6 November 2019, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed


# Installation Steps

## Install Docker

The QEWD HIT Platform uses Docker Containers for all its moving parts, so, if your
server or Raspberry Pi does not already have Docker installed, you'll need to install it.

To install Docker on most Linux platforms or a Raspberry Pi, you can do this:


        curl -sSL https://get.docker.com | sh


Make sure you are using a non-root user with *sudo* privileges.  Also
make sure the user does not need to use *sudo* when running *docker* commands:

        sudo usermod -aG docker ${USER}
        su - ${USER}

  NB: You'll be asked to enter your user's password


The QEWD HIT Platform has no other dependencies.


## Decide What Configuration You Want
 
You have two basic choices for setting up and running the QEWD HIT Platform.

- Single Server: The quickest and simplest approach is to have everything running on a single
server.  

- Multiple Server: In a production setting, you may want to spread the load across multiple
servers, eg with each server just running a single MicroService or 
sub-system.

It is recommended that anyone new to the QEWD HIT Platform first uses the Single Server
option.  This will allow you to familiarise yourself with its moving parts and operation,
and to understand the details of its configuration.

The Single Server option can be installed and fired up in literally just a few minutes using just 
a few simple commands, as shown in the next section below.

Advanced users who want to adopt a multiple server approach will need to install and
configure each server manually.  Instructions are provided below.


## Single Server Quick Install

### Installation Steps

1) Run the following commands:

        cd ~
        git clone https://github.com/robtweed/qewd-hit-platform
        cd ~/qewd-hit-platform
        source quick-install.sh

Carefully read the on-screen instructions and answer all the questions.  In most cases, you
 should be able to accept the default that is offered for each question.

2) When the installer is finished, make sure that ports 8000, 8080 and 8081 are externally-accessible
 (if you decided to use different ports when running the installation script, they
must be externally accessible).

For example, on Digital Ocean Droplets, you'll need to do the following:

        ufw allow 8000
        ufw allow 8080
        ufw allow 8081

Note: on a Raspberry Pi you normally won't need to do anything to enable these ports for
external access within your local network.

3) Fire up all the Docker Containers using:

        source startup.sh

The first time you run this, it has to download the various Docker Containers.  Next time(s)
you run the *startup* command, they will start pretty quickly.

4) You should now have a fully operational system running on your server, and
all the applications provided with the QEWD HIT Platform should be available for use.

For example, to try out the PulseTile UX/UI, in a browser go to:

        http://xx.xx.xx.xx:8080/pulsetile

        where xx.xx.xx.xx is the IP address or domain name of your Linux server


You can watch [this video](https://www.youtube.com/watch?v=nZgSmL2FxMw) which shows 
the quick install process in action.


5) To stop all the Docker Containers:

        cd ~/qewd-hit-platform
        source shutdown.sh


### Customising the Quick Install Process

Advanced users can customise the quick-install script to
run additional steps of their choosing.  These custom steps will
be invoked at the end of the standard quick-install script, just before
it would normally terminate.

To add custom steps, you must create a text file with the path:

        ~/qewd-hit-platform/custom-install.js

You create a JavaScript/Node.js Module that will look like this:

        module.exports = function() {
          // your additional steps go here
        };

The *this* context provided for your script is an object that provides you with
a number of useful functions and facilities.  See 
[here](https://github.com/robtweed/node-runner#what-is-the-this-context-within-my-script)
for details.

You are also provided access to *this.settings* which is the object containing
the configuration settings created by the user during the main *quick-install* process.


Note: if you are not a JavaScript developer and would prefer to use a *bash* script or shell
command, you can use:

        this.shell(command);

If you want to invoke a *bash* script file, create it in the *~/qewd-hit-platform* path.  Note, however,
that your *custom-install* script will be executed within the *node-runner* Docker Container, so
you must refer to any files using its mapped path which is */node*.  For example

        this.shell('source /node/myScript.sh');


### Next Steps

Now that you have a Single Server installation of the QEWD HIT Platform up and running,
you can read all about the available applications via the links below:

- [The Demo Application](./docs/demo.md)
- [The OpenEHR Maintenance Application](./docs/openehr-maint.md)
- [The OIDC Provider Administration Application](./docs/oidc-provider-admin.md)
- [The MicroService-Enabled QEWD Monitoring Application](./docs/qewd-monitor-ms.md)


## Multiple Server Installation

**NOTE**: It is recommended that only advanced users of the QEWD HIT Platform attempt to set up
a multiple server installation, and that you should first familiarise yourself with the
platform's moving parts and configuration mechanics using the single server setup described
above.

If you are an advanced user and want to set up a multiple server installation, proceed as follows.

The first step is to install and configure the Orchestrator server, which is the externally-facing
QEWD MicroService of the HIT Platform.

[Start here](https://github.com/robtweed/qewd-hit-platform/blob/master/docs/installation/orchestrator.md)
 for instructions on installing the Orchestrator.


