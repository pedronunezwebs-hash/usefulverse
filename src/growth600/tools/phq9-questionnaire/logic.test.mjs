import assert from 'node:assert/strict';
import test from 'node:test';
import { scorePhq9, validateDifficulty } from './logic.mjs';

test('scores all nine responses and uses the official severity cutpoints', () => {
  for (const [total,severity] of [[0,'minimal'],[4,'minimal'],[5,'mild'],[9,'mild'],[10,'moderate'],[14,'moderate'],[15,'moderately-severe'],[19,'moderately-severe'],[20,'severe'],[27,'severe']]) {
    const answers = Array(9).fill(0); let remaining = total;
    for (let i=0;i<9 && remaining;i+=1) { answers[i]=Math.min(3,remaining); remaining-=answers[i]; }
    assert.deepEqual(scorePhq9(answers), { total, severity, selfHarmItemPositive: answers[8] > 0 });
  }
});

test('a positive response to item nine is flagged separately at every total score', () => {
  assert.equal(scorePhq9([0,0,0,0,0,0,0,0,1]).selfHarmItemPositive, true);
  assert.equal(scorePhq9([0,0,0,0,0,0,0,0,0]).selfHarmItemPositive, false);
});

test('rejects unanswered and out-of-range items and validates the impairment answer', () => {
  assert.throws(() => scorePhq9(Array(8).fill(0)), /incomplete/u);
  assert.throws(() => scorePhq9([0,0,0,0,0,0,0,0,4]), /invalid/u);
  assert.throws(() => scorePhq9([0,0,0,0,0,0,0,0,-1]), /invalid/u);
  for (let i=0;i<4;i+=1) assert.equal(validateDifficulty(i), i);
  assert.throws(() => validateDifficulty(4), /invalid/u);
});
