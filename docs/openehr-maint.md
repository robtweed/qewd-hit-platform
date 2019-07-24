# openehr-maint: OpenEHR Maintenance Application

## Background

If you have used the Dockerised version of EtherCIS as your OpenEHR system, it initially
does not include any patient data.  It is, however, pre-configured, with most, if not all,
of the Templates you'll require.  If you are using your own OpenEHR system, you will
probably find the *openehr-maint* application especially useful, but it can be a handy
tool for any OpenEHR system for quick and simple data maintenance.

The *openehr-maint*, or OpenEHR Maintenance, application is a browser-based application, 
built using React and React-Bootstrap, that you can use to:

- view specified Clinical heading data if it exists in the OpenEHR database 
for a patient (eg allergies, medications etc);
- add clinical heading data to the OpenEHR database for a specified patient;
- delete some or all of the clinical heading data in the OpenEHR database for a specified
patient.


## Finding the Source Code for the OpenEHR Maintenance Application

You'll find the browser-side code and logic for the *openehr-maint* application in the
[*/main/orchestrator/www/openehr-maint*](https://github.com/robtweed/qewd-hit-platform/tree/master/main/orchestrator/www/openehr-maint) 
sub-folder of the *main* (the Orchestrator service) MicroService folder.

As this is a React application, the JavaScript logic has been compiled into a single *bundle* file.
This was done using [Browserify](http://browserify.org/).  The source JavaScript React Components 
that were used to define the logic of the application can be found in the 
[*/main/orchestrator/browser-app-source/openehr-maint*](https://github.com/robtweed/qewd-hit-platform/tree/master/main/orchestrator/browser-app-source/openehr-maint) 
sub-folder of the *main* (the Orchestrator service) MicroService folder.

The back-end logic of this application is provided by the REST API handlers in the *openehr-ms*
MicroService.


## Before you Start the OpenEHR Maintenace Application

Before you start the OpenEHR Maintenance Application for the first time, there's one
small bit of configuration you must perform.

Edit the
[*/main/orchestrator/www/openehr-maint/loggedIn.html*](https://github.com/robtweed/qewd-hit-platform/blob/master/main/orchestrator/www/openehr-maint/loggedIn.html)
 file and locate this line:

        window.parent.postMessage('loggedIn', 'http://www.mgateway.com:8080');

You must change the second argument of the *postMessage* function to match the IP address/domain name
of the host machine on which you are running the Orchestrator Container, and the port
on which your Orchestrator Container is listening.  eg:

        window.parent.postMessage('loggedIn', 'http://192.168.1.100:8080');

Note: This is a one-time-only change that you must make in order for the
redirection after log in to work correctly.


## Starting the OpenEHR Maintenance Application

In a browser, enter the URL:

        http://192.168.1.100:8080/openehr-maint

Note 1: change the IP address to that of the host server that is running the Orchestrator container
Note 2: if you started the Orchestrator container to listen on a different port, change the port in
the URL as appropriate

You should be presented with a page containing a modal panel which is asking you to log in
to the OpenEHR Maintenance application

How you log into the application will depend on if/how you have reconfigured the user database
on the OIDC Provider.


## The OIDC Provider Client for the OpenEHR Maintenance Application

The OIDC Client that is used for logging into the OpenEHR Maintenance application
is named, not surprisingly, *openehr-maint*.

You'll find this defined in the OIDC Provider's 
[*/configuration/data.json*](https://github.com/robtweed/qewd-hit-platform/blob/master/oidc-provider/configuration/data.json)
file:

        "Clients": [
          ...etc...
          {
            "client_id": "openehr-maint",
            "client_secret": "openehr-maint-secret",
            "post_logout_uri_path": "/openehr-maint",
            "ui": {
              "login_form_title": "OpenEHR Maintenance Log In",
              "home_page_url": "/openehr-maint/reload.html"
            },
            "redirect_uri_path": "/auth/token/openehr-maint"
          },

Unless you have modified the *data.json* file, you'll also find, further down, a single
user defined for this Client:

        "Users": {
          ..etc...
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


This Client and User information will have been automatically loaded into the OIDC Provider
Container when you started it up.


## Logging In

Unless you (a) modified the *data.json* file (see above) or (b) used the *oidc-provider-admin* application
to modify the user database for the OIDC Provider, you can use the above user name - 
*rob.tweed@example.com* to log in to the OpenEHR Maintenance Application.

As a password was not specified in the *data.json* Users definition, you should use the default
password of *password*.

If you successfully logged in by entering these details, you should be automatically redirected to
the OpenEHR Maintenance Application's main page which will be displaying a tab titled: *Maintain Headings*.


## Retrieving Heading Data

If you enter an NHS Number (eg 9999999001) and a Heading name (eg *allergies*), then a request
will be sent via the Orchestrator to the OpenEHR Interface MicroService to fetch all the instances
of that heading for the selected patient.

If you specify a previously un-registered NHS Number, or if no instances of the specified
heading could be found for the NHS Number, then you will be told that no data was found and you will
be asked if you want to populate the patient with some sample Heading data (see later section below).

If heading data exists for the patient, a summary record will be displayed.


## Deleting Heading Records

If heading records were found for the selected patient, you can now:

- delete one of the heading records
- delete all of the heading records.

You can also flag individual records as locked.  Locked records will not be deleted if you
click the button that deletes all records.

If you delete all of the heading records, you will be told that no headings exist and you will be asked
if you want to populate the patient with sample heading records (see below).


## Populating the Patient with Sample Heading Records

Selecting this option will result in a number of sample heading records being saved against the
selected patient.

The sample data for allergies is already included in the QEWD HIT Platform, but you can edit this
data, for example to add more sample data or modify the sample data, and/or to create sample data for
new headings.

You will find the *allergies* sample data in the
[*/main/qewd-apps/openehr-maint/populatePatient/data/allergies.json*](https://github.com/robtweed/qewd-hit-platform/blob/master/main/qewd-apps/openehr-maint/populatePatient/data/allergies.json)
file.

if you have read the documentation on how the QEWD HIT Platform 
[transforms JSON documents](./openehr.md#transforming-json), 
you will know that there will be a JSON Transformation Template document that transforms these
allergy JSON records into the correct OpenEHR *Flat JSON* format.  The transformation
document used is the
[/openehr-ms/templates/allergies/ui_to_openehr.json](https://github.com/robtweed/qewd-hit-platform/blob/master/openehr-ms/templates/allergies/ui_to_openehr.json)
file.

You should find that the allegies UI JSON format is simple enough and sufficiently self-explanatory to
allow you to add more sample data with which to populate patients.

