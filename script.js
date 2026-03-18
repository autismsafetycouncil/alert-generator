/* =========================================================
   NASC WEA Alert Generator — Script
   ========================================================= */

(function () {
  'use strict';

  // --- Constants -------------------------------------------

  const CHAR_LIMIT = 360;
  const CHAR_CAUTION = 300;

  // --- DOM references --------------------------------------

  const agencyEl      = document.getElementById('agency');
  const childNameEl   = document.getElementById('child-name');
  const descriptionEl = document.getElementById('description');
  const ageEl         = document.getElementById('age');
  const hairEl        = document.getElementById('hair');
  const clothingEl    = document.getElementById('clothing');
  const locationEl    = document.getElementById('location');
  const nonSpeakingEl = document.getElementById('non-speaking');
  const mayHideEl     = document.getElementById('may-hide');

  const previewEl     = document.getElementById('alert-preview');
  const previewCard   = document.getElementById('preview-card');
  const charCountEl   = document.getElementById('char-count');
  const charCounterEl = document.getElementById('char-counter');
  const charBadgeEl   = document.getElementById('char-badge');
  const copyBtn       = document.getElementById('copy-btn');
  const copyConfirmEl = document.getElementById('copy-confirm');

  // --- Field value reading ---------------------------------

  function getFieldValues() {
    return {
      agency:      agencyEl.value.trim(),
      childName:   childNameEl.value.trim(),
      description: descriptionEl.value.trim(),
      age:         ageEl.value.trim(),
      hair:        hairEl.value.trim(),
      clothing:    clothingEl.value.trim(),
      location:    locationEl.value.trim(),
      nonSpeaking: nonSpeakingEl.checked,
      mayHide:     mayHideEl.checked,
    };
  }

  // --- Template engine -------------------------------------

  function buildAlert(v) {
    // Build the descriptive section, skipping empty fields
    const descParts = [];
    if (v.childName)   descParts.push(v.childName);
    if (v.description) descParts.push(v.description);
    if (v.age)         descParts.push('age ' + v.age);
    if (v.hair)        descParts.push(v.hair);
    if (v.clothing)    descParts.push(v.clothing);
    if (v.nonSpeaking) descParts.push('NON-SPEAKING');

    const segments = [];

    // Opening line — agency in brackets if provided
    const opening = (v.agency ? '[' + v.agency + ']: ' : '') +
      'MISSING CHILD with AUTISM. EXTREME DROWNING RISK.';
    segments.push(opening);

    if (descParts.length > 0) {
      segments.push(descParts.join(', ') + '.');
    }

    if (v.location) {
      segments.push('LAST SEEN at ' + v.location + ' on foot.');
    }

    segments.push(
      'SEARCH ALL WATER NOW (nearby pools/ponds/drains/spas/tanks etc. ' +
      'even if covered or dirty) and inside cars.'
    );

    if (v.mayHide) segments.push('Child may HIDE.');

    segments.push('STAY AT WATER if able. IF SEEN, call 9-1-1');

    return segments.join(' ');
  }

  // --- Preview renderer ------------------------------------

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderWithEmphasis(alertText, v) {
    let html = escapeHtml(alertText);

    // Highlight user-entered values with subtle semi-bold emphasis
    const dynamicValues = [
      v.agency, v.childName, v.description,
      v.age, v.hair, v.clothing, v.location,
    ].filter(Boolean);

    for (const val of dynamicValues) {
      const escaped = escapeHtml(val);
      // Replace only the first occurrence
      html = html.replace(escaped, '<span class="dynamic-field">' + escaped + '</span>');
    }

    return html;
  }

  // --- Counter state ---------------------------------------

  function getCharState(len) {
    if (len > CHAR_LIMIT) return 'over';
    if (len >= CHAR_CAUTION) return 'caution';
    return 'safe';
  }

  const STATE_LABELS = { safe: 'OK', caution: 'CAUTION', over: 'OVER LIMIT' };

  function updateCounter(len) {
    const state = getCharState(len);
    charCountEl.textContent = len;
    charCounterEl.dataset.state = state;
    charBadgeEl.textContent = STATE_LABELS[state];
    previewCard.dataset.charState = state;
  }

  // --- Main update loop ------------------------------------

  function updatePreview() {
    const values = getFieldValues();
    const alertText = buildAlert(values);
    const len = alertText.length;

    previewEl.innerHTML = renderWithEmphasis(alertText, values);
    updateCounter(len);

    // Update copy button label
    if (len > CHAR_LIMIT) {
      copyBtn.textContent = 'Copy Anyway (Over Limit)';
      copyBtn.classList.add('over-limit');
    } else {
      copyBtn.textContent = 'Copy to Clipboard';
      copyBtn.classList.remove('over-limit');
    }
  }

  // --- Copy to clipboard -----------------------------------

  let copyResetTimer = null;

  function showCopyFeedback() {
    copyConfirmEl.hidden = false;
    copyConfirmEl.textContent = 'Copied!';

    if (copyResetTimer) clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      copyConfirmEl.hidden = true;
    }, 2500);
  }

  async function handleCopy() {
    const values = getFieldValues();
    const plainText = buildAlert(values);

    try {
      await navigator.clipboard.writeText(plainText);
      showCopyFeedback();
    } catch (_err) {
      // Fallback for older browsers / non-HTTPS contexts
      try {
        const ta = document.createElement('textarea');
        ta.value = plainText;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showCopyFeedback();
      } catch (_fallbackErr) {
        // If both fail, select the preview text so user can copy manually
        const range = document.createRange();
        range.selectNodeContents(previewEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        copyConfirmEl.hidden = false;
        copyConfirmEl.textContent = 'Text selected — press Ctrl+C / Cmd+C to copy';
      }
    }
  }

  // --- Event wiring ----------------------------------------

  function attachListeners() {
    const textInputs = [agencyEl, childNameEl, descriptionEl, ageEl, hairEl, clothingEl, locationEl];
    const checkboxes = [nonSpeakingEl, mayHideEl];

    for (const el of textInputs) {
      el.addEventListener('input', updatePreview);
    }

    for (const el of checkboxes) {
      el.addEventListener('change', updatePreview);
    }

    copyBtn.addEventListener('click', handleCopy);
  }

  // --- Init ------------------------------------------------

  function init() {
    attachListeners();
    updatePreview(); // Render initial state
  }

  document.addEventListener('DOMContentLoaded', init);

})();
