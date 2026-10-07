export const deckCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Deck board calculator', title: 'Deck board calculator free & unlimited | UsefulVerse',
  description: 'Estimate deck board rows, stock boards, support lines, fasteners and material cost. Free calculator that runs in your browser.',
  intro: 'Estimate boards for an outdoor wooden deck from its rectangular size, board width, gap, stock length and support spacing. Add waste and an optional board price.',
  howQuestion: 'How many deck boards do I need?',
  howAnswer: 'For an outdoor wooden deck, enter the length along the board direction and the width across it. Add the actual board width, gap, stock-board length and joist spacing from your plan. The estimate counts rows, approximate stock boards, support lines and fasteners.',
  privacyQuestion: 'Are my deck measurements uploaded?',
  privacyAnswer: 'No. This estimate runs in your browser and does not send your measurements to a server.',
  fields: {
    unit: 'Deck length unit', length: 'Deck length (board direction)', width: 'Deck width', boardUnit: 'Unit for board width, gap and support spacing', boardWidth: 'Actual board width', gap: 'Gap between boards',
    stockBoardLength: 'Stock board length', joistSpacing: 'Support / joist spacing', wastePercent: 'Extra board material (%)',
    fastenersPerIntersection: 'Fasteners at each board/support crossing', pricePerBoard: 'Price per stock board (optional)',
    safetyNote: 'Planning estimate only. Assumes a rectangular deck and a simple repeating layout. It does not design framing, foundations, stairs, guards, drainage, code compliance or safe construction. Board-end joints must land on suitable supports; the count does not produce a cut map or verify joint support. Check product instructions and local rules with a qualified builder.',
  },
  actions: {
    calculate: 'Calculate', reset: 'Reset', copy: 'Copy result', example: 'Try a 16 × 12 ft example', result: 'Deck material estimate',
    meters: 'Meters', centimeters: 'Centimeters', millimeters: 'Millimeters', feet: 'Feet', inches: 'Inches',
  },
  messages: {
    copied: 'Copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Estimate ready.',
    checkInputs: 'Check dimensions, board width, gap, stock length, support spacing and optional price.',
    area: 'Deck area', boardRows: 'Decking board rows', coveredWidth: 'Width covered by boards and gaps',
    orderLength: 'Total board length including extra material', boards: 'Stock boards to order', supportLines: 'Support lines across the board run',
    fasteners: 'Estimated fasteners', joints: 'Board-end joints to plan and support', estimatedCost: 'Estimated material cost', costNotEntered: 'Add a stock-board price to estimate material cost.',
  },
  additionalFaqs: [
    { question: 'What if my stock boards are shorter than the deck?', answer: 'The estimate includes multiple pieces per row in its total linear-material count. It reports approximate end joints, but does not create a cut layout or confirm that each joint lands on adequate framing. Plan and support every joint before buying.' },
    { question: 'Does this calculator tell me how to build a safe deck?', answer: 'No. It estimates surface boards and a simplified fastener count only. Joists, beams, posts, foundations, loads, guards, stairs, permits and local building rules require a separate design and qualified review.' },
  ],
});
