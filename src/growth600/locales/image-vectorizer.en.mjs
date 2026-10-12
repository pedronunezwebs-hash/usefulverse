export const imageVectorizerEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Image Vectorizer',
  title: 'Image Vectorizer Free | UsefulVerse',
  description: 'Turn simple PNG, JPEG, or WebP artwork into editable SVG paths in your browser. Free local vectorizer.',
  intro: 'Trace simple logos, icons, and flat-color artwork into SVG paths. Choose a color limit and detail size, preview the vector, then download the SVG.',
  howQuestion: 'How do you turn an image into an SVG?',
  howAnswer: 'Choose a raster image, select its output detail and color count, then create the SVG. The tool groups colored pixel runs into real vector paths; edges follow the selected pixel grid, so flat artwork works better than photographs.',
  privacyQuestion: 'Is my image uploaded?',
  privacyAnswer: 'No. The image is decoded and traced in this browser tab. It is not uploaded or automatically saved.',
  fields: Object.freeze({
    imageFile: 'Choose a PNG, JPEG, WebP, or GIF', detail: 'Maximum trace dimension', paletteCount: 'Maximum colors', alphaThreshold: 'Transparency threshold', mergeRuns: 'Merge matching path runs to reduce SVG size',
    detailHint: 'The longest side is reduced to this many pixels or fewer. Larger detail may create a bigger SVG.',
    accuracyNote: 'Best for simple logos, icons, and flat-color drawings. This method follows the pixel grid; it does not smooth curves or reproduce photo detail.',
    privacyNote: 'Up to 5 MiB per source image. The image is processed locally and is not uploaded or automatically saved. Large images can use device memory; a computer is recommended.',
    resultTitle: 'Vector preview', dimensions: 'SVG dimensions', colorsUsed: 'Colors used', pathSections: 'Path sections',
  }),
  actions: Object.freeze({ generate: 'Create SVG paths', download: 'Download SVG', reset: 'Reset' }),
  messages: Object.freeze({ selectImage: 'Choose an image first.', invalidImage: 'Choose a supported PNG, JPEG, WebP, or GIF image.', imageTooLarge: 'The image must be 5 MiB or smaller.', imageDimensions: 'This image is too large to decode safely in this browser.', traceFailed: 'This image could not be traced. Try a simpler image or lower detail.', generated: 'SVG paths created.', downloaded: 'SVG downloaded.', noVisiblePixels: 'No visible pixels remain. Lower the transparency threshold.', tooManyPaths: 'This image creates too many path sections. Reduce detail or use simpler artwork.' }),
  additionalFaqs: Object.freeze([
    Object.freeze({ question: 'Does the SVG contain the original image?', answer: 'No. The result contains SVG path shapes, not an embedded raster image. It approximates the source by grouping pixels into colors and paths.' }),
    Object.freeze({ question: 'Will it vectorize a photograph smoothly?', answer: 'No. The pixel-grid trace is intended for simple logos, icons, and flat-color drawings. Photographs can produce blocky edges and large SVG files.' }),
    Object.freeze({ question: 'Does the tool upload or keep my image?', answer: 'No. The source is processed in this tab and is not uploaded or automatically saved. Processing speed and memory use depend on your device.' }),
  ]),
});
