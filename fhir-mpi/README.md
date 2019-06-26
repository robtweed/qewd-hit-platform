# fhir-mpi: Demonstration FHIR-based MPI
 
Rob Tweed <rtweed@mgateway.com>  
12 March 2019, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

# Background

This is a re-usable QEWD-Up MicroService that demonstrates a REST-interfaced, FHIR-based Master Patient Index (MPI), using QEWD's built-in YottaDB-based persistent JSON storage to provide the database.

Patient records are stored in their FHIR format.

QEWD's event-driven indexing is used to manage and maintain the indices needed for search and retrieval of patient records.

# APIs

- POST /mpi/Patient
- GET  /mpi/Patient/{id}
- GET  /mpi/Patient?name={surname}

The body payload for a new patient record can either be in strict FHIR format, eg:

        {
            "resourceType": "Patient",
            "name": [{
                "family": "Chalmers",
                "given": [
                    "Peter",
                    "James"
                ],
                "prefix": "Mr"
            }],
            "telecom": "07700 900000",
            "deceasedBoolean": false,
            "gender": "male",
            "birthDate": "1974-12-25",
            "address": [{
                "line": ["26, High Street"],
                "city": "Dundee",
                "district": "Tayside",
                "postalCode": "DU2 3SK",
                "country": "United Kingdom"
            }]
        }

However, a simpler structure can also be used, eg:

        {
          "name": {
            "family": "Chalmers",
            "given": [
              "Peter",
              "James"
            ],
            "prefix": "Mr"
          },
          "telecom": "07700 900000",
          "gender": "male",
          "birthDate": "1974-12-25",
          "address": {
            "line": "26, High Street",
            "city": "Dundee",
            "district": "Tayside",
            "postalCode": "DU2 3SK",
            "country": "United Kingdom"
          }
        }

This will automatically be converted and store as the full, correct FHIR format.

The following properties are also added at the time of saving:


        "id": {unique UUID-formatted id},
        "identifier": [{
          "system": "urn:oid:2.16.840.1.113883.2.1.3.2.4.16.53",
          "value": {unique integer id, assigned by QEWD}
        }]

