import { buildEmailHtml, buildHtmlForm, buildPatternSvg, buildSvgDocument } from './web-authoring-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const messageCache = new WeakMap();

function say(root, key, values = {}) {
  let messages = messageCache.get(root);
  if (!messages) {
    try { messages = JSON.parse(root.dataset.plannerMessages || '{}'); } catch { messages = {}; }
    messageCache.set(root, messages);
  }
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
}

function setStatus(root, message, error = false, values = {}) {
  const output = $('#op-status', root);
  if (output) { output.textContent = say(root, message, values); output.className = `tool-status${error ? ' is-error' : ' is-success'}`; }
}

function downloadText(text, name, type = 'text/html;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.hidden = true;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(text, root) {
  try { await navigator.clipboard.writeText(text); setStatus(root, 'Copied to your clipboard.'); }
  catch { setStatus(root, 'Could not copy. Use the download or select the output manually.', true); }
}

function setupSvgEditor(root) {
  const items = []; const preview = $('[data-svg-preview]', root); const output = $('[data-svg-output]', root);
  const render = () => {
    const svg = buildSvgDocument({ items });
    const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
    preview.replaceChildren(...[...parsed.documentElement.childNodes].map((node) => document.importNode(node, true)));
    output.value = svg;
  };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-svg-add]')) {
      const type = $('[data-svg-type]', root).value; const text = $('[data-svg-text]', root).value.trim();
      if (type === 'text' && !text) return setStatus(root, 'Choose text for the text object.', true);
      if (items.length >= 80) return setStatus(root, 'The SVG is limited to 80 objects.', true);
      items.push({ type, x: Number($('[data-svg-x]', root).value), y: Number($('[data-svg-y]', root).value), size: Number($('[data-svg-size]', root).value), fill: $('[data-svg-fill]', root).value, text });
      render(); setStatus(root, 'Objects: {count}', false, { count: items.length });
    }
    if (event.target.closest('[data-svg-clear]')) { items.length = 0; render(); setStatus(root, 'Objects cleared.'); }
    if (event.target.closest('[data-svg-download]')) { if (!items.length) return setStatus(root, 'Add an object to preview your SVG.', true); downloadText(output.value, 'usefulverse-design.svg', 'image/svg+xml;charset=utf-8'); }
  });
}

function setupPatternMaker(root) {
  const update = () => {
    const svg = buildPatternSvg({ motif: $('[data-pattern-motif]', root).value, size: $('[data-pattern-size]', root).value, spacing: $('[data-pattern-spacing]', root).value, foreground: $('[data-pattern-foreground]', root).value, background: $('[data-pattern-background]', root).value });
    if (!svg) return setStatus(root, 'Pattern could not be created. Check the selected values.', true);
    const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    $('[data-pattern-preview]', root).src = encoded; $('[data-pattern-output]', root).value = svg; setStatus(root, 'Pattern updated.');
  };
  root.addEventListener('input', (event) => { if (event.target.matches('[data-pattern-motif], [data-pattern-size], [data-pattern-spacing], [data-pattern-foreground], [data-pattern-background]')) update(); });
  root.addEventListener('click', (event) => { if (event.target.closest('[data-pattern-update]')) update(); if (event.target.closest('[data-pattern-download]')) { update(); const value = $('[data-pattern-output]', root).value; if (value) downloadText(value, 'usefulverse-pattern.svg', 'image/svg+xml;charset=utf-8'); } });
  update();
}

function setHtmlPreview(container, html) {
  const fragment = new DOMParser().parseFromString(html, 'text/html');
  container.replaceChildren(...[...fragment.body.childNodes].map((node) => document.importNode(node, true)));
  container.querySelectorAll('input, textarea, select, button').forEach((control) => { control.disabled = true; });
  container.querySelectorAll('form').forEach((form) => { form.addEventListener('submit', (event) => event.preventDefault()); });
}

function setupHtmlFormBuilder(root) {
  const generate = () => {
    const result = buildHtmlForm($('[data-form-fields]', root).value, $('[data-form-submit]', root).value);
    const output = $('[data-form-output]', root);
    if (result.error) { output.value = ''; $('[data-form-preview]', root).replaceChildren(); setStatus(root, 'Enter 1–60 valid field lines using the shown format.', true); return ''; }
    output.value = result.html; setHtmlPreview($('[data-form-preview]', root), result.html); setStatus(root, 'Form HTML created. It does not include a server endpoint.'); return result.html;
  };
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-form-build]')) generate();
    if (event.target.closest('[data-form-copy]')) { const html = generate(); if (html) await copyText(html, root); }
    if (event.target.closest('[data-form-download]')) { const html = generate(); if (html) downloadText(`<!doctype html><meta charset="utf-8"><title>Form</title>${html}`, 'usefulverse-form.html'); }
  });
  $('[data-form-preview]', root).addEventListener('submit', (event) => event.preventDefault());
}

function setupEmailBuilder(root) {
  const generate = () => {
    const result = buildEmailHtml({ brand: $('[data-email-brand]', root).value, heading: $('[data-email-heading]', root).value, body: $('[data-email-body]', root).value, buttonLabel: $('[data-email-button]', root).value, url: $('[data-email-url]', root).value, accent: $('[data-email-color]', root).value, footer: $('[data-email-footer]', root).value, language: document.documentElement.lang });
    if (result.error) { $('[data-email-output]', root).value = ''; $('[data-email-preview]', root).srcdoc = ''; setStatus(root, 'Use a valid HTTPS link and fill in each text field.', true); return ''; }
    $('[data-email-output]', root).value = result.html; $('[data-email-preview]', root).srcdoc = result.html; setStatus(root, 'Email HTML created. Test it in your email service before sending.'); return result.html;
  };
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-email-build]')) generate();
    if (event.target.closest('[data-email-copy]')) { const html = generate(); if (html) await copyText(html, root); }
    if (event.target.closest('[data-email-download]')) { const html = generate(); if (html) downloadText(html, 'usefulverse-email-template.html'); }
  });
}

export function setupWebAuthoringTool(root) {
  const mode = root.querySelector('[data-web-authoring]')?.dataset.webAuthoring;
  if (mode === 'svg') setupSvgEditor(root);
  else if (mode === 'pattern') setupPatternMaker(root);
  else if (mode === 'form') setupHtmlFormBuilder(root);
  else if (mode === 'email') setupEmailBuilder(root);
}
