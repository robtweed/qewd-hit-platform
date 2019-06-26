var traverse = require('traverse');

var obj = {
  "uid": "f473e2ed-7f0a-41c9-9ef6-01632fe6c78b",
  "languages": [
    "en"
  ],
  "concept": "IDCR -  Adverse Reaction List.v1",
  "tree": {
    "min": 1,
    "max": 1,
    "children": [
      {
        "min": 0,
        "aql_path": "/content",
        "max": 1,
        "children": [
          {
            "min": 0,
            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]",
            "max": -1,
            "children": [
              {
                "min": 1,
                "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/protocol[at0042]",
                "max": 1,
                "children": [
                  {
                    "min": 0,
                    "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/protocol[at0042]/items[at0062]",
                    "max": 1,
                    "name": "Last updated",
                    "description": "Date when the propensity or the reaction event was updated.",
                    "id": "last_updated",
                    "category": "ELEMENT",
                    "type": "DV_DATE_TIME",
                    "constraints": [
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/protocol[at0042]/items[at0062]/value",
                        "mandatory_attributes": [
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "attribute_name": "value",
                        "constraint": {
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "type": "DV_DATE_TIME"
                      }
                    ],
                    "node_id": "at0062"
                  }
                ],
                "name": "Tree",
                "description": "@ internal @",
                "id": "tree",
                "type": "ITEM_TREE",
                "category": "DATA_STRUCTURE",
                "node_id": "at0042"
              },
              {
                "min": 1,
                "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]",
                "max": 1,
                "children": [
                  {
                    "min": 0,
                    "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0120]",
                    "max": 1,
                    "name": "Category",
                    "description": "Category of the identified 'Substance'.",
                    "id": "category",
                    "category": "ELEMENT",
                    "type": "MULTIPLE",
                    "constraints": [
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0120]/value",
                        "mandatory_attributes": [
                          {
                            "name": "DefiningCode",
                            "attribute": "defining_code",
                            "id": "defining_code",
                            "type": "CODE_PHRASE"
                          },
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "constraint": {
                          "defining_code": [
                            {
                              "code_string": "at0121",
                              "terminology": "local",
                              "description": "Any substance consumed to provide nutritional support for the body, such as peanut or egg.",
                              "value": "Food"
                            },
                            {
                              "code_string": "at0122",
                              "terminology": "local",
                              "description": "Any substance administered to achieve a physiological effect.",
                              "value": "Medication"
                            },
                            {
                              "code_string": "at0123",
                              "terminology": "local",
                              "description": "Any other substance encountered including venom, latex and other environmental substances.",
                              "value": "Other"
                            }
                          ],
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "attribute_name": "value",
                        "type": "DV_CODED_TEXT"
                      },
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0120]/value",
                        "mandatory_attributes": [
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "attribute_name": "value",
                        "constraint": {
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "type": "DV_TEXT"
                      }
                    ],
                    "node_id": "at0120"
                  },
                  {
                    "min": 1,
                    "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0002]",
                    "max": 1,
                    "name": "Causative agent",
                    "description": "Identification of a substance, or substance class, that is considered to put the individual at risk of an adverse reaction event.",
                    "id": "causative_agent",
                    "category": "ELEMENT",
                    "type": "DV_TEXT",
                    "constraints": [
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0002]/value",
                        "mandatory_attributes": [
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "attribute_name": "value",
                        "constraint": {
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "type": "DV_TEXT"
                      },
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0002]/name",
                        "mandatory_attributes": [
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "attribute_name": "name",
                        "constraint": {
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "type": "DV_TEXT"
                      }
                    ],
                    "node_id": "at0002"
                  },
                  {
                    "min": 0,
                    "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0101]",
                    "max": 1,
                    "name": "Criticality",
                    "description": "An indication of the potential for critical system organ damage or life threatening consequence.",
                    "id": "criticality",
                    "category": "ELEMENT",
                    "type": "DV_CODED_TEXT",
                    "constraints": [
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0101]/value",
                        "mandatory_attributes": [
                          {
                            "name": "DefiningCode",
                            "attribute": "defining_code",
                            "id": "defining_code",
                            "type": "CODE_PHRASE"
                          },
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "constraint": {
                          "defining_code": [
                            {
                              "code_string": "at0102",
                              "terminology": "local",
                              "description": "Exposure to substance unlikely to result in critical system organ damage or life threatening consequence. Future exposure to the identified 'Substance' should be considered a relative contra-indication in normal clinical circumstances.",
                              "value": "Low"
                            },
                            {
                              "code_string": "at0103",
                              "terminology": "local",
                              "description": "Exposure to substance may result in critical organ system damage or life threatening consequence. Future exposure to the identified 'Substance' should be considered an absolute contra-indication in normal clinical circumstances.",
                              "value": "High"
                            },
                            {
                              "code_string": "at0124",
                              "terminology": "local",
                              "description": "Unable to assess with information available.",
                              "value": "Indeterminate"
                            }
                          ],
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "attribute_name": "value",
                        "type": "DV_CODED_TEXT"
                      }
                    ],
                    "node_id": "at0101"
                  },
                  {
                    "min": 0,
                    "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0058]",
                    "max": 1,
                    "name": "Reaction mechanism",
                    "description": "Identification of the underlying physiological mechanism for the adverse reaction.",
                    "id": "reaction_mechanism",
                    "category": "ELEMENT",
                    "type": "MULTIPLE",
                    "constraints": [
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0058]/value",
                        "mandatory_attributes": [
                          {
                            "name": "DefiningCode",
                            "attribute": "defining_code",
                            "id": "defining_code",
                            "type": "CODE_PHRASE"
                          },
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "constraint": {
                          "defining_code": [
                            {
                              "code_string": "at0059",
                              "terminology": "local",
                              "description": "Immune mediated reaction, including allergic reactions and hypersensitivities.",
                              "value": "Immune mediated"
                            },
                            {
                              "code_string": "at0060",
                              "terminology": "local",
                              "description": "A non-immune mediated reaction, which can include pseudo-allergic reactions, side effects, intolerances, drug toxicities (for example, to Gentamicin).",
                              "value": "Non-immune mediated"
                            },
                            {
                              "code_string": "at0126",
                              "terminology": "local",
                              "description": "The physiological mechanism could not be determined.",
                              "value": "Indeterminate"
                            }
                          ],
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "attribute_name": "value",
                        "type": "DV_CODED_TEXT"
                      },
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0058]/value",
                        "mandatory_attributes": [
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "attribute_name": "value",
                        "constraint": {
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "type": "DV_TEXT"
                      }
                    ],
                    "node_id": "at0058"
                  },
                  {
                    "min": 0,
                    "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0006]",
                    "max": 1,
                    "name": "Comment",
                    "description": "Additional narrative about the propensity for the adverse reaction, not captured in other fields.",
                    "id": "comment",
                    "category": "ELEMENT",
                    "type": "DV_TEXT",
                    "constraints": [
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0006]/value",
                        "mandatory_attributes": [
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "attribute_name": "value",
                        "constraint": {
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "type": "DV_TEXT"
                      }
                    ],
                    "node_id": "at0006"
                  },
                  {
                    "min": 0,
                    "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0117]",
                    "max": 1,
                    "name": "Onset of last reaction",
                    "description": "The date and/or time of the onset of the last known occurrence of a reaction event.",
                    "id": "onset_of_last_reaction",
                    "category": "ELEMENT",
                    "type": "DV_DATE_TIME",
                    "constraints": [
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0117]/value",
                        "mandatory_attributes": [
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "attribute_name": "value",
                        "constraint": {
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "type": "DV_DATE_TIME"
                      }
                    ],
                    "node_id": "at0117"
                  },
                  {
                    "min": 0,
                    "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]",
                    "max": 1,
                    "children": [
                      {
                        "min": 0,
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0027]",
                        "max": 1,
                        "name": "Onset of reaction",
                        "description": "Record of the date and/or time of the onset of the reaction.",
                        "id": "onset_of_reaction",
                        "category": "ELEMENT",
                        "type": "DV_DATE_TIME",
                        "constraints": [
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0027]/value",
                            "mandatory_attributes": [
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "attribute_name": "value",
                            "constraint": {
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "type": "DV_DATE_TIME"
                          }
                        ],
                        "node_id": "at0027"
                      },
                      {
                        "min": 0,
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0106]",
                        "max": 1,
                        "name": "Route of exposure",
                        "description": "Identification of the route by which the subject was exposed to the identified 'Specific substance'.",
                        "id": "route_of_exposure",
                        "category": "ELEMENT",
                        "type": "DV_TEXT",
                        "constraints": [
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0106]/value",
                            "mandatory_attributes": [
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "attribute_name": "value",
                            "constraint": {
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "type": "DV_TEXT"
                          }
                        ],
                        "node_id": "at0106"
                      },
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/name",
                        "mandatory_attributes": [
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "attribute_name": "name",
                        "constraint": {
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "type": "DV_TEXT"
                      },
                      {
                        "min": 0,
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0011]",
                        "max": -1,
                        "name": "Manifestation",
                        "description": "Clinical symptoms and/or signs that are observed or associated with the adverse reaction.",
                        "id": "manifestation",
                        "category": "ELEMENT",
                        "type": "DV_TEXT",
                        "constraints": [
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0011]/value",
                            "mandatory_attributes": [
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "attribute_name": "value",
                            "constraint": {
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "type": "DV_TEXT"
                          }
                        ],
                        "node_id": "at0011"
                      },
                      {
                        "min": 0,
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0010]",
                        "max": 1,
                        "name": "Specific substance",
                        "description": "Identification of the substance considered to be responsible for the specific adverse reaction event.",
                        "id": "specific_substance",
                        "category": "ELEMENT",
                        "type": "DV_TEXT",
                        "constraints": [
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0010]/value",
                            "mandatory_attributes": [
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "attribute_name": "value",
                            "constraint": {
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "type": "DV_TEXT"
                          }
                        ],
                        "node_id": "at0010"
                      },
                      {
                        "min": 0,
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0021]",
                        "max": 1,
                        "name": "Certainty",
                        "description": "Statement about the degree of clinical certainty that the identified 'Specific substance' was the cause of the 'Manifestation' in this reaction event.",
                        "id": "certainty",
                        "category": "ELEMENT",
                        "type": "DV_CODED_TEXT",
                        "constraints": [
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0021]/value",
                            "mandatory_attributes": [
                              {
                                "name": "DefiningCode",
                                "attribute": "defining_code",
                                "id": "defining_code",
                                "type": "CODE_PHRASE"
                              },
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "constraint": {
                              "defining_code": [
                                {
                                  "code_string": "at0095",
                                  "terminology": "local",
                                  "description": "A low level of clinical certainty that the reaction was caused by the identified 'Specific substance'.",
                                  "value": "Suspected"
                                },
                                {
                                  "code_string": "at0023",
                                  "terminology": "local",
                                  "description": "A reasonable level of clinical certainty that the reaction was caused by the identified 'Specific substance'.",
                                  "value": "Likely"
                                },
                                {
                                  "code_string": "at0118",
                                  "terminology": "local",
                                  "description": "A high level of clinical certainty that the reaction was due to the identified 'Substance', which may include clinical evidence by testing or re-challenge.",
                                  "value": "Confirmed"
                                }
                              ],
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "attribute_name": "value",
                            "type": "DV_CODED_TEXT"
                          }
                        ],
                        "node_id": "at0021"
                      },
                      {
                        "min": 0,
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0032]",
                        "max": 1,
                        "name": "Comment",
                        "description": "Additional narrative about the adverse reaction event not captured in other fields.",
                        "id": "comment",
                        "category": "ELEMENT",
                        "type": "DV_TEXT",
                        "constraints": [
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0032]/value",
                            "mandatory_attributes": [
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "attribute_name": "value",
                            "constraint": {
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "type": "DV_TEXT"
                          },
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0032]/name",
                            "mandatory_attributes": [
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "attribute_name": "name",
                            "constraint": {
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "type": "DV_TEXT"
                          }
                        ],
                        "node_id": "at0032"
                      },
                      {
                        "min": 0,
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0012]",
                        "max": 1,
                        "name": "Reaction description",
                        "description": "Narrative description about the adverse reaction as a whole, including details of the manifestation if required.",
                        "id": "reaction_description",
                        "category": "ELEMENT",
                        "type": "DV_TEXT",
                        "constraints": [
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0012]/value",
                            "mandatory_attributes": [
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "attribute_name": "value",
                            "constraint": {
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "type": "DV_TEXT"
                          }
                        ],
                        "node_id": "at0012"
                      },
                      {
                        "min": 0,
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0089]",
                        "max": 1,
                        "name": "Severity",
                        "description": "Clinical assessment of the severity of the reaction event as a whole, potentially considering multiple different manifestations.",
                        "id": "severity",
                        "category": "ELEMENT",
                        "type": "MULTIPLE",
                        "constraints": [
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0089]/value",
                            "mandatory_attributes": [
                              {
                                "name": "DefiningCode",
                                "attribute": "defining_code",
                                "id": "defining_code",
                                "type": "CODE_PHRASE"
                              },
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "constraint": {
                              "defining_code": [
                                {
                                  "code_string": "at0093",
                                  "terminology": "local",
                                  "description": "Causes mild physiological effects.",
                                  "value": "Mild"
                                },
                                {
                                  "code_string": "at0092",
                                  "terminology": "local",
                                  "description": "Causes moderate physiological effects.",
                                  "value": "Moderate"
                                },
                                {
                                  "code_string": "at0090",
                                  "terminology": "local",
                                  "description": "Causes severe physiological effects.",
                                  "value": "Severe"
                                }
                              ],
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "attribute_name": "value",
                            "type": "DV_CODED_TEXT"
                          },
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0089]/value",
                            "mandatory_attributes": [
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "attribute_name": "value",
                            "constraint": {
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "type": "DV_TEXT"
                          },
                          {
                            "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0009]/items[at0089]/name",
                            "mandatory_attributes": [
                              {
                                "name": "Value",
                                "attribute": "value",
                                "id": "value",
                                "type": "STRING"
                              }
                            ],
                            "attribute_name": "name",
                            "constraint": {
                              "occurrence": {
                                "min": 1,
                                "max_op": "<=",
                                "min_op": ">=",
                                "max": 1
                              }
                            },
                            "type": "DV_TEXT"
                          }
                        ],
                        "node_id": "at0089"
                      }
                    ],
                    "name": "Reaction details",
                    "description": "Details about each adverse reaction event linked to exposure to the identified 'Substance'.",
                    "id": "reaction_details",
                    "type": "CLUSTER",
                    "category": "DATA_STRUCTURE",
                    "node_id": "at0009"
                  },
                  {
                    "min": 0,
                    "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0063]",
                    "max": 1,
                    "name": "Status",
                    "description": "Assertion about the certainty of the propensity, or potential future risk, of the identified 'Substance' to cause a reaction.",
                    "id": "status",
                    "category": "ELEMENT",
                    "type": "MULTIPLE",
                    "constraints": [
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0063]/value",
                        "mandatory_attributes": [
                          {
                            "name": "DefiningCode",
                            "attribute": "defining_code",
                            "id": "defining_code",
                            "type": "CODE_PHRASE"
                          },
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "constraint": {
                          "defining_code": [
                            {
                              "code_string": "at0127",
                              "terminology": "local",
                              "description": "A low level of clinical certainty about the propensity of a reaction to the identified 'Substance'.",
                              "value": "Suspected"
                            },
                            {
                              "code_string": "at0064",
                              "terminology": "local",
                              "description": "A reasonable level of certainty about the propensity for a reaction to the identified 'Substance'.",
                              "value": "Likely"
                            },
                            {
                              "code_string": "at0065",
                              "terminology": "local",
                              "description": "A high level of certainty about the propensity for a reaction to the identified 'Substance', which may include clinical evidence by testing or re-challenge.",
                              "value": "Confirmed"
                            },
                            {
                              "code_string": "at0067",
                              "terminology": "local",
                              "description": "The previously known reaction to the identified 'Substance' has been clinically reassessed and considered no longer to be an active risk.",
                              "value": "Resolved"
                            },
                            {
                              "code_string": "at0066",
                              "terminology": "local",
                              "description": "The propensity for a reaction to the identified 'Substance' has been clinically reassessed or has been disproved with a high level of clinical certainty by re-exposure or deliberate challenge.",
                              "value": "Refuted"
                            }
                          ],
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "attribute_name": "value",
                        "type": "DV_CODED_TEXT"
                      },
                      {
                        "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/data[at0001]/items[at0063]/value",
                        "mandatory_attributes": [
                          {
                            "name": "Value",
                            "attribute": "value",
                            "id": "value",
                            "type": "STRING"
                          }
                        ],
                        "attribute_name": "value",
                        "constraint": {
                          "occurrence": {
                            "min": 1,
                            "max_op": "<=",
                            "min_op": ">=",
                            "max": 1
                          }
                        },
                        "type": "DV_TEXT"
                      }
                    ],
                    "node_id": "at0063"
                  }
                ],
                "name": "Tree",
                "description": "@ internal @",
                "id": "tree",
                "type": "ITEM_TREE",
                "category": "DATA_STRUCTURE",
                "node_id": "at0001"
              },
              {
                "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/subject",
                "mandatory_attributes": [
                  {
                    "name": "Namespace",
                    "attribute": "namespace",
                    "id": "namespace",
                    "type": "STRING"
                  },
                  {
                    "name": "Id",
                    "attribute": "id",
                    "id": "id",
                    "type": "OBJECT_ID"
                  },
                  {
                    "name": "Type",
                    "attribute": "type",
                    "id": "type",
                    "type": "STRING"
                  }
                ],
                "name": "Subject",
                "attribute": "subject",
                "id": "subject",
                "occurrence": {
                  "min": 1,
                  "max_op": "<=",
                  "min_op": ">=",
                  "max": 1
                },
                "category": "ATTRIBUTE",
                "type": "PARTY_PROXY"
              },
              {
                "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/language",
                "mandatory_attributes": [
                  {
                    "name": "CodeString",
                    "attribute": "code_string",
                    "id": "code_string",
                    "type": "STRING"
                  },
                  {
                    "name": "TerminologyId",
                    "attribute": "terminology_id",
                    "id": "terminology_id",
                    "type": "TERMINOLOGY_ID"
                  }
                ],
                "name": "Language",
                "attribute": "language",
                "id": "language",
                "occurrence": {
                  "min": 1,
                  "max_op": "<=",
                  "min_op": ">=",
                  "max": 1
                },
                "category": "ATTRIBUTE",
                "type": "CODE_PHRASE"
              },
              {
                "aql_path": "/content[openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1]/items[openEHR-EHR-EVALUATION.adverse_reaction_risk.v1]/encoding",
                "mandatory_attributes": [
                  {
                    "name": "CodeString",
                    "attribute": "code_string",
                    "id": "code_string",
                    "type": "STRING"
                  },
                  {
                    "name": "TerminologyId",
                    "attribute": "terminology_id",
                    "id": "terminology_id",
                    "type": "TERMINOLOGY_ID"
                  }
                ],
                "name": "Encoding",
                "attribute": "encoding",
                "id": "encoding",
                "occurrence": {
                  "min": 1,
                  "max_op": "<=",
                  "min_op": ">=",
                  "max": 1
                },
                "category": "ATTRIBUTE",
                "type": "CODE_PHRASE"
              }
            ],
            "name": "Adverse reaction risk",
            "description": "Risk of harmful or undesirable physiological response which is unique to an individual and associated with exposure to a substance.",
            "id": "adverse_reaction_risk",
            "type": "EVALUATION",
            "category": "DATA_STRUCTURE",
            "node_id": "openEHR-EHR-EVALUATION.adverse_reaction_risk.v1"
          }
        ],
        "name": "Allergies and adverse reactions",
        "description": "Allergies and adverse reactions heading (AoMRC).",
        "id": "allergies_and_adverse_reactions",
        "type": "SECTION",
        "category": "DATA_STRUCTURE",
        "node_id": "openEHR-EHR-SECTION.allergies_adverse_reactions_rcp.v1"
      },
      {
        "aql_path": "/composer",
        "mandatory_attributes": [
          {
            "name": "Namespace",
            "attribute": "namespace",
            "id": "namespace",
            "type": "STRING"
          },
          {
            "name": "Id",
            "attribute": "id",
            "id": "id",
            "type": "OBJECT_ID"
          },
          {
            "name": "Type",
            "attribute": "type",
            "id": "type",
            "type": "STRING"
          }
        ],
        "name": "Composer",
        "attribute": "composer",
        "id": "composer",
        "occurrence": {
          "min": 1,
          "max_op": "<=",
          "min_op": ">=",
          "max": 1
        },
        "category": "ATTRIBUTE",
        "type": "PARTY_PROXY"
      },
      {
        "aql_path": "/language",
        "mandatory_attributes": [
          {
            "name": "CodeString",
            "attribute": "code_string",
            "id": "code_string",
            "type": "STRING"
          },
          {
            "name": "TerminologyId",
            "attribute": "terminology_id",
            "id": "terminology_id",
            "type": "TERMINOLOGY_ID"
          }
        ],
        "name": "Language",
        "attribute": "language",
        "id": "language",
        "occurrence": {
          "min": 1,
          "max_op": "<=",
          "min_op": ">=",
          "max": 1
        },
        "category": "ATTRIBUTE",
        "type": "CODE_PHRASE"
      },
      {
        "aql_path": "/category",
        "mandatory_attributes": [
          {
            "name": "DefiningCode",
            "attribute": "defining_code",
            "id": "defining_code",
            "type": "CODE_PHRASE"
          },
          {
            "name": "Value",
            "attribute": "value",
            "id": "value",
            "type": "STRING"
          }
        ],
        "name": "Category",
        "attribute": "category",
        "id": "category",
        "occurrence": {
          "min": 1,
          "max_op": "<=",
          "min_op": ">=",
          "max": 1
        },
        "category": "ATTRIBUTE",
        "type": "DV_CODED_TEXT"
      },
      {
        "aql_path": "/territory",
        "mandatory_attributes": [
          {
            "name": "CodeString",
            "attribute": "code_string",
            "id": "code_string",
            "type": "STRING"
          },
          {
            "name": "TerminologyId",
            "attribute": "terminology_id",
            "id": "terminology_id",
            "type": "TERMINOLOGY_ID"
          }
        ],
        "name": "Territory",
        "attribute": "territory",
        "id": "territory",
        "occurrence": {
          "min": 1,
          "max_op": "<=",
          "min_op": ">=",
          "max": 1
        },
        "category": "ATTRIBUTE",
        "type": "CODE_PHRASE"
      },
      {
        "min": 1,
        "aql_path": "/context",
        "max": 1,
        "children": [
          {
            "aql_path": "/context/start_time",
            "mandatory_attributes": [
              {
                "name": "Value",
                "attribute": "value",
                "id": "value",
                "type": "STRING"
              }
            ],
            "name": "StartTime",
            "attribute": "start_time",
            "id": "start_time",
            "occurrence": {
              "min": 1,
              "max_op": "<=",
              "min_op": ">=",
              "max": 1
            },
            "category": "ATTRIBUTE",
            "type": "DV_DATE_TIME"
          },
          {
            "aql_path": "/context/setting",
            "mandatory_attributes": [
              {
                "name": "DefiningCode",
                "attribute": "defining_code",
                "id": "defining_code",
                "type": "CODE_PHRASE"
              },
              {
                "name": "Value",
                "attribute": "value",
                "id": "value",
                "type": "STRING"
              }
            ],
            "name": "Setting",
            "attribute": "setting",
            "id": "setting",
            "occurrence": {
              "min": 1,
              "max_op": "<=",
              "min_op": ">=",
              "max": 1
            },
            "category": "ATTRIBUTE",
            "type": "DV_CODED_TEXT"
          }
        ],
        "name": "Context",
        "rm_type": "EVENT_CONTEXT",
        "attribute": "context",
        "id": "context",
        "node_id": ""
      }
    ],
    "name": "Adverse reaction list",
    "description": "A persistent and managed list of adverse reactions experienced by the subject that may influence clinical decision-making and care provision.",
    "id": "adverse_reaction_list",
    "type": "COMPOSITION",
    "category": "DATA_STRUCTURE",
    "node_id": "openEHR-EHR-COMPOSITION.adverse_reaction_list.v1"
  },
  "template_id": "IDCR - Adverse Reaction List.v1",
  "default_language": "en"
};

traverse(obj).map(function(node) {
  if (this.key === 'id') {
    //console.log(this.path);
    console.log(node);
  }
});
