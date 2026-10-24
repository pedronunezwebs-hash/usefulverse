import test from 'node:test';
import assert from 'node:assert/strict';
import { createCricketMatch, playCricketBall } from './logic.mjs';

test('cricket match bounds overs and freezes initial innings state', () => {
  const match = createCricketMatch({ overs: 2, firstChoice: 'bowl' });
  assert.equal(match.overs, 2);
  assert.equal(match.userBatsFirst, false);
  assert.equal(match.inningsData.length, 2);
  assert.ok(Object.isFrozen(match) && Object.isFrozen(match.inningsData) && match.inningsData.every(Object.isFrozen));
  assert.throws(() => createCricketMatch({ overs: 0 }), RangeError);
  assert.throws(() => createCricketMatch({ overs: 4 }), RangeError);
  assert.throws(() => createCricketMatch({ firstChoice: 'draw' }), RangeError);
});

test('cricket ball records one bounded delivery and rejects unavailable choices', () => {
  const match = createCricketMatch({ overs: 1, firstChoice: 'bat' });
  const next = playCricketBall(match, 'defend');
  assert.equal(match.inningsData[0].balls, 0);
  assert.equal(next.inningsData[0].balls, 1);
  assert.ok(next.inningsData[0].runs >= 0 && next.inningsData[0].runs <= 6);
  assert.ok(next.inningsData[0].wickets <= 1);
  assert.equal(next.lastDelivery.userChoice, 'defend');
  assert.equal(next.innings, 1);
  assert.throws(() => playCricketBall(match, 'pace'), RangeError);
});
