import { announce, clearResult, copyText, readToolCopy } from '../controller-helpers.mjs';
import { generateJsonModels } from './logic.mjs';

const root = document.querySelector('[data-tool="json-model-generator"]');
if (root) {
  const form = root.querySelector('#tool-form'); const copy = readToolCopy(root);
  const jsonField = form.elements.namedItem('json'); const languageField = form.elements.namedItem('language');
  const nameField = form.elements.namedItem('rootName'); const output = root.querySelector('[data-json-model-output]');
  let generated = ''; let currentExtension = 'ts';

  function resetResult() {
    generated = ''; clearResult(root); output.value = '';
  }
  function generate(event) {
    event?.preventDefault(); resetResult(); announce(root, '');
    const extension = ({ typescript: 'ts', csharp: 'cs', java: 'java' })[languageField.value];
    try {
      generated = generateJsonModels(jsonField.value, { language: languageField.value, rootName: nameField.value });
      currentExtension = extension; output.value = generated; root.querySelector('[data-result]').hidden = false;
      announce(root, copy.messages.generated, 'success');
    } catch (error) {
      const key = ['emptyInput', 'tooLarge', 'invalidJson', 'tooManyValues', 'tooDeep', 'emptyRootArray', 'invalidLanguage', 'nameTooLong'].includes(error.message) ? error.message : 'invalid';
      announce(root, copy.messages[key] ?? copy.messages.invalid, 'error');
    }
  }

  form.addEventListener('submit', generate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    jsonField.value = '[{\n  "name": null,\n  "score": 9.5,\n  "tags": ["new", "returning"]\n}, {\n  "name": "Ada",\n  "active": true,\n  "tags": []\n}]';
    nameField.value = 'Person'; languageField.value = 'typescript'; generate();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  languageField.addEventListener('change', () => { if (generated) generate(); });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => generated && copyText(root, generated, copy));
  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!generated) { announce(root, copy.messages.generateFirst, 'error'); return; }
    const safeName = nameField.value.trim().replace(/[^A-Za-z0-9_-]+/gu, '-') || 'model';
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([generated], { type: 'text/plain;charset=utf-8' }));
    link.download = `${safeName}.${currentExtension}`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });
  form.addEventListener('reset', () => queueMicrotask(() => { resetResult(); announce(root, ''); }));
}
