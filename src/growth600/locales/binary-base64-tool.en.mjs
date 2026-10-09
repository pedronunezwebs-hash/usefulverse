export const binaryBase64ToolEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'File to Base64 & Data URI', title: 'File to Base64 & Data URI Free | UsefulVerse',
  description: 'Encode a local image or file as Base64 or a MIME-labelled data URI. Preview supported images, copy or download free. Nothing is uploaded.',
  intro: 'Encode a file on your device as Base64 text or a data URI with its MIME type. Preview common raster images, copy the result or download it as text. No upload or account.',
  howQuestion: 'How do I convert a file to Base64?',
  howAnswer: 'Choose one file up to 2 MiB and select Convert. Copy or download the data URI, or switch to Base64 only. The MIME type is read from the browser and may be unknown.',
  privacyQuestion: 'Is my file uploaded or stored?',
  privacyAnswer: 'No. The selected file is read and encoded in this browser. Nothing is sent to a server or saved by this tool. The browser needs extra memory for the file and its encoded text.',
  fields: {
    file: 'Choose a file', fileHint: 'One file up to 2 MiB. The file is encoded on this device; nothing is uploaded.',
    outputFormat: 'Output format', base64Only: 'Base64 only', dataUri: 'Data URI (MIME type + Base64)',
    accuracyNote: 'MIME type comes from the browser file metadata; it is not a format or safety check. Image preview is limited to PNG, JPEG, GIF, WebP, BMP and AVIF. SVG and documents are not opened in the preview.',
    mimeType: 'MIME type', fileSize: 'File size', bytes: 'bytes', outputSize: 'Base64 length', characters: 'characters',
    imagePreview: 'Local image preview', result: 'Encoded file', output: 'Base64 output',
  },
  actions: { convert: 'Convert file', reset: 'Clear', copy: 'Copy output', download: 'Download text file' },
  messages: {
    encoded: 'File encoded locally.', emptyFile: 'Choose a file first.', tooLarge: 'The file is larger than the 2 MiB limit.',
    fileReadError: 'This browser could not read the selected file.', convertFirst: 'Convert a file before copying or downloading.',
    downloaded: 'Text file downloaded.', copied: 'Copied.', copyUnavailable: 'Clipboard is unavailable in this browser.', invalid: 'Could not encode this file.',
  },
  additionalFaqs: [
    { question: 'What is a Base64 data URI?', answer: 'It is text that starts with data:, includes a MIME type and ;base64, and then contains the file bytes encoded as Base64. It can be used in supported HTML or CSS contexts.' },
    { question: 'Does this upload the file or verify its real type?', answer: 'No. Encoding happens in your browser. The displayed MIME type comes from browser file metadata and is not verified against the bytes.' },
    { question: 'Can I turn any file into a data URI?', answer: 'Most files can be represented as Base64 text, but not every website or browser feature accepts every MIME type. This tool encodes one file up to 2 MiB.' },
  ],
});
