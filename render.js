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
  // Conditional blocks: {{#key}}...{{/key}} — omitted entirely if value is falsy.
  // Process innermost blocks first (content must not contain another {{#).
  // Loop until no more blocks remain.
  let result = templateStr;
  let prev;
  do {
    prev = result;
    result = result.replace(
      /\{\{#([\w-]+)\}\}((?:(?!\{\{#)[\s\S])*?)\{\{\/[\w-]+\}\}/g,
      (_, key, content) => values[key] ? content : ''
    );
  } while (result !== prev);
  // Simple substitution: {{key}}
  return result.replace(/\{\{([\w-]+)\}\}/g, (_, key) => values[key] || '');
}
