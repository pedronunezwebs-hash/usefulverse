const number = (value, label) => {
  const parsed = Number(String(value).trim());
  if (!String(value).trim() || !Number.isFinite(parsed)) throw new TypeError(`Enter a valid ${label}.`);
  return parsed;
};
const positive = (value, label, allowZero = false) => {
  const parsed = number(value, label);
  if (allowZero ? parsed < 0 : parsed <= 0) throw new RangeError(`${label} must be ${allowZero ? 'zero or greater' : 'greater than zero'}.`);
  return parsed;
};
const fixed = (value, digits = 6) => Number(value.toFixed(digits)).toString();
const money = (value) => Number(value).toFixed(2);

export function makeNoiseSamples(color, length, random = Math.random) {
  if (!['white', 'pink', 'brown'].includes(color)) throw new TypeError('Choose white, pink, or brown noise.');
  if (!Number.isInteger(length) || length < 1 || length > 192_000) throw new RangeError('Noise buffer must contain 1–192000 samples.');
  if (typeof random !== 'function') throw new TypeError('A random source is required.');
  const samples = new Float32Array(length);
  let b0 = 0; let b1 = 0; let b2 = 0; let b3 = 0; let b4 = 0; let b5 = 0; let b6 = 0; let brown = 0;
  for (let index = 0; index < length; index += 1) {
    const unit = random();
    if (!Number.isFinite(unit) || unit < 0 || unit >= 1) throw new RangeError('Random values must be between 0 and 1.');
    const white = unit * 2 - 1;
    let sample = white;
    if (color === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      sample = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.25;
      b6 = white * 0.115926;
    } else if (color === 'brown') {
      brown = (brown + 0.02 * white) / 1.02;
      sample = brown * 6;
    }
    samples[index] = Math.max(-1, Math.min(1, sample));
  }
  return samples;
}

export function calculateTeleprompterScrollRate(maxScroll, wordCount, wordsPerMinute) {
  const distance = Number(maxScroll); const words = Number(wordCount); const speed = Number(wordsPerMinute);
  if (!Number.isFinite(distance) || distance < 0) throw new RangeError('Scroll distance must be zero or greater.');
  if (!Number.isInteger(words) || words < 1) throw new RangeError('Word count must be a positive integer.');
  if (!Number.isFinite(speed) || speed < 30 || speed > 240) throw new RangeError('Reading speed must be between 30 and 240 words per minute.');
  return distance * speed / (words * 60_000);
}

export function countTeleprompterWords(text) {
  return (String(text).match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]|[\p{L}\p{N}]+/gu) ?? []).length;
}

export function solveEquation({ a, b, c }) {
  const A = number(a, 'coefficient a'); const B = number(b, 'coefficient b'); const C = number(c, 'coefficient c');
  if (A === 0 && B === 0) return C === 0 ? 'Every real number is a solution.' : 'There is no solution.';
  if (A === 0) return `x = ${fixed(-C / B)}\nCheck: ${fixed(B * (-C / B) + C)} = 0`;
  const discriminant = B * B - 4 * A * C;
  if (discriminant < 0) return 'No real roots. Complex roots are outside this calculator’s scope.';
  const root = Math.sqrt(discriminant);
  const roots = [...new Set([(-B + root) / (2 * A), (-B - root) / (2 * A)].map((value) => fixed(value)))];
  return `${roots.length === 1 ? 'Repeated root' : 'Roots'}: ${roots.map((value) => `x = ${value}`).join(', ')}\nSubstitution check: ${roots.map((value) => `f(${value}) ≈ ${fixed(A * Number(value) ** 2 + B * Number(value) + C)}`).join('; ')}`;
}

function parseCoefficientRow(text, index) {
  const row = String(text).split(/[\s,;]+/u).filter(Boolean).map((value) => number(value, `equation ${index} coefficient`));
  if (row.length !== 3 && row.length !== 4) throw new TypeError(`Equation ${index} needs x, y, optional z, and a result, separated by commas.`);
  return row;
}

export function solveLinearSystem({ r1, r2, r3 = '' }) {
  const raw = [r1, r2, ...(String(r3).trim() ? [r3] : [])].map(parseCoefficientRow);
  const columns = raw[0].length - 1;
  if ((raw.length !== 2 && raw.length !== 3) || raw.some((row) => row.length !== columns + 1)) throw new TypeError('Use two equations with x,y,result, or three equations with x,y,z,result. Keep every row the same width.');
  const matrix = raw.map((row) => row.map(Number));
  let pivotRow = 0;
  for (let col = 0; col < columns && pivotRow < matrix.length; col += 1) {
    let best = pivotRow;
    for (let row = pivotRow + 1; row < matrix.length; row += 1) if (Math.abs(matrix[row][col]) > Math.abs(matrix[best][col])) best = row;
    if (Math.abs(matrix[best][col]) < 1e-12) continue;
    [matrix[best], matrix[pivotRow]] = [matrix[pivotRow], matrix[best]];
    const scale = matrix[pivotRow][col];
    for (let item = col; item <= columns; item += 1) matrix[pivotRow][item] /= scale;
    for (let row = 0; row < matrix.length; row += 1) if (row !== pivotRow) {
      const factor = matrix[row][col];
      for (let item = col; item <= columns; item += 1) matrix[row][item] -= factor * matrix[pivotRow][item];
    }
    pivotRow += 1;
  }
  const inconsistent = matrix.some((row) => row.slice(0, columns).every((value) => Math.abs(value) < 1e-10) && Math.abs(row[columns]) > 1e-10);
  if (inconsistent) return 'No solution: the equations are inconsistent.';
  if (pivotRow < columns) return 'Infinitely many solutions: at least one variable is free.';
  const values = Array(columns).fill(0);
  for (let row = 0; row < pivotRow; row += 1) {
    const pivot = matrix[row].findIndex((value, index) => index < columns && Math.abs(value) > 1e-10);
    if (pivot >= 0) values[pivot] = matrix[row][columns];
  }
  return `Unique solution: ${values.map((value, index) => `${'xyz'[index]} = ${fixed(value)}`).join(', ')}`;
}

export function factorQuadratic(values) {
  const a = number(values.a, 'coefficient a'); const b = number(values.b, 'coefficient b'); const c = number(values.c, 'coefficient c');
  if (![a, b, c].every(Number.isInteger) || a === 0 || Math.abs(a) > 1_000_000 || Math.abs(b) > 1_000_000 || Math.abs(c) > 1_000_000) throw new RangeError('Enter integer coefficients from −1,000,000 to 1,000,000, with a not equal to zero.');
  const discriminant = b * b - 4 * a * c;
  const square = Math.sqrt(discriminant);
  if (discriminant < 0 || !Number.isInteger(square)) return 'No integer-root factorization was found. The polynomial was not changed.';
  const candidates = [(-b + square) / (2 * a), (-b - square) / (2 * a)];
  if (!candidates.every(Number.isInteger)) return 'The roots are not both integers, so this version cannot show integer factors.';
  const factor = (root) => `(x ${root < 0 ? '+' : '−'} ${Math.abs(root)})`;
  return `Roots: ${candidates.map((value) => fixed(value)).join(', ')}\nFactorization: ${a === 1 ? '' : `${a} · `}${factor(candidates[0])}${factor(candidates[1])}\nExpanded coefficients: ${a}, ${b}, ${c}`;
}

export function calculateProbability({ pa, pb, pab }) {
  const A = number(pa, 'P(A)'); const B = number(pb, 'P(B)'); const AB = number(pab, 'P(A and B)');
  if ([A, B, AB].some((value) => value < 0 || value > 1) || AB > Math.min(A, B) || AB < A + B - 1) throw new RangeError('Use probabilities from 0 to 1 and an intersection valid for both events.');
  return `P(A or B) = ${fixed(A + B - AB)}\nP(not A) = ${fixed(1 - A)}\nP(A given B) = ${B ? fixed(AB / B) : 'undefined because P(B) is zero'}\nP(B given A) = ${A ? fixed(AB / A) : 'undefined because P(A) is zero'}`;
}

export function calculateZScore({ value, mean, sd }) {
  const x = number(value, 'value'); const m = number(mean, 'mean'); const s = positive(sd, 'standard deviation');
  const z = (x - m) / s;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const density = 0.3989422804014327 * Math.exp(-z * z / 2);
  const tail = density * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + 1.330274429 * t))));
  const percentile = (z >= 0 ? 1 - tail : tail) * 100;
  return `Z-score: ${fixed(z)}\nEstimated normal percentile: ${fixed(percentile, 3)}%`;
}

export function calculateCoordinateGeometry({ x1, y1, x2, y2 }) {
  const values = [x1, y1, x2, y2].map((value, index) => number(value, `coordinate ${index + 1}`));
  const [a, b, c, d] = values; const dx = c - a; const dy = d - b;
  const slope = dx === 0 ? 'undefined (vertical line)' : fixed(dy / dx);
  const intercept = dx === 0 ? '' : `\nLine: y = ${fixed(dy / dx)}x ${-((dy / dx) * a) < 0 ? '−' : '+'} ${fixed(d - (dy / dx) * c)}`;
  return `Slope: ${slope}\nDistance: ${fixed(Math.hypot(dx, dy))}\nMidpoint: (${fixed((a + c) / 2)}, ${fixed((b + d) / 2)})${intercept}`;
}

export function longDivision({ dividend, divisor }) {
  const a = number(dividend, 'dividend'); const b = number(divisor, 'divisor');
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a < 0 || b <= 0) throw new RangeError('Use non-negative whole-number dividend and a positive whole-number divisor within the safe integer range.');
  let remainder = 0; let quotient = ''; const steps = [];
  for (const char of String(a)) {
    const current = remainder * 10 + Number(char);
    const digit = Math.floor(current / b); const product = digit * b; remainder = current - product; quotient += String(digit);
    steps.push(`${current} ÷ ${b} = ${digit}; ${current} − ${product} = ${remainder}`);
  }
  quotient = quotient.replace(/^0+(?=\d)/u, '');
  return `Quotient: ${quotient}\nRemainder: ${remainder}\nSteps:\n${steps.join('\n')}`;
}

function roundedText(text, places, mode) {
  let value = text.trim().replaceAll(',', '');
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/iu.test(value)) throw new TypeError('Enter a decimal number, optionally using scientific notation.');
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) throw new RangeError('Enter a finite number.');
  if (mode === 'significant') {
    if (places < 1) throw new RangeError('Significant figures must be from 1 to 15.');
    return numeric === 0 ? `0 (${places} significant figures)` : numeric.toPrecision(places);
  }
  if (places < 0 || places > 15) throw new RangeError('Decimal places must be from 0 to 15.');
  const [mantissa, exponentText] = value.toLowerCase().split('e');
  const exponent = Number(exponentText ?? 0);
  const sign = mantissa.startsWith('-') ? -1n : 1n;
  const unsigned = mantissa.replace(/^[+-]/u, '');
  const [whole, fraction = ''] = unsigned.split('.');
  let digits = BigInt(`${whole || '0'}${fraction}` || '0');
  const shift = places + exponent - fraction.length;
  if (shift >= 0) digits *= 10n ** BigInt(shift);
  else {
    const divisor = 10n ** BigInt(-shift);
    const quotient = digits / divisor; const rest = digits % divisor; const twice = rest * 2n;
    const increase = twice > divisor || (twice === divisor && (mode === 'half-up' || quotient % 2n !== 0n));
    digits = quotient + (increase ? 1n : 0n);
  }
  const rounded = (digits * sign).toString();
  const absolute = rounded.replace(/^-/, '').padStart(places + 1, '0');
  const result = places ? `${absolute.slice(0, -places)}.${absolute.slice(-places)}` : absolute;
  return (sign < 0n && digits !== 0n ? '-' : '') + result;
}

export function roundNumber({ value, digits, mode, precision = 'decimal' }) {
  const places = number(digits, 'places');
  if (!Number.isInteger(places)) throw new RangeError('Enter a whole number of places.');
  return roundedText(value, places, precision === 'significant' ? 'significant' : mode);
}

export function calculateTax({ amount, rate, mode }) {
  const price = positive(amount, 'price', true); const percent = number(rate, 'tax rate');
  if (percent < 0 || percent > 100) throw new RangeError('Tax rate must be between 0% and 100%.');
  const factor = percent / 100;
  const base = mode === 'included' ? price / (1 + factor) : price;
  const tax = mode === 'included' ? price - base : price * factor;
  return `Net price: ${fixed(base, 2)}\nTax: ${fixed(tax, 2)}\nTotal: ${fixed(base + tax, 2)}\nRate used: ${fixed(percent, 4)}%`;
}

export function calculateCommission({ mode = 'commission', sale, rate, knownCommission, fee }) {
  const gross = positive(sale, 'sale amount'); const fixedFee = number(fee || 0, 'fixed fee');
  if (fixedFee < 0) throw new RangeError('Fixed fee cannot be negative.');
  if (mode === 'rate') {
    const amount = positive(knownCommission, 'known commission', true);
    if (amount < fixedFee) throw new RangeError('Known commission must cover the fixed fee.');
    return `Commission rate: ${fixed((amount - fixedFee) / gross * 100, 4)}%\nKnown commission: ${fixed(amount, 2)}\nFixed fee: ${fixed(fixedFee, 2)}`;
  }
  const percent = number(rate, 'commission rate');
  if (percent < 0 || percent > 100) throw new RangeError('Rate must be from 0% to 100%.');
  return `Commission: ${fixed(gross * percent / 100 + fixedFee, 2)}\nRate commission: ${fixed(gross * percent / 100, 2)}\nFixed fee: ${fixed(fixedFee, 2)}`;
}

export function calculateCreditPayoff({ balance, apr, payment, mode = 'fixed', minimumPercent = 2, minimumFloor = 25 }) {
  let remaining = positive(balance, 'balance', true); const annualRate = number(apr, 'APR'); const monthlyPayment = mode === 'minimum' ? 0 : positive(payment, 'monthly payment');
  const percent = number(minimumPercent || 2, 'minimum percentage'); const floor = number(minimumFloor || 0, 'minimum payment floor');
  if (annualRate < 0 || annualRate > 1000) throw new RangeError('APR must be between 0% and 1,000%.');
  if (percent <= 0 || percent > 100 || floor < 0) throw new RangeError('Minimum percentage must be above 0% and no more than 100%; floor cannot be negative.');
  if (remaining === 0) return 'The balance is already paid.';
  const rate = annualRate / 1200; let totalInterest = 0; let month = 0;
  while (remaining > 0.005 && month < 1200) {
    const interest = remaining * rate;
    const due = mode === 'minimum' ? Math.max(floor, (remaining + interest) * percent / 100) : monthlyPayment;
    if (due <= interest) throw new RangeError('This payment does not cover the monthly interest, so the balance will not be paid off.');
    const paid = Math.min(remaining + interest, due);
    remaining = Math.max(0, remaining + interest - paid); totalInterest += interest; month += 1;
  }
  if (month >= 1200) throw new RangeError('The payoff exceeds 100 years; check the payment and rate.');
  return `Estimated payoff time: ${Math.floor(month / 12)} years, ${month % 12} months\nPayments: ${month}\nEstimated total interest: ${fixed(totalInterest, 2)}\nTotal paid: ${fixed(Number(balance) + totalInterest, 2)}`;
}

export function compareUnitPrices({ price1, quantity1, price2, quantity2, unit }) {
  const p1 = positive(price1, 'package A price', true); const q1 = positive(quantity1, 'package A quantity');
  const p2 = positive(price2, 'package B price', true); const q2 = positive(quantity2, 'package B quantity'); const label = String(unit).trim();
  if (!label || label.length > 20) throw new TypeError('Enter a short shared unit, such as oz, kg or item.');
  const a = p1 / q1; const b = p2 / q2;
  return `Package A: ${fixed(a, 4)} per ${label}\nPackage B: ${fixed(b, 4)} per ${label}\n${a === b ? 'Both have the same unit price.' : `${a < b ? 'Package A' : 'Package B'} has the lower unit price (${fixed(Math.abs(a - b) / Math.max(a, b) * 100, 2)}% lower).`}`;
}

export function calculateConcrete({ length, width, depth, unit = 'ft', waste, bagYield }) {
  const l = positive(length, 'length'); const w = positive(width, 'width'); const d = positive(depth, 'depth'); const margin = number(waste, 'waste allowance');
  if (margin < 0 || margin > 100) throw new RangeError('Waste allowance must be from 0% to 100%.');
  if (!['ft', 'm'].includes(unit)) throw new RangeError('Choose feet or meters.');
  const base = l * w * d; const total = base * (1 + margin / 100); const yieldPerBag = bagYield === '' || bagYield === null || bagYield === undefined ? 0 : Number(bagYield);
  if (!Number.isFinite(yieldPerBag) || yieldPerBag < 0) throw new RangeError('Bag yield must be zero or a positive volume.');
  const label = unit === 'm' ? 'm³' : 'ft³'; const conversion = unit === 'm' ? 1 : 0.028316846592;
  return `Slab volume: ${fixed(base, 3)} ${label} (${fixed(base * conversion, 3)} m³)\nWith ${fixed(margin, 2)}% allowance: ${fixed(total, 3)} ${label} (${fixed(total * conversion, 3)} m³)${yieldPerBag ? `\nEstimated bags at entered yield: ${Math.ceil(total / yieldPerBag - 1e-10)} (yield ${fixed(yieldPerBag, 3)} ${label} per bag)` : ''}`;
}

export function calculateTiles({ roomLength, roomWidth, tileLength, tileWidth, unit = 'in', waste }) {
  const a = positive(roomLength, 'room length'); const b = positive(roomWidth, 'room width'); const c = positive(tileLength, 'tile length'); const d = positive(tileWidth, 'tile width'); const margin = number(waste, 'waste allowance');
  if (margin < 0 || margin > 100) throw new RangeError('Waste allowance must be from 0% to 100%.');
  if (!['in', 'cm'].includes(unit)) throw new RangeError('Choose inches or centimeters.');
  const room = a * b; const tile = c * d; const count = Math.ceil((room / tile) * (1 + margin / 100) - 1e-10);
  const factor = unit === 'cm' ? 0.01 : 0.0254; const areaM2 = room * factor ** 2; const tileM2 = tile * factor ** 2;
  return `Room area: ${fixed(areaM2 * 10.7639104167, 3)} ft² (${fixed(areaM2, 3)} m²)\nTiles before allowance: ${Math.ceil(room / tile)}\nTiles with ${fixed(margin, 2)}% allowance: ${count}\nArea per tile: ${fixed(tileM2, 4)} m²`;
}

function parseItems(text) {
  const lines = String(text).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || lines.length > 100) throw new RangeError('Enter 1 to 100 item lines.');
  return lines.map((line, index) => {
    const match = /^(.*?)[,;\t]\s*([0-9]+(?:\.[0-9]+)?)\s*[,;\t]\s*([0-9]+(?:\.[0-9]+)?)$/u.exec(line);
    if (!match || !match[1].trim()) throw new TypeError(`Item line ${index + 1}: use description, quantity, unit price.`);
    const quantity = positive(match[2], `item ${index + 1} quantity`); const unitPrice = positive(match[3], `item ${index + 1} price`, true);
    return { description: match[1].trim().slice(0, 120), quantity, unitPrice, total: quantity * unitPrice };
  });
}

export function createDocument({ seller, customer, items, tax, currency, validUntil }, kind = 'receipt') {
  const provider = String(seller).trim(); const customerName = String(customer ?? '').trim(); const code = String(currency || 'USD').trim().toUpperCase();
  if (!provider || provider.length > 120 || !/^[A-Z0-9]{3,5}$/u.test(code)) throw new TypeError('Enter a provider name and a 3–5 character currency code.');
  const rows = parseItems(items); const subtotal = rows.reduce((sum, item) => sum + item.total, 0); const rate = number(tax || 0, 'tax rate');
  if (rate < 0 || rate > 100) throw new RangeError('Tax rate must be from 0% to 100%.');
  const taxAmount = subtotal * rate / 100; const total = subtotal + taxAmount;
  const title = kind === 'receipt' ? 'PAYMENT RECEIPT' : 'QUOTATION / ESTIMATE';
  return `${title}\n${provider}${customerName ? `\nCustomer: ${customerName}` : ''}${validUntil ? `\nValid until: ${validUntil}` : ''}\n\nDESCRIPTION | QTY | UNIT PRICE | TOTAL\n${rows.map((item) => `${item.description} | ${item.quantity} | ${code} ${money(item.unitPrice)} | ${code} ${money(item.total)}`).join('\n')}\n\nSubtotal: ${code} ${money(subtotal)}\nTax (${fixed(rate, 2)}%): ${code} ${money(taxAmount)}\nTotal: ${code} ${money(total)}${kind === 'receipt' ? '\n\nThis document does not confirm that a payment cleared.' : '\n\nEstimate only; confirm scope, terms and taxes before acceptance.'}`;
}

const morse = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.' };
export function translateMorse({ mode, text }) {
  const reverse = Object.fromEntries(Object.entries(morse).map(([letter, code]) => [code, letter]));
  if (mode === 'text-morse') return [...String(text).toUpperCase()].map((char) => {
    if (char === ' ') return '/';
    if (!morse[char]) throw new TypeError(`The character “${char}” is not supported by this International Morse table.`);
    return morse[char];
  }).join(' ');
  const tokens = String(text).trim().split(/\s+/u);
  if (tokens.some((token) => token !== '/' && !reverse[token])) throw new TypeError('Use valid Morse groups separated by spaces and / for word breaks.');
  return tokens.map((token) => token === '/' ? ' ' : reverse[token]).join('').replaceAll('  ', ' ');
}

export function calculateCombinatorics({ n, r, mode = 'combination' }) {
  const total = number(n, 'n'); const selected = number(r, 'r');
  if (!Number.isInteger(total) || !Number.isInteger(selected) || total < 0 || total > 170 || selected < 0 || selected > total) throw new RangeError('Use whole numbers with 0 ≤ r ≤ n ≤ 170.');
  let value = 1;
  if (mode === 'permutation') {
    for (let i = 0; i < selected; i += 1) value *= total - i;
  } else {
    const terms = Math.min(selected, total - selected);
    for (let i = 1; i <= terms; i += 1) value = value * (total - terms + i) / i;
  }
  return `${mode === 'permutation' ? 'Permutations' : 'Combinations'}: ${fixed(value, 0)}\nOrder ${mode === 'permutation' ? 'matters' : 'does not matter'}.`;
}

function normalCdf(z) {
  const sign = z < 0 ? -1 : 1; const x = Math.abs(z) / Math.sqrt(2); const t = 1 / (1 + 0.3275911 * x);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * erf);
}

export function calculateDistribution({ kind = 'normal', value, mean = 0, sd = 1, n, p, lambda, k }) {
  if (kind === 'normal') {
    const x = number(value, 'value'); const m = number(mean, 'mean'); const sigma = positive(sd, 'standard deviation'); const z = (x - m) / sigma;
    return `P(X ≤ ${fixed(x)}) ≈ ${fixed(normalCdf(z), 6)}\nP(X > ${fixed(x)}) ≈ ${fixed(1 - normalCdf(z), 6)}\nz-score: ${fixed(z, 6)}`;
  }
  const count = number(k, 'event count');
  if (!Number.isInteger(count) || count < 0) throw new RangeError('Event count must be a non-negative whole number.');
  let mass;
  if (kind === 'binomial') {
    const trials = number(n, 'number of trials'); const probability = number(p, 'probability');
    if (!Number.isInteger(trials) || trials < 0 || trials > 10000 || count > trials || probability < 0 || probability > 1) throw new RangeError('Use a whole event count, valid probability, and no more than 10,000 trials.');
    let choose = 1; for (let i = 1; i <= count; i += 1) choose *= (trials - count + i) / i;
    mass = choose * probability ** count * (1 - probability) ** (trials - count);
    return `P(X = ${count}) = ${fixed(mass, 8)}\nP(X ≤ ${count}) = ${fixed(Array.from({ length: count + 1 }, (_, i) => { let c = 1; for (let j = 1; j <= i; j += 1) c *= (trials - i + j) / j; return c * probability ** i * (1 - probability) ** (trials - i); }).reduce((a, b) => a + b, 0), 8)}`;
  }
  if (kind === 'poisson') {
    const rate = number(lambda, 'lambda'); if (rate < 0 || rate > 700) throw new RangeError('Lambda must be from 0 to 700.');
    mass = Math.exp(-rate); for (let i = 1; i <= count; i += 1) mass *= rate / i;
    let cumulative = Math.exp(-rate); let term = cumulative;
    for (let i = 1; i <= count; i += 1) { term *= rate / i; cumulative += term; }
    return `P(X = ${count}) = ${fixed(mass, 8)}\nP(X ≤ ${count}) = ${fixed(cumulative, 8)}`;
  }
  throw new TypeError('Choose normal, binomial or Poisson distribution.');
}

export function calculateMeanConfidenceInterval({ mean, sd, n, confidence = 95 }) {
  const average = number(mean, 'sample mean'); const deviation = positive(sd, 'known population standard deviation'); const size = number(n, 'sample size');
  if (!Number.isInteger(size) || size < 2 || size > 1_000_000) throw new RangeError('Sample size must be a whole number from 2 to 1,000,000.');
  const z = ({ 90: 1.64485362695147, 95: 1.95996398454005, 99: 2.5758293035489 })[Number(confidence)];
  if (!z) throw new RangeError('Choose 90%, 95% or 99% confidence.');
  const margin = z * deviation / Math.sqrt(size);
  return `${confidence}% z-interval: ${fixed(average - margin, 6)} to ${fixed(average + margin, 6)}\nMargin of error: ${fixed(margin, 6)}\nMethod: known population standard deviation; normal z critical value.`;
}

export function calculateSampleSize({ confidence = 95, margin, proportion = 0.5, population = '' }) {
  const error = number(margin, 'margin of error') / 100; const p = number(proportion, 'expected proportion');
  const z = ({ 90: 1.64485362695147, 95: 1.95996398454005, 99: 2.5758293035489 })[Number(confidence)];
  if (!z || error <= 0 || error >= 1 || p <= 0 || p >= 1) throw new RangeError('Choose 90%, 95% or 99% confidence, an error from 0–100%, and a proportion from 0–1.');
  const base = z ** 2 * p * (1 - p) / error ** 2; const finite = String(population).trim() ? number(population, 'population') : 0;
  if (finite < 0 || (finite > 0 && (!Number.isInteger(finite) || finite < 2))) throw new RangeError('Population must be blank or a whole number of at least 2.');
  const size = finite ? base / (1 + (base - 1) / finite) : base;
  return `Required sample size: ${Math.ceil(size)}\nUnrounded estimate: ${fixed(size, 4)}\nAssumes random sampling and the entered proportion; finite-population correction ${finite ? 'applied' : 'not applied'}.`;
}

export function calculateLinearRegression({ pairs }) {
  const rows = String(pairs).trim().split(/[\n;]+/u).map((row) => row.split(/[\s,]+/u).filter(Boolean).map(Number));
  if (rows.length < 2 || rows.length > 10000 || rows.some((row) => row.length !== 2 || row.some((v) => !Number.isFinite(v)))) throw new TypeError('Enter 2–10,000 valid x,y pairs, one pair per line.');
  const n = rows.length; const mx = rows.reduce((sum, row) => sum + row[0], 0) / n; const my = rows.reduce((sum, row) => sum + row[1], 0) / n;
  const sxx = rows.reduce((sum, [x]) => sum + (x - mx) ** 2, 0); const syy = rows.reduce((sum, [, y]) => sum + (y - my) ** 2, 0);
  const sxy = rows.reduce((sum, [x, y]) => sum + (x - mx) * (y - my), 0);
  if (sxx === 0) throw new RangeError('The x values must not all be identical.');
  const slope = sxy / sxx; const intercept = my - slope * mx; const r = syy ? sxy / Math.sqrt(sxx * syy) : 0;
  return `Least-squares line: y = ${fixed(slope, 6)}x ${intercept < 0 ? '−' : '+'} ${fixed(Math.abs(intercept), 6)}\nPearson r: ${fixed(r, 6)}\nR²: ${fixed(r ** 2, 6)}\nPairs: ${n}`;
}

export function solveTriangleSSS({ a, b, c }) {
  const A = positive(a, 'side a'); const B = positive(b, 'side b'); const C = positive(c, 'side c');
  if (A + B <= C || A + C <= B || B + C <= A) throw new RangeError('The entered side lengths do not form a triangle.');
  const angle = (opposite, x, y) => Math.acos(Math.max(-1, Math.min(1, (x * x + y * y - opposite * opposite) / (2 * x * y)))) * 180 / Math.PI;
  const area = Math.sqrt((A + B + C) / 2 * ((A + B + C) / 2 - A) * ((A + B + C) / 2 - B) * ((A + B + C) / 2 - C));
  return `Angle A: ${fixed(angle(A, B, C), 4)}°\nAngle B: ${fixed(angle(B, A, C), 4)}°\nAngle C: ${fixed(angle(C, A, B), 4)}°\nArea: ${fixed(area, 6)} square units\nPerimeter: ${fixed(A + B + C, 6)}`;
}

export function calculateSolidVolume({ shape = 'sphere', a, b = '', h = '' }) {
  const x = positive(a, 'radius or length'); let volume; let surface; let name;
  if (shape === 'sphere') { volume = 4 / 3 * Math.PI * x ** 3; surface = 4 * Math.PI * x ** 2; name = 'Sphere'; }
  else {
    const radius = positive(b, 'radius or width'); const height = positive(h, 'height');
    if (shape === 'cylinder') { volume = Math.PI * radius ** 2 * height; surface = 2 * Math.PI * radius * (radius + height); name = 'Cylinder'; }
    else if (shape === 'cone') { volume = Math.PI * radius ** 2 * height / 3; surface = Math.PI * radius * (radius + Math.hypot(radius, height)); name = 'Cone'; }
    else if (shape === 'box') { volume = x * radius * height; surface = 2 * (x * radius + x * height + radius * height); name = 'Rectangular prism'; }
    else throw new TypeError('Choose sphere, cylinder, cone or box.');
  }
  return `${name} volume: ${fixed(volume, 6)} cubic units\nSurface area: ${fixed(surface, 6)} square units`;
}

export function calculateSequence({ first, step, count, mode = 'arithmetic' }) {
  const a = number(first, 'first term'); const n = number(count, 'term count'); const value = number(step, mode === 'geometric' ? 'common ratio' : 'common difference');
  if (!Number.isInteger(n) || n < 1 || n > 100000) throw new RangeError('Term count must be a whole number from 1 to 100,000.');
  const nth = mode === 'geometric' ? a * value ** (n - 1) : a + (n - 1) * value;
  const sum = mode === 'geometric' ? value === 1 ? a * n : a * (1 - value ** n) / (1 - value) : n * (2 * a + (n - 1) * value) / 2;
  if (!Number.isFinite(nth) || !Number.isFinite(sum)) throw new RangeError('The requested sequence exceeds the finite numeric range.');
  return `Term ${n}: ${fixed(nth, 8)}\nSum of first ${n} terms: ${fixed(sum, 8)}\nRule: ${mode === 'geometric' ? 'aₙ = a₁ × r⁽ⁿ⁻¹⁾' : 'aₙ = a₁ + (n − 1)d'}`;
}

export function calculateBreakEven({ fixed, price, variable }) {
  const cost = positive(fixed, 'fixed costs', true); const selling = positive(price, 'selling price'); const unitCost = positive(variable, 'variable cost', true);
  const contribution = selling - unitCost;
  if (contribution <= 0) throw new RangeError('Selling price must be greater than variable cost per unit.');
  const units = Math.ceil(cost / contribution);
  return `Contribution per unit: ${money(contribution)}\nBreak-even units: ${units}\nBreak-even sales at whole units: ${money(units * selling)}\nFormula: fixed costs ÷ (selling price − variable cost).`;
}

export function calculateRoiCagr({ initial, final, years }) {
  const start = positive(initial, 'starting value'); const end = positive(final, 'ending value', true); const duration = positive(years, 'years held');
  const roi = (end - start) / start * 100;
  const cagr = end > 0 ? ((end / start) ** (1 / duration) - 1) * 100 : null;
  return `Total ROI: ${fixed(roi, 4)}%\nAnnualized CAGR: ${cagr === null ? 'not defined when ending value is zero' : `${fixed(cagr, 4)}%`}\nChange in value: ${money(end - start)}\nExcludes cash flows, fees and taxes.`;
}

export function calculateDepreciation({ cost, salvage = 0, life, mode = 'straight' }) {
  const basis = positive(cost, 'asset cost'); const residual = positive(salvage || 0, 'salvage value', true); const years = number(life, 'useful life');
  if (residual >= basis || !Number.isInteger(years) || years < 1 || years > 100) throw new RangeError('Salvage value must be lower than cost; useful life must be 1–100 whole years.');
  let book = basis; let accumulated = 0; const rows = [];
  for (let year = 1; year <= years; year += 1) {
    const expense = mode === 'declining' ? Math.min(book - residual, book * 2 / years) : (basis - residual) / years;
    book = Math.max(residual, book - expense); accumulated += expense;
    rows.push(`Year ${year}: expense ${money(expense)} · ending book value ${money(book)}`);
  }
  return `${mode === 'declining' ? 'Double-declining balance' : 'Straight-line'} schedule\n${rows.join('\n')}\nTotal depreciation: ${money(accumulated)}`;
}

export function calculateDimensionalWeight({ length, width, height, divisor, actual, unit = 'cm' }) {
  const l = positive(length, 'length'); const w = positive(width, 'width'); const h = positive(height, 'height'); const d = positive(divisor, 'carrier divisor'); const actualWeight = positive(actual, 'actual weight', true);
  if (!['cm', 'in'].includes(unit)) throw new RangeError('Choose centimeters or inches.');
  const volume = l * w * h; const dimensional = volume / d;
  return `Package volume: ${fixed(volume, 3)} ${unit}³\nDimensional weight: ${fixed(dimensional, 3)} ${unit === 'cm' ? 'kg' : 'lb'} (using divisor ${fixed(d, 3)})\nEstimated billable weight: ${fixed(Math.max(dimensional, actualWeight), 3)} ${unit === 'cm' ? 'kg' : 'lb'}\nCarrier rounding rules may change the billed amount.`;
}

export function calculatePaint({ length, height, openings = 0, coats, coverage, unit = 'm' }) {
  const wallLength = positive(length, 'total wall length'); const wallHeight = positive(height, 'wall height'); const excluded = positive(openings || 0, 'opening area', true); const layers = number(coats, 'number of coats'); const yieldRate = positive(coverage, 'paint coverage');
  if (!Number.isInteger(layers) || layers < 1 || layers > 10 || !['m', 'ft'].includes(unit)) throw new RangeError('Use 1–10 whole coats and choose meters or feet.');
  const area = wallLength * wallHeight - excluded;
  if (area <= 0) throw new RangeError('Opening area must be smaller than total wall area.');
  const needed = area * layers / yieldRate;
  return `Paintable area: ${fixed(area, 3)} ${unit}²\nArea for ${layers} coats: ${fixed(area * layers, 3)} ${unit}²\nEstimated paint: ${fixed(needed, 3)} ${unit === 'm' ? 'liters' : 'gallons'}\nBased on the coverage rate you entered; surface texture can change usage.`;
}

export function calculateBoardFeet({ thickness, width, length, quantity = 1, price = 0 }) {
  const t = positive(thickness, 'thickness'); const w = positive(width, 'width'); const l = positive(length, 'length'); const count = number(quantity, 'board count'); const rate = number(price || 0, 'price per board foot');
  if (!Number.isInteger(count) || count < 1 || count > 100000 || rate < 0) throw new RangeError('Board count must be 1–100,000 and price cannot be negative.');
  const each = t * w * l / 12; const total = each * count;
  return `Board feet per board: ${fixed(each, 4)}\nTotal board feet: ${fixed(total, 4)}${rate ? `\nEstimated cost: ${money(total * rate)}` : ''}\nFormula: thickness (in) × width (in) × length (ft) ÷ 12 × quantity.`;
}

export function scaleRecipe({ from, to, items }) {
  const original = positive(from, 'original servings'); const desired = positive(to, 'desired servings');
  if (original > 10000 || desired > 10000) throw new RangeError('Serving counts must not exceed 10,000.');
  const lines = String(items).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || lines.length > 100) throw new RangeError('Enter 1–100 ingredient lines, each starting with a numeric amount.');
  const factor = desired / original;
  const scaled = lines.map((line, index) => {
    const match = /^\s*(\d+(?:\.\d+)?|\.\d+)(.*)$/u.exec(line);
    if (!match) throw new TypeError(`Ingredient line ${index + 1} must start with a numeric amount.`);
    return `${fixed(Number(match[1]) * factor, 6)}${match[2]}`;
  });
  return `Scale factor: ${fixed(factor, 6)}\n${scaled.join('\n')}\nCooking time and seasoning may not scale proportionally.`;
}

const ibanLengths = { AD:24, AE:23, AL:28, AT:20, AZ:28, BA:20, BE:16, BG:22, BH:22, BI:16, BR:29, BY:28, CH:21, CR:22, CY:28, CZ:24, DE:22, DJ:27, DK:18, DO:28, EE:20, EG:29, ES:24, FI:18, FK:18, FO:18, FR:27, GB:22, GE:22, GI:23, GL:18, GR:27, GT:28, HN:28, HR:21, HU:28, IE:22, IL:23, IQ:23, IS:26, IT:27, JO:30, KW:30, KZ:20, LB:28, LC:32, LI:21, LT:20, LU:20, LV:21, LY:25, MC:27, MD:24, ME:22, MK:19, MR:27, MT:31, MU:30, NI:32, NL:18, NO:15, OM:23, PK:24, PL:28, PS:29, PT:25, QA:29, RO:24, RS:22, RU:33, SA:24, SC:31, SD:18, SE:24, SI:19, SK:24, SM:27, SO:23, ST:25, SV:28, TL:23, TN:24, TR:26, UA:29, VA:22, VG:24, XK:20 };
export function validateIban({ iban }) {
  const compact = String(iban).replace(/[\s-]/gu, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/u.test(compact)) throw new TypeError('Enter an IBAN using two letters, two check digits and the account characters.');
  const expected = ibanLengths[compact.slice(0, 2)];
  if (!expected) return `Country code: ${compact.slice(0, 2)}\nStructure: basic character format detected\nChecksum: ${mod97(compact) ? 'valid' : 'invalid'}\nThe local length table does not include this country code; confirm with an official source.`;
  if (compact.length !== expected) return `Invalid IBAN length: ${compact.length} characters; ${compact.slice(0, 2)} IBANs should have ${expected}.`;
  return `IBAN length: valid (${expected} characters)\nMOD-97 checksum: ${mod97(compact) ? 'valid' : 'invalid'}\nThis does not confirm that an account exists or belongs to anyone.`;
}
function mod97(iban) {
  const rearranged = iban.slice(4) + iban.slice(0, 4); let remainder = 0;
  for (const char of rearranged) {
    const digits = char >= 'A' ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

const safeHttpUrl = (value, label) => {
  let url;
  try { url = new URL(String(value).trim()); } catch { throw new TypeError(`${label} must be a complete URL.`); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new TypeError(`${label} must use http or https and cannot include credentials.`);
  return url;
};
const xmlEscape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const htmlEscape = (value) => xmlEscape(value).replaceAll('&#39;', '&#039;');

export function buildUtmUrl({ url: destination, source, medium, campaign, term = '', content = '' }) {
  const url = safeHttpUrl(destination, 'Destination');
  const values = { utm_source: source, utm_medium: medium, utm_campaign: campaign, utm_term: term, utm_content: content };
  for (const [key, value] of Object.entries(values)) if (String(value ?? '').trim()) url.searchParams.set(key, String(value).trim());
  if (!String(source).trim() || !String(medium).trim() || !String(campaign).trim()) throw new TypeError('Campaign source, medium and name are required.');
  return url.toString();
}

export function buildRobotsTxt({ agent = '*', allow = '', disallow = '', sitemap = '' }) {
  const crawler = String(agent).trim();
  if (!crawler || /[\r\n]/u.test(crawler) || crawler.length > 100) throw new TypeError('Enter one user-agent name without line breaks.');
  const paths = (raw, label) => String(raw ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).map((path) => {
    if (!path.startsWith('/') || /[\s\r\n]/u.test(path) || path.length > 500) throw new TypeError(`${label} paths must start with / and contain no spaces.`);
    return path;
  });
  const allowPaths = paths(allow, 'Allow'); const blockedPaths = paths(disallow, 'Disallow');
  const lines = [`User-agent: ${crawler}`, ...allowPaths.map((path) => `Allow: ${path}`), ...blockedPaths.map((path) => `Disallow: ${path}`)];
  if (String(sitemap).trim()) lines.push('', `Sitemap: ${safeHttpUrl(sitemap, 'Sitemap').toString()}`);
  return lines.join('\n') + '\n';
}

export function buildSitemapXml({ urls }) {
  const lines = String(urls).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || lines.length > 5000) throw new RangeError('Enter 1–5,000 page URLs, one per line.');
  const unique = [...new Set(lines.map((line) => safeHttpUrl(line, 'Page').toString()))];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`).join('\n')}\n</urlset>`;
}

export function buildJsonLd({ kind = 'Organization', name, url, description = '', logo = '', date = '' }) {
  const title = String(name).trim(); if (!title || title.length > 200) throw new TypeError('Enter a name or headline up to 200 characters.');
  const page = safeHttpUrl(url, 'Canonical page'); const schema = { '@context': 'https://schema.org' };
  if (kind === 'Organization') {
    schema['@type'] = 'Organization'; schema.name = title; schema.url = page.toString();
    if (String(logo).trim()) schema.logo = safeHttpUrl(logo, 'Logo').toString();
  } else if (kind === 'WebSite') {
    schema['@type'] = 'WebSite'; schema.name = title; schema.url = page.toString();
  } else if (kind === 'Article') {
    schema['@type'] = 'Article'; schema.headline = title; schema.mainEntityOfPage = page.toString();
    if (String(description).trim()) schema.description = String(description).trim().slice(0, 500);
    if (String(date).trim()) { if (Number.isNaN(Date.parse(date))) throw new TypeError('Enter a valid publication date.'); schema.datePublished = new Date(date).toISOString().slice(0, 10); }
  } else throw new TypeError('Choose Organization, WebSite or Article.');
  return JSON.stringify(schema, null, 2);
}

export function buildMetaTags({ title, description, url, image = '', siteName = '', locale = 'en_US' }) {
  const pageTitle = String(title).trim(); const summary = String(description).trim();
  if (!pageTitle || pageTitle.length > 200 || !summary || summary.length > 500) throw new RangeError('Enter a title up to 200 characters and a description up to 500 characters.');
  const page = safeHttpUrl(url, 'Canonical'); const socialImage = String(image).trim() ? safeHttpUrl(image, 'Social image').toString() : '';
  const attrs = (name, content) => `  <meta property="${name}" content="${htmlEscape(content)}">`;
  return `<!-- ${pageTitle.length} title characters · ${summary.length} description characters -->\n<title>${htmlEscape(pageTitle)}</title>\n<meta name="description" content="${htmlEscape(summary)}">\n<link rel="canonical" href="${htmlEscape(page.toString())}">\n${attrs('og:type', 'website')}\n${attrs('og:title', pageTitle)}\n${attrs('og:description', summary)}\n${attrs('og:url', page.toString())}${String(siteName).trim() ? `\n${attrs('og:site_name', String(siteName).trim())}` : ''}${socialImage ? `\n${attrs('og:image', socialImage)}` : ''}\n${attrs('twitter:card', socialImage ? 'summary_large_image' : 'summary')}\n${attrs('twitter:title', pageTitle)}\n${attrs('twitter:description', summary)}${socialImage ? `\n${attrs('twitter:image', socialImage)}` : ''}\n${attrs('og:locale', String(locale).trim() || 'en_US')}`;
}

function parseHexColor(value, label = 'color') {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/iu.exec(String(value).trim());
  if (!match) throw new TypeError(`${label} must be a 3- or 6-digit hex color, such as #336699.`);
  const digits = match[1].length === 3 ? [...match[1]].map((digit) => digit + digit).join('') : match[1];
  return [0, 2, 4].map((offset) => Number.parseInt(digits.slice(offset, offset + 2), 16));
}
const toHex = (rgb) => '#' + rgb.map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')).join('').toUpperCase();

export function calculateColorContrast({ foreground, background }) {
  const linear = (channel) => { const value = channel / 255; return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4; };
  const luminance = (rgb) => 0.2126 * linear(rgb[0]) + 0.7152 * linear(rgb[1]) + 0.0722 * linear(rgb[2]);
  const l1 = luminance(parseHexColor(foreground, 'Text color')); const l2 = luminance(parseHexColor(background, 'Background color'));
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return `Contrast ratio: ${fixed(ratio, 2)}:1\nWCAG AA normal text (4.5:1): ${ratio >= 4.5 ? 'pass' : 'not met'}\nWCAG AA large text (3:1): ${ratio >= 3 ? 'pass' : 'not met'}\nWCAG AAA normal text (7:1): ${ratio >= 7 ? 'pass' : 'not met'}`;
}

function rgbToHsl([r0, g0, b0]) {
  const r = r0 / 255; const g = g0 / 255; const b = b0 / 255; const max = Math.max(r, g, b); const min = Math.min(r, g, b); const delta = max - min;
  let h = 0; let s = 0; const l = (max + min) / 2;
  if (delta) { s = delta / (1 - Math.abs(2 * l - 1)); if (max === r) h = ((g - b) / delta) % 6; else if (max === g) h = (b - r) / delta + 2; else h = (r - g) / delta + 4; h *= 60; if (h < 0) h += 360; }
  return [h, s, l];
}
function hslToRgb([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s; const x = c * (1 - Math.abs((h / 60) % 2 - 1)); const m = l - c / 2;
  const rgb = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return rgb.map((channel) => (channel + m) * 255);
}
export function generateColorPalette({ color, mode = 'complementary' }) {
  const [h, s, l] = rgbToHsl(parseHexColor(color, 'Base color'));
  const offsets = { complementary: [0, 180], analogous: [0, 30, 330], triadic: [0, 120, 240] }[mode];
  if (!offsets) throw new TypeError('Choose complementary, analogous or triadic palette.');
  return `${mode[0].toUpperCase() + mode.slice(1)} palette\n${offsets.map((offset) => toHex(hslToRgb([(h + offset) % 360, s, l]))).join('\n')}\nCheck text/background contrast before use.`;
}

export function generateCssGradient({ kind = 'linear', angle = 135, color1, color2, color3 = '' }) {
  const first = toHex(parseHexColor(color1, 'First color')); const second = toHex(parseHexColor(color2, 'Second color'));
  const third = String(color3).trim() ? toHex(parseHexColor(color3, 'Third color')) : '';
  const direction = number(angle, 'angle'); if (direction < 0 || direction > 360) throw new RangeError('Angle must be from 0 to 360 degrees.');
  if (!['linear', 'radial'].includes(kind)) throw new TypeError('Choose a linear or radial gradient.');
  const colors = [first, second, ...(third ? [third] : [])].join(', ');
  return `background: ${kind}-gradient(${kind === 'linear' ? `${fixed(direction, 1)}deg, ` : ''}${colors});`;
}

export function generateCssShadow({ x, y, blur, spread, color, opacity, inset = 'outset' }) {
  const values = [x, y, blur, spread].map((value, index) => number(value, ['horizontal offset', 'vertical offset', 'blur', 'spread'][index]));
  const alpha = number(opacity, 'opacity');
  if (Math.abs(values[0]) > 100 || Math.abs(values[1]) > 100 || values[2] < 0 || values[2] > 200 || Math.abs(values[3]) > 100 || alpha < 0 || alpha > 100) throw new RangeError('Offsets must be within ±100px, blur 0–200px, and opacity 0–100%.');
  if (!['outset', 'inset'].includes(inset)) throw new TypeError('Choose outside or inset shadow.');
  const [r, g, b] = parseHexColor(color, 'Shadow color');
  return `box-shadow: ${inset === 'inset' ? 'inset ' : ''}${values[0]}px ${values[1]}px ${values[2]}px ${values[3]}px rgba(${r}, ${g}, ${b}, ${fixed(alpha / 100, 2)});`;
}

export function generateCssLayout({ kind = 'grid', columns = 3, gap = 16, alignment = 'stretch' }) {
  const count = number(columns, 'columns'); const spacing = number(gap, 'gap');
  if (!Number.isInteger(count) || count < 1 || count > 12 || spacing < 0 || spacing > 200 || !['start', 'center', 'end', 'stretch'].includes(alignment)) throw new RangeError('Use 1–12 columns, a 0–200px gap and a supported alignment.');
  if (kind === 'grid') return `.container {\n  display: grid;\n  grid-template-columns: repeat(${count}, minmax(0, 1fr));\n  gap: ${spacing}px;\n  align-items: ${alignment};\n}`;
  if (kind === 'flex') return `.container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: ${spacing}px;\n  align-items: ${alignment};\n}\n\n.container > * {\n  flex: 1 1 ${fixed(100 / count, 2)}%;\n}`;
  throw new TypeError('Choose CSS Grid or Flexbox.');
}

function readPolynomial(text) {
  const parts = String(text).split(/[\s,;]+/u).filter(Boolean).map(Number);
  if (!parts.length || parts.length > 21 || parts.some((value) => !Number.isFinite(value) || Math.abs(value) > 1e12)) throw new TypeError('Enter 1–21 finite coefficients, from the constant term upward.');
  while (parts.length > 1 && parts.at(-1) === 0) parts.pop();
  return parts;
}
function polynomialText(coefficients) {
  const terms = [];
  coefficients.forEach((coefficient, power) => {
    if (Math.abs(coefficient) < 1e-12) return;
    const magnitude = Math.abs(coefficient); const core = power === 0 ? fixed(magnitude) : `${magnitude === 1 ? '' : fixed(magnitude)}x${power > 1 ? `^${power}` : ''}`;
    terms.push({ sign: coefficient < 0 ? '−' : '+', core });
  });
  if (!terms.length) return '0';
  return terms.map((term, index) => `${index === 0 ? term.sign === '−' ? '−' : '' : ` ${term.sign} `}${term.core}`).join('');
}
export function differentiatePolynomial({ coefficients, x = '' }) {
  const values = readPolynomial(coefficients); const derivative = values.slice(1).map((value, index) => value * (index + 1));
  const normalized = derivative.length ? derivative : [0];
  const result = `f′(x) = ${polynomialText(normalized)}`;
  if (!String(x).trim()) return result;
  const at = number(x, 'x value'); const evaluated = normalized.reduceRight((sum, coefficient) => sum * at + coefficient, 0);
  return `${result}\nf′(${fixed(at)}) = ${fixed(evaluated)}`;
}
export function integratePolynomial({ coefficients, lower = '', upper = '' }) {
  const values = readPolynomial(coefficients); const primitive = [0, ...values.map((value, index) => value / (index + 1))];
  let result = `F(x) = ${polynomialText(primitive)} + C`;
  if (String(lower).trim() || String(upper).trim()) {
    if (!String(lower).trim() || !String(upper).trim()) throw new TypeError('Enter both lower and upper bounds, or leave both blank.');
    const a = number(lower, 'lower bound'); const b = number(upper, 'upper bound');
    const evaluate = (x) => primitive.reduceRight((sum, coefficient) => sum * x + coefficient, 0);
    result += `\nDefinite integral from ${fixed(a)} to ${fixed(b)} = ${fixed(evaluate(b) - evaluate(a))}`;
  }
  return result;
}

function parseMatrix(text) {
  const rows = String(text).trim().split(/\r?\n|;/u).map((row) => row.trim()).filter(Boolean).map((row) => row.split(/[\s,]+/u).filter(Boolean).map(Number));
  if (!rows.length || rows.length > 6 || rows.some((row) => !row.length || row.length > 6 || row.length !== rows[0].length || row.some((value) => !Number.isFinite(value)))) throw new TypeError('Enter a rectangular matrix of finite numbers with 1–6 rows and columns.');
  return rows;
}
export function calculateMatrix({ matrix, operation = 'determinant' }) {
  const values = parseMatrix(matrix); const rows = values.length; const cols = values[0].length;
  if (operation === 'transpose') return values[0].map((_, col) => values.map((row) => fixed(row[col])).join(', ')).join('\n');
  if (rows !== cols) throw new RangeError('Determinant and inverse require a square matrix.');
  if (operation === 'determinant') {
    const work = values.map((row) => [...row]); let det = 1;
    for (let col = 0; col < cols; col += 1) {
      let pivot = col; for (let row = col + 1; row < rows; row += 1) if (Math.abs(work[row][col]) > Math.abs(work[pivot][col])) pivot = row;
      if (Math.abs(work[pivot][col]) < 1e-12) return 'Determinant: 0';
      if (pivot !== col) { [work[pivot], work[col]] = [work[col], work[pivot]]; det *= -1; }
      const value = work[col][col]; det *= value;
      for (let row = col + 1; row < rows; row += 1) { const factor = work[row][col] / value; for (let index = col + 1; index < cols; index += 1) work[row][index] -= factor * work[col][index]; }
    }
    return `Determinant: ${fixed(det, 10)}`;
  }
  if (operation === 'inverse') {
    const work = values.map((row, index) => [...row, ...Array.from({ length: rows }, (_, col) => Number(index === col))]);
    for (let col = 0; col < cols; col += 1) {
      let pivot = col; for (let row = col + 1; row < rows; row += 1) if (Math.abs(work[row][col]) > Math.abs(work[pivot][col])) pivot = row;
      if (Math.abs(work[pivot][col]) < 1e-12) throw new RangeError('This matrix is singular and has no inverse.');
      [work[pivot], work[col]] = [work[col], work[pivot]]; const scale = work[col][col]; work[col] = work[col].map((value) => value / scale);
      for (let row = 0; row < rows; row += 1) if (row !== col) { const factor = work[row][col]; work[row] = work[row].map((value, index) => value - factor * work[col][index]); }
    }
    return work.map((row) => row.slice(cols).map((value) => fixed(value, 8)).join(', ')).join('\n');
  }
  throw new TypeError('Choose determinant, inverse or transpose.');
}

export function buildTruthTable({ expression }) {
  const source = String(expression).replaceAll('↔', '<->').replaceAll('→', '->').replaceAll('¬', '!').replaceAll('∧', '&').replaceAll('∨', '|').replaceAll('⊕', '^').trim();
  const tokens = source.match(/<->|->|[A-Za-z]|[01]|[!&|^()]|\s+/gu)?.filter((token) => !/^\s+$/u.test(token)) ?? [];
  if (!tokens.length || tokens.join('') !== source.replace(/\s+/gu, '')) throw new TypeError('Use variables A–Z, constants 0/1, parentheses and !, &, |, ^, -> or <->.');
  const variables = [...new Set(tokens.filter((token) => /^[A-Za-z]$/u.test(token)))].sort();
  if (!variables.length || variables.length > 6) throw new RangeError('Use 1–6 distinct variables.');
  let cursor = 0;
  const precedence = { '<->': 1, '->': 2, '|': 3, '^': 4, '&': 5 };
  const primary = () => {
    const token = tokens[cursor++];
    if (token === '!') return { type: 'not', value: primary() };
    if (token === '(') { const value = parse(1); if (tokens[cursor++] !== ')') throw new TypeError('Check the parentheses in the expression.'); return value; }
    if (/^[A-Za-z]$/u.test(token ?? '')) return { type: 'variable', name: token };
    if (token === '0' || token === '1') return { type: 'constant', value: token === '1' };
    throw new TypeError('Expected a variable, 0/1 or a parenthesized expression.');
  };
  const parse = (minimum) => {
    let left = primary();
    while (precedence[tokens[cursor]] >= minimum) {
      const operator = tokens[cursor++]; const level = precedence[operator]; const right = parse(level + (operator === '->' ? 0 : 1)); left = { type: operator, left, right };
    }
    return left;
  };
  const tree = parse(1); if (cursor !== tokens.length) throw new TypeError('Check the expression and its operators.');
  const evaluate = (node, assignment) => {
    if (node.type === 'variable') return assignment[node.name];
    if (node.type === 'constant') return node.value;
    if (node.type === 'not') return !evaluate(node.value, assignment);
    const left = evaluate(node.left, assignment); const right = evaluate(node.right, assignment);
    return node.type === '&' ? left && right : node.type === '|' ? left || right : node.type === '^' ? left !== right : node.type === '->' ? !left || right : left === right;
  };
  const rows = Array.from({ length: 2 ** variables.length }, (_, index) => {
    const assignment = Object.fromEntries(variables.map((variable, bit) => [variable, Boolean(index & (1 << (variables.length - bit - 1)))]));
    return `${variables.map((variable) => Number(assignment[variable])).join('  ')}  |  ${Number(evaluate(tree, assignment))}`;
  });
  return `${variables.join('  ')}  |  Result\n${rows.join('\n')}\nPrecedence: !, &, ^, |, ->, <->. Parentheses override precedence.`;
}

function logGamma(z) {
  const coefficients = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  let x = 0.9999999999998099; const t0 = z - 1;
  coefficients.forEach((coefficient, index) => { x += coefficient / (t0 + index + 1); });
  const t = t0 + coefficients.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (t0 + 0.5) * Math.log(t) - t + Math.log(x);
}
function betaFraction(a, b, x) {
  const max = 200; const epsilon = 3e-14; const tiny = 1e-300; const qab = a + b; const qap = a + 1; const qam = a - 1;
  let c = 1; let d = 1 - qab * x / qap; if (Math.abs(d) < tiny) d = tiny; d = 1 / d; let h = d;
  for (let m = 1; m <= max; m += 1) {
    const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny; c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny; d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny; c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny; d = 1 / d; const delta = d * c; h *= delta;
    if (Math.abs(delta - 1) < epsilon) return h;
  }
  throw new RangeError('The beta approximation did not converge for these values.');
}
function regularizedBeta(x, a, b) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  const factor = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log1p(-x));
  return x < (a + 1) / (a + b + 2) ? factor * betaFraction(a, b, x) / a : 1 - factor * betaFraction(b, a, 1 - x) / b;
}
function regularizedGammaQ(a, x) {
  if (x <= 0) return 1;
  const max = 200; const epsilon = 1e-14; const tiny = 1e-300; const factor = Math.exp(-x + a * Math.log(x) - logGamma(a));
  if (x < a + 1) {
    let sum = 1 / a; let term = sum; let ap = a;
    for (let n = 1; n <= max; n += 1) { ap += 1; term *= x / ap; sum += term; if (Math.abs(term) < Math.abs(sum) * epsilon) break; }
    return 1 - sum * factor;
  }
  let b = x + 1 - a; let c = 1 / tiny; let d = 1 / b; let h = d;
  for (let i = 1; i <= max; i += 1) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < tiny) d = tiny; c = b + an / c; if (Math.abs(c) < tiny) c = tiny; d = 1 / d; const delta = d * c; h *= delta; if (Math.abs(delta - 1) < epsilon) break; }
  return factor * h;
}
function valuesList(value, label, { min = 2, max = 10000, positiveOnly = false } = {}) {
  const values = String(value).split(/[\s,;]+/u).filter(Boolean).map(Number);
  if (values.length < min || values.length > max || values.some((item) => !Number.isFinite(item) || (positiveOnly && item <= 0))) throw new TypeError(`${label} must contain ${min}–${max} valid numeric values${positiveOnly ? ' greater than zero' : ''}.`);
  return values;
}
export function calculateStatisticalTest({ test = 't', sample = '', mu0 = 0, observed = '', expected = '', groups = '' }) {
  if (test === 't') {
    const values = valuesList(sample, 'Sample'); const hypothesized = number(mu0, 'hypothesized mean'); const n = values.length; const mean = values.reduce((sum, value) => sum + value, 0) / n;
    const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (n - 1);
    if (variance === 0) throw new RangeError('The sample must have non-zero variation for this t-test.');
    const df = n - 1; const statistic = (mean - hypothesized) / Math.sqrt(variance / n); const p = regularizedBeta(df / (df + statistic ** 2), df / 2, 0.5);
    return `One-sample, two-sided t-test\nSample mean: ${fixed(mean, 6)}\nt statistic: ${fixed(statistic, 6)}\nDegrees of freedom: ${df}\nApproximate p-value: ${fixed(p, 8)}\nAssumes independent observations and an approximately normal population for small samples.`;
  }
  if (test === 'chi') {
    const obs = valuesList(observed, 'Observed counts', { positiveOnly: false }); const exp = valuesList(expected, 'Expected counts', { positiveOnly: true });
    if (obs.length !== exp.length || obs.some((item) => item < 0) || obs.reduce((sum, item) => sum + item, 0) <= 0 || obs.length < 2) throw new RangeError('Enter matching observed and positive expected counts for at least two categories.');
    const statistic = obs.reduce((sum, value, index) => sum + (value - exp[index]) ** 2 / exp[index], 0); const df = obs.length - 1; const p = regularizedGammaQ(df / 2, statistic / 2);
    return `Chi-square goodness-of-fit test\nχ² statistic: ${fixed(statistic, 6)}\nDegrees of freedom: ${df}\nApproximate p-value: ${fixed(p, 8)}\nExpected counts are supplied by you; check that they are suitable for the test.`;
  }
  if (test === 'anova') {
    const samples = String(groups).split(';').map((group) => group.trim()).filter(Boolean).map((group, index) => valuesList(group, `Group ${index + 1}`, { min: 2, max: 10000 }));
    if (samples.length < 2 || samples.length > 20) throw new RangeError('Enter 2–20 groups with at least two numeric observations in each.');
    const all = samples.flat(); const totalMean = all.reduce((sum, value) => sum + value, 0) / all.length;
    const between = samples.reduce((sum, group) => { const mean = group.reduce((a, b) => a + b, 0) / group.length; return sum + group.length * (mean - totalMean) ** 2; }, 0);
    const within = samples.reduce((sum, group) => { const mean = group.reduce((a, b) => a + b, 0) / group.length; return sum + group.reduce((subtotal, value) => subtotal + (value - mean) ** 2, 0); }, 0);
    const df1 = samples.length - 1; const df2 = all.length - samples.length; if (within <= 0) throw new RangeError('Groups must contain within-group variation for this ANOVA.');
    const statistic = (between / df1) / (within / df2); const p = regularizedBeta(df2 / (df2 + df1 * statistic), df2 / 2, df1 / 2);
    return `One-way ANOVA\nF statistic: ${fixed(statistic, 6)}\nDegrees of freedom: ${df1}, ${df2}\nApproximate p-value: ${fixed(p, 8)}\nAssumes independent observations, approximately normal residuals and similar group variances.`;
  }
  throw new TypeError('Choose a one-sample t-test, chi-square goodness-of-fit or one-way ANOVA.');
}

export function calculateCashFlows({ flows = '', discountRate = 0 }) {
  const values = valuesList(flows, 'Cash flows', { min: 2, max: 500 });
  const rate = number(discountRate, 'discount rate') / 100;
  if (rate <= -1 || !values.some((value) => value < 0) || !values.some((value) => value > 0)) throw new RangeError('Use a discount rate above −100% and cash flows with at least one positive and one negative value.');
  const npvAt = (candidate) => values.reduce((sum, cashFlow, period) => sum + cashFlow / (1 + candidate) ** period, 0);
  const npv = npvAt(rate);
  const roots = [];
  let previousRate = -0.99; let previousValue = npvAt(previousRate);
  for (let index = 1; index <= 12000; index += 1) {
    const currentRate = Math.exp(Math.log(0.01) + (Math.log(11) - Math.log(0.01)) * index / 12000) - 1;
    const currentValue = npvAt(currentRate);
    if (Number.isFinite(previousValue) && Number.isFinite(currentValue) && previousValue * currentValue < 0) {
      let low = previousRate; let high = currentRate; let lowValue = previousValue;
      for (let step = 0; step < 70; step += 1) { const middle = (low + high) / 2; const middleValue = npvAt(middle); if (lowValue * middleValue <= 0) high = middle; else { low = middle; lowValue = middleValue; } }
      const root = (low + high) / 2;
      if (!roots.some((value) => Math.abs(value - root) < 1e-6)) roots.push(root);
    }
    previousRate = currentRate; previousValue = currentValue;
  }
  const irrText = roots.length === 0 ? 'No IRR root was found between −99% and 1,000%.' : roots.length > 1 ? `Multiple IRR roots found: ${roots.map((root) => fixed(root * 100, 4) + '%').join(', ')}. IRR may be ambiguous.` : `Estimated IRR: ${fixed(roots[0] * 100, 4)}%`;
  return `NPV at ${fixed(rate * 100, 4)}%: ${fixed(npv, 2)}\n${irrText}\nCash flows are equally spaced periods beginning at period 0. NPV is not a valuation recommendation.`;
}

export function calculateDebtPayoff({ debts = '', budget = '' }) {
  const rows = String(debts).split(/\r?\n/u).map((row) => row.trim()).filter(Boolean).map((row) => {
    const [name, balanceText, aprText, minimumText] = row.split(',').map((part) => part.trim());
    const balance = number(balanceText, 'debt balance'); const apr = number(aprText, 'APR'); const minimum = number(minimumText, 'minimum payment');
    if (!name || balance <= 0 || apr < 0 || minimum <= 0) throw new TypeError('Each debt line must be name,balance,APR%,minimum payment; values must be positive except APR may be zero.');
    return { name, balance, apr: apr / 100, minimum };
  });
  const monthlyBudget = number(budget, 'monthly budget');
  if (!rows.length || rows.length > 20 || monthlyBudget <= 0 || rows.reduce((sum, debt) => sum + Math.min(debt.balance, debt.minimum), 0) > monthlyBudget) throw new RangeError('Enter 1–20 debts and a monthly budget that covers all minimum payments.');
  const results = {};
  for (const strategy of ['avalanche', 'snowball']) {
    const accounts = rows.map((debt) => ({ ...debt })); let totalInterest = 0; let months = 0; let totalPaid = 0;
    while (accounts.some((debt) => debt.balance > 0.005) && months < 1200) {
      months += 1;
      for (const debt of accounts) { if (debt.balance <= 0) continue; const interest = debt.balance * debt.apr / 12; debt.balance += interest; totalInterest += interest; }
      let remaining = monthlyBudget;
      for (const debt of accounts) { if (debt.balance <= 0) continue; const payment = Math.min(debt.balance, debt.minimum, remaining); debt.balance -= payment; remaining -= payment; totalPaid += payment; }
      const priority = accounts.filter((debt) => debt.balance > 0).sort((a, b) => strategy === 'avalanche' ? b.apr - a.apr : a.balance - b.balance);
      for (const debt of priority) { if (remaining <= 0) break; const payment = Math.min(debt.balance, remaining); debt.balance -= payment; remaining -= payment; totalPaid += payment; }
      if (remaining >= monthlyBudget - 1e-8) throw new RangeError('The monthly budget did not reduce the balances; check the entered minimums.');
    }
    if (months >= 1200) throw new RangeError('Payoff exceeds 100 years with these assumptions.');
    results[strategy] = { months, totalInterest, totalPaid };
  }
  return `Avalanche · ${results.avalanche.months} months · interest ${fixed(results.avalanche.totalInterest, 2)} · total paid ${fixed(results.avalanche.totalPaid, 2)}\nSnowball · ${results.snowball.months} months · interest ${fixed(results.snowball.totalInterest, 2)} · total paid ${fixed(results.snowball.totalPaid, 2)}\nAssumes fixed APRs, no new charges and the entered minimum-payment rules; not financial advice.`;
}

export function calculateRentVsBuy({ homePrice = '', downPaymentPercent = '', mortgageRate = '', years = '', mortgageTermYears = '', monthlyRent = '', rentIncrease = '', appreciation = '', propertyTax = '', maintenance = '', investmentReturn = '' }) {
  const price = number(homePrice, 'home price'); const downPct = number(downPaymentPercent, 'down payment'); const annualMortgage = number(mortgageRate, 'mortgage rate') / 100;
  const duration = number(years, 'years'); const mortgageTerm = number(mortgageTermYears, 'mortgage term'); const rent = number(monthlyRent, 'monthly rent'); const rentGrowth = number(rentIncrease, 'rent increase') / 100;
  const homeGrowth = number(appreciation, 'home appreciation') / 100; const tax = number(propertyTax, 'property tax') / 100;
  const upkeep = number(maintenance, 'maintenance') / 100; const invest = number(investmentReturn, 'investment return') / 100;
  if (price <= 0 || downPct < 0 || downPct >= 100 || annualMortgage < 0 || duration <= 0 || duration > 100 || mortgageTerm <= 0 || mortgageTerm > 100 || rent < 0 || rentGrowth < -1 || homeGrowth < -1 || tax < 0 || upkeep < 0 || invest < -1) throw new RangeError('Check the entered prices, rates and duration.');
  const months = Math.round(duration * 12); const mortgageMonths = Math.round(mortgageTerm * 12); const loan = price * (1 - downPct / 100); const monthlyRate = annualMortgage / 12;
  const payment = monthlyRate === 0 ? loan / mortgageMonths : loan * monthlyRate / (1 - (1 + monthlyRate) ** -mortgageMonths);
  let balance = loan; let ownerCosts = price * downPct / 100; let totalRent = 0; let rentNow = rent;
  for (let month = 1; month <= months; month += 1) {
    if ((month - 1) % 12 === 0 && month > 1) rentNow *= 1 + rentGrowth;
    totalRent += rentNow;
    const interest = balance * monthlyRate; balance = Math.max(0, balance + interest - payment);
    ownerCosts += payment + price * (tax + upkeep) / 12 * (1 + homeGrowth) ** Math.floor((month - 1) / 12);
  }
  const futureValue = price * (1 + homeGrowth) ** duration; const equity = Math.max(0, futureValue - balance);
  const buyNetCost = ownerCosts - equity;
  const downPaymentInvestment = price * downPct / 100 * (1 + invest) ** duration;
  return `Rent paid: ${fixed(totalRent, 2)}\nEstimated ownership cash costs: ${fixed(ownerCosts, 2)}\nEstimated home value: ${fixed(futureValue, 2)}\nEstimated remaining mortgage: ${fixed(balance, 2)}\nEstimated home equity: ${fixed(equity, 2)}\nEstimated net ownership cost after equity: ${fixed(buyNetCost, 2)}\nPotential value of invested down payment: ${fixed(downPaymentInvestment, 2)}\nMonthly mortgage payment over ${fixed(mortgageTerm, 2)} years: ${fixed(payment, 2)}\nSimplified scenario; assumes the renter invests the down payment at ${fixed(invest * 100, 4)}% annually. Excludes some local costs and is not financial advice.`;
}

export function createCitation(input) {
  const style = String(input.style || 'apa'); const kind = String(input.kind || 'web');
  const author = String(input.author || '').trim(); const title = String(input.title || '').trim();
  const site = String(input.site || '').trim(); const date = String(input.date || '').trim();
  const url = String(input.url || '').trim(); const accessed = String(input.accessed || '').trim();
  if (!['apa', 'mla', 'chicago'].includes(style) || !['web', 'book'].includes(kind)) throw new RangeError('Choose a supported style and source type.');
  if (!author || !title || !date) throw new TypeError('Enter the author, title and publication date or year.');
  if (kind === 'web' && !site) throw new TypeError('Enter the website name for a webpage citation.');
  if (kind === 'web') {
    let parsed; try { parsed = new URL(url); } catch { throw new TypeError('Enter a valid webpage URL.'); }
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new TypeError('Use an http or https webpage URL.');
  }
  const [last = '', first = ''] = author.split(/,\s*/u);
  if (style === 'apa') return kind === 'book'
    ? `${first ? `${last}, ${first}` : last} (${date}). ${title}. ${site}.`
    : `${first ? `${last}, ${first}` : last} (${date}). ${title}. ${site}. ${url}`;
  if (style === 'mla') return kind === 'book'
    ? `${first ? `${last}, ${first}` : last}. ${title}. ${site}, ${date}.`
    : `${first ? `${last}, ${first}` : last}. “${title}.” ${site}, ${date}${accessed ? `, Accessed ${accessed}` : ''}, ${url}.`;
  return kind === 'book'
    ? `${author}. ${date}. ${title}. ${site}.`
    : `${author}. ${date}. “${title}.” ${site}. ${url}.${accessed ? ` Accessed ${accessed}.` : ''}`;
}

const schemaTypeMatches = (value, type) => type === 'null' ? value === null
  : type === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value)
    : type === 'array' ? Array.isArray(value)
      : type === 'integer' ? Number.isInteger(value)
        : type === 'number' ? typeof value === 'number' && Number.isFinite(value)
          : type === 'string' ? typeof value === 'string'
            : type === 'boolean' ? typeof value === 'boolean' : false;

export function validateJsonSchema(input) {
  let value; let schema;
  try { value = JSON.parse(String(input.json)); } catch (error) { throw new TypeError(`JSON data: ${error.message}`); }
  try { schema = JSON.parse(String(input.schema)); } catch (error) { throw new TypeError(`JSON Schema: ${error.message}`); }
  const errors = [];
  const walk = (data, rule, path, depth = 0) => {
    if (!rule || typeof rule !== 'object' || Array.isArray(rule) || depth > 30) { errors.push(`${path}: invalid schema or nesting limit exceeded`); return; }
    if (rule.$ref) { errors.push(`${path}: $ref is not supported`); return; }
    const types = Array.isArray(rule.type) ? rule.type : rule.type ? [rule.type] : [];
    if (types.length && !types.some((type) => schemaTypeMatches(data, type))) { errors.push(`${path}: expected ${types.join(' or ')}`); return; }
    if (Object.hasOwn(rule, 'const') && JSON.stringify(data) !== JSON.stringify(rule.const)) errors.push(`${path}: value does not match const`);
    if (Array.isArray(rule.enum) && !rule.enum.some((item) => JSON.stringify(item) === JSON.stringify(data))) errors.push(`${path}: value is not in enum`);
    if (typeof data === 'number') {
      if (Number.isFinite(rule.minimum) && data < rule.minimum) errors.push(`${path}: must be at least ${rule.minimum}`);
      if (Number.isFinite(rule.maximum) && data > rule.maximum) errors.push(`${path}: must be at most ${rule.maximum}`);
    }
    if (typeof data === 'string') {
      if (Number.isInteger(rule.minLength) && data.length < rule.minLength) errors.push(`${path}: is shorter than minLength`);
      if (Number.isInteger(rule.maxLength) && data.length > rule.maxLength) errors.push(`${path}: is longer than maxLength`);
    }
    if (Array.isArray(data) && rule.items) data.forEach((item, index) => walk(item, rule.items, `${path}[${index}]`, depth + 1));
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      for (const required of rule.required ?? []) if (!Object.hasOwn(data, required)) errors.push(`${path}.${required}: required property is missing`);
      for (const [key, item] of Object.entries(data)) {
        if (rule.properties?.[key]) walk(item, rule.properties[key], `${path}.${key}`, depth + 1);
        else if (rule.additionalProperties === false) errors.push(`${path}.${key}: additional property is not allowed`);
        else if (rule.additionalProperties && typeof rule.additionalProperties === 'object') walk(item, rule.additionalProperties, `${path}.${key}`, depth + 1);
      }
    }
  };
  walk(value, schema, '$');
  return errors.length ? `Invalid · ${errors.length} issue${errors.length === 1 ? '' : 's'}\n${errors.slice(0, 100).join('\n')}` : 'Valid · JSON matches the supported schema checks.';
}

export function queryJsonPath(input) {
  let root; try { root = JSON.parse(String(input.json)); } catch (error) { throw new TypeError(`JSON data: ${error.message}`); }
  const expression = String(input.path || '').trim();
  if (!expression.startsWith('$') || expression.length > 500) throw new TypeError('Enter a JSONPath expression beginning with $ (up to 500 characters).');
  const segments = []; let i = 1;
  while (i < expression.length) {
    if (expression[i] === '.') {
      i += 1; if (expression[i] === '.') throw new TypeError('Recursive descent (..) is not supported.');
      if (expression[i] === '*') { segments.push({ kind: 'wildcard' }); i += 1; continue; }
      const match = /^[A-Za-z_$][\w$-]*/u.exec(expression.slice(i));
      if (!match) throw new TypeError('Use simple property names after a dot.');
      segments.push({ kind: 'key', value: match[0] }); i += match[0].length; continue;
    }
    if (expression[i] === '[') {
      const end = expression.indexOf(']', i + 1); if (end < 0) throw new TypeError('Close each bracket selector with ].');
      const token = expression.slice(i + 1, end).trim();
      if (token === '*') segments.push({ kind: 'wildcard' });
      else if (/^\d+$/u.test(token)) segments.push({ kind: 'index', value: Number(token) });
      else if (/^['"][^'"]+['"]$/u.test(token)) segments.push({ kind: 'key', value: token.slice(1, -1) });
      else {
        const filter = /^\?\(@\.([A-Za-z_$][\w$-]*)\s*(==|!=)\s*(.+)\)$/u.exec(token);
        if (!filter) throw new TypeError('Supported brackets: [0], ["key"], [*] and simple equality filters.');
        let expected; try { expected = JSON.parse(filter[3]); } catch { throw new TypeError('Filter values must be valid JSON values such as true, 3, or "text".'); }
        segments.push({ kind: 'filter', key: filter[1], operator: filter[2], expected });
      }
      i = end + 1; continue;
    }
    throw new TypeError(`Unexpected character at position ${i + 1}.`);
  }
  let current = [root];
  for (const segment of segments) {
    const next = [];
    for (const item of current) {
      if (segment.kind === 'key' && item != null && Object.hasOwn(Object(item), segment.value)) next.push(item[segment.value]);
      else if (segment.kind === 'index' && Array.isArray(item) && segment.value < item.length) next.push(item[segment.value]);
      else if (segment.kind === 'wildcard' && item != null && typeof item === 'object') next.push(...Object.values(item));
      else if (segment.kind === 'filter' && Array.isArray(item)) next.push(...item.filter((entry) => {
        const equal = JSON.stringify(entry?.[segment.key]) === JSON.stringify(segment.expected);
        return segment.operator === '==' ? equal : !equal;
      }));
    }
    current = next; if (current.length > 10000) throw new RangeError('The query matched more than 10,000 values. Narrow the expression.');
  }
  return current.length ? JSON.stringify(current.length === 1 ? current[0] : current, null, 2) : 'No matches.';
}

export function makePrintableCalendar({ year, month, weekStart = 0 }) {
  const y = number(year, 'year'); const m = number(month, 'month'); const start = number(weekStart, 'week start');
  if (!Number.isInteger(y) || y < 1 || y > 9999 || !Number.isInteger(m) || m < 1 || m > 12 || ![0, 1].includes(start)) throw new RangeError('Use a year from 1 to 9999, month 1 to 12, and Sunday or Monday as week start.');
  const first = new Date(Date.UTC(y, m - 1, 1)); const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const offset = (first.getUTCDay() - start + 7) % 7; const cells = [...Array(offset).fill('  '), ...Array.from({ length: days }, (_, i) => String(i + 1).padStart(2, ' '))];
  while (cells.length % 7) cells.push('  ');
  const headings = start === 0 ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}\n${headings.join('  ')}\n${Array.from({ length: cells.length / 7 }, (_, row) => cells.slice(row * 7, row * 7 + 7).join('  ')).join('\n')}`;
}

export function makeFlashcards({ cards }) {
  const lines = String(cards).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || lines.length > 200) throw new RangeError('Enter between 1 and 200 flashcards.');
  return lines.map((line, index) => {
    const split = line.search(/[,،，、]/u); if (split < 1 || !line.slice(split + 1).trim()) throw new TypeError(`Line ${index + 1}: use term, definition.`);
    return `${index + 1}. FRONT: ${line.slice(0, split).trim()}\n   BACK: ${line.slice(split + 1).trim()}`;
  }).join('\n\n');
}

export const flashcardProgress = (known, index, remaining) => ({ current: remaining ? known + index + 1 : 0, total: known + remaining });

function seededRandom(seed) {
  let state = 2166136261;
  for (const char of String(seed)) { state ^= char.codePointAt(0); state = Math.imul(state, 16777619); }
  return () => { state += 0x6D2B79F5; let value = state; value = Math.imul(value ^ value >>> 15, value | 1); value ^= value + Math.imul(value ^ value >>> 7, value | 61); return ((value ^ value >>> 14) >>> 0) / 4294967296; };
}

function puzzleCells(value, locale = 'en') {
  const text = String(value ?? '').normalize('NFC').toLocaleUpperCase(locale).replace(/[^\p{L}\p{M}\p{N}]/gu, '');
  if (typeof Intl.Segmenter === 'function') return [...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(text)].map(({ segment }) => segment);
  return Array.from(text);
}

export function makeWordSearch({ words, size, seed = '1', locale = 'en' }) {
  const dimension = number(size, 'grid size');
  if (!Number.isInteger(dimension) || dimension < 8 || dimension > 20) throw new RangeError('Grid size must be a whole number from 8 to 20.');
  const list = [...new Set(String(words).split(/[\n,;،，、]+/u).map((word) => puzzleCells(word, locale).join('')).filter(Boolean))].map((word) => puzzleCells(word, locale));
  if (!list.length || list.length > 20 || list.some((word) => word.length > dimension)) throw new RangeError('Enter 1 to 20 unique words using letters or digits, each no longer than the grid.');
  const grid = Array.from({ length: dimension }, () => Array(dimension).fill('')); const random = seededRandom(seed);
  const filler = [...new Set(list.flat())];
  const directions = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]]; const placements = [];
  for (const word of [...list].sort((a, b) => b.length - a.length)) {
    let placed = false;
    for (let attempt = 0; attempt < 500 && !placed; attempt += 1) {
      const [dr, dc] = directions[Math.floor(random() * directions.length)]; const row = Math.floor(random() * dimension); const col = Math.floor(random() * dimension);
      const endRow = row + dr * (word.length - 1); const endCol = col + dc * (word.length - 1);
      if (endRow < 0 || endRow >= dimension || endCol < 0 || endCol >= dimension) continue;
      if (word.some((letter, index) => grid[row + dr * index][col + dc * index] && grid[row + dr * index][col + dc * index] !== letter)) continue;
      word.forEach((letter, index) => { grid[row + dr * index][col + dc * index] = letter; });
      placements.push(`${word.join('')}: (${row + 1},${col + 1}) → (${endRow + 1},${endCol + 1})`); placed = true;
    }
    if (!placed) throw new RangeError(`Could not place “${word}”. Increase the grid or use fewer words.`);
  }
  for (const row of grid) for (let col = 0; col < dimension; col += 1) if (!row[col]) row[col] = filler[Math.floor(random() * filler.length)];
  return `WORD SEARCH (${dimension}×${dimension})\n${grid.map((row) => row.join(' ')).join('\n')}\n\nANSWER KEY · start and end coordinates\n${placements.join('\n')}`;
}

export function makeBingoCard({ entries, seed = '1' }) {
  const pool = [...new Set(String(entries).split(/\r?\n/u).map((entry) => entry.trim()).filter(Boolean))];
  if (pool.length < 24 || pool.length > 500 || pool.some((entry) => entry.length > 60)) throw new RangeError('Enter 24 to 500 unique entries, each no longer than 60 characters.');
  const random = seededRandom(seed);
  for (let index = pool.length - 1; index > 0; index -= 1) { const swap = Math.floor(random() * (index + 1)); [pool[index], pool[swap]] = [pool[swap], pool[index]]; }
  const chosen = pool.slice(0, 24); chosen.splice(12, 0, 'FREE');
  const width = Math.max(5, ...chosen.map((entry) => entry.length));
  return `B   I   N   G   O\n${Array.from({ length: 5 }, (_, row) => Array.from({ length: 5 }, (_, col) => chosen[row * 5 + col].padEnd(width)).join(' | ')).join('\n')}`;
}

export function calculateAdultBmi(input) {
  const units = String(input.units || 'metric');
  let height; let weight;
  if (units === 'metric') { height = positive(input.heightCm, 'height') / 100; weight = positive(input.weightKg, 'weight'); }
  else if (units === 'us') { height = (positive(input.heightFt, 'height in feet', true) * 12 + number(input.heightIn, 'additional inches')) * 0.0254; weight = positive(input.weightLb, 'weight') * 0.45359237; }
  else throw new RangeError('Choose metric or US units.');
  if (height < 0.5 || height > 2.8 || weight < 10 || weight > 500) throw new RangeError('Check the adult height and weight values.');
  const bmi = weight / (height * height);
  return `BMI: ${bmi.toFixed(1)}\nThis number is a screening measure only, not a diagnosis. Adult categories may not apply to every person.`;
}

export function calculateBmrTdee(input) {
  const age = number(input.age, 'age'); const height = positive(input.heightCm, 'height'); const weight = positive(input.weightKg, 'weight');
  const activity = number(input.activity, 'activity factor'); const sex = String(input.sex);
  if (!Number.isInteger(age) || age < 18 || age > 120) throw new RangeError('This estimate is intended for adults aged 18 to 120.');
  if (height < 100 || height > 250 || weight < 25 || weight > 350 || ![1.2, 1.375, 1.55, 1.725, 1.9].includes(activity) || !['female', 'male'].includes(sex)) throw new RangeError('Check height, weight, equation setting and activity factor.');
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161); const tdee = bmr * activity;
  return `Estimated resting energy (Mifflin–St Jeor): ${Math.round(bmr)} kcal/day\nEstimated daily energy (selected activity factor ${activity}): ${Math.round(tdee)} kcal/day\nEstimate only; actual needs vary.`;
}

export function calculateMacros({ calories, protein, carbs, fat }) {
  const total = number(calories, 'calorie target'); const values = [protein, carbs, fat].map((item) => number(item, 'macro percentage'));
  if (total <= 0 || total > 20000 || values.some((item) => item < 0 || item > 100) || Math.abs(values.reduce((a, b) => a + b, 0) - 100) > 1e-8) throw new RangeError('Use a calorie target up to 20,000 and macro percentages totaling exactly 100%.');
  return `Protein: ${Math.round(total * values[0] / 100 / 4)} g (${values[0]}%)\nCarbohydrate: ${Math.round(total * values[1] / 100 / 4)} g (${values[1]}%)\nFat: ${Math.round(total * values[2] / 100 / 9)} g (${values[2]}%)\nBased only on the calorie target and percentages you entered.`;
}

export function calculateRunningPace(input) {
  const distance = positive(input.distance, 'distance'); const target = input.targetDistance == null || input.targetDistance === '' ? 0 : number(input.targetDistance, 'target distance');
  const hours = number(input.hours || 0, 'hours'); const minutes = number(input.minutes || 0, 'minutes'); const seconds = number(input.seconds || 0, 'seconds');
  if (!['km', 'mi'].includes(String(input.unit)) || hours < 0 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59 || !Number.isInteger(minutes) || !Number.isInteger(seconds) || target < 0) throw new RangeError('Check units, non-negative time, minutes/seconds from 0 to 59, and target distance.');
  const totalSeconds = hours * 3600 + minutes * 60 + seconds; if (totalSeconds <= 0) throw new RangeError('Enter an elapsed time greater than zero.');
  const km = distance * (input.unit === 'mi' ? 1.609344 : 1); const pace = totalSeconds / km;
  const format = (value) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  return `Pace: ${format(pace)} per km · ${format(pace * 1.609344)} per mile${target ? `\nEstimated time for ${target} ${input.unit}: ${format(totalSeconds / distance * target)}` : ''}\nEven-pace estimate only.`;
}

export function estimateOneRepMax({ weight, unit = 'kg', reps }) {
  const load = positive(weight, 'weight'); const count = number(reps, 'repetitions');
  if (!['kg', 'lb'].includes(String(unit)) || !Number.isInteger(count) || count < 1 || count > 15) throw new RangeError('Use 1 to 15 whole repetitions and kg or lb.');
  const epley = load * (1 + count / 30); const brzycki = count === 1 ? load : load * 36 / (37 - count);
  return `Estimated 1RM · Epley: ${fixed(epley, 1)} ${unit}\nEstimated 1RM · Brzycki: ${fixed(brzycki, 1)} ${unit}\nThese formulas provide rough estimates, not a lifting recommendation.`;
}

export function buildCoverLetter(input) {
  const name = String(input.name || '').trim(); const company = String(input.company || '').trim(); const role = String(input.role || '').trim();
  const experience = String(input.experience || '').trim(); const motivation = String(input.motivation || '').trim(); const closing = String(input.closing || '').trim();
  if (![name, company, role, experience, motivation].every(Boolean)) throw new TypeError('Enter your name, company, role, experience and motivation.');
  if ([name, company, role, experience, motivation, closing].some((value) => value.length > 2500)) throw new RangeError('Keep each section under 2,500 characters.');
  const date = String(input.date || '').trim();
  if (date && !/^\d{4}-\d{2}-\d{2}$/u.test(date)) throw new TypeError('Choose a valid date.');
  return [name, input.contact, date, '', input.hiringManager ? `Dear ${String(input.hiringManager).trim()},` : 'Dear Hiring Manager,', '', `I am applying for the ${role} position at ${company}.`, '', experience, '', motivation, '', closing || 'Thank you for your time and consideration.', '', 'Sincerely,', name].filter((line) => line !== undefined && line !== null).join('\n');
}

export function generateTestData({ fields, rows, seed = '1' }) {
  const names = String(fields).split(',').map((name) => name.trim()).filter(Boolean); const count = number(rows, 'record count');
  if (!names.length || names.length > 30 || names.some((name) => name.length > 40) || new Set(names).size !== names.length) throw new RangeError('Enter 1 to 30 unique field names, each up to 40 characters.');
  if (!Number.isInteger(count) || count < 1 || count > 500) throw new RangeError('Choose 1 to 500 records.');
  const random = seededRandom(seed);
  const data = Array.from({ length: count }, (_, index) => Object.fromEntries(names.map((key) => {
    const lower = key.toLowerCase();
    const value = lower === 'id' ? index + 1
      : lower.includes('email') ? `person${index + 1}@example.test`
        : lower.includes('active') || lower.startsWith('is_') ? random() > 0.5
          : lower.includes('date') ? `2026-${String(1 + Math.floor(random() * 12)).padStart(2, '0')}-${String(1 + Math.floor(random() * 28)).padStart(2, '0')}`
            : lower.includes('name') ? ['Alex Sample', 'Sam Example', 'Taylor Demo'][Math.floor(random() * 3)]
              : Math.round(random() * 10000) / 100;
    return [key, value];
  })));
  return JSON.stringify(data, null, 2);
}

export function generateMathWorksheet({ operation, count, max, seed = '1' }) {
  const total = number(count, 'problem count'); const ceiling = number(max, 'maximum operand');
  if (!['add', 'subtract', 'multiply', 'divide'].includes(String(operation)) || !Number.isInteger(total) || total < 1 || total > 50 || !Number.isInteger(ceiling) || ceiling < 2 || ceiling > 1000) throw new RangeError('Choose an operation, 1 to 50 problems and a maximum operand from 2 to 1,000.');
  const random = seededRandom(seed); const problems = []; const answers = [];
  for (let index = 0; index < total; index += 1) {
    let a = 1 + Math.floor(random() * ceiling); let b = 1 + Math.floor(random() * ceiling); let symbol; let answer;
    if (operation === 'add') { symbol = '+'; answer = a + b; }
    if (operation === 'subtract') { symbol = '−'; if (b > a) [a, b] = [b, a]; answer = a - b; }
    if (operation === 'multiply') { symbol = '×'; answer = a * b; }
    if (operation === 'divide') { symbol = '÷'; answer = b; a = b * (1 + Math.floor(random() * ceiling)); }
    problems.push(`${String(index + 1).padStart(2, ' ')}.  ${a} ${symbol} ${b} = ______`);
    answers.push(`${index + 1}. ${answer}`);
  }
  return `MATH WORKSHEET\n\n${problems.join('\n')}\n\nANSWER KEY\n${answers.join('\n')}`;
}

function plotPolynomial({ coefficients, xmin, xmax, samples = 120 }) {
  const terms = String(coefficients).split(/[\s,;]+/u).filter(Boolean).map(Number);
  const low = number(xmin, 'minimum x'); const high = number(xmax, 'maximum x'); const count = number(samples, 'plot points');
  if (!terms.length || terms.length > 5 || terms.some((n) => !Number.isFinite(n)) || low >= high || high - low > 1e6 || !Number.isInteger(count) || count < 40 || count > 400) throw new RangeError('Use 1–5 finite coefficients, an increasing x range and 40–400 plot points.');
  return Array.from({ length: count + 1 }, (_, i) => { const x = low + (high - low) * i / count; const y = [...terms].reduce((sum, coefficient) => sum * x + coefficient, 0); if (!Number.isFinite(y) || Math.abs(y) > 1e12) throw new RangeError('The graph exceeds the safe display range. Narrow the x range.'); return `${fixed(x, 3)},${fixed(y, 3)}`; }).join('\n');
}

function simpleFormatter({ source, mode = 'format' }, kind) {
  const text = String(source ?? ''); if (!text.trim() || text.length > 200_000) throw new RangeError('Paste non-empty source under 200,000 characters.');
  if (kind === 'html') return mode === 'minify' ? text.replace(/>\s+</gu, '><').trim() : text.replace(/>\s*</gu, '>\n<').trim();
  if (kind === 'css') {
    if (mode === 'minify') return text.replace(/\/\*[\s\S]*?\*\//gu, '').replace(/\s*([{}:;,])\s*/gu, '$1').replace(/;\}/gu, '}').trim();
    return text.replace(/\s*\{\s*/gu, ' {\n  ').replace(/;\s*/gu, ';\n  ').replace(/\s*:\s*/gu, ': ').replace(/\s*\}\s*/gu, '\n}\n\n').trim();
  }
  if (kind === 'javascript') {
    // Deliberately conservative formatter: preserve token content and only add line breaks at separators.
    let quote = ''; let escaped = false; let output = ''; let depth = 0;
    for (const char of text) { if (quote) { output += char; if (escaped) escaped = false; else if (char === '\\') escaped = true; else if (char === quote) quote = ''; continue; } if (char === '"' || char === "'" || char === '`') { quote = char; output += char; } else if (char === '{') { depth++; output += ' {\n' + '  '.repeat(depth); } else if (char === '}') { depth = Math.max(0, depth - 1); output += '\n' + '  '.repeat(depth) + '}'; } else if (char === ';') output += ';\n' + '  '.repeat(depth); else output += char; }
    if (quote || depth !== 0) throw new TypeError('The source has an unclosed quote or brace.');
    return mode === 'minify' ? text.replace(/\/\*[\s\S]*?\*\//gu, '').replace(/\s+/gu, ' ').replace(/\s*([{};,])\s*/gu, '$1').trim() : output.trim();
  }
  throw new TypeError('Unsupported formatter.');
}

function cronExpression({ frequency, minute = 0, hour = 9, weekday = 1, day = 1 }) {
  const m = number(minute, 'minute'); const h = number(hour, 'hour'); const w = number(weekday, 'weekday'); const d = number(day, 'day');
  if (![m, h, w, d].every(Number.isInteger) || m < 0 || m > 59 || h < 0 || h > 23 || w < 0 || w > 6 || d < 1 || d > 31) throw new RangeError('Check the allowed ranges for minute, hour, weekday and day.');
  return ({ hourly: `${m} * * * *`, daily: `${m} ${h} * * *`, weekly: `${m} ${h} * * ${w}`, monthly: `${m} ${h} ${d} * *` })[frequency] ?? (() => { throw new TypeError('Choose a supported schedule.'); })();
}

function estimateBodyFat({ group, height, waist, neck, hip = '' }) {
  const h = positive(height, 'height'); const w = positive(waist, 'waist'); const n = positive(neck, 'neck');
  if (h > 250 || w > 200 || n > 80 || w <= n) throw new RangeError('Check measurements in centimeters; waist must exceed neck.');
  const log10 = (x) => Math.log(x) / Math.LN10;
  let estimate;
  if (group === 'male') estimate = 495 / (1.0324 - 0.19077 * log10(w - n) + 0.15456 * log10(h)) - 450;
  else { const hips = positive(hip, 'hip'); if (hips > 200 || w + hips <= n) throw new RangeError('Check waist, hip and neck measurements.'); estimate = 495 / (1.29579 - 0.35004 * log10(w + hips - n) + 0.221 * log10(h)) - 450; }
  if (!Number.isFinite(estimate) || estimate < 0 || estimate > 75) throw new RangeError('These measurements are outside the method’s practical range.');
  return `Estimated body fat: ${fixed(estimate, 1)}%\nCircumference-based estimate only; not a diagnosis.`;
}

function addCalendarDays(value, amount) { const date = new Date(`${value}T12:00:00Z`); if (!Number.isFinite(date.getTime())) throw new TypeError('Choose a valid date.'); date.setUTCDate(date.getUTCDate() + amount); return date.toISOString().slice(0, 10); }
function estimateDueDate({ lastPeriod, cycle = 28 }) { const days = number(cycle, 'cycle length'); if (!Number.isInteger(days) || days < 20 || days > 45) throw new RangeError('Cycle length must be 20–45 days.'); return `Estimated due date: ${addCalendarDays(lastPeriod, 280 + days - 28)}\nCalendar estimate only; confirm dates with a qualified clinician.`; }
function estimateCycle({ start, cycle = 28, period = 5 }) { const days = number(cycle, 'cycle length'); const bleed = number(period, 'period length'); if (!Number.isInteger(days) || days < 20 || days > 45 || !Number.isInteger(bleed) || bleed < 1 || bleed > 10) throw new RangeError('Use a cycle of 20–45 days and period length of 1–10 days.'); const next = addCalendarDays(start, days); const ovulation = addCalendarDays(start, days - 14); return `Estimated next period: ${next}\nApproximate ovulation date: ${ovulation}\nNot contraception or medical advice.`; }

function makeAscii({ text }) { const input = String(text ?? '').trim(); if (!input || input.length > 80) throw new RangeError('Enter 1–80 characters.'); return input.toUpperCase().split('').map((char) => char === ' ' ? '   ' : `[${char}]`).join(' '); }
function findChord({ chord }) { const chords = { C: 'C–E–G · x32010', G: 'G–B–D · 320003', D: 'D–F♯–A · xx0232', A: 'A–C♯–E · x02220', E: 'E–G♯–B · 022100', Am: 'A–C–E · x02210', Em: 'E–G–B · 022000', Dm: 'D–F–A · xx0231', F: 'F–A–C · 133211' }; if (!chords[chord]) throw new TypeError('Choose a listed chord.'); return `${chord}: ${chords[chord]}\nStandard tuning; one common fingering.`; }
function makeCrossword({ pairs, locale = 'en' }) {
  const items = String(pairs ?? '').split(/\r?\n/u).map((line) => {
    const split = line.search(/[,;\t،，、]/u);
    return split < 1 ? null : { answer: line.slice(0, split).trim(), clue: line.slice(split + 1).trim() };
  }).filter((item) => item?.answer && item.clue).map(({ answer, clue }) => ({ answer: puzzleCells(answer, locale), clue }));
  if (items.length < 2 || items.length > 20 || items.some((item) => item.answer.length < 2 || item.answer.length > 14 || item.clue.length > 140)) throw new RangeError('Enter 2–20 answer, clue lines. Answers must contain 2–14 letters or digits.');
  const size = 31; const grid = Array.from({ length: size }, () => Array(size).fill('')); const placed = [];
  const fits = (word, row, col, vertical) => {
    const dr = vertical ? 1 : 0; const dc = vertical ? 0 : 1; const endR = row + dr * (word.length - 1); const endC = col + dc * (word.length - 1);
    if (row < 1 || col < 1 || endR > size - 2 || endC > size - 2) return false;
    let crossings = 0;
    for (let i = 0; i < word.length; i += 1) { const r = row + dr * i; const c = col + dc * i; const cell = grid[r][c]; if (cell && cell !== word[i]) return false; if (cell === word[i]) crossings += 1; if (!cell) { if (vertical ? grid[r][c - 1] || grid[r][c + 1] : grid[r - 1][c] || grid[r + 1][c]) return false; } }
    if (vertical ? grid[row - 1][col] || grid[endR + 1][endC] : grid[row][col - 1] || grid[endR][endC + 1]) return false;
    return crossings > 0;
  };
  const first = items[0].answer; const firstRow = 15; const firstCol = Math.floor((size - first.length) / 2);
  for (let i = 0; i < first.length; i += 1) grid[firstRow][firstCol + i] = first[i]; placed.push({ ...items[0], row: firstRow, col: firstCol, vertical: false });
  for (const item of items.slice(1)) {
    let found = null;
    for (const prior of placed) { if (found) break; for (let a = 0; a < item.answer.length && !found; a += 1) for (let b = 0; b < prior.answer.length && !found; b += 1) if (item.answer[a] === prior.answer[b]) { const vertical = !prior.vertical; const row = prior.row + (prior.vertical ? b : 0) - (vertical ? a : 0); const col = prior.col + (prior.vertical ? 0 : b) - (vertical ? 0 : a); if (fits(item.answer, row, col, vertical)) found = { ...item, row, col, vertical }; } }
    if (found) { for (let i = 0; i < found.answer.length; i += 1) grid[found.row + (found.vertical ? i : 0)][found.col + (found.vertical ? 0 : i)] = found.answer[i]; placed.push(found); }
  }
  if (placed.length < 2) throw new RangeError('The answers did not cross. Add words with at least one shared letter.');
  const minR = Math.min(...placed.map((p) => p.row)); const maxR = Math.max(...placed.map((p) => p.row + (p.vertical ? p.answer.length - 1 : 0))); const minC = Math.min(...placed.map((p) => p.col)); const maxC = Math.max(...placed.map((p) => p.col + (p.vertical ? 0 : p.answer.length - 1)));
  return `CROSSWORD GRID (* = empty)\n${grid.slice(minR, maxR + 1).map((row) => row.slice(minC, maxC + 1).map((cell) => cell || '*').join(' ')).join('\n')}\n\nPLACED ${placed.length} OF ${items.length} WORDS\n${placed.map((item, index) => `${index + 1}. ${item.vertical ? 'Down' : 'Across'} · ${item.clue} (${item.answer.join('')})`).join('\n')}`;
}
function optimizeSvg({ svg }) {
  const text = String(svg ?? '').trim(); if (!/^(?:<\?xml[^>]*>\s*)?<svg\b[\s\S]*<\/svg>\s*$/iu.test(text)) throw new TypeError('Paste a complete SVG document.');
  if (/<\s*script\b|\bon\w+\s*=|(?:href|src)\s*=\s*["']\s*(?:https?:|javascript:|\/\/)|<foreignObject\b/iu.test(text)) throw new TypeError('This SVG contains active or external content and was not processed.');
  return text.replace(/<!--[\s\S]*?-->/gu, '').replace(/>\s+</gu, '><').replace(/[\r\n\t]+/gu, ' ').replace(/ {2,}/gu, ' ').replace(/\s+(\/?>)/gu, '$1').trim();
}
function simpleSql({ sql }) {
  const text = String(sql ?? '').trim(); if (!text || text.length > 20000 || /\b(?:attach|detach|pragma|vacuum|load_extension|drop|delete|update|insert|create|alter)\b/iu.test(text)) throw new TypeError('This lightweight query tool accepts only a small read-only SELECT subset.');
  const match = /^select\s+(.+?)(?:\s+as\s+([A-Za-z_][\w]*))?\s*;?$/iu.exec(text); if (!match) throw new TypeError('Use a read-only SELECT expression without tables or functions.');
  const expr = match[1].trim(); if (!/^[\d\s()+*/.-]+$/u.test(expr)) throw new TypeError('Use numeric literals and +, −, ×, ÷ or parentheses only.');
  // A tiny arithmetic evaluator: tokenize and apply operator precedence without eval.
  const tokens = expr.match(/\d+(?:\.\d+)?|[()+*/-]/gu) ?? []; if (tokens.join('') !== expr.replace(/\s+/gu, '')) throw new TypeError('Unsupported SQL expression.');
  let pos = 0; const primary = () => { const token = tokens[pos++]; if (token === '(') { const value = parse(0); if (tokens[pos++] !== ')') throw new TypeError('Check parentheses.'); return value; } if (token === '-') return -primary(); const value = Number(token); if (!Number.isFinite(value)) throw new TypeError('Expected a number.'); return value; };
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const parse = (minimum) => { let left = primary(); while (precedence[tokens[pos]] >= minimum) { const op = tokens[pos++]; const level = precedence[op]; const right = parse(level + 1); left = op === '+' ? left + right : op === '-' ? left - right : op === '*' ? left * right : left / right; } return left; };
  const result = parse(1); if (pos !== tokens.length || !Number.isFinite(result)) throw new TypeError('Invalid expression or division by zero.'); return `${match[2] ?? 'result'}\n${fixed(result)}`;
}
function makeBusinessCard({ name, role, email, phone = '', website = '' }) { const person = String(name ?? '').trim(); if (!person || person.length > 80) throw new TypeError('Enter a name under 80 characters.'); return [person, role, email, phone, website].map((value) => String(value ?? '').trim()).filter(Boolean).join('\n'); }
function inspectHex({ hex }) {
  const text = String(hex ?? '').trim();
  const tokens = text ? text.split(/[\s,]+/u) : [];
  if (!tokens.length || tokens.length > 65536 || tokens.some((item) => !/^(?:0x)?[\da-f]{1,2}$/iu.test(item))) throw new TypeError('Enter 1–65,536 hex bytes separated by spaces or commas.');
  const bytes = tokens.map((item) => Number.parseInt(item.replace(/^0x/iu, ''), 16));
  const lines = [];
  for (let offset = 0; offset < bytes.length; offset += 16) {
    const chunk = bytes.slice(offset, offset + 16);
    const hexColumn = chunk.map((value) => value.toString(16).padStart(2, '0')).join(' ').padEnd(47);
    const textColumn = chunk.map((value) => value >= 32 && value <= 126 ? String.fromCharCode(value) : '.').join('');
    lines.push(`${offset.toString(16).padStart(8, '0')}  ${hexColumn}  ${textColumn}`);
  }
  return lines.join('\n');
}
function chartRows({ csv }) { const rows = String(csv ?? '').split(/\r?\n/u).map((line) => line.split(',').map((cell) => cell.trim())).filter((row) => row.length >= 2 && row[0]); if (rows.length > 1 && !Number.isFinite(Number(rows[0][1]))) rows.shift(); if (rows.length < 2 || rows.length > 60 || rows.some((row) => !row[0] || !Number.isFinite(Number(row[1])))) throw new TypeError('Enter 2–60 label,value CSV lines with a number in the second column.'); return rows.map(([label, value]) => `${label.slice(0, 40)},${number(value, 'chart value')}`).join('\n'); }
function diagramSteps({ steps }) { const rows = String(steps ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean); if (rows.length < 2 || rows.length > 12 || rows.some((line) => line.length > 48)) throw new RangeError('Enter 2–12 short steps (up to 48 characters each).'); return rows.join('\n'); }
function renderLatexSubset({ equation }) { let text = String(equation ?? '').trim(); if (!text || text.length > 240) throw new RangeError('Enter an equation of 1–240 characters.'); if (/\\(?:input|include|write|href|url|html|class|style|def|newcommand|require)\b/iu.test(text)) throw new TypeError('This equation uses an unsupported command.'); text = text.replace(/\\frac\s*\{([^{}]{1,40})\}\s*\{([^{}]{1,40})\}/gu, '($1) / ($2)').replace(/\\sqrt\s*\{([^{}]{1,60})\}/gu, '√($1)').replace(/\\times\b/gu, '×').replace(/\\cdot\b/gu, '·').replace(/\\pi\b/gu, 'π').replace(/\\theta\b/gu, 'θ').replace(/\\alpha\b/gu, 'α').replace(/\\beta\b/gu, 'β').replace(/\\leq\b/gu, '≤').replace(/\\geq\b/gu, '≥').replace(/\\neq\b/gu, '≠').replace(/\^\{([^{}]+)\}/gu, '^($1)').replace(/_\{([^{}]+)\}/gu, '_($1)').replace(/[{}]/gu, '').replace(/\\[A-Za-z]+/gu, '?'); return text; }

export function calculateOpportunity(engine, values, locale = 'en') {
  const handlers = {
    equation: solveEquation,
    'linear-system': solveLinearSystem,
    'factor-quadratic': factorQuadratic,
    probability: calculateProbability,
    'z-score': calculateZScore,
    coordinate: calculateCoordinateGeometry,
    'long-division': longDivision,
    rounding: roundNumber,
    tax: calculateTax,
    commission: calculateCommission,
    'credit-payoff': calculateCreditPayoff,
    'unit-price': compareUnitPrices,
    concrete: calculateConcrete,
    tiles: calculateTiles,
    receipt: (input) => createDocument(input, 'receipt'),
    quotation: (input) => createDocument(input, 'quotation'),
    morse: translateMorse,
    combinatorics: calculateCombinatorics,
    distribution: calculateDistribution,
    'mean-ci': calculateMeanConfidenceInterval,
    'sample-size': calculateSampleSize,
    regression: calculateLinearRegression,
    'triangle-sss': solveTriangleSSS,
    'solid-volume': calculateSolidVolume,
    sequence: calculateSequence,
    'break-even': calculateBreakEven,
    'roi-cagr': calculateRoiCagr,
    depreciation: calculateDepreciation,
    'dimensional-weight': calculateDimensionalWeight,
    paint: calculatePaint,
    'board-foot': calculateBoardFeet,
    'recipe-scale': scaleRecipe,
    iban: validateIban,
    utm: buildUtmUrl,
    robots: buildRobotsTxt,
    'sitemap-xml': buildSitemapXml,
    jsonld: buildJsonLd,
    'meta-tags': buildMetaTags,
    contrast: calculateColorContrast,
    'color-palette': generateColorPalette,
    'css-gradient': generateCssGradient,
    'css-shadow': generateCssShadow,
    'css-layout': generateCssLayout,
    'polynomial-derivative': differentiatePolynomial,
    'polynomial-integral': integratePolynomial,
    matrix: calculateMatrix,
    'truth-table': buildTruthTable,
    'statistical-test': calculateStatisticalTest,
    cashflows: calculateCashFlows,
    'debt-payoff': calculateDebtPayoff,
    'rent-vs-buy': calculateRentVsBuy,
    citation: createCitation,
    'json-schema': validateJsonSchema,
    jsonpath: queryJsonPath,
    calendar: makePrintableCalendar,
    flashcards: makeFlashcards,
    'word-search': (input) => makeWordSearch({ ...input, locale }),
    bingo: makeBingoCard,
    bmi: calculateAdultBmi,
    'bmr-tdee': calculateBmrTdee,
    macros: calculateMacros,
    'running-pace': calculateRunningPace,
    'one-rep-max': estimateOneRepMax,
    'cover-letter': buildCoverLetter,
    'test-data': generateTestData,
    'math-worksheet': generateMathWorksheet,
    'function-graph': plotPolynomial,
    'html-format': (input) => simpleFormatter(input, 'html'),
    'css-format': (input) => simpleFormatter(input, 'css'),
    'javascript-format': (input) => simpleFormatter(input, 'javascript'),
    'cron-builder': cronExpression,
    'body-fat': estimateBodyFat,
    'due-date': estimateDueDate,
    'cycle-calendar': estimateCycle,
    'ascii-art': makeAscii,
    'chord-finder': findChord,
    crossword: (input) => makeCrossword({ ...input, locale }),
    'svg-optimizer': optimizeSvg,
    'sqlite-playground': simpleSql,
    'business-card': makeBusinessCard,
    'hex-editor': inspectHex,
    'chart-maker': chartRows,
    'diagram-maker': diagramSteps,
    'latex-renderer': renderLatexSubset,
    'code-playground': () => 'Preview updated in the isolated frame.',
  };
  const handler = handlers[engine];
  if (!handler) throw new TypeError(`No local calculation handler exists for ${engine}.`);
  return handler(values);
}
