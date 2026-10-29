import assert from 'node:assert/strict';
import test from 'node:test';
import { scoreGad7, validateGad7Difficulty } from './logic.mjs';

test('GAD-7 assigns its published severity ranges and evaluation cutpoint', () => {
  for (const [score, severity, further] of [[0,'minimal',false],[4,'minimal',false],[5,'mild',false],[9,'mild',false],[10,'moderate',true],[14,'moderate',true],[15,'severe',true],[21,'severe',true]]) {
    let left = score;
    const answers = Array.from({ length: 7 }, () => { const answer = Math.min(3, left); left -= answer; return answer; });
    assert.deepEqual(scoreGad7(answers), { total: score, severity, furtherEvaluationCutpointMet: further });
  }
});

test('GAD-7 rejects incomplete and out-of-range answers', () => {
  assert.throws(() => scoreGad7([0,1,2]), /incomplete-answers/u);
  assert.throws(() => scoreGad7([0,1,2,3,0,1,4]), /invalid-answer/u);
  assert.throws(() => scoreGad7([0,1,2,3,0,1,1.5]), /invalid-answer/u);
});

test('GAD-7 difficulty response accepts only its four unscored choices', () => {
  assert.equal(validateGad7Difficulty('3'), 3);
  assert.throws(() => validateGad7Difficulty('4'), /invalid-difficulty/u);
});
