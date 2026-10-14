export const cssBorderRadiusGeneratorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'CSS Border Radius Generator', title: 'Border Radius Generator Free | UsefulVerse',
  description: 'Preview independent or elliptical CSS border-radius corners, then copy or download the code. Free, no account or upload.',
  intro: 'Create a CSS border-radius declaration with four independent corners, elliptical horizontal and vertical values, or one linked radius. Preview it as you edit.',
  howQuestion: 'How do I create elliptical border-radius CSS?',
  howAnswer: 'Choose pixels or percent, enter four horizontal and four vertical corner values, and copy the generated declaration. Matching horizontal and vertical values use the shorter CSS shorthand.',
  privacyQuestion: 'Is my CSS uploaded?',
  privacyAnswer: 'No. The preview and CSS are created in this browser. Nothing is uploaded or saved by the tool.',
  fields: { unit: 'Unit', pixels: 'Pixels (px)', percent: 'Percent (%)', linkCorners: 'Use the top-left values for every corner', preview: 'Live preview', previewShape: 'Rounded shape preview', horizontal: 'Horizontal radii', vertical: 'Vertical radii', topLeft: 'Top left', topRight: 'Top right', bottomRight: 'Bottom right', bottomLeft: 'Bottom left', output: 'CSS declaration', accuracyNote: 'Values may overlap. CSS browsers proportionally normalize corner radii when needed; the generated values are not silently changed.', previewSize: 'The preview is 320 × 180 px. Percent values are relative to the element’s width and height.' },
  actions: { example: 'Load example', reset: 'Reset', copy: 'Copy CSS', download: 'Download CSS' },
  messages: { updated: 'CSS preview updated.', copied: 'CSS copied.', copyUnavailable: 'Clipboard is unavailable in this browser.', downloaded: 'CSS file downloaded.', exampleLoaded: 'Example loaded.', reset: 'Border radius reset.', invalid: 'Enter a radius within the displayed limits.' },
  additionalFaqs: [
    { question: 'Can each corner have a different radius?', answer: 'Yes. Set each horizontal corner separately, and add separate vertical values for elliptical corners.' },
    { question: 'Why does the browser change overlapping corner radii?', answer: 'CSS proportionally reduces overlapping radii to fit the element. This tool keeps your requested CSS values and explains that browser behavior instead of hiding it.' },
    { question: 'What do percentage border-radius values use as a reference?', answer: 'Horizontal percentages are relative to the element’s width, while vertical percentages are relative to its height.' },
  ],
});
