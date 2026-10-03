import assert from 'node:assert/strict';
import test from 'node:test';
import { createXlsx, readXlsxSheets } from './pdf-office.mjs';
import { convertSubtitles, csvText, gcdAll, lcmAll, parseCsv, parseWholeNumbers, toggleRecorderPause } from './plan-tools.js';
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
