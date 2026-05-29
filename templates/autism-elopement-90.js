/**
 * Autistic Elopement — 90 characters (Standard WEA)
 *
 * Based on the NASC SafeSearch for Autism protocol.
 * See: https://www.autismsafetycouncil.org
 *
 * Template syntax:
 *   {{field}}                     — insert field value
 *   {{#field}}...{{/field}}       — include only if field is present / checkbox is checked
 */

export default {
  id: 'autism-elopement-90',
  name: 'Autistic Elopement — 90 characters',
  charLimit: 90,

  description:
    'Based on the NASC <strong>SEARCH</strong> protocol. ' +
    '<a href="https://cdn.prod.website-files.com/691df36c2bfdd23b8c789f03/69a70c2680bdb2d968255577_SafeSearch%20for%20Autism.pdf" ' +
    'target="_blank" rel="noopener">Download the SafeSearch for Autism protocol (PDF)</a>.',

  template:
    '{{#agency}}{{agency}}: {{/agency}}' +
    'MISSING CHILD w/ AUTISM' +
    '{{#race-gender}} {{race-gender}}{{/race-gender}}' +
    '{{#age}}, Age {{age}}{{/age}}' +
    '{{#clothing}}, {{clothing}}{{/clothing}}' +
    '. SEARCH WATER FIRST.',

  fields: [
    {
      id: 'agency',
      label: 'Issuing agency',
      type: 'text',
      placeholder: 'e.g. Smithtown Police Department',
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
  ],

  checkboxes: [],
};
