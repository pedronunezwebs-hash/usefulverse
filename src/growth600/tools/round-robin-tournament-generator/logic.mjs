export const ROUND_ROBIN_LIMITS = Object.freeze({ participants: 32, nameLength: 48, score: 999 });

export function parseEntrants(input, limits = ROUND_ROBIN_LIMITS) {
  if (typeof input !== 'string') throw new TypeError('Enter one participant per line.');
  const names = input.split(/\r?\n/u).map((name) => name.trim()).filter(Boolean);
  if (names.length < 2) throw new RangeError('Enter at least two participants.');
  if (names.length > limits.participants) throw new RangeError(`Use no more than ${limits.participants} participants.`);
  if (names.some((name) => [...name].length > limits.nameLength)) throw new RangeError(`Each name must be ${limits.nameLength} characters or fewer.`);
  const keys = names.map((name) => name.normalize('NFKC').toLowerCase());
  if (new Set(keys).size !== keys.length) throw new TypeError('Participant names must be unique.');
  return names;
}

function shuffle(values, random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random source must return a value from 0 up to (but not including) 1.');
    const other = Math.floor(sample * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function createRoundRobinSchedule(entrants, { doubleRound = false, randomize = false, random = Math.random } = {}) {
  if (!Array.isArray(entrants) || entrants.some((name) => typeof name !== 'string')) {
    throw new RangeError(`Enter 2 to ${ROUND_ROBIN_LIMITS.participants} valid participants.`);
  }
  const validatedEntrants = parseEntrants(entrants.join('\n'));
  const names = randomize ? shuffle(validatedEntrants, random) : [...validatedEntrants];
  const rotation = [...names];
  if (rotation.length % 2) rotation.push(null);
  const firstLeg = [];
  for (let roundIndex = 0; roundIndex < rotation.length - 1; roundIndex += 1) {
    const matches = [];
    let bye = null;
    for (let pairIndex = 0; pairIndex < rotation.length / 2; pairIndex += 1) {
      const left = rotation[pairIndex];
      const right = rotation[rotation.length - 1 - pairIndex];
      if (left === null || right === null) {
        bye = left ?? right;
        continue;
      }
      const [home, away] = (roundIndex + pairIndex) % 2 ? [right, left] : [left, right];
      matches.push({ id: `l1-r${roundIndex + 1}-m${pairIndex + 1}`, home, away });
    }
    firstLeg.push({ number: roundIndex + 1, leg: 1, matches, bye });
    const last = rotation.pop();
    rotation.splice(1, 0, last);
  }
  const rounds = [...firstLeg];
  if (doubleRound) {
    for (const source of [...firstLeg].reverse()) {
      const number = rounds.length + 1;
      rounds.push({
        number,
        leg: 2,
        bye: source.bye,
        matches: source.matches.map((match, index) => ({ id: `l2-r${number}-m${index + 1}`, home: match.away, away: match.home })),
      });
    }
  }
  return { entrants: names, rounds, doubleRound, matchesPerLeg: names.length * (names.length - 1) / 2 };
}

export function validateScore(value, max = ROUND_ROBIN_LIMITS.score) {
  if (value === '' || value === null || value === undefined) return null;
  if (typeof value === 'string' && !/^\d+$/u.test(value)) throw new RangeError(`Enter a whole-number score from 0 to ${max}.`);
  const score = Number(value);
  if (!Number.isInteger(score) || score < 0 || score > max) throw new RangeError(`Enter a whole-number score from 0 to ${max}.`);
  return score;
}

export function calculateStandings(schedule, scores, { winPoints = 3, drawPoints = 1 } = {}) {
  const table = new Map(schedule.entrants.map((name) => [name, {
    team: name, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0,
  }]));
  for (const round of schedule.rounds) {
    for (const match of round.matches) {
      const score = scores[match.id];
      const homeScore = validateScore(score?.home);
      const awayScore = validateScore(score?.away);
      if (homeScore === null || awayScore === null) continue;
      const home = table.get(match.home);
      const away = table.get(match.away);
      home.played += 1;
      away.played += 1;
      home.goalsFor += homeScore;
      home.goalsAgainst += awayScore;
      away.goalsFor += awayScore;
      away.goalsAgainst += homeScore;
      if (homeScore > awayScore) {
        home.wins += 1;
        away.losses += 1;
        home.points += winPoints;
      } else if (homeScore < awayScore) {
        away.wins += 1;
        home.losses += 1;
        away.points += winPoints;
      } else {
        home.draws += 1;
        away.draws += 1;
        home.points += drawPoints;
        away.points += drawPoints;
      }
    }
  }
  return [...table.values()].map((row) => ({ ...row, goalDifference: row.goalsFor - row.goalsAgainst }))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || b.wins - a.wins || a.team.localeCompare(b.team));
}

export function scheduleToCsv(schedule, scores = {}, labels = {}) {
  const quote = (value) => {
    const text = String(value ?? '');
    const safe = /^[\s]*[=+\-@]/u.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const rows = [[labels.round ?? 'Round', labels.leg ?? 'Leg', labels.home ?? 'Home', labels.homeScore ?? 'Home score', labels.awayScore ?? 'Away score', labels.away ?? 'Away', labels.bye ?? 'Bye']];
  for (const round of schedule.rounds) {
    for (const match of round.matches) {
      const score = scores[match.id] ?? {};
      rows.push([round.number, round.leg, match.home, score.home ?? '', score.away ?? '', match.away, '']);
    }
    if (round.bye) rows.push([round.number, round.leg, '', '', '', '', round.bye]);
  }
  return rows.map((row) => row.map(quote).join(',')).join('\r\n');
}
