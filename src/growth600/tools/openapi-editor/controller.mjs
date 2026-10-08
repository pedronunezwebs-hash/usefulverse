import { lintOpenApi, MAX_OPENAPI_BYTES, parseOpenApi } from './logic.mjs';
import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="openapi-editor"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const editor = form.elements.namedItem('document');
  const format = form.elements.namedItem('format');
  const result = root.querySelector('[data-openapi-result]');
  const summary = root.querySelector('[data-openapi-summary]');
  const operationsList = root.querySelector('[data-openapi-operations]');
  const issuesList = root.querySelector('[data-openapi-issues]');
  const file = root.querySelector('[data-openapi-file]');
  let yamlModulePromise;
  let currentReport = '';

  async function yamlModule() {
    if (!yamlModulePromise) {
      const moduleUrl = new URL('/assets/vendor/js-yaml-4.3.2.mjs', location.origin).href;
      yamlModulePromise = import(moduleUrl);
    }
    return yamlModulePromise;
  }

  async function parsed() {
    const source = editor.value;
    if (!source.trim()) { announce(root, copy.messages.empty, 'error'); editor.focus(); throw new Error('empty'); }
    if (new TextEncoder().encode(source).byteLength > MAX_OPENAPI_BYTES) { announce(root, copy.messages.tooLarge, 'error'); editor.focus(); throw new Error('tooLarge'); }
    const wantsYaml = format.value === 'yaml' || (format.value === 'auto' && /^\s*(?:openapi|info|paths|components)\s*:/mu.test(source));
    if (!wantsYaml && format.value !== 'yaml') return parseOpenApi(source, format.value);
    try {
      const module = await yamlModule();
      return parseOpenApi(source, 'yaml', (text) => module.load(text, { maxAliasCount: 0, schema: module.JSON_SCHEMA }));
    } catch (error) {
      if (error?.message === 'yamlUnavailable') { announce(root, copy.messages.yamlUnavailable, 'error'); throw error; }
      throw error;
    }
  }

  function render(report) {
    operationsList.replaceChildren();
    issuesList.replaceChildren();
    const documentFragment = document.createDocumentFragment();
    for (const operation of report.operations.slice(0, 250)) {
      const item = document.createElement('li');
      const heading = document.createElement('strong');
      heading.textContent = `${operation.method} ${operation.path}`;
      item.append(heading);
      const details = document.createElement('span');
      details.textContent = ` — ${operation.summary || operation.operationId} · ${operation.responses.join(', ')}`;
      item.append(details);
      documentFragment.append(item);
    }
    operationsList.replaceChildren(documentFragment);
    const issueFragment = document.createDocumentFragment();
    for (const finding of report.issues.slice(0, 100)) {
      const item = document.createElement('li');
      item.textContent = `${copy.messages[finding.code] || copy.messages.invalid}${finding.path ? ` (${finding.path})` : ''}`;
      issueFragment.append(item);
    }
    if (report.issues.length > 100) {
      const item = document.createElement('li');
      item.textContent = `${report.issues.length - 100} more findings.`;
      issueFragment.append(item);
    }
    issuesList.replaceChildren(issueFragment);
    summary.textContent = report.issues.length
      ? `${copy.messages.invalid} ${report.operations.length ? copy.messages.operationCount.replace('{count}', String(report.operations.length)) : copy.messages.noOperations}`
      : `${copy.messages.valid} ${copy.messages.operationCount.replace('{count}', String(report.operations.length))}`;
    result.hidden = false;
    editor.toggleAttribute('aria-invalid', report.issues.length > 0);
    currentReport = `${summary.textContent}${report.issues.length ? `\n${[...report.issues.slice(0, 100).map((finding) => `${copy.messages[finding.code] || copy.messages.invalid}${finding.path ? ` (${finding.path})` : ''}`)].join('\n')}` : ''}`;
    announce(root, report.issues.length ? copy.messages.invalid : copy.messages.valid, report.issues.length ? 'error' : 'success');
  }

  async function handleParseError(error) {
    if (['empty', 'tooLarge', 'yamlUnavailable'].includes(error?.message)) return;
    editor.setAttribute('aria-invalid', 'true');
    result.hidden = false;
    summary.textContent = copy.messages.invalidSyntax;
    operationsList.replaceChildren();
    issuesList.replaceChildren();
    const item = document.createElement('li'); item.textContent = copy.messages.invalidSyntax; issuesList.append(item);
    currentReport = copy.messages.invalidSyntax;
    announce(root, copy.messages.invalidSyntax, 'error');
  }

  editor.addEventListener('input', () => { result.hidden = true; currentReport = ''; editor.removeAttribute('aria-invalid'); });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    result.hidden = true; currentReport = ''; editor.removeAttribute('aria-invalid');
    try { const parsedDocument = await parsed(); render(lintOpenApi(parsedDocument.document)); }
    catch (error) { await handleParseError(error); }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    format.value = 'yaml';
    editor.value = 'openapi: 3.1.0\ninfo:\n  title: Sample API\n  version: 1.0.0\npaths:\n  /items/{itemId}:\n    get:\n      operationId: getItem\n      summary: Read one item\n      parameters:\n        - name: itemId\n          in: path\n          required: true\n          schema:\n            type: string\n      responses:\n        "200":\n          description: Item returned\n';
    editor.removeAttribute('aria-invalid'); result.hidden = true; editor.focus(); announce(root, copy.messages.exampleLoaded, 'info');
  });

  root.querySelector('[data-action="format"]')?.addEventListener('click', async () => {
    try {
      const parsedDocument = await parsed();
      if (format.value === 'yaml' || parsedDocument.format === 'yaml') {
        const module = await yamlModule();
        editor.value = module.dump(parsedDocument.document, { schema: module.JSON_SCHEMA, noRefs: true, lineWidth: 120 });
        if (format.value === 'auto') format.value = 'yaml';
      } else editor.value = JSON.stringify(parsedDocument.document, null, 2);
      editor.removeAttribute('aria-invalid'); result.hidden = true; announce(root, copy.messages.formatted, 'success');
    } catch (error) { await handleParseError(error); }
  });

  root.querySelector('[data-action="download"]')?.addEventListener('click', async () => {
    try {
      const parsedDocument = await parsed();
      const asYaml = format.value === 'yaml' || (format.value === 'auto' && parsedDocument.format === 'yaml');
      let output = JSON.stringify(parsedDocument.document, null, 2);
      if (asYaml) { const module = await yamlModule(); output = module.dump(parsedDocument.document, { schema: module.JSON_SCHEMA, noRefs: true, lineWidth: 120 }); }
      const blob = new Blob([output], { type: asYaml ? 'application/yaml;charset=utf-8' : 'application/json;charset=utf-8' });
      const href = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = href; anchor.download = `openapi-contract.${asYaml ? 'yaml' : 'json'}`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(href), 1000); announce(root, copy.messages.downloaded, 'success');
    } catch (error) { await handleParseError(error); }
  });

  root.querySelector('[data-action="copy-report"]')?.addEventListener('click', () => {
    if (currentReport) copyText(root, currentReport, copy);
    else announce(root, copy.messages.empty, 'error');
  });

  file.addEventListener('change', async () => {
    const selected = file.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_OPENAPI_BYTES) { announce(root, copy.messages.tooLarge, 'error'); file.value = ''; return; }
    try { editor.value = await selected.text(); format.value = /\.ya?ml$/iu.test(selected.name) ? 'yaml' : 'auto'; editor.removeAttribute('aria-invalid'); result.hidden = true; currentReport = ''; editor.focus(); announce(root, copy.messages.exampleLoaded, 'success'); }
    catch { announce(root, copy.messages.invalidSyntax, 'error'); }
    file.value = '';
  });

  form.addEventListener('reset', () => { editor.removeAttribute('aria-invalid'); result.hidden = true; operationsList.replaceChildren(); issuesList.replaceChildren(); summary.textContent = ''; currentReport = ''; announce(root, ''); });
}
