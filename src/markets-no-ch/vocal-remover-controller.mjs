const root = document.querySelector('[data-vocal-remover]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields; const fileInput = root.querySelector('[data-vocal-file]'); const start = root.querySelector('[data-vocal-start]'); const clear = root.querySelector('[data-vocal-clear]'); const status = root.querySelector('[data-vocal-status]'); const progress = root.querySelector('[data-vocal-progress]'); const output = root.querySelector('[data-vocal-results]');
  let worker; let urls = [];
  const cleanup = () => { worker?.terminate(); worker = undefined; for (const url of urls) URL.revokeObjectURL(url); urls = []; output.replaceChildren(); output.hidden = true; progress.hidden = true; progress.value = 0; start.disabled = false; fileInput.disabled = false; };
  clear.addEventListener('click', () => { cleanup(); fileInput.value = ''; status.textContent = copy.messages.ready; });
  start.addEventListener('click', async () => {
    const file = fileInput.files?.[0];
    if (!file || file.size > 30 * 1024 * 1024) { status.textContent = copy.messages.invalid; return; }
    cleanup(); start.disabled = true; fileInput.disabled = true; progress.hidden = false; status.textContent = copy.messages.running;
    let audioContext;
    try {
      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('audio-context');
      audioContext = new AudioContextClass();
      const decoded = await audioContext.decodeAudioData(await file.arrayBuffer());
      if (decoded.duration > 30 || decoded.duration <= 0) throw new Error('audio-limit');
      const targetRate = 44100; const length = Math.ceil(decoded.length * targetRate / decoded.sampleRate);
      const sourceChannels = decoded.numberOfChannels === 1 ? [decoded.getChannelData(0), decoded.getChannelData(0)] : [decoded.getChannelData(0), decoded.getChannelData(1)];
      const channels = sourceChannels.map((source) => {
        const converted = new Float32Array(length); const ratio = decoded.sampleRate / targetRate;
        for (let i = 0; i < length; i += 1) { const x = i * ratio; const left = Math.min(source.length - 1, Math.floor(x)); const right = Math.min(source.length - 1, left + 1); const fraction = x - left; converted[i] = source[left] * (1 - fraction) + source[right] * fraction; }
        return converted;
      });
      await audioContext.close(); audioContext = undefined;
      worker = new Worker('/assets/vocal-remover-worker.mjs', { type: 'module', name: 'Local vocal separation' });
      worker.onmessage = ({ data }) => {
        if (data.type === 'progress') { status.textContent = f[data.key] ?? f.processing; progress.value = Math.max(0, Math.min(1, Number(data.fraction ?? 0))); return; }
        if (data.type === 'error') { cleanup(); status.textContent = data.message === 'model-hash' || data.message === 'model-size' ? f.failed : copy.messages.invalid; return; }
        if (data.type !== 'complete') return;
        cleanup();
        const labels = [f.vocals, f.accompaniment];
        data.stems.forEach((bytes, index) => {
          const url = URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' })); urls.push(url);
          const section = document.createElement('article'); const heading = document.createElement('h3'); heading.textContent = labels[index];
          const player = document.createElement('audio'); player.controls = true; player.preload = 'none'; player.src = url;
          const link = document.createElement('a'); link.href = url; link.download = `${index === 0 ? 'vocals' : 'accompaniment'}-44k.wav`; link.textContent = f.download;
          section.append(heading, player, link); output.append(section);
        });
        output.hidden = false; status.textContent = copy.messages.done;
      };
      worker.onerror = () => { cleanup(); status.textContent = f.failed; };
      worker.postMessage({ type: 'separate', channels }, channels.map((channel) => channel.buffer));
    } catch {
      try { await audioContext?.close(); } catch {}
      cleanup(); status.textContent = copy.messages.invalid;
    }
  });
  window.addEventListener('pagehide', cleanup, { once: true });
}
