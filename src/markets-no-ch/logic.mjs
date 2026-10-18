const finite = (value, name) => {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be a finite number.`);
  return number;
};

export const natoAlphabet = Object.freeze(['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu']);
export const radioDigits = Object.freeze(['Zero', 'One', 'Two', 'Tree', 'Fower', 'Fife', 'Six', 'Seven', 'Eight', 'Niner']);
const punctuationWords = Object.freeze({ '.': 'Stop', ',': 'Comma', '-': 'Dash', '/': 'Stroke', '?': 'Question mark', ':': 'Colon', ';': 'Semicolon' });
const reversePhonetic = new Map([...natoAlphabet.map((word, index) => [word.toLocaleLowerCase('en'), String.fromCharCode(65 + index)]), ...radioDigits.map((word, index) => [word.toLocaleLowerCase('en'), String(index)]), ...Object.entries(punctuationWords).map(([symbol, word]) => [word.toLocaleLowerCase('en'), symbol])]);

export function encodePhonetic(input) {
  const text = String(input ?? '').normalize('NFC').toLocaleUpperCase('en');
  const parts = [];
  const unsupported = new Set();
  for (const character of text) {
    if (character >= 'A' && character <= 'Z') parts.push(natoAlphabet[character.charCodeAt(0) - 65]);
    else if (character >= '0' && character <= '9') parts.push(radioDigits[Number(character)]);
    else if (/\s/u.test(character)) parts.push('/');
    else if (punctuationWords[character]) parts.push(punctuationWords[character]);
    else { parts.push(character); if (/\p{L}/u.test(character)) unsupported.add(character); }
  }
  return Object.freeze({ text: parts.join(' '), unsupported: [...unsupported] });
}

export function decodePhonetic(input) {
  const tokens = String(input ?? '').trim().split(/\s+/u).filter(Boolean);
  return tokens.map((token) => token === '/' ? ' ' : reversePhonetic.get(token.toLocaleLowerCase('en')) ?? token).join('');
}

export function norwayHolidayPay({ holidayPayBasis, age60Plus = false, fiveWeekAgreement = false }) {
  const basis = finite(holidayPayBasis, 'holidayPayBasis');
  if (basis < 0 || basis > 100_000_000) throw new RangeError('Enter a feriepengegrunnlag from 0 to 100,000,000 NOK.');
  const rate = age60Plus ? (fiveWeekAgreement ? 14.3 : 12.5) : (fiveWeekAgreement ? 12 : 10.2);
  return Object.freeze({ basis, rate, amount: basis * rate / 100, age60Plus: Boolean(age60Plus), fiveWeekAgreement: Boolean(fiveWeekAgreement) });
}

export function knittingGauge({ stitches, rows, sampleWidthCm, sampleHeightCm, targetWidthCm, targetHeightCm, repeat = 1, symmetric = false }) {
  const s = finite(stitches, 'stitches');
  const r = finite(rows, 'rows');
  const sw = finite(sampleWidthCm, 'sampleWidthCm');
  const sh = finite(sampleHeightCm, 'sampleHeightCm');
  const tw = finite(targetWidthCm, 'targetWidthCm');
  const th = finite(targetHeightCm, 'targetHeightCm');
  const multiple = finite(repeat, 'repeat');
  if (![s, r, sw, sh, tw, th, multiple].every((v) => v > 0) || !Number.isInteger(multiple) || multiple > 200) throw new RangeError('Measurements and repeat must be positive; repeat is limited to 200.');
  if (s > 10000 || r > 20000 || sw > 200 || sh > 200 || tw > 2000 || th > 2000) throw new RangeError('Input exceeds the supported range.');
  const rawStitches = s * tw / sw;
  const rawRows = r * th / sh;
  const roundTo = (value, step) => Math.max(step, Math.round(value / step) * step);
  const adjustedStitches = roundTo(rawStitches, multiple);
  return Object.freeze({
    stitchesPer10Cm: s * 10 / sw,
    rowsPer10Cm: r * 10 / sh,
    rawStitches,
    rawRows,
    stitches: adjustedStitches,
    rows: Math.max(1, Math.round(rawRows)),
    widthAfterAdjustmentCm: adjustedStitches * sw / s,
    widthDifferenceCm: adjustedStitches * sw / s - tw,
    symmetric: Boolean(symmetric),
    symmetricSideStitches: symmetric ? Math.round(adjustedStitches / 2) : null,
    repeat: multiple,
  });
}

export function gradeFromPoints({ score, maximum, bands }) {
  const points = finite(score, 'score');
  const total = finite(maximum, 'maximum');
  if (total <= 0 || total > 1e9 || points < 0 || points > total) throw new RangeError('Score must be between zero and the positive maximum.');
  if (!Array.isArray(bands) || !bands.length || bands.length > 20) throw new RangeError('Provide between one and twenty grade bands.');
  const normalized = bands.map((band) => ({ label: String(band.label).trim(), minimumPercent: finite(band.minimumPercent, 'minimumPercent') })).sort((a, b) => b.minimumPercent - a.minimumPercent);
  if (normalized.some((b) => !b.label || b.minimumPercent < 0 || b.minimumPercent > 100) || new Set(normalized.map((b) => b.minimumPercent)).size !== normalized.length) throw new RangeError('Grade labels and thresholds must be unique and within 0–100%.');
  if (normalized.at(-1).minimumPercent !== 0) throw new RangeError('The lowest band must start at 0%.');
  const percent = points / total * 100;
  const band = normalized.find((item) => percent >= item.minimumPercent);
  return Object.freeze({ points, maximum: total, percent, label: band.label, bandMinimumPercent: band.minimumPercent, bands: normalized });
}

export function graphPaperSvg({ widthMm = 210, heightMm = 297, spacingMm = 5, style = 'grid', marginMm = 10, color = '#b7c7d8', copies = 1 }) {
  const width = finite(widthMm, 'widthMm');
  const height = finite(heightMm, 'heightMm');
  const step = finite(spacingMm, 'spacingMm');
  const margin = finite(marginMm, 'marginMm');
  const pages = finite(copies, 'copies');
  if (width < 40 || width > 1000 || height < 40 || height > 1000 || step < 1 || step > 50 || margin < 0 || margin * 2 >= Math.min(width, height) || !Number.isInteger(pages) || pages < 1 || pages > 20) throw new RangeError('Choose a page 40–1000 mm, spacing 1–50 mm, valid margins and 1–20 copies.');
  if (!['grid', 'dots', 'isometric'].includes(style)) throw new RangeError('Unknown paper pattern.');
  if (!/^#[0-9a-f]{6}$/iu.test(color)) throw new TypeError('Choose a six-digit hex color.');
  const innerW = width - 2 * margin;
  const innerH = height - 2 * margin;
  const safe = color.toLowerCase();
  let marks = '';
  if (style === 'dots') {
    for (let y = margin; y <= height - margin + 0.001; y += step) for (let x = margin; x <= width - margin + 0.001; x += step) marks += `<circle cx="${x}" cy="${y}" r="0.24"/>`;
  } else if (style === 'grid') {
    const vertical = Array.from({ length: Math.floor(innerW / step) + 1 }, (_, i) => `<path d="M ${margin + i * step} ${margin} V ${height - margin}"/>`).join('');
    const horizontal = Array.from({ length: Math.floor(innerH / step) + 1 }, (_, i) => `<path d="M ${margin} ${margin + i * step} H ${width - margin}"/>`).join('');
    marks = vertical + horizontal;
  } else {
    const dy = step * Math.sqrt(3) / 2;
    for (let y = margin; y <= height - margin + 0.001; y += dy) {
      marks += `<path d="M ${margin} ${y} H ${width - margin}"/>`;
      const offset = (Math.round((y - margin) / dy) % 2) * step / 2;
      for (let x = margin - innerH / Math.sqrt(3) + offset; x <= width - margin + innerH / Math.sqrt(3); x += step) {
        marks += `<path d="M ${x} ${margin} L ${x + innerH / Math.sqrt(3)} ${height - margin}"/><path d="M ${x} ${height - margin} L ${x + innerH / Math.sqrt(3)} ${margin}"/>`;
      }
    }
  }
  const strokeWidth = style === 'dots' ? 0 : 0.16;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="white"/><g fill="${safe}" stroke="${safe}" stroke-width="${strokeWidth}" vector-effect="non-scaling-stroke">${marks}</g></svg>`;
  return Object.freeze({ svg, widthMm: width, heightMm: height, spacingMm: step, innerWidthMm: innerW, innerHeightMm: innerH, pages });
}

const validBinaryRow = (row) => {
  const text = Array.isArray(row) ? row.join('') : String(row);
  return /^[01]+$/u.test(text) && !/(000|111)/u.test(text) && text.split('0').length - 1 === text.length / 2;
};
function solutionsFor(grid, limit = 2) {
  const n = grid.length;
  let count = 0;
  function search() {
    if (count >= limit) return;
    let best = null;
    let options = null;
    for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) if (grid[r][c] === null) {
      const candidates = [];
      for (const bit of [0, 1]) {
        grid[r][c] = bit;
        if (partialValid(grid, r, c)) candidates.push(bit);
      }
      grid[r][c] = null;
      if (!options || candidates.length < options.length) { best = [r, c]; options = candidates; }
      if (!options.length) return;
    }
    if (!best) { if (completeValid(grid)) count += 1; return; }
    for (const bit of options) { grid[best[0]][best[1]] = bit; search(); grid[best[0]][best[1]] = null; if (count >= limit) return; }
  }
  search();
  return count;
}
function partialValid(grid, rowIndex, colIndex) {
  const n = grid.length;
  const row = grid[rowIndex];
  const col = grid.map((r) => r[colIndex]);
  for (const line of [row, col]) {
    let zeros = 0; let ones = 0;
    for (let i = 0; i < n; i += 1) {
      if (line[i] === 0) zeros += 1; else if (line[i] === 1) ones += 1;
      if (i > 1 && line[i] !== null && line[i] === line[i - 1] && line[i] === line[i - 2]) return false;
    }
    if (zeros > n / 2 || ones > n / 2 || zeros + (n - zeros - ones) < n / 2 || ones + (n - zeros - ones) < n / 2) return false;
  }
  if (row.every((x) => x !== null)) {
    const key = row.join('');
    if (grid.slice(0, rowIndex).some((r) => r.every((x) => x !== null) && r.join('') === key)) return false;
  }
  if (col.every((x) => x !== null)) {
    const key = col.join('');
    if (Array.from({ length: colIndex }, (_, c) => grid.map((r) => r[c])).some((other) => other.every((x) => x !== null) && other.join('') === key)) return false;
  }
  return true;
}
function completeValid(grid) {
  const n = grid.length;
  if (!grid.every(validBinaryRow)) return false;
  const columns = Array.from({ length: n }, (_, c) => grid.map((row) => row[c]).join(''));
  return columns.every(validBinaryRow) && new Set(grid.map((r) => r.join(''))).size === n && new Set(columns).size === n;
}
function randomInt(max, random) { return Math.floor(random() * max); }
function shuffled(items, random) { const result = [...items]; for (let i = result.length - 1; i > 0; i -= 1) { const j = randomInt(i + 1, random); [result[i], result[j]] = [result[j], result[i]]; } return result; }
function seedRandom(seed) { let state = seed >>> 0 || 0x9e3779b9; return () => { state += 0x6d2b79f5; let t = state; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function generateBinaryPuzzle({ size = 6, seed = cryptoSeed(), removals = Math.floor(size * size * 0.55) }) {
  if (![6, 8, 10].includes(size)) throw new RangeError('Puzzle size must be 6, 8 or 10.');
  const random = seedRandom(Number(seed) || 1);
  const rows = [];
  let nodes = 0;
  function fill() {
    nodes += 1;
    if (nodes > 150000) return false;
    if (rows.length === size) return completeValid(rows);
    for (const bits of shuffled(Array.from({ length: 1 << size }, (_, i) => i.toString(2).padStart(size, '0')), random)) {
      if (!validBinaryRow(bits)) continue;
      if (rows.some((row) => row.join('') === bits)) continue;
      const row = [...bits].map(Number);
      rows.push(row);
      if (partialColumnsValid(rows, size) && fill()) return true;
      rows.pop();
    }
    return false;
  }
  if (!fill()) throw new Error('Could not create a valid board within the search budget. Try a new seed.');
  const solution = rows.map((row) => [...row]);
  const puzzle = rows.map((row) => [...row]);
  const cells = shuffled(Array.from({ length: size * size }, (_, index) => index), random);
  let removed = 0;
  const maxRemovals = Math.max(0, Math.min(Number(removals) || 0, size * size - size));
  for (const cell of cells) {
    if (removed >= maxRemovals) break;
    const row = Math.floor(cell / size); const col = cell % size; const prior = puzzle[row][col];
    puzzle[row][col] = null;
    if (solutionsFor(puzzle, 2) === 1) removed += 1; else puzzle[row][col] = prior;
  }
  return Object.freeze({ size, seed: Number(seed) >>> 0, puzzle: puzzle.map((row) => Object.freeze(row)), solution: solution.map((row) => Object.freeze(row)), blanks: removed, nodes });
}
function partialColumnsValid(rows, size) {
  for (let c = 0; c < size; c += 1) {
    const values = rows.map((row) => row[c]);
    let zeros = 0; let ones = 0;
    for (let i = 0; i < values.length; i += 1) {
      if (values[i] === 0) zeros += 1; else ones += 1;
      if (i > 1 && values[i] === values[i - 1] && values[i] === values[i - 2]) return false;
    }
    if (zeros > size / 2 || ones > size / 2) return false;
  }
  return true;
}
function cryptoSeed() { const values = new Uint32Array(1); if (globalThis.crypto?.getRandomValues) crypto.getRandomValues(values); else values[0] = Math.floor(Math.random() * 0xffffffff); return values[0] || 1; }

export function validateBinaryGrid(grid) {
  if (!Array.isArray(grid) || ![6, 8, 10].includes(grid.length) || grid.some((row) => !Array.isArray(row) || row.length !== grid.length)) return false;
  return completeValid(grid);
}

export const yatzyCategories = Object.freeze([
  ...[1, 2, 3, 4, 5, 6].map((face) => ({ id: `ones${face}`, label: `${face}s`, section: 'upper' })),
  { id: 'onePair', label: 'One pair', section: 'lower' },
  { id: 'twoPairs', label: 'Two pairs', section: 'lower' },
  { id: 'threeKind', label: 'Three of a kind', section: 'lower' },
  { id: 'fourKind', label: 'Four of a kind', section: 'lower' },
  { id: 'smallStraight', label: 'Small straight', section: 'lower' },
  { id: 'largeStraight', label: 'Large straight', section: 'lower' },
  { id: 'fullHouse', label: 'Full house', section: 'lower' },
  { id: 'chance', label: 'Chance', section: 'lower' },
  { id: 'yatzy', label: 'Five of a kind', section: 'lower' },
]);

function countDice(dice) {
  if (!Array.isArray(dice) || dice.length !== 5 || dice.some((die) => !Number.isInteger(die) || die < 1 || die > 6)) throw new RangeError('Enter exactly five dice, each from 1 to 6.');
  return Array.from({ length: 7 }, (_, face) => face ? dice.filter((die) => die === face).length : 0);
}

export function scoreYatzyCategory(dice, category) {
  const counts = countDice(dice);
  const total = dice.reduce((sum, die) => sum + die, 0);
  const groups = counts.slice(1).filter(Boolean).sort((a, b) => b - a);
  if (/^ones[1-6]$/u.test(category)) return counts[Number(category.at(-1))] * Number(category.at(-1));
  if (category === 'onePair') { const face = counts.lastIndexOf(Math.max(...counts.slice(1))); return counts[face] >= 2 ? face * 2 : 0; }
  if (category === 'twoPairs') { const pairs = counts.map((amount, face) => amount >= 2 ? face : 0).filter(Boolean); return pairs.length < 2 ? 0 : pairs.slice(-2).reduce((sum, face) => sum + face * 2, 0); }
  if (category === 'threeKind') { const face = counts.lastIndexOf(3); return face < 1 ? 0 : face * 3; }
  if (category === 'fourKind') { const face = counts.lastIndexOf(4); return face < 1 ? 0 : face * 4; }
  if (category === 'smallStraight') return new Set(dice).size === 5 && [1, 2, 3, 4, 5].every((face) => dice.includes(face)) ? 15 : 0;
  if (category === 'largeStraight') return new Set(dice).size === 5 && [2, 3, 4, 5, 6].every((face) => dice.includes(face)) ? 20 : 0;
  if (category === 'fullHouse') return groups.length === 2 && groups[0] === 3 && groups[1] === 2 ? total : 0;
  if (category === 'chance') return total;
  if (category === 'yatzy') return groups.length === 1 && groups[0] === 5 ? 50 : 0;
  throw new RangeError('Choose a valid Yatzy category.');
}

function seededRandom(state) {
  let next = (state + 0x6D2B79F5) >>> 0;
  let value = next;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return { value: ((value ^ (value >>> 14)) >>> 0) / 4294967296, state: next };
}

function initialYatzySeed() {
  if (globalThis.crypto?.getRandomValues) return crypto.getRandomValues(new Uint32Array(1))[0] || 0xA341316C;
  return (Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0;
}

export function createYatzyGame({ players = 1, cpuPlayers = 0, names = [], seed = initialYatzySeed() } = {}) {
  if (!Number.isInteger(players) || players < 1 || players > 4 || !Number.isInteger(cpuPlayers) || cpuPlayers < 0 || cpuPlayers >= players) throw new RangeError('Use 1–4 players and keep at least one human player.');
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF) throw new RangeError('Seed must be a 32-bit unsigned integer.');
  const roster = Array.from({ length: players }, (_, index) => ({ id: index, name: String(names[index] || (index < players - cpuPlayers ? `Player ${index + 1}` : `CPU ${index - players + cpuPlayers + 1}`)).slice(0, 24), cpu: index >= players - cpuPlayers, scores: Object.fromEntries(yatzyCategories.map(({ id }) => [id, null])) }));
  return { players: roster, currentPlayer: 0, dice: Array(5).fill(null), held: Array(5).fill(false), rollsLeft: 3, rngState: seed >>> 0, finished: false };
}

export function rollYatzyDice(game) {
  if (game.finished || game.rollsLeft < 1) throw new Error('No rolls remain in this turn.');
  let rngState = game.rngState;
  const dice = game.dice.map((die, index) => {
    if (die !== null && game.held[index]) return die;
    const sample = seededRandom(rngState); rngState = sample.state;
    return 1 + Math.floor(sample.value * 6);
  });
  return { ...game, dice, rollsLeft: game.rollsLeft - 1, rngState };
}

export function holdYatzyDice(game, held) {
  if (game.finished || game.rollsLeft >= 3 || !Array.isArray(held) || held.length !== 5 || held.some((value) => typeof value !== 'boolean')) throw new Error('Roll first, then choose which five dice to hold.');
  return { ...game, held: [...held] };
}

export function scoreYatzyTurn(game, category) {
  if (game.finished || game.dice.some((die) => die === null)) throw new Error('Roll the dice before choosing a category.');
  const player = game.players[game.currentPlayer];
  if (!Object.hasOwn(player.scores, category) || player.scores[category] !== null) throw new Error('That category is already used or is not valid.');
  const points = scoreYatzyCategory(game.dice, category);
  const players = game.players.map((entry, index) => index === game.currentPlayer ? { ...entry, scores: { ...entry.scores, [category]: points } } : entry);
  const nextPlayer = (game.currentPlayer + 1) % players.length;
  const finished = players.every((entry) => Object.values(entry.scores).every((score) => score !== null));
  return { ...game, players, currentPlayer: nextPlayer, dice: Array(5).fill(null), held: Array(5).fill(false), rollsLeft: 3, finished };
}

export function yatzyTotals(scores) {
  const upper = [1, 2, 3, 4, 5, 6].reduce((sum, face) => sum + (scores[`ones${face}`] ?? 0), 0);
  const lower = yatzyCategories.filter(({ section }) => section === 'lower').reduce((sum, { id }) => sum + (scores[id] ?? 0), 0);
  const bonus = upper >= 63 ? 50 : 0;
  return { upper, bonus, lower, total: upper + bonus + lower };
}

export function playYatzyCpuTurn(game) {
  let next = game;
  if (next.finished || !next.players[next.currentPlayer]?.cpu) throw new Error('It is not the CPU turn.');
  while (next.rollsLeft > 0) {
    next = rollYatzyDice(next);
    if (next.rollsLeft > 0) {
      const counts = countDice(next.dice);
      const face = counts.lastIndexOf(Math.max(...counts.slice(1)));
      const held = next.dice.map((die) => die === face && counts[face] >= 2);
      next = holdYatzyDice(next, held);
    }
  }
  const available = yatzyCategories.filter(({ id }) => next.players[next.currentPlayer].scores[id] === null);
  const best = available.map(({ id }, order) => ({ id, points: scoreYatzyCategory(next.dice, id), order })).sort((a, b) => b.points - a.points || a.order - b.order)[0];
  return scoreYatzyTurn(next, best.id);
}
