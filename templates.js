/**
 * templates.js — Registry of all alert templates.
 *
 * To add a new template:
 *   1. Create a file in templates/your-template-id.js
 *   2. Add an import and entry below.
 */

import autismElopement360 from './templates/autism-elopement-360.js';
import autismElopement90 from './templates/autism-elopement-90.js';

export const templates = [
  autismElopement360,
  autismElopement90,
];
