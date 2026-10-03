import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { opportunityTools } from '../../src/opportunity-tools.mjs';
import { locales } from '../../src/locales.mjs';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR;
if (!directory) throw new Error('Set USEFULVERSE_TRANSLATION_DIR to an isolated temporary directory.');
const selectedIds = process.env.USEFULVERSE_TRANSLATION_TOOL_IDS?.split(',').filter(Boolean);
const selectedTools = selectedIds ? opportunityTools.filter((tool) => selectedIds.includes(tool.id)) : opportunityTools;
if (selectedIds && selectedTools.length !== new Set(selectedIds).size) throw new Error('One or more requested opportunity tool IDs are unknown.');
const ui = new Set([
  'Keyboard test area', 'Click here, then press a key. Keys received by the browser light up below.', 'No key has been detected yet.',
  'Mouse test pad', 'Move and click inside this area. Right-click is allowed for testing.', 'Left button', 'Middle button', 'Right button',
  'Last button:', '· Clicks per second:', '· Wheel:', 'Events are measured only while you use this page.',
  'Start a round. Wait until the panel turns green, then click once.', 'Start test', 'Five valid rounds are used for the median.',
  'Wait until the panel turns green, then click.', 'Wait…', 'Click now!', 'Too soon — wait for green, then start again.',
  'False start. No result was counted.', 'Try again', 'Median of five rounds', 'Test complete. The result stays on this device.',
  'Metronome stopped.', 'Metronome is playing. Audio stays in this browser.', 'Enter a tempo from 20 to 300 BPM.',
  'Audio could not start. Check your browser audio settings.', 'Tap again to measure the tempo.', 'Round 1 of 5.',
  'Round {n} of 5.', 'Mouse event detected.', 'Key received: {key}', 'Up', 'Down', 'Tempo: {bpm} BPM.',
  'There is nothing to copy yet.', 'Copied to your clipboard.', 'Copy was blocked. Select the result and copy it manually.',
  'Create the document preview first.', 'Allow this click to open a print preview, then try again.', 'Print preview',
  'Result ready. This calculation runs locally in your browser.', 'Fields cleared.', 'Check your inputs and try again.',
  'Values are processed locally in this browser.', 'Use one item per line: description, quantity, unit price.',
  'Preview', 'Copy text', 'Print or save as PDF', 'Create document', 'Translate', 'Text to Morse', 'Morse to text',
  'Use spaces between Morse letters and / between words when decoding.', 'Calculate', 'Clear', 'Copy result', 'Result',
  'Values stay in this browser.', 'Direction', 'Text or Morse code', 'Rounding rule', 'Half up', 'Half to even',
  'Precision', 'Decimal places', 'Significant figures', 'Price type', 'Add tax to net price', 'Tax is included in price',
  'Package A', 'Package B', 'Shared unit', 'Coverage per bag (ft³, optional)', 'Waste allowance (%)',
  'Rate commission', 'Fixed fee', 'Monthly payment', 'Annual interest rate (%)', 'Balance', 'Seller or business',
  'Customer (optional)', 'Items · one per line: description, quantity, unit price', 'Tax (%)', 'Currency code',
  'Provider or business', 'Customer', 'Valid until', 'BPM', 'Beats per bar', 'Tap tempo', 'Stop',
  'Find in note', 'Your note', 'Save this note in this browser', 'Save locally', 'Load saved note', 'Download .txt', 'Delete saved note',
  'Notes are not saved unless you choose Save locally.', 'Enter text to search this note.', 'Check the save option first. Your note is not stored otherwise.',
  'Note saved in this browser profile only.', 'Browser storage is unavailable or full. Download a copy instead.', 'No saved note was found in this browser.',
  'Saved note loaded on this device.', 'Browser storage is unavailable.', 'Saved note deleted from this browser.', 'Text file prepared by your browser.',
  'Your script', 'Scroll speed (words per minute)', 'Text size', 'Mirror text', 'Start scrolling', 'Pause scrolling',
  'Reset', 'Scrolling script preview', 'Your script will appear here.', 'Scrolling stops when you leave this page.',
  'Paste or type a script first.', 'Scrolling paused.', 'Teleprompter is scrolling in this browser.', 'Script position reset.',
].filter((phrase) => !selectedIds || ['Calculate', 'Clear', 'Copy result', 'Result', 'Choose a file', 'Choose image', 'Choose photo', 'Download', 'Run', 'Preview', 'Start', 'Stop', 'Play left', 'Play right'].includes(phrase)));
for (const tool of selectedTools) {
  for (const field of tool.fields) {
    ui.add(field.label);
    for (const [, label] of field.options ?? []) ui.add(label);
  }
}
let previousUnits = {};
try {
  const previous = JSON.parse(await readFile(directory + '/draft-input.json', 'utf8'));
  previousUnits = Object.values(previous.targets ?? {})[0]?.units ?? {};
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const oldIds = new Map(Object.entries(previousUnits).map(([id, phrase]) => [phrase, id]));
let nextUiId = Object.keys(previousUnits).filter((id) => id.startsWith('ui.')).map((id) => Number(id.slice(3))).reduce((max, value) => Math.max(max, value), -1) + 1;
const units = Object.fromEntries([...ui].map((phrase) => {
  const id = oldIds.get(phrase) ?? 'ui.' + String(nextUiId++).padStart(4, '0');
  return [id, phrase];
}));
for (const tool of selectedTools) {
  for (const key of ['title', 'shortTitle', 'description', 'keywords', 'intro', 'body']) units['tool.' + tool.id + '.' + key] = tool[key];
}
const targets = {};
const googleLanguage = { pt: 'pt', zh_tw: 'zh-TW', tl: 'fil' };
for (const [key, locale] of Object.entries(locales)) {
  if (key === 'en') continue;
  const code = googleLanguage[key] ?? locale.code.split('-')[0];
  targets[key] = { googleLanguage: code, units };
}
await mkdir(directory, { recursive: true });
await writeFile(directory + '/draft-input.json', JSON.stringify({ targets }));
console.log('Prepared static translation draft for ' + Object.keys(targets).length + ' locales, ' + selectedTools.length + ' tools, and ' + Object.keys(units).length + ' UI strings.');
