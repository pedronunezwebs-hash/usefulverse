export const graphqlFormatterEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'GraphQL Formatter', title: 'GraphQL Formatter Free & Unlimited | UsefulVerse',
  description: 'Format GraphQL queries and schemas for free in your browser. See syntax errors, then copy or download. No query execution or upload.',
  intro: 'Paste a GraphQL query or schema definition to format it in your browser. The local parser can point out syntax errors. It never runs a query or sends your source to a server.',
  howQuestion: 'How do I format GraphQL online?',
  howAnswer: 'Paste a query, mutation, subscription or schema definition, then choose Format GraphQL. The first format action loads the local formatter. Copy or download the result when it is ready.',
  privacyQuestion: 'Is my GraphQL source uploaded or executed?',
  privacyAnswer: 'No. Formatting runs in this browser after you start it. The tool does not contact a GraphQL API, execute operations, or upload your source. Input is limited to 100,000 characters.',
  exampleSource: 'query GetUser($id: ID!) { user(id: $id) { id name email } }\n\ntype User { id: ID! name: String! email: String }',
  fields: { source: 'GraphQL query or schema', sourceHint: 'Paste a query, mutation, subscription or SDL definition.', output: 'Formatted GraphQL', outputHint: 'Your formatted result appears here.', accuracyNote: 'Local formatting only. Maximum input: 100,000 characters. No execution or upload.', resultTitle: 'Formatted result' },
  actions: { format: 'Format GraphQL', example: 'Load example', reset: 'Clear', result: 'Formatted result', copy: 'Copy', download: 'Download .graphql' },
  messages: { empty: 'Paste GraphQL source first.', tooLong: 'Input is over the 100,000-character limit.', loading: 'Loading the local formatter…', formatterUnavailable: 'The local formatter could not be loaded. Check your connection and try again.', syntaxError: 'GraphQL syntax error.', location: 'Line {line}, column {column}.', formatted: 'GraphQL formatted.', formatFirst: 'Format source before copying or downloading.', copied: 'Copied.', copyUnavailable: 'Clipboard is unavailable in this browser.', downloaded: 'GraphQL file downloaded.', exampleLoaded: 'Example loaded.' },
  additionalFaqs: [
    { question: 'Can I format GraphQL schemas and SDL?', answer: 'Yes. The parser formats GraphQL queries and schema definition language, including type definitions.' },
    { question: 'Does this validate my query against a live schema?', answer: 'No. It checks GraphQL syntax and formatting only. It does not fetch a schema or call an API.' },
    { question: 'Is my query sent to a GraphQL server?', answer: 'No. Nothing is executed or uploaded. The formatter runs locally after you press the format button.' },
  ],
});
