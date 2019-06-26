var x = {
  "ctx/composer_name": "Dr Jonty Shannon",
  "ctx/health_care_facility|id": "999999-345",
  "ctx/health_care_facility|name": "Home",
  "ctx/id_namespace": "NHS-UK",
  "ctx/id_scheme": "2.16.840.1.113883.2.1.4.3",
  "ctx/language": "en",
  "ctx/territory": "GB",
  "ctx/time": "2016-12-20T00:11:02.518+02:00",
   "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/_uid": "{{$guid}}",
   "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/causative_agent|code": "304270095",
   "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/causative_agent|value": "Erythromycin",
   "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/causative_agent|terminology": "SNOMED-CT",
   "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/category|code": "at0122",
   "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:0|code": "422400008",
   "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:0|value": "Vomiting",
   "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:0|terminology": "SNOMED-CT",
   "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/comment": "Reported by patient's carer",
   "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/last_updated": "2017-12-20T00:11:02.518+02:00"
};
var uf = require('./unflatten');
var fl = require('./flatten');

var output = uf(x);
console.log(JSON.stringify(output, null, 2));

var flat = fl(output);
console.log('================');
console.log(JSON.stringify(flat, null, 2));

