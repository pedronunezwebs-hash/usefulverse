import { validateFontFile } from './font-tester-logic.mjs';

export function setupFontTester(root) {
  const $ = (selector) => root.querySelector(selector);
  const fileInput = $('[data-font-file]');
  const sampleInput = $('[data-font-sample]');
  const sizeInput = $('[data-font-size]');
  const sizeOutput = $('[data-font-size-value]');
  const preview = $('[data-font-preview]');
  const status = $('#op-status');
  const messages = (() => {
    try { return JSON.parse(root.dataset.plannerMessages || '{}'); } catch { return {}; }
  })();
  const say = (message) => messages[message] || message;
  const family = `UsefulVerseFontPreview-${Math.random().toString(36).slice(2)}`;
  let loadedFace = null;
  let objectUrl = null;

  function setStatus(message, error = false) {
    status.textContent = say(message);
    status.dataset.state = error ? 'error' : 'ready';
  }

  function renderPreview() {
    preview.textContent = sampleInput.value || ' ';
    preview.style.fontSize = `${sizeInput.value}px`;
    preview.style.fontFamily = loadedFace ? `"${family}", sans-serif` : 'sans-serif';
    sizeOutput.value = sizeInput.value;
    sizeOutput.textContent = sizeInput.value;
  }

  function releaseFont() {
    if (loadedFace) document.fonts.delete(loadedFace);
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    loadedFace = null;
    objectUrl = null;
    preview.style.fontFamily = 'sans-serif';
  }

  $('[data-font-load]').addEventListener('click', async () => {
    const file = fileInput.files?.[0];
    const error = validateFontFile(file);
    if (error) return setStatus('Try again', true);
    let nextUrl;
    try {
      nextUrl = URL.createObjectURL(file);
      const candidate = new FontFace(family, `url("${nextUrl}")`);
      await candidate.load();
      releaseFont();
      objectUrl = nextUrl;
      loadedFace = candidate;
      document.fonts.add(candidate);
      renderPreview();
      setStatus('Ready');
    } catch {
      if (nextUrl) URL.revokeObjectURL(nextUrl);
      setStatus('Try again', true);
    }
  });

  $('[data-font-reset]').addEventListener('click', () => {
    releaseFont();
    fileInput.value = '';
    sampleInput.value = say('Sample text');
    sizeInput.value = '32';
    renderPreview();
    setStatus('Done');
  });
  fileInput.addEventListener('change', () => setStatus('Choose file'));
  sampleInput.addEventListener('input', renderPreview);
  sizeInput.addEventListener('input', renderPreview);
  window.addEventListener('pagehide', releaseFont, { once: true });
  renderPreview();
}
