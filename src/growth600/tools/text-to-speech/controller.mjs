import { countSpeechCharacters, MAX_SPEECH_CHARACTERS, splitSpeechText, truncateSpeechText } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="text-to-speech"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const text = form.elements.namedItem('text');
  const voiceSelect = form.elements.namedItem('voice');
  const remoteToggle = form.elements.namedItem('showRemote');
  const count = root.querySelector('[data-character-count]');
  const rate = form.elements.namedItem('rate');
  const pitch = form.elements.namedItem('pitch');
  const progressWrap = root.querySelector('[data-speech-progress]');
  const progress = root.querySelector('#speech-progress');
  const buttons = Object.fromEntries(['play', 'pause', 'resume', 'stop'].map((action) => [action, root.querySelector(`[data-action="${action}"]`)]));
  const synthesis = window.speechSynthesis;
  const utteranceAvailable = typeof window.SpeechSynthesisUtterance === 'function';
  let voices = [];
  let chunks = [];
  let chunkIndex = 0;
  let spokenOffset = 0;
  let totalSpeechUnits = 0;
  let active = false;
  let runId = 0;

  function setPlaybackState(state) {
    buttons.play.hidden = state === 'playing' || state === 'paused';
    buttons.pause.hidden = state !== 'playing';
    buttons.resume.hidden = state !== 'paused';
    buttons.stop.hidden = state === 'idle';
    progressWrap.hidden = state === 'idle';
  }

  function setProgress(value) {
    progress.value = Math.max(0, Math.min(100, value));
  }

  function refreshCount() {
    count.textContent = new Intl.NumberFormat(document.documentElement.lang || 'en').format(countSpeechCharacters(text.value));
  }

  function refreshVoices() {
    const selectedVoiceUri = voices[Number(voiceSelect.selectedOptions[0]?.dataset.originalIndex)]?.voiceURI;
    voices = synthesis?.getVoices?.() ?? [];
    const available = voices.filter((voice) => voice.localService === true || remoteToggle.checked);
    voiceSelect.replaceChildren(new Option(copy.fields.browserDefault, ''));
    for (const [index, voice] of available.entries()) {
      const kind = voice.localService === true ? copy.fields.localVoice : copy.fields.remoteVoice;
      const option = new Option(`${voice.name || voice.lang || copy.fields.voiceLabel} (${voice.lang || '—'}) — ${kind}`, String(index));
      option.dataset.originalIndex = String(voices.indexOf(voice));
      voiceSelect.add(option);
    }
    const match = [...voiceSelect.options].find((option) => voices[Number(option.dataset.originalIndex)]?.voiceURI === selectedVoiceUri);
    voiceSelect.value = match?.value ?? '';
  }

  function currentVoice() {
    if (voiceSelect.value) return voices[Number(voiceSelect.selectedOptions[0]?.dataset.originalIndex)];
    return voices.find((voice) => voice.default) ?? null;
  }

  function stopPlayback(message = copy.messages.stopped, announceMessage = true) {
    runId += 1;
    active = false;
    chunks = [];
    chunkIndex = 0;
    spokenOffset = 0;
    totalSpeechUnits = 0;
    synthesis?.cancel?.();
    setPlaybackState('idle');
    setProgress(0);
    if (announceMessage) announce(root, message, 'success');
  }

  function speakNext(expectedRun) {
    if (!active || expectedRun !== runId) return;
    if (chunkIndex >= chunks.length) {
      active = false;
      setPlaybackState('idle');
      setProgress(100);
      announce(root, copy.messages.finished, 'success');
      return;
    }
    const part = chunks[chunkIndex];
    const utterance = new SpeechSynthesisUtterance(part);
    const voice = currentVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = Number(rate.value);
    utterance.pitch = Number(pitch.value);
    utterance.onboundary = (event) => {
      if (expectedRun !== runId) return;
      const current = spokenOffset + Math.min(part.length, Math.max(0, event.charIndex || 0));
      setProgress((current / Math.max(1, totalSpeechUnits)) * 100);
    };
    utterance.onend = () => {
      if (expectedRun !== runId) return;
      spokenOffset += part.length;
      chunkIndex += 1;
      setProgress((spokenOffset / Math.max(1, totalSpeechUnits)) * 100);
      speakNext(expectedRun);
    };
    utterance.onerror = (event) => {
      if (expectedRun !== runId || event.error === 'canceled' || event.error === 'interrupted') return;
      active = false;
      setPlaybackState('idle');
      announce(root, copy.messages.playbackError, 'error');
    };
    synthesis.speak(utterance);
  }

  function play() {
    if (!synthesis || !utteranceAvailable) return announce(root, copy.messages.unsupported, 'error');
    const spoken = text.value.trim();
    if (!spoken) return announce(root, copy.messages.emptyText, 'error');
    if (countSpeechCharacters(spoken) > MAX_SPEECH_CHARACTERS) return announce(root, copy.messages.tooLong, 'error');
    const voice = currentVoice();
    if (!voices.length) return announce(root, copy.messages.noVoices, 'error');
    if (voice?.localService !== true) {
      if (!remoteToggle.checked) return announce(root, copy.messages.selectVoice, 'error');
      if (!window.confirm(copy.messages.remoteConfirm)) return;
    }
    synthesis.cancel();
    chunks = splitSpeechText(spoken);
    totalSpeechUnits = spoken.length;
    chunkIndex = 0;
    spokenOffset = 0;
    active = true;
    runId += 1;
    setProgress(0);
    setPlaybackState('playing');
    announce(root, copy.messages.playbackStarted, 'success');
    speakNext(runId);
  }

  remoteToggle.addEventListener('change', refreshVoices);
  synthesis?.addEventListener?.('voiceschanged', refreshVoices);
  refreshVoices();
  setPlaybackState('idle');
  refreshCount();

  text.addEventListener('input', () => {
    if (countSpeechCharacters(text.value) > MAX_SPEECH_CHARACTERS) {
      let selection = text.selectionStart;
      if (selection > 0 && selection < text.value.length) {
        const left = text.value.charCodeAt(selection - 1);
        const right = text.value.charCodeAt(selection);
        if (left >= 0xD800 && left <= 0xDBFF && right >= 0xDC00 && right <= 0xDFFF) selection -= 1;
      }
      const codePointsBeforeCursor = countSpeechCharacters(text.value.slice(0, selection));
      text.value = truncateSpeechText(text.value);
      const safeSelection = Array.from(text.value).slice(0, codePointsBeforeCursor).join('').length;
      text.setSelectionRange(safeSelection, safeSelection);
      announce(root, copy.messages.tooLong, 'error');
    }
    refreshCount();
  });
  rate.addEventListener('input', () => { root.querySelector('[data-rate-value]').value = `${rate.value}×`; });
  pitch.addEventListener('input', () => { root.querySelector('[data-pitch-value]').value = `${pitch.value}×`; });

  buttons.play.addEventListener('click', play);
  buttons.pause.addEventListener('click', () => {
    if (!active) return;
    synthesis.pause();
    setPlaybackState('paused');
    announce(root, copy.messages.paused, 'success');
  });
  buttons.resume.addEventListener('click', () => {
    if (!active) return;
    synthesis.resume();
    setPlaybackState('playing');
    announce(root, copy.messages.resumed, 'success');
  });
  buttons.stop.addEventListener('click', () => stopPlayback());
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    stopPlayback('', false);
    text.value = copy.example.text;
    refreshCount();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
    stopPlayback('', false);
    text.value = '';
    refreshCount();
    text.focus();
    announce(root, copy.messages.textCleared, 'success');
  });
  form.addEventListener('reset', () => stopPlayback('', false));
  window.addEventListener('pagehide', () => synthesis?.cancel?.(), { once: true });
}
