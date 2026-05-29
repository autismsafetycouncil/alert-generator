/**
 * Autistic Elopement — 360 characters
 *
 * Based on the NASC SafeSearch for Autism protocol.
 * See: https://www.autismsafetycouncil.org
 *
 * Template syntax:
 *   {{field}}                     — insert field value
 *   {{#field}}...{{/field}}       — include only if field is present / checkbox is checked
 */

export default {
  id: 'autism-elopement-360',
  name: 'Autistic Elopement — 360 characters',
  charLimit: 360,

  description:
    'Based on the NASC <strong>SEARCH</strong> protocol. ' +
    '<a href="https://cdn.prod.website-files.com/691df36c2bfdd23b8c789f03/69a70c2680bdb2d968255577_SafeSearch%20for%20Autism.pdf" ' +
    'target="_blank" rel="noopener">Download the SafeSearch for Autism protocol (PDF)</a>.',

  template:
    '{{#agency}}{{agency}}: {{/agency}}' +
    'MISSING CHILD with AUTISM. EXTREME DROWNING RISK. ' +
    '{{#child-name}}{{child-name}}' +
    '{{#age}}, Age {{age}}{{/age}}' +
    '{{#race-gender}}, {{race-gender}}{{/race-gender}}' +
    '{{#clothing}}, {{clothing}}{{/clothing}}' +
    '{{#descriptor}}, {{descriptor}}{{/descriptor}}' +
    '{{#non-speaking}}, NONSPEAKING{{/non-speaking}}. {{/child-name}}' +
    '{{#location}}Last seen near {{location}}. {{/location}}' +
    'SEARCH ALL WATER NOW (ponds, pools, drains, spas, tanks - even if covered or dirty) and inside cars.' +
    '{{#may-hide}} Child may HIDE.{{/may-hide}} ' +
    'Stay at water if safe. IF SEEN, call 9-1-1.',

  fields: [
    {
      id: 'agency',
      label: 'Issuing agency',
      type: 'text',
      placeholder: 'e.g. Smithtown Police Department',
    },
    {
      id: 'child-name',
      label: "Child's full name",
      type: 'text',
      placeholder: 'e.g. Jane Doe',
    },
    {
      id: 'race-gender',
      label: 'Race & gender',
      type: 'text',
      placeholder: 'e.g. white female',
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      placeholder: 'e.g. 4',
      min: 1,
      max: 17,
    },
    {
      id: 'clothing',
      label: 'Clothing',
      type: 'text',
      placeholder: 'e.g. pink pajamas',
    },
    {
      id: 'descriptor',
      label: 'Identifiable clothing or description',
      type: 'text',
      placeholder: 'e.g. barefoot',
      hint: 'e.g. in diapers, on foot, barefoot',
    },
    {
      id: 'location',
      label: 'Last seen',
      type: 'text',
      placeholder: 'e.g. 800 Hill Avenue',
    },
  ],

  checkboxes: [
    {
      id: 'non-speaking',
      label: 'NONSPEAKING',
      description: 'Child cannot verbally communicate or call for help',
      default: true,
    },
    {
      id: 'may-hide',
      label: 'Child may HIDE',
      description: 'Child may hide from rescuers rather than approach them',
      default: true,
    },
  ],
};
