export const parametricEquationEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Parametric Equation Calculator',
  title: 'Parametric Equation Calculator Free | UsefulVerse',
  description: 'Plot x(t) and y(t) curves, adjust the parameter range, and export coordinates. Free, private and in your browser.',
  intro: 'Graph a curve defined by separate x(t) and y(t) equations. Choose a parameter interval and resolution, inspect the plotted path, and download sampled coordinates as CSV.',
  howQuestion: 'How do I graph a parametric equation?',
  howAnswer: 'Enter one expression for x(t) and another for y(t), then choose the start, end and number of samples for t. The graph uses radians. For example, x(t) = cos(t) and y(t) = sin(t) trace a unit circle from 0 to 2π.',
  privacyQuestion: 'Are my equations uploaded?',
  privacyAnswer: 'No. Expressions are evaluated locally in your browser with a limited math parser. They are not uploaded or saved by this tool.',
  fields: {
    xExpression: 'x(t) equation', yExpression: 'y(t) equation', tMin: 'Parameter start t', tMax: 'Parameter end t', samples: 'Number of samples',
    expressionHint: 'Use t, pi, e, +, −, *, /, ^, parentheses, and sin, cos, tan, sqrt, abs, exp, ln or log. Use * for multiplication; angles are in radians. Example: cos(t).',
    accuracyNote: 'This is a numerical plot, not a symbolic proof. The line joins finite sample points; discontinuities or asymptotes may need a narrower interval or more samples. Coordinates are bounded for display.',
    chartLabel: 'Parametric curve plot', resultCount: 'Finite points plotted',
  },
  actions: { calculate: 'Plot curve', example: 'Load unit circle example', reset: 'Clear', result: 'Parametric graph', downloadCsv: 'Download coordinates CSV' },
  messages: {
    calculated: 'The curve has been plotted.', checkInputs: 'Check both expressions, the increasing parameter range, and the sample count (50–1,500).',
    exampleLoaded: 'Unit circle example plotted.', downloaded: 'Coordinate CSV downloaded.', downloadUnavailable: 'CSV download is not available in this browser.',
  },
  additionalFaqs: [
    { question: 'What is a parametric equation?', answer: 'A parametric curve gives each coordinate as a function of a shared parameter, such as x(t) and y(t). Changing t traces points along the curve.' },
    { question: 'Can I plot a circle with x(t) and y(t)?', answer: 'Yes. Use x(t) = cos(t), y(t) = sin(t), and a range from 0 to 2π to draw a unit circle.' },
    { question: 'Can I export the plotted points?', answer: 'Yes. After plotting, download a CSV with the sampled parameter t and its x and y coordinates. Invalid samples are omitted.' },
  ],
});
