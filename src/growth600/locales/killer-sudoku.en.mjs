export const killerSudokuEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Killer Sudoku',
  title: 'Killer Sudoku Online Free | UsefulVerse',
  description: 'Play Killer Sudoku online with fresh sum-cage puzzles, hints and checks. Free in your browser; no account or upload.',
  intro: 'Fill the 9×9 grid using classic Sudoku rules. Every outlined cage also has a target sum, and digits cannot repeat inside a cage.',
  howQuestion: 'How do you play Killer Sudoku?',
  howAnswer: 'Complete each row, column and 3×3 box with digits 1–9 without repeats. Cells in each cage must add to its small target number, and a digit cannot repeat inside that cage. Choose a cage density, check your entries, reveal one-cell hints or undo an entry.',
  privacyQuestion: 'Is Killer Sudoku free and private?',
  privacyAnswer: 'Yes. Puzzle generation and play run in this browser. Entries are not uploaded or saved as a history.',
  fields: { difficulty: 'Cage density', board: 'Killer Sudoku grid', rules: 'Use digits 1–9 once in every row, column and 3×3 box. Cells grouped into a cage must add to the small target shown in its first cell; no digit repeats within a cage. A one-cell cage directly gives its value.', accuracyNote: 'Each new puzzle is generated locally and checked for one solution with a bounded solver. Difficulty changes the number of cages, not a calibrated human-solving rating. Your entries are not uploaded or saved.', cell: 'Cell', row: 'row', column: 'column', cageSum: 'cage sum', notes: 'Killer Sudoku rules' },
  actions: { newGame: 'New puzzle', checkBoard: 'Check grid', hint: 'Reveal one cell', undo: 'Undo entry', rules: 'Rules', easy: 'More clues', regular: 'Balanced', hard: 'Fewer clues' },
  messages: { newPuzzle: 'A new Killer Sudoku puzzle is ready.', solved: 'Solved! Every row, column, box and cage is correct.', incomplete: 'Fill the grid before checking the full solution.', invalidEntry: 'Some entries conflict with Sudoku or cage rules.', hint: 'Revealed the answer at row {row}, column {column}.', noHint: 'There are no blank cells for a hint.', undo: 'Your previous entry was restored.', undoEmpty: 'There is no entry to undo.', generationFailed: 'Could not verify a new puzzle within the local limit. Try again.' },
  additionalFaqs: [
    { question: 'What is different about Killer Sudoku?', answer: 'It uses the usual Sudoku row, column and 3×3 box rules, plus cages. The digits in a cage must add to the printed target and cannot repeat.' },
    { question: 'Does a new Killer Sudoku puzzle have one solution?', answer: 'The browser uses a bounded solver to check that a generated puzzle has exactly one solution before showing it. If the check cannot finish within its limit, the game asks you to try again.' },
    { question: 'Is Killer Sudoku difficulty an official rating?', answer: 'No. The selector changes how many cages the puzzle has. It is not a certified rating of the human solving techniques required.' },
  ],
});
export default killerSudokuEnglishCopy;
