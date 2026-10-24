import test from 'node:test';
import assert from 'node:assert/strict';
import { createCrapsRound, rollCrapsRound, standardPassLineOdds } from './logic.mjs';

const sequence = (...values) => { let i = 0; return () => values[i++]; };

test('craps pass line resolves naturals, craps and a point with practice chips', () => {
  const natural = rollCrapsRound(createCrapsRound(10, 100), sequence(2, 3));
  assert.equal(natural.status, 'won');
  assert.equal(natural.netResult, 10);
  assert.equal(natural.bankroll, 110);
  const loss = rollCrapsRound(createCrapsRound(10, 100), sequence(0, 1));
  assert.equal(loss.status, 'lost');
  assert.equal(loss.netResult, -10);
  const point = rollCrapsRound(createCrapsRound(10, 100), sequence(2, 2));
  assert.equal(point.status, 'point');
  assert.equal(point.point, 6);
  const made = rollCrapsRound(point, sequence(2, 2));
  assert.equal(made.status, 'won');
});

test('craps dont-pass pushes on 12 and exposes theoretical odds that sum consistently', () => {
  const push = rollCrapsRound(createCrapsRound(25, 100, 'dont-pass'), sequence(5, 5));
  assert.equal(push.status, 'push');
  assert.equal(push.netResult, 0);
  assert.equal(push.bankroll, 100);
  const odds = standardPassLineOdds();
  assert.ok(Math.abs(odds.passWinPercent + odds.passLossPercent - 100) < 1e-12);
  assert.ok(Math.abs(odds.pushPercent - 100 / 36) < 1e-12);
  assert.ok(odds.dontPassHouseEdge > 0);
});

test('craps rejects invalid bets, die values and rolls after a round closes', () => {
  assert.throws(() => createCrapsRound(11, 10));
  assert.throws(() => createCrapsRound(1.5, 10));
  assert.throws(() => rollCrapsRound(createCrapsRound(1, 10), () => 6));
  const won = rollCrapsRound(createCrapsRound(1, 10), sequence(2, 3));
  assert.throws(() => rollCrapsRound(won, sequence(0, 0)), { code: 'round-closed' });
});
