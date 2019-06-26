var transform = require('qewd-transform-json').transform;
var template = require('./ui_to_openehr.json');
var flatten = require('../../utils/flatten');


var data = {
  composer: 'Rob Tweed',
  now: new Date().toISOString(),
  allergies: [
    {
      causative_agent: {
        value: 'Erythromycin',
        code: '304270095',
        terminology: 'SNOMED-CT'
      },
      manifestations: [
        {
          value: 'Vomiting',
          code: '422400008',
          terminology: 'SNOMED-CT'
        }
      ],
      comment: 'Reported by carer'
    }
  ]
};

var json = transform(template, data, {});
var flat = flatten(json);

console.log(JSON.stringify(flat, null, 2));
