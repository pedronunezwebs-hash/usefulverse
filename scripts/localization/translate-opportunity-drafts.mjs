import { writeFile } from 'node:fs/promises';
import { opportunityTools } from '../../src/opportunity-tools.mjs';
import { locales } from '../../src/locales.mjs';
import { generatedOpportunityCopy as previousDrafts } from '../../src/locales/generated-opportunity-copy.mjs';
import { elements } from '../../src/periodic-table-logic.mjs';

const ids = process.env.USEFULVERSE_TRANSLATION_TOOL_IDS?.split(',').filter(Boolean);
if (!ids?.length) throw new Error('Set USEFULVERSE_TRANSLATION_TOOL_IDS to the exact new tool IDs.');
const selected = ids.map((id) => opportunityTools.find((tool) => tool.id === id));
if (selected.some((tool) => !tool)) throw new Error('Unknown tool ID in translation selection.');
const uiPhrases = [
  'Your list stays in this browser until you export it.', 'Trip name', 'Item to pack', 'Category', 'Clothing', 'Toiletries', 'Documents', 'Electronics', 'Other', 'Add item', 'Add common essentials', 'Download list', 'Clear list', 'Packed', 'Add an item to start your checklist.', 'Item added to your list.', 'A checklist can contain up to 200 items.', 'Enter an item name up to 120 characters.', 'Common essentials added. Review this list for your trip.', 'Add at least one item before downloading.', 'Checklist download started.',
  'Scores organize your own priorities; they do not decide for you.', 'Options, one per line', 'Criteria and weight, one per line: criterion | weight 1–10', 'Build comparison', 'Weighted comparison', 'Option', 'Score each option from 0 (lowest) to 10 (highest) for every criterion.', 'Download CSV', 'score from 0 to 10', 'Comparison created. Change scores from 0 to 10.', 'Enter 2 to 12 options, each no longer than 80 characters.', 'Option names must be unique.', 'Each criterion needs a name and a whole-number weight from 1 to 10, separated by |.', 'Criterion names must be unique.', 'Every score must be from 0 to 10.', 'Build a comparison first.', 'CSV download started.',
  'Plan your own routine. This is not medical or training advice.', 'Exercise', 'Sets', 'Reps per set', 'Rest between sets (seconds)', 'Add exercise', 'Download workout', 'Print workout', 'Clear workout', 'Add an exercise to build your plan.', 'Exercise added to your workout.', 'A workout can contain up to 80 exercises.', 'Enter an exercise name up to 100 characters.', 'Reps must be a whole number from 1 to 500.', 'Rest must be a whole number from 0 to 3600 seconds.', 'Add an exercise before downloading.', 'Workout download started.', 'Add an exercise before printing.', 'Allow this click to open the print view, then try again.', 'Workout plan', 'rest',
  'Create questions with one correct answer and three choices. Questions stay in this tab.', 'Question', 'Correct answer', 'Wrong answer 1', 'Wrong answer 2', 'Wrong answer 3', 'Add question', 'Start quiz', 'Download quiz backup', 'Clear quiz', 'Your questions', 'Add at least one question to begin.', 'Question added.', 'Fill in the question and all four different answers.', 'You can add up to 100 questions.', 'Check answer', 'Next question', 'Finish quiz', 'Question {current} of {total}', 'Correct!', 'Not quite. The correct answer was: {answer}', 'Quiz complete: {score} out of {total}.', 'Add at least one question before starting.', 'Quiz backup downloaded.', 'No questions to download.', 'Quiz cleared.', 'Start a quiz to practice.', 'Try again', 'Choose an answer',
  'Choose a board and match all pairs. Moves count each pair of cards you reveal.', 'Board size', 'Easy · 4 × 4', 'Medium · 4 × 6', 'Hard · 6 × 6', 'Start game', 'Restart game', 'Moves', 'Time', 'Hidden card', 'Card {number}', 'Matched pair', 'You matched all {pairs} pairs in {moves} moves and {time}.', 'Choose a board size and start.', 'Game reset.', 'Start a game to see your progress.', 'Memory game board',
  'Study kana with short multiple-choice rounds. Answers are checked in your browser.', 'Writing system', 'ひらがな', 'カタカナ', 'Questions', '5 questions', '10 questions', '20 questions', 'Start practice', 'Next', 'Finish round', 'Question {current} of {total}', 'Choose the Latin-letter reading.', 'Correct!', 'Not quite. The answer is {answer}.', 'Round complete: {score} of {total} correct.', 'Start a round to practice.', 'Choose an answer to continue.', 'Review missed kana',
  'Build the sum on the abacus using five place-value rods. Answers are checked in your browser.', 'New problem', 'Check answer', 'Place {value}', 'Decrease place {value}', 'Increase place {value}', 'Your value: {value}', 'Correct! {left} + {right} = {sum}.', 'Not yet. Adjust the rods and try again.', 'Get an addition problem to begin.',
  'Enter one word and hint per line, separated by |. Your list stays in this tab.', 'Word list', 'Load practice list', 'New round', 'Check spelling', 'Next word', 'Review missed words', 'Clear list', 'Word {current} of {total}', 'Hint', 'Type the spelling', 'Not quite. The answer is {answer}.', 'Round complete: {score} of {total} correct.', 'Enter between 2 and 100 non-empty word | hint lines.', 'Each line needs a word and a hint separated by |.', 'Words must be unique.', 'Enter a spelling before checking.', 'Start a practice list to begin.', 'Practice list loaded.', 'List cleared.',
  'Practice basic Hangul letters with short multiple-choice rounds. Answers are checked in your browser.', 'Letter group', 'Consonants', 'Vowels', 'Consonants and vowels', 'Questions', '5 questions', '10 questions', '20 questions', 'Start practice', 'Next', 'Finish round', 'Question {current} of {total}', 'Choose the romanized reading.', 'Correct!', 'Not quite. The reading is {answer}.', 'Round complete: {score} of {total} correct.', 'Start a round to practice.', 'Choose an answer to continue.', 'Vowel-only rounds support up to 10 questions.',
  'Use the arrow keys or direction buttons to move tiles. Equal numbers merge once per move.', 'New game', 'Undo one move', 'Score', 'Up', 'Down', 'Left', 'Right', 'Game board', 'Empty tile', 'Tile {value}', 'Merge tiles to reach 2048.', 'You reached 2048! Keep going or start a new game.', 'No moves left. Score: {score}.', 'No more moves to undo.', 'Game reset.', 'Score: {score}', 'Undo is available after a move.', 'The game is not saved when you leave this page.', 'Games',
  'Sudoku board', 'Difficulty', 'Easy', 'Medium', 'Hard', 'New puzzle', 'Pencil notes', 'Erase', 'Hint', 'Check puzzle', 'Choose a number', 'Row {row}, column {column}: {value}', 'Given: {value}', 'Notes: {value}', 'Empty', 'Puzzle solved!', 'There are mistakes to fix.', 'Fill every cell first.', 'Choose an empty cell first.', 'This is a starting clue and cannot be changed.', 'Notes on.', 'Notes off.', 'That number conflicts with a row, column or box.', 'A hint was added.', 'No empty cell remains for a hint.', 'Use arrow keys to move between cells. Use 1–9 to enter a number.', 'The puzzle is generated in this browser and is not saved when you leave.',
  'Play against the computer or another person. This game stays in your browser.', 'Opponent', 'Computer', 'Two players', 'New game', 'Reset score', 'Game score', 'You are X. The computer is O.', 'X to move.', 'O to move.', 'X wins!', 'O wins!', 'Draw game.', 'Choose a square.', 'Game board', 'Square {number}: {value}', 'Empty', 'X wins: {count}', 'O wins: {count}', 'Draws: {count}',
  'Play a local two-player game. Use legal moves, undo and save or download a PGN. Nothing is uploaded.', 'Chess board', 'White to move.', 'Black to move.', 'White is in check.', 'Black is in check.', 'Checkmate — {winner} wins!', 'Draw by stalemate.', 'Game drawn.', 'Choose a piece with a legal move.', 'That is not a legal move.', 'Undo move', 'Flip board', 'Save game on this device', 'Load saved game', 'Delete saved game', 'Download PGN', 'Promote pawn to', 'Queen', 'Rook', 'Bishop', 'Knight', 'Moves', 'Game reset.', 'Game saved on this device.', 'Saved game loaded.', 'Saved game deleted.', 'No saved game on this device.', 'Could not save the game on this device.', 'Could not load the saved game.', 'Choose a piece, then a highlighted destination.', 'Square {square}: {piece}', 'Empty square', 'White king', 'White queen', 'White rook', 'White bishop', 'White knight', 'White pawn', 'Black king', 'Black queen', 'Black rook', 'Black bishop', 'Black knight', 'Black pawn', 'Chess.js BSD-2-Clause license', 'White', 'Black', 'No move to undo.', 'Make a move before saving the game.', 'PGN download started.',
  'This local Klondike game is played in your browser. Moves and cards are not saved or uploaded.', 'Move alternating-color cards down by rank. Build each suit from Ace to King. Draw cards, uncover the tableau and undo a move when needed.', 'Draw cards', 'Draw 1', 'Draw 3', 'New game', 'Undo', 'Stock pile', 'Waste pile', 'Foundation for {suit}', 'Tableau', 'Tableau column {number}', 'Empty pile', 'Face-down card', 'Card {rank} of {suit}', 'Ace', 'Jack', 'Queen', 'King', 'Clubs', 'Diamonds', 'Hearts', 'Spades', 'Select a card, then choose a legal pile.', 'That move is not allowed.', 'Cards drawn.', 'Waste returned to stock.', 'No cards to draw.', 'No move to undo.', 'Game started.', 'You won!', 'Selected: {card}',
  'Find hidden mines by using the number clues. Your first click opens a safe area. This game stays in your browser.', 'Difficulty', 'Easy', 'Medium', 'Hard', 'New game', 'Flag mode off', 'Mines left: {count}', 'Time: {time}', 'Select a cell to start. Your first click is safe.', 'Flag mode on', 'Cell flagged.', 'Flag removed.', 'You have reached the flag limit.', 'Mine found. Game over.', 'Board cleared. You win!', 'Game reset.', 'Minesweeper board: {rows} rows, {columns} columns', 'Row {row}, column {column}: {state}', 'Hidden cell', 'Mine', 'Flagged', 'Empty', 'Adjacent mines: {count}',
  'Use the number clues to mark filled and empty squares and reveal the hidden picture. Every generated puzzle has one solution.', 'New puzzle', 'Check solution', 'Clear marks', 'Use the clues to find the hidden picture. Click a cell to cycle its mark.', 'New unique puzzle generated.', 'Marks cleared.', 'Mark every cell as filled or empty first.', 'Puzzle solved!', 'Not solved yet. Compare your marks with the clues.', 'Column {number} clues: {clues}', 'Row {number} clues: {clues}', 'Row {row}, column {column}: {state}', 'Filled', 'Marked empty', 'Unknown', 'Nonogram puzzle', 'Click cycles unknown, filled and empty. Right-click or press X to mark an empty cell.',
  'Slide numbered tiles into the empty space until the numbers are in order. Every puzzle is shuffled with legal moves and can be solved.', 'Board size', '3 × 3', '4 × 4', '5 × 5', 'Moves: {count}', 'Empty space', 'Tile {number}', 'Use the arrow keys or select a tile beside the empty space.', 'Tile moved.', 'New puzzle ready.', 'Puzzle solved in {count} moves!', 'Sliding puzzle',
  'Create a drum beat with a 16-step sequencer. Audio is generated locally in your browser and is not uploaded.', 'Turn bass drum, snare drum and hi-hat steps on or off, choose a tempo and press Play to hear your pattern.', 'Bass drum', 'Snare drum', 'Hi-hat', 'Tempo', '{value} BPM', 'Play', 'Stop', 'Play drum pattern', 'Stop drum pattern', 'Clear the pattern', 'Pattern cleared.', 'Playing your drum pattern.', 'Playback stopped.', 'Playback stopped because this tab was hidden.', 'Audio is not available in this browser.', 'Audio could not start. Check your browser sound settings and try again.', '{track}, step {number}', 'Drum pattern', 'Tool loading failed. Refresh the page and try again.',
  'Build a melody with a 16-step piano roll. Notes are synthesized locally and are not uploaded.', 'Note', 'Tempo', 'Play', 'Stop', 'Play melody', 'Stop melody', 'Clear melody', 'Save pattern on this device', 'Load saved pattern', 'Delete saved pattern', 'Export MIDI', 'Note {note}, step {number}', 'Melody piano roll', 'Melody cleared.', 'Playing your melody.', 'Playback stopped.', 'Playback stopped because this tab was hidden.', 'Audio is not available in this browser.', 'Audio could not start. Check your browser sound settings and try again.', 'MIDI download started.', 'Could not create the MIDI file.', 'Pattern saved on this device.', 'Could not save the pattern. Browser storage may be unavailable.', 'No saved pattern was found on this device.', 'Could not load a pattern from this browser.', 'Saved pattern loaded.', 'The saved pattern is not valid.', 'Saved pattern deleted from this device.', 'Could not delete the saved pattern.',
  'Effect', 'Fade in', 'Slide from left', 'Bounce', 'Rotate', 'Pulse', 'Duration', 'Delay', 'Repetitions', 'Infinite', 'Timing', 'Ease', 'Ease in', 'Ease out', 'Ease in-out', 'Linear', 'Animation preview', 'Preview', 'CSS output', 'Copy CSS', 'Replay preview', 'Shape', 'Circle', 'Ellipse', 'Inset', 'Triangle', 'Diamond', 'Hexagon', 'Clip-path preview', 'Brightness', 'Contrast', 'Grayscale', 'Hue', 'Invert', 'Sepia', 'Saturation', 'Blur', 'Filter preview', 'Check the selected values and try again.', 'CSS copied.', 'Copy was blocked. Select the CSS and copy it manually.',
];
uiPhrases.push('Effect', 'Fade in', 'Slide from left', 'Bounce', 'Rotate', 'Pulse', 'Duration', 'Delay', 'Repetitions', 'Infinite', 'Timing', 'Ease', 'Ease in', 'Ease out', 'Ease in-out', 'Linear', 'Animation preview', 'Preview', 'CSS output', 'Copy CSS', 'Replay preview', 'Shape', 'Circle', 'Ellipse', 'Inset', 'Triangle', 'Diamond', 'Hexagon', 'Clip-path preview', 'Brightness', 'Contrast', 'Grayscale', 'Hue', 'Invert', 'Sepia', 'Saturation', 'Blur', 'Filter preview', 'Check the selected values and try again.', 'CSS copied.', 'Copy was blocked. Select the CSS and copy it manually.');
uiPhrases.push('Search by element name, symbol or atomic number', 'All families', 'All groups', 'Metal', 'Nonmetal', 'Metalloid', 'Lanthanide', 'Actinide', 'Search', 'Reset filters', '118 elements', 'Element details', 'Atomic number', 'Symbol', 'Name', 'Group', 'Period', 'Family', 'Compare elements', 'Choose 2 or 3 elements to compare.', 'Add to comparison', 'Remove from comparison', 'Clear comparison', 'Comparison', 'Start symbol quiz', 'Next question', 'What is the symbol for atomic number {number}?', 'Your answer', 'Check answer', 'Correct!', 'Try again. The symbol is {symbol}.', 'Choose an element to see its details.', 'No elements match these filters.', 'Use a group or period to explore the table.', 'Family groups are simplified for learning; not a safety reference.', 'Periodic table', ...elements.map(({ name }) => name), 'This is a compact single-layer Mahjong-style matching puzzle, not the traditional layered layout. A tile is free when at least one horizontal side is open. Every new board has a valid solution.', 'New puzzle', 'Moves', 'Tile', 'Free', 'Blocked', 'Removed tile', 'Choose two matching free tiles.', 'Tile selected. Choose its match.', 'Those tiles do not match.', 'Pair removed.', 'Puzzle complete!', 'That tile is blocked. Choose a free tile.', 'Selection cleared.', 'New puzzle ready.', 'Mahjong solitaire board');
uiPhrases.push('HTTP method', 'Request URL', 'Headers as JSON', 'Request body', 'Output format', 'cURL', 'JavaScript Fetch', 'Build code', 'Copy code', 'Download manifest.json', 'App name', 'Short name', 'Description', 'Start URL', 'Display mode', 'Standalone app', 'Minimal interface', 'Full screen', 'Browser tab', 'Theme color', 'Background color', 'First row contains headings', 'Table caption (optional)', 'Tab-separated rows', 'Generate table', 'Preview', 'Generated code', 'Request details', 'This tool builds code only. It does not send a request.', 'Browser CORS and server rules can block a request you run elsewhere.', 'No network request was sent.', 'Code generated.', 'Table generated.', 'Manifest generated.', 'Code copied.', 'Copy was blocked. Select the text and copy it manually.', 'Download started.', 'Enter the requested values and try again.', 'Reset');
uiPhrases.push('Games', 'Two players share this device. Moves are not saved or uploaded.', 'Current turn: Red', 'Current turn: Black', 'Red wins!', 'Black wins!', 'Game tied.', 'New game', 'Connect Four board', 'Reversi board', 'Checkers board', 'Row {row}, column {column}: {state}', 'Red disk', 'Black disk', 'Red checker', 'Black checker', 'Red king', 'Black king', 'Empty square', 'Legal move', 'Choose a non-full column.', 'No legal move. Pass this turn.', 'Pass turn', 'Choose a highlighted square.', 'Piece selected. Choose a highlighted square.', 'Continue the capture.', 'Red wins! Red: {red}, Black: {black}.', 'Black wins! Red: {red}, Black: {black}.', 'Game tied. Red: {red}, Black: {black}.');
uiPhrases.push('Choose a font file', 'Choose a font file to start.', 'Load font', 'Choose a font file first.', 'Choose a WOFF, WOFF2, TTF or OTF file under 10 MB.', 'This browser could not load that font. Try another file.', 'Font loaded for this preview.', 'Font removed.', 'Font preview', 'Sample text', 'Font size', 'Font size (px)', 'Reset preview', 'The file stays on this device and is not uploaded.', 'Choose a font file and load it to preview.', 'Type or paste text to preview.', 'Font could not be loaded. Use a supported font file under 10 MB.');
uiPhrases.push('Kakuro-style cross-sum puzzle', 'New puzzle', 'Check sums', 'Hint', 'Clear entries', 'Row {number} sum: {sum}', 'Column {number} sum: {sum}', 'Cell row {row}, column {column}', 'Enter a digit from 1 to 9.', 'Each row and column must match its sum and cannot repeat a digit.', 'New puzzle generated.', 'Fill all 16 cells before checking.', 'Not yet. Check the row and column sums and remove repeated digits.', 'Puzzle solved!', 'A hint was added.', 'No empty cell remains for a hint.', 'Entries cleared.', 'Kakuro puzzle');
uiPhrases.push('Your fleet stays on this device. The computer randomly picks a square to shoot at.', 'Your fleet', 'Enemy fleet', 'New game', 'Row {row}, column {column}: {state}', 'Ship', 'Ship hit', 'No ship here', 'No shot yet', 'Computer hit your ship at row {row}, column {column}.', 'Computer missed at row {row}, column {column}.', 'You hit a ship.', 'You missed.', 'You sank a ship!', 'You win!', 'The computer sank your fleet.', 'Choose an untried square on the enemy board to fire.', 'Choose a square to fire.', 'Computer turn…', 'Game over. Start a new game to play again.', 'A new fleet was placed randomly.', 'Enemy board', 'Your board', 'Line up your guess with the row and column.');
uiPhrases.push('Measure CSS pixels on this display. Physical units are estimates unless you calibrate the ruler.', 'Start position (px)', 'End position (px)', 'Measured length', 'Pixels per known length', 'Known length (mm)', 'Calibrate', 'Clear calibration', 'Use the range controls to move the markers.', 'Uncalibrated CSS pixels', 'mm', 'in', 'Screen ruler', 'Set two rays to match the lines you want to measure. The angle is calculated locally.', 'First ray (degrees)', 'Second ray (degrees)', 'Angle', 'degrees', 'Drag a ray handle or use its range control.', 'Reset angle', 'Protractor');
uiPhrases.push('One label per line', 'Page size', 'Color theme', 'Poster title', 'Subtitle', 'Poster message', 'Recipient name', 'Award or achievement', 'Presented by', 'Date', 'Event name', 'Time', 'Location', 'RSVP details', 'Choose A4 or US Letter paper.', 'A4', 'US Letter', 'Blue', 'Green', 'Orange', 'Violet', 'Preview', 'Download SVG', 'Enter some text to create your design.', 'SVG design downloaded.', 'Could not create the SVG file.', 'Your text stays in this browser. Check printer scaling before printing.', 'One label per line (up to 30)', 'Print design');
uiPhrases.push('Choose a short audio file to estimate its likely key. The audio stays on your device.', 'Choose a short audio file to visualize its frequencies. The audio stays on your device.', 'Choose audio file', 'Analyze audio', 'Clear', 'No audio selected.', 'File size limit: 25 MB. Keep the clip under 3 minutes.', 'Analyzing audio on this device…', 'Likely key', 'Other possibilities', 'No clear key detected. Try a longer section with clear harmony.', 'This browser could not decode this audio format.', 'The file is larger than 25 MB.', 'The decoded clip is longer than 3 minutes.', 'Audio analysis failed. Try another supported file.', 'This is an estimate, not a guaranteed key. Compare the alternatives.', 'Run analysis to see likely keys.', 'The chosen file stays in this browser and is not uploaded.', 'Audio analysis uses device memory and processing.', 'Analysis complete.', 'Audio spectrogram', 'Frequency', 'Time', 'A spectrogram shows frequency energy over time; it is not a calibrated measurement.');
uiPhrases.push('The board uses standard E–A–D–G–B–E tuning and frets 0–12.', 'Which note is on string {string}, fret {fret}?', 'Choose a note.', 'Correct: {correct} · streak: {streak}', 'Correct! The note is {note}.', 'Not quite. Try another note.', 'Next note', 'Reset score');
uiPhrases.push('Rhythm practice', 'Tap in time', 'Listen to one bar, then tap each beat 16 times.', 'Rhythm practice started. Listen to the count-in.', 'Practice complete: {accuracy}% on time; average error {offset} ms.', 'Practice stopped after {count} of 16 taps.', 'Tap after starting rhythm practice.', 'Rhythm practice stopped.', 'Wait for the count-in to finish.');
uiPhrases.push('This is an approximate visual simulation, not a diagnosis or accessibility certification. Your image stays on this device and is not uploaded.', 'Choose image', 'Simulation mode', 'Normal color vision', 'Protanopia simulation', 'Deuteranopia simulation', 'Tritanopia simulation', 'Achromatopsia simulation', 'Create sample palette', 'Clear image', 'Original image', 'Simulated image', 'Choose an image or create a sample palette to begin.', 'Image loaded locally. Choose a simulation mode.', 'Sample palette created.', 'Image cleared.', 'Choose a PNG, JPEG, WebP, GIF or BMP image.', 'The image is larger than 10 MB. Choose a smaller file.', 'The image exceeds the 4-megapixel limit. Choose a smaller image.', 'This image could not be opened by your browser.', 'Color vision simulation failed. Try another image.');
uiPhrases.push('Create a small vector graphic with local controls. No file is uploaded.', 'Shape', 'Rectangle', 'Circle', 'Text', 'X position', 'Y position', 'Size', 'Fill color', 'Text content', 'Add object', 'Clear objects', 'Download SVG', 'SVG preview', 'Objects: {count}', 'Object added.', 'Objects cleared.', 'Add an object to preview your SVG.', 'Choose text for the text object.', 'Create a repeatable tile with simple geometric motifs. The SVG is generated in your browser.', 'Motif', 'Dots', 'Grid', 'Diagonal lines', 'Crosses', 'Tile size', 'Spacing', 'Foreground', 'Background', 'Pattern preview', 'Download SVG tile', 'SVG code', 'Pattern updated.', 'Pattern could not be created. Check the selected values.', 'Generate front-end HTML only. This does not host a form or collect responses.', 'Fields: one per line — label | text, email, number, date or textarea | required or optional', 'Name | text | required\nEmail | email | required\nMessage | textarea | optional', 'Submit button label', 'Submit', 'Build form HTML', 'Form preview', 'HTML output', 'Copy HTML', 'Download HTML', 'Form HTML created. It does not include a server endpoint.', 'Enter 1–60 valid field lines using the shown format.', 'Could not copy. Use the download or select the output manually.', 'Create a simple email HTML template locally; this tool does not send email.', 'Brand name', 'Email heading', 'Message', 'Button label', 'Button HTTPS link', 'Accent color', 'Footer note', 'You are receiving this message because you chose to hear from us.', 'Create preview', 'Email preview', 'Email HTML created. Test it in your email service before sending.', 'Use a valid HTTPS link and fill in each text field.');
uiPhrases.push('Edit audio locally in your browser. Your file is not uploaded.', 'Choose audio file', 'Trim start (seconds)', 'Trim end (seconds)', 'Volume', 'Fade in (seconds)', 'Fade out (seconds)', 'Duration', 'Preview selection', 'Stop playback', 'Export WAV', 'Download WAV', 'Clear audio', 'Choose a short audio file to begin.', 'Choose an audio file under 25 MB.', 'Choose audio up to 3 minutes with one or two channels.', 'This audio format could not be opened in this browser.', 'Audio loaded locally. Adjust the trim and export settings.', 'Choose a valid trim range and audio file first.', 'Playing the edited selection.', 'Playback finished.', 'Playback stopped.', 'Rendering WAV on this device…', 'WAV export is ready to download.', 'Audio export failed. Try a shorter supported clip.', 'Choose valid volume, fades and trim values.', 'WAV export exceeds the 128 MiB safety limit.', 'Audio editor controls', 'Audio cleared from this page.');
const corrections = {
  el: { copy: { 'fretboard-trainer': ['Εκπαιδευτής ταστιέρας κιθάρας'] } },
  ha: { copy: { 'fretboard-trainer': ['Mai koyon bayanin fret na gitar'] } },
  tl: { copy: { 'fretboard-trainer': ['Pagsasanay sa mga nota ng fretboard ng gitara'] } },
  el: { copy: { 'css-animation-generator': ['Δημιουργός κινούμενων σχεδίων CSS'], 'css-clip-path-editor': ['Επεξεργαστής αποκοπής CSS'], 'css-filter-generator': ['Δημιουργός φίλτρων CSS'] } },
  sv: { copy: { 'css-animation-generator': ['CSS-animationsgenerator'], 'css-clip-path-editor': ['CSS-redigerare för klippbanor'], 'css-filter-generator': ['CSS-filtergenerator'] } },
  ha: { copy: { 'css-animation-generator': ['Mai samar da motsin CSS'], 'css-filter-generator': ['Mai samar da matatar CSS'] } },
  fa: { copy: { 'css-animation-generator': ['مولد انیمیشن CSS'], 'css-clip-path-editor': ['ویرایشگر برش CSS'] } },
  fr: { ui: { Documents: 'Papiers de voyage', Option: 'Choix' } },
  ca: { ui: { Documents: 'Documents de viatge', Option: 'Opció', Consonants: 'Lletres consonants', 'Melody piano roll': 'Graella de notes de la melodia' } },
  ha: { ui: { Consonants: 'Baƙaƙe', 'Melody piano roll': 'Jadawalin notin waƙa' } },
  hi: { ui: { 'Add an exercise to build your plan.': 'अपनी योजना बनाने के लिए एक व्यायाम जोड़ें।' } },
  nl: { ui: { 'Download CSV': 'CSV downloaden', Sets: 'Aantal sets', 'Hard · 6 × 6': 'Moeilijk · 6 × 6', Score: 'Punten', Computer: 'Computerspeler', Rook: 'Toren', Tableau: 'Speelveld' } },
  sv: { ui: { 'Reps per set': 'Repetitioner per set', 'Medium · 4 × 6': 'Medel · 4 × 6', Easy: 'Lätt', Medium: 'Medel', Hard: 'Svår', Rook: 'Torn' } },
  ms: { ui: { Bishop: 'Gajah', Knight: 'Kuda' } },
  sw: { ui: { Rook: 'Mnara', Knight: 'Farasi', 'Melody piano roll': 'Gridi ya noti za melodi' } },
  ha: { ui: { Bishop: 'Guda mai tafiya a karkace', 'Melody piano roll': 'Jadawalin notin waƙa' } },
  tl: { ui: { Electronics: 'Elektroniks', 'Print workout': 'I-print ang ehersisyo', 'Memory game board': 'Laruang memorya', 'Letter group': 'Pangkat ng mga letra', 'Game board': 'Lupon ng laro', 'Sudoku board': 'Lupon ng Sudoku', 'Chess board': 'Larangang pang-iskak', 'Sliding puzzle': 'Palaisipang may mga tile na inililipat', 'Melody piano roll': 'Grid ng mga nota ng melodiya', 'Kakuro puzzle': 'Palaisipan ng Kakuro', Computer: 'Kalaban na kompyuter', Rook: 'Tore', Knight: 'Kabayo' }, copy: { 'decision-matrix': ['Pangkuwentang matrix ng pasya'] } },
  uk: { ui: { 'Choose an answer to continue.': 'Виберіть відповідь, щоб продовжити.', 'Review missed kana': 'Повторити пропущені кана', 'Start a round to practice.': 'Почніть раунд для тренування.' } },
};
corrections.ha ??= { ui: {} };
corrections.ha.ui = { ...corrections.ha.ui, 'Load font': 'Loda font' };
for (const [language, value] of Object.entries({ id: 'Kecepatan', tr: 'Hız', it: 'Velocità', ca: 'Ritme', nl: 'Slagtempo', ms: 'Kelajuan', pl: 'Szybkość', sv: 'Takt', sw: 'Kasi', ha: 'Gudun', tl: 'Bilis' })) {
  corrections[language] ??= { ui: {} };
  corrections[language].ui ??= {};
  corrections[language].ui.Tempo = value;
}
corrections.ar ??= { ui: {} };
Object.assign(corrections.ar.ui, { Tempo: 'الإيقاع', 'Bass drum': 'طبلة جهير', 'Snare drum': 'طبلة جانبية', 'Clear the pattern': 'امسح النمط', 'Checkers board': 'لوحة الداما', 'Red checker': 'قطعة حمراء', 'Black checker': 'قطعة سوداء', 'Red king': 'ملك أحمر', 'Black king': 'ملك أسود' });
corrections.ar.copy = { ...corrections.ar.copy, checkers: ['العب الداما عبر الإنترنت مجانًا — لاعبان على جهاز واحد', 'العب الداما مع صديق', 'العب الداما الأمريكية على لوحة 8×8، مع أسر إجباري، قفزات متتابعة وترقية القطع إلى ملكات. تعمل اللعبة محليًا في المتصفح.', 'لعبة الداما عبر الإنترنت، لعبة داما لاعبين، قواعد الداما الأمريكية، لعبة داما محلية', 'اختر قطعة حمراء مميزة، ثم اختر مربعًا قطريًا مميزًا للانتقال إليه. يجب تنفيذ الأسر؛ وإذا أمكن أسر قطعة أخرى، واصل اللعب بالقطعة نفسها.', 'تتبع هذه اللعبة المحلية قواعد الداما الأمريكية على لوحة 8×8: تتحرك القطع العادية للأمام، ويقفز الملك في الاتجاهين. لا يوجد خصم عبر الإنترنت أو حساب. لا تتضمن قواعد المطالبة بالتعادل أو تكرار الوضع.'] };
const placeholderPhrases = ['Question {current} of {total}', 'Not quite. The correct answer was: {answer}', 'Quiz complete: {score} out of {total}.', 'Card {number}', 'You matched all {pairs} pairs in {moves} moves and {time}.', 'Not quite. The answer is {answer}.', 'Round complete: {score} of {total} correct.', 'Place {value}', 'Decrease place {value}', 'Increase place {value}', 'Your value: {value}', 'Correct! {left} + {right} = {sum}.', 'Word {current} of {total}', 'Tile {value}', 'No moves left. Score: {score}.', 'Score: {score}', 'Row {row}, column {column}: {value}', 'Row {row}, column {column}: {state}', 'Given: {value}', 'Notes: {value}', 'Checkmate — {winner} wins!', 'Square {square}: {piece}', 'Foundation for {suit}', 'Tableau column {number}', 'Card {rank} of {suit}', 'Selected: {card}', 'Moves: {count}', 'Puzzle solved in {count} moves!', 'Tile {number}', '{value} BPM', '{track}, step {number}', 'Note {note}, step {number}', 'Red wins! Red: {red}, Black: {black}.', 'Black wins! Red: {red}, Black: {black}.', 'Game tied. Red: {red}, Black: {black}.'];
corrections.el ??= {};
corrections.el.copy = { ...corrections.el.copy, 'css-animation-generator': ['Δημιουργός κινούμενων σχεδίων CSS'], 'css-clip-path-editor': ['Επεξεργαστής αποκοπής CSS'], 'css-filter-generator': ['Δημιουργός φίλτρων CSS'] };
corrections.sv ??= {};
corrections.sv.copy = { ...corrections.sv.copy, 'css-animation-generator': ['CSS-animationsgenerator'], 'css-clip-path-editor': ['CSS-redigerare för klippbanor'], 'css-filter-generator': ['CSS-filtergenerator'] };
corrections.ha ??= {};
corrections.ha.copy = { ...corrections.ha.copy, 'css-animation-generator': ['Mai samar da motsin CSS'], 'css-filter-generator': ['Mai samar da matatar CSS'] };
corrections.ha.copy.protractor = ['Ma’aunin kusurwa na kan layi — Auna kusurwa', 'Ma’aunin kusurwa', 'Saita layukan kusurwa biyu a kan ma’auni na dijital mai digiri 180, sannan ka karanta girman kusurwar a digiri.', 'ma’aunin kusurwa na kan layi, gano kusurwa, auna kusurwa, ma’aunin kusurwa na dijital', 'Ja hannun layin kusurwa ko amfani da ma’aunin digiri don daidaita layukan da kake son aunawa.', 'Wannan kayan aikin burauza yana auna kusurwar da ka saita a kan zane. Ba ya duba hoton kamara kuma ba ya tabbatar da ma’aunin zahiri.'];
corrections.ha.ui = { ...corrections.ha.ui, 'Use the range controls to move the markers.': 'Yi amfani da maɓallan zamiya don matsar da alamomin.', Protractor: 'Ma’aunin kusurwa' };
corrections.sw ??= {};
corrections.sw.ui = { ...corrections.sw.ui, Protractor: 'Kifaa cha kupimia pembe' };
corrections.tl ??= {};
corrections.tl.ui = { ...corrections.tl.ui, 'Screen ruler': 'Panukat ng screen', 'End position (px)': 'Posisyon ng dulo (px)' };
corrections.fa ??= {};
corrections.fa.copy = { ...corrections.fa.copy, 'css-animation-generator': ['مولد انیمیشن CSS'], 'css-clip-path-editor': ['ویرایشگر برش CSS'] };
// Avoid a few untranslated literals returned by the free draft translator.
corrections.it ??= {};
corrections.it.ui = { ...corrections.it.ui, Time: 'Orario' };
corrections.bn ??= {};
corrections.bn.ui = { ...corrections.bn.ui, 'Deuteranopia simulation': 'ডিউটেরানোপিয়া সিমুলেশন' };
corrections.ar ??= {};
corrections.ar.ui = { ...corrections.ar.ui, 'Deuteranopia simulation': 'محاكاة الديوترانوبيا', 'Clear image': 'مسح الصورة', 'Simulated image': 'الصورة المحاكاة' };
corrections.ur ??= {};
corrections.ur.ui = { ...corrections.ur.ui, 'Deuteranopia simulation': 'ڈییوٹیرانوپیا کی نقل' };
corrections.tl ??= {};
corrections.tl.ui = { ...corrections.tl.ui, 'Simulation mode': 'Paraan ng pagtulad', 'Protanopia simulation': 'Pagtulad sa protanopia', 'Deuteranopia simulation': 'Pagtulad sa deuteranopia', 'Tritanopia simulation': 'Pagtulad sa tritanopia', 'Achromatopsia simulation': 'Pagtulad sa achromatopsia' };
corrections.nl ??= {};
corrections.nl.ui = { ...corrections.nl.ui, Violet: 'Paars' };
corrections.ms ??= {};
corrections.ms.ui = { ...corrections.ms.ui, Violet: 'Ungu' };
corrections.sv ??= {};
corrections.sv.ui = { ...corrections.sv.ui, Orange: 'Orangefärgad' };
corrections.sw ??= {};
corrections.sw.ui = { ...corrections.sw.ui, Violet: 'Zambarau' };
corrections.ha ??= {};
corrections.ha.ui = { ...corrections.ha.ui, Blue: 'Shuɗi', Orange: 'Lemun tsami', Violet: 'Shunayya', Subtitle: 'Ƙaramin take' };
corrections.ha.ui['Audio spectrogram'] = 'Taswirar mitar sauti';
corrections.tl ??= {};
corrections.tl.ui = { ...corrections.tl.ui, Orange: 'Kahel', Violet: 'Lila', 'Print design': 'I-print ang disenyo', Subtitle: 'Pangalawang pamagat' };
corrections.tl.ui['Audio spectrogram'] = 'Grap ng dalas ng tunog';
const cssLabelCorrections = {
  id: { Sepia: 'Warna sepia' }, ca: { Triangle: 'Forma triangular' }, nl: { Effect: 'Werking', Timing: 'Tijdinstelling', Sepia: 'Sepiafilter' },
  el: { 'Fade in': 'Σταδιακή εμφάνιση' }, ms: { Ellipse: 'Bentuk bujur', Sepia: 'Warna sepia' }, pl: { Sepia: 'Odcień sepii' },
  sv: { Hexagon: 'Sexhörning', Sepia: 'Sepiaton' }, sw: { Bounce: 'Kuruka', Ellipse: 'Mviringo wa duara', Hexagon: 'Pembe sita', Sepia: 'Rangi ya sepia' },
  ha: { 'Fade in': 'Bayyana a hankali', Pulse: 'Bugun haske', Ellipse: 'Siffar oval', Triangle: 'Siffar kusurwa uku', Diamond: 'Siffar lu’u-lu’u', Hexagon: 'Siffar kusurwa shida' },
  tl: { 'Fade in': 'Dahan-dahang paglitaw', Pulse: 'Pintig', 'Replay preview': 'Ulitin ang preview', Ellipse: 'Hugis-itlog', Grayscale: 'Abo-abo', Sepia: 'Epektong sepia' },
  am: { Pulse: 'ምት' },
};
for (const [language, labels] of Object.entries(cssLabelCorrections)) {
  corrections[language] ??= {};
  corrections[language].ui = { ...corrections[language].ui, ...labels };
}
const authoringLabelFixes = {
  ja: { 'SVG code': 'SVGコード', Motif: '模様', Dots: '点', Grid: '格子', Crosses: '十字', 'Tile size': 'タイルサイズ', Spacing: '間隔', Rectangle: '長方形' },
  ko: { 'SVG code': 'SVG 코드', Motif: '무늬', Dots: '점', Grid: '격자', Crosses: '십자', 'Tile size': '타일 크기', Spacing: '간격', Rectangle: '직사각형' },
  id: { 'SVG code': 'Kode SVG', Motif: 'Pola', Dots: 'Titik', Grid: 'Kisi', Crosses: 'Silang', 'Tile size': 'Ukuran ubin', Spacing: 'Jarak' },
  hi: { 'SVG code': 'SVG कोड', Motif: 'आकृति', Dots: 'बिंदु', Grid: 'जाल', Crosses: 'क्रॉस', 'Tile size': 'टाइल का आकार', Spacing: 'अंतराल' },
  ar: { 'SVG code': 'رمز SVG', Motif: 'نمط زخرفي', Dots: 'نقاط', Grid: 'شبكة', Crosses: 'علامات تقاطع', 'Tile size': 'حجم البلاطة', Spacing: 'التباعد' },
  zh: { 'SVG code': 'SVG 代码', Motif: '图案', Dots: '圆点', Grid: '网格', Crosses: '十字', 'Tile size': '图块大小', Spacing: '间距' },
  zh_tw: { 'SVG code': 'SVG 程式碼', Motif: '圖樣', Dots: '圓點', Grid: '網格', Crosses: '十字', 'Tile size': '圖塊大小', Spacing: '間距' },
  bn: { 'SVG code': 'SVG কোড', Motif: 'নকশা', Dots: 'বিন্দু', Grid: 'জালিকা', Crosses: 'ক্রস', 'Tile size': 'টাইলের আকার', Spacing: 'ব্যবধান' },
  ru: { 'SVG code': 'Код SVG', Rectangle: 'Прямоугольник', Motif: 'Узор', Dots: 'Точки', Grid: 'Сетка', Crosses: 'Кресты', 'Tile size': 'Размер плитки', Spacing: 'Интервал' },
  ur: { 'SVG code': 'SVG کوڈ', Motif: 'نمونہ', Dots: 'نقطے', Grid: 'جالی', Crosses: 'کراس', 'Tile size': 'ٹائل کا سائز', Spacing: 'فاصلہ' },
  tr: { 'SVG code': 'SVG kodu', Motif: 'Desen', Dots: 'Noktalar', Grid: 'Izgara', Crosses: 'Artılar', 'Tile size': 'Döşeme boyutu', Spacing: 'Aralık' },
  vi: { 'SVG code': 'Mã SVG', Motif: 'Họa tiết', Dots: 'Chấm', Grid: 'Lưới', Crosses: 'Dấu cộng', 'Tile size': 'Kích thước ô', Spacing: 'Khoảng cách' },
  it: { 'SVG code': 'Codice SVG', Motif: 'Motivo', Dots: 'Punti', Grid: 'Griglia', Crosses: 'Croci', 'Tile size': 'Dimensione tessera', Spacing: 'Spaziatura' },
  bg: { 'SVG code': 'SVG код', Motif: 'Мотив', Dots: 'Точки', Grid: 'Мрежа', Crosses: 'Кръстове', 'Tile size': 'Размер на плочката', Spacing: 'Разстояние' },
  ca: { 'SVG code': 'Codi SVG', Rectangle: 'Forma rectangular' },
  nl: { 'SVG code': 'SVG-code' }, el: { 'SVG code': 'Κώδικας SVG' },
  ms: { 'SVG code': 'Kod SVG', Motif: 'Corak', Grid: 'Petak' },
  pl: { 'SVG code': 'Kod SVG' }, sv: { 'SVG code': 'SVG-kod', 'X position': 'X-koordinat' },
  th: { 'SVG code': 'โค้ด SVG' }, uk: { 'SVG code': 'Код SVG' }, sw: { 'SVG code': 'Msimbo wa SVG' },
  mr: { 'SVG code': 'SVG कोड' }, te: { 'SVG code': 'SVG కోడ్' }, ha: { 'SVG code': 'Lambar SVG', Motif: 'Tsari', 'SVG preview': 'Duban SVG' },
  tl: { 'SVG code': 'Kodigo SVG', Motif: 'Motibo', Grid: 'Parilya', Spacing: 'Agwat', Foreground: 'Kulay sa harapan', 'Email preview': 'Paunang tingin sa email' },
  ta: { 'SVG code': 'SVG குறியீடு' }, fa: { 'SVG code': 'کد SVG' }, am: { 'SVG code': 'የSVG ኮድ' }, gu: { 'SVG code': 'SVG કોડ' },
};
for (const [language, labels] of Object.entries(authoringLabelFixes)) {
  corrections[language] ??= {};
  corrections[language].ui = { ...corrections[language].ui, ...labels };
}

const toolTitleCorrections = {
  en: { 'api-request-builder': 'Create API Request Code — cURL & Fetch', 'html-table-generator': 'Create HTML Tables from TSV', 'pwa-manifest-generator': 'Create a PWA Web App Manifest' },
  bg: { 'api-request-builder': 'Създаване на код за API заявка — cURL и Fetch' },
  el: { 'pwa-manifest-generator': 'Δημιουργία μανιφέστου εφαρμογής PWA' },
  sv: { 'api-request-builder': 'Skapa API-begärandekod — cURL och Fetch', 'pwa-manifest-generator': 'Skapa ett manifest för en PWA-app' },
  uk: { 'api-request-builder': 'Створення коду API-запиту — cURL і Fetch' },
  tl: { 'api-request-builder': 'Gumawa ng code para sa API request — cURL at Fetch', 'pwa-manifest-generator': 'Gumawa ng manifest para sa PWA web app' },
  fa: { 'pwa-manifest-generator': 'ساخت مانیفست برنامه وب PWA' },
};
for (const [language, titles] of Object.entries(toolTitleCorrections)) {
  corrections[language] ??= {};
  corrections[language].copy = { ...corrections[language].copy };
  for (const [id, title] of Object.entries(titles)) corrections[language].copy[id] = [title];
}
corrections.el.copy['fretboard-trainer'] = ['Εκπαιδευτής ταστιέρας κιθάρας'];
corrections.ha.copy['fretboard-trainer'] = ['Mai koyon bayanin fret na gitar'];
corrections.tl.copy['fretboard-trainer'] = ['Pagsasanay sa mga nota ng fretboard ng gitara'];
corrections.ha.ui = { ...corrections.ha.ui, 'JavaScript Fetch': 'Buƙatar Fetch ta JavaScript' };
corrections.ha.ui['Browser tab'] = 'Shafin burauza';
corrections.tl.ui = { ...corrections.tl.ui, 'Start URL': 'URL ng pagsisimula', 'Display mode': 'Paraan ng pagpapakita' };
corrections.ca.ui = { ...corrections.ca.ui, 'Connect Four board': 'Tauler de quatre en línia' };
corrections.uk.ui = { ...corrections.uk.ui, 'Two players share this device. Moves are not saved or uploaded.': 'Двоє гравців грають на цьому пристрої. Ходи не зберігаються й не надсилаються.', 'Connect Four board': 'Дошка гри в чотири в ряд', 'Reversi board': 'Дошка гри Реверсі' };
corrections.ha.ui['Reversi board'] = 'Allon wasan Reversi';
corrections.tl.ui = { ...corrections.tl.ui, 'Connect Four board': 'Lupon ng larong apat na magkakasunod', 'Reversi board': 'Lupon ng larong Reversi', 'Checkers board': 'Lupon ng dama', 'Pass turn': 'Ipasa ang pagkakataon' };
const periodicTableUiCorrections = {
  tr: { Metal: 'Metal elementi' },
  ca: { '118 elements': '118 elements químics' },
  nl: { Lanthanide: 'Lanthaanreeks', Actinide: 'Actiniumreeks' },
  pl: { Metal: 'Pierwiastek metaliczny' },
  sv: { Metalloid: 'Halvmetall' },
  sw: { Nonmetal: 'Isiyo metali', Metalloid: 'Metaloidi', Lanthanide: 'Lantanidi', Actinide: 'Aktinidi' },
  ha: { Nonmetal: 'Ba ƙarfe ba', Metalloid: 'Tsaka-tsakin ƙarfe', Lanthanide: 'Jerin lanthanide', Actinide: 'Jerin actinide' },
  tl: { Metal: 'Metal na elemento', Nonmetal: 'Hindi metal', Metalloid: 'Metalloid na elemento', Lanthanide: 'Serye ng lanthanide', Actinide: 'Serye ng actinide', 'Periodic table': 'Talahanayang peryodiko' },
  am: { Lanthanide: 'የላንታናይድ ተከታታይ', Actinide: 'የአክቲናይድ ተከታታይ' },
};
for (const [language, labels] of Object.entries(periodicTableUiCorrections)) {
  corrections[language] ??= {};
  corrections[language].ui = { ...corrections[language].ui, ...labels };
}
corrections.tl.copy = { ...corrections.tl.copy, 'periodic-table': ['Libreng interactive periodic table — Hanapin ang mga elemento', 'Periodic table', 'Maghanap ng 118 elemento ayon sa pangalan, simbolo o atomic number, ihambing ang mga detalye at magsanay sa isang maikling pagsusulit.', 'interactive periodic table, talaan ng mga elemento, paghahanap ng simbolo ng elemento, pagsusulit sa periodic table', 'Pumili ng pamilya o grupo, o ilagay ang pangalan, simbolo o atomic number ng elemento.', 'Gumagana ang periodic table na ito sa browser at para sa pag-aaral. Pinapasimple ang mga pangkat ng pamilya; huwag itong gamitin bilang sangguniang pangkaligtasan.'] };
corrections.tl.ui = { ...corrections.tl.ui, 'Mahjong solitaire board': 'Lupon ng larong Mahjong solitaire' };
const translations = structuredClone(previousDrafts);
const refreshSelected = process.env.USEFULVERSE_TRANSLATION_REFRESH === '1';
const targetLanguage = (language) => language === 'zh_tw' ? 'zh-TW' : language;
const generatedPath = new URL('../../src/locales/generated-opportunity-copy.mjs', import.meta.url);

async function translateOne(language, phrase) {
  if (language === 'en') return phrase;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetLanguage(language)); url.searchParams.set('dt', 't'); url.searchParams.set('q', phrase);
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) {
    const error = new Error(`Translate HTTP ${response.status} for ${language}`);
    if (response.status === 429) error.retryAfterMs = Math.max(15000, Number(response.headers.get('retry-after')) * 1000 || 0);
    throw error;
  }
  const value = (await response.json())?.[0]?.map((segment) => segment?.[0] ?? '').join('').trim() ?? '';
  if (!value) throw new Error(`Could not translate a phrase for ${language}: ${phrase}`);
  return value;
}

async function saveDrafts() {
  await writeFile(generatedPath, `export const generatedOpportunityCopy = ${JSON.stringify(translations)};\n`);
}

async function translate(language, phrases) {
  if (language === 'en') return phrases;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetLanguage(language)); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `[88993745${String(index + 1).padStart(4, '0')}]`);
  const protectedPhrases = phrases.map((phrase, phraseIndex) => phrase.replace(/\{(\w+)\}/gu, (_, name, offset) => `__P${phraseIndex}X${[...phrase.slice(0, offset)].filter((character) => character === '{').length}__`));
  url.searchParams.set('q', protectedPhrases.map((phrase, index) => `${markers[index]} ${phrase}`).join('\n'));
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) {
        const error = new Error(`Translate HTTP ${response.status}`);
        if (response.status === 429) error.retryAfterMs = Math.max(15000, Number(response.headers.get('retry-after')) * 1000 || 0);
        throw error;
      }
      const payload = await response.json();
      const text = payload?.[0]?.map((segment) => segment?.[0] ?? '').join('');
      const lines = text.split(/\r?\n/u);
      const values = markers.map((marker) => lines.find((line) => line.includes(marker))?.replace(marker, '').trim() ?? '');
      if (values.length !== phrases.length) throw new Error(`Translation delimiter mismatch for ${language}: ${values.length}/${phrases.length}`);
      for (let index = 0; index < values.length; index += 1) if (!values[index]) values[index] = await translateOne(language, protectedPhrases[index]);
      return values.map((value, phraseIndex) => value.replace(/__P(\d+)X(\d+)__/gu, (_, _tool, index) => {
        const name = [...phrases[phraseIndex].matchAll(/\{(\w+)\}/gu)][Number(index)]?.[1] ?? '';
        return `{${name}}`;
      }));
    } catch (error) {
      if (attempt === 3) throw error;
      const delay = error?.retryAfterMs ?? (500 * (attempt + 1));
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Translation failed for ${language}`);
}

const result = {};
for (const language of Object.keys(locales)) {
  const hasValidPlaceholders = placeholderPhrases.every((phrase) => {
    const expected = [...phrase.matchAll(/\{(\w+)\}/gu)].map((match) => match[1]).sort();
    const actual = [...(translations[language]?.ui?.[phrase] ?? '').matchAll(/\{(\w+)\}/gu)].map((match) => match[1]).sort();
    return JSON.stringify(expected) === JSON.stringify(actual);
  });
  if (!refreshSelected && selected.every((tool) => translations[language]?.copy?.[tool.id])
      && uiPhrases.every((phrase) => translations[language]?.ui?.[phrase]) && hasValidPlaceholders) {
    Object.assign(translations[language].ui, corrections[language]?.ui ?? {});
    for (const [id, values] of Object.entries(corrections[language]?.copy ?? {})) translations[language].copy[id] = [...values, ...translations[language].copy[id].slice(values.length)];
    await saveDrafts();
    console.log(`${language}: already present; skipped`);
    continue;
  }
  if (!refreshSelected && selected.every((tool) => translations[language]?.copy?.[tool.id]) && uiPhrases.every((phrase) => translations[language]?.ui?.[phrase])) {
    const repaired = await translate(language, placeholderPhrases);
    placeholderPhrases.forEach((phrase, index) => { translations[language].ui[phrase] = repaired[index]; });
    Object.assign(translations[language].ui, corrections[language]?.ui ?? {});
    for (const [id, values] of Object.entries(corrections[language]?.copy ?? {})) translations[language].copy[id] = [...values, ...translations[language].copy[id].slice(values.length)];
    await saveDrafts();
    console.log(`${language}: protected UI placeholders repaired`);
    continue;
  }
  const missingUiPhrases = uiPhrases.filter((phrase) => !translations[language]?.ui?.[phrase]);
  const sources = [...selected.flatMap((tool) => [tool.title, tool.shortTitle, tool.description, tool.keywords, tool.intro, tool.body]), ...missingUiPhrases];
  const localized = [];
  for (let offset = 0; offset < sources.length; offset += 25) localized.push(...await translate(language, sources.slice(offset, offset + 25)));
  let cursor = 0;
  const copy = {};
  for (const tool of selected) copy[tool.id] = localized.slice(cursor, cursor += 6);
  const ui = Object.fromEntries(missingUiPhrases.map((phrase, index) => [phrase, localized[selected.length * 6 + index]]));
  translations[language] = { copy: { ...translations[language]?.copy, ...copy }, ui: { ...translations[language]?.ui, ...ui } };
  Object.assign(translations[language].ui, corrections[language]?.ui ?? {});
  for (const [id, values] of Object.entries(corrections[language]?.copy ?? {})) translations[language].copy[id] = [...values, ...translations[language].copy[id].slice(values.length)];
  await saveDrafts();
  console.log(`${language}: ${sources.length} strings translated`);
  await new Promise((resolve) => setTimeout(resolve, 350));
}
console.log(`Wrote draft localization for ${selected.length} tools in ${Object.keys(locales).length} locales.`);
