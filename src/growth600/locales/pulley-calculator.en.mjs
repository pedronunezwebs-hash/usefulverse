export const pulleyCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'machine-accepted', localizationAcceptedBy: 'site-owner', localizationAcceptedAt: '2026-10-09',
  name: 'Pulley Calculator', title: 'Pulley Calculator Free & Unlimited | UsefulVerse',
  description: 'Estimate belt length, pulley RPM and belt speed from two diameters and center distance. Free, local and unlimited.',
  intro: 'Estimate the pitch length and speed relationship for a simple open belt between two pulleys. Enter dimensions in the same unit.',
  howQuestion: 'How do you calculate belt length between two pulleys?',
  howAnswer: 'For an open two-pulley drive, this calculator uses a common approximation based on center distance and the two pulley diameters. It also estimates driven RPM from the diameter ratio, assuming no slip.',
  privacyQuestion: 'Are my measurements uploaded?', privacyAnswer: 'No. All calculations and the sketch are generated in this browser; your measurements are not uploaded or saved.',
  fields: {
    driverDiameter: 'Driver pulley diameter', drivenDiameter: 'Driven pulley diameter', centerDistance: 'Distance between pulley centers', diameterUnit: 'Dimension unit',
    millimeters: 'Millimeters (mm)', inches: 'Inches (in)', inputRpm: 'Driver input speed (RPM)',
    accuracyNote: 'Approximate pitch length for an ideal, open two-pulley belt. Use the same unit for all dimensions. Real belt length and speed can differ with belt profile, pitch, tension, slip, wear and tolerances. This does not select a purchasable belt or assess power, guarding or safety. Check manufacturer data before use. Runs locally; no upload.',
    sketchTitle: 'Open-belt layout (not to scale)', sketchDescription: 'Diagram of two pulleys connected by an open belt, with the driver on the left and driven pulley on the right.',
  },
  actions: { calculate: 'Calculate belt drive', reset: 'Reset', copy: 'Copy results', example: 'Load example', result: 'Estimated results' },
  messages: {
    copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Belt-drive estimate calculated.',
    checkInputs: 'Check both diameters, center distance, unit and input RPM.', beltLength: 'Approximate belt pitch length', outputRpm: 'Ideal driven speed', speedRatio: 'Speed ratio (driver / driven)',
    beltSpeed: 'Driver belt speed', smallWrap: 'Approximate wrap on smaller pulley', model: 'Model', openBelt: 'Open two-pulley approximation',
  },
  additionalFaqs: [
    { question: 'What is the approximate belt-length formula?', answer: 'A common open-belt pitch-length approximation is L ≈ 2C + 1.57(D + d) + (D − d)²/(4C), where C is center distance and D and d are the larger and smaller pulley pitch diameters. Actual belt selection should use the manufacturer’s pitch and sizing data.' },
    { question: 'How does pulley diameter change RPM?', answer: 'With no slip, driven RPM is approximately input RPM multiplied by driver diameter and divided by driven diameter. A larger driven pulley reduces speed; a larger driver pulley increases it.' },
    { question: 'Does this calculator include belt slip or tension?', answer: 'No. It is an ideal geometry and ratio estimate for an open two-pulley layout. It does not account for slip, tension, belt construction, load, wear or catalog belt sizes.' },
    { question: 'Can I use the estimate to order a belt?', answer: 'Use it as a first estimate only. Confirm belt pitch, profile, effective length, center adjustment and manufacturer sizing tables before buying or operating a drive.' },
  ],
});
