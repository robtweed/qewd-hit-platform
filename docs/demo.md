# The Demo Application

## Background

The QEWD HIT Application includes a simple demo application that is designed to quickly 
and simply demonstrate the "moving parts" of the Platform.

It is a browser-based REST-ful application that is deliberately written using very simple/crude
HTML and JavaScript/jQuery logic.  

Do NOT assume that applications written using the QEWD HIT
Platform need to look so basic or crude!  

The rationale is that the logic is all in one place, and easy to
find and understand because it isn't buried within the logic of an application
that made use of a particular JavaScript framework.  Instead, you'll find all the
necessary logic written using simple JavaScript/jQuery, all in one single file.

As a result, developers can build their own sophisticated 
user interface (UI), using the JavaScript framework of their choice, but quickly re-use and adapt 
the logic from the demo application, and so interact with and make use of the QEWD HIT Platform.

## Running the Demo Application

In a browser, enter the URL:

        http://192.168.1.100:8080/demo

Note 1: change the IP address to that of the host server that is running the Orchestrator container
Note 2: if you started the Orchestrator container to listen on a different port, change the port in
the URL as appropriate


You'll probably initially briefly see a table with a set of buttons down the left-hand side, but
if the QEWD HIT Platform containers have been correctly configured, it will quickly disappear and
instead it will be replaced with a login screen.

What's happened is that the OIDC Client service has noticed that the browser didn't send a valid
JSON Web Token (JWT), and it therefore redirected your browser to the OIDC Provider.  The login
screen you're now looking at has come from the OIDC Provider and you are now interacting with it, 
rather than the QEWD HIT Platform Orchestrator.

You can see that from the URL in your browser which will now look something like this:

        http://192.168.1.100:8081/openid/interaction/308da935-5d8a-4467-93f3-4bbb0a316ff0

The IP address and port should match the OIDC Provider host server and its listener port.


