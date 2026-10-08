export const drywallEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Drywall calculator', title: 'Drywall calculator free & unlimited | UsefulVerse',
  description: 'Estimate drywall sheets, joint seams, screws and material cost for room walls and ceilings. Free browser calculator, no account.',
  intro: 'Estimate board sheets for one or more similar rooms. Include walls, an optional ceiling, openings, extra material, screws and an optional sheet price.',
  howQuestion: 'How many drywall sheets do I need for a room?',
  howAnswer: 'Enter the inside room length, width and wall height, then choose how many similar rooms to cover. Subtract the total door and window area per room. Include the ceiling if needed, enter your board size and extra-material percentage, and calculate. Sheet count is based on surface area, so cuts and layout can change the order quantity.',
  privacyQuestion: 'Are my room measurements uploaded?',
  privacyAnswer: 'No. The estimate runs in your browser and does not send room measurements to a server.',
  fields: {
    roomLength: 'Inside room length', roomWidth: 'Inside room width', wallHeight: 'Wall height',
    openingArea: 'Door and window area per room (optional)', roomCount: 'Number of similar rooms', unit: 'Measurement unit',
    includeCeiling: 'Surfaces to cover', boardWidth: 'Board width', boardHeight: 'Board length',
    wastePercent: 'Extra material (%)', screwsPerBoard: 'Estimated screws per board',
    pricePerBoard: 'Price per board (optional)',
    accuracyNote: 'Area-based planning estimate only. Sheet cuts, offcut reuse, board layout, fire/moisture rating, joint design and fastener spacing vary. Check the product label and installation instructions. Add a price in your own currency; currency is not assumed.',
  },
  actions: {
    calculate: 'Calculate', reset: 'Reset', copy: 'Copy result', example: 'Try a room example', result: 'Drywall estimate',
    meters: 'Meters', centimeters: 'Centimeters', millimeters: 'Millimeters', feet: 'Feet', inches: 'Inches',
    withCeiling: 'Walls and ceiling', wallsOnly: 'Walls only',
  },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.',
    checkInputs: 'Check room dimensions, openings, board size, room count and optional cost.',
    wallArea: 'Net wall area', ceilingArea: 'Ceiling area', totalArea: 'Total surface area',
    boardCount: 'Whole boards to order', boardCoverage: 'Nominal board coverage', estimatedScrews: 'Estimated screws',
    jointSeams: 'Approximate board-joint seam length', estimatedCost: 'Estimated board cost', costNotEntered: 'Enter a board price to estimate material cost.',
  },
  additionalFaqs: [
    { question: 'Does the sheet estimate account for doors, windows and waste?', answer: 'You can subtract the combined opening area per room and add a 0–30% extra-material allowance. The board count is area-based; cuts, layout and whether offcuts can be reused may change the quantity to buy.' },
    { question: 'Does this calculator specify drywall joints or screw spacing?', answer: 'No. It gives a rough seam-length and screw-count estimate from your board size and screw allowance. Use the manufacturer’s instructions and local requirements for joint treatment, board rating and fastener pattern.' },
  ],
});
