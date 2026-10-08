import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateStandings, createRoundRobinSchedule, parseEntrants, ROUND_ROBIN_LIMITS, scheduleToCsv, validateScore } from './logic.mjs';

test('four entrants produce every single round-robin pairing exactly once', () => {
  const schedule = createRoundRobinSchedule(parseEntrants('A\nB\nC\nD'));
  assert.equal(schedule.rounds.length, 3);
  assert.equal(schedule.rounds.reduce((sum, round) => sum + round.matches.length, 0), 6);
  const pairings = schedule.rounds.flatMap((round) => round.matches.map(({ home, away }) => [home, away].sort().join('|')));
  assert.equal(new Set(pairings).size, 6);
  assert.ok(schedule.rounds.every((round) => round.matches.length === 2 && round.bye === null));
});

test('three entrants receive one match and one bye per round, each bye exactly once', () => {
  const schedule = createRoundRobinSchedule(['A', 'B', 'C']);
  assert.equal(schedule.rounds.length, 3);
  assert.ok(schedule.rounds.every((round) => round.matches.length === 1 && round.bye));
  assert.deepEqual(schedule.rounds.map(({ bye }) => bye).sort(), ['A', 'B', 'C']);
});

test('double round robin reverses every home/away pairing and creates 12 matches for four teams', () => {
  const schedule = createRoundRobinSchedule(['A', 'B', 'C', 'D'], { doubleRound: true });
  assert.equal(schedule.rounds.length, 6);
  assert.equal(schedule.rounds.reduce((sum, round) => sum + round.matches.length, 0), 12);
  const firstLeg = new Set(schedule.rounds.filter((round) => round.leg === 1).flatMap((round) => round.matches.map(({ home, away }) => `${home}>${away}`)));
  const returnLeg = new Set(schedule.rounds.filter((round) => round.leg === 2).flatMap((round) => round.matches.map(({ home, away }) => `${away}>${home}`)));
  assert.deepEqual(returnLeg, firstLeg);
});

test('randomized draw is reproducible with an injected random source and leaves inputs untouched', () => {
  const names = ['A', 'B', 'C', 'D'];
  const first = createRoundRobinSchedule(names, { randomize: true, random: () => 0 });
  const second = createRoundRobinSchedule(names, { randomize: true, random: () => 0 });
  assert.deepEqual(first, second);
  assert.deepEqual(names, ['A', 'B', 'C', 'D']);
  assert.throws(() => createRoundRobinSchedule(names, { randomize: true, random: () => 1 }), /Random source/u);
});

test('entrant parsing trims blank lines and rejects duplicate, too few, too many or long names', () => {
  assert.deepEqual(parseEntrants(' A \n\nB\r\n C '), ['A', 'B', 'C']);
  assert.throws(() => parseEntrants('Club\n club '), /unique/u);
  assert.throws(() => parseEntrants('A'), /at least two/u);
  assert.throws(() => parseEntrants(Array.from({ length: ROUND_ROBIN_LIMITS.participants + 1 }, (_, index) => `T${index}`).join('\n')), /no more than/u);
  assert.throws(() => parseEntrants(`${'x'.repeat(49)}\nB`), /48 characters/u);
  assert.throws(() => createRoundRobinSchedule(['A', ' a ']), /unique/u);
});

test('standings update win, draw, loss, goals and sort by points then goal difference', () => {
  const schedule = createRoundRobinSchedule(['A', 'B', 'C']);
  const scores = {};
  for (const round of schedule.rounds) {
    const match = round.matches[0];
    if ([match.home, match.away].includes('A')) scores[match.id] = { home: '1', away: '1' };
  }
  const table = calculateStandings(schedule, scores);
  assert.equal(table[0].team, 'A');
  assert.equal(table[0].played, 2);
  assert.equal(table[0].draws, 2);
  assert.equal(table[0].points, 2);
  assert.equal(table[0].goalsFor, 2);
  assert.equal(table[0].goalDifference, 0);
  assert.equal(table[1].played, 1);
});

test('standings ignore incomplete results and invalid score values are rejected', () => {
  const schedule = createRoundRobinSchedule(['A', 'B']);
  const match = schedule.rounds[0].matches[0];
  assert.equal(calculateStandings(schedule, { [match.id]: { home: '3', away: '' } })[0].played, 0);
  assert.equal(validateScore('0'), 0);
  assert.equal(validateScore(''), null);
  for (const score of ['-1', '1.5', '1000', 'NaN']) assert.throws(() => validateScore(score), /whole-number/u);
});

test('CSV export localizes column labels, quotes names and includes scores and byes', () => {
  const schedule = createRoundRobinSchedule(['A, Club', '=2+2', 'C']);
  const match = schedule.rounds[0].matches[0];
  const csv = scheduleToCsv(schedule, { [match.id]: { home: 2, away: 1 } }, { round: 'Tour', leg: 'Leg', home: 'Host', homeScore: 'Host score', awayScore: 'Guest score', away: 'Guest', bye: 'Bye' });
  assert.match(csv, /"Tour","Leg","Host","Host score","Guest score","Guest","Bye"/u);
  assert.match(csv, /"A, Club"/u);
  assert.match(csv, /"'=2\+2"/u);
  assert.match(csv, /"2","1"/u);
  assert.equal((csv.match(/\r\n/gu) ?? []).length, 6);
});
