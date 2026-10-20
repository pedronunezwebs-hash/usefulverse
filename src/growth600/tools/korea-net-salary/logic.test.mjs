import test from 'node:test';
import assert from 'node:assert/strict';
import withholdingTableData from './withholding-table.json' with { type: 'json' };
import { estimateKoreaNetSalary } from './logic.mjs';

const withholdingTable = withholdingTableData.bands;

test('uses the official table example and 2026 employee insurance rates', () => {
  const result = estimateKoreaNetSalary(3_500_000, 4, 2, 100, '2026-10-20', withholdingTable);
  assert.equal(result.baseWithholdingTax, 49_340);
  assert.equal(result.childReduction, 29_160);
  assert.equal(result.nationalIncomeTax, 20_180);
  assert.equal(result.localIncomeTax, 2_010);
  assert.equal(result.nationalPension, 166_250);
  assert.equal(result.healthInsurance, 125_825);
  assert.equal(result.employmentInsurance, 31_500);
  assert.ok(result.estimatedNetSalary > 3_100_000 && result.estimatedNetSalary < 3_200_000);
});

test('caps pensionable monthly earnings at the 2026 July ceiling', () => {
  const result = estimateKoreaNetSalary(9_000_000, 1, 0, 100, '2026-10-20', withholdingTable);
  assert.equal(result.pensionableSalary, 6_590_000);
  assert.equal(result.nationalPension, 6_590_000 * 0.0475);
});

test('applies the selected withholding percentage after the child reduction', () => {
  const result = estimateKoreaNetSalary(3_500_000, 4, 2, 80, '2026-10-20', withholdingTable);
  assert.equal(result.nationalIncomeTax, 16_140);
  assert.equal(result.localIncomeTax, 1_610);
});

test('rejects unsupported family data, salaries and dates', () => {
  assert.throws(() => estimateKoreaNetSalary(999_999, 1, 0, 100, '2026-10-20', withholdingTable), { code: 'invalid-salary' });
  assert.throws(() => estimateKoreaNetSalary(3_500_000, 2, 3, 100, '2026-10-20', withholdingTable), { code: 'invalid-child-count' });
  assert.throws(() => estimateKoreaNetSalary(3_500_000, 4, 2, 90, '2026-10-20', withholdingTable), { code: 'invalid-withholding-ratio' });
  assert.throws(() => estimateKoreaNetSalary(3_500_000, 4, 2, 100, '2027-01-01', withholdingTable), { code: 'table-unavailable' });
  assert.throws(() => estimateKoreaNetSalary(3_500_000, 4, 2, 100, '2026-10-20'), { code: 'table-load-failed' });
});
