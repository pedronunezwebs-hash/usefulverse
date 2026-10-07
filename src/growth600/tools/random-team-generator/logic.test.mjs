import assert from 'node:assert/strict';
import test from 'node:test';
import { createRandomTeamSeed, createRandomTeams, parseParticipantNames, parseSeparationPairs, serializeRandomTeamsCsv } from './logic.mjs';

test('names are trimmed, bounded and unique without regard to letter case', () => {
  assert.deepEqual(parseParticipantNames('  Alex \nSam\n\nJo '), ['Alex', 'Sam', 'Jo']);
  assert.throws(() => parseParticipantNames('Alex\nalex'), { code: 'duplicate-name' });
  assert.throws(() => parseParticipantNames('Only one'), { code: 'invalid-count' });
  assert.throws(() => parseParticipantNames('Alex | Sam\nJo'), { code: 'invalid-name' });
});

test('keep-apart rules are parsed symmetrically and reject malformed or unknown names', () => {
  const names = ['Alex', 'Sam', 'Jo'];
  assert.deepEqual(parseSeparationPairs('Alex | Sam\nJo | Sam', names), [[0, 1], [2, 1]]);
  assert.throws(() => parseSeparationPairs('Alex | Not listed', names), { code: 'unknown-pair-name' });
  assert.throws(() => parseSeparationPairs('Alex | Alex', names), { code: 'self-pair' });
  assert.throws(() => parseSeparationPairs('Alex | Sam\nSam | Alex', names), { code: 'duplicate-pair' });
});

test('seeded draws are reproducible, balanced and assign each participant exactly once', () => {
  const input = { names: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], teamCount: 3, separationPairs: [[0, 1], [2, 3]], seed: 'same-seed' };
  const first = createRandomTeams(input);
  const second = createRandomTeams(input);
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  const members = first.teams.flatMap(({ members: team }) => team);
  assert.deepEqual([...members].sort(), [...input.names].sort());
  assert.ok(Math.max(...first.teams.map(({ members: team }) => team.length)) - Math.min(...first.teams.map(({ members: team }) => team.length)) <= 1);
  for (const [left, right] of input.separationPairs) {
    const teamOf = (name) => first.teams.findIndex(({ members: team }) => team.includes(name));
    assert.notEqual(teamOf(input.names[left]), teamOf(input.names[right]));
  }
});

test('team sizes and one-time assignment hold across a broad set of participant and team counts', () => {
  for (let count = 2; count <= 60; count += 1) {
    const names = Array.from({ length: count }, (_, index) => `Person ${index + 1}`);
    const teamCount = Math.min(12, Math.max(2, Math.floor(count / 3)));
    const draw = createRandomTeams({ names, teamCount, seed: `property-${count}` });
    assert.equal(draw.ok, true, `participants=${count}`);
    const assigned = draw.teams.flatMap(({ members }) => members);
    assert.equal(new Set(assigned).size, count, `unique assignments for ${count}`);
    assert.deepEqual([...assigned].sort(), [...names].sort());
    const sizes = draw.teams.map(({ members }) => members.length);
    assert.ok(Math.max(...sizes) - Math.min(...sizes) <= 1, `balanced sizes for ${count}`);
  }
});

test('impossible assignments and search cutoffs are reported honestly', () => {
  const names = ['A', 'B', 'C'];
  const impossible = createRandomTeams({ names, teamCount: 2, separationPairs: [[0, 1], [1, 2], [0, 2]], seed: 'x' });
  assert.equal(impossible.ok, false);
  assert.equal(impossible.reason, 'incompatible');
  const limited = createRandomTeams({ names: ['A', 'B', 'C', 'D'], teamCount: 2, separationPairs: [[0, 1]], seed: 'x', maxSearchSteps: 1 });
  assert.equal(limited.ok, false);
  assert.equal(limited.reason, 'search-limit');
});

test('invalid team counts and weak seed APIs are rejected', () => {
  assert.throws(() => createRandomTeams({ names: ['A', 'B'], teamCount: 1, seed: 'x' }), { code: 'invalid-team-count' });
  assert.throws(() => createRandomTeams({ names: ['A', 'B'], teamCount: 2, seed: '' }), { code: 'invalid-seed' });
  assert.throws(() => createRandomTeamSeed({}), /secure-random-unavailable/u);
  assert.equal(createRandomTeamSeed({ getRandomValues(values) { values.set([1, 2, 3, 4]); return values; } }), '00000001000000020000000300000004');
});

test('CSV uses localized headings, quotes cells, and neutralizes spreadsheet formulas', () => {
  const csv = serializeRandomTeamsCsv({ ok: true, seed: 'abc', teams: [{ members: ['=1+1', 'Alex "Ace"'] }] }, { team: 'Équipe', participant: 'Personne', seedLabel: 'Graine' });
  assert.equal(csv, '\uFEFF"Équipe","Personne","Graine"\r\n"Équipe 1","\'=1+1","abc"\r\n"Équipe 1","Alex ""Ace""","abc"');
  assert.throws(() => serializeRandomTeamsCsv({ ok: false, teams: [] }, { team: 'T', participant: 'P', seedLabel: 'S' }), /generated draw/u);
});
