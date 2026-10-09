import { announce, clearResult, copyText, readToolCopy } from '../controller-helpers.mjs';
import { convertJsonToXml, convertXmlToJson } from './logic.mjs';

const root = document.querySelector('[data-tool="json-to-xml-converter"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const jsonInput = form.elements.namedItem('jsonInput');
  const xmlInput = form.elements.namedItem('xmlInput');
  const jsonField = root.querySelector('[data-json-input]');
  const xmlField = root.querySelector('[data-xml-input]');
  const rootNameField = root.querySelector('#json-xml-root')?.closest('.field');
  const output = root.querySelector('[data-json-xml-output]');
  let outputText = '';

  function clear() {
    clearResult(root);
    output.value = '';
    outputText = '';
  }

  function syncMode() {
    const jsonMode = mode.value === 'jsonToXml';
    jsonField.hidden = !jsonMode;
    xmlField.hidden = jsonMode;
    jsonInput.disabled = !jsonMode;
    jsonInput.required = jsonMode;
    xmlInput.disabled = jsonMode;
    xmlInput.required = !jsonMode;
    if (rootNameField) rootNameField.hidden = !jsonMode;
    clear();
    announce(root, '');
  }

  function messageFor(error) {
    return copy.messages[error.message] ?? copy.messages.invalid;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clear();
    try {
      outputText = mode.value === 'jsonToXml'
        ? convertJsonToXml(jsonInput.value, { rootName: form.elements.namedItem('rootName').value || 'root', indent: Number(form.elements.namedItem('indent').value) })
        : JSON.stringify(convertXmlToJson(xmlInput.value), null, Number(form.elements.namedItem('indent').value));
      output.value = outputText;
      root.querySelector('[data-result]').hidden = false;
      announce(root, copy.messages.converted, 'success');
    } catch (error) { announce(root, messageFor(error), 'error'); }
  });

  form.addEventListener('input', () => { clear(); announce(root, ''); });
  mode.addEventListener('change', syncMode);
  form.addEventListener('reset', () => queueMicrotask(() => { syncMode(); jsonInput.value = copy.exampleJson; xmlInput.value = copy.exampleXml; form.elements.namedItem('rootName').value = 'root'; }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    if (mode.value === 'jsonToXml') jsonInput.value = copy.exampleJson;
    else xmlInput.value = copy.exampleXml;
    form.requestSubmit();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
    else announce(root, copy.messages.invalid, 'error');
  });
  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!outputText) return announce(root, copy.messages.invalid, 'error');
    const isXml = mode.value === 'jsonToXml';
    const url = URL.createObjectURL(new Blob([outputText], { type: isXml ? 'application/xml;charset=utf-8' : 'application/json;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = isXml ? 'converted.xml' : 'converted.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });

  syncMode();
  jsonInput.value = copy.exampleJson;
  xmlInput.value = copy.exampleXml;
}
