export const gradePoints = Object.freeze({
  'A+': 4, A: 4, 'A-': 3.7,
  'B+': 3.3, B: 3, 'B-': 2.7,
  'C+': 2.3, C: 2, 'C-': 1.7,
  'D+': 1.3, D: 1, 'D-': 0.7,
  F: 0,
});

export function parseHexColor(value) {
  const match = String(value).trim().match(/^#?([\da-f]{3}|[\da-f]{6})$/iu);
  if (!match) throw new TypeError('Enter a 3- or 6-digit HEX color.');
  const hex = match[1].length === 3 ? [...match[1]].map((digit) => digit + digit).join('') : match[1];
  return [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
}

function relativeLuminance(color) {
  const [red, green, blue] = parseHexColor(color).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function calculateContrastRatio(foreground, background) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  return { ratio, aaNormal: ratio >= 4.5, aaLarge: ratio >= 3, aaaNormal: ratio >= 7, aaaLarge: ratio >= 4.5 };
}

export function calculateTipSplit(bill, tipPercent, people) {
  if (!Number.isFinite(bill) || bill <= 0) throw new RangeError('Enter a bill amount greater than zero.');
  if (!Number.isFinite(tipPercent) || tipPercent < 0 || tipPercent > 500) throw new RangeError('Tip must be between 0 and 500 percent.');
  if (!Number.isInteger(people) || people < 1 || people > 100) throw new RangeError('Choose between 1 and 100 people.');
  const tip = bill * tipPercent / 100;
  const total = bill + tip;
  return { tip, total, tipPerPerson: tip / people, totalPerPerson: total / people, people };
}

export function calculateGpa(courses) {
  const valid = courses.filter((course) => course.enabled !== false);
  if (!valid.length) throw new RangeError('Add at least one course.');
  let weightedPoints = 0;
  let totalCredits = 0;
  for (const [index, course] of valid.entries()) {
    const credits = Number(course.credits);
    const points = gradePoints[course.grade];
    if (!Number.isFinite(credits) || credits <= 0 || credits > 100) throw new RangeError(`Course ${index + 1}: credits must be greater than 0 and at most 100.`);
    if (points === undefined) throw new TypeError(`Course ${index + 1}: choose a valid letter grade.`);
    weightedPoints += credits * points;
    totalCredits += credits;
  }
  return { gpa: weightedPoints / totalCredits, totalCredits, courses: valid.length };
}

export function parseLocalizedNumber(value, locale = 'en') {
  let input = String(value).normalize('NFKC')
    .replace(/[०-९]/gu, (digit) => String(digit.codePointAt(0) - 0x966))
    .replace(/[০-৯]/gu, (digit) => String(digit.codePointAt(0) - 0x09e6))
    .replace(/[٠-٩]/gu, (digit) => String(digit.codePointAt(0) - 0x660))
    .replace(/[۰-۹]/gu, (digit) => String(digit.codePointAt(0) - 0x6f0))
    .replace(/\u066b/gu, '.')
    .replace(/\u066c/gu, '')
    .trim();
  if (!input) return Number.NaN;
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
  const group = parts.find((part) => part.type === 'group')?.value ?? ',';
  input = input.replace(/[\s\u00a0\u202f]/gu, '');
  if (decimal === ',') {
    if (input.includes(',')) input = input.replaceAll(group, '').replace(',', '.');
    else if (group === '.' && /^[-+]?\d{1,3}(?:\.\d{3})+$/u.test(input)) input = input.replaceAll('.', '');
  } else if (decimal === '.') {
    if (input.includes('.')) {
      const groupingPattern = group === ',' ? /^[-+]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d+)?$/u : null;
      if (groupingPattern?.test(input)) input = input.replaceAll(group, '');
      else if (group !== ',' && input.includes(group)) input = input.replaceAll(group, '');
    } else if (input.includes(group)) {
      const grouped = /^[-+]?\d{1,3}(?:,\d{3})+$/u.test(input) || /^[-+]?\d{1,2}(?:,\d{2})*,\d{3}$/u.test(input);
      input = grouped ? input.replaceAll(group, '') : input.replace(group, '.');
    }
  } else {
    if (input.includes(decimal)) input = input.replaceAll(group, '').replace(decimal, '.');
  }
  return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(input) ? Number(input) : Number.NaN;
}

export function detectCsvDelimiter(text) {
  const candidates = [',', ';', '\t', '|'];
  const counts = new Map(candidates.map((candidate) => [candidate, 0]));
  let quoted = false;
  const sample = String(text).slice(0, 64_000);
  for (let index = 0; index < sample.length; index += 1) {
    const character = sample[index];
    if (character === '"') {
      if (quoted && sample[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (!quoted && counts.has(character)) counts.set(character, counts.get(character) + 1);
  }
  return candidates.reduce((best, current) => counts.get(current) > counts.get(best) ? current : best, ',');
}

export function parseCsv(text, delimiter = detectCsvDelimiter(text), limits = {}) {
  const maxRows = limits.maxRows ?? 50_001;
  const maxCells = limits.maxCells ?? 200_000;
  const source = String(text).replace(/^\uFEFF/u, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let closedQuote = false;
  let cellCount = 0;
  const pushField = () => {
    cellCount += 1;
    if (cellCount > maxCells) throw new RangeError(`This CSV has more than ${maxCells} cells.`);
    row.push(field); field = ''; closedQuote = false;
  };
  const pushRow = () => {
    pushField();
    if (rows.length >= maxRows) throw new RangeError(`This CSV has more than ${maxRows - 1} data rows.`);
    rows.push(row);
    row = [];
  };

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') { quoted = false; closedQuote = true; }
      else field += character;
      continue;
    }
    if (character === '"' && field.length === 0 && !closedQuote) { quoted = true; continue; }
    if (character === '"' && field.length > 0) throw new SyntaxError('A quote appeared inside an unquoted CSV field.');
    if (character === delimiter) { pushField(); continue; }
    if (character === '\n' || character === '\r') {
      if (character === '\r' && source[index + 1] === '\n') index += 1;
      pushRow();
      continue;
    }
    if (closedQuote && /\s/u.test(character)) continue;
    if (closedQuote) throw new SyntaxError('Unexpected text after a quoted CSV field.');
    field += character;
  }
  if (quoted) throw new SyntaxError('A quoted CSV field is missing its closing quote.');
  if (field.length || row.length || (source.length && !/[\r\n]$/u.test(source))) pushRow();
  while (rows.length && rows.at(-1).every((cell) => cell === '')) rows.pop();
  if (!rows.length) return { headers: [], rows: [], delimiter };

  const headers = rows.shift().map((header, index) => header.trim() || `Column ${index + 1}`);
  const maxColumns = limits.maxColumns ?? 200;
  if (headers.length > maxColumns) throw new RangeError(`This CSV has more than ${maxColumns} columns.`);
  if (rows.some((cells) => cells.length > headers.length)) throw new SyntaxError('A CSV row has more values than the header.');
  const records = rows.map((cells) => Array.from({ length: headers.length }, (_, index) => cells[index] ?? ''));
  return { headers, rows: records, delimiter };
}

export function parsePageRanges(value, pageCount, maxPages = 200, maxGroups = 10) {
  const groups = String(value).split(',').map((part) => part.trim()).filter(Boolean).map((part) => {
    const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/u);
    if (!match) throw new SyntaxError('Use page numbers such as 1-3, 5.');
    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);
    if (start < 1 || end < start || end > pageCount) throw new RangeError(`Page ranges must be between 1 and ${pageCount}.`);
    return Array.from({ length: end - start + 1 }, (_, offset) => start - 1 + offset);
  });
  if (!groups.length) throw new SyntaxError('Enter at least one page number.');
  if (groups.length > maxGroups) throw new RangeError(`Create no more than ${maxGroups} PDF files at once.`);
  const pages = groups.flat();
  if (pages.length > maxPages) throw new RangeError(`Choose no more than ${maxPages} pages at a time.`);
  if (new Set(pages).size !== pages.length) throw new SyntaxError('A page cannot appear more than once.');
  return groups;
}

export function formatFileSize(bytes, locale = 'en') {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  const megabytes = bytes >= 1024 * 1024;
  const value = megabytes ? bytes / (1024 * 1024) : bytes / 1024;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)} ${megabytes ? 'MB' : 'KB'}`;
}
