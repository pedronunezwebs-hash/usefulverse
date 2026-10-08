export const balusterSpacingCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Baluster Spacing Calculator',
  title: 'Baluster Spacing Calculator Free | UsefulVerse',
  description: 'Space balusters evenly or calculate a count from your chosen maximum gap. Free layout math in your browser.',
  intro: 'Enter the clear distance between the inside faces of two posts and the baluster width. Calculate an even gap for a chosen count or the minimum count that stays under your chosen gap.',
  howQuestion: 'How do I space balusters evenly?',
  howAnswer: 'Subtract the combined width of the balusters from the clear opening, then divide the remainder by the number of spaces. This calculator includes an equal space at both ends, so the number of gaps is one more than the number of balusters.',
  privacyQuestion: 'Are my measurements uploaded?',
  privacyAnswer: 'No. The spacing calculation runs locally in this browser; measurements are not sent to a server or saved by this tool.',
  fields: {
    mode: 'Calculation method', maxGapMode: 'Find count from maximum gap', countMode: 'Calculate gap from count',
    openingWidth: 'Clear opening between posts', balusterWidth: 'Width of each baluster', unit: 'Length unit',
    maximumGap: 'Maximum clear gap you choose', balusterCount: 'Number of balusters',
    accuracyNote: 'Layout arithmetic only. It includes equal end gaps and does not determine code-compliant guard openings, strength, loads, fasteners or safety. Local limits may measure openings differently. Check current local building requirements and have a qualified professional review the design before building.',
  },
  actions: { calculate: 'Calculate spacing', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Uniform spacing estimate', millimeters: 'Millimeters', centimeters: 'Centimeters', meters: 'Meters', inches: 'Inches', feet: 'Feet' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Spacing estimate ready.', checkInputs: 'Check the opening, baluster width, count or maximum gap and selected unit.',
    balusterCount: 'Balusters to fit', gapCount: 'Equal clear gaps, including both ends', uniformClearGap: 'Uniform clear gap', totalBalusterWidth: 'Total width of all balusters', totalClearGap: 'Total width of all clear gaps',
  },
  additionalFaqs: [
    { question: 'How many gaps are there for a row of balusters?', answer: 'With a clear space at both ends, a row of N balusters has N + 1 equal gaps. The calculator uses that convention and states it in the result.' },
    { question: 'Does this calculator check building-code safety?', answer: 'No. It only distributes a chosen count or maximum gap evenly. Applicable codes may define measurement methods and limits; confirm them with local authorities and a qualified professional.' },
  ],
});
