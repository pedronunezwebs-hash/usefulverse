import assert from 'node:assert/strict';
import test from 'node:test';
import { createAimSession, finishAimSession, getAimAccuracy, placeAimTarget, recordAimAttempt } from './logic.mjs';

test('aim targets stay inside their measured area, including tiny viewports', () => {
  const target = placeAimTarget({ width: 320, height: 180, diameter: 88, random: () => 0.999 });
  assert.ok(target.x + target.radius <= 320);
  assert.ok(target.y + target.radius <= 180);
  const tiny = placeAimTarget({ width: 28, height: 20, diameter: 88, random: () => 0.5 });
  assert.equal(tiny.x, 14);
  assert.equal(tiny.y, 10);
  assert.ok(tiny.radius <= 10);
});

test('round lengths and target sizes are explicit choices', () => {
  assert.equal(createAimSession({ durationSeconds: 15, diameter: 44 }).durationSeconds, 15);
  assert.throws(() => createAimSession({ durationSeconds: 20 }), /15, 30 or 60/u);
  assert.throws(() => createAimSession({ diameter: 20 }), /supported target sizes/u);
});

test('one click is one scored hit or miss, with local accuracy and a terminal state', () => {
  let session = createAimSession();
  session = recordAimAttempt(session, true);
  session = recordAimAttempt(session, false);
  assert.deepEqual([session.hits, session.misses, getAimAccuracy(session)], [1, 1, 50]);
  const finished = finishAimSession(session);
  assert.equal(finished.status, 'finished');
  assert.equal(recordAimAttempt(finished, true), finished);
});

test('invalid dimensions and randomness are rejected', () => {
  assert.throws(() => placeAimTarget({ width: 0, height: 100, diameter: 40 }), /positive finite/u);
  assert.throws(() => placeAimTarget({ width: 100, height: 100, diameter: 40, random: () => 1 }), /random source/u);
});
