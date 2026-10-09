export const sectionModulusCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Section Modulus Calculator',
  title: 'Section Modulus Calculator Free | UsefulVerse',
  description: 'Calculate centroid, Ix, Iy and section modulus for common shapes. Free, unlimited browser calculations; no account.',
  intro: 'Find area, centroid, second moments of area and elastic section modulus for a rectangle, circle, hollow section or triangle.',
  howQuestion: 'How do I calculate section modulus?',
  howAnswer: 'Choose a basic cross-section, enter its dimensions in one consistent unit and calculate. The tool reports centroidal Ix and Iy plus elastic section moduli about the x and y axes. For a square, Ix equals Iy. Results are geometric properties only, not a structural capacity or design check.',
  privacyQuestion: 'Are my dimensions uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser; entered dimensions are not uploaded or saved by this tool.',
  fields: {
    shape: 'Cross-section shape', rectangle: 'Solid rectangle', circle: 'Solid circle', hollowRectangle: 'Hollow rectangle', hollowCircle: 'Hollow circle (tube)', triangle: 'Triangle',
    width: 'Width / base', height: 'Height', diameter: 'Diameter', outerWidth: 'Outer width', outerHeight: 'Outer height', innerWidth: 'Inner width', innerHeight: 'Inner height', outerDiameter: 'Outer diameter', innerDiameter: 'Inner diameter',
    unit: 'Dimension unit', millimeters: 'Millimeters (mm)', centimeters: 'Centimeters (cm)', meters: 'Meters (m)', inches: 'Inches (in)',
    accuracyNote: 'Ideal, prismatic, homogeneous geometry with sharp corners. Hollow sections are concentric/centered. Moments are about centroidal axes parallel to the displayed dimensions. This does not calculate stress capacity, buckling, connections, load resistance or code compliance; have structural designs checked by a qualified engineer.',
  },
  actions: { calculate: 'Calculate section properties', reset: 'Reset', copy: 'Copy results', example: 'Try the square example', result: 'Section properties' },
  messages: { calculated: 'Section properties calculated.', checkInputs: 'Check the selected shape and enter positive dimensions; inner dimensions must be smaller than the outer ones.', copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.', area: 'Area', centroidX: 'Centroid x from left', centroidY: 'Centroid y from base', ix: 'Second moment Ix', iy: 'Second moment Iy', zxTop: 'Section modulus Zx (top)', zxBottom: 'Section modulus Zx (bottom)', zy: 'Section modulus Zy', exampleLoaded: 'Square example loaded.', },
  additionalFaqs: [
    { question: 'What is the difference between moment of inertia and section modulus?', answer: 'The second moment of area (Ix or Iy) describes how area is distributed around an axis and has units of length to the fourth power. Elastic section modulus divides that moment by the farthest distance to the section edge and has units of length cubed.' },
    { question: 'Which cross-sections can I calculate?', answer: 'This simple calculator supports solid rectangles, solid circles, centered hollow rectangles, circular tubes and triangles. It does not model I-beams, channels, built-up sections, fillets, holes placed off-center or composite materials.' },
    { question: 'Can I use this to choose a beam or check if it is safe?', answer: 'No. These are ideal geometric properties, not allowable stresses or load capacity. A structural check also depends on material, loads, support conditions, buckling, connections, design codes and other factors. Ask a qualified structural engineer.' },
  ],
});
