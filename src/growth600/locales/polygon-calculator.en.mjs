export const polygonCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Polygon Calculator',
  title: 'Polygon Calculator Free & Unlimited | UsefulVerse',
  description: 'Find a regular polygon’s area, perimeter, apothem and angles from a side, apothem or radius. Free local calculator with no account.',
  intro: 'Calculate a regular polygon with 4 to 1,000 sides. Enter a side length, the center-to-side distance or the center-to-vertex distance to find area, perimeter and angles.',
  howQuestion: 'How do I calculate a regular polygon?',
  howAnswer: 'Choose the number of sides and enter one length: a side, the perpendicular distance from the center to a side, or the distance from the center to a vertex. Use one unit; area is returned in that unit squared.',
  privacyQuestion: 'Are my measurements uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser and the measurements are not uploaded.',
  fields: {
    sides: 'Number of sides (4–1,000)', dimensionMode: 'Known measurement', sideLength: 'Side length', apothem: 'Center-to-side distance', circumradius: 'Center-to-vertex distance', dimension: 'Measurement', unit: 'Length unit (optional)',
    accuracyNote: 'For regular convex polygons only. Enter a positive length and keep one unit throughout. Triangles are handled by our triangle calculator.',
    resultSummary: 'Regular polygon results', perimeter: 'Perimeter', area: 'Area', computedSide: 'Side length', computedApothem: 'Center-to-side distance', computedCircumradius: 'Center-to-vertex distance', interiorAngle: 'Interior angle', centralAngle: 'Central angle', formulaNote: 'Area is half the perimeter multiplied by the perpendicular distance from the center to a side. Angles are shown in degrees.',
  },
  actions: { calculate: 'Calculate', example: 'Load hexagon example', reset: 'Reset', copy: 'Copy results', result: 'Results' },
  messages: { calculated: 'Polygon results calculated.', checkInputs: 'Check the side count and measurement.', copied: 'Results copied.', copyUnavailable: 'Clipboard is unavailable in this browser.' },
  additionalFaqs: [
    { question: 'How do I find the area of a regular polygon?', answer: 'Enter its number of sides and one known measurement. The calculator derives the apothem and perimeter, then uses area = perimeter × apothem ÷ 2.' },
    { question: 'Which lengths can I enter?', answer: 'Enter a side length, the perpendicular distance from the center to a side, or the distance from the center to a vertex. The side count determines the remaining dimensions.' },
  ],
});
