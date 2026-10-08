export const complexNumberCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Complex Number Calculator',
  title: 'Complex Number Calculator | Free | UsefulVerse',
  description: 'Add, multiply, divide, convert and find complex roots. Free browser calculator with polar and rectangular forms.',
  intro: 'Calculate with complex numbers in rectangular or polar form, inspect modulus and principal argument, or find nth roots.',
  howQuestion: 'How do I calculate with complex numbers?',
  howAnswer: 'Choose an operation, enter one or two complex values as real and imaginary parts, then calculate. For polar input, enter a nonnegative radius and an angle in degrees or radians.',
  privacyQuestion: 'Are my complex numbers uploaded?',
  privacyAnswer: 'No. All operations run locally in this browser; your values are not sent to a server.',
  fields: {
    operation: 'Operation', realA: 'Real part of z₁', imaginaryA: 'Imaginary part of z₁', realB: 'Real part of z₂', imaginaryB: 'Imaginary part of z₂',
    radius: 'Magnitude (radius)', angle: 'Angle', angleUnit: 'Angle unit', degrees: 'Degrees', radians: 'Radians', degree: 'Root degree',
    resultSummary: 'Result', resultReal: 'Real part', resultImaginary: 'Imaginary part', modulus: 'Modulus', argument: 'Principal argument', polar: 'Polar form',
    rootNumber: 'Root', zeroArgumentNote: 'The argument of zero is undefined.', accuracyNote: 'Enter finite components or a nonnegative polar radius up to 1,000,000,000. Angles are limited to ±1,000,000 degrees or radians. Roots are limited to degrees 2–12. Results are numerical; argument uses the principal branch.',
    exampleHint: 'Example: multiplying i by i gives −1.',
  },
  actions: {
    calculate: 'Calculate', example: 'Load example', reset: 'Clear', add: 'Add z₁ + z₂', subtract: 'Subtract z₁ − z₂', multiply: 'Multiply z₁ × z₂', divide: 'Divide z₁ ÷ z₂',
    magnitude: 'Modulus of z₁', argument: 'Argument of z₁', rectangularToPolar: 'Rectangular → polar', polarToRectangular: 'Polar → rectangular', roots: 'Nth roots of z₁',
  },
  messages: {
    calculated: 'Result ready.', checkInputs: 'Check the complex number values.', exampleLoaded: 'Example loaded: i × i.', missingValue: 'Enter every required value.',
    componentOutOfRange: 'Each real or imaginary component must be finite and within ±1,000,000,000.', radiusOutOfRange: 'Radius must be finite and no greater than 1,000,000,000.',
    angleOutOfRange: 'Angle must be finite and within ±1,000,000 in the selected unit.', negativeRadius: 'Polar radius cannot be negative.', invalidAngleUnit: 'Choose degrees or radians.',
    invalidRootDegree: 'Choose a whole-number root degree from 2 to 12.', divisionByZero: 'Cannot divide by zero.', zeroArgument: 'Zero has no defined argument.', resultOutOfRange: 'The result is outside the supported numeric range.', invalidOperation: 'Choose a supported operation.',
  },
  additionalFaqs: [
    { question: 'What is the principal argument?', answer: 'It is the angle of a nonzero complex number on the principal branch, from −180° exclusive to 180° inclusive, or the equivalent interval in radians.' },
    { question: 'Does the calculator return every nth root?', answer: 'Yes. For degrees 2 through 12 it lists all roots; the zero input returns zero for each root position. Values are numerical approximations.' },
  ],
  localizationStatus: 'approved',
});
