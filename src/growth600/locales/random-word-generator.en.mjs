export const randomWordGeneratorEnglishCopy = Object.freeze({
  copyLanguage: 'en', localizationStatus: 'approved', name: 'Random Word Generator', title: 'Random Word Generator — Free Online | UsefulVerse',
  description: 'Generate unique random words by category and length. Free, no account, with no upload.',
  intro: 'Pick a fresh set of words for writing prompts, classroom games or a quick creative spark. Choose a category and length, then copy or download the list.',
  howQuestion: 'How do I generate random words?', howAnswer: 'Choose a category, set a word-length range and result count, then select Generate. Leave the seed empty for a new list, or reuse a seed to reproduce the same selection.',
  privacyQuestion: 'Are my words uploaded?', privacyAnswer: 'No. The list is selected from a small built-in dictionary in your browser. Nothing is uploaded or saved.',
  fields: { category: 'Category', allCategories: 'All categories', nature: 'Nature', places: 'Places', objects: 'Objects', actions: 'Actions', minimumLength: 'Minimum letters', maximumLength: 'Maximum letters', count: 'Number of words', seed: 'Seed (optional)', seedHint: 'Reuse a seed to get the same list again.', dictionaryNote: 'The word list is intentionally small and is not a translation or frequency dictionary.' },
  actions: { generateWords: 'Generate words', reset: 'Reset', example: 'Try an example', copy: 'Copy list', download: 'Download list', result: 'Your words' },
  messages: { generated: 'Words generated.', copied: 'List copied.', copyUnavailable: 'Could not copy the list.', downloaded: 'List downloaded.', checkInputs: 'Check the selected filters and try again.', seedUnavailable: 'Secure seed generation is unavailable in this browser.', notEnoughWords: 'There are not enough matching words. Widen the length range or choose another category.', localeUnavailable: 'A dictionary is not available for this page language yet.', exampleLoaded: 'Example loaded.' },
  example: { category: 'nature', minLength: 1, maxLength: 64, count: 8 },
  additionalFaqs: [
    { question: 'Can I get a different list each time?', answer: 'Yes. Leave the seed empty to create a fresh random seed. Reusing a seed recreates its selection for the same filters and dictionary.' },
    { question: 'Does the generator include every word?', answer: 'No. It uses a small curated list, and results are selected uniformly from the words that match your filters.' },
  ],
});
