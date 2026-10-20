export const MAX_SOURCE_LENGTH = 4000;
export const MAX_OUTPUT_TOKENS = 2048;
export const PARAPHRASE_STYLES = Object.freeze(['clear', 'formal', 'friendly', 'concise']);

export function validateParaphraseSource(value) {
  const source = String(value ?? '').trim();
  if (!source) throw new Error('empty-source');
  if (source.length > MAX_SOURCE_LENGTH) throw new Error('source-too-long');
  return source;
}

export function validateParaphraseStyle(value) {
  const style = String(value ?? '');
  if (!PARAPHRASE_STYLES.includes(style)) throw new Error('invalid-style');
  return style;
}
