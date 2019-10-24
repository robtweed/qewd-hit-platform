# Getting PulseTile to run with the QEWD HIT Platform

The following notes assume that you will run everything on the same server, including EtherCIS.
This is the simplest way to try it all out and familiarise yourself with how it all works.

## Set up a user

This step is optional if you already have a user you can use on your server.

This step is mandatory if you only have root set up as a user on your server.

I'm going to assume you'll create a user named *ripple*:

[Follow these instructions](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04)


## Enable access to the ports we'll use

Make sure ports 80, 8080, 8081 and 8000 are accessible externally

eg using *ufw*

        sudo ufw allow 80
        sudo ufw allow 8080
        sudo ufw allow 8081
        sudo ufw allow 8000

Check using:

        sudo ufw status

## Install and Configure the QEWD HIT Platform

Follow the instructions for 
[installing and configuring the QEWD HIT Platform](https://github.com/robtweed/qewd-hit-platform/blob/master/docs/running.md)

Note: Make sure you configured the openehr-ms MicroService to point to an OpenEHR server at port 8000 on the same machine


## Install EtherCIS

[Set up EtherCIS-db container and start it](https://github.com/robtweed/ethercis-db-1.3)

[Set up EtherCIS-Server container and start it](https://github.com/robtweed/ethercis-server-1.3)

Note: start the EtherCIS-server container  to listen on port 8000 using this command:

        docker run -it --rm --name ethercis-server --net ecis-net -e DB_IP=ethercis-db -e DB_PORT=5432 -e DB_USER=postgres -e DB_PW=postgres -p 8000:8080 rtweed/ethercis-server

## Try out the QEWD Platform


If you corectly followed all the steps, the demo app should now work.

Point your browser at the path /demo, using port 8080 on your QEWD HIT Platform server, eg:

        http://192.168.1.100:8080/demo


Try logging in as *rob.tweed@example.com* with a password of *password*

Select the *List Templates* option.

If you see a list of templates being returned, these have come from the EtherCIS-Server container, so
everything would seem to be working.

It is recommended that you familiarise yourself with the QEWD HIT Platform's functionality.  See the
[documentation for the various included applications](https://github.com/robtweed/qewd-hit-platform/tree/master/docs)



## Installing and Configuring PulseTile

Now we need to install and configure PulseTile.  PulseTile's APIs expect different endpoints to those
provided by the HIT Platform, so this incompatibility is resolved using NGINX and a set of URL 
rewrite rules.

There are several other changes that also need to be made to the configuration you set up
above, so closely follow the steps below:


### Install and set up NGINX

[Follow these instructions](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04)

### Install the pre-built Configuration Files

1) Replace */etc/nginx/nginx.conf* with the version you’ll find in *~/qewd-hit-platform/NGINX*:

        sudo cp ~/qewd-hit-platform/NGINX/nginx.conf /etc/nginx

2) Add to */etc/nginx/conf.d/* the configuration file you’ll find in *~/qewd-hit-platform/NGINX/conf.d/default.conf*:

        sudo cp ~/qewd-hit-platform/NGINX/conf.d/default.conf /etc/nginx/conf.d

3) Restart nginx:

        sudo systemctl restart nginx

### Install the PulseTile UI Files

Get the demo build of PulseTile’s UI files.  
The easiest way is to use *subversion* which you install as follows:

        sudo apt-get install -y subversion

Then you can pull in the build files:

        cd ~
        svn export https://github.com/PulseTile/PulseTile-RA-Lerna/trunk/projects/london/build pulsetile

Now move them to the Orchestrator’s Web Server root directory:

        mv ~/pulsetile ~/qewd-hit-platform/main/orchestrator/www


### Make the Following Configuration File Changes

Changes needed:

#### 1) OIDC Client redirection for PulseTile

Find and edit the file:

        ~/qewd-hit-platform/oidc-client/configuration/oidc.json

Within the JSON in this file, find the *oidc_provider.clients.pulsetile.index_url* 
line which should look something like this:

        "index_url": "http://178.128.172.121:8080/index.html"

Remove the :8080 so it looks like this:

        "index_url": "http://178.128.172.121/index.html"

Save the edited file


#### (2) JWT IdToken claim Mappings

Find and edit the file:

        ~/qewd-hit-platform/oidc-client/configuration/extract_idToken_fields.js

which should contain:

        jwt.role = idToken.role;
        jwt.firstName = idToken.given_name;
        jwt.lastName = idToken.family_name;

Add this to the end of this block of lines:

        jwt.nhsNumber = idToken.userId;


Save the edited file

Restart the OIDC_Client MicroService container


#### (3)  Import Clinical Heading JSON Transformation Templates

Import Tony Shannon's clinical heading JSON transformation templates:

        cd ~
        svn export https://github.com/QEWD-Courier/Qewd-HIT-json-transforms/branches/develop/clinical-headings-templates templates

Replace the QEWD HIT Platform's demo templates with these new ones:

        rm -r ~/qewd-hit-platform/openehr-ms/templates
        mv templates ~/qewd-hit-platform/openehr-ms

Restart the OpenEHR-ms container


## Try It Out

You should now be able to start up the PulseTile UI by pointing at the root path on the server running NGINX and the HIT Platform 
containers, eg:

        http://192.168.1.100

Note: if you don’t get redirected to the OIDC Provider’s Login screen, 
it will be because an expired JWT exists as a cookie, and you also may 
have some local storage items that will need clearing down.  

If you’re using Chrome, you can clear both of these from the 
Developer Tools / Application tab:

Expand the Local Storage and Cookies menu tabs, drop down to the URL that will 
appear underneath, Right Click and click on the Clear popup.

Then reload the page in the browser and you should get redirected.  
Alternatively, open an incognito window to try it out.


