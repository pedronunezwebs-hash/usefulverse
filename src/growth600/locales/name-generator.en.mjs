export const nameGeneratorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  localizationStatus: 'approved',
  name: 'Original Name Generator',
  title: 'Fantasy Name Generator Free | UsefulVerse',
  description: 'Generate fantasy names, business ideas or usernames with a reusable seed. Free, no account, no availability claims.',
  intro: 'Make a fresh list of fantasy-style names, business-name ideas or usernames. Set a seed to reproduce a list, or change it for another draw.',
  howQuestion: 'How does the name generator work?',
  howAnswer: 'Choose a name style, result count and optional keyword, then generate. The seed makes the same settings reproducible. Results come from built-in word and syllable lists and are suggestions, not verified names.',
  privacyQuestion: 'Does this generator check business names or usernames online?',
  privacyAnswer: 'No. Everything is generated in this browser. It does not search trademark registries, social platforms or domain services, and it does not upload or save your input.',
  fields: {
    type: 'Name style', fantasy: 'Fantasy character', business: 'Business idea', username: 'Username idea',
    count: 'Number of suggestions', keyword: 'Optional keyword', keywordHint: 'Used as a starting word for business and username ideas.',
    seed: 'Seed', seedHint: 'Reuse the same seed and settings to get the same list.',
    suggestionNote: 'Suggestions only: availability, trademarks, usernames and domains are not checked. Search and verify a name before using it.',
  },
  actions: { generateNames: 'Generate names', reset: 'Reset', example: 'Load example', copy: 'Copy list', download: 'Download list', result: 'Your suggestions' },
  messages: {
    generated: 'Generated {count} suggestions.', copied: 'Name list copied.', copyUnavailable: 'Copy is unavailable in this browser.',
    downloaded: 'Name list downloaded.', checkInputs: 'Check the name style, count, keyword and seed.',
    seedUnavailable: 'Secure random seed generation is unavailable. Enter a seed to continue.', exampleLoaded: 'Example loaded.',
  },
  additionalFaqs: [
    { question: 'Can I use a generated business name?', answer: 'You can consider it as an idea, but this tool does not check trademarks, existing businesses, usernames or domains. Verify availability and legal requirements before using a name commercially.' },
    { question: 'Can I get the same name list again?', answer: 'Yes. Keep the same style, count, keyword and seed. Changing any of those settings can change the generated list.' },
  ],
});
