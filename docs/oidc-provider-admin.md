# oidc-provider-admin: OpenId Connect Provider Administration Application

## Background

If you have used the "out of the box" configuration for the QEWD HIT Platform, then many of the
OpenId Connect (OIDC) Provider's key settings, including its user database, will have been
determined by the data defined in its
[*/configuration/data.json*](https://github.com/robtweed/qewd-hit-platform/blob/master/oidc-provider/configuration/data.json)
file.

You can, of course, modify the data within this *data.json* file and restart the OIDC Provider
Container to maintain its configuration settings and user database.

However, another approach, particularly if you have configured the OIDC Provider Container to
[persist its data in the integrated YottaDB database](./installation/oidc-provider.md#persisting-data-on-the-oidc-provider),
is to use the *oidc-provider-admin* application that is included with the QEWD HIT Platform.  This
can be used to maintain the OIDC Provider settings and user database without the need to restart it
each time.

The *oidc-provider-admin*, or OIDC Provider Administration, application is a browser-based application, 
built using React and React-Bootstrap, that you can use to:

- add, edit or delete OIDC Provider Clients
- add, edit or delete users for each OIDC Provider Client
- add, edit or delete OIDC Provider Claims (including maintaining custom claims)


## Finding the Source Code for the OIDC Provider Administration Application

You'll find the browser-side code and logic for the *oidc-provider-admin* application in the
[*/main/orchestrator/www/oidc-provider-admin*](https://github.com/robtweed/qewd-hit-platform/tree/master/main/orchestrator/www/oidc-provider-admin) 
sub-folder of the *main* (the Orchestrator service) MicroService folder.

As this is a React application, the JavaScript logic has been compiled into a single *bundle* file.
This was done using [Browserify](http://browserify.org/).  The source JavaScript React Components 
that were used to define the logic of the application can be found in the 
[*/main/orchestrator/browser-app-source/oidc-provider-admin*](https://github.com/robtweed/qewd-hit-platform/tree/master/main/orchestrator/browser-app-source/oidc-provider-admin) 
sub-folder of the *main* (the Orchestrator service) MicroService folder.

The back-end logic of this application is provided by the 
[REST API handlers](https://github.com/robtweed/qewd-hit-platform/tree/master/oidc-provider/apis)
 in the *oidc-provider* MicroService.


## Before you Start the OIDC Provider Administration Application

Before you start the OpenEHR Maintenance Application for the first time, there's one
small bit of configuration you must perform.

Edit the
[*/main/orchestrator/www/oidc-provider-admin/loggedIn.html*](https://github.com/robtweed/qewd-hit-platform/blob/master/main/orchestrator/www/oidc-provider-admin/loggedIn.html)
 file and locate this line:

        window.parent.postMessage('loggedIn', 'http://www.mgateway.com:8080');

You must change the second argument of the *postMessage* function to match the IP address/domain name
of the host machine on which you are running the Orchestrator Container, and the port
on which your Orchestrator Container is listening.  eg:

        window.parent.postMessage('loggedIn', 'http://192.168.1.100:8080');

Note: This is a one-time-only change that you must make in order for the
redirection after log in to work correctly.


## Starting the OIDC Provider Administration Application

In a browser, enter the URL:

        http://192.168.1.100:8080/oidc-provider-admin

Note 1: change the IP address to that of the host server that is running the Orchestrator container
Note 2: if you started the Orchestrator container to listen on a different port, change the port in
the URL as appropriate

You should be presented with a page containing a modal panel which is asking you to log in
to the OIDC Provider Administration application

How you log into the application will depend on if/how you have reconfigured the user database
on the OIDC Provider.


## The OIDC Provider Client for the OIDC Provider Administration Application

The OIDC Client that is used for logging into the OIDC Provider Administration application
is named, not surprisingly, *admin*.

You'll find this defined in the OIDC Provider's 
[*/configuration/data.json*](https://github.com/robtweed/qewd-hit-platform/blob/master/oidc-provider/configuration/data.json)
file:

        "Clients": [
          ...etc...
          {
            "client_id": "admin",
            "client_secret": "admin-secret",
            "post_logout_uri_path": "/oidc-provider-admin",
            "ui": {
              "login_form_title": "Administrator Log In",
              "home_page_url": "/oidc-provider-admin/reload.html"
            },
            "redirect_uri_path": "/auth/token/admin"
          },

Unless you have modified the *data.json* file, you'll also find, further down, a single
user defined for this Client:

        "Users": {
          ..etc...
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


This Client and User information will have been automatically loaded into the OIDC Provider
Container when you started it up.


## Logging In

Unless you (a) modified the *data.json* file (see above) or (b) used the *oidc-provider-admin* application
to modify the user database for the OIDC Provider, you can use the above user name - 
*rob.tweed@example.com* to log in to the OIDC Provider Administration Application.

As a password was not specified in the *data.json* Users definition, you should use the default
password of *password*.

If you successfully logged in by entering these details, you should be automatically redirected to
the OIDC Provider Administration Application's main page which will be displaying
 two tabs titled: *Clients* and *Claims*, and, after a short pause, should display the
pre-configured OIDC Clients.

## Using the OIDC Provider Administration Application

Hopefully, the OIDC Provider Administration Application's User Interface (UI) is intuitive.  All
the available operations are invoked by clicking buttons, each of which will tell you its function
if you roll your mouse or pointer over them.

You can:

- add, edit or delete OIDC Provider Clients
- add, edit or delete users for each OIDC Provider Client
- add, edit or delete OIDC Provider Claims (including maintaining custom claims)


## Defining OIDC Provider Users

Note that users are defined with respect to an OIDC Client, on the basis that different
applications that require user authentication will probably support different sets of users.

If the same user requires access to multiple applications (ie via different OIDC Clients),
then you must register that user separately for each of those applications.  Note that this
allows you to define different custom Claims (eg a different role) for the same user for
different applications.

You'll see that this is the case for the initial configuration data defined in the 
*/configuration/data.json* file: the user *rob.tweed@example.com* has been defined for each
of the OIDC Provider Claims.


## Custom Claims

OIDC Provider Claims are the properties that will be added to the Id_Token when a user
successfully logs in.  When redirecting to the OIDC Provider, the OIDC Client will specify
one or more Claims that it wishes the OIDC Provider to apply.

OIDC specifies a standard set of Claim Id/Names, and a standard set of Claims/Properties for
each of these Claim Ids.  The OIDC Provider Container that is included with the QEWD
HIT Platform is pre-configured with these standard OIDC Claims.

Although the standard OIDC Claim properties include most of the ones you'll want to use (eg
family_name, given_name, email etc), it lacks some that you might expect or want to use -
a notable example being the user's role or permissions.  

One way to handle such omissions is to do so in another sub-system.  For example, the
QEWD HIT Platform maintains the user's demographic details in the *fhir-mpi* MicroService's
FHIR database rather than using the corresponding OIDC Claim properties.

However, another way is to extend an OIDC Claim Id and add custom properties such as *role*
and *userId* or *nhsNumber*.

You'll find that, in the QEWD HIT Platform's default OIDC Configuration, the *profile* Claim
has been extended to add two additional custom properties (or claims): *role* and *userId*.

These two custom properties should be defined for each user (you'll see them defined for the
default user *rob.tweed@example.com*), and, on successful login are returned in the Id_Token
by the OIDC Provider, and, as a result, are added to the JWT used by QEWD's MicroServices and
added to the browser as the *JSESSIONID* cookie.

If you want to emulate the exact behaviour of 
[NHS Login](https://developer.nhs.uk/library/systems/eis/), 
then you'll need to align the
Claims and custom Claims defined and used by NHS Login with those used by the QEWD OIDC Provider.



## Important Note Regarding the *data.json* File

If, when you started the OIDC Provider Container, you configured it to persist its YottaDB
database to mapped files residing on the host system - in other words, so that it would
persist its data between restarts, then it is recommended that:

- the first time you start the OIDC Provider Container in this way, you let it use the
*/configuration/data.json* file to pre-configure itself.  It will save this data (and index it)
to its YottaDB database.

- after the OIDC Provider Container has started for the first time, delete, or at least rename,
the */configuration/data.json* file.  This will prevent it overriding or corrupting any changes you might
make with the OIDC Provider Admininstration application.

- on subsequent restarts of the OIDC Provider Container, if it can't find the 
*/configuration/data.json* file, it will leave the OIDC configuration and user 
details in its YottaDB database untouched.


IMPORTANT NOTE:  The corollary of the above is that 
if you are **NOT** persisting the OIDC Provider Container's YottaDB files to a
mapped volume on the Docker host machine, then you **MUST** ensure that the
*/configuration/data.json* file exists and contains valid configuration and user data in
correct JSON syntax, otherwise the OIDC Provider will not be correctly initialised at startup and
will fail when you try to use it.

