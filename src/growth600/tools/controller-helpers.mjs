export function readToolCopy(root = document) {
  const node = root.querySelector('[data-tool-copy]');
  if (!node) throw new Error('Localized tool copy is missing.');
  return JSON.parse(node.textContent);
}

export function announce(root, message, kind = 'info') {
  const target = root.querySelector('[data-status]');
  if (!target) return;
  target.textContent = message;
  target.dataset.kind = kind;
}

export function clearResult(root) {
  const section = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  if (section) section.hidden = true;
  if (content) content.replaceChildren();
}

export function showRows(root, rows) {
  const section = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  if (!section || !content) return;
  const list = document.createElement('dl');
  for (const [label, value] of rows) {
    const term = document.createElement('dt');
    const detail = document.createElement('dd');
    term.textContent = label;
    detail.textContent = value;
    list.append(term, detail);
  }
  content.replaceChildren(list);
  section.hidden = false;
}

export function readNumber(form, name, { optional = false, min = -Infinity, max = Infinity, integer = false } = {}) {
  const field = form.elements.namedItem(name);
  const raw = field?.value?.trim() ?? '';
  if (optional && raw === '') return null;
  const value = Number(raw);
  if (raw === '' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
    field?.setAttribute('aria-invalid', 'true');
    field?.focus();
    throw new RangeError();
  }
  field.removeAttribute('aria-invalid');
  return value;
}

export function numberFormat(locale, value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

export async function copyText(root, text, copy) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    announce(root, copy.messages.copied, 'success');
  } catch {
    announce(root, copy.messages.copyUnavailable, 'error');
  }
}

export function randomIndex(max) {
  const ceiling = 0x1_0000_0000;
  const cutoff = ceiling - (ceiling % max);
  const word = new Uint32Array(1);
  do crypto.getRandomValues(word); while (word[0] >= cutoff);
  return word[0] % max;
}

export function escapeText(value) {
  return String(value);
}
