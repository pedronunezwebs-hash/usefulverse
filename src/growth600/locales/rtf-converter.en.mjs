export const rtfConverterEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'RTF Converter',
  title: 'RTF to PDF Converter Free | UsefulVerse',
  description: 'Convert RTF to text, download it or print to PDF. Free and local; files up to 5 MiB stay on your device.',
  intro: 'Choose an RTF file to extract readable text. Copy or download the result, or use your browser’s print dialog to save it as a PDF.',
  howQuestion: 'How do I convert an RTF file to PDF?',
  howAnswer: 'Choose your RTF file and convert it to readable text. Then select Print or save as PDF to open your browser’s print dialog. This simple text output does not preserve the original page layout, images, tables or all formatting.',
  privacyQuestion: 'Is my RTF file uploaded?',
  privacyAnswer: 'No. The file is read and converted in this browser. It is not uploaded or stored by this tool.',
  fields: {
    file: 'Choose an RTF file',
    accuracyNote: 'This extracts text; it does not reproduce the original layout, images, tables or every Word formatting feature.',
    limitNote: 'Local limit: 5 MiB per file. PDF saving uses your browser’s print dialog and settings.',
    output: 'Extracted text',
  },
  actions: {
    convert: 'Convert to text', reset: 'Clear', copy: 'Copy text', download: 'Download .txt', print: 'Print or save as PDF', result: 'Converted text',
  },
  messages: {
    converted: 'RTF text is ready.',
    invalidFile: 'Choose a valid RTF file and try again.',
    fileTooLarge: 'This file is over the 5 MiB local limit.',
    noText: 'No readable text was found in this RTF file.',
    copyUnavailable: 'Copy is unavailable in this browser.',
    printBlocked: 'Allow this site to open a print window, then try again.',
    downloaded: 'Text file downloaded.',
  },
  additionalFaqs: [
    { question: 'Does this keep the RTF layout and images?', answer: 'No. It extracts readable text only. The original file is unchanged; images, tables, page layout and some formatting are not reproduced.' },
    { question: 'How can I save the extracted text as a PDF?', answer: 'After conversion, choose Print or save as PDF. In the browser print dialog, select Save as PDF if that option is available.' },
    { question: 'Does the converter send my document to a server?', answer: 'No. The conversion runs locally in your browser. The file is not uploaded by this tool.' },
  ],
});
