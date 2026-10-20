import { announce, readToolCopy } from '../controller-helpers.mjs';
import { subsetFilename, validateFontRequest } from './logic.mjs';

const root = document.querySelector('[data-tool="webfont-subsetter"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const fileInput = form.elements.namedItem('font');
  const textInput = form.elements.namedItem('text');
  const permission = form.elements.namedItem('permission');
  const run = root.querySelector('[data-font-run]');
  const download = root.querySelector('[data-font-download]');
  const result = root.querySelector('[data-font-result]');
  let worker; let outputBlob; let filename; let timer;
  const stop = () => { clearTimeout(timer); timer = undefined; worker?.terminate(); worker = undefined; run.disabled = false; };
  run.addEventListener('click', () => {
    let request;
    try { request = validateFontRequest(fileInput.files?.[0], textInput.value, permission.checked); }
    catch (error) { announce(root, error.message, 'error'); return; }
    stop(); result.hidden = true; run.disabled = true; announce(root, copy.messages.loading);
    try { worker = new Worker(form.dataset.workerSrc, { type: 'module', name: 'UsefulVerse local font subsetter' }); }
    catch { stop(); announce(root, copy.messages.failed, 'error'); return; }
    timer = setTimeout(() => { stop(); announce(root, copy.messages.timeout, 'error'); }, 45000);
    worker.addEventListener('message', ({ data }) => {
      if (data?.type === 'result') {
        outputBlob = new Blob([data.bytes], { type: fileInput.files[0].name.toLowerCase().endsWith('.otf') ? 'font/otf' : 'font/ttf' });
        filename = subsetFilename(fileInput.files[0].name); result.hidden = false;
        result.querySelector('[data-font-stats]').textContent = copy.messages.stats.replace('{before}', data.before).replace('{after}', data.after).replace('{input}', fileInput.files[0].size.toLocaleString()).replace('{output}', data.outputBytes.toLocaleString());
        download.disabled = false; stop(); announce(root, copy.messages.done, 'success');
      } else if (data?.type === 'error') { stop(); announce(root, `${copy.messages.failed} ${data.message}`, 'error'); }
    });
    worker.addEventListener('error', () => { stop(); announce(root, copy.messages.failed, 'error'); }, { once: true });
    fileInput.files[0].arrayBuffer().then((bytes) => worker?.postMessage({ type: 'subset', bytes, text: request.text }, [bytes]));
  });
  download.addEventListener('click', () => { if (!outputBlob) return; const url = URL.createObjectURL(outputBlob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  form.addEventListener('reset', () => { stop(); result.hidden = true; download.disabled = true; outputBlob = undefined; });
}
