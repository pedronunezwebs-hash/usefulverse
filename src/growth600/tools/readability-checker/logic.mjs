export const MAX_READABILITY_CHARS = 100_000;

const WORD_TOKEN = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
const VOWEL_GROUPS = {
  en: /[aeiouy]+/giu,
  es: /[aeiouáéíóúü]+/giu,
  fr: /[aeiouyàâäéèêëïîôöùûüÿœ]+/giu,
  de: /[aeiouyäöü]+/giu,
  it: /[aeiouàèéìíîòóùú]+/giu,
};

function countSyllables(word, language) {
  const normalized = word.toLocaleLowerCase(language);
  const groups = normalized.match(VOWEL_GROUPS[language]) ?? [];
  if (!groups.length) return 1;
  let count = groups.length;
  if (language === 'en') {
    if (normalized.length > 2 && /(?:e|es|ed)$/u.test(normalized) && !/(?:le|ye|oe)$/u.test(normalized) && count > 1) count -= 1;
    if (normalized.endsWith('le') && normalized.length > 2 && !/[aeiouy]le$/u.test(normalized)) count += 1;
    if (normalized.endsWith('ia') || normalized.endsWith('io')) count += 1;
  } else if (language === 'es') {
    // Spanish weak vowels next to a strong vowel form one syllable unless accented.
    count -= (normalized.match(/[aeoáéó][iuü]|[iuü][aeoáéó]/gu) ?? []).length;
    count = Math.max(1, count);
  } else if (language === 'fr' && normalized.endsWith('e') && count > 1) {
    count -= 1;
  }
  return Math.max(1, count);
}

function tokenize(text, language) {
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(language, { granularity: 'word' });
    return [...segmenter.segment(text)].filter(({ isWordLike }) => isWordLike).map(({ segment }) => segment);
  }
  return text.match(WORD_TOKEN) ?? [];
}

function round(value, decimals = 1) {
  const scale = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * scale) / scale;
}

export function analyzeReadability(text, language = 'en') {
  if (typeof text !== 'string') throw new TypeError('Text must be a string.');
  if (text.length > MAX_READABILITY_CHARS) throw new RangeError(`Text is limited to ${MAX_READABILITY_CHARS} characters.`);
  if (!['en', 'es', 'fr', 'de', 'it'].includes(language)) throw new RangeError('Choose a language with a supported readability formula.');

  const normalized = text.trim();
  const words = tokenize(normalized, language);
  const sentenceMatches = normalized.match(/[^.!?。！？؟।؛]+(?:[.!?。！？؟।؛]+|$)/gu) ?? [];
  const sentences = normalized ? Math.max(1, sentenceMatches.filter((sentence) => /[\p{L}\p{N}]/u.test(sentence)).length) : 0;
  const letters = [...normalized].filter((character) => /\p{L}/u.test(character)).length;
  const syllables = words.reduce((sum, word) => sum + countSyllables(word, language), 0);
  const averageSentenceLength = sentences ? words.length / sentences : 0;
  const averageSyllablesPerWord = words.length ? syllables / words.length : 0;
  const averageWordLength = words.length ? letters / words.length : 0;
  const formulas = {
    en: {
      id: 'flesch-reading-ease',
      name: 'Flesch Reading Ease',
      score: words.length && sentences ? 206.835 - 1.015 * averageSentenceLength - 84.6 * averageSyllablesPerWord : null,
    },
    es: {
      id: 'fernandez-huerta',
      name: 'Fernández-Huerta',
      score: words.length && sentences ? 206.84 - 1.02 * averageSentenceLength - 60 * averageSyllablesPerWord : null,
    },
    fr: {
      id: 'kandel-moles',
      name: 'Kandel–Moles',
      score: words.length && sentences ? 207 - 1.015 * averageSentenceLength - 73.6 * averageSyllablesPerWord : null,
    },
    de: {
      id: 'amstad',
      name: 'Amstad',
      score: words.length && sentences ? 180 - averageSentenceLength - 58.5 * averageSyllablesPerWord : null,
    },
    it: {
      id: 'gulpease',
      name: 'Gulpease',
      score: words.length && sentences ? 89 + ((300 * sentences) - (10 * letters)) / words.length : null,
    },
  }[language];

  return {
    language,
    formula: formulas,
    wordCount: words.length,
    sentenceCount: sentences,
    characterCount: [...normalized].length,
    characterCountNoSpaces: [...normalized.replace(/\s/gu, '')].length,
    letterCount: letters,
    syllableEstimate: syllables,
    averageSentenceLength: round(averageSentenceLength, 2),
    averageWordLength: round(averageWordLength, 2),
    averageSyllablesPerWord: round(averageSyllablesPerWord, 2),
    longWordCount: words.filter((word) => [...word].filter((character) => /\p{L}/u.test(character)).length >= 7).length,
    score: formulas.score === null ? null : round(formulas.score, 1),
    needsLongerSample: words.length > 0 && words.length < 100,
  };
}
