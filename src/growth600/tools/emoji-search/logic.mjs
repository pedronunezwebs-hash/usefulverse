function fold(value) {
  return String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
}

export function searchEmoji(entries, query, limit = 80) {
  const needle = fold(query).trim();
  if (!needle || needle.length > 100) throw Object.assign(new RangeError('Enter a search up to 100 characters.'), { code: 'invalid-query' });
  if (!Array.isArray(entries) || entries.length > 2500) throw Object.assign(new RangeError('The emoji data could not be read.'), { code: 'invalid-data' });
  if (!Number.isInteger(limit) || limit < 1 || limit > 2500) throw Object.assign(new RangeError('Choose a result limit from 1 to 2,500.'), { code: 'invalid-limit' });
  const terms = needle.split(/\s+/u);
  const results = [];
  for (const [symbol, name, keywords] of entries) {
    const normalizedName = fold(name);
    const normalizedKeywords = (keywords ?? []).map(fold);
    const haystack = fold([symbol, name, ...normalizedKeywords].join(' '));
    if (!terms.every((term) => haystack.includes(term))) continue;
    const rank = symbol === needle ? 0 : normalizedName === needle ? 1 : normalizedName.startsWith(needle) ? 2 : normalizedKeywords.includes(needle) ? 3 : normalizedKeywords.some((word) => word.startsWith(needle)) ? 4 : 5;
    results.push({ symbol, name, rank });
  }
  results.sort((a, b) => a.rank - b.rank || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return Object.freeze(results.slice(0, limit).map(({ symbol, name }) => Object.freeze({ symbol, name })));
}
