export const btuCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'BTU calculator', title: 'BTU calculator free & unlimited | UsefulVerse',
  description: 'Estimate room air-conditioner capacity in BTU/h from room size and clear adjustment assumptions. Free, unlimited and local in your browser.',
  intro: 'Estimate a room air-conditioner capacity from floor area, ceiling height, insulation, sunlight, occupants and kitchen use. See every adjustment.',
  howQuestion: 'How many BTUs does my room need?',
  howAnswer: 'Measure the room, choose the matching published area band, then adjust for ceiling height, insulation, sunlight, extra occupants and kitchen use. The result rounds up to the next 1,000 Btu/h.',
  privacyQuestion: 'Are my room measurements uploaded?',
  privacyAnswer: 'No. The estimate runs in your browser. Room dimensions and assumptions are not sent to a server or saved by this tool.',
  fields: {
    length: 'Room length', width: 'Room width', ceilingHeight: 'Ceiling height', dimensionUnit: 'Measurement unit',
    insulationAdjustment: 'Insulation adjustment (%)', sunExposure: 'Sun exposure', occupants: 'People usually in the room', kitchen: 'Is this a kitchen?',
    accuracyNote: 'Planning estimate only, based on ENERGY STAR room-air-conditioner size bands and adjustments. Insulation adjustment is your own assumption. Rooms under 100 sq ft use the chart’s 5,000 Btu/h lower-band value; the published chart starts at 100 sq ft. Above 2,500 sq ft, use a professional load calculation. This is not a Manual J calculation or HVAC design. Actual needs depend on climate, windows, air leaks, orientation and building details. Check equipment instructions and consult a qualified HVAC professional.',
    relatedInsulationCalculator: 'The insulation adjustment is only your assumption; this calculator does not calculate an insulation R-value.',
  },
  actions: {
    calculate: 'Estimate capacity', reset: 'Reset', copy: 'Copy result', example: 'Try 12 × 12 ft room', result: 'Cooling estimate',
    feet: 'Feet', meters: 'Metres', inches: 'Inches', shaded: 'Heavily shaded', typical: 'Typical sunlight', sunny: 'Very sunny',
    no: 'No', yes: 'Yes',
  },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.',
    checkInputs: 'Check room dimensions and adjustment values. The reference chart supports areas up to 2,500 sq ft.',
    roomArea: 'Room floor area', roomVolume: 'Approximate room volume', baseCapacity: 'Base capacity from area band',
    ceilingAdjustment: 'Ceiling-height factor', insulationAdjustment: 'Insulation adjustment', sunAdjustment: 'Sunlight factor',
    occupantAdjustment: 'Extra-occupant adjustment', kitchenAdjustment: 'Kitchen adjustment', capacity: 'Estimated cooling capacity',
    tons: 'Approximate refrigeration tons', belowReferenceBand: 'Room is below the chart’s 100 sq ft lower limit; verify the unit minimum with its manufacturer.',
  },
  additionalFaqs: [
    { question: 'What does a BTU calculator estimate?', answer: 'It estimates cooling capacity in Btu per hour for a room air conditioner. This version uses published room-size bands and shows the assumptions added for ceiling height, insulation, sunlight, people and kitchen use.' },
    { question: 'Can I use this estimate to size central HVAC?', answer: 'No. It is not a Manual J load calculation or central-system design. Whole-home equipment selection needs climate, windows, insulation, air leakage, orientation, duct and other building data reviewed by a qualified professional.' },
  ],
});
