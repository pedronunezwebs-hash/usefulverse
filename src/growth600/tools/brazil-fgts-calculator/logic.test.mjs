import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateBrazilFgtsDeposit } from './logic.mjs';

test('calculates an 8% standard employer FGTS deposit', () => {
  assert.equal(estimateBrazilFgtsDeposit(3000, 'standard').employerDeposit, 240);
});
test('calculates the 2% apprentice deposit without treating it as a worker deduction', () => {
  const result = estimateBrazilFgtsDeposit(3000, 'apprentice');
  assert.equal(result.employerDeposit, 60); assert.equal(result.employerPaid, true);
});
test('rejects invalid values and unsupported categories', () => {
  assert.throws(() => estimateBrazilFgtsDeposit(-1, 'standard'), { code: 'invalid-input' });
  assert.throws(() => estimateBrazilFgtsDeposit(1000, 'domestic'), { code: 'invalid-input' });
});
