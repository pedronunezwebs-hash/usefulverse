export const slitherlinkEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Slitherlink Puzzle',
  title: 'Free Slitherlink | UsefulVerse',
  description: 'Free Slitherlink puzzles: draw one loop by the number clues. Use hints and undo locally.',
  intro: 'Draw a single closed loop along the grid lines. Each number tells you exactly how many of its four surrounding edges belong to the loop.',
  howQuestion: 'How do you solve a Slitherlink puzzle?',
  howAnswer: 'Click or tap an edge to switch it on or off. The loop must be continuous, every used corner must have exactly two line segments, and each numbered cell must have the stated number of surrounding edges. Use Check board to find mistakes, Undo to reverse a move, or One-edge hint for a small nudge.',
  privacyQuestion: 'Is my Slitherlink puzzle uploaded or saved?',
  privacyAnswer: 'No. Puzzle generation, checks and hints run locally in this page. Your moves are not uploaded or saved by UsefulVerse.',
  fields: {
    size: 'Grid size', board: 'Slitherlink puzzle grid',
    rules: 'Draw one continuous, closed loop along the grid edges. A number shows how many of that cell’s four sides are part of the loop. A grid corner touched by the loop must have exactly two selected edges. Tap an edge again to remove it.',
    accuracyNote: 'New puzzles are generated on this device and accepted only after a bounded local search confirms one solution. Generation uses device processing and may take longer on a slower phone or computer.',
    row: 'row', column: 'column', horizontal: 'horizontal edge', vertical: 'vertical edge',
  },
  actions: { newGame: 'New puzzle', checkBoard: 'Check board', hint: 'One-edge hint', undo: 'Undo', clearMarks: 'Clear lines', rules: 'Rules', small: 'Small', medium: 'Medium', large: 'Large' },
  messages: {
    newPuzzle: 'New puzzle ready.', solved: 'Solved! The clues and single loop are correct.', loopError: 'Check the loop: each used corner needs exactly two lines, all lines must connect, and there can only be one loop.',
    clueError: 'One or more numbered cells have the wrong number of surrounding lines.', hintOn: 'This edge belongs in the loop.', hintOff: 'This edge should stay empty.', noHint: 'The puzzle is already solved.', undoEmpty: 'There is no move to undo.', edgeOn: 'Line added.', edgeOff: 'Line removed.', marksCleared: 'All lines cleared.', generationFailed: 'Could not make a checked puzzle this time. Try again or choose a smaller grid.',
  },
  additionalFaqs: [
    { question: 'What is the rule for the numbers in Slitherlink?', answer: 'Each number from 0 to 3 is the exact count of the four grid edges around that cell that must be part of the loop. Empty cells have no number clue.' },
    { question: 'Can a Slitherlink solution contain two separate loops?', answer: 'No. The drawn edges must make exactly one closed, continuous loop. Every corner on the loop has two selected edges; no branches or detached loops are allowed.' },
    { question: 'Does this free Slitherlink game save my moves?', answer: 'No. The puzzle is generated and checked in your browser. Moves are not uploaded or saved; start a new puzzle to get another board.' },
  ],
  localizationStatus: 'approved',
});
