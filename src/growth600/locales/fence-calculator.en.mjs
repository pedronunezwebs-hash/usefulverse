export const fenceCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Fence calculator', title: 'Fence calculator free unlimited | UsefulVerse',
  description: 'Estimate fence posts, gates, panels or pickets, spacing and material cost. Free browser calculator with no usage limit.',
  intro: 'Estimate a straight fence run with evenly spaced gates. Compare panel and picket infill, set post spacing and add optional item prices.',
  howQuestion: 'How many fence posts and panels do I need?',
  howAnswer: 'Enter the total straight run, gate count and gate opening width. The remaining fence is split evenly between the ends and gates. Set the maximum post spacing, panel width or picket width and gap to estimate the two infill options. If gates are not evenly spaced, this estimate will not match the exact layout.',
  privacyQuestion: 'Are my fence measurements uploaded?',
  privacyAnswer: 'No. This estimate runs in your browser and does not send your measurements to a server.',
  fields: {
    unit: 'Unit for total fence length', length: 'Total straight fence run', gateCount: 'Number of gates', gateWidth: 'Width of each gate opening',
    materialUnit: 'Unit for gates, posts, panels and pickets', postSpacing: 'Maximum post spacing', panelWidth: 'Panel width',
    picketWidth: 'Picket board width', maxPicketGap: 'Maximum gap between pickets', picketHeight: 'Picket cut length / fence height',
    wastePercent: 'Extra panels or pickets (%)', pricePerPost: 'Price per post (optional)', pricePerGate: 'Price per gate (optional)',
    pricePerPanel: 'Price per panel (optional)', pricePerPicket: 'Price per picket (optional)',
    accuracyNote: 'Planning estimate, not a construction plan. Gates are assumed evenly spaced along one straight run. Fence sections are split evenly; post spacing is treated as a maximum, and endpoint posts are counted for every section. The panel and picket totals are alternative infill options. Corner sharing, slopes, terrain, rails, foundations, concrete, hinges, latches, wind loads, permits and local codes are not designed. Check product sizes and have the layout reviewed by a qualified installer.',
  },
  actions: {
    calculate: 'Calculate estimate', reset: 'Reset', copy: 'Copy result', example: 'Try a 100 ft example with one gate', result: 'Fence material estimate',
    meters: 'Meters', centimeters: 'Centimeters', millimeters: 'Millimeters', feet: 'Feet', inches: 'Inches',
  },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.',
    checkInputs: 'Check the run, gate count and width, spacing, panel and picket sizes, extra material and prices.',
    totalRun: 'Total straight run', gateOpening: 'Gate openings (count · total width)', fenceLength: 'Fence length excluding gates', sections: 'Fence sections assumed',
    averageSection: 'Average fence section', posts: 'Posts, including section ends and gate sides', panels: 'Panels to order (panel option)', pickets: 'Pickets to order (picket option)',
    picketGap: 'Evenly adjusted gap between pickets', picketLength: 'Total picket cut length including extra pieces', extra: 'extra', onePicket: 'One picket per section; no interior gap',
    panelCost: 'Estimated panel-option cost', picketCost: 'Estimated picket-option cost',
  },
  additionalFaqs: [
    { question: 'How many posts does one isolated fence section need?', answer: 'One straight section needs posts at both ends, so even a short section starts with two posts. This estimate counts both ends of every section and divides each assumed section by the maximum post spacing.' },
    { question: 'Does it place gates at their exact positions?', answer: 'No. It splits the remaining fence length evenly between the ends and gate openings because gate positions are not entered. Move the gates or use a measured plan if your sections have different lengths.' },
  ],
});
