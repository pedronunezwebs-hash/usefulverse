const locale = window.usefulverseLocale ?? { messages: {}, runtime: {} };
const language = document.documentElement.lang || 'en';
const languageTag = locale.tag ?? language;
const t = (message) => locale.runtime?.[message] ?? locale.messages?.[message] ?? message;
const $ = (selector, scope = document) => scope.querySelector(selector);
const objectUrls = new Set();

window.addEventListener('pagehide', () => objectUrls.forEach((url) => URL.revokeObjectURL(url)), { once: true });

const assetVersion = new URL(import.meta.url).searchParams.get('v');
const versioned = (path) => `${path}${assetVersion ? `?v=${encodeURIComponent(assetVersion)}` : ''}`;
let audioModulePromise;
function loadAudioModule() {
  audioModulePromise ??= import(versioned('/assets/vendor/audio-processing.mjs'));
  return audioModulePromise;
}

function setStatus(root, message, type = '') {
  const status = $('#tool-status', root);
  if (!status) return;
  const translated = t(message);
  status.textContent = language !== 'en' && translated === message
    ? t(type === 'error' ? 'This file could not be processed. Try another supported format.' : type === 'success' ? 'Done.' : 'Ready.')
    : translated;
  status.className = `tool-status${type ? ` is-${type}` : ''}`;
}

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit += 1; }
  return `${new Intl.NumberFormat(languageTag, { maximumFractionDigits: 1 }).format(size)} ${units[unit]}`;
}

function safeBaseName(name) {
  return (name.replace(/\.[^.]+$/u, '').replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/^-+|-+$/gu, '').slice(0, 100) || 'usefulverse-file');
}

function revokeDownloads(container) {
  for (const anchor of container.querySelectorAll('a.file-download')) {
    const { href } = anchor;
    if (objectUrls.has(href)) {
      URL.revokeObjectURL(href);
      objectUrls.delete(href);
    }
  }
  container.replaceChildren();
}

function saveDownload(container, blob, filename, label) {
  const href = URL.createObjectURL(blob);
  objectUrls.add(href);
  const link = document.createElement('a');
  link.className = 'button button--ghost file-download';
  link.href = href;
  link.download = filename;
  link.textContent = `${t(label)} · ${formatSize(blob.size)}`;
  container.append(link);
  return link;
}

function createFileBridge(fileWritable, onBytes) {
  return new WritableStream({
    write(chunk) {
      onBytes(Math.max(0, chunk.position + chunk.data.byteLength));
      return fileWritable.write({ type: 'write', position: chunk.position, data: chunk.data });
    },
    close() {},
    abort(reason) { return fileWritable.abort(reason); },
  });
}

function setupAudioCompressor(root) {
  const input = $('#audio-file', root);
  const output = $('#audio-downloads', root);
  const progress = $('#audio-progress', root);
  const runButton = $('[data-action="compress-audio"]', root);
  const cancelButton = $('[data-action="cancel-audio"]', root);
  let activeController = null;
  let activeFileWritable = null;

  const setBusy = (busy) => {
    runButton.disabled = busy;
    cancelButton.disabled = !busy;
    $('[data-action="clear"]', root).disabled = busy;
    for (const control of [input, $('#audio-format', root), $('#audio-quality', root)]) control.disabled = busy;
  };
  const stop = () => {
    activeController?.abort();
    void activeFileWritable?.abort().catch(() => {});
  };

  input.addEventListener('change', () => {
    revokeDownloads(output);
    const file = input.files[0];
    $('#audio-file-meta', root).textContent = file
      ? `${file.name} · ${formatSize(file.size)}`
      : t('Your audio stays on this device and is never uploaded. There is no fixed server size limit; memory, storage and browser codec support are practical limits.');
    progress.hidden = true;
    progress.value = 0;
  });

  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'cancel-audio') {
      stop();
      cancelButton.disabled = true;
      setStatus(root, 'Processing canceled. Your original is unchanged.');
      return;
    }
    if (action === 'clear') {
      stop();
      input.value = '';
      revokeDownloads(output);
      progress.value = 0;
      progress.hidden = true;
      $('#audio-file-meta', root).textContent = t('Your audio stays on this device and is never uploaded. There is no fixed server size limit; memory, storage and browser codec support are practical limits.');
      setStatus(root, 'No upload. Keep this tab open while your device works.');
      return;
    }
    if (action !== 'compress-audio' || activeController) return;
    const file = input.files[0];
    if (!file) return setStatus(root, 'Choose an audio file before compressing.', 'error');

    const format = $('#audio-format', root).value;
    const extension = { mp3: 'mp3', m4a: 'm4a', ogg: 'ogg' }[format];
    const controller = new AbortController();
    activeController = controller;
    let fileWritable = null;
    let streamedBytes = 0;
    setBusy(true);
    revokeDownloads(output);
    progress.hidden = false;
    progress.value = 0;

    try {
      let bridge = null;
      if (typeof window.showSaveFilePicker === 'function') {
        setStatus(root, 'Choose where to save the compressed file…');
        const handle = await window.showSaveFilePicker({
          suggestedName: `${safeBaseName(file.name)}-compressed.${extension}`,
          types: [{ description: `${extension.toUpperCase()} audio`, accept: { [({ mp3: 'audio/mpeg', m4a: 'audio/mp4', ogg: 'audio/ogg' })[format]]: [`.${extension}`] } }],
        });
        if (controller.signal.aborted) return;
        fileWritable = await handle.createWritable();
        activeFileWritable = fileWritable;
        bridge = createFileBridge(fileWritable, (bytes) => { streamedBytes = bytes; });
      }

      setStatus(root, 'Compressing audio on your device…');
      const { compressAudio } = await loadAudioModule();
      const result = await compressAudio({
        file,
        format,
        quality: $('#audio-quality', root).value,
        writable: bridge,
        signal: controller.signal,
        onProgress(value) {
          progress.value = value;
          setStatus(root, t('Audio compression: {percent}%').replace('{percent}', String(value)));
        },
      });
      if (controller.signal.aborted) return;
      if (result.streamed) {
        const difference = file.size - streamedBytes;
        if (difference <= 0) {
          await fileWritable.abort(); fileWritable = null; activeFileWritable = null;
          progress.hidden = true;
          return setStatus(root, 'No smaller audio copy was created. Your original is unchanged.', 'error');
        }
        await fileWritable.close(); fileWritable = null; activeFileWritable = null;
        setStatus(root, t('Done. The compressed copy is {size} smaller. Check the sound; your original is unchanged.').replace('{size}', formatSize(difference)), 'success');
      } else if (result.blob && result.blob.size < file.size) {
        saveDownload(output, result.blob, `${safeBaseName(file.name)}-compressed.${extension}`, 'Download compressed audio');
        setStatus(root, t('Done. The compressed copy is {size} smaller. Check the sound; your original is unchanged.').replace('{size}', formatSize(file.size - result.blob.size)), 'success');
      } else {
        setStatus(root, 'No smaller audio copy was created. Your original is unchanged.', 'error');
      }
      progress.value = 100;
    } catch (error) {
      if (fileWritable) await fileWritable.abort().catch(() => {});
      if (error.name === 'AbortError') {
        setStatus(root, controller.signal.aborted ? 'Processing canceled. Your original is unchanged.' : 'Saving canceled. Your original is unchanged.');
      } else {
        console.error('Audio compression failed', error);
        const message = t(error.message);
        setStatus(root, message === error.message ? 'This file or codec could not be processed. Try another supported format.' : message, 'error');
      }
    } finally {
      activeController = null;
      activeFileWritable = null;
      progress.hidden = true;
      setBusy(false);
    }
  });
}

function setupTranscriber(root) {
  const input = $('#transcriber-file', root);
  const output = $('#transcriber-output', root);
  const progress = $('#transcriber-progress', root);
  const startButton = $('[data-action="transcribe-media"]', root);
  const cancelButton = $('[data-action="cancel-transcription"]', root);
  const copyButton = $('[data-action="copy-transcript"]', root);
  const downloadButton = $('[data-action="download-transcript"]', root);
  let activeController = null;
  let activeWorker = null;
  let activeReader = null;
  let nextRequestId = 0;
  let pending = new Map();

  const setBusy = (busy) => {
    startButton.disabled = busy;
    cancelButton.disabled = !busy;
    $('[data-action="clear"]', root).disabled = busy;
    input.disabled = busy;
    $('#transcriber-language', root).disabled = busy;
  };
  const stop = () => {
    activeController?.abort();
    activeReader?.dispose();
    activeWorker?.terminate();
    activeWorker = null;
  };
  const rejectPending = (error) => {
    for (const waiting of pending.values()) {
      waiting.signal?.removeEventListener('abort', waiting.abort);
      waiting.reject(error);
    }
    pending.clear();
  };
  const clearOutput = () => {
    output.value = '';
    copyButton.disabled = true;
    downloadButton.disabled = true;
  };
  const request = (worker, type, values = {}, signal, transfer = []) => new Promise((resolve, reject) => {
    const id = ++nextRequestId;
    const abort = () => {
      pending.delete(id);
      reject(new DOMException('Transcription was canceled.', 'AbortError'));
    };
    pending.set(id, { resolve, reject, abort, signal });
    signal?.addEventListener('abort', abort, { once: true });
    try {
      worker.postMessage({ type, id, ...values }, transfer);
    } catch (error) {
      pending.delete(id);
      signal?.removeEventListener('abort', abort);
      reject(error);
    }
  });

  input.addEventListener('change', () => {
    clearOutput();
    const file = input.files[0];
    $('#transcriber-file-meta', root).textContent = file
      ? `${file.name} · ${formatSize(file.size)}`
      : t('Your recording is processed on this device and is never uploaded. The browser must support its audio codec.');
    progress.hidden = true;
    progress.value = 0;
    if (file) setStatus(root, 'Ready. Processing stays on this device.');
  });

  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'cancel-transcription') {
      stop();
      cancelButton.disabled = true;
      setStatus(root, 'Processing canceled. Your original is unchanged.');
      return;
    }
    if (action === 'clear') {
      stop();
      input.value = '';
      clearOutput();
      progress.hidden = true;
      progress.value = 0;
      $('#transcriber-file-meta', root).textContent = t('Your recording is processed on this device and is never uploaded. The browser must support its audio codec.');
      setStatus(root, 'No upload. Keep this tab open while your device works.');
      return;
    }
    if (action === 'copy-transcript') {
      if (!output.value) return;
      try {
        await navigator.clipboard.writeText(output.value);
        setStatus(root, 'Copied to clipboard.', 'success');
      } catch {
        setStatus(root, 'Copy was blocked. Select the text and copy it manually.', 'error');
      }
      return;
    }
    if (action === 'download-transcript') {
      if (!output.value) return;
      const url = URL.createObjectURL(new Blob([output.value], { type: 'text/plain;charset=utf-8' }));
      objectUrls.add(url);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${safeBaseName(input.files[0]?.name ?? 'recording')}-transcript.txt`;
      anchor.click();
      window.setTimeout(() => { URL.revokeObjectURL(url); objectUrls.delete(url); }, 60_000);
      setStatus(root, 'Text file downloaded.', 'success');
      return;
    }
    if (action !== 'transcribe-media' || activeController) return;
    const file = input.files[0];
    if (!file) return setStatus(root, 'Choose a file to transcribe.', 'error');

    const controller = new AbortController();
    activeController = controller;
    setBusy(true);
    clearOutput();
    progress.hidden = false;
    progress.value = 0;
    try {
      setStatus(root, 'Checking for audio…');
      const { prepareAudioReader } = await loadAudioModule();
      activeReader = await prepareAudioReader(file);
      if (controller.signal.aborted) return;

      activeWorker = new Worker(new URL(versioned('./media-transcription-worker.mjs'), import.meta.url), { type: 'module', name: 'UsefulVerse local transcription' });
      activeWorker.addEventListener('message', (message) => {
        const data = message.data;
        if (data.type === 'model-stage') setStatus(root, 'Downloading speech model (first use is about 43 MB)…');
        if (data.type === 'model-progress') {
          progress.value = data.progress;
          setStatus(root, t('Downloading model: {percent}%').replace('{percent}', String(data.progress)));
        }
        if (data.type === 'model-stage' || data.type === 'model-progress') return;
        const waiting = pending.get(data.id);
        if (!waiting) return;
        pending.delete(data.id);
        waiting.signal?.removeEventListener('abort', waiting.abort);
        if (data.type === 'error') waiting.reject(new Error(data.message || 'The local speech model could not run.'));
        else waiting.resolve(data);
      });
      activeWorker.addEventListener('error', () => {
        rejectPending(new Error('The local speech model stopped unexpectedly.'));
      });

      setStatus(root, 'Downloading speech model (first use is about 43 MB)…');
      await request(activeWorker, 'initialize', {}, controller.signal);
      if (controller.signal.aborted) return;

      let receivedTranscript = false;
      progress.value = 0;
      setStatus(root, 'Transcribing on your device…');
      await activeReader.stream({
        signal: controller.signal,
        onProgress(value) { progress.value = value; },
        async onChunk(audio) {
          if (controller.signal.aborted) throw new DOMException('Transcription was canceled.', 'AbortError');
          setStatus(root, 'Transcribing on your device…');
          const result = await request(activeWorker, 'transcribe', {
            audioBuffer: audio.buffer,
            language: $('#transcriber-language', root).value,
          }, controller.signal, [audio.buffer]);
          const text = result.text.trim();
          if (text) {
            output.value = `${output.value}${output.value ? '\n' : ''}${text}`;
            output.scrollTop = output.scrollHeight;
            receivedTranscript = true;
            copyButton.disabled = false;
            downloadButton.disabled = false;
          }
        },
      });

      if (!controller.signal.aborted) {
        progress.value = 100;
        setStatus(root, receivedTranscript ? 'Transcription complete. Review names and numbers.' : 'No speech detected. Try clearer audio or choose a language.', receivedTranscript ? 'success' : '');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatus(root, 'Processing canceled. Your original is unchanged.');
      } else {
        console.error('Local transcription failed', error);
        setStatus(root, 'The file or browser could not run local transcription. Try another supported format or a desktop browser.', 'error');
      }
    } finally {
      activeReader?.dispose();
      activeReader = null;
      activeWorker?.terminate();
      activeWorker = null;
      rejectPending(new DOMException('Transcription finished.', 'AbortError'));
      activeController = null;
      progress.hidden = true;
      setBusy(false);
    }
  });
}

export function setupMediaTool(id, root) {
  if (id === 'audio-compressor') setupAudioCompressor(root);
  if (id === 'media-transcriber') setupTranscriber(root);
}
