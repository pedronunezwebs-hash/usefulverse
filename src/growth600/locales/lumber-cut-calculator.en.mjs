export const lumberCutCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Lumber Cut List Optimizer',
  title: 'Cut List Optimizer Free | UsefulVerse',
  description: 'Plan lumber cuts by stock length and saw kerf. See board layouts and offcuts with this free browser-based cut list optimizer.',
  intro: 'Enter stock length, saw kerf and the pieces you need. This free cut list optimizer groups linear cuts into boards and shows each layout and leftover.',
  howQuestion: 'How does a cut list optimizer account for saw kerf?',
  howAnswer: 'This calculator reserves the entered kerf once for every produced piece, then uses a best-fit-decreasing heuristic to place longer cuts first and fill the closest-fitting board. It is a practical plan, not a guarantee of the globally fewest boards.',
  privacyQuestion: 'Are my cut dimensions uploaded?',
  privacyAnswer: 'No. The calculation runs locally in your browser. Your cut list is not sent to a server or saved by this tool.',
  fields: {
    unit: 'Shared unit for every length', stockLength: 'Available stock length', kerf: 'Saw blade kerf per piece',
    cutList: 'Cut list (one length per line; add × quantity, for example 600 × 3)',
    accuracyNote: 'Planning heuristic only: assumes straight cuts and one kerf allowance per piece. It does not account for defects, grain direction, trim ends, angled cuts or tool setup. Verify the layout and measurements against your actual stock before cutting. This tool uses your device and does not upload your list.',
  },
  actions: { calculate: 'Optimize cut list', reset: 'Reset', copy: 'Copy plan', example: 'Try an example', result: 'Board-by-board cutting plan', millimeters: 'Millimeters (mm)', centimeters: 'Centimeters (cm)', meters: 'Meters (m)', inches: 'Inches (in)', feet: 'Feet (ft)' },
  messages: {
    copied: 'Plan copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Cutting plan ready.', checkInputs: 'Check stock length, kerf and cut list.',
    stockBoards: 'Stock boards needed (heuristic)', pieces: 'Pieces', totalStock: 'Total stock length', totalCut: 'Total requested cut length', totalKerf: 'Total kerf allowance', totalOffcut: 'Total remaining offcut', lowerBound: 'Simple theoretical board lower bound (not a plan)', board: 'Board', remaining: 'remaining', kerf: 'kerf',
  },
  additionalFaqs: [
    { question: 'Does this guarantee the fewest boards?', answer: 'No. It uses a deterministic best-fit-decreasing heuristic. The theoretical lower bound shown is only a comparison and may be lower than the practical plan.' },
    { question: 'How should I enter quantities?', answer: 'Enter one cut per line, such as “600 × 3” for three pieces 600 units long. If no quantity is included, one piece is assumed. Use the same unit for stock, kerf and every cut.' },
  ],
});
