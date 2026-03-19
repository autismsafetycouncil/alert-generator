/**
 * render.js — Template engine and value normalization
 *
 * Syntax:
 *   {{field-id}}              — insert field value (empty string if absent)
 *   {{#field-id}}...{{/field-id}} — block included only if field is truthy
 */

/**
 * Render a Mustache-style template string with the given values.
 * @param {string} templateStr
 * @param {Record<string, string|boolean>} values
 * @returns {string}
 */
export function renderTemplate(templateStr, values) {
  // Conditional blocks: {{#key}}...{{/key}} — omitted entirely if value is falsy
  let result = templateStr.replace(
    /\{\{#([\w-]+)\}\}([\s\S]*?)\{\{\/[\w-]+\}\}/g,
    (_, key, content) => values[key] ? content : ''
  );
  // Simple substitution: {{key}}
  return result.replace(/\{\{([\w-]+)\}\}/g, (_, key) => values[key] || '');
}

/**
 * Normalize a hair field value.
 * Appends " hair" if the value doesn't already contain the word "hair"
 * and isn't the special-cased word "bald".
 * @param {string} raw
 * @returns {string}
 */
export function normalizeHair(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (/\bhair\b/i.test(trimmed)) return trimmed;
  if (trimmed.toLowerCase() === 'bald') return trimmed;
  return trimmed + ' hair';
}

/**
 * Apply field-level normalizers based on the field definition.
 * @param {Array} fields - field definitions from a template
 * @param {Record<string, string>} rawValues - values keyed by field id
 * @returns {Record<string, string>}
 */
export function normalizeValues(fields, rawValues) {
  const result = { ...rawValues };
  for (const field of fields) {
    if (field.normalize === 'hair' && result[field.id] !== undefined) {
      result[field.id] = normalizeHair(result[field.id]);
    }
  }
  return result;
}
