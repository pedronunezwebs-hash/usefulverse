export function countReadingWords(text, locale = 'en') {
  const source = String(text ?? '').trim();
  if (!source) return 0;
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(locale, { granularity: 'word' });
    let count = 0;
    for (const segment of segmenter.segment(source)) if (segment.isWordLike) count++;
    return count;
  }
  return source.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

export function readingWordsPerMinute(wordCount, elapsedMilliseconds) {
  const words = Number(wordCount);
  const elapsed = Number(elapsedMilliseconds);
  if (!Number.isSafeInteger(words) || words < 1 || words > 10000) throw new RangeError('word count must be from 1 to 10,000');
  if (!Number.isFinite(elapsed) || elapsed < 1000 || elapsed > 24 * 60 * 60 * 1000) throw new RangeError('reading time must be at least one second and no more than 24 hours');
  return Math.round(words * 60000 / elapsed);
}

export function formatElapsed(milliseconds) {
  const total = Math.max(0, Math.floor(Number(milliseconds) / 1000));
  if (!Number.isFinite(total)) return '0:00';
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
