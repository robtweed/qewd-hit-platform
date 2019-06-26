# oidc-provider: OIDC Provider QEWD-Up MicroService
 
Rob Tweed <rtweed@mgateway.com>  
14 March 2019, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

# Background

This is a re-usable QEWD-Up MicroService that provides OpenId-Connect Provider functionality, for user authentication etc.

It uses the Node.js [oidc-provider](https://github.com/panva/node-oidc-provider) Module.

It also provides a user interface for maintaining the configuration settings and user database.  Use the URL path /oidc-admin to access it.

Patient records are stored in their FHIR format.


