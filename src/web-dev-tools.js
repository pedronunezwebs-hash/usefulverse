import { buildApiRequest, createHtmlTable, createPwaManifest } from './web-dev-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const messages = (root) => {
  try { return JSON.parse(root.dataset.webDevMessages || '{}'); }
  catch { return {}; }
};

export function setupWebDevTool(root) {
  const ui = $('[data-web-dev]', root);
  if (!ui) return;
  const kind = ui.dataset.webDev;
  const output = $('[data-web-output]', ui);
  const status = $('#op-status', ui);
  let objectUrl = '';
  const say = (key, success = false) => {
    status.textContent = messages(root)[key] ?? key;
    status.className = `tool-status${success ? ' is-success' : ''}`;
  };
  const revoke = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = '';
    const download = $('[data-web-download]', ui);
    if (download) { download.hidden = true; download.removeAttribute('href'); }
  };
  const generate = () => {
    try {
      revoke();
      if (kind === 'api') {
        output.value = buildApiRequest({
          url: $('[data-api-url]', ui).value,
          method: $('[data-api-method]', ui).value,
          headers: $('[data-api-headers]', ui).value,
          body: $('[data-api-body]', ui).value,
          output: $('[data-api-output]', ui).value,
        });
        say('Code generated.', true);
      } else if (kind === 'table') {
        const html = createHtmlTable({
          data: $('[data-table-input]', ui).value,
          headers: $('[data-table-headings]', ui).checked,
          caption: $('[data-table-caption]', ui).value,
        });
        output.value = html;
        const document = new DOMParser().parseFromString(html, 'text/html');
        $('[data-table-preview]', ui).replaceChildren(document.querySelector('table'));
        say('Table generated.', true);
      } else {
        output.value = createPwaManifest({
          name: $('[data-manifest-name]', ui).value,
          shortName: $('[data-manifest-short]', ui).value,
          description: $('[data-manifest-description]', ui).value,
          startUrl: $('[data-manifest-start]', ui).value,
          display: $('[data-manifest-display]', ui).value,
          themeColor: $('[data-manifest-theme]', ui).value,
          backgroundColor: $('[data-manifest-background]', ui).value,
        });
        const link = $('[data-web-download]', ui);
        objectUrl = URL.createObjectURL(new Blob([output.value], { type: 'application/manifest+json;charset=utf-8' }));
        link.href = objectUrl;
        link.hidden = false;
        say('Manifest generated.', true);
      }
    } catch (error) {
      output.value = '';
      if (kind === 'table') $('[data-table-preview]', ui).replaceChildren();
      say('Enter the requested values and try again.');
    }
  };
  ui.addEventListener('click', async (event) => {
    if (event.target.closest('[data-web-generate]')) { generate(); return; }
    if (event.target.closest('[data-web-reset]')) {
      revoke();
      for (const input of ui.querySelectorAll('input, textarea, select')) {
        if (input.type === 'checkbox') input.checked = input.defaultChecked;
        else input.value = input.defaultValue;
      }
      output.value = '';
      if (kind === 'table') $('[data-table-preview]', ui).replaceChildren();
      say('No network request was sent.');
      return;
    }
    if (!event.target.closest('[data-web-copy]')) return;
    if (!output.value) { say('Enter the requested values and try again.'); return; }
    try { await navigator.clipboard.writeText(output.value); say('Code copied.', true); }
    catch { output.focus(); output.select(); say('Copy was blocked. Select the text and copy it manually.'); }
  });
  ui.addEventListener('input', (event) => {
    if (event.target.matches('input, textarea, select') && output.value) {
      revoke();
      output.value = '';
      if (kind === 'table') $('[data-table-preview]', ui).replaceChildren();
      say('No network request was sent.');
    }
  });
  ui.addEventListener('change', (event) => {
    if (event.target.matches('input, textarea, select') && output.value) {
      revoke(); output.value = '';
      if (kind === 'table') $('[data-table-preview]', ui).replaceChildren();
      say('No network request was sent.');
    }
  });
  window.addEventListener('pagehide', revoke, { once: true });
}
