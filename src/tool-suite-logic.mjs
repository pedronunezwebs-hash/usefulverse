const MAX_FINITE = Number.MAX_VALUE;

function finiteNonNegative(value, label) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) throw new RangeError(`${label} must be a finite number greater than or equal to zero.`);
  return amount;
}

export function calculateLoan(principalValue, annualRateValue, yearsValue, extraPaymentValue = 0) {
  const principal = finiteNonNegative(principalValue, 'Loan amount');
  const annualRate = finiteNonNegative(annualRateValue, 'Annual interest rate');
  const years = Number(yearsValue);
  const extraPayment = finiteNonNegative(extraPaymentValue, 'Extra monthly payment');
  if (principal <= 0) throw new RangeError('Loan amount must be greater than zero.');
  if (!Number.isFinite(years) || years <= 0 || years > 50) throw new RangeError('Choose a loan term from 0.01 to 50 years.');
  if (annualRate > 100) throw new RangeError('Annual interest rate must be 100% or less.');
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualRate / 1200;
  const scheduledPayment = monthlyRate === 0
    ? principal / months
    : principal * monthlyRate / (1 - (1 + monthlyRate) ** -months);
  if (!Number.isFinite(scheduledPayment)) throw new RangeError('These loan values are too large to calculate.');

  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  let payoffMonths = 0;
  const schedule = [];
  for (let month = 1; month <= months && balance > 0; month += 1) {
    const interest = balance * monthlyRate;
    const payment = Math.min(balance + interest, scheduledPayment + extraPayment);
    const principalPaid = payment - interest;
    if (principalPaid <= 0) throw new RangeError('The payment does not cover the monthly interest.');
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    totalPaid += payment;
    payoffMonths = month;
    if (month <= 12 || month === months || balance === 0) schedule.push({ month, payment, principal: principalPaid, interest, balance });
  }
  return { principal, annualRate, years, months: payoffMonths, scheduledPayment, actualPayment: scheduledPayment + extraPayment, totalPaid, totalInterest, schedule };
}

export function calculateCompoundInterest({ initial = 0, contribution = 0, annualRate = 0, years = 1, compoundsPerYear = 12, contributeAtStart = false } = {}) {
  const start = finiteNonNegative(initial, 'Starting balance');
  const deposit = finiteNonNegative(contribution, 'Monthly contribution');
  const rate = finiteNonNegative(annualRate, 'Annual interest rate');
  const term = Number(years);
  const frequency = Number(compoundsPerYear);
  if (!Number.isFinite(term) || term <= 0 || term > 100) throw new RangeError('Choose a time period from 0.01 to 100 years.');
  if (rate > 1000) throw new RangeError('Annual interest rate must be 1,000% or less.');
  if (![1, 2, 4, 12, 365].includes(frequency)) throw new RangeError('Choose annual, semiannual, quarterly, monthly or daily compounding.');
  const totalMonths = Math.round(term * 12);
  if (totalMonths < 1 || totalMonths > 1200) throw new RangeError('The calculation must include between 1 and 1,200 months.');
  const periodicRate = rate === 0 ? 0 : (1 + rate / 100 / frequency) ** (frequency / 12) - 1;
  let balance = start;
  for (let month = 0; month < totalMonths; month += 1) {
    if (contributeAtStart) balance += deposit;
    balance *= 1 + periodicRate;
    if (!contributeAtStart) balance += deposit;
    if (!Number.isFinite(balance) || balance > MAX_FINITE) throw new RangeError('These values are too large to calculate.');
  }
  const contributions = start + deposit * totalMonths;
  return { finalBalance: balance, contributions, interestEarned: balance - contributions, initial: start, monthlyContribution: deposit, totalMonths, annualRate: rate, years: totalMonths / 12, compoundsPerYear: frequency, contributeAtStart: Boolean(contributeAtStart) };
}

const scientificFunctions = Object.freeze({
  sin: (x, degrees) => Math.sin(degrees ? x * Math.PI / 180 : x),
  cos: (x, degrees) => Math.cos(degrees ? x * Math.PI / 180 : x),
  tan: (x, degrees) => Math.tan(degrees ? x * Math.PI / 180 : x),
  asin: (x, degrees) => degrees ? Math.asin(x) * 180 / Math.PI : Math.asin(x),
  acos: (x, degrees) => degrees ? Math.acos(x) * 180 / Math.PI : Math.acos(x),
  atan: (x, degrees) => degrees ? Math.atan(x) * 180 / Math.PI : Math.atan(x),
  sqrt: (x) => Math.sqrt(x),
  log: (x) => Math.log10(x),
  ln: (x) => Math.log(x),
  abs: (x) => Math.abs(x),
  exp: (x) => Math.exp(x),
  floor: (x) => Math.floor(x),
  ceil: (x) => Math.ceil(x),
  round: (x) => Math.round(x),
});

export function evaluateScientificExpression(source, angleMode = 'degrees') {
  const text = String(source).replace(/π/gu, 'pi').replace(/[×·]/gu, '*').replace(/[÷]/gu, '/').replace(/[−–]/gu, '-').trim();
  if (!text || text.length > 240) throw new SyntaxError('Enter an expression of 1 to 240 characters.');
  if (!['degrees', 'radians'].includes(angleMode)) throw new TypeError('Choose degrees or radians.');
  const pattern = /\s*(?:(\d+(?:\.\d*)?|\.\d+)(?:e([+-]?\d+))?|([A-Za-z]+)|(.))/iy;
  const tokens = [];
  for (let cursor = 0; cursor < text.length;) {
    pattern.lastIndex = cursor;
    const match = pattern.exec(text);
    if (!match || match.index !== cursor) throw new SyntaxError('Use numbers, operators, parentheses and known functions only.');
    cursor = pattern.lastIndex;
    if (!match[0].trim()) continue;
    if (match[1] !== undefined) tokens.push({ type: 'number', value: Number(`${match[1]}${match[2] ? `e${match[2]}` : ''}`) });
    else if (match[3]) tokens.push({ type: 'name', value: match[3].toLowerCase() });
    else if ('+-*/^()%'.includes(match[4])) tokens.push({ type: match[4], value: match[4] });
    else throw new SyntaxError(`Unsupported character: ${match[4]}`);
    if (tokens.length > 120) throw new RangeError('This expression has too many parts.');
  }
  let position = 0;
  let depth = 0;
  const peek = () => tokens[position];
  const take = (type) => { if (peek()?.type !== type) throw new SyntaxError('Check the parentheses and operators.'); return tokens[position++]; };
  const guard = (value) => { if (!Number.isFinite(value)) throw new RangeError('The result is not a finite real number.'); return value; };
  function primary() {
    depth += 1;
    if (depth > 40) throw new RangeError('The expression is nested too deeply.');
    const token = peek();
    let result;
    if (token?.type === 'number') { position += 1; result = token.value; }
    else if (token?.type === '(') { position += 1; result = expression(); take(')'); }
    else if (token?.type === 'name') {
      position += 1;
      if (token.value === 'pi') result = Math.PI;
      else if (token.value === 'e') result = Math.E;
      else {
        const fn = scientificFunctions[token.value];
        if (!fn) throw new SyntaxError(`Unknown constant or function: ${token.value}`);
        take('(');
        const argument = expression();
        take(')');
        result = fn(argument, angleMode === 'degrees');
      }
    } else throw new SyntaxError('Enter a number or a parenthesized expression.');
    while (peek()?.type === '%') { position += 1; result /= 100; }
    depth -= 1;
    return guard(result);
  }
  function unary() {
    if (peek()?.type === '+' || peek()?.type === '-') {
      const operator = tokens[position++].type;
      const value = unary();
      return guard(operator === '-' ? -value : value);
    }
    return power();
  }
  function power() {
    const base = primary();
    if (peek()?.type !== '^') return base;
    position += 1;
    return guard(base ** unary());
  }
  function product() {
    let value = unary();
    while (peek()?.type === '*' || peek()?.type === '/') {
      const operator = tokens[position++].type;
      const right = unary();
      if (operator === '/' && right === 0) throw new RangeError('Cannot divide by zero.');
      value = guard(operator === '*' ? value * right : value / right);
    }
    return value;
  }
  function expression() {
    let value = product();
    while (peek()?.type === '+' || peek()?.type === '-') {
      const operator = tokens[position++].type;
      const right = product();
      value = guard(operator === '+' ? value + right : value - right);
    }
    return value;
  }
  const result = expression();
  if (position !== tokens.length) throw new SyntaxError('Check for a missing operator or extra character.');
  return result;
}

export function inspectZipArchive(bytes, { maxFiles = 200, maxExpandedBytes = 100 * 1024 * 1024, maxFileBytes = 100 * 1024 * 1024 } = {}) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (data.length < 22) throw new TypeError('This does not look like a ZIP archive.');
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const eocdMin = Math.max(0, data.length - 65_557);
  let eocd = -1;
  for (let offset = data.length - 22; offset >= eocdMin; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) { eocd = offset; break; }
  }
  if (eocd < 0) throw new TypeError('The ZIP directory is missing or damaged.');
  const disk = view.getUint16(eocd + 4, true);
  const centralDisk = view.getUint16(eocd + 6, true);
  const entries = view.getUint16(eocd + 10, true);
  const centralSize = view.getUint32(eocd + 12, true);
  let offset = view.getUint32(eocd + 16, true);
  if (disk !== 0 || centralDisk !== 0 || entries !== view.getUint16(eocd + 8, true)) throw new TypeError('Multi-disk ZIP archives are not supported.');
  if (entries === 0xffff || centralSize === 0xffffffff || offset === 0xffffffff) throw new RangeError('ZIP64 archives are not supported in this browser tool.');
  if (entries > maxFiles) throw new RangeError(`Choose a ZIP with no more than ${maxFiles} files.`);
  if (offset + centralSize > eocd || centralSize > data.length) throw new TypeError('The ZIP directory is invalid.');
  const files = [];
  let expandedBytes = 0;
  for (let index = 0; index < entries; index += 1) {
    if (offset + 46 > data.length || view.getUint32(offset, true) !== 0x02014b50) throw new TypeError('The ZIP directory is damaged.');
    const flags = view.getUint16(offset + 8, true);
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const expandedSize = view.getUint32(offset + 24, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const end = offset + 46 + nameLength + extraLength + commentLength;
    if (end > data.length) throw new TypeError('The ZIP directory is truncated.');
    if (flags & 1) throw new TypeError('Password-protected ZIP files are not supported.');
    if (![0, 8].includes(method)) throw new TypeError('This ZIP uses a compression method that this browser does not support.');
    if (expandedSize === 0xffffffff || compressedSize === 0xffffffff || localOffset === 0xffffffff) throw new RangeError('ZIP64 archives are not supported in this browser tool.');
    if (expandedSize > maxFileBytes) throw new RangeError(`Each extracted file must be ${Math.round(maxFileBytes / 1024 / 1024)} MB or smaller.`);
    const name = new TextDecoder('utf-8').decode(data.subarray(offset + 46, offset + 46 + nameLength));
    const normalized = name.replaceAll('\\', '/');
    if (normalized.startsWith('/') || /^[A-Za-z]:/u.test(normalized) || normalized.split('/').includes('..')) throw new TypeError('This ZIP contains an unsafe file path.');
    expandedBytes += expandedSize;
    if (expandedBytes > maxExpandedBytes) throw new RangeError(`The uncompressed ZIP must be ${Math.round(maxExpandedBytes / 1024 / 1024)} MB or smaller.`);
    files.push({ name, compressedSize, expandedSize, method, directory: normalized.endsWith('/') });
    offset = end;
  }
  return { files, expandedBytes, entryCount: files.length };
}
