export const antennaLengthCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Antenna Length Calculator',
  title: 'Dipole Antenna Length Calculator Free | UsefulVerse',
  description: 'Estimate half-wave dipole or quarter-wave antenna length from frequency. Free, unlimited browser use with an editable shortening factor.',
  intro: 'Estimate a free-space half-wave dipole or quarter-wave monopole from frequency. Adjust the shortening factor to see a practical starting length and each dipole leg.',
  howQuestion: 'How do I calculate dipole antenna length from frequency?',
  howAnswer: 'First calculate wavelength as the speed of light divided by frequency. A half-wave dipole is about half that wavelength in total, with two equal legs; a quarter-wave monopole is about one quarter. An editable shortening factor can provide a practical starting estimate, but the final length depends on antenna design and surroundings.',
  privacyQuestion: 'Are my antenna values uploaded?',
  privacyAnswer: 'No. The calculation runs in this browser; your entered values are not uploaded or saved by this tool.',
  fields: {
    mode: 'Antenna type', dipole: 'Half-wave dipole', monopole: 'Quarter-wave monopole', frequency: 'Operating frequency', frequencyUnit: 'Frequency unit',
    hz: 'Hertz (Hz)', khz: 'Kilohertz (kHz)', mhz: 'Megahertz (MHz)', ghz: 'Gigahertz (GHz)', shorteningFactor: 'Shortening factor (0.70–1.00)',
    accuracyNote: 'This estimates a straight, thin conductor in free space. The shortening factor is an adjustable starting estimate, not a universal correction; feed, conductor diameter, nearby objects, ground and installation affect tuning. Measure and tune safely; this is not a design certification or radio-safety assessment.',
  },
  actions: { calculate: 'Calculate antenna length', reset: 'Reset', copy: 'Copy results', example: 'Try 100 MHz', result: 'Antenna length estimate' },
  messages: {
    calculated: 'Antenna length estimate calculated.', exampleLoaded: 'The 100 MHz example is ready.', checkInputs: 'Enter a valid positive frequency, antenna type, unit and shortening factor from 0.70 to 1.00.', copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.',
    wavelength: 'Free-space wavelength', idealLength: 'Ideal length before shortening', adjustedLength: 'Estimated adjusted total length', elementLength: 'Length of each dipole leg', imperialAdjusted: 'Adjusted total length (feet)', factor: 'Shortening factor', formula: 'Formula',
  },
  additionalFaqs: [
    { question: 'What is the length of a half-wave dipole at 100 MHz?', answer: 'In free space, the wavelength at 100 MHz is about 2.998 m, so an ideal half-wave dipole is about 1.499 m total, or about 0.749 m per leg. A practical antenna may use a shortening factor and should be tuned in its installed environment.' },
    { question: 'How long is a quarter-wave antenna?', answer: 'Its ideal free-space conductor length is one quarter of wavelength: speed of light divided by four times frequency. The actual tuned length can differ with the conductor, feed, ground and surroundings.' },
    { question: 'What does the shortening factor mean?', answer: 'It multiplies the ideal free-space element length to provide a starting estimate for a practical conductor. The default is only a rule of thumb; it is not the coaxial cable velocity factor and does not replace measurement or tuning.' },
    { question: 'Does this calculator guarantee a tuned or safe antenna?', answer: 'No. It estimates basic half-wave dipole or quarter-wave monopole geometry. Real impedance and resonance depend on construction and the site. Follow radio regulations and safe installation practices, and verify with suitable instruments.' },
  ],
});
