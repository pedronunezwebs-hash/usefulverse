export const colorMixerEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Color Mixer',
  title: 'Color Mixer — Free HEX & RGB Tool | UsefulVerse',
  description: 'Mix two or more colors by weight. Compare sRGB and linear-light results, build a color ramp, and copy HEX, RGB, or HSL values free.',
  intro: 'Blend colors with editable weights, compare two digital mixing modes, and build a swatch ramp between the first two colors. Nothing is uploaded.',
  howQuestion: 'How do I mix two colors online?',
  howAnswer: 'Choose two or more colors, set each weight, and select sRGB or linear-light mixing. The result shows HEX, RGB, and HSL values.',
  privacyQuestion: 'Are my colors uploaded?',
  privacyAnswer: 'No. Color calculations run locally in your browser. No account or image upload is needed.',
  fields: Object.freeze({
    colors: 'Colors to mix', color: 'Color', colorHex: 'HEX value', weight: 'Weight', addColor: 'Add a color', removeColor: 'Remove color',
    mixingSpace: 'Mixing method', srgb: 'sRGB (screen values)', linear: 'Linear light', steps: 'Ramp swatches',
    accuracyNote: 'The selected method affects the result. sRGB blends displayed channel values; linear light converts channels before mixing.',
    pigmentNote: 'This predicts digital screen colors, not how real paint or pigments will mix.', privacyNote: 'Runs in this browser. Colors are not uploaded or automatically saved.',
    resultHex: 'HEX', resultRgb: 'RGB', resultHsl: 'HSL', preview: 'Mixed color preview', ramp: 'Color ramp',
  }),
  actions: Object.freeze({ calculate: 'Mix colors', addColor: 'Add color', removeColor: 'Remove', example: 'Load example', reset: 'Reset', copy: 'Copy HEX', download: 'Download CSS', result: 'Mixed color' }),
  messages: Object.freeze({ calculated: 'Color mixed.', checkInputs: 'Check the colors, weights, and mixing method.', colorAdded: 'Color added.', colorLimit: 'You can mix up to eight colors.', colorRemoved: 'Color removed.', colorMinimum: 'Keep at least two colors.', copied: 'HEX value copied.', copyUnavailable: 'Copy is not available in this browser.', downloaded: 'CSS palette downloaded.', reset: 'Color mixer reset.' }),
  additionalFaqs: Object.freeze([
    Object.freeze({ question: 'Why do sRGB and linear-light mixes look different?', answer: 'sRGB averages the encoded screen channel values. Linear-light mode converts them to light values first, mixes, then converts back. The chosen method changes the result.' }),
    Object.freeze({ question: 'Can this predict the color of mixed paint?', answer: 'No. This is digital color math for screens, not a physical pigment model. Real paint depends on pigment properties, transparency, concentration, lighting, and the surface.' }),
    Object.freeze({ question: 'What color formats can I copy?', answer: 'The result displays HEX, RGB, and HSL. You can copy the HEX value or download a small CSS color palette.' }),
  ]),
});
