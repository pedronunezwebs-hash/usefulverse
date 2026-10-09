export const textToBinaryEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Text to Binary Converter', title: 'Text to Binary Converter Free & Unlimited | UsefulVerse', description: 'Convert text to UTF-8 binary and binary back to text for free. Preserve Unicode, group bytes, and copy or download results. No upload or account.',
  intro: 'Convert plain text to its exact UTF-8 bits, or decode complete UTF-8 bytes back into text. Spaces between bytes are optional. Accents and emoji are preserved; conversion runs in this browser.',
  howQuestion: 'How do I convert text to binary?', howAnswer: 'Choose Text to binary, enter text, and convert. The tool encodes UTF-8 bytes as eight-bit groups. To reverse the process, choose Binary to text and paste groups of eight bits; whitespace is ignored.',
  privacyQuestion: 'Does this converter upload my text?', privacyAnswer: 'No. Encoding and decoding use built-in browser features. Nothing is sent to a conversion server. Inputs are limited to 20,000 text characters or 160,000 binary bits.',
  exampleText: '¡Hola, mundo! 👋', exampleBinary: '11000010 10100001 01001000 01101111 01101100 01100001 00101100 00100000 01101101 01110101 01101110 01100100 01101111 00100001 00100000 11110000 10011111 10010001 10001011',
  fields: {
    mode: 'Conversion', textToBinary: 'Text to binary (UTF-8)', binaryToText: 'Binary to text (UTF-8)', textInput: 'Text input', textHint: 'Enter text. Accents, line breaks, and emoji are encoded as UTF-8.', binaryInput: 'Binary input', binaryHint: 'Paste bits. Spaces, tabs, and line breaks between bytes are ignored.',
    groupBytes: 'Separate each eight-bit byte with a space', accuracyNote: 'Uses UTF-8 bytes, not character numbers or an integer base converter. Text input: up to 20,000 characters. Binary input: up to 160,000 bits and must contain complete, valid UTF-8 bytes.',
    output: 'Conversion result', result: 'Result', copyHint: 'Copy or download the result as plain text.',
  },
  actions: { convert: 'Convert', example: 'Load example', reset: 'Clear', result: 'Conversion result', copy: 'Copy result', download: 'Download result' },
  messages: { converted: 'Conversion complete.', copied: 'Copied to clipboard.', copyUnavailable: 'Clipboard is unavailable in this browser.', downloaded: 'Text file downloaded.', invalid: 'Check the input and try again.', 'empty-input': 'Enter text or binary bits first.', 'text-too-long': 'Text is over the 20,000-character limit.', 'binary-too-long': 'Binary input is over the 160,000-bit limit.', 'binary-invalid': 'Use only 0 and 1, with optional whitespace.', 'binary-incomplete': 'Binary input must contain complete groups of eight bits.', 'utf8-invalid': 'These bytes are not complete valid UTF-8 text.' },
  additionalFaqs: [
    { question: 'Can I convert binary back to text?', answer: 'Yes. Choose Binary to text and paste binary bytes in groups of eight. Spaces and line breaks are allowed between groups.' },
    { question: 'Does it support accents and emoji?', answer: 'Yes. It encodes UTF-8 bytes, so characters such as ñ and emoji use the correct multibyte sequence. Invalid or incomplete UTF-8 is reported instead of silently replaced.' },
    { question: 'Is this the same as converting a number between bases?', answer: 'No. This tool encodes text as UTF-8 bytes. A base converter changes the representation of an integer; use that for numeric values.' },
  ],
});
