import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIpAddress } from './logic.mjs';

test('IP registry lookup parser canonicalizes IPv4, compressed IPv6 and mapped IPv4 forms', () => {
  assert.equal(parseIpAddress('192.0.2.1').canonical, '192.0.2.1');
  assert.deepEqual(parseIpAddress('2001:db8::1'), { family: 6, bits: 128, value: 0x20010db8000000000000000000000001n, canonical: '2001:db8:0:0:0:0:0:1' });
  assert.equal(parseIpAddress('::ffff:192.0.2.1').canonical, '0:0:0:0:0:ffff:c000:201');
});

test('IP registry lookup parser rejects URLs, network prefixes, zones and malformed octets', () => {
  for (const value of ['', '192.0.2.256', '192.0.2.1/24', 'https://192.0.2.1', 'fe80::1%en0', '2001:::1', '1.2.3']) {
    assert.throws(() => parseIpAddress(value), RangeError, value);
  }
});
