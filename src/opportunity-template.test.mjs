import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { opportunityToolMarkup } from './opportunity-template.mjs';
import { opportunityLocaleData } from './locales/opportunity-tools.mjs';
import { interactionControlLocales } from './locales/interaction-controls.mjs';
import { longtailBodies } from './locales/longtail.mjs';
import { locales, localizedTool } from './locales.mjs';
import { opportunityTools } from './opportunity-tools.mjs';
import { generatedOpportunityCopy } from './locales/generated-opportunity-copy.mjs';

function cardAttributes(markup, fieldId) {
  const fieldIndex = markup.indexOf(`data-op-field="${fieldId}"`);
  assert.notEqual(fieldIndex, -1, `Expected field ${fieldId} in rendered markup`);
  const sectionStart = markup.lastIndexOf('<section class="calculator-card"', fieldIndex);
  const sectionEnd = markup.indexOf('>', sectionStart);
  return markup.slice(sectionStart, sectionEnd + 1);
}

test('conditional fields render in their default visible state before JavaScript initializes', () => {
  const bmi = opportunityToolMarkup('adult-bmi-calculator');
  assert.doesNotMatch(cardAttributes(bmi, 'heightCm'), /\shidden(?:\s|>)/u);
  assert.doesNotMatch(cardAttributes(bmi, 'weightKg'), /\shidden(?:\s|>)/u);
  assert.match(cardAttributes(bmi, 'heightFt'), /\shidden(?:\s|>)/u);

  const statistics = opportunityToolMarkup('statistical-test-calculator');
  assert.doesNotMatch(cardAttributes(statistics, 'sample'), /\shidden(?:\s|>)/u);
  assert.doesNotMatch(cardAttributes(statistics, 'mu0'), /\shidden(?:\s|>)/u);
  assert.match(cardAttributes(statistics, 'observed'), /\shidden(?:\s|>)/u);
});

test('citation webpage URL is rendered as a URL input, not a numeric field', () => {
  const markup = opportunityToolMarkup('citation-generator');
  assert.match(markup, /id="op-citation-generator-url" type="url" data-op-field="url"/u);
});

test('business card creates a printable card preview instead of a generic calculation result', () => {
  const markup = opportunityToolMarkup('business-card-maker');
  assert.match(markup, /data-op-calculate[^>]*>Create document</u);
  assert.match(markup, /id="op-output"[^>]*readonly/u);
  assert.match(markup, /data-op-print/u);
  assert.doesNotMatch(markup, /<output class="calculation-result" id="op-output"/u);
});

test('noise-generator volume is a bounded slider that can be adjusted during playback', () => {
  const markup = opportunityToolMarkup('noise-generator');
  assert.match(markup, /id="op-noise-generator-volume" type="range" min="1" max="50"[^>]*data-op-field="volume"/u);
  assert.match(markup, /data-device-start/u);
  assert.match(markup, /data-device-stop/u);
  assert.doesNotMatch(markup, /data-op-calculate|data-op-clear|Copy result/u);
});

test('BPM detector exposes local file analysis, explicit device limits, tap tempo and estimate caveat', () => {
  const markup = opportunityToolMarkup('bpm-detector');
  assert.match(markup, /type="file" accept="audio\/\*,\.mp3,\.wav,\.m4a,\.aac,\.ogg,\.flac,\.opus" data-bpm-file/u);
  assert.match(markup, /50 MB and 3 minutes/u);
  assert.match(markup, /data-bpm-analyze disabled/u);
  assert.match(markup, /data-bpm-tap/u);
  assert.match(markup, /data-bpm-clear-taps disabled/u);
  assert.match(markup, /may be half or double/u);
});

test('teleprompter preview has a bounded scroll viewport and preserves script line breaks', async () => {
  const markup = opportunityToolMarkup('teleprompter-online');
  const styles = await readFile(new URL('./styles.css', import.meta.url), 'utf8');
  assert.match(markup, /class="op-teleprompter__viewport"[^>]*data-teleprompter-viewport/u);
  assert.match(styles, /\.op-teleprompter__viewport\s*\{[^}]*height:\s*min\(55vh,\s*34rem\)[^}]*overflow-y:\s*auto/su);
  assert.match(styles, /\[data-teleprompter-output\]\s*\{[^}]*white-space:\s*pre-wrap/su);
});

test('study planner exposes editable subjects, exam dates, workload, local save and export without a generic calculator action', () => {
  const markup = opportunityToolMarkup('study-planner');
  for (const control of ['data-study-course', 'data-study-field="name"', 'data-study-field="examDate"', 'data-study-field="minutesPerDay"', 'data-study-field="tasks"', 'data-study-add', 'data-study-create', 'data-study-save', 'data-study-load', 'data-study-download', 'data-study-clear', 'data-study-schedule']) assert.ok(markup.includes(control), control);
  assert.doesNotMatch(markup, /data-op-calculate|data-op-clear/u);
});

test('diagram maker exposes accessible local step editing and SVG export', () => {
  const markup = opportunityToolMarkup('diagram-maker', 'es', { ...opportunityLocaleData.es.ui, ...interactionControlLocales.es });
  for (const control of ['data-op-field="steps"', 'data-diagram-add', 'data-diagram-create', 'data-diagram-clear', 'data-diagram-steps', 'data-op-svg', 'data-op-download', 'data-op-copy']) assert.ok(markup.includes(control), control);
  assert.match(markup, /aria-label="Pasos del diagrama"/u);
  assert.match(markup, />Añadir paso</u);
  assert.match(markup, />Crear diagrama</u);
  assert.match(markup, />Descargar diagrama en SVG</u);
  assert.match(markup, /data-diagram-invalid="Usa de 2 a 12 pasos, máximo 48 caracteres cada uno\."/u);
  assert.match(markup, /data-diagram-title="Pasos del diagrama"/u);
  assert.doesNotMatch(markup, /data-op-calculate/u);
});

test('noise generator exposes a localized optional timer capped at twelve hours', () => {
  const markup = opportunityToolMarkup('noise-generator', 'es', opportunityLocaleData.es.ui);
  assert.match(markup, /data-op-field="stop-after"/u);
  assert.match(markup, /Apagado automático \(minutos; 0 = desactivado\)/u);
  assert.match(markup, /max="720"/u);
  assert.match(markup, /value="0"/u);
});

test('mental math practice exposes a bounded round and accessible answer states', () => {
  const markup = opportunityToolMarkup('mental-math-practice');
  for (const control of ['data-mental-start', 'data-mental-round', 'data-mental-question', 'data-mental-answer', 'data-mental-check', 'data-mental-next', 'aria-live="polite"']) assert.ok(markup.includes(control), control);
  assert.doesNotMatch(markup, /data-op-calculate|data-op-clear/u);
});

test('flashcards expose interactive study controls and explicit local save/load/delete actions', () => {
  const markup = opportunityToolMarkup('flashcard-maker');
  for (const control of ['data-flashcard-study', 'data-flashcard-show', 'data-flashcard-known', 'data-flashcard-again', 'data-flashcard-shuffle', 'data-flashcard-save', 'data-flashcard-load', 'data-flashcard-delete']) assert.ok(markup.includes(control), control);
  assert.match(markup, /Save deck on this device/u);
  assert.match(markup, /Load saved deck/u);
  assert.match(markup, /Delete saved deck/u);
});

test('flashcard help copy matches local save behavior in every published locale', () => {
  const tool = opportunityTools.find(({ id }) => id === 'flashcard-maker');
  for (const language of Object.keys(locales)) {
    const body = localizedTool(tool, language).body;
    assert.equal(body, longtailBodies['flashcard-maker'][language], `${language} has its localized local-save explanation`);
  }
});

test('tournament bracket exposes local participant input, shuffle and accessible match updates', () => {
  const markup = opportunityToolMarkup('tournament-bracket-generator');
  for (const control of ['data-bracket-entrants', 'data-bracket-shuffle', 'data-bracket-generate', 'data-bracket-clear', 'data-bracket-rounds', 'aria-live="polite"']) assert.ok(markup.includes(control), control);
  assert.doesNotMatch(markup, /data-op-calculate|data-op-clear/u);
});

test('chess clock exposes bounded time controls, two player clocks and pause/reset actions', () => {
  const markup = opportunityToolMarkup('chess-clock');
  for (const control of ['data-chess-settings', 'data-chess-minutes', 'data-chess-increment', 'data-chess-start', 'data-chess-pause', 'data-chess-reset', 'data-chess-player="white"', 'data-chess-player="black"', 'data-chess-time="white"', 'data-chess-time="black"', 'aria-live="polite"']) assert.ok(markup.includes(control), control);
  assert.doesNotMatch(markup, /data-op-calculate|data-op-clear/u);
});

test('ear training exposes localized direction, audio replay, answer choices and round progression', () => {
  const markup = opportunityToolMarkup('ear-training');
  for (const control of ['data-ear-direction', 'data-ear-count', 'data-ear-start', 'data-ear-play', 'data-ear-answers', 'data-ear-answer="minor-second"', 'data-ear-answer="octave"', 'data-ear-next', 'data-ear-summary', 'aria-live="polite"']) assert.ok(markup.includes(control), control);
  assert.doesNotMatch(markup, /data-op-calculate|data-op-clear/u);
});

test('study planner uses native writing systems for its localized pages', () => {
  const scripts = {
    ar: /\p{Script=Arabic}/u,
    bn: /\p{Script=Bengali}/u,
    hi: /\p{Script=Devanagari}/u,
    ja: /\p{Script=Han}/u,
    ko: /\p{Script=Hangul}/u,
    ru: /\p{Script=Cyrillic}/u,
    zh: /\p{Script=Han}/u,
  };
  for (const [language, script] of Object.entries(scripts)) {
    assert.match(opportunityLocaleData[language].copy['study-planner'][0], script, language);
  }
  assert.match(opportunityLocaleData.ha.copy['mental-math-practice'][0], /\p{Script=Latin}/u);
  assert.notEqual(opportunityLocaleData.ha.copy['mental-math-practice'][0], 'Mental Math Practice');
  assert.match(opportunityLocaleData.ar.ui['Start practice'], /\p{Script=Arabic}/u);
  assert.match(opportunityLocaleData.hi.ui['Start practice'], /\p{Script=Devanagari}/u);
  assert.match(opportunityLocaleData.zh.ui['Start practice'], /\p{Script=Han}/u);
  assert.match(opportunityLocaleData.ar.copy['ear-training'][0], /\p{Script=Arabic}/u);
  assert.match(opportunityLocaleData.zh.ui['Play interval'], /\p{Script=Han}/u);
  for (const [language, script] of Object.entries({ ar: /\p{Script=Arabic}/u, hi: /\p{Script=Devanagari}/u, ja: /(?:\p{Script=Han}|\p{Script=Katakana})/u, ru: /\p{Script=Cyrillic}/u, zh: /\p{Script=Han}/u, zh_tw: /\p{Script=Han}/u })) {
    assert.match(opportunityLocaleData[language].copy['chess-clock'][0], script, `chess clock ${language}`);
    assert.match(opportunityLocaleData[language].ui['Start clock'], script, `clock controls ${language}`);
  }
});

test('household budget exposes an explicit local-only monthly ledger, accessible summaries, and export controls', () => {
  const markup = opportunityToolMarkup('household-budget-planner');
  for (const control of ['data-budget-month', 'data-budget-currency', 'data-budget-date', 'data-budget-type', 'data-budget-amount', 'data-budget-category', 'data-budget-add', 'data-budget-income', 'data-budget-expenses', 'data-budget-balance', 'data-budget-rows', 'data-budget-save', 'data-budget-load', 'data-budget-clear', 'data-budget-csv', 'data-budget-reset', 'id="op-status" data-budget-status', 'aria-live="polite"']) assert.ok(markup.includes(control), control);
  assert.match(markup, /Nothing is uploaded/u);
  assert.match(markup, /does not connect to banks/u);
  assert.match(markup, /type="text" inputmode="decimal"[^>]*data-budget-amount/u);
  assert.doesNotMatch(markup, /data-op-calculate|data-op-clear/u);
});

test('reading speed test exposes a localized local-only flow with bounded input and accessible result controls', () => {
  const markup = opportunityToolMarkup('reading-speed-test', 'ar');
  for (const control of ['data-reading-speed', 'data-reading-text', 'maxlength="50000"', 'data-reading-sample-button', 'data-reading-count', 'data-reading-start', 'data-reading-pause', 'data-reading-resume', 'data-reading-finish', 'data-reading-reset', 'data-reading-status', 'data-reading-result', 'data-reading-rating']) assert.ok(markup.includes(control), control);
  assert.match(markup, /data-reading-messages="/u);
  assert.match(markup, /يبقى النص المقروء في هذا المتصفح/u);
  assert.match(markup, /استخدم النص النموذجي/u);
  assert.match(markup, /لا يقيس الفهم بشكل موضوعي/u);
  assert.doesNotMatch(markup, /data-op-calculate|data-op-clear|Fetch|XMLHttpRequest/u);
});

test('screen ruler offers bounded pixel controls and clearly labels optional physical calibration', () => {
  const markup = opportunityToolMarkup('screen-ruler');
  for (const control of ['data-ruler-start', 'data-ruler-end', 'data-ruler-start-marker', 'data-ruler-end-marker', 'data-ruler-calibration-px', 'data-ruler-calibration-mm', 'data-ruler-clear-calibration', 'data-ruler-output', 'aria-live="polite"']) assert.ok(markup.includes(control), control);
  assert.match(markup, /type="range" min="0" max="500"/u);
  assert.match(markup, /Physical units are estimates/u);
  assert.doesNotMatch(markup, /data-op-calculate|fetch\(|XMLHttpRequest/u);
});

test('protractor exposes two bounded adjustable rays and an accessible angle result', () => {
  const markup = opportunityToolMarkup('protractor', 'ar');
  for (const control of ['data-protractor-angle="0"', 'data-protractor-angle="1"', 'data-protractor-ray="0"', 'data-protractor-ray="1"', 'data-protractor-handle="0"', 'data-protractor-handle="1"', 'data-protractor-reset', 'data-protractor-output', 'role="group"', 'role="slider"', 'aria-valuemin="0"', 'aria-valuemax="180"', 'aria-live="polite"']) assert.ok(markup.includes(control), control);
  assert.match(markup, /data-planner-messages="/u);
  assert.doesNotMatch(markup, /data-op-calculate|fetch\(|XMLHttpRequest/u);
});

test('print studio pages expose localized input, vector preview, download and print actions', () => {
  for (const id of ['printable-label-maker', 'poster-maker', 'certificate-maker', 'invitation-maker']) {
    const markup = opportunityToolMarkup(id, 'ar');
    assert.match(markup, /data-print-studio=/u, id);
    assert.match(markup, /data-print-preview/u, id);
    assert.match(markup, /data-print-download/u, id);
    assert.match(markup, /data-print-print/u, id);
    assert.match(markup, /data-planner-messages=/u, id);
    assert.doesNotMatch(markup, /fetch\(|XMLHttpRequest/u, id);
  }
  assert.match(opportunityToolMarkup('printable-label-maker'), /One label per line/u);
  assert.match(opportunityToolMarkup('certificate-maker'), /Recipient name/u);
  assert.match(opportunityToolMarkup('invitation-maker'), /RSVP details/u);
});

test('audio analysis pages are local, lazy-runtime-friendly and expose bounded file controls', () => {
  for (const id of ['song-key-finder', 'audio-spectrogram']) {
    const markup = opportunityToolMarkup(id, 'ar');
    assert.match(markup, /type="file" accept="audio\//u, id);
    assert.match(markup, /data-audio-analyze disabled/u, id);
    assert.match(markup, /data-audio-clear/u, id);
    assert.match(markup, /data-planner-messages=/u, id);
    assert.doesNotMatch(markup, /fetch\(|XMLHttpRequest/u, id);
  }
  assert.match(opportunityToolMarkup('song-key-finder'), /data-audio-key/u);
  assert.match(opportunityToolMarkup('audio-spectrogram'), /data-audio-chart/u);
});

test('color vision simulator exposes accessible local image controls and translated runtime messages', () => {
  const markup = opportunityToolMarkup('color-vision-simulator', 'ar');
  for (const control of ['data-color-vision', 'type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"', 'data-color-vision-mode', 'data-color-vision-sample', 'data-color-vision-clear', 'data-color-vision-original', 'data-color-vision-result', 'data-planner-messages']) assert.ok(markup.includes(control), control);
  assert.match(markup, /محاكاة بصرية تقريبية/u);
  assert.match(markup, /مسح الصورة/u);
  assert.doesNotMatch(markup, /محاكاة Deuteranopia/u);
  assert.match(markup, /4 ميجابكسل/u);
  assert.doesNotMatch(markup, /fetch\(|XMLHttpRequest|data-op-calculate/u);
});

test('local web authoring tools expose their complete browser-only controls in all 36 locales', () => {
  const expected = {
    'svg-editor': ['data-web-authoring="svg"', 'data-svg-add', 'data-svg-clear', 'data-svg-download', 'data-svg-output'],
    'seamless-pattern-maker': ['data-web-authoring="pattern"', 'data-pattern-motif', 'data-pattern-preview', 'data-pattern-download'],
    'html-form-builder': ['data-web-authoring="form"', 'data-form-fields', 'data-form-build', 'data-form-preview', 'data-form-download'],
    'html-email-builder': ['data-web-authoring="email"', 'data-email-url', 'data-email-build', 'sandbox=""', 'data-email-download'],
  };
  for (const language of Object.keys(locales)) for (const [id, controls] of Object.entries(expected)) {
    const markup = opportunityToolMarkup(id, language);
    for (const control of controls) assert.ok(markup.includes(control), `${language}/${id}: ${control}`);
    assert.doesNotMatch(markup, /fetch\(|XMLHttpRequest/u, `${language}/${id} must not upload data`);
  }
});

test('fretboard trainer exposes accessible note choices and localized runtime messages', () => {
  const markup = opportunityToolMarkup('fretboard-trainer', 'es', opportunityLocaleData.es.ui);
  assert.match(markup, /data-fretboard-trainer/u);
  assert.match(markup, /data-planner-messages=/u);
  assert.match(markup, /data-fretboard-prompt aria-live="polite"/u);
  assert.match(markup, /data-fretboard-status role="status" aria-live="polite"/u);
  assert.match(markup, /data-fretboard-note="C♯"/u);
  assert.match(markup, /data-fretboard-next disabled/u);
  assert.match(markup, /data-fretboard-reset/u);
  assert.doesNotMatch(markup, /data-op-calculate|fetch\(|XMLHttpRequest/u);
});

test('fretboard trainer stays available with direction-aware pages and 36-language localized copy', async () => {
  const tool = opportunityTools.find(({ id }) => id === 'fretboard-trainer');
  assert.ok(tool);
  const phrases = [
    'The board uses standard E–A–D–G–B–E tuning and frets 0–12.',
    'Which note is on string {string}, fret {fret}?',
    'Choose a note.',
    'Correct: {correct} · streak: {streak}',
    'Correct! The note is {note}.',
    'Not quite. Try another note.',
    'Next note',
    'Reset score',
  ];
  for (const language of Object.keys(locales)) {
    const localized = localizedTool(tool, language);
    assert.ok(localized.title && localized.description && localized.intro, `localized metadata ${language}`);
    for (const phrase of phrases) {
      const translated = generatedOpportunityCopy[language]?.ui?.[phrase];
      assert.ok(translated, `Missing fretboard phrase ${phrase} in ${language}`);
      if (language !== 'en') assert.notEqual(translated, phrase, `Untranslated fretboard phrase in ${language}: ${phrase}`);
      const tokens = (value) => [...value.matchAll(/\{([^}]+)\}/gu)].map(([, token]) => token).sort();
      assert.deepEqual(tokens(translated), tokens(phrase), `Placeholder mismatch for ${phrase} in ${language}`);
    }
  }
  const template = await readFile(new URL('./template.mjs', import.meta.url), 'utf8');
  assert.match(template, /fretboard-trainer\.css/u);
});

test('metronome rhythm practice is accessible, bounded and localized in every published language', () => {
  const phrases = [
    'Rhythm practice', 'Tap in time', 'Listen to one bar, then tap each beat 16 times.',
    'Rhythm practice started. Listen to the count-in.',
    'Practice complete: {accuracy}% on time; average error {offset} ms.',
    'Practice stopped after {count} of 16 taps.', 'Tap after starting rhythm practice.',
    'Rhythm practice stopped.', 'Wait for the count-in to finish.',
  ];
  const markup = opportunityToolMarkup('online-metronome', 'es', opportunityLocaleData.es.ui);
  for (const control of ['data-op-practice-start', 'data-op-practice-tap disabled', 'data-rhythm-practice-status role="status" aria-live="polite"']) assert.ok(markup.includes(control), control);
  assert.ok(markup.includes('data-planner-messages=') && markup.includes('Rhythm practice stopped.'), 'runtime receives localized message dictionary');
  for (const language of Object.keys(locales)) for (const phrase of phrases) {
    const translated = generatedOpportunityCopy[language]?.ui?.[phrase];
    assert.ok(translated, `${language} is missing ${phrase}`);
    if (language !== 'en') assert.notEqual(translated, phrase, `${language} falls back to English: ${phrase}`);
    const placeholders = (value) => [...value.matchAll(/\{([^}]+)\}/gu)].map(([, token]) => token).sort();
    assert.deepEqual(placeholders(translated), placeholders(phrase), `${language} placeholder mismatch: ${phrase}`);
  }
});

test('Battleship has localized local-play controls and runtime messages in all 36 locales', () => {
  const phrases = [
    'Your fleet stays on this device. The computer randomly picks a square to shoot at.', 'Your fleet', 'Enemy fleet', 'New game',
    'Row {row}, column {column}: {state}', 'Ship', 'Ship hit', 'No ship here', 'No shot yet',
    'Computer hit your ship at row {row}, column {column}.', 'Computer missed at row {row}, column {column}.',
    'You hit a ship.', 'You missed.', 'You sank a ship!', 'You win!', 'The computer sank your fleet.',
    'Choose an untried square on the enemy board to fire.', 'Choose a square to fire.', 'Computer turn…',
    'Game over. Start a new game to play again.', 'A new fleet was placed randomly.', 'Enemy board', 'Your board',
    'Line up your guess with the row and column.',
  ];
  const tool = opportunityTools.find((item) => item.id === 'battleship');
  assert.ok(tool);
  for (const language of Object.keys(locales)) {
    const localized = localizedTool(tool, language);
    assert.ok(localized.title && localized.description && localized.intro, `localized copy ${language}`);
    for (const phrase of phrases) {
      const translated = generatedOpportunityCopy[language]?.ui?.[phrase];
      assert.ok(translated, `${language} is missing ${phrase}`);
      if (language !== 'en') assert.notEqual(translated, phrase, `${language} falls back to English: ${phrase}`);
      const placeholders = (value) => [...value.matchAll(/\{([^}]+)\}/gu)].map(([, token]) => token).sort();
      assert.deepEqual(placeholders(translated), placeholders(phrase), `${language} placeholder mismatch: ${phrase}`);
    }
  }
  const markup = opportunityToolMarkup('battleship', 'ar', opportunityLocaleData.ar.ui);
  for (const control of ['data-battleship-enemy', 'data-battleship-player', 'data-battleship-new', 'data-planner-messages']) assert.ok(markup.includes(control), control);
  assert.match(markup, /لوحة العدو|لوحة العدو/u);
});

test('audio editor exposes local-only editing controls and translated runtime copy in all locales', () => {
  const phrases = [
    'Edit audio locally in your browser. Your file is not uploaded.', 'Choose audio file', 'Trim start (seconds)',
    'Trim end (seconds)', 'Volume', 'Fade in (seconds)', 'Fade out (seconds)', 'Duration', 'Preview selection',
    'Stop playback', 'Export WAV', 'Download WAV', 'Clear audio', 'Choose a short audio file to begin.',
    'Choose an audio file under 25 MB.', 'Choose audio up to 3 minutes with one or two channels.',
    'This audio format could not be opened in this browser.', 'Audio loaded locally. Adjust the trim and export settings.',
    'Choose a valid trim range and audio file first.', 'Playing the edited selection.', 'Playback finished.',
    'Playback stopped.', 'Rendering WAV on this device…', 'WAV export is ready to download.',
    'Audio export failed. Try a shorter supported clip.', 'Choose valid volume, fades and trim values.',
    'WAV export exceeds the 128 MiB safety limit.', 'Audio editor controls', 'Audio cleared from this page.',
  ];
  for (const language of Object.keys(locales)) {
    const markup = opportunityToolMarkup('audio-editor', language, opportunityLocaleData[language]?.ui ?? {});
    for (const control of ['data-audio-editor', 'data-audio-edit-file', 'data-audio-edit-start', 'data-audio-edit-end', 'data-audio-edit-volume', 'data-audio-edit-fade-in', 'data-audio-edit-fade-out', 'data-audio-edit-play disabled', 'data-audio-edit-export disabled', 'data-audio-edit-stop', 'data-audio-edit-clear', 'data-audio-edit-download hidden', 'data-planner-messages=']) assert.ok(markup.includes(control), `${language}: ${control}`);
    assert.match(markup, /25 MB/u);
    assert.match(markup, /3 minutes/u);
    assert.doesNotMatch(markup, /fetch\(|XMLHttpRequest/u);
    for (const phrase of phrases) {
      const translated = generatedOpportunityCopy[language]?.ui?.[phrase];
      assert.ok(translated, `${language} missing ${phrase}`);
      if (language !== 'en' && !(['Volume'].includes(phrase) && ['pt', 'it', 'nl'].includes(language))) assert.notEqual(translated, phrase, `${language} untranslated: ${phrase}`);
    }
  }
});

test('periodic table exposes 118-element search, filters, comparison and quiz controls in every locale', () => {
  const phrases = ['Search by element name, symbol or atomic number', 'All families', 'Element details', 'Atomic number', 'Compare elements', 'Add to comparison', 'Remove from comparison', 'Start symbol quiz', 'What is the symbol for atomic number {number}?', 'Your answer', 'Check answer', 'No elements match these filters.', 'Family groups are simplified for learning; not a safety reference.'];
  for (const language of Object.keys(locales)) {
    const markup = opportunityToolMarkup('periodic-table', language, opportunityLocaleData[language]?.ui ?? {});
    for (const selector of ['data-periodic-table', 'data-periodic-search', 'data-periodic-family', 'data-periodic-group', 'data-periodic-grid', 'data-periodic-details', 'data-periodic-compare-clear', 'data-periodic-quiz-start', 'data-periodic-answer', 'data-periodic-check']) assert.ok(markup.includes(selector), `${language}: ${selector}`);
    assert.match(markup, /role="list" dir="ltr"/u);
    assert.doesNotMatch(markup, /fetch\(|XMLHttpRequest/u);
    for (const phrase of phrases) assert.ok(generatedOpportunityCopy[language]?.ui?.[phrase], `${language} missing ${phrase}`);
    for (const name of ['Hydrogen', 'Carbon', 'Iron', 'Gold', 'Oganesson']) assert.ok(generatedOpportunityCopy[language]?.ui?.[name], `${language} missing element name ${name}`);
  }
});

test('Mahjong Solitaire exposes randomized local play and rules in every locale', () => {
  const phrases = ['This is a compact single-layer Mahjong-style matching puzzle, not the traditional layered layout. A tile is free when at least one horizontal side is open. Every new board has a valid solution.', 'New puzzle', 'Moves', 'Choose two matching free tiles.', 'Puzzle complete!'];
  for (const language of Object.keys(locales)) {
    const markup = opportunityToolMarkup('mahjong-solitaire', language, opportunityLocaleData[language]?.ui ?? {});
    for (const selector of ['data-mahjong', 'data-mahjong-new', 'data-mahjong-moves', 'data-mahjong-board']) assert.ok(markup.includes(selector), `${language}: ${selector}`);
    assert.match(markup, /role="group"/u);
    assert.doesNotMatch(markup, /fetch\(|XMLHttpRequest/u);
    for (const phrase of phrases) assert.ok(generatedOpportunityCopy[language]?.ui?.[phrase], `${language} missing ${phrase}`);
  }
});

test('Go game exposes local two-player board controls and rule limitations in every locale', () => {
  const phrases = ['Two people share this device. The board, moves and score stay in this browser.', 'Pass turn', 'Go board', 'Black to play', 'White to play', 'That move is suicide and is not allowed.', 'The board uses simplified area scoring and does not include komi.'];
  for (const language of Object.keys(locales)) {
    const markup = opportunityToolMarkup('go-game', language, opportunityLocaleData[language]?.ui ?? {});
    for (const selector of ['data-go-game', 'data-go-board', 'data-go-pass', 'data-go-new', 'data-go-turn', 'data-go-captures']) assert.ok(markup.includes(selector), `${language}: ${selector}`);
    assert.match(markup, /role="group"/u);
    assert.doesNotMatch(markup, /fetch\(|XMLHttpRequest/u);
    for (const phrase of phrases) assert.ok(generatedOpportunityCopy[language]?.ui?.[phrase], `${language} missing ${phrase}`);
  }
});

test('room planner exposes measured dimensions, furniture controls and local SVG in every locale', () => {
  const phrases = ['Room dimensions and furniture stay on this device. This simple 2D layout is not construction software.', 'Room width', 'Room depth', 'Unit', 'Meters', 'Feet', 'Update room', 'Add furniture', 'Move selected item with arrow keys. Drag with a mouse or touch.', 'Rotate selected', 'Remove selected', 'Clear furniture', 'Download SVG floor plan', 'Room {width} × {depth} {unit}', 'Furniture cannot overlap another item.', 'Room width and depth must be from 2 to 30.', 'These dimensions would make furniture overlap.'];
  for (const language of Object.keys(locales)) {
    const markup = opportunityToolMarkup('room-planner', language, opportunityLocaleData[language]?.ui ?? {});
    for (const selector of ['data-room-planner', 'data-room-width', 'data-room-depth', 'data-room-unit', 'data-room-update', 'data-room-furniture', 'data-room-add', 'data-room-svg', 'data-room-size', 'data-room-rotate', 'data-room-remove', 'data-room-clear', 'data-room-download', 'data-room-items']) assert.ok(markup.includes(selector), `${language}: ${selector}`);
    assert.match(markup, /data-room-svg[^>]+dir="ltr"/u);
    assert.doesNotMatch(markup, /fetch\(|XMLHttpRequest/u);
    for (const phrase of phrases) assert.ok(generatedOpportunityCopy[language]?.ui?.[phrase], `${language} missing ${phrase}`);
  }
});
