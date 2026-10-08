export const hashiPuzzleEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Hashi Puzzle',
  title: 'Free Hashi Puzzle Online | UsefulVerse',
  description: 'Play a free Hashi Bridges puzzle online. Connect every island with one or two non-crossing bridges, check your route and get a hint.',
  intro: 'Connect the numbered islands with one or two bridges. Bridges join the nearest islands in a row or column, never cross, and must leave every island in one connected network.',
  howQuestion: 'How do you play Hashi?',
  howAnswer: 'Each number tells how many bridge lines must touch that island. Click a bridge path to add one line, click again for a second, and click once more to remove it. Bridges may not cross, and all islands must connect. Use Check, Hint, Undo or Clear board as needed.',
  privacyQuestion: 'Is this Hashi puzzle free and private?',
  privacyAnswer: 'Yes. The puzzle runs in this browser. UsefulVerse does not upload or save your game.',
  fields: {
    difficulty: 'Difficulty', board: 'Hashi Bridges puzzle board',
    rules: 'Each island number is its exact total number of bridge lines. Join only the nearest islands in a horizontal row or vertical column. A pair may have one or two bridges, bridges cannot cross, and every island must be reachable from every other island. Click a bridge path to cycle between zero, one, two and zero lines. Generation and checking run locally in this browser.',
    accuracyNote: 'New puzzles are generated on this device and checked for a single solution when possible. If the bounded generator cannot find one quickly, it provides a verified simple fallback. No progress is uploaded or saved.',
    island: 'Island', needs: 'needs', current: 'bridges placed', bridge: 'Bridge path from island', to: 'to', toggleHint: 'Activate to change the bridge count.',
  },
  actions: { newGame: 'New puzzle', checkBoard: 'Check puzzle', hint: 'One-bridge hint', undo: 'Undo', clearBoard: 'Clear bridges', rules: 'Rules', easy: 'Easy', regular: 'Medium', hard: 'Hard' },
  messages: {
    newPuzzle: 'A new uniquely checked Hashi puzzle is ready.', fallbackPuzzle: 'A verified simple Hashi puzzle is ready.', solved: 'Correct! Every island has its bridge count and the network is connected.', degree: 'One or more islands do not have the required number of bridges.', crossing: 'Bridges cannot cross.', disconnected: 'Every island must connect to the same network.',
    hint: 'Hint: set this path’s bridge count to {count}.', noHint: 'The puzzle is already solved.', undo: 'The previous bridge change was restored.', undoEmpty: 'There is no bridge move to undo.', cleared: 'All bridge marks were cleared.', bridgeChanged: 'Bridge count on this path: {count}.', islandFull: 'That would exceed an island’s bridge number.',
  },
  additionalFaqs: [
    { question: 'What do the numbers mean in Hashi?', answer: 'Each number is the exact number of bridge lines that must touch that island. A double bridge counts as two lines.' },
    { question: 'Can Hashi bridges cross?', answer: 'No. Bridges are straight horizontal or vertical paths between the nearest islands, and crossing paths are not allowed.' },
    { question: 'Does every island need to connect?', answer: 'Yes. The finished bridge network must connect every island, with no isolated group.' },
  ],
  localizationStatus: 'approved',
});
