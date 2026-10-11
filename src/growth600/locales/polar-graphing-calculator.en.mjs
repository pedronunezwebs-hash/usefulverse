export const polarGraphingCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved',
  name: 'Polar Graphing Calculator',
  title: 'Polar Graphing Calculator Free | UsefulVerse',
  description: 'Plot polar equations r(θ) in radians or degrees. View the curve and export sampled coordinates to CSV. Free, private and local in your browser.',
  intro: 'Graph a polar equation by entering a radius r as a function of angle θ. Choose degrees or radians, adjust the angle interval and sample count, then inspect the curve and download its coordinates.',
  howQuestion: 'How do you graph a polar equation?',
  howAnswer: 'Enter a radius expression such as 1 or 2*cos(θ), choose an angle interval and unit, then calculate. The graph converts each sampled polar point to x=r cos(θ) and y=r sin(θ). For r=1 from 0° to 360°, the result is the unit circle.',
  privacyQuestion: 'Is my equation uploaded?',
  privacyAnswer: 'No. The equation is parsed and plotted locally in this browser. It is not uploaded or saved by this tool.',
  howTo: ['Enter a radius expression using θ (or t), numbers, arithmetic, pi, e and supported functions such as sin, cos, tan, sqrt and abs.', 'Choose radians or degrees and enter increasing start and end angles plus 50 to 1,500 samples.', 'Calculate to view the graph, copy a small coordinate summary or download all finite sample points as CSV.'],
  example: { label: 'Load the unit circle r=1', values: [] },
  actions: { calculate: 'Plot graph', example: 'Load unit circle', reset: 'Reset', copy: 'Copy sample points', downloadCsv: 'Download CSV', result: 'Polar graph' },
  fields: {
    radiusExpression: 'Radius r(θ)', angleMin: 'Start angle', angleMax: 'End angle', angleUnit: 'Angle unit', radians: 'Radians', degrees: 'Degrees', samples: 'Sample points', chartLabel: 'Polar equation graph', resultCount: 'Valid points',
    accuracyNote: 'Use θ or t as the angle variable. Trigonometric functions follow the chosen angle unit. Supported functions: sin, cos, tan, sqrt, abs, exp, ln and log. Numerical samples may miss discontinuities; this is not symbolic proof. Runs locally; no upload.',
  },
  messages: { calculated: 'Polar graph created.', exampleLoaded: 'Unit-circle example loaded.', checkInputs: 'Check the expression, angle range, unit and sample count.', copied: 'Sample coordinates copied.', copyUnavailable: 'Copy is not available in this browser.', downloaded: 'CSV downloaded.', downloadUnavailable: 'CSV download is unavailable.' },
  additionalFaqs: [
    { question: 'What does r=1 look like in polar coordinates?', answer: 'Every angle is one unit from the origin, so r=1 forms a circle of radius 1 centered at the origin.' },
    { question: 'Can I export polar graph points?', answer: 'Yes. After plotting, download a CSV containing each finite sampled angle, radius and its Cartesian x and y coordinates.' },
  ],
});
