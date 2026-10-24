import { validateVideoTimeline } from './logic.mjs';

export function mountVideoEditor() {
  const form = document.querySelector('#tool-form.video-editor');
  if (!form) return;
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields ?? {};
  const fileInput = form.querySelector('[data-video-files]');
  const rows = form.querySelector('[data-video-rows]');
  const result = form.querySelector('[data-video-result]');
  const status = form.querySelector('[data-video-status]');
  const exportButton = form.querySelector('[data-video-export]');
  const stopButton = form.querySelector('[data-video-stop]');
  let clips = [];
  let urls = [];
  let audioContext = null;
  const audioSources = new WeakMap();
  let cancelled = false;
  const say = (message, kind = '') => { status.textContent = message; status.dataset.state = kind; };
  const releaseUrls = () => { for (const url of urls) URL.revokeObjectURL(url); urls = []; };
  const time = (value) => Math.max(0, Number(value) || 0).toFixed(2);
  const metadata = (file, url) => new Promise((resolve, reject) => {
    const video = document.createElement('video'); video.preload = 'metadata'; video.playsInline = true; video.muted = false;
    video.src = url;
    const clean = () => { video.removeEventListener('loadedmetadata', loaded); video.removeEventListener('error', failed); };
    const loaded = () => { clean(); resolve({ file, url, video, duration: video.duration, start: 0, end: video.duration }); };
    const failed = () => { clean(); reject(new Error(f.readFailed)); };
    video.addEventListener('loadedmetadata', loaded, { once: true }); video.addEventListener('error', failed, { once: true });
  });
  const renderRows = () => {
    rows.replaceChildren();
    clips.forEach((clip, index) => {
      const row = document.createElement('fieldset'); row.className = 'video-editor__clip';
      const legend = document.createElement('legend'); legend.textContent = `${f.clip} ${index + 1}: ${clip.file.name}`; row.append(legend);
      const range = document.createElement('p'); range.textContent = `${f.sourceDuration}: ${time(clip.duration)} ${f.seconds}`; row.append(range);
      for (const [key, label] of [['start', f.startAt], ['end', f.endAt]]) {
        const wrapper = document.createElement('label'); wrapper.textContent = label;
        const input = document.createElement('input'); input.type = 'number'; input.min = '0'; input.max = String(clip.duration); input.step = '0.01'; input.value = time(clip[key]); input.dataset.clipIndex = String(index); input.dataset.clipTime = key;
        input.addEventListener('input', () => { clip[key] = input.value === '' ? Number.NaN : Number(input.value); }); wrapper.append(input); row.append(wrapper);
      }
      const actions = document.createElement('div'); actions.className = 'actions';
      if (index > 0) { const up = document.createElement('button'); up.type = 'button'; up.className = 'button button--secondary'; up.textContent = f.moveUp; up.addEventListener('click', () => { [clips[index - 1], clips[index]] = [clips[index], clips[index - 1]]; renderRows(); }); actions.append(up); }
      if (index < clips.length - 1) { const down = document.createElement('button'); down.type = 'button'; down.className = 'button button--secondary'; down.textContent = f.moveDown; down.addEventListener('click', () => { [clips[index + 1], clips[index]] = [clips[index], clips[index + 1]]; renderRows(); }); actions.append(down); }
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'button button--secondary'; remove.textContent = f.removeClip; remove.addEventListener('click', () => { clips.splice(index, 1); renderRows(); }); actions.append(remove); row.append(actions); rows.append(row);
    });
  };
  fileInput.addEventListener('change', async () => {
    result.replaceChildren(); releaseUrls(); clips = [];
    const files = Array.from(fileInput.files ?? []);
    if (!files.length) { rows.replaceChildren(); say(''); return; }
    if (files.length > 3) { fileInput.value = ''; say(f.tooManyClips, 'error'); return; }
    if (files.some((file) => !file.type.startsWith('video/'))) { fileInput.value = ''; say(f.chooseVideo, 'error'); return; }
    if (files.reduce((sum, file) => sum + file.size, 0) > 100 * 1024 * 1024) { fileInput.value = ''; say(f.filesTooLarge, 'error'); return; }
    try {
      for (const file of files) { const url = URL.createObjectURL(file); urls.push(url); clips.push(await metadata(file, url)); }
      renderRows(); say(f.filesReady, 'success');
    } catch (error) { releaseUrls(); clips = []; fileInput.value = ''; say(error.message || f.readFailed, 'error'); }
  });
  const seek = (video, second) => new Promise((resolve, reject) => {
    if (Math.abs(video.currentTime - second) < 0.03) { resolve(); return; }
    const timer = setTimeout(() => { video.removeEventListener('seeked', done); reject(new Error(f.seekFailed)); }, 10_000);
    const done = () => { clearTimeout(timer); video.removeEventListener('seeked', done); resolve(); };
    video.addEventListener('seeked', done, { once: true }); video.currentTime = second;
  });
  const drawFrame = (context, canvas, video, title) => {
    context.fillStyle = '#080b12'; context.fillRect(0, 0, canvas.width, canvas.height);
    const ratio = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
    const width = video.videoWidth * ratio; const height = video.videoHeight * ratio;
    context.drawImage(video, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    if (title) {
      context.font = 'bold 32px system-ui, sans-serif'; context.textAlign = 'center'; context.textBaseline = 'bottom'; context.direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
      const caption = title.slice(0, 100); const x = canvas.width / 2; const y = canvas.height - 28;
      context.fillStyle = 'rgba(0,0,0,.72)'; context.fillRect(24, y - 54, canvas.width - 48, 64);
      context.fillStyle = '#fff'; context.fillText(caption, x, y, canvas.width - 80);
    }
  };
  exportButton.addEventListener('click', async () => {
    result.replaceChildren(); cancelled = false;
    let recorder; let stream; const audioNodes = [];
    try {
      const plan = validateVideoTimeline(clips);
      const canvas = document.createElement('canvas'); canvas.width = 1280; canvas.height = 720;
      const context = canvas.getContext('2d'); if (!context) throw new Error(f.canvasUnavailable);
      if (typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') throw new Error(f.recorderUnavailable);
      stream = canvas.captureStream(24);
      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContextClass) throw new Error(f.recorderUnavailable);
      audioContext ??= new AudioContextClass(); const audioDestination = audioContext.createMediaStreamDestination();
      for (const clip of plan.clips) {
        let source = audioSources.get(clip.video);
        if (!source) { source = audioContext.createMediaElementSource(clip.video); audioSources.set(clip.video, source); }
        source.connect(audioDestination); audioNodes.push(source);
      }
      for (const track of audioDestination.stream.getAudioTracks()) stream.addTrack(track);
      const mimeType = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find((type) => MediaRecorder.isTypeSupported(type));
      if (!mimeType) throw new Error(f.recorderUnavailable);
      recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2_500_000, audioBitsPerSecond: 128_000 });
      const chunks = []; recorder.addEventListener('dataavailable', (event) => { if (event.data.size) chunks.push(event.data); });
      const stopped = new Promise((resolve) => recorder.addEventListener('stop', resolve, { once: true }));
      recorder.start(1000); stopButton.hidden = false; exportButton.disabled = true; fileInput.disabled = true;
      await audioContext.resume();
      for (const [index, clip] of plan.clips.entries()) {
        if (cancelled) break;
        const video = clip.video;
        for (const other of plan.clips) other.video.pause();
        await seek(video, clip.start); await video.play();
        say(`${f.exporting} ${index + 1}/${plan.clips.length}`);
        await new Promise((resolve, reject) => {
          const frame = () => {
            try {
              drawFrame(context, canvas, video, form.querySelector('[name="overlay"]')?.value ?? '');
              if (cancelled || video.currentTime >= clip.end || video.ended) { video.pause(); resolve(); return; }
              requestAnimationFrame(frame);
            } catch (error) { reject(error); }
          };
          requestAnimationFrame(frame);
        });
      }
      for (const clip of plan.clips) clip.video.pause();
      recorder.stop(); await stopped; await audioContext.suspend();
      for (const node of audioNodes) node.disconnect();
      if (cancelled) { say(f.exportCancelled, ''); return; }
      const blob = new Blob(chunks, { type: mimeType }); const url = URL.createObjectURL(blob); urls.push(url);
      const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-video-edit.webm'; link.textContent = f.downloadVideo; link.className = 'button button--primary'; result.append(link);
      say(`${f.exportComplete} (${(blob.size / 1024 / 1024).toFixed(1)} MiB)`, 'success');
    } catch (error) { say(error.message || f.exportFailed, 'error'); }
    finally {
      if (recorder?.state === 'recording') { try { recorder.stop(); } catch {} }
      for (const track of stream?.getTracks() ?? []) track.stop();
      for (const node of audioNodes) { try { node.disconnect(); } catch {} }
      if (audioContext && audioContext.state === 'running') { try { await audioContext.suspend(); } catch {} }
      exportButton.disabled = false; fileInput.disabled = false; stopButton.hidden = true;
    }
  });
  stopButton.addEventListener('click', () => { cancelled = true; say(f.stopping); });
  form.querySelector('[data-video-reset]')?.addEventListener('click', () => { cancelled = true; releaseUrls(); clips = []; rows.replaceChildren(); result.replaceChildren(); say(''); });
  window.addEventListener('pagehide', () => { releaseUrls(); if (audioContext && audioContext.state !== 'closed') void audioContext.close(); }, { once: true });
}

mountVideoEditor();
