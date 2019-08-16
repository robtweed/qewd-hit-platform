
module.exports = function(args, finished) {
  const body = args.req.body;
  const fhir = {
    resourceType: 'Bundle',
    entry: []
  };
  
  const filterByField = function (patient) {
    if (body.gender && body.gender === patient.gender && !body.firstName && !body.lastName) {
      fhir.entry.push({
        resource: patient
      });
    } else if (body.firstName && body.lastName && body.firstName.toLowerCase() === patient.name[0].given[0].toLowerCase() && body.lastName.toLowerCase() === patient.name[0].family.toLowerCase() && body.gender && body.gender === patient.gender) {
      fhir.entry.push({
        resource: patient
      });
    } else if (body.firstName && body.lastName && body.firstName.toLowerCase() === patient.name[0].given[0].toLowerCase() && body.lastName.toLowerCase() === patient.name[0].family.toLowerCase() && !body.gender) {
      fhir.entry.push({
        resource: patient
      });
    } else if (!body.firstName && body.lastName && body.lastName.toLowerCase() === patient.name[0].family.toLowerCase() && !body.gender) {
      fhir.entry.push({
        resource: patient
      });
    } else if (!body.firstName && body.lastName && body.lastName.toLowerCase() === patient.name[0].family.toLowerCase() && body.gender && body.gender === patient.gender) {
      fhir.entry.push({
        resource: patient
      });
    } else if (!body.lastName && body.firstName && body.firstName.toLowerCase() === patient.name[0].given[0].toLowerCase() && !body.gender) {
      fhir.entry.push({
        resource: patient
      });
    } else if (!body.lastName && body.firstName && body.firstName.toLowerCase() === patient.name[0].given[0].toLowerCase() && body.gender === patient.gender) {
      fhir.entry.push({
        resource: patient
      });
    }
    if (!body.firstName && !body.lastName && !body.gender) {
      fhir.entry.push({
        resource: patient
      });
    }
  };
  
  let patientIndex = body.nhsNumber ? this.db.use('PatientIndex', 'by_identifier', body.nhsNumber) : this.db.use('PatientIndex', 'by_birthdate');
  
  const date = new Date();
  const from = date.getFullYear() - body.from +1;
  const to = date.getFullYear() - body.to;
  
  let params = {
    range: {
      from: `${to}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`,
      to: `${from}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
    }
  };
  
  if (body.nhsNumber) {
    if (!patientIndex.exists) {
      return finished({
        error: 'The specified Patient Id does not exist',
        status: {
          code: 404
        }
      });
    }
    const patient = this.db.use('Patient', 'by_id', patientIndex.firstChild.name).getDocument(true);
    fhir.entry.push({
      resource: patient
    });
    finished(fhir);
  }
  
  const patientDoc = this.db.use('Patient', 'by_id');
  if (body.birthDate) {
    
    patientIndex = this.db.use('PatientIndex', 'by_birthdate', body.birthDate);
    params = {};
  }
  patientIndex.forEachChild(params, function(id, node) {
    const ptId = body.birthDate ? id : node.firstChild.name;
    if (ptId) {
      const patient = patientDoc.$(ptId).getDocument(true);
      filterByField(patient);
     }
  });
  
  finished(fhir);
};
