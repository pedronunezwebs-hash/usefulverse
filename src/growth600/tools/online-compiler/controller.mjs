import { announce, readToolCopy } from '../controller-helpers.mjs';
import { PYTHON_LIMITS, validatePythonInput } from './logic.mjs';

const root = document.querySelector('[data-tool="online-compiler"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const source = form.elements.namedItem('source');
  const stdin = form.elements.namedItem('stdin');
  const output = root.querySelector('[data-python-output]');
  const run = root.querySelector('[data-python-run]');
  const stop = root.querySelector('[data-python-stop]');
  const clear = root.querySelector('[data-python-clear]');
  const download = root.querySelector('[data-python-download]');
  let worker;
  let timer;
  let ready = false;
  let running = false;

  const stopWorker = () => {
    clearTimeout(timer); timer = undefined;
    worker?.terminate(); worker = undefined; ready = false; running = false;
    run.disabled = false; stop.disabled = true;
  };

  const startWorker = () => {
    stopWorker();
    try { worker = new Worker(form.dataset.workerSrc, { type: 'module', name: 'UsefulVerse local Python runner' }); }
    catch { announce(root, copy.messages.workerUnavailable, 'error'); return; }
    run.disabled = true; stop.disabled = false; output.textContent = copy.messages.loading;
    worker.addEventListener('message', ({ data }) => {
      if (data?.type === 'ready') {
        ready = true; running = true;
        worker.postMessage({ type: 'run', code: source.dataset.pendingCode ?? '', stdin: stdin.dataset.pendingInput ?? '' });
        timer = setTimeout(() => {
          stopWorker(); output.textContent = copy.messages.timedOut;
          announce(root, copy.messages.timedOut, 'error');
        }, PYTHON_LIMITS.runMilliseconds);
        return;
      }
      if (data?.type === 'result') {
        clearTimeout(timer); timer = undefined; running = false;
        run.disabled = false; stop.disabled = true;
        output.textContent = data.output || copy.messages.noOutput;
        announce(root, data.ok ? copy.messages.finished : copy.messages.failed, data.ok ? 'success' : 'error');
        worker?.terminate(); worker = undefined; ready = false;
      } else if (data?.type === 'error') {
        stopWorker(); output.textContent = copy.messages.failed;
        announce(root, copy.messages.failed, 'error');
      }
    });
    worker.addEventListener('error', () => {
      stopWorker(); output.textContent = copy.messages.failed;
      announce(root, copy.messages.failed, 'error');
    }, { once: true });
  };

  run.addEventListener('click', () => {
    if (running) return;
    let input;
    try { input = validatePythonInput(source.value, stdin.value); }
    catch {
      announce(root, copy.messages.inputTooLarge, 'error'); return;
    }
    source.dataset.pendingCode = input.code;
    stdin.dataset.pendingInput = input.stdin;
    startWorker();
  });
  stop.addEventListener('click', () => { stopWorker(); output.textContent = copy.messages.stopped; announce(root, copy.messages.stopped); });
  clear.addEventListener('click', () => { stopWorker(); source.value = ''; stdin.value = ''; output.textContent = ''; source.focus(); });
  download.addEventListener('click', () => {
    const blob = new Blob([source.value], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'main.py'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  source.addEventListener('input', () => { run.disabled = Boolean(worker) || source.value.length > PYTHON_LIMITS.codeCharacters; });
}
