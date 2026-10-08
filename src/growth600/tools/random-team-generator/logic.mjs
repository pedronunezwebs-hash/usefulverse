const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 60;
const MAX_TEAMS = 12;
const MAX_SEPARATIONS = 200;
const DEFAULT_SEARCH_BUDGET = 250_000;

export class RandomTeamInputError extends RangeError {
  constructor(code) {
    super(code);
    this.name = 'RandomTeamInputError';
    this.code = code;
  }
}

function normalizedName(value) {
  return value.trim().toLocaleLowerCase();
}

export function parseParticipantNames(raw) {
  if (typeof raw !== 'string') throw new RandomTeamInputError('invalid-names');
  const names = raw.split(/\r?\n/u).map((name) => name.trim()).filter(Boolean);
  if (names.length < MIN_PARTICIPANTS || names.length > MAX_PARTICIPANTS) throw new RandomTeamInputError('invalid-count');
  if (names.some((name) => name.length > 80 || /[\u0000-\u001f\u007f]/u.test(name) || name.includes('|'))) {
    throw new RandomTeamInputError('invalid-name');
  }
  if (new Set(names.map(normalizedName)).size !== names.length) throw new RandomTeamInputError('duplicate-name');
  return names;
}

export function parseSeparationPairs(raw, names) {
  if (typeof raw !== 'string' || !Array.isArray(names)) throw new RandomTeamInputError('invalid-pairs');
  const lines = raw.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length > MAX_SEPARATIONS) throw new RandomTeamInputError('too-many-pairs');
  const indexes = new Map(names.map((name, index) => [normalizedName(name), index]));
  const seen = new Set();
  return lines.map((line) => {
    const pair = line.split('|').map((name) => name.trim());
    if (pair.length !== 2 || pair.some((name) => !name)) throw new RandomTeamInputError('invalid-pair-format');
    const [first, second] = pair.map((name) => indexes.get(normalizedName(name)));
    if (first === undefined || second === undefined) throw new RandomTeamInputError('unknown-pair-name');
    if (first === second) throw new RandomTeamInputError('self-pair');
    const key = first < second ? `${first}:${second}` : `${second}:${first}`;
    if (seen.has(key)) throw new RandomTeamInputError('duplicate-pair');
    seen.add(key);
    return [first, second];
  });
}

export function createRandomTeamSeed(cryptoApi = globalThis.crypto) {
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') throw new Error('secure-random-unavailable');
  const word = new Uint32Array(4);
  cryptoApi.getRandomValues(word);
  return [...word].map((value) => value.toString(16).padStart(8, '0')).join('');
}

function seededRandom(seed) {
  let h1 = 1779033703; let h2 = 3144134277; let h3 = 1013904242; let h4 = 2773480762;
  for (const character of seed) {
    const code = character.codePointAt(0);
    h1 = h2 ^ Math.imul(h1 ^ code, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ code, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ code, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ code, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= h2 ^ h3 ^ h4; h2 ^= h1; h3 ^= h1; h4 ^= h1;
  if ((h1 | h2 | h3 | h4) === 0) h4 = 1;
  return () => {
    const output = (h1 + h2 + h4) >>> 0;
    h4 = (h4 + 1) >>> 0;
    h1 = h2 ^ (h2 >>> 9);
    h2 = (h3 + (h3 << 3)) >>> 0;
    h3 = (h3 << 21) | (h3 >>> 11);
    h3 = (h3 + output) >>> 0;
    return output / 0x1_0000_0000;
  };
}

function shuffle(items, random) {
  const result = items.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function validateInputs(names, teamCount, separationPairs, seed, maxSearchSteps) {
  if (!Array.isArray(names) || names.length < MIN_PARTICIPANTS || names.length > MAX_PARTICIPANTS) throw new RandomTeamInputError('invalid-count');
  const cleanNames = names.map((name) => typeof name === 'string' ? name.trim() : '');
  if (cleanNames.some((name) => !name || name.length > 80 || /[\u0000-\u001f\u007f]/u.test(name) || name.includes('|'))) throw new RandomTeamInputError('invalid-name');
  const normalized = cleanNames.map(normalizedName);
  if (new Set(normalized).size !== cleanNames.length) throw new RandomTeamInputError('duplicate-name');
  if (!Number.isInteger(teamCount) || teamCount < 2 || teamCount > MAX_TEAMS || teamCount > names.length) throw new RandomTeamInputError('invalid-team-count');
  if (!Array.isArray(separationPairs) || separationPairs.length > MAX_SEPARATIONS) throw new RandomTeamInputError('too-many-pairs');
  if (typeof seed !== 'string' || !seed.trim() || seed.length > 80 || /[\u0000-\u001f\u007f]/u.test(seed)) throw new RandomTeamInputError('invalid-seed');
  if (!Number.isSafeInteger(maxSearchSteps) || maxSearchSteps < 1 || maxSearchSteps > 2_000_000) throw new RandomTeamInputError('invalid-search-budget');

  const nameIndexes = new Map(normalized.map((name, index) => [name, index]));
  const conflictSets = Array.from({ length: cleanNames.length }, () => new Set());
  const seen = new Set();
  for (const pair of separationPairs) {
    if (!Array.isArray(pair) || pair.length !== 2) throw new RandomTeamInputError('invalid-pair-format');
    const indexes = pair.map((value) => {
      if (Number.isInteger(value) && value >= 0 && value < cleanNames.length) return value;
      if (typeof value === 'string') return nameIndexes.get(normalizedName(value));
      return undefined;
    });
    const [first, second] = indexes;
    if (first === undefined || second === undefined) throw new RandomTeamInputError('unknown-pair-name');
    if (first === second) throw new RandomTeamInputError('self-pair');
    const key = first < second ? `${first}:${second}` : `${second}:${first}`;
    if (seen.has(key)) throw new RandomTeamInputError('duplicate-pair');
    seen.add(key);
    conflictSets[first].add(second);
    conflictSets[second].add(first);
  }
  return { names: cleanNames, conflictSets, seed: seed.trim() };
}

export function createRandomTeams({ names, teamCount, separationPairs = [], seed, maxSearchSteps = DEFAULT_SEARCH_BUDGET } = {}) {
  const input = validateInputs(names, teamCount, separationPairs, seed, maxSearchSteps);
  const random = seededRandom(input.seed);
  const teamIndexes = shuffle(Array.from({ length: teamCount }, (_, index) => index), random);
  const baseSize = Math.floor(input.names.length / teamCount);
  const remainder = input.names.length % teamCount;
  const capacities = Array(teamCount).fill(baseSize);
  teamIndexes.slice(0, remainder).forEach((index) => { capacities[index] += 1; });

  if (input.conflictSets.every((set) => set.size === 0)) {
    const shuffled = shuffle(input.names.map((_, index) => index), random);
    const teams = capacities.map((_, team) => ({ id: team, members: [] }));
    let cursor = 0;
    for (const team of teams) {
      for (let count = 0; count < capacities[team.id]; count += 1) team.members.push(input.names[shuffled[cursor++]]);
    }
    return { ok: true, seed: input.seed, teams, searchSteps: 0 };
  }

  const assigned = Array(input.names.length).fill(-1);
  const sizes = Array(teamCount).fill(0);
  let searchSteps = 0;
  let hitBudget = false;

  function availableTeams(person) {
    const result = [];
    for (let team = 0; team < teamCount; team += 1) {
      if (sizes[team] >= capacities[team]) continue;
      let conflict = false;
      for (const neighbor of input.conflictSets[person]) {
        if (assigned[neighbor] === team) { conflict = true; break; }
      }
      if (!conflict) result.push(team);
    }
    return result;
  }

  function search(remaining) {
    searchSteps += 1;
    if (searchSteps > maxSearchSteps) { hitBudget = true; return false; }
    if (remaining === 0) return true;

    let chosen = -1;
    let chosenOptions = null;
    let chosenSaturation = -1;
    let chosenDegree = -1;
    for (let person = 0; person < input.names.length; person += 1) {
      if (assigned[person] !== -1) continue;
      const options = availableTeams(person);
      if (options.length === 0) return false;
      const neighborTeams = new Set([...input.conflictSets[person]].map((neighbor) => assigned[neighbor]).filter((team) => team !== -1));
      const saturation = neighborTeams.size;
      const degree = input.conflictSets[person].size;
      if (chosen === -1 || options.length < chosenOptions.length
        || (options.length === chosenOptions.length && saturation > chosenSaturation)
        || (options.length === chosenOptions.length && saturation === chosenSaturation && degree > chosenDegree)
        || (options.length === chosenOptions.length && saturation === chosenSaturation && degree === chosenDegree && random() < 0.5)) {
        chosen = person;
        chosenOptions = options;
        chosenSaturation = saturation;
        chosenDegree = degree;
      }
    }

    const orderedTeams = shuffle(chosenOptions, random).sort((left, right) => (capacities[right] - sizes[right]) - (capacities[left] - sizes[left]));
    for (const team of orderedTeams) {
      assigned[chosen] = team;
      sizes[team] += 1;
      if (search(remaining - 1)) return true;
      assigned[chosen] = -1;
      sizes[team] -= 1;
      if (hitBudget) return false;
    }
    return false;
  }

  const solved = search(input.names.length);
  if (!solved) return { ok: false, reason: hitBudget ? 'search-limit' : 'incompatible', seed: input.seed, searchSteps };
  const teams = capacities.map((_, team) => ({ id: team, members: [] }));
  assigned.forEach((team, person) => teams[team].members.push(input.names[person]));
  return { ok: true, seed: input.seed, teams, searchSteps };
}

function csvCell(value) {
  const text = String(value);
  const safe = /^[\s]*[=+\-@]/u.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function serializeRandomTeamsCsv(draw, labels) {
  if (!draw?.ok || !Array.isArray(draw.teams) || !labels?.team || !labels?.participant || !labels?.seedLabel) {
    throw new TypeError('A generated draw and localized CSV labels are required.');
  }
  const rows = [[labels.team, labels.participant, labels.seedLabel]];
  draw.teams.forEach((team, index) => {
    if (!Array.isArray(team.members)) throw new TypeError('Every team must contain a member list.');
    team.members.forEach((name) => rows.push([`${labels.team} ${index + 1}`, name, draw.seed]));
  });
  return `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
}
