const abs = (value) => value < 0n ? -value : value;
const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a || 1n; };
const rational = (n, d = 1n) => {
  if (d === 0n) throw new RangeError('Denominator cannot be zero.');
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  return { n: n / divisor, d: d / divisor };
};
const graphemeSegmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
const graphemes = (text) => {
  const normalized = String(text).normalize('NFC');
  return graphemeSegmenter ? [...graphemeSegmenter.segment(normalized)].map(({ segment }) => segment) : Array.from(normalized);
};

export function parseFraction(input) {
  const text = String(input).trim().replace(/[−–—]/gu, '-').replace(/,/gu, '.');
  if (!text || text.length > 100) throw new TypeError('Enter a fraction, mixed number or decimal.');
  let match = text.match(/^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/u);
  if (match) {
    const [, sign, whole, numerator, denominator] = match;
    const direction = sign === '-' ? -1n : 1n;
    return rational(direction * (BigInt(whole) * BigInt(denominator) + BigInt(numerator)), BigInt(denominator));
  }
  match = text.match(/^([+-]?\d+)\s*\/\s*(\d+)$/u);
  if (match) return rational(BigInt(match[1]), BigInt(match[2]));
  match = text.match(/^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))$/u);
  if (!match) throw new TypeError('Use a value such as 3/4, -2 1/3 or 0.125.');
  const [, sign, whole = '0', decimals = '', leadingDecimals = ''] = match;
  const fractional = decimals || leadingDecimals;
  const denominator = 10n ** BigInt(fractional.length);
  const numerator = BigInt(whole || '0') * denominator + BigInt(fractional || '0');
  return rational((sign === '-' ? -1n : 1n) * numerator, denominator);
}

export function calculateFraction(first, second, operation) {
  const a = typeof first === 'string' ? parseFraction(first) : first;
  const b = typeof second === 'string' ? parseFraction(second) : second;
  let result;
  if (operation === 'add') result = rational(a.n * b.d + b.n * a.d, a.d * b.d);
  else if (operation === 'subtract') result = rational(a.n * b.d - b.n * a.d, a.d * b.d);
  else if (operation === 'multiply') result = rational(a.n * b.n, a.d * b.d);
  else if (operation === 'divide') result = rational(a.n * b.d, a.d * b.n);
  else throw new TypeError('Choose an arithmetic operation.');
  if (result.n.toString().length > 40 || result.d.toString().length > 40) throw new RangeError('The result is too large to display safely.');
  const sign = result.n < 0n ? '-' : '';
  const numerator = abs(result.n);
  const whole = numerator / result.d;
  const remainder = numerator % result.d;
  const mixed = remainder === 0n ? `${sign}${whole}` : whole === 0n ? `${sign}${remainder}/${result.d}` : `${sign}${whole} ${remainder}/${result.d}`;
  return { ...result, fraction: result.d === 1n ? `${result.n}` : `${result.n}/${result.d}`, mixed, decimal: Number(result.n) / Number(result.d) };
}

function parseIpv4(value) {
  const parts = value.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/u.test(part) || Number(part) > 255)) throw new TypeError('Enter a valid IPv4 address.');
  return parts.reduce((number, part) => number * 256 + Number(part), 0);
}

const ipv4 = (value) => [24, 16, 8, 0].map((shift) => Math.floor(value / (2 ** shift)) % 256).join('.');
export function calculateSubnet(value) {
  const match = String(value).trim().match(/^([^/]+)\/(\d{1,2})$/u);
  if (!match) throw new TypeError('Use an IPv4 address and CIDR prefix, such as 192.168.1.10/24.');
  const address = parseIpv4(match[1]);
  const prefix = Number(match[2]);
  if (prefix < 0 || prefix > 32) throw new RangeError('CIDR prefix must be from /0 to /32.');
  const block = 2 ** (32 - prefix);
  const network = Math.floor(address / block) * block;
  const last = network + block - 1;
  const mask = prefix === 0 ? 0 : 0xffffffff - (2 ** (32 - prefix) - 1);
  const wildcard = 0xffffffff - mask;
  let firstHost = network;
  let lastHost = last;
  let usableHosts = block;
  let broadcast = ipv4(last);
  if (prefix <= 30) { firstHost += 1; lastHost -= 1; usableHosts = Math.max(0, block - 2); }
  else if (prefix === 31) broadcast = 'N/A (/31 point-to-point)';
  else broadcast = 'N/A (/32 single address)';
  return { prefix, network: ipv4(network), mask: ipv4(mask), wildcard: ipv4(wildcard), broadcast, firstHost: ipv4(firstHost), lastHost: ipv4(lastHost), totalAddresses: block, usableHosts };
}

function parseClock(value) {
  const match = String(value ?? '').match(/^(\d{2}):(\d{2})$/u);
  if (!match) throw new TypeError('Enter both a valid start and end time for each shift.');
  return Number(match[1]) * 60 + Number(match[2]);
}
export function calculateTimeCard(shifts) {
  const rows = shifts.filter((shift) => shift.start || shift.end);
  if (!rows.length) throw new TypeError('Enter at least one shift.');
  const totals = rows.map(({ start, end, breakMinutes = 0 }) => {
    let startMinutes = parseClock(start);
    let endMinutes = parseClock(end);
    if (endMinutes < startMinutes) endMinutes += 24 * 60;
    const pause = Number(breakMinutes);
    const gross = endMinutes - startMinutes;
    if (!Number.isInteger(pause) || pause < 0 || pause > 720 || pause >= gross) throw new RangeError('Break must be a whole number of minutes shorter than the shift.');
    return { minutes: gross - pause, breakMinutes: pause };
  });
  return totals.reduce((sum, row) => ({ minutes: sum.minutes + row.minutes, breakMinutes: sum.breakMinutes + row.breakMinutes }), { minutes: 0, breakMinutes: 0 });
}

export function calculateFuelCost({ distance, efficiency, price, passengers = 1, system = 'us', roundTrip = false }) {
  for (const [name, value] of Object.entries({ distance, efficiency, price, passengers })) if (!Number.isFinite(Number(value))) throw new TypeError(`Enter a valid ${name}.`);
  distance = Number(distance); efficiency = Number(efficiency); price = Number(price); passengers = Number(passengers);
  if (distance <= 0 || efficiency <= 0 || price < 0 || !Number.isInteger(passengers) || passengers < 1 || passengers > 100) throw new RangeError('Distance and efficiency must be positive; price and passenger count must be valid.');
  const totalDistance = distance * (roundTrip ? 2 : 1);
  const fuel = system === 'metric' ? (totalDistance * efficiency) / 100 : totalDistance / efficiency;
  const cost = fuel * price;
  return { distance: totalDistance, fuel, cost, perPassenger: cost / passengers, fuelUnit: system === 'metric' ? 'L' : 'gal' };
}

export function typingMetrics(prompt, typed, elapsedMs) {
  const expected = graphemes(prompt);
  const entered = graphemes(typed);
  let correct = 0;
  for (let index = 0; index < Math.min(expected.length, entered.length); index += 1) if (expected[index] === entered[index]) correct += 1;
  const minutes = Math.max(0, elapsedMs) / 60_000;
  return { wpm: minutes > 0 ? Math.round((entered.length / 5 / minutes) * 10) / 10 : 0, accuracy: entered.length ? Math.round((correct / entered.length) * 1000) / 10 : 100, correctCharacters: correct, typedCharacters: entered.length };
}

const loremSentences = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
];
export function generateLorem(mode, amount) {
  amount = Number(amount);
  const limits = { paragraphs: 50, sentences: 200, words: 5000 };
  if (!Object.hasOwn(limits, mode) || !Number.isInteger(amount) || amount < 1 || amount > limits[mode]) throw new RangeError('Choose an amount within the displayed limit.');
  if (mode === 'sentences') return Array.from({ length: amount }, (_, index) => loremSentences[index % loremSentences.length]).join(' ');
  if (mode === 'words') {
    const words = loremSentences.join(' ').replaceAll('.', '').split(/\s+/u);
    return Array.from({ length: amount }, (_, index) => words[index % words.length]).join(' ') + '.';
  }
  return Array.from({ length: amount }, (_, paragraph) => Array.from({ length: 4 + (paragraph % 3) }, (_, index) => loremSentences[(paragraph + index) % loremSentences.length]).join(' ')).join('\n\n');
}

export function parsePdfPageRanges(value, pageCount) {
  if (!Number.isInteger(pageCount) || pageCount < 1 || pageCount > 30) throw new RangeError('PDF must contain between 1 and 30 pages.');
  const text = String(value).trim().toLowerCase();
  if (!text || text === 'all') return Array.from({ length: pageCount }, (_, index) => index + 1);
  const pages = new Set();
  for (const raw of text.split(',')) {
    const part = raw.trim();
    const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/u);
    if (!match) throw new TypeError('Enter pages such as 1-3, 5, or all.');
    const first = Number(match[1]);
    const last = Number(match[2] ?? match[1]);
    if (first < 1 || last < first || last > pageCount) throw new RangeError(`Page numbers must be between 1 and ${pageCount}.`);
    for (let page = first; page <= last; page += 1) pages.add(page);
  }
  if (!pages.size) throw new TypeError('Choose at least one page.');
  if (pages.size > 30) throw new RangeError('Choose no more than 30 pages.');
  return [...pages].sort((a, b) => a - b);
}

// Minimal uncompressed ZIP writer: avoids loading another library for local PDF export.
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) { let c = n; for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; table[n] = c >>> 0; }
  return table;
})();
const crc32 = (bytes) => { let crc = 0xffffffff; for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8); return (crc ^ 0xffffffff) >>> 0; };
const u16 = (view, offset, value) => view.setUint16(offset, value, true);
const u32 = (view, offset, value) => view.setUint32(offset, value, true);
export function createZip(entries) {
  if (!entries.length || entries.length > 30) throw new RangeError('ZIP must contain between 1 and 30 files.');
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const filename = encoder.encode(name);
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const crc = crc32(bytes);
    const header = new Uint8Array(30 + filename.length);
    const view = new DataView(header.buffer);
    u32(view, 0, 0x04034b50); u16(view, 4, 20); u16(view, 6, 0x0800); u16(view, 8, 0); u32(view, 14, crc); u32(view, 18, bytes.length); u32(view, 22, bytes.length); u16(view, 26, filename.length); header.set(filename, 30);
    localParts.push(header, bytes);
    const central = new Uint8Array(46 + filename.length);
    const centralView = new DataView(central.buffer);
    u32(centralView, 0, 0x02014b50); u16(centralView, 4, 20); u16(centralView, 6, 20); u16(centralView, 8, 0x0800); u16(centralView, 10, 0); u32(centralView, 16, crc); u32(centralView, 20, bytes.length); u32(centralView, 24, bytes.length); u16(centralView, 28, filename.length); u32(centralView, 42, offset); central.set(filename, 46);
    centralParts.push(central);
    offset += header.length + bytes.length;
  }
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  u32(endView, 0, 0x06054b50); u16(endView, 8, entries.length); u16(endView, 10, entries.length); u32(endView, 12, centralSize); u32(endView, 16, offset);
  return new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
}

export function formatSql(source, uppercase = true) {
  const text = String(source).trim();
  if (!text || text.length > 200_000) throw new RangeError('Enter SQL under 200 KB.');
  const tokens = [];
  let token = '';
  let quote = '';
  let lineComment = false;
  let blockComment = false;
  const flush = () => { if (token) { tokens.push({ type: 'word', value: token }); token = ''; } };
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (lineComment) { token += char; if (char === '\n') { tokens.push({ type: 'comment', value: token.trimEnd() }); token = ''; lineComment = false; } continue; }
    if (blockComment) { token += char; if (char === '*' && next === '/') { token += next; i += 1; tokens.push({ type: 'comment', value: token }); token = ''; blockComment = false; } continue; }
    if (quote) { token += char; if (char === quote) { if (next === quote && quote !== ']') { token += next; i += 1; } else quote = ''; } else if (quote === ']' && char === ']') quote = ''; continue; }
    if ((char === '-' && next === '-') || (char === '/' && next === '*')) {
      flush();
      if (char === '-' ) { token = '--'; i += 1; lineComment = true; } else { token = '/*'; i += 1; blockComment = true; }
      continue;
    }
    if (char === "'" || char === '"' || char === '`' || char === '[') { token += char; quote = char === '[' ? ']' : char; continue; }
    if (/\s/u.test(char)) { flush(); continue; }
    if (/[(),;]/u.test(char)) { flush(); tokens.push({ type: 'punctuation', value: char }); continue; }
    if (/[=<>!+*/%-]/u.test(char)) {
      flush();
      const pair = char + (next ?? '');
      const operator = ['<=', '>=', '!=', '<>', '||', '::', '->'].includes(pair) ? pair : char;
      tokens.push({ type: 'operator', value: operator });
      if (operator.length === 2) i += 1;
      continue;
    }
    token += char;
  }
  if (lineComment && token) { tokens.push({ type: 'comment', value: token.trimEnd() }); token = ''; lineComment = false; }
  flush();
  const clauses = new Set(['SELECT', 'FROM', 'WHERE', 'HAVING', 'LIMIT', 'OFFSET', 'RETURNING', 'UNION', 'EXCEPT', 'INTERSECT', 'VALUES', 'SET']);
  const compound = new Set(['GROUP BY', 'ORDER BY', 'PARTITION BY', 'UNION ALL', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'CROSS JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN']);
  const keywords = new Set([...clauses, ...compound, 'AS', 'ON', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'JOIN', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'INDEX', 'WITH', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'DISTINCT', 'ASC', 'DESC', 'LIKE', 'BETWEEN', 'EXISTS', 'BY', 'ORDER', 'ALL', 'UNION', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'BEGIN', 'COMMIT', 'ROLLBACK']);
  const words = tokens.map((item) => item.type === 'word' && uppercase && keywords.has(item.value.toUpperCase()) ? { ...item, value: item.value.toUpperCase() } : item);
  const upper = (index) => words[index]?.type === 'word' ? words[index].value.toUpperCase() : '';
  const lines = [];
  let current = '';
  let depth = 0;
  const subqueryStack = [];
  let nextIndent = null;
  const emit = (indent = depth) => { if (current.trim()) lines.push(`${'  '.repeat(Math.max(0, nextIndent ?? indent))}${current.trim()}`); current = ''; nextIndent = null; };
  for (let i = 0; i < words.length; i += 1) {
    const item = words[i];
    const pair = `${upper(i)} ${upper(i + 1)}`;
    const triple = `${pair} ${upper(i + 2)}`;
    let compoundMatch = [...compound].find((clause) => triple.startsWith(`${clause} `)) ?? [...compound].find((clause) => pair === clause);
    if (item.type === 'word' && (clauses.has(upper(i)) || compoundMatch)) {
      emit();
      if (compoundMatch) {
        const parts = compoundMatch.split(' ');
        current = parts.map(() => words[i++].value).join(' ');
        i -= 1;
      } else current = item.value;
      continue;
    }
    if (item.type === 'punctuation' && item.value === '(') {
      const needsSpace = /\b(?:SELECT|WHERE|HAVING|ON|AND|OR|NOT|IN|EXISTS|FROM|JOIN|VALUES|WHEN|THEN|ELSE|AS|BY)$/iu.test(current.trimEnd());
      current = `${current.trimEnd()}${needsSpace ? ' ' : ''}(`;
      subqueryStack.push({ subquery: ['SELECT', 'WITH'].includes(upper(i + 1)), lineCount: lines.length });
      depth += 1;
      continue;
    }
    if (item.type === 'punctuation' && item.value === ')') {
      const group = subqueryStack.pop() ?? {};
      if (group.subquery && current.trim()) {
        current = `${current.trimEnd()})`;
        emit();
        depth = Math.max(0, depth - 1);
        continue;
      }
      if (current.trim() && lines.length > (group.lineCount ?? lines.length)) {
        current = `${current.trimEnd()})`;
        emit();
        depth = Math.max(0, depth - 1);
        continue;
      }
      depth = Math.max(0, depth - 1);
      current = `${current.trimEnd()})`;
      continue;
    }
    if (item.type === 'punctuation' && item.value === ',') {
      current = `${current.trimEnd()},`;
      if (depth === 0 || subqueryStack.some((group) => group.subquery)) { emit(depth); nextIndent = depth + 1; }
      continue;
    }
    if (item.type === 'punctuation' && item.value === ';') { current = `${current.trimEnd()};`; emit(); continue; }
    if (item.type === 'comment') { emit(); lines.push(`${'  '.repeat(Math.max(0, depth))}${item.value}`); continue; }
    if (item.type === 'operator') { current = `${current.trimEnd()}${current.endsWith('(') ? '' : ' '}${item.value}`; continue; }
    const previous = words[i - 1];
    const noSpace = !current || current.endsWith('(') || current.endsWith('.') || item.value === '.' || (previous?.type === 'punctuation' && previous.value === '.');
    current += `${noSpace ? '' : ' '}${item.value}`;
  }
  emit();
  return lines.join('\n').replace(/\n{3,}/gu, '\n\n');
}

export function formatTimer(milliseconds) {
  const value = Number(milliseconds);
  const total = Number.isFinite(value) ? Math.max(0, Math.ceil(value / 1000)) : 0;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function createAmidakujiDraw(names, randomIndex, rowCount = 18) {
  if (!Array.isArray(names) || names.length < 2 || names.length > 8 || names.some((name) => typeof name !== 'string' || !name.trim() || name.length > 80)) {
    throw new RangeError('Amidakuji needs 2–8 names, each up to 80 characters.');
  }
  if (!Number.isInteger(rowCount) || rowCount < 6 || rowCount > 64) throw new RangeError('Amidakuji rows must be from 6 to 64.');
  if (typeof randomIndex !== 'function') throw new TypeError('A random index function is required.');
  const pick = (length) => {
    const index = randomIndex(length);
    if (!Number.isInteger(index) || index < 0 || index >= length) throw new RangeError('Random index is outside its range.');
    return index;
  };
  const rows = Array.from({ length: rowCount }, () => {
    const bars = Array(names.length - 1).fill(false);
    for (let column = 0; column < bars.length; column += 1) {
      if (!bars[column - 1] && pick(2) === 0) bars[column] = true;
    }
    return bars;
  });
  const destinations = names.map((_, start) => {
    let column = start;
    for (const bars of rows) {
      if (bars[column]) column += 1;
      else if (column > 0 && bars[column - 1]) column -= 1;
    }
    return column;
  });
  const target = pick(names.length);
  const winnerIndex = destinations.indexOf(target);
  if (winnerIndex < 0) throw new Error('The ladder did not produce a valid path.');
  return { rows, destinations, target, winnerIndex };
}
