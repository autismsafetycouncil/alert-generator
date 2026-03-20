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
    '{{#agency}}[{{agency}}] {{/agency}}' +
    '{{#child-name}}{{child-name}}{{#age}}, {{age}}{{/age}}{{#clothing}}, {{clothing}}{{/clothing}}. {{/child-name}}' +
    'MISSING AUTISTIC CHILD. DROWNING RISK.' +
    '{{#non-speaking}} NONSPEAKING.{{/non-speaking}} ' +
    'CHECK WATER/CARS. CALL 9-1-1',

  fields: [
    {
      id: 'agency',
      label: 'Issuing agency',
      type: 'text',
      placeholder: 'e.g. BPD',
    },
    {
      id: 'child-name',
      label: "Child's full name",
      type: 'text',
      placeholder: 'e.g. John Doe',
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      placeholder: 'e.g. 8',
      min: 1,
      max: 17,
    },
    {
      id: 'clothing',
      label: 'Clothing',
      type: 'text',
      placeholder: 'e.g. red shirt',
    },
  ],

  checkboxes: [
    {
      id: 'non-speaking',
      label: 'NONSPEAKING',
      description: 'Child cannot verbally communicate or call for help',
      default: true,
    },
  ],
};
