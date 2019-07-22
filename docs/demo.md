# The Demo Application

## Background

The QEWD HIT Application includes a simple *demo* application that is designed to quickly 
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
the logic from the *demo* application, and so interact with and make use of the QEWD HIT Platform.

## Starting the Demo Application

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


## Logging In

The username(s) and password(s) you can use to log in to the *demo* application will depend on
how you initially configured the OIDC Provider and whether or not you've subsequently used
the *oidc-provider-admin* application to add or edit any users.

If this is the first time you've tried the *demo* application, you probably just used the
basic "out of the box" configuration which included using the OIDC Provider Container's
*/configuration/data.json* file.  If so, this file sets up an initial user for the *demo*
application:

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

*test_client* is the name of what's known in OIDC parlance as a *Client*.  The *demo*
application uses this OIDC Client for its user authentication.  The JSON snippet above shows
a single user has been defined against this client, with an email address of 
*rob.tweed@example.com*.  What you don't see defined is a password.  By default, when using
this *data.json* file to pre-load configuration data, the OIDC Provider sets the password to
*password*.

So, assuming you didn't modify this "out of the box" *data.json* file, you can try logging in using
the following credentials:

- email: **rob.tweed@example.com**
- password: **password**

User authentication should now complete satisfactorily on the OIDC Provider and you should now
get redirected back to the *demo* application's home page.


# The Demo Application's Home Page

If you successfully logged in, you should now be looking at a basic "vanilla" HTML page which will
say *Welcome Rob Tweed*, below which is a logout button and a 2-cell table with a set of buttons in its
left-hand cell.

The Welcome message was constructed from the *given_name* and *family_name* properties (or 
*Claims* in OIDC Parlance) that were defined in the OIDC Provider against the user 
you logged in as.  Here they are in the default *data.json* file:


        "Users": {
          "test_client": [
            {
              "email": "rob.tweed@example.com",
              "claims": {
                "userId": 9999999001,
                "given_name": "Rob",      <======
                "family_name": "Tweed",   <======
                "role": "idcr"
              }
            }
          ],


In fact, how those Claims got to the browser is via a chain of events that I describe as the OIDC "dance".


# The OIDC Dance and JSON Web Tokens

When you successfully logged into the OIDC Provider, it sent a special message back to the Orchestrator
that included something called an Id_Token.  An Id_Token is actually something known as a 
[JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token) (JWT).  JWTs are also used by QEWD's
Orchestrator and MicroServices to maintain security and to hold what's known as state information.

QEWD doesn't, in fact, use the Id_Token JWT directly for its own purposes, but constructs and manages
its own JWTs.  However, QEWD adds the IdToken into its own JWT so that it is available to you, the
developer, to make use of in the browser side of your application and/or the QEWD/server-side

The next step in the "dance" is that the Orchestrator redirects you back to the *demo* 
application's home page.  When it does so, it adds the JWT as a cookie response header.  By default
that cookie is named *JSESSIONID*, and if you open your browser's development console you'll be able to
see that cookie.  It will look something like this:

        JSESSIONID: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjM
                    1MzE0MDEsImlhdCI6MTU2MzUzMDIwMSwiaXNzIjoicWV3ZC5qd3Q
                    iLCJhcHBsaWNhdGlvbiI6Im9pZGMtcHJvdmlkZXItYWRtaW4iLCJ
                    0aW1lb3V0IjoxMjAwLCJxZXdkIjoiZGMzOWIwYTMwNzA2MzA3ZmU
                    zZTlhNTc2MGE0NzkzZjc0MDJlOGE4YjMxNTlhZWMzMDQzZjU4Y2U
                    5MzUzYzlmYjQyY2NlZDlmODk2MGMwM2MwYmNmNGE3MTYzNTU4OTY
                    5OGM5MTc3MzgxY2UyZmMwOTZiZWY3NDE1OGEyZTg1NmExMzdkZDU
                    4NDUzOWFmNTQxMmMxMjg3ODJlMzhiZjE2ZTNiYzZmNTI0YTAyN2U
                    zZjQxN2RmYWM3YTM2OWE2MzJlIiwiaXNBdXRoZW50aWNhdGVkIjp
                    0cnVlLCJyb2xlIjoiaWRjciIsImZpcnN0TmFtZSI6IlJvYiIsImx
                    hc3ROYW1lIjoiVHdlZWQiLCJ1aWQiOiJlNzIyNGZhNGFhYjU3MTg
                    5Y2MzNjk5YWRhMjcwNmZhYWFiYWNkZmNmYzcxYmFiMGY3ODA0ZTF
                    jMGE3MWFkYjBjIiwib3BlbmlkIjp7InN1YiI6MSwiZmFtaWx5X25
                    hbWUiOiJUd2VlZCIsImdpdmVuX25hbWUiOiJSb2IiLCJ1c2VySWQ
                    iOjk5OTk5OTkwMDEsInJvbGUiOiJpZGNyIiwiZW1haWwiOiJyb2I
                    udHdlZWRAZXhhbXBsZS5jb20iLCJhdF9oYXNoIjoiTVVkQXJ6ald
                    EU2tyc196TnF0NUFRZyIsInNpZCI6IjE3Y2YwMjE2LTQzM2UtNDY
                    wNS05Mzc2LWMyNDA2OWVmMGU3ZiIsImF1ZCI6InRlc3RfY2xpZW5
                    0IiwiZXhwIjoxNTYzNTMwMjMyLCJpYXQiOjE1NjM1MjkwMzIsIml
                    zcyI6Imh0dHA6Ly8xOTIuMTY4LjEuMjI5OjgwODEvb3BlbmlkIiw
                    iaWRfdG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k
                    2SWtwWFZDSXNJbXRwWkNJNklsTjNlRVZUYnpSUkxYUm1ZMTh4ZG1
                    KQ1NrMWlRV3g1Y0dsM1RFOVhZbUYyT1VWTlRsZENUakJEZHpRaWZ
                    RLmV5SnpkV0lpT2pFc0ltWmhiV2xzZVY5dVlXMWxJam9pVkhkbFp
                    XUWlMQ0puYVhabGJsOXVZVzFsSWpvaVVtOWlJaXdpZFhObGNrbGt
                    Jam81T1RrNU9UazVNREF4TENKeWIyeGxJam9pYVdSamNpSXNJbVZ
                    0WVdsc0lqb2ljbTlpTG5SM1pXVmtRR1Y0WVcxd2JHVXVZMjl0SWl
                    3aVlYUmZhR0Z6YUNJNklrMVZaRUZ5ZW1wWFJGTnJjbk5mZWs1eGR
                    EVkJVV2NpTENKemFXUWlPaUl4TjJObU1ESXhOaTAwTXpObExUUTJ
                    NRFV0T1RNM05pMWpNalF3TmpsbFpqQmxOMllpTENKaGRXUWlPaUo
                    wWlhOMFgyTnNhV1Z1ZENJc0ltVjRjQ0k2TVRVMk16VXpNREl6TWl
                    3aWFXRjBJam94TlRZek5USTVNRE15TENKcGMzTWlPaUpvZEhSd09
                    pOHZNVGt5TGpFMk9DNHhMakl5T1RvNE1EZ3hMMjl3Wlc1cFpDSjk
                    ubXZXR092R2dyLVFnUmE4UkZXS3M4aUtsNXBFUWxTUWpwV1NrOEV
                    uNjRMeFRaVjIzT0xrTHZKNlpkeFIxT0wyTU9obXkxYzd1UVR0eXN
                    rQW93eXVSSGF1c1lFWVBFQmc3U3l6XzZfYTlyeU5QclE4T1dEZ1R
                    VRnpzSDZWUFhSUWtTNEx1NlpzNTVTamVxMjd3MVozXzQ2a0ppWUV
                    ScDRQOVZYaFhPbTdOYTl1d3JGQ1BweEpJWk5obnJGd2o2S3BqZFZ
                    wS3FseWc0Q3dMSjdTUFBXZ09IUDRHcXRDUWJuNWFvT2tfeXhub3R
                    VYVBicmNPSWlVb25SN09MdEtVdS1VVkxLbHRIYTVnV3B2Rl83YXJ
                    pc2NrQVIyOHg4WE1OT3I1RlVBZ2k1OTQ2QWppdHZvNTFOdnQ2ZEF
                    3OWRxX1E0cG5Ka1lkeVJwQjB6QkFxbV9VVUQ1Q2tnIn19.yHaQNp
                    WVWVmBnwsjzGfniZZ3Lh-JeqgwMZTgpLqcDxY


Although that looks like pretty opaque encoded information, in fact anyone can read the
contents of a JWT.  There are JavaScript libraries for doing this, and also there's a
useful [online JWT debugging tool](https://jwt.io).  If you pasted your JSESSION cookie
value into this, you'd see three sections displayed: the Header, Payload and Signature.
The Payload section is the interesting bit and it should look something like this:

        {
          "exp": 1563531401,
          "iat": 1563530201,
          "iss": "qewd.jwt",
          "application": "oidc-provider-admin",
          "timeout": 1200,
          "qewd": "dc39b0a30706307fe3e9a5760a4793f7402e8a8b3159ae... etc",
          "isAuthenticated": true,
          "role": "idcr",
          "firstName": "Rob",
          "lastName": "Tweed",
          "uid": "e7224fa4aab57189cc3699ada2706faaabacdfcfc71bab0f7804e1c0a71adb0c",
          "openid": {
            "sub": 1,
            "family_name": "Tweed",
            "given_name": "Rob",
            "userId": 9999999001,
            "role": "idcr",
            "email": "rob.tweed@example.com",
            "at_hash": "MUdArzjWDSkrs_zNqt5AQg",
            "sid": "17cf0216-433e-4605-9376-c24069ef0e7f",
            "aud": "test_client",
            "exp": 1563530232,
            "iat": 1563529032,
            "iss": "http://192.168.1.229:8081/openid",
            "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtp... etc"
          }
        }

You can see that this is simply JSON.  The properties of a JWT JSON object are known as "claims", 
and you'll see two key claims in the one above:

- **id_token**: this is the raw, original Id_Token that was sent by the OIDC Provider when you
logged in
- **openid**: this is the decoded payload of that Id_Token, so all its information is readily
available to you for your own purposes.

Now, if you look at the *openid* property's sub-properties, you'll recognise some information:

          "openid": {

            "family_name": "Tweed",
            "given_name": "Rob",
            "userId": 9999999001,


and of course these values originated from the user information we saw earlier:

        "Users": {
          "test_client": [
            {
              "email": "rob.tweed@example.com",
              "claims": {
                "userId": 9999999001,     <======
                "given_name": "Rob",      <======
                "family_name": "Tweed",   <======
                "role": "idcr"
              }
            }
          ],


# The Demo Application's Home Page (continued)

So now it should become clear how the Welcome message is constructed: the browser-side JavaScript
fetches the JSESSIONID cookie, decodes it and then pulls out the *openid.family_name* and
*openid.given_name* claim values and displays them as part of the Welcome string.

The *openid.userId* claim value holds what will be the user's NHS Number, and that will be used
by the QEWD back-end to identify the user when it receives requests from the browser.

# The QEWD HIT Platform's JWT-based Security

Because the Orchestrator sent the JWT to the browser as a cookie named *JSESSIONID*, 
that JWT will be returned to the Orchestrator automatically with every REST request sent by the
browser.

And so we have the necessary chain of trust needed by QEWD to confirm the authenticity of requests
sent by the browser:  QEWD cannot have created the JWT with those specific Claims unless the user had
logged in via the OIDC Provider.

A key feature of JWTs is that they are digitally signed.  This means that although anyone can read them, 
they can only be created and modified by someone with the necessary key - known as a JWT Secret.

In a QEWD-based system, only the QEWD Orchestrator and MicroServices have and share this JWT Secret.
The browser does not have the JWT Secret, so it it tried to tamper with any of the Claims within the
JSESSION cookie, the digital signature would no longer be valid and the request would be rejected by
the Orchestrator.

Finally, if there's any doubt at the back-end about the authenticity of the JWT, it is possible to
extract the original Id_Token from the JWT and check against the OIDC Provider to confirm it
recognises it as an Id_Token it created.  In fact the demo application doesn't do this, but it's
a confirmation step that your applications can add if necessary.

Remember, by the way, that *NHS Login* is, itself, a standard OIDC Provider.  As such, everything 
described above will apply to a real-world application that uses the QEWD HIT Platform to 
integrate with NHS Login rather than the local QEWD-based OIDC Provider.  The only difference will
be in the claims it returns.  

In fact the NHS Login Id_Token includes a claim containing the
NHS Number, but doesn't return any user name information.  You are expected to retrieve that
information using either a separate, specific request to NHS Login, or from another system such
as a Master Patient Index, using the NHS Number as the identifier.

It's possible, by the way, to configure the QEWD OIDC Provider to behave identically to NHS Login,
complete with its added layers of security (all of which are standard OIDC Provider features that
the QEWD OIDC Provider also supports).  However, the "out of the box" version of the QEWD OIDC
Provider is configured to use the most basic form of OIDC access, in order to keep things initially
relatively straightforward to understand and develop against.


# Demo Application Options

When you are logged into the *demo* application, you will see in the left-hand table cell the
following buttons:

- Fetch Demographics
- Add an Allergy
- Fetch Allergies: OpenEHR Format
- Fetch Allergies: FHIR Format
- Fetch Allergy Schema from OpenEHR

Each of these demonstrates and exercises a different sub-system / MicroService.


## Fetch Demographics

This option will attempt to retrieve the demographics data for the NHS Number assigned
to the logged in user.  The Orchestrator will ask the *FHIR-MPI* MicroService to fetch
this data using the REST request:

        GET /mpi/Patient

Note: the NHS Number for the patient record to be fetched is obtained from the
JWT.  This prevents misuse of this REST request to arbitrarily fetch other the details
of other patients.

If you're using the platform for the first time and didn't modify
the user database, you'll have logged in as *Rob Tweed* and therefore your NHS Number will
be *9999999001*.  If this is the first time you've logged in and clicked the *Fetch Demographics* 
button, then there won't be any demographics data available on the FHIR MPI service.  The UI will
therefore bring up a form in the right-hand panel in which you can enter appropriate demographics 
data for *Rob Tweed*.

Fill out the fields and click the *Save* button at the bottom of the form.  Note the Date of Birth
should be entered in FHIR date format: YYYY-MM-DD

The Save button sends the form contents as the body payload of the REST request:

        POST /mpi/Patient

The NHS Number for the patient whose data is to be created is obtained from the JWT, preventing
misuse of this API.

The form will disappear and instead the data you entered will now be displayed in FHIR Patient Resource
Type format.

Provided you don't restart the FHIR MPI Container, every time you log into the *demo* application as
*Rob Tweed* and click the *Fetch Demgraphics* button, you'll see this FHIR-formatted data. [Note: if
you started the *FHIR-MPI* Container with a mapped set of YottaDB files on the host system, then
the Demographics data will persist between restarts]

You'll now see that the menu of buttons in the left-hand table cell has changed and the first
button is now *Edit Demographics*.  Clicking this will bring back the form, this time
pre-populated with the demographics data you previously entered.  You can now edit any of the data
and re-save it. 

Clicking the *Save* button sends the form contents as the body payload of the REST request:

        PUT /mpi/Patient

The NHS Number for the patient whose data is to be changed is obtained from the JWT, preventing
misuse of this API.

The FHIR-formatted Patient data that will now appear will be the edited version.


# Add an Allergy

Clicking this button brings up a form that allows you to enter the key details that describe
an Allergy for the patient.  For expedience, several of the fields are pre-populated, though you
can change these values as you wish.  As this is not intended to be a production system, there is
no validation applied to this form, either in the browser-side or server-side (QEWD-side) logic.
However, it will demonstrate the "round-trip" for you when saving a Clinical Heading to an OpenEHR
system.

If you enter all the fields and click the Save button, the request containing your form data is
sent to the Orchestrator which, in turn, forwards it to the OpenEHR Interface MicroService:

        POST /openehr/heading/:heading/:patientId

eg:

        POST /openehr/heading/allergies/9999999001

The back-end will confirm that the *patientId* value in the URI path matches the NHS
Number of the logged-in user (which is held in the JWT).

The OpenEHR interface starts an OpenEHR session (unless a current one already exists) using the
OpenEHR REST API:

        POST /rest/v1/session

It then transforms the simple JSON format containing your Allergy form data into the
unflattened *Flat JSON* format for the Allergy Template.

All JSON transformation carried out by the OpenEHR Interface


# Fetch Allergies: OpenEHR Format

Clicking this button will send a request via the Orchestrator to the OpenEHR Interface service, 
which, in turn, will start an OpenEHR session (unless a current one already exists),
fetch all the Allergy records for the logged-in user (9999999001 in our example) from the
OpenEHR system, which are returned to the browser and displayed in unflattened *Flat JSON*
format.


# Fetch Allergy Schema from OpenEHR

Clicking this button will send a request via the Orchestrator to the OpenEHR Interface service, which,
in turn, will start an OpenEHR session (unless a current one already exists), and then ask for an 
example of an Allergy Template in Flat JSON format.

What this button does is send the following request to the orchestrator:

        GET /openehr/schema/:heading

where *:heading* is the name of the heading - *allergies* in this case.

The Orchestrator forwards this request to the OpenEHR Interface MicroService which, in turn,
creates a session on the OpenEHR server (unless it already has a current one available) using the
OpenEHR REST request:

        POST /rest/v1/session

It then requests an example of the Flat JSON for an Allergy Template using the OpenEHR REST API:

        GET /rest/v1/template/:templateId/example?exampleFilter=INPUT&format=FLAT

The output from this OpenEHR API is actually modified to add the *ctx* properties that are
needed when saving a record using Flat JSON format.  The Flat JSON format is also "unflattened"
into a proper hierarchical JSON structure.

You'll see this appearing as the response in the right-hand table cell.

The idea is that you can then use this JSON structure as the basis of an OpenEHR Template's 
*"Rosetta Stone"* JSON record.  

You can use this to create the JSON transformation 
template files that the OpenEHR Interface MicroService uses to convert between OpenEHR format 
and other formats such as the UI format used for input from a browser form, display in the
browser, or other formats such as FHIR.

The *demo* application already provides pre-worked examples for the Allergy template.  See
the */qewd-hit-platform/openehr-ms/templates/allergies* folder, or in the
[Github repository](https://github.com/robtweed/qewd-hit-platform/tree/master/openehr-ms/templates/allergies).

Note: the OpenEHR Allergy Template used by the QEWD HIT Platform is 
*IDCR - Adverse Reaction List.v1*.  This is mapped to the heading name *allergies* in the
*/configuration/openehr.json* file in the OpenEHR Interface MicroService.  You can see
this [here in the Github Repository](https://github.com/robtweed/qewd-hit-platform/blob/master/openehr-ms/configuration/openehr.json):

        "headings": {
          "allergies": {
            "templateId": "IDCR - Adverse Reaction List.v1"
          },

You can add further OpenEHR templates and map them to a clinical heading name of your choice
by adding them to this section of the *openehr.json* file.  Note that each Template must be defined
and configured in your OpenEHR system.

