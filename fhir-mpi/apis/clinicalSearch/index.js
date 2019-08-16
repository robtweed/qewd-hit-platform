module.exports = function(args, finished) {
  const results = args.req.body.message.results;
  
  if(!results) {
    finished({error: 'Please provide search value'});
  }
  
  const fhir = {
    resourceType: 'Bundle',
    entry: []
  };
  
  
  const data = args.req.body.message.body;
  let range;
  
  if (data.from && data.to) {
    const date = new Date();
    const from = date.getFullYear() - data.from +1;
    const to = date.getFullYear() - data.to;
    range = {
      from: `${to}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`,
      to: `${from}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
    }
  }
  
  results.forEach(v => {
    const patientIndex = this.db.use('PatientIndex', 'by_identifier', v.nhsNo);
    if (patientIndex.exists) {
      const id = patientIndex.firstChild.name;
      const patient = this.db.use('Patient', 'by_id', id).getDocument(true);
      if (range && data.gender) {
        if (patient.birthDate >= range.from && patient.birthDate <= range.to && data.gender === patient.gender) {
          fhir.entry.push({
            resource: patient
          });
        }
      } else if(range && patient.birthDate >= range.from && patient.birthDate <= range.to) {
        fhir.entry.push({
          resource: patient
        });
      } else if (data.gender) {
         if (data.gender === patient.gender) {
           fhir.entry.push({
             resource: patient
           });
         }
      } else if (data.birthDate && patient.birthDate === data.birthDate) {
        fhir.entry.push({
          resource: patient
        });
      }
      if (!range && !data.gender && !data.birthDate) {
        fhir.entry.push({
          resource: patient
        });
      }
    }
  });
  finished(fhir)
};
