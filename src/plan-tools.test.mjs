import assert from 'node:assert/strict';
import test from 'node:test';
import { createXlsx, readXlsxSheets } from './pdf-office.mjs';
import { convertSubtitles, csvText, gcdAll, lcmAll, parseCsv, parseWholeNumbers, setupPlanTool, toggleRecorderPause } from './plan-tools.js';
import { planToolMarkup } from './plan-tools-template.mjs';
import { locales, localizedTool } from './locales.mjs';
import { gifMakerCopy } from './locales/gif-maker-copy.mjs';
import { recordingControlLocales } from './locales/recording-controls.mjs';
import { tools } from './catalog.mjs';

test('GCD and LCM support negative integers, zero and several values', () => {
  const values = parseWholeNumbers('12, -18, 30');
  assert.equal(gcdAll(values), 6n);
  assert.equal(lcmAll(values), 180n);
  assert.equal(gcdAll(parseWholeNumbers('0 0')), 0n);
  assert.equal(lcmAll(parseWholeNumbers('0 12')), 0n);
  assert.throws(() => parseWholeNumbers('4.5, 3'), /whole numbers/u);
  assert.throws(() => parseWholeNumbers('1'), /2 to 100/u);
});

test('CSV parser preserves quoted commas, escaped quotes, newlines and leading zeros', () => {
  const input = 'id,note\r\n001,"one, two"\r\n002,"line one\nline two"\r\n003,"say ""hi"""';
  const rows = parseCsv(input);
  assert.deepEqual(rows, [['id', 'note'], ['001', 'one, two'], ['002', 'line one\nline two'], ['003', 'say "hi"']]);
  assert.deepEqual(parseCsv(csvText(rows)), rows);
  assert.throws(() => parseCsv('a,"open'), /unclosed/u);
});

test('XLSX converter reads a selected worksheet and writes values as inert text', () => {
  const bytes = createXlsx([['id', 'value'], ['001', '=2+2'], ['002', 'hello']]);
  const sheets = readXlsxSheets(bytes);
  assert.equal(sheets.length, 1);
  assert.deepEqual(sheets[0].rows, [['id', 'value'], ['001', '=2+2'], ['002', 'hello']]);
});

test('subtitle conversion shifts timing, preserves multiline captions and normalizes timestamps', () => {
  const srt = '1\n00:00:01,250 --> 00:00:02,500\nHello\nsecond line\n\n2\n00:00:03,000 --> 00:00:04,000\nBye';
  const vtt = convertSubtitles(srt, 'vtt', 500);
  assert.match(vtt, /^WEBVTT/u);
  assert.match(vtt, /00:00:01\.750 --> 00:00:03\.000\nHello\nsecond line/u);
  assert.match(vtt, /00:00:03\.500 --> 00:00:04\.500/u);
  assert.throws(() => convertSubtitles(srt, 'srt', -2_000), /cue invalid/u);
});

test('voice recorder exposes an accessible pause and resume control', () => {
  const markup = planToolMarkup('voice-recorder');
  assert.match(markup, /data-action="pause-voice-recording" aria-pressed="false" disabled>Pause/u);
  assert.match(markup, /data-action="stop-plan-recording" disabled>Stop and save/u);

  const calls = [];
  const recorder = {
    state: 'recording',
    pause() { calls.push('pause'); this.state = 'paused'; },
    resume() { calls.push('resume'); this.state = 'recording'; },
  };
  assert.equal(toggleRecorderPause(recorder), 'paused');
  assert.equal(toggleRecorderPause(recorder), 'recording');
  assert.deepEqual(calls, ['pause', 'resume']);
  assert.equal(toggleRecorderPause({ state: 'inactive' }), null);
});

function recorderHarness({ capture = async (stream) => stream, supportedType = 'video/webm;codecs=vp9,opus' } = {}) {
  const listeners = new Map();
  const status = { textContent: '', className: '' };
  const preview = { hidden: true, src: '', pause() {}, removeAttribute(name) { if (name === 'src') this.src = ''; } };
  const downloadLink = { hidden: true, href: '', download: '', textContent: '' };
  const start = { disabled: false };
  const stop = { disabled: true };
  const typeSelect = { innerHTML: '', options: [], add(option) { this.options.push(option); } };
  const controls = new Map([
    ['#tool-status', status], ['#plan-recording-preview', preview], ['#plan-recording-download', downloadLink],
    ['[data-action="start-screen-recording"]', start], ['[data-action="stop-plan-recording"]', stop],
    ['#plan-recording-type', typeSelect],
  ]);
  const root = {
    append() {},
    querySelector(selector) { return controls.get(selector) ?? null; },
    addEventListener(type, listener) { listeners.set(type, listener); },
    click(action) {
      const target = { closest() { return { dataset: { action } }; } };
      return listeners.get('click')({ target });
    },
  };
  class MockMediaRecorder {
    static isTypeSupported(type) { return type === supportedType; }
    constructor(stream, options = {}) { this.stream = stream; this.mimeType = options.mimeType ?? 'video/webm'; this.state = 'inactive'; this.events = new Map(); }
    addEventListener(type, listener) { this.events.set(type, listener); }
    start() { this.state = 'recording'; }
    stop() {
      this.state = 'inactive';
      this.events.get('dataavailable')?.({ data: new Blob(['fake-video'], { type: this.mimeType }) });
      this.events.get('stop')?.();
    }
  }
  const stream = fakeStream();
  const keys = ['navigator', 'MediaRecorder', 'Option', 'document', 'window', 'URL'];
  const previous = Object.fromEntries(keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const replaceGlobal = (key, value) => Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  replaceGlobal('navigator', { mediaDevices: { async getDisplayMedia(options) { assert.deepEqual(options, { video: true, audio: false }); return capture(stream); } } });
  replaceGlobal('MediaRecorder', MockMediaRecorder);
  replaceGlobal('Option', class { constructor(text, value) { this.text = text; this.value = value; } });
  replaceGlobal('document', { createElement() { return { href: '', download: '', hidden: false, click() {}, remove() {} }; } });
  replaceGlobal('window', { addEventListener() {} });
  replaceGlobal('URL', Object.assign(Object.create(previous.URL?.value ?? URL), {
    createObjectURL: () => 'blob:screen-test',
    revokeObjectURL() {},
  }));
  setupPlanTool('screen-recorder', root);
  return { root, status, preview, downloadLink, start, stop, typeSelect, stream, restore() { for (const key of keys) { if (previous[key]) Object.defineProperty(globalThis, key, previous[key]); else delete globalThis[key]; } } };
}

function fakeStream() {
  const trackListeners = new Map();
  const track = { stopped: false, addEventListener(type, listener) { trackListeners.set(type, listener); }, stop() { this.stopped = true; }, end() { trackListeners.get('ended')?.(); } };
  return { getTracks: () => [track], getVideoTracks: () => [track], track };
}

test('screen recorder requests a user-selected display only on click, saves a previewable recording and releases capture', async () => {
  let requests = 0;
  const h = recorderHarness({ capture: async (stream) => { requests += 1; return stream; } });
  try {
    assert.equal(requests, 0, 'capture should not start during setup');
    assert.equal(h.typeSelect.options[0].value, 'video/webm;codecs=vp9,opus');
    await h.root.click('start-screen-recording');
    assert.equal(requests, 1);
    assert.equal(h.start.disabled, true);
    assert.equal(h.stop.disabled, false);
    await h.root.click('stop-plan-recording');
    assert.equal(h.preview.hidden, false);
    assert.equal(h.preview.src, 'blob:screen-test');
    assert.equal(h.downloadLink.hidden, false);
    assert.match(h.downloadLink.download, /\.webm$/u);
    assert.match(h.status.textContent, /Recording ready/u);
    assert.equal(h.stream.track.stopped, true);
  } finally { h.restore(); }
});

test('screen recorder handles a denied permission and screen-share ending without retaining capture', async () => {
  const denied = recorderHarness({ capture: async () => { throw Object.assign(new Error('denied'), { name: 'NotAllowedError' }); } });
  try {
    await denied.root.click('start-screen-recording');
    assert.equal(denied.start.disabled, false);
    assert.equal(denied.stop.disabled, true);
    assert.match(denied.status.textContent, /Permission was not granted/u);
  } finally { denied.restore(); }

  const ended = recorderHarness();
  try {
    await ended.root.click('start-screen-recording');
    ended.stream.track.end();
    assert.equal(ended.stream.track.stopped, true);
    assert.equal(ended.downloadLink.hidden, false);
    assert.match(ended.status.textContent, /Recording ready/u);
  } finally { ended.restore(); }
});

test('recording controls and GIF capability copy cover every published full locale', () => {
  const gifTool = tools.find((tool) => tool.id === 'gif-maker');
  assert.equal(Object.keys(gifMakerCopy).length, Object.keys(locales).length);
  assert.equal(Object.keys(recordingControlLocales).length, Object.keys(locales).length);
  for (const language of Object.keys(locales)) {
    const tool = localizedTool(gifTool, language);
    assert.equal(tool.intro, gifMakerCopy[language][0], language);
    assert.equal(tool.body, gifMakerCopy[language][1], language);
    assert.match(recordingControlLocales[language].Resume, /\S/u, language);
    assert.match(recordingControlLocales[language]['Recording paused.'], /\S/u, language);
  }
});
