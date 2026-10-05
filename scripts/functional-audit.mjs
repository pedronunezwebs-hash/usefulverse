import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools } from '../src/catalog.mjs';
import { opportunityTools } from '../src/opportunity-tools.mjs';
import { relatedToolIds } from '../src/template.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const app = await readFile(join(root, 'src/app.js'), 'utf8');
const modules = new Map();
const groups = [
  ['opportunityTools', 'src/opportunity-runtime.js'],
  ['toolSuiteTools', 'src/tool-suite-tools.js'],
  ['browserBatchTools', 'src/new-tools.js'],
  ['expandedTools', 'src/expanded-tools.js'],
  ['advancedTools', 'src/advanced-tools.js'],
  ['mediaTools', 'src/media-tools.js'],
  ['planTools', 'src/plan-tools.js'],
];
for (const [name, file] of groups) {
  const declaration = app.match(new RegExp(`const ${name} = new Set\\(\\[([\\s\\S]*?)\\]\\);`));
  for (const [, id] of declaration?.[1].matchAll(/'([^']+)'/gu) ?? []) modules.set(id, file);
}
modules.set('local-notepad', 'src/opportunity-runtime.js');
modules.set('teleprompter-online', 'src/opportunity-runtime.js');
modules.set('chess-clock', 'src/chess-clock-runtime.js');
modules.set('ear-training', 'src/ear-training-runtime.js');
modules.set('bpm-detector', 'src/bpm-detector-runtime.js');
modules.set('music-scale-finder', 'src/music-scale-runtime.js');
modules.set('seating-chart-maker', 'src/seating-chart-runtime.js');
modules.set('gantt-chart-maker', 'src/gantt-chart-runtime.js');
modules.set('sprite-sheet-maker', 'src/sprite-sheet-runtime.js');
const coreSetups = app.match(/const setups = \{([\s\S]*?)\n\s*\};/u)?.[1] ?? '';
for (const [, id] of coreSetups.matchAll(/'([^']+)'\s*:/gu)) modules.set(id, 'src/app.js');

const engines = new Map(opportunityTools.map(({ id, engine }) => [id, engine]));
const esc = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const rows = [[
  'id', 'english_url', 'module', 'engine', 'intent', 'announced_function', 'permissions_or_dependencies',
  'limits_to_verify', 'related_tools', 'functional_status', 'test_evidence',
]];
for (const tool of tools) {
  const engine = engines.get(tool.id) ?? '';
  const permissions = tool.id === 'household-budget-planner' ? 'Optional localStorage and browser CSV download; no bank connection'
    : ['seating-chart-maker', 'gantt-chart-maker'].includes(tool.id) ? 'Optional localStorage; browser download and print actions'
    : tool.id === 'sprite-sheet-maker' ? 'Local file picker, createImageBitmap, canvas export and browser downloads'
    : /camera|webcam|qr-code-reader/iu.test(tool.id) ? 'Camera permission, if used'
    : /voice-recorder|guitar-tuner/iu.test(tool.id) ? 'Microphone permission'
      : /screen-recorder/iu.test(tool.id) ? 'User-selected screen and optional audio permission'
        : /transcri|ocr|background-remover|video-compressor|audio-compressor/iu.test(tool.id) ? 'Large local model/codec; test lazy loading and device limits'
          : 'None declared; verify against implementation';
  const related = relatedToolIds[tool.id] ?? [];
  const verified = ['music-scale-finder', 'sprite-sheet-maker'].includes(tool.id);
  const corrected = ['online-timer', 'flashcard-maker', 'online-metronome', 'word-search-maker', 'crossword-maker', 'virtual-piano', 'voice-recorder', 'mental-math-practice', 'tournament-bracket-generator', 'chess-clock', 'ear-training', 'bpm-detector', 'seating-chart-maker', 'gantt-chart-maker', 'household-budget-planner', 'diagram-maker', 'noise-generator', 'teleprompter-online'].includes(tool.id);
  const status = verified ? 'verified' : corrected ? 'corrected' : 'pending';
  const evidenceByTool = {
    'online-timer': 'Unit/build checks pass. Isolated local Chrome smoke verified Pomodoro mode/settings, focus completion to short break, pause/resume without elapsed-time drift, completion of a second focus session to the configured long break, session/focus totals, localStorage persistence and the clear-data action. Mocked Web Audio confirmed three alert tones; mocked notification APIs covered granted, denied, unavailable and service-worker display paths. Time was advanced deterministically; actual audible output, OS notification delivery and real background-tab/device-sleep behavior remain unverified.',
    'flashcard-maker': 'Unit/build/localization pass. Isolated local Chrome created a three-card deck, revealed an answer, marked a known card, saved the remaining deck and known-card count, then loaded it after navigating from English to Spanish in the same isolated browser profile. Save/load/delete labels rendered in English, Spanish and Arabic RTL; malformed saved JSON showed a localized validation message, and delete removed the localStorage entry. Real browser storage denial/quota limits and all device/browser combinations remain unverified.',
    'voice-recorder': 'Cloudflare Pages local runtime returned microphone=(self) on this route while non-recorder pages did not. Isolated Chrome used a mocked MediaRecorder/stream to verify start, pause/resume, valid WebM download bytes, success status, and release of the audio track after stop; a mocked NotAllowedError restored the controls and showed a clear denial message. A real-device microphone grant and browser-specific codec support remain unverified.',
    'online-metronome': 'Unit/build pass. Isolated local Chrome started and stopped the metronome through its controls; an out-of-range 500 BPM value was rejected with a clear 20–300 BPM message. A delayed mock AudioContext confirmed Stop cancels pending audio activation without creating a late oscillator; a successful mocked start schedules a beat and Stop releases the context. Unit tests confirm overdue beats are skipped after throttling without losing the bar phase. Actual audible beat quality and timing on physical devices/background tabs remain device-dependent and were not fully verified.',
    'word-search-maker': 'Unit/build/localization pass. Isolated local Chrome generated seeded puzzles containing Arabic, Devanagari and Latin words; each answer remained intact in the grid/answer key and status reported success. Browser font shaping, printing and all supported scripts are not exhaustively tested.',
    'crossword-maker': 'Unit/build/localization pass. Isolated local Chrome generated connected crossword grids with two intersecting answers in Arabic, Devanagari and Latin; each answer and clue appeared in the result. Inputs with no shared letter correctly returned a clear non-success status. Browser font shaping and printing are not exhaustively tested.',
    'virtual-piano': 'Unit/build pass. Isolated local Chrome with a deliberately delayed AudioContext verified that a pointer released before audio activation completes does not start a late note; a held note starts once, pointer release stops it and clears the pressed state, and window blur also stops an active note. The test used a fake AudioContext to avoid audio playback; physical audio output, touch hardware and browser-specific behavior remain unverified.',
    'mental-math-practice': 'Unit/build/localization pass; live browser smoke in English and Arabic confirmed generated arithmetic, correct and incorrect feedback, score/streak updates and zero server processing.',
    'tournament-bracket-generator': 'Unit/build/localization pass; live browser smoke in English confirmed a three-person draw, automatic bye, winner progression and champion; Arabic copy rendered correctly.',
    'chess-clock': 'Unit/build/localization pass; live English smoke confirmed configurable time, start, turn switching, pause and reset; deterministic tests cover increment and flagging.',
    'ear-training': 'Unit/build/localization pass; live browser smoke confirmed generated two-note playback, interval answer feedback, score/streak and round completion; audio depends on browser Web Audio support.',
    'bpm-detector': 'Logic tests cover 120 BPM, silence, invalid settings, onset extraction and tap tempo; browser smoke still required with representative audio formats and device memory limits.',
    'music-scale-finder': 'Logic tests cover eight scale patterns and supported roots; local browser smoke verified C major note/interval output, scale selection, synthesized playback, stop control, and Arabic RTL labels. Other browsers/devices not individually tested.',
    'seating-chart-maker': 'Logic/build/localization checks pass. English browser smoke used Unicode names and confirmed a balanced 5-guest plan across 2 tables, capacity-safe manual movement, save, reload and restore from localStorage. The test plan was deleted after the browser confirmation; the final deletion toast could not be re-read. Download and print actions remain untested.',
    'gantt-chart-maker': 'Unit tests cover Unicode tasks, dates, inclusive bar positions, CSV quoting, dependency ordering/overlap, task/name limits and project horizon. English browser smoke verified a four-task chart with chained dependencies, local save/restore/delete, and related links. Arabic RTL browser smoke verified Unicode task names. Data remained local.',
    'household-budget-planner': 'Unit/build/localization pass. English isolated-browser smoke verified adding a $1,250.50 transaction and recalculated totals, saving locally, clearing the in-page draft, restoring the saved month, then deleting the saved entry. A missing live status-message target was corrected and verified. CSV download and invalid-input paths still need browser acceptance.',
    'diagram-maker': 'Unit/build/localization pass. Isolated local Chrome verified adding, reordering and removing steps; the 12-step cap, localized invalid-input message and clear action; valid SVG Blob download; XML escaping of angle brackets and ampersands; and Arabic RTL controls, placeholders, SVG title, and validation message. Console had no errors. Other browsers, assistive technologies and physical-device SVG rendering are not exhaustively tested.',
    'noise-generator': 'Unit/build/localization pass. Seeded samples for white, pink and brown noise are deterministic, bounded and within a usable RMS range; invalid colors and lengths are rejected. Isolated Chrome with mocked Web Audio verified start, live volume adjustment, a one-minute auto-stop, status and control reset, AudioContext close, and no model/WASM downloads. Arabic RTL renders the localized timer label. Real speakers/headphones, physical audio levels and background-tab timing remain unverified.',
    'teleprompter-online': 'Unit/build/localization pass. Word counting handles whitespace-delimited text and counts Han, Hiragana, Katakana and Hangul characters as reading units. Isolated local Chrome verified scroll timing derived from the selected words-per-minute rate, pause/resume without rewinding, restoring the saved position for the same script, discarding stale position for a changed script, automatic stop at the end, reset, and Space/Escape shortcuts. The page console had no errors. Speech-rate accuracy can still vary with text layout, device performance and frame throttling; physical recording workflows and other browsers were not exhaustively tested.',
    'bpm-detector': 'Unit/build checks pass. Isolated local Chrome analyzed a generated 12-second WAV click track at 120 BPM and returned 120; four manual taps returned 119 BPM and Clear reset the result. A >50 MB guard was tested with a mocked file without allocating a large blob. A generated 181-second WAV was rejected from local media metadata before AudioContext.decodeAudioData (verified with a decode-call spy), avoiding an unnecessary full decode; audio URLs were revoked. Console had no errors. Other codecs/devices and real musical recordings remain unverified, and tempo estimates may return half/double-time alternatives.',
    'sprite-sheet-maker': 'Unit tests cover layout, image fitting, Unicode metadata, invalid inputs and canvas-safe bounds. Browser smoke used a locally generated 2×2 PNG: selection, frame dimensions, sheet rendering, CSS coordinates, and actual PNG/JSON blob contents were verified. Spanish metadata/UI and Arabic RTL rendering were checked; browser console had no errors or warnings. Other browsers and large-file/device limits were not exhaustively tested.',
  };
  const evidence = evidenceByTool[tool.id] ?? '';
  rows.push([
    tool.id, `https://usefulverse.com/tools/${tool.id}/`, modules.get(tool.id) ?? 'src/app.js (inline/core)', engine,
    tool.keywords ?? '', `${tool.title}: ${tool.description}`, permissions,
    'Check empty, invalid, boundary, repeat, output integrity, cancel/cleanup where applicable', related.join(' | '), status, evidence,
  ]);
}
if (rows.length !== tools.length + 1) throw new Error(`Audit row count does not match the ${tools.length}-tool catalog.`);
const csv = rows.map((row) => row.map(esc).join(',')).join('\n') + '\n';
const docs = join(root, 'docs');
await mkdir(docs, { recursive: true });
await writeFile(join(docs, 'functional-audit.csv'), csv);
console.log(`Generated an honest functional audit template for ${tools.length} tools; ${rows.slice(1).filter((row) => row[9] === 'pending').length} still need evidence.`);
