const MAX_CHARS = 500_000;

export const markdownActions = Object.freeze({
  heading: { before: '# ', after: '', line: true },
  bold: { before: '**', after: '**' },
  italic: { before: '*', after: '*' },
  link: { before: '[', after: ']()' },
  code: { before: '`', after: '`' },
  quote: { before: '> ', after: '', line: true },
  bulletList: { before: '- ', after: '', line: true },
  numberList: { before: '1. ', after: '', line: true },
  checklist: { before: '- [ ] ', after: '', line: true },
});

export function insertMarkdown(text, selectionStart, selectionEnd, action) {
  if (typeof text !== 'string' || text.length > MAX_CHARS || !Number.isInteger(selectionStart) || !Number.isInteger(selectionEnd) || selectionStart < 0 || selectionEnd < selectionStart || selectionEnd > text.length) {
    throw new RangeError('Invalid Markdown selection.');
  }
  if (action === 'table') {
    const snippet = '|  |  |\n| --- | --- |\n|  |  |\n';
    const value = `${text.slice(0, selectionStart)}${snippet}${text.slice(selectionEnd)}`;
    if (value.length > MAX_CHARS) throw new RangeError('Markdown document is too long.');
    const cellStart = selectionStart + 2;
    return Object.freeze({ value, selectionStart: cellStart, selectionEnd: cellStart });
  }
  const format = markdownActions[action];
  if (!format) throw new TypeError('Unsupported Markdown insertion.');
  let start = selectionStart;
  let end = selectionEnd;
  if (format.line) {
    start = text.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const lineEnd = text.indexOf('\n', end);
    end = lineEnd === -1 ? text.length : lineEnd;
  }
  const selected = text.slice(start, end);
  const insertion = `${format.before}${selected}${format.after}`;
  const value = `${text.slice(0, start)}${insertion}${text.slice(end)}`;
  if (value.length > MAX_CHARS) throw new RangeError('Markdown document is too long.');
  const selectedStart = start + format.before.length;
  const selectedEnd = selectedStart + (selected.length || insertion.length - format.before.length - format.after.length);
  return Object.freeze({ value, selectionStart: selectedStart, selectionEnd: selectedEnd });
}

export function countMarkdown(text) {
  if (typeof text !== 'string') throw new TypeError('Markdown text must be a string.');
  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? [];
  return Object.freeze({ words: words.length, characters: [...text].length });
}
