export const carpetCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Carpet calculator',
  title: 'Carpet Calculator Free & Unlimited | UsefulVerse',
  description: 'Plan carpet roll cuts, seams and pile direction for a room. Free, unlimited and calculated in your browser.',
  intro: 'Enter room dimensions and the carpet roll width to compare cut layouts, estimate seams and find how much continuous carpet to order.',
  howQuestion: 'How much carpet do I need for a room?',
  howAnswer: 'The calculator divides the room dimension across the roll by the roll width, rounds up to whole cuts and multiplies by the length of each cut. Choose whether the pile should run along the room length or width, or let the tool compare both directions.',
  privacyQuestion: 'Are my room measurements uploaded?',
  privacyAnswer: 'No. This estimate runs in your browser; room dimensions are not sent to a server or saved by this tool.',
  fields: {
    unit: 'Measurement unit', roomLength: 'Room length', roomWidth: 'Room width', rollWidth: 'Carpet roll width',
    rooms: 'Number of identical rooms', pileDirection: 'Pile direction', wastePercent: 'Extra cutting allowance (%)',
    accuracyNote: 'Planning estimate for rectangular rooms and plain broadloom only. Roll width creates offcuts, so purchased carpet area can exceed floor area. It does not model alcoves, stairs, doorways, pattern repeats, defects, pile shading, joining rooms or reusable offcuts. Confirm roll width and pile direction with the supplier/installer. This lightweight calculation runs locally in your browser.',
  },
  actions: { calculate: 'Plan carpet cuts', reset: 'Reset', copy: 'Copy result', example: 'Try an example', result: 'Carpet cut estimate', meters: 'Metres', feet: 'Feet', eitherDirection: 'Use less material', alongRoomLength: 'Pile along room length', alongRoomWidth: 'Pile along room width' },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.', checkInputs: 'Check room size, roll width, room count and pile direction.',
    floorArea: 'Total floor area', pileDirection: 'Selected pile direction', cuts: 'Full-width cuts per room', seams: 'Seams per room',
    cutLength: 'Length of each cut', orderLength: 'Continuous roll length to order', purchasedArea: 'Approximate purchased area', alternative: 'Other orientation',
  },
  additionalFaqs: [
    { question: 'Why can a carpet roll calculator show more area than the room?', answer: 'The roll has a fixed width. Rounding up to whole-width cuts leaves edge offcuts, so the purchased roll area may be greater than the room floor area.' },
    { question: 'Does the carpet calculator keep the pile direction consistent?', answer: 'It plans all cuts in one selected direction. It does not account for pattern matching, pile shading or room-to-room joins; confirm the installation direction with the supplier or installer.' },
  ],
});
