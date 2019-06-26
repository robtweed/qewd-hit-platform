/*

 ----------------------------------------------------------------------------
 | fhir-mpi: Demonstration QEWD-Up FHIR-based MPI MicroService              |
 |                                                                          |
 | Copyright (c) 2019 M/Gateway Developments Ltd,                           |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  11 June 2019

*/

var Validator = require('jsonschema').Validator;
var validator = new Validator();
var deref = require('json-schema-deref');
var schema = require('../../schema/patient.json');
var uuid = require('uuid/v4');

module.exports = function(args, finished) {

  // format patient record correctly as FHIR resource structure
  // if necessary

  if (!args.session.nhsNumber && args.session.openid.userId) {
    args.session.nhsNumber = args.session.openid.userId;
  }

  var nhsNumber = args.session.nhsNumber;
  var chiNumber = args.session.chiNumber;

  var fhir = args.req.body;
  fhir.resourceType = 'Patient';

  if (fhir.name && !Array.isArray(fhir.name)) {
    fhir.name = [fhir.name];
  }

  console.log('** fhir: ' + JSON.stringify(fhir, null, 2));

  if (fhir.address) {
    if (!Array.isArray(fhir.address)) {
      fhir.address = [fhir.address];
    }
  }
  else {
    fhir.address = [{
      line: [],
      city: '',
      district: '',
      postalCode: '',
      country: ''
    }];
  }
  if (fhir.address[0].line && !Array.isArray(fhir.address[0].line)) {
    fhir.address[0].line = [fhir.address[0].line];
  }
  if (!fhir.deceasedBoolean) {
    fhir.deceasedBoolean = false;
  }

  var _this = this;

  deref(schema, function(err, fullSchema) {

    var results = validator.validate(fhir, fullSchema.definitions.Patient);

    var errors = results.errors;
    if (errors && Array.isArray(errors) && errors.length > 0) {
      var errorText = '';
      var delim = '';
      errors.forEach(function(error) {
        errorText = errorText + delim + error.property + ': ' + error.message;
        delim = '; ' 
      });
      return finished({error: errorText});
    }

    var patientDoc = _this.db.use('Patient');

    // add FHIR resource identifiers

    fhir.id = uuid();
    var id = patientDoc.$('next_id').increment();
    fhir.identifier = [];
    if (nhsNumber && nhsNumber !== '') {
      fhir.identifier.push({
        system: 'https://fhir.nhs.uk/Id/nhs-number',
        value: nhsNumber
      });
    }
    if (chiNumber && chiNumber !== '') {
      fhir.identifier.push({
        system: 'urn:oid:2.16.840.1.113883.2.1.3.2.4.16.53',
        value: chiNumber
      });
    }

    // save FHIR resource
    //  indexing done by event-driven indexing mechanism
    //    see /docStoreEvents


    patientDoc.$(['by_id', id]).setDocument(fhir);

    finished({
      ok: true,
      uuid: fhir.id
    });

  });

}
