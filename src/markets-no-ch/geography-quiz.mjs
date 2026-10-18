export const geographyContinents = Object.freeze(['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']);

export function localizedGeographyContinents(fields = {}) {
  return Object.fromEntries(geographyContinents.map((name) => [name, fields[`continent${name}`] || name]));
}

export function continentGroup(value) {
  if (value === 'North America' || value === 'South America') return 'Americas';
  return geographyContinents.includes(value) ? value : null;
}

function randomIndex(random, length) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a value from 0 up to, but not including, 1.');
  return Math.floor(value * length);
}

function shuffled(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = randomIndex(random, index + 1);
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function makeGeographyQuestion({ features, mode = 'country', scope = 'world', random = Math.random, excludedIds = [], includedIds = [] } = {}) {
  if (!Array.isArray(features)) throw new TypeError('Map features are required.');
  if (!['country', 'flag', 'continent'].includes(mode)) throw new RangeError('Unknown geography quiz mode.');
  if (scope !== 'world' && !geographyContinents.includes(scope)) throw new RangeError('Unknown geography scope.');
  const excluded = new Set(excludedIds);
  const included = includedIds.length ? new Set(includedIds) : null;
  const mapped = features.filter((feature) => feature.iso2 && continentGroup(feature.continent) && (scope === 'world' || continentGroup(feature.continent) === scope));
  const pool = mapped.filter((feature) => !excluded.has(feature.id) && (mode !== 'flag' || feature.continent !== 'Antarctica'));
  const candidates = included ? pool.filter((feature) => included.has(feature.id)) : pool;
  if (pool.length < 4 || !candidates.length) throw new RangeError('At least four answerable map features and one target are required for this mode and scope.');
  const target = candidates[randomIndex(random, candidates.length)];
  const correctValue = mode === 'continent' ? continentGroup(target.continent) : target.id;
  const choices = mode === 'continent'
    ? [...geographyContinents]
    : [target.id, ...shuffled(pool.filter((feature) => feature.id !== target.id), random).slice(0, 3).map((feature) => feature.id)];
  return Object.freeze({ mode, scope, target, correctValue, options: Object.freeze(shuffled(choices, random)) });
}

export function answerGeographyQuestion(question, answer) {
  if (!question || typeof answer !== 'string') return false;
  return question.mode === 'continent' ? answer === question.correctValue : answer === question.target.id;
}

export function flagEmoji(iso2) {
  if (typeof iso2 !== 'string' || !/^[A-Z]{2}$/u.test(iso2) || iso2 === 'AQ') return '';
  return String.fromCodePoint(...[...iso2].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));
}
