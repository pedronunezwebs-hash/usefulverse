export const csvEditorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'CSV Editor', title: 'Free CSV Editor, No Use Limits | UsefulVerse',
  description: 'Free CSV editor, no use limit. Edit and export in your browser. No account or upload.',
  intro: 'Edit CSV data in a simple spreadsheet-style grid. Search rows, change cells or headers, add or remove rows and columns, undo edits, then export a CSV with your chosen delimiter.',
  howQuestion: 'How do I edit a CSV file online?',
  howAnswer: 'Choose a CSV file or paste text, set the delimiter and whether the first row contains headers, then load it. Edit cells in the grid, search, undo or redo, and export when ready.',
  privacyQuestion: 'Are my CSV files uploaded?',
  privacyAnswer: 'No. Files are read and edited in this browser only. The editor does not upload or save your data. Keep a copy of the original before making important changes.',
  fields: {
    file: 'Choose a CSV file', paste: 'Or paste CSV text', delimiter: 'Input delimiter', autoDelimiter: 'Detect automatically', comma: 'Comma (,)', semicolon: 'Semicolon (;)', tab: 'Tab', pipe: 'Pipe (|)',
    hasHeader: 'First row contains column names', search: 'Search rows', searchHint: 'Search matches any cell in a row.', tableLabel: 'Editable CSV data', row: 'Row', column: 'Column',
    accuracyNote: 'Up to 5 MiB, 5,000 data rows, 80 columns and 80,000 cells. CSV is imported and edited locally. Export supports UTF-8, with optional BOM; other encodings are not supported.',
    privacyNote: 'Changes remain in this browser tab until you export. They are not saved automatically. Keep a backup of the source file.',
    rowsSummary: 'Rows', columnsSummary: 'Columns', filteredSummary: 'Visible rows', page: 'Page', of: 'of', noMatches: 'No rows match this search.',
    columnType: 'Column type', textType: 'Text', numberType: 'Number', dateType: 'Date (YYYY-MM-DD)', booleanType: 'Boolean', typeSummary: 'Values not matching the selected column type', typeHint: 'Types are for checking only. Values are not converted, and export keeps the original cell text.',
    exportDelimiter: 'Export delimiter', utf8Bom: 'Add UTF-8 BOM (for spreadsheet compatibility)', result: 'Export CSV',
  },
  actions: { load: 'Load CSV', example: 'Load example', reset: 'Clear', addRow: 'Add row', addColumn: 'Add column', deleteRow: 'Delete row', deleteColumn: 'Delete column', undo: 'Undo', redo: 'Redo', previous: 'Previous', next: 'Next', export: 'Export CSV', copy: 'Copy CSV', result: 'CSV editor' },
  messages: {
    loaded: 'CSV loaded locally.', emptyInput: 'Choose a file or paste CSV text.', tooLarge: 'The CSV exceeds the 5 MiB limit.', tooManyRows: 'The CSV exceeds the row limit.', tooManyColumns: 'The CSV exceeds the column limit.', tooManyCells: 'The CSV exceeds the cell limit.', cellTooLong: 'A cell exceeds the character limit.',
    invalidDelimiter: 'Choose a supported delimiter.', unclosedQuote: 'A quoted field is not closed.', unexpectedQuote: 'A quote appears in an unquoted field.', textAfterQuote: 'Unexpected text follows a closing quote.', invalidCell: 'Choose a valid cell.', invalidColumn: 'Choose a valid column.', invalidRow: 'Choose a valid row.', invalidEdit: 'This edit is not supported.', invalidTable: 'The CSV table is invalid.',
    fileReadError: 'This browser could not read the selected file.', invalid: 'Could not read this CSV. Check the delimiter and quotes.', exported: 'CSV downloaded.', copied: 'CSV copied.', copyUnavailable: 'Clipboard is unavailable in this browser.', undoUnavailable: 'Nothing to undo.', redoUnavailable: 'Nothing to redo.', noMatches: 'No rows match this search.',
  },
  additionalFaqs: [
    { question: 'Can I edit a CSV with commas inside a value?', answer: 'Yes. Quoted fields, escaped double quotes and line breaks inside a quoted cell are parsed and exported using CSV quoting rules. Review the exported file in your target application.' },
    { question: 'Can I search and undo CSV edits?', answer: 'Yes. Search filters the visible rows without removing data. Undo and redo cover recent cell, header, row and column edits in this tab; the history is cleared when you reset or leave the page.' },
    { question: 'Which CSV encodings can I export?', answer: 'Exports use UTF-8, optionally with a byte-order mark for spreadsheet compatibility. This editor does not convert to legacy encodings such as Windows-1252.' },
  ],
});
