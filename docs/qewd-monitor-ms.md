# qewd-monitor-ms: MicroService-Enabled QEWD Monitoring Application

## Background

QEWD has always been bundled with a Browser-based interactive application known as
*qewd-monitor*.  This is the QEWD Monitoring application which allows you to inspect
the configuration and operational status of a running QEWD system.

The *qewd-monitor* application has had a number of shortcomings:

- its security has been very basic - essentially secured by a management password
that is defined in the QEWD startup parameters

- Each instance of QEWD that you wanted to monitor would have to be exposed via a TCP port.
In the case of a set of QEWD MicroServices, being able to monitor each QEWD sub-system therefore
required opening up access to each MicroService.

The *qewd-monitor-ms* application is an adaptation of the original *qewd-monitor* application
which:

- uses the OIDC Provider to control user authentication
- uses the built-in QEWD MicroService JWT-based controls to allow access to each MicroService
only with a valid JWT which, in turn, requires successful login via the OIDC Provider
- prevents the need to expose the QEWD MicroServices via an externally-accessible TCP port.  The
*qewd-monitor-ms* application runs on the Orchestrator which should always be the **only**
QEWD MicroService that is externally-accessible

## Basic Opeation and Functionality

When you start the *qewd-monitor-ms* application, unless you already have valid JWT cookie in
your browser, you will be redirected to the OIDC Provider where you will need to log in

On successful login, you will be presented with a menu of the QEWD MicroService instances that
you can monitor

On selecting a QEWD MicroService instance, you will see the familiar QEWD Monitor interface.
This allows you to:

- view the versions of the various sub-components used by QEWD
- view the process Ids of the QEWD Master and Worker Processes
- view the activity of each of the QEWD Worker Processes, in terms of the number of requests handled
since starting the QEWD Monitor
- stop one or more QEWD Worker Processes.  If you stop the last remaining one, you'll see a new one
automatically re-appear.
- stop the QEWD Master Process, which will shut down the QEWD MicroService and its Docker process.

You can also use the QEWD Monitor application to:

- view and drill down into persistent data storage on the QEWD MicroService's integrated YottaDB
database.  This database storage is presented as hierarchical JSON tree structures that you can
drill down into, eventually reaching leaf-nodes that contain the data values.

- view and drill down into any active QEWD Session storage.  Note that applications such as
the *qewd-monitor-ms* applications that use JWT-based session management do not use and
maintain QEWD Sessions.


## Finding the Source Code for the MicroService-Enabled QEWD Monitoring Application

You'll find the browser-side code and logic for the *qewd-monitor-ms* application in the
[*/main/orchestrator/www/qewd-monitor-ms*](https://github.com/robtweed/qewd-hit-platform/tree/master/main/orchestrator/www/qewd-monitor-ms) 
sub-folder of the *main* (the Orchestrator service) MicroService folder.

As this is a React application, the JavaScript logic has been compiled into a single *bundle* file.
This was done using [Browserify](http://browserify.org/).  The source JavaScript React Components 
that were used to define the logic of the application can be found in the 
[*/main/orchestrator/browser-app-source/qewd-monitor-ms*](https://github.com/robtweed/qewd-hit-platform/tree/master/main/orchestrator/browser-app-source/qewd-monitor-ms) 
sub-folder of the *main* (the Orchestrator service) MicroService folder.

The back-end logic of this application is provided by the original
[QEWD Monitor message handlers](https://github.com/robtweed/qewd-monitor/blob/master/lib/qewd-monitor.js)
 that is available in each MicroService.


## Before you Start the MicroService-Enabled QEWD Monitoring Application

Before you start the *qewd-monitor-ms* application for the first time, there's one
small bit of configuration you must perform.

Edit the
[*/main/orchestrator/www/qewd-monitor-ms/loggedIn.html*](https://github.com/robtweed/qewd-hit-platform/blob/master/main/orchestrator/www/qewd-monitor-ms/loggedIn.html)
 file and locate this line:

        window.parent.postMessage('loggedIn', 'http://www.mgateway.com:8080');

You must change the second argument of the *postMessage* function to match the IP address/domain name
of the host machine on which you are running the Orchestrator Container, and the port
on which your Orchestrator Container is listening.  eg:

        window.parent.postMessage('loggedIn', 'http://192.168.1.100:8080');

Note: This is a one-time-only change that you must make in order for the
redirection after log in to work correctly.


## Starting the MicroService-Enabled QEWD Monitoring Application

In a browser, enter the URL:

        http://192.168.1.100:8080/qewd-monitor-ms

Note 1: change the IP address to that of the host server that is running the Orchestrator container
Note 2: if you started the Orchestrator container to listen on a different port, change the port in
the URL as appropriate

You should be presented with a page containing a modal panel which is asking you to log in
to the QEWD Monitoring application.

How you log into the application will depend on if/how you have reconfigured the user database
on the OIDC Provider.


## The OIDC Provider Client for the MicroService-Enabled QEWD Monitoring Application

The OIDC Client that is used for logging into the MicroService-Enabled QEWD Monitoring application
is named, not surprisingly, *qewd-monitor-ms*.

You'll find this defined in the OIDC Provider's 
[*/configuration/data.json*](https://github.com/robtweed/qewd-hit-platform/blob/master/oidc-provider/configuration/data.json)
file:

        "Clients": [
          ...etc...
          {
            "client_id": "qewd-monitor-ms",
            "client_secret": "qewd-monitor-ms-secret",
            "post_logout_uri_path": "/qewd-monitor-ms",
            "ui": {
              "login_form_title": "QEWD Monitor Admininstrator Log In",
              "home_page_url": "/qewd-monitor-ms"
            },
            "redirect_uri_path": "/auth/token/qewd-monitor-ms"
          }

Unless you have modified the *data.json* file, you'll also find, further down, a single
user defined for this Client:

        "Users": {
          ..etc...
          "qewd-monitor-ms": [
            {
              "email": "rob.tweed@example.com",
              "claims": {
                "given_name": "Rob",
                "family_name": "Tweed",
                "role": "admin"
              }
            }
          ],


This Client and User information will have been automatically loaded into the OIDC Provider
Container when you started it up.


## Logging In

Unless you (a) modified the *data.json* file (see above) or (b) used the *oidc-provider-admin* application
to modify the user database for the OIDC Provider, you can use the above user name - 
*rob.tweed@example.com* to log in to the MicroService-Enabled QEWD Monitoring Application.

As a password was not specified in the *data.json* Users definition, you should use the default
password of *password*.  

Note: It is a good idea to use, as soon as possible, the *oidc-provider-admin*
application to create a new administrator user, as you will be able to specify a proper
password for this user.  Note that it is also possible to configure the OIDC Provider to
implement 2-Factor Authentication for additional security.

If you successfully logged in by entering these details, you should be automatically redirected to
the MicroService-Enabled QEWD Monitoring Application's main page which will be displaying
 a menu of the QEWD MicroServices you can monitor.

Click the one you want to view.  You can use the *Back* button in the Main QEWD Monitor display's
Banner to return to the menu, where you can then select and monitor another MicroService.

