export const nurikabeEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Nurikabe puzzle',
  title: 'Nurikabe Puzzle Online Free | UsefulVerse',
  description: 'Play a free Nurikabe logic puzzle online. Connect the sea, avoid 2×2 sea blocks and build each numbered island. No account.',
  intro: 'Mark the sea around the numbered islands. Keep the sea connected, avoid every 2×2 sea square, and give each clue an island of exactly its size.',
  howQuestion: 'How do you solve a Nurikabe puzzle?',
  howAnswer: 'Each number belongs to one connected island with exactly that many cells. Islands cannot touch each other by a side. All remaining sea cells must connect, and four sea cells cannot form a 2×2 square. Tap a blank cell to mark it as sea; tap it again to clear it. Use Check board or ask for a one-cell hint.',
  privacyQuestion: 'Are my moves uploaded or saved?',
  privacyAnswer: 'No. Puzzle generation, checks and hints run in this browser. Your moves are not uploaded or saved by this tool.',
  fields: {
    difficulty: 'Difficulty', board: 'Nurikabe puzzle grid', rules: 'Each number starts one island containing exactly that many cells. Islands cannot touch by sides. Every other cell is sea: all sea cells must connect, and no 2×2 square may be entirely sea. Tap a blank cell to mark sea; tap it again to clear the mark. Numbered clues cannot be changed.',
    accuracyNote: 'Fresh puzzles are checked locally for one solution. If generation reaches its safety limit, a verified puzzle is rotated for a different layout.',
    cell: 'Cell', row: 'row', column: 'column', sea: 'sea', island: 'island',
  },
  actions: { newGame: 'New puzzle', checkBoard: 'Check board', hint: 'One-cell hint', clearMarks: 'Clear sea marks', easy: 'Easy', medium: 'Medium', hard: 'Hard', rules: 'Rules' },
  messages: {
    newPuzzle: 'New puzzle ready.', solved: 'Solved! The islands and sea follow every rule.', clueInSea: 'A numbered clue is marked as sea.', seaSquare: 'Four sea cells make a 2×2 square.', seaDisconnected: 'All sea cells must connect by sides.', islandsTouch: 'Two numbered islands touch by a side.', islandWithoutClue: 'A land region has no numbered clue.', islandSize: 'An island does not match its clue size.',
    hintSea: 'This cell is sea.', hintIsland: 'Keep this cell in an island.', noHint: 'The puzzle is already solved.', marksCleared: 'Sea marks cleared.', markedSea: 'Marked as sea.', markedIsland: 'Sea mark cleared.', generationFailed: 'Could not create a puzzle. Try again.',
  },
  additionalFaqs: [
    { question: 'What are the rules of Nurikabe?', answer: 'Each numbered island has one clue and exactly the number of cells shown. Islands cannot touch by sides. The sea must be connected and cannot contain a 2×2 block.' },
    { question: 'Does every puzzle have one solution?', answer: 'The generator accepts a fresh puzzle only after a bounded local search exhaustively proves that it has one solution. A verified fallback is used if generation reaches its limit.' },
  ],
  localizationStatus: 'approved',
});
