export const graphqlFormatterEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'GraphQL Formatter',
  title: 'GraphQL Formatter Free | UsefulVerse',
  description: 'Format GraphQL queries and schemas free in your browser. No upload or account; syntax checks only, no query execution.',
  intro: 'Paste a GraphQL operation, fragment, or schema definition to format it and find syntax errors in this browser.',
  howQuestion: 'How do I format a GraphQL document?',
  howAnswer: 'Paste a query or schema and choose Format. The local parser prints a consistent layout and reports syntax errors with a line and column when available.',
  privacyQuestion: 'Does this send my GraphQL document to a server?',
  privacyAnswer: 'No. The parser loads from this site only when you format. Your document is processed in this tab and is not uploaded or saved by this tool.',
  fields: {
    document: 'GraphQL document', output: 'Formatted document', definitionCount: '{count} definitions',
    accuracyNote: 'Syntax parsing and formatting only; this does not validate against a schema or run queries. Maximum input: 512 KiB and 50,000 tokens.',
    graphqlLicense: 'GraphQL.js license',
  },
  actions: { format: 'Format GraphQL', example: 'Load example', copy: 'Copy output', clear: 'Clear' },
  messages: {
    formatted: 'GraphQL document formatted locally.', invalidSyntax: 'Could not parse GraphQL syntax.', invalidAt: 'Syntax error at line {line}, column {column}.',
    tooLarge: 'The document exceeds the 512 KiB limit.', empty: 'Enter a GraphQL document first.', exampleLoaded: 'Example loaded.', copied: 'Formatted document copied.', copyUnavailable: 'Clipboard is unavailable in this browser.',
  },
  additionalFaqs: [
    { question: 'Does this validate fields against my API schema?', answer: 'No. It parses GraphQL syntax and formats operations or SDL, but does not compare a query with a schema.' },
    { question: 'Does the tool execute GraphQL queries?', answer: 'No. It never contacts an endpoint, runs a query, or performs schema introspection.' },
    { question: 'Are my documents uploaded or saved?', answer: 'No. Formatting runs in your browser tab. The text is not uploaded or stored by this tool.' },
  ],
});
