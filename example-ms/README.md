# example_ms: Example Additional MicroService
 
Rob Tweed <rtweed@mgateway.com>  
15 July 2020, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

# Background

This is a demonstration example showing how to create an additional MicroService for your QEWD
HIT Platform.  The example also demonstrates:

- a MicroService that provides the API interface(s) to REST APIs on a remote 3rd-party service
- how to forward the QEWD JWT to the 3rd-party service

The example uses the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) fake REST API server
to demonstrate how to access and use 3rd-party REST APIs within your QEWD MicroServices.


# Adding a New MicroService to the QEWD HIT Platform

## Create the MicroService Folder

Copy the entire example folder, adding it as a new folder within your QEWD HIT Platform folder.
Your QEWD HIT Platform main folder will now look something like this:

        ~/qewd-hit-platform
           |
           |- oidc-client
           |
           |- audit-ms
           |
           |- openehr-ms
           |
           |- fhir-mpi
           |
           |- example-ms    <==== Your new MicroService folder
           |

## Modify your New MicroService Folder

Change the name of the folder from *example-ms* to whatever you want to call your new MicroService

Your MicroService folder will initially contain the following:

        your_microservice_folder
           |
           |- configuration
           |       |
           |       |- config.json
           |       |
           |       |- routes.json
           |
           |- apis
           |    |
           |    |- getComments
           |    |      |
           |           |- index.js
           |
           |- qewd-apps
           |


Initially we'll set up this Microservice to use its demonstration API.  Once it's all set up and
working, you can then replace it with your own APIs.


## Edit the *config.json* file

The *config.json* file that you copied across currently looks like this:

          {
            "qewd_up": true,
        =>  "ms_name": "example_ms",
            "qewd": {
        =>    "serverName": "Example of an additional MicroService",
        =>    "poolSize": 3
            },
            "imported": true,
            "jwt": {
        =>    "secret": "replace with value on orchestrator config.json"
            }
          }

You'll need to edit the lines that are maked with an arrow:

- ms_name: change this to the name you want to give your QEWD MicroService.  This is the name you'll
then use to start the Docker Container and the name you'll need to register on the Orchestrator (see 
later)

- serverName: Change this description as appropriate.  This parameter is used by the QEWD Monitor
application

- poolSize: adjust if necessary, according to your needs for the QEWD service.  I'd suggest initially
just using the value that is currently set

- secret: Replace the value with the corresponding value in the *config.json* file for your
*Orchestrator*.


## Review the *routes.json* file

The *routes.json* file that you copied across currently looks like this:

        [
          {
            "uri": "/example/comments",
            "method": "GET",
            "handler": "getComments",
            "authenticate": false
          }
        ]

I'd suggest leaving this for now, so you can easily test this API for your additional MicroService.
Note that the *authenticate: false* property is set, allowing us to try this API without having
first logged in via the OIDC Provider and using the authenticated JWT.

Once you have the MicroService working using this demonstration API, you can substitute it with your
own which will probably require authentication.  To enable authentication, simply don't add the
*authenticate* property to your route object definitions.


## Review the *getComments* API Handler

If you look at the */apis/getComments/index.js* file in the MicroService folder, you'll see it
currently looks like this:

var request = require('request');

        module.exports = function(args, finished) {
       
         // example includes sending QEWD's JWT as a bearer authorization token to the remote service
       
         var options = {
           url: 'https://jsonplaceholder.typicode.com/comments',
           headers: {
             authorization: 'Bearer ' + args.req.token
           },
           method: 'GET',
           json: true
         };
       
         request(options, function(error, response, body) {
           if (response.statusCode !== 200) {
             callback({
               error: response.headers['x-error-message'],
               status: {
                 code: response.statusCode
               }
             });
           }
           else {
             finished({comments: body});
           }
         });
       };

This demonstraton API handler shows a simple example of how to forward the API handling to a
third-party API on a remote server, in this case at *https://jsonplaceholder.typicode.com*.

A *GET /comments* REST request for all comments is sent to the remote server, and the response
is returned from the QEWD MicroService handler using the *finished()* function as normal.

Although strictly-speaking unnecesary for this example, I've also shown how to add an
authorization header to the request sent to the external service, containing the QEWD
JWT as a Bearer token.  You'll need to do this if the third-party service needs to confirm
the validity of the OIDC Provider's *idToken* which is embedded in the JWT (they can find
it within the JWT as the claim/property *openid.id_token*)

If the third-party service doesn't need to validate your JWT, you don't need to add this
*authorization* header.


## Start the MicroService Container

You can now start your new MicroService container.  See the *startup.txt* file within the
folder you copied.  In most situations you'll start it up as follows:

        docker run -d --name {{microService_name}} --rm --network qewd-hit -v {{folder_containing_microService}:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server


For example, if you changed the MicroService name within the *config.json* file to *my_service*,
and renamed the folder to *my-service*, then assuming your QEWD HIT Platform folders reside within
*~/qewd-hit-platform*:

        docker run -d --name my_service --rm --network qewd-hit -v ~/qewd-hit-platform/my-service:/opt/qewd/mapped -e mode="microservice" rtweed/qewd-server


Note that at this stage, the Orchestrator does not know anything about your new MicroService, so
it is not yet usable


## Reconfigure the Orchestrator

You now need to make two changes to the Orchestrator configuration:

### Register the New MicroService within its *config.json* file

Edit the Orchestrator's *config.json* file (you'll find it at 
*/main/configuration/config.json*), and register your new MicroService within it.

You'll find that the *microservices* object within the *config.json* file
currently looks like this:


        "microservices": [
          {
            "name": "oidc_client",
            "apis": {
              "import": true,
              "imported": true
            }
          },
          {
            "name": "mpi_service",
            "apis": {
              "import": true,
              "imported": true
            }
          },
          {
            "name": "audit_service",
            "apis": {
              "import": true,
              "imported": true
            }
          },
          {
            "name": "openehr_service",
            "apis": {
              "import": true,
              "imported": true
            }
          }
        ],


You need to add your new MicroService to it, eg if you've named it *my_service*:

          {
            "name": "my_service",
            "apis": {
              "import": true,
              "imported": true
            }
          }

So the *microservices* object should now look like this:

        "microservices": [
          {
            "name": "oidc_client",
            "apis": {
              "import": true,
              "imported": true
            }
          },
          {
            "name": "mpi_service",
            "apis": {
              "import": true,
              "imported": true
            }
          },
          {
            "name": "audit_service",
            "apis": {
              "import": true,
              "imported": true
            }
          },
          {
            "name": "openehr_service",
            "apis": {
              "import": true,
              "imported": true
            }
          },
          {
            "name": "my_service",
            "apis": {
              "import": true,
              "imported": true
            }
          }
        ],


### Add the new MicroService's API routes to the Orchestrator's *routes.json* file

Initially we'll be using the example API, so add this to the array of routes in the
Orchestrator's *routes.json* file:

  {
    "uri": "/example/comments",
    "method": "GET",
    "authenticate": false,
    "on_microservice": "example_ms"
  },

Note that for now we're setting *authenticate: false* to allow us to easily test the new
MicroService.


### Restart the Orchstrator Container

You now need to restart the Orchestrator Docker Container.  If you watch the Node.js log
for your new MicroService's QEWD process (eg using *docker logs -f my_service*), you'll
see the Orchestrator handshaking with it, and the corresponding Orchestrator Node.js
log will show it confirming that your new MicroService is ready.

Your new MicroService is now ready to try out.

# Test your New MicroService

In a REST Client, send a *GET /example/getComments* request to the Orchestrator endpoint.
Note that you'll need to also add the HTTP request header:

        x-requested-with: XMLHttpRequest

If everything was set up correctly, you should see a response containing the JSON
response payload from *https://jsonplaceholder.typicode.com*.


# Modify your MicroService

Now that it's working and properly configured, you can add your own APIs to your new
MicroService.  Make sure that every API has:

- its route defined in the MicroService's *routes.json* file
- its route also defined in the Orchestrator's *routes.json* file
- a handler method defined in the MicroService's *apis* folder.

Note that every time you add a new API route, you must restart both the Orchestrator and
your MicroService before they can be used.

If you modify an API handler on your MicroService, they you will need to either restart the
MicroService, or stop its Worker Processes (eg using the QEWD Monitor application).

