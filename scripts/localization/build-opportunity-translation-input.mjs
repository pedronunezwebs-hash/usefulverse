import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { opportunityTools } from '../../src/opportunity-tools.mjs';
import { locales } from '../../src/locales.mjs';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR;
if (!directory) throw new Error('Set USEFULVERSE_TRANSLATION_DIR to an isolated temporary directory.');
const selectedIds = process.env.USEFULVERSE_TRANSLATION_TOOL_IDS?.split(',').filter(Boolean);
const selectedTools = selectedIds ? opportunityTools.filter((tool) => selectedIds.includes(tool.id)) : opportunityTools;
if (selectedIds && selectedTools.length !== new Set(selectedIds).size) throw new Error('One or more requested opportunity tool IDs are unknown.');
const ganttPhrases = ['Your project data stays in this browser. Nothing is uploaded.', 'One task per line: task name | start date (YYYY-MM-DD) | duration in days | earlier task number (optional).', 'Project tasks', 'Create Gantt chart', 'Insert example', 'Save plan on this device', 'Load saved plan', 'Delete saved plan', 'Download CSV', 'Print chart', 'Your project timeline will appear here.', 'Project timeline', '{count} tasks', '{count} days', 'Depends on {task}', 'Gantt chart created in this browser.', 'Enter dates as YYYY-MM-DD.', 'Enter a valid calendar date.', 'Add at least one task.', 'Use no more than 120 tasks.', 'Every task needs a name.', 'Task names must be 100 characters or fewer.', 'Task duration must be a whole number from 1 to 365 days.', 'A task can depend only on an earlier task.', 'The whole plan must fit within 1095 calendar days.', 'A dependent task cannot start before its earlier task finishes.', 'Create a valid project plan first.', 'Plan saved on this device.', 'No saved plan was found on this device.', 'Saved plan loaded.', 'Could not load the saved plan in this browser.', 'Delete the saved plan from this device?', 'Saved plan deleted from this device.', 'Could not delete the saved plan in this browser.', 'Create a Gantt chart before downloading it.', 'CSV download started.', 'Create a Gantt chart before printing it.', 'Check the task lines and dates, then try again.', 'Research', 'Design', 'Build', 'Review'];
const spriteSheetPhrases = ['Images stay on this device. They are not uploaded.', 'Choose up to 128 PNG, JPG, WebP, GIF, AVIF or BMP images. The first frame of an animated image is used. Processing speed depends on your device.', 'Choose image frames', 'Frame order', 'Frame width (pixels)', 'Frame height (pixels)', 'Columns', 'Gap (pixels)', 'Outer padding (pixels)', 'Create sprite sheet', 'Download sprite PNG', 'Download coordinates JSON', 'Copy CSS coordinates', 'CSS coordinates', 'Generated sprite sheet preview', 'Choose image files to begin.', 'Move frame up', 'Move frame down', 'Frame order changed. Create the sprite sheet again.', 'Choose between 1 and {count} images.', 'Use PNG, JPG, WebP, GIF, AVIF or BMP image files.', 'Reading image dimensions on this device…', 'The selected images are too large to process reliably in this browser. Choose fewer or smaller images.', '{count} images ready. Choose frame size and create the sheet.', 'One or more images could not be read by this browser. Try PNG, JPG or WebP.', 'Enter valid frame size, columns, gap and padding.', 'Image {count} has unsupported dimensions.', 'The sprite sheet would be too large for a reliable browser export. Reduce frame size, columns or padding.', 'Sprite sheet created: {width} × {height} pixels, {count} frames.', 'The sprite sheet could not be created. Check the settings and try again.', 'The PNG could not be created. Try again.', 'PNG download started.', 'Coordinates JSON download started.', 'CSS coordinates copied.', 'Copy was blocked. Use the CSS coordinates box below.'];
const householdBudgetPhrases = ['Your budget stays on this device. Nothing is uploaded.', 'This tool does not connect to banks or give financial advice.', 'Month', 'Currency', 'Add a transaction', 'Date', 'Type', 'Income', 'Expense', 'Amount', 'Category', 'Salary', 'Other income', 'Housing', 'Food', 'Transport', 'Utilities', 'Health', 'Education', 'Shopping', 'Entertainment', 'Debt', 'Savings', 'Other expense', 'Note (optional)', 'Monthly summary', 'Total income', 'Total expenses', 'Balance', 'Totals by category', 'No transactions yet.', 'Transactions', 'Remove', 'Save this month on this device', 'Load saved month', 'Delete saved month', 'Download CSV', 'Clear this month', 'Choose a valid month.', 'Transaction added.', 'Transaction removed.', 'Month changed. Save the month on this device if you want to keep it.', 'Month saved on this device.', 'Could not save this month. Browser storage may be unavailable or full.', 'No valid saved month was found on this device.', 'A saved transaction is outside the selected month.', 'Saved month loaded on this device.', 'Could not load the saved month.', 'Saved month deleted from this device.', 'Browser storage is unavailable.', 'This month was cleared from the page. Saved data was not deleted.', 'Add a transaction before downloading a CSV.', 'CSV download started.', 'Choose income or expense.', 'Choose a valid date in the selected month.', 'Enter an amount greater than zero with no more than two decimal places.', 'Enter a category of 1 to 40 characters.', 'Keep notes to 100 characters or fewer.', 'Use no more than 300 transactions per month.'];
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
  'Study', 'Subject', 'Remove subject', 'Add subject', 'Create study plan', 'Save plan on this device', 'Load saved plan',
  'Download plan', 'Clear saved plan', 'Add a subject to begin.', 'A session is 25 minutes. Your plan is not uploaded.',
  'Example: Read chapter 1 | 50', 'Your study schedule', 'Subjects', 'Sessions', 'Study time', 'Session',
  'Sessions left', 'Some topics do not fit before the exam dates. Add more time or reduce the workload.',
  'All listed topics fit in this draft schedule.', 'Open the Pomodoro timer', 'Study schedule created in this browser.',
  'Study plan saved on this device.', 'Could not save the plan. Browser storage may be full or disabled.',
  'No saved study plan was found on this device.', 'Saved study plan loaded.', 'Saved plan is not valid.',
  'Create a study plan before downloading it.', 'Study plan download is ready.',
  'Saved study plan cleared from this device.', 'Enter a valid exam date.', 'Add 1 to 12 subjects.',
  'Daily study time must be 25 to 600 minutes.', 'Choose an exam date from tomorrow up to 180 days away.',
  'Use up to 120 topics per subject.', 'Write each topic as a name, optionally followed by | minutes (1–2400).',
  'Use up to 120 topics across the whole plan.', 'Enter a subject name for every row.',
  'Add at least one topic or task for every subject.',
  'Each round is generated on this device. Your answers are not uploaded.', 'Start practice', 'Question {current} of {total}',
  'Score', 'Streak', 'Time', 'Your answer', 'Check answer', 'Next question', 'Ready when you are.',
  'Enter a whole-number answer.', 'Correct!', 'Not quite. Answer: {answer}.',
  'Round complete. Score: {score}/{total} ({accuracy}%).',
  'Tap your side’s clock after each move. White starts.', 'Starting time (minutes)', 'Increment per move (seconds)',
  'Start clock', 'Pause clock', 'Reset clock', 'White', 'Black', 'White to move', 'Black to move',
  'White ran out of time.', 'Black ran out of time.', 'Game paused.', 'Clock reset.', 'Choose valid clock settings.',
  'Intervals are synthesized in this browser and not uploaded.', 'Direction', 'Ascending', 'Descending', 'Random direction',
  'Number of questions', 'Start practice', 'Play interval', 'Listen, then choose the interval.',
  'Round {current} of {total}', 'Score: {score}', 'Streak: {streak}', 'Choose the interval you heard.',
  'Correct!', 'Not quite. It was {interval}.', 'Next question', 'Your round is ready.',
  'Round complete: {score}/{total} correct.', 'Audio could not start. Tap Play interval and check browser audio.',
  'Choose a valid practice setup.',
  'Minor second', 'Major second', 'Minor third', 'Major third', 'Perfect fourth', 'Tritone', 'Perfect fifth', 'Octave',
  'One participant per line', 'Shuffle the draw', 'Between 2 and 64 unique names. Matches and byes are handled in this browser.',
  'Create bracket', 'Clear bracket', 'Round {n}', 'Bye — advances automatically.', 'Waiting for the previous match.',
  'Bracket created. Select a winner in each match.', 'Bracket cleared from this page.', 'Champion: {name}', 'Winner: {name} advances.',
  'Enter between 2 and 64 participants.', 'Each participant name must be 50 characters or fewer.',
  'Participant names must be unique.', 'Create a bracket first.', 'Choose a valid match and participant.',
  'This match is not ready to play.', 'This match already has a winner.',
  'Audio is analyzed locally in this browser. No file is uploaded. Use a computer for long files.', 'Choose an audio file',
  'For device memory, files are limited to 50 MB and 3 minutes. Browser audio-format support varies.', 'Analyze tempo',
  'Tap the beat', 'Clear taps', 'Choose a file or tap a steady beat at least four times.',
  'Tempo is an estimate and may be half or double the beat you feel. Check the alternatives by tapping along.',
  'Selected: {name} ({size} MB).', 'Audio file ready.', 'The file is too large. Choose audio under 50 MB.',
  'Audio analysis is not supported in this browser.', 'Analyzing audio locally…',
  'The file is too large or long for this device. Choose audio under 50 MB and 3 minutes.',
  'This browser could not decode that audio format.', 'Could not analyze the audio. Try another format or a shorter file.',
  'Not enough rhythm was found. Try a steady section or tap the beat.', 'No clear tempo found.',
  'Tempo estimate ready. Tap along to check it.',
  'Tempo estimate. Other possible tempos: {tempos} BPM. Tap along to check.',
  'Estimate ready. Compare it by tapping along.', 'Tempo from your taps.', 'Tempo from your taps: {bpm} BPM.',
  'Tap at a steady pace. {count} of 4 taps.', 'Tap at least four beats at a steady pace.',
  'This scale is generated and played locally in your browser.', 'Root note', 'Scale type', 'Major', 'Natural minor', 'Harmonic minor',
  'Major pentatonic', 'Minor pentatonic', 'Blues', 'Dorian', 'Mixolydian', 'Play scale', 'Stop sound', 'Semitone steps',
  'Playing the scale in this browser.', 'Scale playback finished.', 'Scale playback stopped.', 'Choose a root note and scale.',
  'Your guest list stays in this browser. Nothing is uploaded.', 'Guest names (one per line)', 'Number of tables', 'Seats per table',
  'Create seating plan', 'Shuffle seating', 'Save plan here', 'Load saved plan', 'Delete saved plan', 'Download plan', 'Print plan',
  'Your seating plan will appear here.', 'Table', 'seats filled', 'Move guest', 'to table', 'No guests assigned.',
  'That table is full.', 'Seating plan created. You can move guests between tables.', 'Plan saved on this device.',
  'Could not save the plan in this browser. Check available storage.', 'No saved plan was found on this device.',
  'Saved plan loaded.', 'The saved plan could not be read.', 'Delete the saved seating plan from this device?',
  ...ganttPhrases, 'Saved plan deleted from this device.', 'Could not delete the saved plan in this browser.', 'Plan download started.',
  ...spriteSheetPhrases,
  ...householdBudgetPhrases,
  'The seating plan is not ready to download.', 'Add at least one guest name, one per line.', 'Use no more than 200 guests.',
  'Guest names must be 100 characters or fewer.', 'Table count must be a whole number from 1 to 40.',
  'Seats per table must be a whole number from 1 to 20.', 'Capacity', 'Guests', 'Check the guest list and table sizes, then try again.',
].filter((phrase) => !selectedIds || selectedIds.some((id) => {
  const studyPlanner = id === 'study-planner' && ['Study', 'Subject', 'Remove subject', 'Add subject', 'Create study plan', 'Save plan on this device', 'Load saved plan', 'Download plan', 'Clear saved plan', 'Add a subject to begin.', 'A session is 25 minutes. Your plan is not uploaded.', 'Example: Read chapter 1 | 50', 'Your study schedule', 'Subjects', 'Sessions', 'Study time', 'Session', 'Sessions left', 'Some topics do not fit before the exam dates. Add more time or reduce the workload.', 'All listed topics fit in this draft schedule.', 'Open the Pomodoro timer', 'Study schedule created in this browser.', 'Study plan saved on this device.', 'Could not save the plan. Browser storage may be full or disabled.', 'No saved study plan was found on this device.', 'Saved study plan loaded.', 'Saved plan is not valid.', 'Create a study plan before downloading it.', 'Study plan download is ready.', 'Saved study plan cleared from this device.', 'Enter a valid exam date.', 'Add 1 to 12 subjects.', 'Daily study time must be 25 to 600 minutes.', 'Choose an exam date from tomorrow up to 180 days away.', 'Use up to 120 topics per subject.', 'Write each topic as a name, optionally followed by | minutes (1–2400).', 'Use up to 120 topics across the whole plan.', 'Enter a subject name for every row.', 'Add at least one topic or task for every subject.'].includes(phrase);
  const mentalMath = id === 'mental-math-practice' && ['Each round is generated on this device. Your answers are not uploaded.', 'Start practice', 'Question {current} of {total}', 'Score', 'Streak', 'Time', 'Your answer', 'Check answer', 'Next question', 'Ready when you are.', 'Enter a whole-number answer.', 'Correct!', 'Not quite. Answer: {answer}.', 'Round complete. Score: {score}/{total} ({accuracy}%).'].includes(phrase);
  const tournament = id === 'tournament-bracket-generator' && ['One participant per line', 'Shuffle the draw', 'Between 2 and 64 unique names. Matches and byes are handled in this browser.', 'Create bracket', 'Clear bracket', 'Round {n}', 'Bye — advances automatically.', 'Waiting for the previous match.', 'Bracket created. Select a winner in each match.', 'Bracket cleared from this page.', 'Champion: {name}', 'Winner: {name} advances.', 'Enter between 2 and 64 participants.', 'Each participant name must be 50 characters or fewer.', 'Participant names must be unique.', 'Create a bracket first.', 'Choose a valid match and participant.', 'This match is not ready to play.', 'This match already has a winner.'].includes(phrase);
  const chessClock = id === 'chess-clock' && ['Tap your side’s clock after each move. White starts.', 'Starting time (minutes)', 'Increment per move (seconds)', 'Start clock', 'Pause clock', 'Reset clock', 'White', 'Black', 'White to move', 'Black to move', 'White ran out of time.', 'Black ran out of time.', 'Game paused.', 'Clock reset.', 'Choose valid clock settings.'].includes(phrase);
  const earTraining = id === 'ear-training' && ['Intervals are synthesized in this browser and not uploaded.', 'Direction', 'Ascending', 'Descending', 'Random direction', 'Number of questions', 'Start practice', 'Play interval', 'Listen, then choose the interval.', 'Round {current} of {total}', 'Score: {score}', 'Streak: {streak}', 'Choose the interval you heard.', 'Correct!', 'Not quite. It was {interval}.', 'Next question', 'Your round is ready.', 'Round complete: {score}/{total} correct.', 'Audio could not start. Tap Play interval and check browser audio.', 'Choose a valid practice setup.', 'Minor second', 'Major second', 'Minor third', 'Major third', 'Perfect fourth', 'Tritone', 'Perfect fifth', 'Octave'].includes(phrase);
  const bpmDetector = id === 'bpm-detector' && ['Audio is analyzed locally in this browser. No file is uploaded. Use a computer for long files.', 'Choose an audio file', 'For device memory, files are limited to 50 MB and 3 minutes. Browser audio-format support varies.', 'Analyze tempo', 'Tap the beat', 'Clear taps', 'BPM', 'Choose a file or tap a steady beat at least four times.', 'Tempo is an estimate and may be half or double the beat you feel. Check the alternatives by tapping along.', 'Selected: {name} ({size} MB).', 'Audio file ready.', 'The file is too large. Choose audio under 50 MB.', 'Audio analysis is not supported in this browser.', 'Analyzing audio locally…', 'The file is too large or long for this device. Choose audio under 50 MB and 3 minutes.', 'This browser could not decode that audio format.', 'Could not analyze the audio. Try another format or a shorter file.', 'Not enough rhythm was found. Try a steady section or tap the beat.', 'No clear tempo found.', 'Tempo estimate ready. Tap along to check it.', 'Tempo estimate. Other possible tempos: {tempos} BPM. Tap along to check.', 'Estimate ready. Compare it by tapping along.', 'Tempo from your taps.', 'Tempo from your taps: {bpm} BPM.', 'Tap at a steady pace. {count} of 4 taps.', 'Tap at least four beats at a steady pace.'].includes(phrase);
  const musicScaleFinder = id === 'music-scale-finder' && ['This scale is generated and played locally in your browser.', 'Root note', 'Scale type', 'Major', 'Natural minor', 'Harmonic minor', 'Major pentatonic', 'Minor pentatonic', 'Blues', 'Dorian', 'Mixolydian', 'Play scale', 'Stop sound', 'Semitone steps', 'Playing the scale in this browser.', 'Scale playback finished.', 'Scale playback stopped.', 'Choose a root note and scale.', 'Audio could not start. Check your browser audio settings.'].includes(phrase);
  const seatingChart = id === 'seating-chart-maker' && ['Your guest list stays in this browser. Nothing is uploaded.', 'Guest names (one per line)', 'Number of tables', 'Seats per table', 'Create seating plan', 'Shuffle seating', 'Save plan here', 'Load saved plan', 'Delete saved plan', 'Download plan', 'Print plan', 'Your seating plan will appear here.', 'Table', 'seats filled', 'Move guest', 'to table', 'No guests assigned.', 'That table is full.', 'Seating plan created. You can move guests between tables.', 'Plan saved on this device.', 'Could not save the plan in this browser. Check available storage.', 'No saved plan was found on this device.', 'Saved plan loaded.', 'The saved plan could not be read.', 'Delete the saved seating plan from this device?', 'Saved plan deleted from this device.', 'Could not delete the saved plan in this browser.', 'Plan download started.', 'The seating plan is not ready to download.', 'Add at least one guest name, one per line.', 'Use no more than 200 guests.', 'Guest names must be 100 characters or fewer.', 'Table count must be a whole number from 1 to 40.', 'Seats per table must be a whole number from 1 to 20.', 'Capacity', 'Guests', 'Check the guest list and table sizes, then try again.'].includes(phrase);
  const ganttChart = id === 'gantt-chart-maker' && ganttPhrases.includes(phrase);
  const spriteSheet = id === 'sprite-sheet-maker' && spriteSheetPhrases.includes(phrase);
  const householdBudget = id === 'household-budget-planner' && householdBudgetPhrases.includes(phrase);
  return studyPlanner || mentalMath || tournament || chessClock || earTraining || bpmDetector || musicScaleFinder || seatingChart || ganttChart || spriteSheet || householdBudget;
})));
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
