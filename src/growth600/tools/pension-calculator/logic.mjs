const MAX_SALARY = 1_000_000_000;
const MAX_FACTOR = 100;
const MAX_YEARS = 80;

function value(input, key, min, max) {
  const raw = input?.[key];
  const number = typeof raw === 'string' && raw.trim() === '' ? NaN : Number(raw);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${key} is outside the supported range.`);
  return number;
}

/** Simple defined-benefit illustration. Scheme rules, caps and tax are deliberately excluded. */
export function calculatePension(input) {
  const finalSalary = value(input, 'finalSalary', 0, MAX_SALARY);
  const yearsOfService = value(input, 'yearsOfService', 0, MAX_YEARS);
  const accrualPercent = value(input, 'accrualPercent', 0, MAX_FACTOR);
  const commutationPercent = value(input, 'commutationPercent', 0, 100);
  const commutationFactor = value(input, 'commutationFactor', 0, MAX_FACTOR);
  const annualPension = finalSalary * yearsOfService * accrualPercent / 100;
  const convertedAnnualPension = annualPension * commutationPercent / 100;
  const lumpSum = convertedAnnualPension * commutationFactor;
  const remainingAnnualPension = annualPension - convertedAnnualPension;
  const total = [annualPension, convertedAnnualPension, lumpSum, remainingAnnualPension];
  if (total.some((item) => !Number.isFinite(item) || item > MAX_SALARY * MAX_YEARS)) throw new RangeError('The result exceeds the supported range.');
  return Object.freeze({ finalSalary, yearsOfService, accrualPercent, commutationPercent, commutationFactor, annualPension, convertedAnnualPension, lumpSum, remainingAnnualPension, monthlyPension: remainingAnnualPension / 12 });
}

export const PENSION_LIMITS = Object.freeze({ maxSalary: MAX_SALARY, maxYears: MAX_YEARS, maxPercent: MAX_FACTOR, maxCommutationPercent: 100, maxCommutationFactor: MAX_FACTOR });
