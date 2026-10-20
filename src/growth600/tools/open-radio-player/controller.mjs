import { filterRadioStations, parseRadioPlaylist } from './logic.mjs';

const root = document.querySelector('[data-tool="open-radio-player"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.preload = 'none';
  audio.referrerPolicy = 'no-referrer';
  audio.setAttribute('aria-label', copy.fields.playerLabel);
  let stations = [];
  let activeAudioUrl = '';
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = String(text);
    if (className) element.className = className;
    return element;
  };
  function setStatus(message, error = false) {
    status.textContent = message;
    status.classList.toggle('status--error', error);
  }
  function renderStations(matches) {
    content.replaceChildren();
    if (!matches.length) {
      content.append(node('p', copy.messages.noStations));
      result.hidden = false;
      return;
    }
    const list = node('ol', undefined, 'pending-radio-stations');
    for (const station of matches) {
      const item = node('li', undefined, 'pending-radio-station');
      item.append(node('h3', station.name));
      item.append(node('p', copy.fields.streamHost.replace('{host}', new URL(station.url).hostname)));
      const details = [station.country, station.language, station.tags].filter(Boolean).join(' · ');
      if (details) item.append(node('p', details));
      const play = node('button', copy.fields.playStation, 'button button--secondary');
      play.type = 'button';
      play.addEventListener('click', () => {
        if (activeAudioUrl === station.url && !audio.paused) {
          audio.pause();
          return;
        }
        activeAudioUrl = station.url;
        audio.src = station.url;
        audio.load();
        const playback = audio.play();
        if (playback?.then) playback.then(() => setStatus(copy.messages.playing)).catch(() => setStatus(copy.messages.streamUnavailable, true));
        else setStatus(copy.messages.playing);
      });
      item.append(play);
      list.append(item);
    }
    content.append(list, audio);
    result.hidden = false;
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = form.elements.namedItem('playlist');
    const file = input?.files?.[0];
    content.replaceChildren();
    result.hidden = true;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    activeAudioUrl = '';
    try {
      if (file) stations = parseRadioPlaylist(await file.text());
      if (!stations.length) throw new TypeError('choose-playlist');
      const country = form.elements.namedItem('country').value.trim().toUpperCase();
      const matches = filterRadioStations(stations, {
        station: form.elements.namedItem('station').value,
        country,
        language: form.elements.namedItem('language').value,
        tag: form.elements.namedItem('tag').value,
      });
      renderStations(matches);
      setStatus(copy.messages.searchComplete.replace('{count}', new Intl.NumberFormat(document.documentElement.lang || 'en').format(matches.length)));
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      const key = ['choose-playlist', 'playlist-too-large', 'invalid-playlist', 'no-valid-stations', 'too-many-stations', 'empty-filter', 'invalid-country'].includes(message) ? message : 'directoryUnavailable';
      setStatus(copy.messages[key] ?? copy.messages.directoryUnavailable, true);
      result.hidden = false;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    stations = [];
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    activeAudioUrl = '';
    content.replaceChildren();
    result.hidden = true;
    setStatus('');
  }));
  window.addEventListener('pagehide', () => {
    audio.pause();
    audio.removeAttribute('src');
  });
  audio.addEventListener('error', () => setStatus(copy.messages.streamUnavailable, true));
}
