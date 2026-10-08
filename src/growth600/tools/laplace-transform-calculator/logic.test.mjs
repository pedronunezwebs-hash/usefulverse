import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateLaplaceTransform } from './logic.mjs';

test('forward transform handles the acceptance constant and polynomial powers', () => {
  assert.equal(calculateLaplaceTransform('1').result, '1/s');
  assert.equal(calculateLaplaceTransform('2*t^3').result, '12/s^4');
  assert.equal(calculateLaplaceTransform('t^2 + 3').result, '2/s^3 + 3/s');
});

test('forward transform handles exponential shifts and reports the region of convergence', () => {
  const report = calculateLaplaceTransform('exp(-2*t) + 2*t*exp(3*t)');
  assert.deepEqual(report.terms.map(({ expression }) => expression), ['1/(s + 2)', '2/(s - 3)^2']);
  assert.deepEqual(report.terms.map(({ region }) => region), ['Re(s) > -2', 'Re(s) > 3']);
});

test('forward transform handles sine, cosine and exponential modulation', () => {
  assert.equal(calculateLaplaceTransform('cos(3*t) + 2*sin(3*t)').result, 's/(s^2 + 9) + 6/(s^2 + 9)');
  assert.equal(calculateLaplaceTransform('exp(2*t)*cos(4*t)').result, '(s - 2)/((s - 2)^2 + 16)');
  assert.equal(calculateLaplaceTransform('3*exp(-2*t)*cos(0*t)').result, '3/(s + 2)');
  assert.equal(calculateLaplaceTransform('sin(0*t)').result, '0');
});

test('forward parser accepts signed sums but rejects ambiguous and unsupported expressions', () => {
  assert.equal(calculateLaplaceTransform('1 - t').result, '1/s - 1/s^2');
  assert.equal(calculateLaplaceTransform('-2*t').result, '-2/s^2');
  assert.throws(() => calculateLaplaceTransform('t^9'), /limited to 8/u);
  assert.throws(() => calculateLaplaceTransform('sin(t)'), /Unsupported factor/u);
  assert.throws(() => calculateLaplaceTransform('t*sin(2*t)'), /Combine t powers/u);
  assert.throws(() => calculateLaplaceTransform(''), /characters/u);
  assert.throws(() => calculateLaplaceTransform('1+'.repeat(40)), /no more than 12 terms/u);
});

test('inverse transform handles powers, shifted poles and standard sine/cosine fractions', () => {
  const report = calculateLaplaceTransform('1/s\n2/s^3\n3/(s-2)^2\ns/(s^2+9)\n6/(s^2+9)', 'inverse');
  assert.deepEqual(report.terms, ['1', 't^2', '3*exp(2*t)*t', 'cos(3*t)', '2*sin(3*t)']);
  assert.equal(calculateLaplaceTransform('1/(s^2+9)', 'inverse').result, '0.3333333333*sin(3*t)');
});

test('inverse parser rejects unsupported rational forms and invalid powers', () => {
  assert.throws(() => calculateLaplaceTransform('1/(s^2+0)', 'inverse'), /positive finite/u);
  assert.throws(() => calculateLaplaceTransform('1/(s^2+9)^2', 'inverse'), /Unsupported inverse term/u);
  assert.throws(() => calculateLaplaceTransform('1/s^10', 'inverse'), /limited to 9/u);
  assert.throws(() => calculateLaplaceTransform('1/s\n'.repeat(13), 'inverse'), /1–12/u);
  assert.throws(() => calculateLaplaceTransform('1', 'other'), /direction/u);
});
