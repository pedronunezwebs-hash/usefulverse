import { announce } from '../controller-helpers.mjs';
import { buildColorRamp, mixColors, parseMixerHex } from './logic.mjs';

const root = document.querySelector('[data-tool="color-mixer"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const list = root.querySelector('[data-color-list]');
  const result = root.querySelector('[data-color-result]');
  const status = root.querySelector('[data-status]');
  let lastMix = null;
  let lastRamp = [];

  function notify(message, kind = '') { status.textContent = message; announce(root, message, kind); }
  function rowField(row, labelText, fieldName, type, value, attrs = {}) {
    const wrap = document.createElement('div'); wrap.className = 'field';
    const label = document.createElement('label'); label.htmlFor = `color-mixer-${fieldName}-${row}`; label.textContent = labelText;
    const input = document.createElement('input'); input.id = label.htmlFor; input.name = `${fieldName}-${row}`; input.type = type; input.value = value;
    for (const [key, attribute] of Object.entries(attrs)) input.setAttribute(key, attribute);
    wrap.append(label, input); return wrap;
  }
  function setRemoveState() {
    const rows = [...list.querySelectorAll('[data-color-row]')];
    for (const row of rows) row.querySelector('[data-action="removeColor"]').disabled = rows.length <= 2;
  }
  function appendColor(hex = '#00AA66', weight = 50) {
    const index = list.querySelectorAll('[data-color-row]').length;
    const row = document.createElement('div'); row.className = 'color-mixer__row'; row.dataset.colorRow = ''; row.dataset.index = String(index);
    const sample = document.createElement('div'); sample.className = 'color-mixer__sample';
    sample.append(rowField(index, copy.fields.color, 'color', 'color', hex), rowField(index, copy.fields.colorHex, 'hex', 'text', hex, { maxlength: '7', pattern: '#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?', required: '' }));
    row.append(sample, rowField(index, copy.fields.weight, 'weight', 'number', String(weight), { min: '0', max: '1000', step: 'any', required: '' }));
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'button button--secondary'; remove.dataset.action = 'removeColor'; remove.textContent = copy.actions.removeColor; remove.setAttribute('aria-label', copy.actions.removeColor);
    row.append(remove); list.append(row); setRemoveState();
  }
  function readColors() {
    return [...list.querySelectorAll('[data-color-row]')].map((row) => ({ hex: row.querySelector('input[name^="hex-"]').value, weight: row.querySelector('input[name^="weight-"]').value }));
  }
  function render() {
    const mixed = mixColors(readColors(), form.elements.namedItem('space').value);
    const ramp = buildColorRamp(readColors()[0].hex, readColors()[1].hex, Number(form.elements.namedItem('steps').value), form.elements.namedItem('space').value);
    lastMix = mixed; lastRamp = ramp;
    root.querySelector('[data-color-swatch]').style.backgroundColor = mixed.hex;
    root.querySelector('[data-mixed-hex]').textContent = mixed.hex;
    root.querySelector('[data-mixed-rgb]').textContent = `rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`;
    root.querySelector('[data-mixed-hsl]').textContent = `hsl(${mixed.hsl.h} ${mixed.hsl.s}% ${mixed.hsl.l}%)`;
    const rampNode = root.querySelector('[data-color-ramp]'); rampNode.replaceChildren();
    for (const hex of ramp) { const swatch = document.createElement('span'); swatch.className = 'color-mixer__ramp-swatch'; swatch.style.backgroundColor = hex; swatch.setAttribute('role', 'img'); swatch.setAttribute('aria-label', hex); rampNode.append(swatch); }
    result.hidden = false; notify(copy.messages.calculated, 'success');
  }
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'addColor') {
      if (list.querySelectorAll('[data-color-row]').length >= 8) { notify(copy.messages.colorLimit, 'error'); return; }
      appendColor(); notify(copy.messages.colorAdded, 'success');
    } else if (action === 'removeColor') {
      if (list.querySelectorAll('[data-color-row]').length <= 2) { notify(copy.messages.colorMinimum, 'error'); return; }
      event.target.closest('[data-color-row]')?.remove(); setRemoveState(); lastMix = null; result.hidden = true; notify(copy.messages.colorRemoved, 'success');
    } else if (action === 'example') {
      while (list.querySelectorAll('[data-color-row]').length > 2) list.lastElementChild.remove();
      const rows = [...list.querySelectorAll('[data-color-row]')];
      for (const [index, hex] of ['#FF0000', '#0000FF'].entries()) { rows[index].querySelector('input[type="color"]').value = hex; rows[index].querySelector('input[name^="hex-"]').value = hex; rows[index].querySelector('input[name^="weight-"]').value = '50'; }
      form.elements.namedItem('space').value = 'srgb'; form.elements.namedItem('steps').value = '5'; setRemoveState();
      try { render(); } catch { notify(copy.messages.checkInputs, 'error'); }
    } else if (action === 'copy') {
      if (!lastMix) { try { render(); } catch { notify(copy.messages.checkInputs, 'error'); return; } }
      try { await navigator.clipboard.writeText(lastMix.hex); notify(copy.messages.copied, 'success'); }
      catch { notify(copy.messages.copyUnavailable, 'error'); }
    } else if (action === 'download') {
      if (!lastMix) { try { render(); } catch { notify(copy.messages.checkInputs, 'error'); return; } }
      const css = `:root {\n${lastRamp.map((hex, index) => `  --uv-color-${index + 1}: ${hex};`).join('\n')}\n}\n`;
      const url = URL.createObjectURL(new Blob([css], { type: 'text/css;charset=utf-8' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'color-palette.css'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 0);
      notify(copy.messages.downloaded, 'success');
    }
  });
  list.addEventListener('input', (event) => {
    const input = event.target;
    const row = input.closest('[data-color-row]'); if (!row) return;
    if (input.type === 'color') row.querySelector('input[name^="hex-"]').value = input.value.toUpperCase();
    else if (input.name.startsWith('hex-')) {
      try { row.querySelector('input[type="color"]').value = parseMixerHex(input.value).hex; }
      catch { /* keep the user's partial HEX entry editable */ }
    }
    lastMix = null; result.hidden = true; status.textContent = '';
  });
  form.addEventListener('submit', (event) => { event.preventDefault(); try { render(); } catch { lastMix = null; result.hidden = true; notify(copy.messages.checkInputs, 'error'); } });
  form.addEventListener('reset', () => setTimeout(() => { while (list.querySelectorAll('[data-color-row]').length > 2) list.lastElementChild.remove(); setRemoveState(); lastMix = null; lastRamp = []; result.hidden = true; notify(copy.messages.reset); }, 0));
  form.addEventListener('change', (event) => { if (['space', 'steps'].includes(event.target.name)) { lastMix = null; result.hidden = true; } });
  setRemoveState();
}
