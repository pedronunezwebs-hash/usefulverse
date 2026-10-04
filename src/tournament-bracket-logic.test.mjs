import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceTournamentBracketWinner, createTournamentBracket, getTournamentChampion, parseTournamentEntrants } from './tournament-bracket-logic.mjs';

test('single-elimination bracket handles odd entrants and advances byes without exposing an unready match', () => {
  let bracket = createTournamentBracket('A\nB\nC');
  assert.equal(bracket.rounds.length, 2);
  assert.equal(bracket.rounds[0][1].winner, 'C');
  assert.equal(bracket.rounds[1][0].ready[0], false);
  assert.equal(bracket.rounds[1][0].ready[1], true);
  assert.throws(() => advanceTournamentBracketWinner(bracket, 1, 0, 0), /not ready/u);
  bracket = advanceTournamentBracketWinner(bracket, 0, 0, 0);
  assert.deepEqual(bracket.rounds[1][0].players, ['A', 'C']);
  bracket = advanceTournamentBracketWinner(bracket, 1, 0, 1);
  assert.equal(getTournamentChampion(bracket), 'C');
});

test('bracket sizes to a power of two and a 5-player case auto-advances multiple byes correctly', () => {
  const bracket = createTournamentBracket('A\nB\nC\nD\nE');
  assert.deepEqual(bracket.rounds.map((round) => round.length), [4, 2, 1]);
  assert.equal(bracket.rounds[1][1].players[0], 'E');
  assert.equal(bracket.rounds[1][1].ready[0], true);
  assert.equal(bracket.rounds[1][1].ready[1], false);
});

test('entrant parsing rejects duplicates, empty and excessive lists, while shuffle is injectable', () => {
  assert.throws(() => parseTournamentEntrants('Alice\nalice'), /unique/u);
  assert.throws(() => parseTournamentEntrants('Only one'), /2 and 64/u);
  assert.throws(() => parseTournamentEntrants(Array.from({ length: 65 }, (_, i) => `P${i}`).join('\n')), /2 and 64/u);
  assert.deepEqual(createTournamentBracket('A\nB\nC', { shuffle: true }, () => 0).entrants, ['B', 'C', 'A']);
});
