import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { renderTemplate, normalizeHair, normalizeValues } from './render.js';
import { templates } from './templates.js';

// Helper: find template by id and render with given values
const template360 = templates.find(t => t.id === 'autism-elopement-360');
assert.ok(template360, 'autism-elopement-360 template must exist');
function render(values) {
  const normalized = normalizeValues(template360.fields, values);
  return renderTemplate(template360.template, normalized);
}

const template90 = templates.find(t => t.id === 'autism-elopement-90');
assert.ok(template90, 'autism-elopement-90 template must exist');
function render90(values) {
  const normalized = normalizeValues(template90.fields, values);
  return renderTemplate(template90.template, normalized);
}

// --- normalizeHair -----------------------------------------------------------

describe('normalizeHair', () => {
  test('appends "hair" to a bare color', () => {
    assert.equal(normalizeHair('brown'), 'brown hair');
  });

  test('does not double-append when "hair" already present', () => {
    assert.equal(normalizeHair('brown hair'), 'brown hair');
  });

  test('appends "hair" to multi-word color without "hair"', () => {
    assert.equal(normalizeHair('curly brown'), 'curly brown hair');
  });

  test('"bald" is left unchanged (only exception)', () => {
    assert.equal(normalizeHair('bald'), 'bald');
  });

  test('case-insensitive "hair" detection', () => {
    assert.equal(normalizeHair('Brown Hair'), 'Brown Hair');
  });

  test('empty string returns empty string', () => {
    assert.equal(normalizeHair(''), '');
  });
});

// --- renderTemplate ----------------------------------------------------------

describe('renderTemplate', () => {
  test('replaces simple {{field}} tokens', () => {
    const result = renderTemplate('Hello {{name}}!', { name: 'World' });
    assert.equal(result, 'Hello World!');
  });

  test('replaces missing {{field}} with empty string', () => {
    const result = renderTemplate('Hello {{name}}!', {});
    assert.equal(result, 'Hello !');
  });

  test('includes {{#field}} block when value is truthy', () => {
    const result = renderTemplate('a{{#x}}, b{{/x}}', { x: 'yes' });
    assert.equal(result, 'a, b');
  });

  test('omits {{#field}} block when value is falsy', () => {
    const result = renderTemplate('a{{#x}}, b{{/x}}', { x: '' });
    assert.equal(result, 'a');
  });

  test('omits {{#field}} block when key is absent', () => {
    const result = renderTemplate('a{{#x}}, b{{/x}}', {});
    assert.equal(result, 'a');
  });
});

// --- Autism elopement 360 template -------------------------------------------

describe('autism-elopement-360 template', () => {

  // Agency
  test('agency wraps in brackets when present', () => {
    const out = render({ agency: 'Cary PD', 'child-name': 'Alex' });
    assert.match(out, /^\[Cary PD\]:/);
  });

  test('no bracket prefix when agency is absent', () => {
    const out = render({ 'child-name': 'Alex' });
    assert.match(out, /^MISSING CHILD/);
  });

  // Hair normalization via template
  test('bare color in hair field gets "hair" appended', () => {
    const out = render({ hair: 'brown' });
    assert.ok(out.includes('brown hair'), `Expected "brown hair" in: ${out}`);
  });

  test('"brown hair" in hair field is not doubled', () => {
    const out = render({ hair: 'brown hair' });
    assert.ok(!out.includes('brown hair hair'), `Got double "hair" in: ${out}`);
    assert.ok(out.includes('brown hair'));
  });

  test('"bald" in hair field is unchanged', () => {
    const out = render({ hair: 'bald' });
    assert.ok(out.includes('bald'));
    assert.ok(!out.includes('bald hair'));
  });

  test('empty hair field omits hair from output', () => {
    const out = render({ hair: '' });
    // Should not have a dangling comma where hair would be
    assert.ok(!out.includes(', ,'));
  });

  // Location
  test('location renders with LAST SEEN prefix', () => {
    const out = render({ location: 'Davis Dr heading toward I-40' });
    assert.ok(out.includes('LAST SEEN: Davis Dr heading toward I-40.'));
  });

  test('location with leading "On" is preserved verbatim', () => {
    const out = render({ location: 'On Davis Drive' });
    assert.ok(out.includes('LAST SEEN: On Davis Drive.'));
  });

  test('empty location omits LAST SEEN clause', () => {
    const out = render({ location: '' });
    assert.ok(!out.includes('LAST SEEN'));
  });

  // Optional field skipping
  test('missing clothing produces no orphan comma', () => {
    const out = render({ 'child-name': 'Alex', hair: 'brown', clothing: '' });
    assert.ok(!out.includes(', ,'), `Orphan comma in: ${out}`);
    assert.ok(!out.includes(',  '), `Double-space comma in: ${out}`);
  });

  test('missing description is skipped cleanly', () => {
    const out = render({ 'child-name': 'Alex', description: '', age: '7' });
    assert.ok(out.includes('Alex, age 7'));
  });

  // Checkboxes
  test('non-speaking: true includes NONSPEAKING', () => {
    const out = render({ 'non-speaking': true });
    assert.ok(out.includes('NONSPEAKING'));
  });

  test('non-speaking: false omits NONSPEAKING', () => {
    const out = render({ 'non-speaking': false });
    assert.ok(!out.includes('NONSPEAKING'));
  });

  test('may-hide: true includes "Child may HIDE."', () => {
    const out = render({ 'may-hide': true });
    assert.ok(out.includes('Child may HIDE.'));
  });

  test('may-hide: false omits "Child may HIDE."', () => {
    const out = render({ 'may-hide': false });
    assert.ok(!out.includes('Child may HIDE.'));
  });

  // Static directives always present
  test('SEARCH ALL WATER NOW always present', () => {
    const out = render({});
    assert.ok(out.includes('SEARCH ALL WATER NOW'));
  });

  test('STAY AT WATER if able always present', () => {
    const out = render({});
    assert.ok(out.includes('STAY AT WATER if able'));
  });

  // Smoke test — full alert within character limit
  test('full alert with all fields is ≤ 360 characters', () => {
    const out = render({
      agency: 'Cary Police Dept',
      'child-name': 'Alex Smith',
      description: 'white male',
      age: '7',
      hair: 'brown',
      clothing: 'red pajamas',
      location: '100 block of Main St',
      'non-speaking': true,
      'may-hide': true,
    });
    assert.ok(
      out.length <= 360,
      `Alert is ${out.length} characters (limit: 360):\n${out}`
    );
  });
});

// --- Autism elopement 90 template --------------------------------------------

describe('autism-elopement-90 template', () => {

  // Static text
  test('MISSING AUTISTIC CHILD always present', () => {
    assert.ok(render90({}).includes('MISSING AUTISTIC CHILD'));
  });

  test('DROWNING RISK always present', () => {
    assert.ok(render90({}).includes('DROWNING RISK'));
  });

  test('CHECK WATER/CARS always present', () => {
    assert.ok(render90({}).includes('CHECK WATER/CARS'));
  });

  test('CALL 9-1-1 always present', () => {
    assert.ok(render90({}).includes('CALL 9-1-1'));
  });

  // Agency
  test('agency wraps in brackets when present', () => {
    const out = render90({ agency: 'Cary PD' });
    assert.match(out, /^\[Cary PD\]/);
  });

  test('no bracket prefix when agency is absent', () => {
    const out = render90({});
    assert.match(out, /^MISSING AUTISTIC CHILD/);
  });

  // Child details
  test('child name, age, and clothing render before static text', () => {
    const out = render90({ 'child-name': 'Jake Smith', age: '7', clothing: 'red shirt' });
    assert.ok(out.includes('Jake Smith, 7, red shirt. MISSING AUTISTIC CHILD'));
  });

  test('child name without age or clothing renders cleanly', () => {
    const out = render90({ 'child-name': 'Jake Smith' });
    assert.ok(out.includes('Jake Smith. MISSING AUTISTIC CHILD'));
    assert.ok(!out.includes(', .'));
  });

  // Checkboxes
  test('non-speaking: true includes NONSPEAKING', () => {
    const out = render90({ 'non-speaking': true });
    assert.ok(out.includes('NONSPEAKING'));
  });

  test('non-speaking: false omits NONSPEAKING', () => {
    const out = render90({ 'non-speaking': false });
    assert.ok(!out.includes('NONSPEAKING'));
  });

  // Smoke test — static-only render within character limit
  test('static-only render is ≤ 90 characters', () => {
    const out = render90({ 'non-speaking': false });
    assert.ok(
      out.length <= 90,
      `Static alert is ${out.length} characters (limit: 90):\n${out}`
    );
  });
});
