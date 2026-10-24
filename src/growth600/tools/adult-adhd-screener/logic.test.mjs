import assert from 'node:assert/strict';
import test from 'node:test';
import { scoreAsrsV11 } from './logic.mjs';

test('uses the updated published ASRS v1.1 0–24 scoring strata and cutpoint', () => {
  for (const [total,band,screenPositive] of [[0,'low-negative',false],[9,'low-negative',false],[10,'high-negative',false],[13,'high-negative',false],[14,'low-positive',true],[17,'low-positive',true],[18,'high-positive',true],[24,'high-positive',true]]) {
    const answers = Array(6).fill(0); let remaining=total;
    for (let i=0;i<6&&remaining;i+=1) { answers[i]=Math.min(4,remaining); remaining-=answers[i]; }
    assert.deepEqual(scoreAsrsV11(answers),{total,band,screenPositive});
  }
});

test('requires all six items and only accepts the five frequency choices', () => {
  assert.throws(()=>scoreAsrsV11([0,1,2,3,4]),/incomplete/u);
  for(const answer of [-1,5,1.5]) assert.throws(()=>scoreAsrsV11([0,0,0,0,0,answer]),/invalid/u);
});
