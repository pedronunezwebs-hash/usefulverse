// Parameterized runtime strings used by src/app.js through fmt(key, values).
// Each language pack must provide every key. `vars` must all appear in the translation.
// Plural keys are objects keyed by Intl.PluralRules categories for the pack's language
// (at least `other`; add `one` etc. only when the language distinguishes them).
export const templateKeys = {
  'reading.minutes': { en: '{count} min', vars: ['count'] },
  summary: { en: 'Words: {words}\nCharacters: {characters}\nCharacters without spaces: {noSpaces}\nLines: {lines}\nReading time: {reading} min', vars: ['words', 'characters', 'noSpaces', 'lines', 'reading'] },
  'dedupe.kept': { en: { one: '{count} unique line kept.', other: '{count} unique lines kept.' }, vars: ['count'], plural: true },
  'percent.of': { en: '{percent}% of {base} = {result}', vars: ['percent', 'base', 'result'] },
  'percent.share': { en: '{part} is {result}% of {whole}', vars: ['part', 'result', 'whole'] },
  'percent.change': { en: 'Change from {from} to {to} = {change}%', vars: ['from', 'to', 'change'] },
  'rows.converted': { en: { one: '{count} row converted.', other: '{count} rows converted.' }, vars: ['count'], plural: true },
  'uuid.generated': { en: { one: '{count} UUID generated locally.', other: '{count} UUIDs generated locally.' }, vars: ['count'], plural: true },
  'regex.matches': { en: { one: '{count} match found.', other: '{count} matches found.' }, vars: ['count'], plural: true },
  'duration.exact': { en: '{days}d {hours}h {minutes}m {seconds}s', vars: ['days', 'hours', 'minutes', 'seconds'] },
  'diff.found': { en: { one: '{count} different line found.', other: '{count} different lines found.' }, vars: ['count'], plural: true },
  'diff.line': { en: 'Line {line}:', vars: ['line'] },
  'diff.empty': { en: '(empty)', vars: [] },
  'date.days': { en: { one: '{count} day', other: '{count} days' }, vars: ['count'], plural: true },
  'url.none': { en: '(none)', vars: [] },
  'timestamp.local': { en: 'Local time: {value}', vars: ['value'] },
  'timestamp.seconds': { en: 'Seconds: {value}', vars: ['value'] },
  'timestamp.milliseconds': { en: 'Milliseconds: {value}', vars: ['value'] },
};

// Page-level strings rendered by src/template.mjs for language packs (`pack.page`).
export const pageKeys = {
  faqHow: { en: 'How do I use {name}?', vars: ['name'] },
  privacyQuestion: { en: 'Is my data sent to a server?', vars: [] },
  privacyAnswer: { en: 'No. Processing happens in your browser and your data is not uploaded.', vars: [] },
  about: { en: 'About {title}.', vars: ['title'] },
  madeSimple: { en: '{title} made simple.', vars: ['title'] },
  categoryTool: { en: '{category} tool', vars: ['category'] },
  workspace: { en: '{title} workspace', vars: ['title'] },
};
