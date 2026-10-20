import { findAudioMatch, fingerprintAudio } from './logic.mjs';

const root = document.querySelector('[data-tool="music-identifier"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const analysisRate = 11025;
  const maxFileBytes = 8 * 1024 * 1024;
  let generation = 0;

  const monoAtAnalysisRate = (audio) => {
    if (audio.duration < 2 || audio.duration > 20) throw new RangeError(copy.messages.durationLimit);
    const length = Math.floor(audio.duration * analysisRate);
    const output = new Float32Array(length);
    const channels = Array.from({ length: audio.numberOfChannels }, (_, index) => audio.getChannelData(index));
    const scale = audio.sampleRate / analysisRate;
    for (let i = 0; i < length; i += 1) {
      const position = i * scale;
      const left = Math.floor(position), fraction = position - left;
      let sum = 0;
      for (const channel of channels) {
        const a = channel[Math.min(left, channel.length - 1)];
        const b = channel[Math.min(left + 1, channel.length - 1)];
        sum += a + (b - a) * fraction;
      }
      output[i] = sum / channels.length;
    }
    return output;
  };

  const decodeFingerprint = async (context, file) => {
    const audio = await context.decodeAudioData(await file.arrayBuffer());
    return fingerprintAudio(monoAtAnalysisRate(audio), analysisRate);
  };

  const appendLine = (label, value) => {
    const row = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    row.append(strong, document.createTextNode(String(value)));
    content.append(row);
  };

  const run = async (event) => {
    event.preventDefault();
    const runId = ++generation;
    content.replaceChildren();
    result.hidden = false;
    status.textContent = copy.messages.working;
    status.classList.remove('status--error');
    const clip = form.elements.namedItem('clip')?.files?.[0];
    const references = Array.from(form.elements.namedItem('library')?.files ?? []);
    if (!clip || references.length < 1 || references.length > 5) {
      status.textContent = copy.messages.selectFiles;
      status.classList.add('status--error');
      return;
    }
    if ([clip, ...references].some((file) => !file.type.startsWith('audio/') || file.size < 1 || file.size > maxFileBytes)
      || [clip, ...references].reduce((sum, file) => sum + file.size, 0) > 40 * 1024 * 1024) {
      status.textContent = copy.messages.fileLimit;
      status.classList.add('status--error');
      return;
    }
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) {
      status.textContent = copy.messages.unsupported;
      status.classList.add('status--error');
      return;
    }
    let context;
    try {
      context = new AudioContextClass();
      const query = await decodeFingerprint(context, clip);
      const candidates = [];
      for (const file of references) {
        if (runId !== generation) return;
        candidates.push({ name: file.name, fingerprint: await decodeFingerprint(context, file) });
      }
      const match = findAudioMatch(query, candidates);
      if (runId !== generation) return;
      if (!match || match.score < 0.72) {
        status.textContent = copy.messages.noMatch;
        return;
      }
      appendLine(copy.fields.match, match.name);
      appendLine(copy.fields.similarity, `${Math.round(match.score * 100)}%`);
      appendLine(copy.fields.offset, `${match.offsetSeconds.toFixed(1)} s`);
      status.textContent = copy.messages.complete;
    } catch (error) {
      if (runId === generation) {
        status.textContent = error instanceof RangeError && error.message === copy.messages.durationLimit ? error.message : copy.messages.decodeError;
        status.classList.add('status--error');
      }
    } finally {
      await context?.close().catch(() => {});
    }
  };
  form.addEventListener('submit', run);
  form.addEventListener('reset', () => {
    generation += 1;
    content.replaceChildren();
    result.hidden = true;
    status.textContent = '';
    status.classList.remove('status--error');
  });
}
