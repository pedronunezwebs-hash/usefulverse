const MAX_ABS_PARAMETER = 1e12;

function finite(value) {
  return Number.isFinite(value) && Math.abs(value) <= MAX_ABS_PARAMETER;
}

function parseRow(line, index) {
  const parts = line.split('|').map((part) => part.trim());
  const name = parts.shift();
  const distribution = (parts.shift() ?? '').toLowerCase();
  if (!name || [...name].length > 48 || /[\u0000-\u001f\u007f]/u.test(name)) throw new RangeError(`Variable ${index}: enter a name of 1–48 printable characters.`);
  if (!['fixed', 'uniform', 'triangular', 'normal'].includes(distribution)) throw new RangeError(`Variable ${index}: choose fixed, uniform, triangular or normal.`);
  const expected = distribution === 'fixed' ? 1 : distribution === 'triangular' ? 3 : 2;
  if (parts.length !== expected || parts.some((part) => part === '' || !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/iu.test(part))) throw new RangeError(`Variable ${index}: enter ${expected} finite parameter${expected === 1 ? '' : 's'} using a dot as the decimal separator.`);
  const parameters = parts.map(Number);
  if (parameters.some((value) => !finite(value))) throw new RangeError(`Variable ${index}: parameters must be finite and within ±1,000,000,000,000.`);
  if (distribution === 'uniform' && parameters[0] > parameters[1]) throw new RangeError(`Variable ${index}: uniform minimum must not exceed maximum.`);
  if (distribution === 'triangular' && !(parameters[0] <= parameters[1] && parameters[1] <= parameters[2])) throw new RangeError(`Variable ${index}: enter minimum ≤ mode ≤ maximum.`);
  if (distribution === 'normal' && parameters[1] < 0) throw new RangeError(`Variable ${index}: standard deviation must be zero or greater.`);
  return Object.freeze({ name, distribution, parameters: Object.freeze(parameters) });
}

export function parseSimulationVariables(input) {
  const lines = String(input ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 1 || lines.length > 10) throw new RangeError('Enter between one and ten variables, one per line.');
  const variables = lines.map(parseRow);
  const keys = variables.map(({ name }) => name.normalize('NFKC').toLocaleLowerCase());
  if (new Set(keys).size !== keys.length) throw new RangeError('Variable names must be unique.');
  return Object.freeze(variables);
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function sample(variable, random, normalCache) {
  const p = variable.parameters;
  if (variable.distribution === 'fixed') return p[0];
  if (variable.distribution === 'uniform') return p[0] + random() * (p[1] - p[0]);
  if (variable.distribution === 'triangular') {
    const [min, mode, max] = p;
    if (min === max) return min;
    const split = (mode - min) / (max - min);
    const u = random();
    return u < split ? min + Math.sqrt(u * (max - min) * (mode - min)) : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
  if (p[1] === 0) return p[0];
  if (normalCache.value !== undefined) { const z = normalCache.value; normalCache.value = undefined; return p[0] + p[1] * z; }
  let u = 0; let v = 0;
  while (u === 0) u = random();
  v = random();
  const radius = Math.sqrt(-2 * Math.log(u));
  normalCache.value = radius * Math.sin(2 * Math.PI * v);
  return p[0] + p[1] * radius * Math.cos(2 * Math.PI * v);
}

function quantile(sorted, probability) {
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position); const fraction = position - lower;
  return sorted[lower] + (sorted[Math.min(lower + 1, sorted.length - 1)] - sorted[lower]) * fraction;
}

export function runMonteCarlo({ variables: input, iterations = 10000, seed = 1 } = {}) {
  const variables = Array.isArray(input) ? input : parseSimulationVariables(input);
  if (variables.length < 1 || variables.length > 10) throw new RangeError('Enter between one and ten variables.');
  if (!Number.isInteger(iterations) || iterations < 100 || iterations > 50000) throw new RangeError('Choose between 100 and 50,000 iterations.');
  if (!Number.isInteger(seed) || seed < 0 || seed > 2147483647) throw new RangeError('Choose an integer seed from 0 to 2,147,483,647.');
  const random = seededRandom(seed); const normalCache = { value: undefined };
  const values = new Array(iterations);
  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    for (const variable of variables) sum += sample(variable, random, normalCache);
    if (!Number.isFinite(sum)) throw new RangeError('The sampled result exceeded the supported numeric range. Reduce the input values.');
    values[i] = sum;
  }
  const sorted = values.slice().sort((a, b) => a - b);
  const mean = values.reduce((sum, value) => sum + value, 0) / iterations;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / iterations;
  const min = sorted[0]; const max = sorted.at(-1); const bins = Array.from({ length: 20 }, (_, index) => ({ from: min + (max - min) * index / 20, to: min + (max - min) * (index + 1) / 20, count: 0 }));
  if (min === max) bins[0].count = iterations;
  else for (const value of values) bins[Math.min(19, Math.floor((value - min) / (max - min) * 20))].count++;
  return Object.freeze({ iterations, seed, variables, mean, standardDeviation: Math.sqrt(variance), min, max, p5: quantile(sorted, 0.05), median: quantile(sorted, 0.5), p95: quantile(sorted, 0.95), bins: Object.freeze(bins.map(Object.freeze)) });
}
