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

  12 March 2019

*/

module.exports = function(args, finished) {

  var name = args.req.query.name;
  var city = args.req.query.city;
  if (args.req.method == 'POST') {
    city = args.req.body.city;
    name = args.req.body.name;
  }

  if (typeof name === 'undefined' && typeof city === 'undefined') {
    return finished({error: 'Invalid query'});
  }

  if (typeof name !== 'undefined' && typeof city !== 'undefined') {
    return finished({error: 'Invalid query'});
  }

  if (typeof name !== 'undefined' && name === '') {
    return finished({error: 'Name was not defined'});
  }

  if (typeof city !== 'undefined' && city === '') {
    return finished({error: 'City was not defined'});
  }

  var patientIndex;
  var fhir = {
    resourceType: 'Bundle',
    entry: []
  };

  var patientDoc = this.db.use('Patient', 'by_id');

  if (name) {
    patientIndex = this.db.use('PatientIndex', 'by_surname', name.toLowerCase());
    if (!patientIndex.exists) {
      return finished({
        error: 'No patient with the specified name could be found',
        status: {
          code: 404
        }
      });
    }

    patientIndex.forEachChild(function(id) {
      fhir.entry.push({
        resource: patientDoc.$(id).getDocument(true)
      });
    });
  }
  else {
    patientIndex = this.db.use('PatientIndex', 'by_city', city.toLowerCase());
    if (!patientIndex.exists) {
      return finished({
        error: 'No patient with the specified city could be found',
        status: {
          code: 404
        }
      });
    }
    
    patientIndex.forEachChild(function(id) {
      fhir.entry.push({
        resource: patientDoc.$(id).getDocument(true)
      });
    });
  }
  
  finished(fhir);

};
