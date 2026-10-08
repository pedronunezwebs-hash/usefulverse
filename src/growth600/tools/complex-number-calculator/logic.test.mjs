import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateComplexOperation as calculate } from './logic.mjs';

const close = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);

test('complex acceptance: i × i = −1 + 0i', () => {
  const result = calculate({ operation: 'multiply', realA: 0, imaginaryA: 1, realB: 0, imaginaryB: 1 });
  close(result.result.real, -1);
  close(result.result.imaginary, 0);
  close(result.result.modulus, 1);
  close(result.result.argument, 180);
});

test('addition, subtraction and multiplication use rectangular components', () => {
  const sum = calculate({ operation: 'add', realA: 3, imaginaryA: 2, realB: 1, imaginaryB: -4 }).result;
  assert.deepEqual([sum.real, sum.imaginary], [4, -2]);
  const difference = calculate({ operation: 'subtract', realA: 3, imaginaryA: 2, realB: 1, imaginaryB: -4 }).result;
  assert.deepEqual([difference.real, difference.imaginary], [2, 6]);
  const product = calculate({ operation: 'multiply', realA: 3, imaginaryA: 2, realB: 1, imaginaryB: -4 }).result;
  assert.deepEqual([product.real, product.imaginary], [11, -10]);
});

test('division uses a stable ratio form and rejects only a zero denominator', () => {
  const result = calculate({ operation: 'divide', realA: 1, imaginaryA: 2, realB: 3, imaginaryB: 4 }).result;
  close(result.real, 0.44);
  close(result.imaginary, 0.08);
  const tiny = calculate({ operation: 'divide', realA: 1e-200, imaginaryA: 1e-200, realB: 1e-200, imaginaryB: 0 }).result;
  close(tiny.real, 1);
  close(tiny.imaginary, 1);
  assert.throws(() => calculate({ operation: 'divide', realA: 1, imaginaryA: 1, realB: 0, imaginaryB: 0 }), (error) => error.code === 'divisionByZero');
});

test('rectangular and polar conversion round-trip in both angle units', () => {
  const polar = calculate({ operation: 'rectangularToPolar', realA: -3, imaginaryA: 4, angleUnit: 'degrees' }).value;
  close(polar.radius, 5);
  close(polar.angle, 126.86989764584402);
  const rectangular = calculate({ operation: 'polarToRectangular', radius: 5, angle: polar.angle, angleUnit: 'degrees' }).result;
  close(rectangular.real, -3);
  close(rectangular.imaginary, 4);
  const radians = calculate({ operation: 'rectangularToPolar', realA: 0, imaginaryA: 1, angleUnit: 'radians' }).value;
  close(radians.angle, Math.PI / 2);
});

test('argument uses the principal branch and is undefined at zero', () => {
  assert.equal(calculate({ operation: 'argument', realA: -2, imaginaryA: -0 }).value, 180);
  close(calculate({ operation: 'argument', realA: 0, imaginaryA: 1, angleUnit: 'radians' }).value, Math.PI / 2);
  assert.throws(() => calculate({ operation: 'argument', realA: 0, imaginaryA: 0 }), (error) => error.code === 'zeroArgument');
  const zeroPolar = calculate({ operation: 'rectangularToPolar', realA: 0, imaginaryA: 0 }).value;
  assert.deepEqual(zeroPolar, { radius: 0, angle: null, angleUnit: 'degrees' });
});

test('nth roots return every distinct root, including the zero root repeated by the degree', () => {
  const squareRoots = calculate({ operation: 'roots', realA: -1, imaginaryA: 0, degree: 2 }).roots;
  assert.equal(squareRoots.length, 2);
  close(squareRoots[0].real, 0);
  close(squareRoots[0].imaginary, 1);
  close(squareRoots[1].imaginary, -1);
  const cubeRoots = calculate({ operation: 'roots', realA: 1, imaginaryA: 0, degree: 3 }).roots;
  assert.equal(cubeRoots.length, 3);
  for (const root of cubeRoots) {
    const cubed = calculate({ operation: 'multiply', realA: root.real, imaginaryA: root.imaginary, realB: root.real, imaginaryB: root.imaginary }).result;
    const third = calculate({ operation: 'multiply', realA: cubed.real, imaginaryA: cubed.imaginary, realB: root.real, imaginaryB: root.imaginary }).result;
    close(third.real, 1);
    close(third.imaginary, 0);
  }
  assert.deepEqual(calculate({ operation: 'roots', realA: 0, imaginaryA: 0, degree: 4 }).roots.map(({ modulus }) => modulus), [0, 0, 0, 0]);
});

test('input limits, invalid operations, radius, angle units and root degrees have explicit errors', () => {
  const cases = [
    [{ operation: 'add', realA: '', imaginaryA: 0, realB: 1, imaginaryB: 1 }, 'missingValue'],
    [{ operation: 'add', realA: 'NaN', imaginaryA: 0, realB: 1, imaginaryB: 1 }, 'componentOutOfRange'],
    [{ operation: 'add', realA: 1e10, imaginaryA: 0, realB: 1, imaginaryB: 1 }, 'componentOutOfRange'],
    [{ operation: 'polarToRectangular', radius: -1, angle: 0 }, 'negativeRadius'],
    [{ operation: 'polarToRectangular', radius: 1, angle: 1e7 }, 'angleOutOfRange'],
    [{ operation: 'polarToRectangular', radius: 1, angle: 30, angleUnit: 'turns' }, 'invalidAngleUnit'],
    [{ operation: 'roots', realA: 1, imaginaryA: 1, degree: 1 }, 'invalidRootDegree'],
    [{ operation: 'unknown', realA: 1, imaginaryA: 1 }, 'invalidOperation'],
  ];
  for (const [input, code] of cases) assert.throws(() => calculate(input), (error) => error.code === code);
});
