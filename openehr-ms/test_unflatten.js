/*

 ----------------------------------------------------------------------------
 | openehr-ms: OpenEHR Interface QEWD-Up MicroService                       |
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

  31 March 2019

*/

var unflatten = require('./utils/unflatten');

var flatJson = {
    "nss_respect_form/_uid": "b3c12a83-9888-4619-85b0-9c5487412d4d::nes.ripple.foundation::1",
    "nss_respect_form/language|code": "en",
    "nss_respect_form/language|terminology": "ISO_639-1",
    "nss_respect_form/territory|code": "GB",
    "nss_respect_form/territory|terminology": "ISO_3166-1",
    "nss_respect_form/context/_health_care_facility|id": "FV-DGH",
    "nss_respect_form/context/_health_care_facility|id_scheme": "NHSScotland",
    "nss_respect_form/context/_health_care_facility|id_namespace": "NHSScotland",
    "nss_respect_form/context/_health_care_facility|name": "Forth Valley DGH",
    "nss_respect_form/context/status": "Complete and signed",
    "nss_respect_form/context/start_time": "2016-12-20T00:11:02.518+02:00",
    "nss_respect_form/context/setting|code": "238",
    "nss_respect_form/context/setting|value": "other care",
    "nss_respect_form/context/setting|terminology": "openehr",
    "nss_respect_form/respect_headings/a2._summary_of_relevant_information/a2.0_relevant_information/respect_summary/narrative_summary": "Lung cancer with bone metastases",
    "nss_respect_form/respect_headings/a2._summary_of_relevant_information/a2.0_relevant_information/respect_summary/language|code": "en",
    "nss_respect_form/respect_headings/a2._summary_of_relevant_information/a2.0_relevant_information/respect_summary/language|terminology": "ISO_639-1",
    "nss_respect_form/respect_headings/a2._summary_of_relevant_information/a2.0_relevant_information/respect_summary/encoding|code": "UTF-8",
    "nss_respect_form/respect_headings/a2._summary_of_relevant_information/a2.0_relevant_information/respect_summary/encoding|terminology": "IANA_character-sets",
    "nss_respect_form/respect_headings/a3._personal_preferences/preferred_priorities_of_care/patient_care_priority": "Patient care priority 99",
    "nss_respect_form/respect_headings/a3._personal_preferences/preferred_priorities_of_care/language|code": "en",
    "nss_respect_form/respect_headings/a3._personal_preferences/preferred_priorities_of_care/language|terminology": "ISO_639-1",
    "nss_respect_form/respect_headings/a3._personal_preferences/preferred_priorities_of_care/encoding|code": "UTF-8",
    "nss_respect_form/respect_headings/a3._personal_preferences/preferred_priorities_of_care/encoding|terminology": "IANA_character-sets",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/recommendation/clinical_focus": "Symptom control",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/recommendation/clinical_guidance_on_interventions": "Clinical guidance on interventions 32",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/recommendation/language|code": "en",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/recommendation/language|terminology": "ISO_639-1",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/recommendation/encoding|code": "UTF-8",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/recommendation/encoding|terminology": "IANA_character-sets",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/cpr_decision/cpr_decision|code": "at0027",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/cpr_decision/cpr_decision|value": "For modified CPR child only",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/cpr_decision/cpr_decision|terminology": "local",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/cpr_decision/date_of_cpr_decision": "2019-03-03T23:09:53.120+01:00",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/cpr_decision/language|code": "en",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/cpr_decision/language|terminology": "ISO_639-1",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/cpr_decision/encoding|code": "UTF-8",
    "nss_respect_form/respect_headings/a4._clinical_recommendations/cpr_decision/encoding|terminology": "IANA_character-sets",
    "nss_respect_form/respect_headings/a5._capacity_and_representation/capacity_respect/sufficient_capacity": false,
    "nss_respect_form/respect_headings/a5._capacity_and_representation/capacity_respect/legal_proxy|code": "at0005",
    "nss_respect_form/respect_headings/a5._capacity_and_representation/capacity_respect/legal_proxy|value": "No",
    "nss_respect_form/respect_headings/a5._capacity_and_representation/capacity_respect/legal_proxy|terminology": "local",
    "nss_respect_form/respect_headings/a5._capacity_and_representation/capacity_respect/language|code": "en",
    "nss_respect_form/respect_headings/a5._capacity_and_representation/capacity_respect/language|terminology": "ISO_639-1",
    "nss_respect_form/respect_headings/a5._capacity_and_representation/capacity_respect/encoding|code": "UTF-8",
    "nss_respect_form/respect_headings/a5._capacity_and_representation/capacity_respect/encoding|terminology": "IANA_character-sets",
    "nss_respect_form/respect_headings/a6._involvement_in_making_plan/involvement_respect/involvement_in_recommendations/involvement|code": "at0003",
    "nss_respect_form/respect_headings/a6._involvement_in_making_plan/involvement_respect/involvement_in_recommendations/involvement|value": "A Person has mental capacity",
    "nss_respect_form/respect_headings/a6._involvement_in_making_plan/involvement_respect/involvement_in_recommendations/involvement|terminology": "local",
    "nss_respect_form/respect_headings/a6._involvement_in_making_plan/involvement_respect/involvement_in_recommendations/reason_for_not_selecting_options_a_or_b_or_c": "Reason for not selecting Options A or B or C 88",
    "nss_respect_form/respect_headings/a6._involvement_in_making_plan/involvement_respect/name_and_role_of_those_involved_in_decision_making": "Name and role of those involved in decision making 57",
    "nss_respect_form/respect_headings/a6._involvement_in_making_plan/involvement_respect/language|code": "en",
    "nss_respect_form/respect_headings/a6._involvement_in_making_plan/involvement_respect/language|terminology": "ISO_639-1",
    "nss_respect_form/respect_headings/a6._involvement_in_making_plan/involvement_respect/encoding|code": "UTF-8",
    "nss_respect_form/respect_headings/a6._involvement_in_making_plan/involvement_respect/encoding|terminology": "IANA_character-sets",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/ism_transition/current_state|code": "532",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/ism_transition/current_state|value": "completed",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/ism_transition/current_state|terminology": "openehr",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/ism_transition/careflow_step|code": "at0005",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/ism_transition/careflow_step|value": "Service activity complete",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/ism_transition/careflow_step|terminology": "local",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/service_name": "ReSPECT clinician signature",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/practitioner_role/designation": "Designation 48",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/name/use|code": "at0002",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/name/use|value": "Usual",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/name/use|terminology": "local",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/name/text": "Dr Miller",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/identifier/value": "12345",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/identifier/value|issuer": "ProfessionalID",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/identifier/value|assigner": "ProfessionalID",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/identifier/value|type": "ProfessionalID",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/identifier/use|code": "at0004",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/identifier/use|value": "Official",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/signing_clinician/identifier/use|terminology": "local",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/time": "2019-03-03T23:09:53.120+01:00",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/language|code": "en",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/language|terminology": "ISO_639-1",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/encoding|code": "UTF-8",
    "nss_respect_form/respect_headings/a7._clinician_signatures/clinician_signature:0/encoding|terminology": "IANA_character-sets",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/name": "ReSPECT emergency contacts",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/participant:0/role": "GP",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/participant:0/contact/name/use|code": "at0002",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/participant:0/contact/name/use|value": "Usual",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/participant:0/contact/name/use|terminology": "local",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/participant:0/contact/name/text": "Text 35",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/participant:0/contact/telephone/system|code": "at0012",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/participant:0/contact/telephone/system|value": "Phone",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/participant:0/contact/telephone/system|terminology": "local",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/participant:0/contact/telephone/telephone_number": "Telephone number 60",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/other_details": "Other details 70",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/language|code": "en",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/language|terminology": "ISO_639-1",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/encoding|code": "UTF-8",
    "nss_respect_form/respect_headings/a8._emergency_contacts/emergency_contacts/encoding|terminology": "IANA_character-sets",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/ism_transition/current_state|code": "532",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/ism_transition/current_state|value": "completed",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/ism_transition/current_state|terminology": "openehr",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/ism_transition/careflow_step|code": "at0005",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/ism_transition/careflow_step|value": "Service activity complete",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/ism_transition/careflow_step|terminology": "local",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/service_name": "Respect form - confirmation of validity",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/review_date": "2019-04-23T00:00:00.000Z",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/practitioner_role/designation": "Designation 26",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/name/use|code": "at0002",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/name/use|value": "Usual",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/name/use|terminology": "local",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/name/text": "Text 84",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/identifier/value": "c3507fd3-a867-4dea-b9d7-9f1f0fc996d3",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/identifier/value|issuer": "ProfessionalID",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/identifier/value|assigner": "ProfessionalID",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/identifier/value|type": "ProfessionalID",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/identifier/use|code": "at0004",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/identifier/use|value": "Official",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/responsible_clinician/identifier/use|terminology": "local",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/time": "2019-03-03T23:09:53.121+01:00",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/language|code": "en",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/language|terminology": "ISO_639-1",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/encoding|code": "UTF-8",
    "nss_respect_form/respect_headings/a9._confirmation_of_validity/service:0/encoding|terminology": "IANA_character-sets",
    "nss_respect_form/composer|id": "12345",
    "nss_respect_form/composer|id_scheme": "NHSScotland",
    "nss_respect_form/composer|id_namespace": "NHSScotland",
    "nss_respect_form/composer|name": "Dr Jonty Shannon"
};

var flatjson2 = {
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

  "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:0": "Itch",
  "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:1": "Sneezles",

  "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/category|code": "at0122",
 "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:2|code": "422400008",
  "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:2|value": "Vomiting",
  "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:2|terminology": "SNOMED-CT",
  "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:3|code": "422400008",
  "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:3|value": "Diarrhoea",
  "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/manifestation:3|terminology": "SNOMED-CT",

  "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/reaction_details/comment": "Reported by patient's carer",
  "adverse_reaction_list/allergies_and_adverse_reactions/adverse_reaction_risk:0/last_updated": "2017-12-20T00:11:02.518+02:00"
};


var json = unflatten(flatJson);

console.log(JSON.stringify(json, null, 2));

var json = unflatten(flatJson2);

console.log(JSON.stringify(json, null, 2));
