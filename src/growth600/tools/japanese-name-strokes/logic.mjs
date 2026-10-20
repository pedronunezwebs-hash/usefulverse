export function calculateJapaneseNameStrokes(name, counts) {
  const normalized = String(name ?? '').normalize('NFC').trim();
  if (!normalized || Array.from(normalized).length > 40) throw new RangeError('Enter between 1 and 40 characters.');
  if (!counts || typeof counts !== 'object' || Array.isArray(counts)) throw new TypeError('Stroke-count data is unavailable.');
  const characters = Array.from(normalized, (character) => {
    const count = counts[character];
    return Object.freeze({ character, strokes: Number.isInteger(count) && count > 0 ? count : null });
  });
  const complete = characters.every(({ strokes }) => strokes !== null);
  return Object.freeze({ normalized, characters: Object.freeze(characters), complete, total: complete ? characters.reduce((sum, item) => sum + item.strokes, 0) : null });
}
