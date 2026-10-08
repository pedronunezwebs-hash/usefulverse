import { findClosestCssColors, normalizeHexColor } from './logic.mjs';
import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="color-name-finder"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const hexInput = form.elements.namedItem('hexColor');
  const picker = form.elements.namedItem('colorPicker');
  const result = root.querySelector('[data-result]');
  const resultList = root.querySelector('[data-name-results]');
  const exactMessage = root.querySelector('[data-exact-match]');
  let current = null;

  hexInput.addEventListener('input', () => {
    try {
      hexInput.removeAttribute('aria-invalid');
      picker.value = normalizeHexColor(hexInput.value);
    } catch {
      // Keep typing possible; validation runs only after submit.
    }
  });
  picker.addEventListener('input', () => {
    hexInput.value = picker.value.toUpperCase();
    hexInput.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      current = findClosestCssColors(hexInput.value);
      hexInput.value = current.inputHex;
      picker.value = current.inputHex;
      hexInput.removeAttribute('aria-invalid');
      const fragment = document.createDocumentFragment();
      for (const match of current.matches) {
        const item = document.createElement('li');
        item.className = 'color-name-result';
        const swatch = document.createElement('span');
        swatch.className = 'color-name-swatch';
        swatch.style.backgroundColor = match.hex;
        swatch.setAttribute('aria-hidden', 'true');
        const details = document.createElement('span');
        const name = document.createElement('strong');
        name.textContent = match.name;
        name.dataset.colorName = match.name;
        const aliases = document.createElement('span');
        aliases.className = 'color-name-aliases';
        aliases.textContent = match.aliases.length > 1 ? ` (${match.aliases.join(', ')})` : '';
        const code = document.createElement('code');
        code.textContent = match.hex;
        const distance = document.createElement('small');
        distance.textContent = `${copy.messages.distance}: ${new Intl.NumberFormat(root.lang || 'en', { maximumFractionDigits: 2 }).format(match.distance)}`;
        details.append(name, aliases, document.createTextNode(' · '), code, document.createTextNode(' · '), distance);
        item.append(swatch, details);
        fragment.append(item);
      }
      resultList.replaceChildren(fragment);
      exactMessage.hidden = !current.exactMatch;
      result.hidden = false;
      announce(root, current.exactMatch ? copy.messages.exactMatch : copy.messages.nearestMatch, 'success');
    } catch {
      current = null;
      result.hidden = true;
      hexInput.setAttribute('aria-invalid', 'true');
      hexInput.focus();
      announce(root, copy.messages.checkColor, 'error');
    }
  });

  root.querySelector('[data-action="copy-name"]')?.addEventListener('click', () => {
    if (current) copyText(root, current.matches[0].name, copy);
  });
  root.querySelector('[data-action="copy-hex"]')?.addEventListener('click', () => {
    if (current) copyText(root, current.inputHex, copy);
  });
}
