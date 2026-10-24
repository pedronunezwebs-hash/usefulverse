import { estimateChords } from './logic.mjs';

const root = document.querySelector('[data-tool="chord-recognizer"]');
if (root) {
  const form = root.querySelector('[data-chord-recognizer-form]');
  const status = root.querySelector('[data-status]');
  const result = root.querySelector('[data-result]');
  const timeline = root.querySelector('[data-timeline]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const rate = 11025;
  let runId = 0;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = ++runId;
    timeline.replaceChildren();
    result.hidden = false;
    status.classList.remove('status--error');
    const file = form.elements.namedItem('audio')?.files?.[0];
    if (!file || !file.type.startsWith('audio/')) {
      status.textContent = copy.messages.chooseFile;
      status.classList.add('status--error');
      return;
    }
    if (file.size < 1 || file.size > 20 * 1024 * 1024) {
      status.textContent = copy.messages.fileLimit;
      status.classList.add('status--error');
      return;
    }
    const Audio = window.AudioContext ?? window.webkitAudioContext;
    if (!Audio) {
      status.textContent = copy.messages.unsupported;
      status.classList.add('status--error');
      return;
    }
    status.textContent = copy.messages.working;
    let context;
    try {
      context = new Audio();
      const audio = await context.decodeAudioData(await file.arrayBuffer());
      if (audio.duration > 60 || audio.duration < 0.2) throw new RangeError('duration');
      const length = Math.floor(audio.duration * rate);
      const samples = new Float32Array(length);
      const channels = Array.from({ length: audio.numberOfChannels }, (_, channel) => audio.getChannelData(channel));
      const scale = audio.sampleRate / rate;
      for (let i = 0; i < length; i += 1) {
        const position = i * scale;
        const left = Math.floor(position), fraction = position - left;
        let sum = 0;
        for (const channel of channels) {
          const a = channel[Math.min(left, channel.length - 1)];
          const b = channel[Math.min(left + 1, channel.length - 1)];
          sum += a + (b - a) * fraction;
        }
        samples[i] = sum / channels.length;
      }
      const estimated = estimateChords(samples, rate);
      if (id !== runId) return;
      if (!estimated.timeline.length) {
        status.textContent = copy.messages.empty;
        return;
      }
      for (const row of estimated.timeline) {
        const item = document.createElement('li');
        item.className = 'chord-recognizer-timeline__item';
        const chord = document.createElement('strong');
        chord.textContent = row.chord;
        const time = document.createElement('span');
        time.textContent = `${row.startSeconds.toFixed(1)}–${Math.min(row.endSeconds, estimated.durationSeconds).toFixed(1)} s`;
        const score = document.createElement('span');
        score.textContent = `${copy.fields.similarity}: ${Math.round(row.similarity * 100)}%`;
        item.append(chord, time, score);
        timeline.append(item);
      }
      status.textContent = '';
    } catch (error) {
      if (id === runId) {
        status.textContent = error instanceof RangeError && error.message === 'duration' ? copy.messages.fileLimit : error?.message?.includes('No stable tonal content') ? copy.messages.noTonalContent : copy.messages.decodeError;
        status.classList.add('status--error');
      }
    } finally {
      await context?.close().catch(() => {});
    }
  });
  form.addEventListener('reset', () => {
    runId += 1;
    timeline.replaceChildren();
    result.hidden = true;
    status.textContent = '';
    status.classList.remove('status--error');
  });
}
