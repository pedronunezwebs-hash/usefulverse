import { announce, readToolCopy } from '../controller-helpers.mjs';
import { convertRtfToText, RTF_INPUT_LIMIT_BYTES } from './logic.mjs';

const root = document.querySelector('[data-tool="rtf-converter"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const fileInput = form.elements.namedItem('file');
  const output = form.elements.namedItem('output');
  const result = root.querySelector('[data-result]');
  const copy = readToolCopy(root);
  let outputText = '';
  let outputName = 'converted-document';

  function clearOutput() {
    outputText = '';
    output.value = '';
    outputName = 'converted-document';
    result.hidden = true;
  }

  function safeBaseName(name) {
    const base = name.replace(/\.rtf$/iu, '').normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/gu, '').slice(0, 80);
    return base || 'converted-document';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearOutput();
    const file = fileInput.files?.[0];
    if (!file || !/\.rtf$/iu.test(file.name)) {
      announce(root, copy.messages.invalidFile, 'error');
      fileInput.focus();
      return;
    }
    if (file.size > RTF_INPUT_LIMIT_BYTES) {
      announce(root, copy.messages.fileTooLarge, 'error');
      fileInput.focus();
      return;
    }
    try {
      outputText = convertRtfToText(await file.text());
      output.value = outputText;
      outputName = safeBaseName(file.name);
      result.hidden = false;
      announce(root, copy.messages.converted, 'success');
    } catch (error) {
      clearOutput();
      const message = /5 MiB/u.test(error.message) ? copy.messages.fileTooLarge : /No readable text/u.test(error.message) ? copy.messages.noText : copy.messages.invalidFile;
      announce(root, message, 'error');
    }
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      clearOutput();
      announce(root, '');
    }, 0);
  });

  root.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    try {
      if (!outputText || !navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(outputText);
      announce(root, copy.messages.copied, 'success');
    } catch {
      announce(root, copy.messages.copyUnavailable, 'error');
    }
  });

  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!outputText) return;
    const url = URL.createObjectURL(new Blob([outputText], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${outputName}.txt`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });

  root.querySelector('[data-action="print"]')?.addEventListener('click', () => {
    if (!outputText) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      announce(root, copy.messages.printBlocked, 'error');
      return;
    }
    const doc = printWindow.document;
    doc.documentElement.lang = document.documentElement.lang || 'en';
    const title = doc.createElement('title');
    title.textContent = outputName;
    const style = doc.createElement('style');
    style.textContent = 'body{font:12pt/1.5 system-ui,sans-serif;margin:18mm;color:#111}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}@page{margin:18mm}';
    doc.head.replaceChildren(title, style);
    const heading = doc.createElement('h1');
    heading.textContent = outputName;
    const pre = doc.createElement('pre');
    pre.textContent = outputText;
    doc.body.replaceChildren(heading, pre);
    printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true });
    printWindow.focus();
    setTimeout(() => printWindow.print(), 100);
  });
}
