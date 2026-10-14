export const sudokuSolverEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Sudoku Solver',
  title: 'Sudoku Solver Online Free | UsefulVerse',
  description: 'Enter a Sudoku grid, check conflicts, solve it or reveal one supported step. Free, private and local in your browser.',
  intro: 'Enter digits 1–9 and leave empty cells blank. Check the board, solve it, or reveal a real naked or hidden single.',
  howQuestion: 'Can this Sudoku solver tell whether a puzzle has one solution?',
  howAnswer: 'It searches for up to two solutions locally. It reports a unique solution only after the bounded search is complete; multiple solutions, invalid entries, impossible boards and search limits are reported separately.',
  privacyQuestion: 'Is this Sudoku solver free and private?',
  privacyAnswer: 'Yes. The grid and solving run in your browser. The board is not uploaded or saved by this tool.',
  fields: { board: 'Sudoku grid', cell: 'Row', column: 'column', note: 'Enter one digit per cell; use the arrow keys to move. Empty cells are allowed.', accuracyNote: 'Search is capped at 250,000 nodes. A limited search is never labeled unique. “Show one step” supports naked and hidden singles only; it does not claim to explain advanced techniques.', nakedSingle: 'naked single', hiddenSingle: 'hidden single' },
  actions: { example: 'Load example', solve: 'Solve Sudoku', step: 'Show one step', clear: 'Clear grid' },
  messages: { invalidDigit: 'Enter a single digit from 1 to 9, or leave the cell empty.', exampleLoaded: 'Example grid loaded. Given digits are locked.', cleared: 'Grid cleared.', conflict: 'Some given digits repeat in a row, column or 3×3 box.', unsatisfiable: 'This grid follows the basic no-repeat checks but has no solution.', searchLimited: 'The local search reached its safety limit. No uniqueness claim was made; simplify the grid or try again.', unique: 'Solved. The completed search found exactly one solution.', multiple: 'Found at least {count} solutions. The first is shown; this puzzle is not unique.', complete: 'The grid is already full.', noSingle: 'No naked or hidden single was found. This does not mean the puzzle has no solution.', step: 'Placed {digit} at row {row}, column {column} using a {technique}.' },
  additionalFaqs: [
    { question: 'Does the solver work offline?', answer: 'After the page has loaded, the solving logic runs in the browser without sending the grid to a server.' },
    { question: 'Why does the solver report multiple solutions?', answer: 'A Sudoku grid can be incomplete enough to allow different valid completions. This tool checks for at least two and does not call such a grid unique.' },
    { question: 'Which solving steps does it explain?', answer: 'The step helper reveals naked singles and hidden singles in a row, column or 3×3 box. More advanced human techniques are not implemented.' },
  ],
});
export default sudokuSolverEnglishCopy;
