export function previousGraphemeBoundary(text) {
  const value = String(text ?? '');
  if (!value) return 0;
  if (globalThis.Intl?.Segmenter) {
    const segments = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value)];
    return segments.at(-1)?.index ?? 0;
  }
  const points = [...value];
  let start = points.length - 1;
  const isMark = (point) => /[\p{Mark}\uFE00-\uFE0F\u{E0100}-\u{E01EF}\u{1F3FB}-\u{1F3FF}]/u.test(point);
  const isRegionalIndicator = (point) => /[\u{1F1E6}-\u{1F1FF}]/u.test(point);
  while (start > 0 && isMark(points[start])) start -= 1;
  while (start > 0 && points[start - 1] === '\u200d') {
    start -= 1;
    if (start > 0) start -= 1;
    while (start > 0 && isMark(points[start])) start -= 1;
  }
  if (start > 0 && isRegionalIndicator(points[start]) && isRegionalIndicator(points[start - 1])) start -= 1;
  return points.slice(0, start).join('').length;
}
