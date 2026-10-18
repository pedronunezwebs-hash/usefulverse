export const swissPayrollRules2026 = Object.freeze({
  year: 2026,
  ahvIvEoEmployeeRate: 0.053,
  unemploymentEmployeeRate: 0.011,
  unemploymentAnnualCap: 148_200,
  postReferenceAgeMonthlyAllowance: 1_400,
  pensionEntryThreshold: 22_680,
  coordinationDeduction: 26_460,
  maximumInsuredSalary: 90_720,
  minimumCoordinatedSalary: 3_780,
});

const CHF_MAX = 100_000_000;
function nonnegative(value, name) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || amount > CHF_MAX) throw new RangeError(`${name} must be between CHF 0 and CHF ${CHF_MAX}.`);
  return amount;
}

/**
 * Swiss payroll scenario for 2026. Only nationwide statutory AHV/IV/EO and
 * ALV employee/employer shares are calculated. Plan-specific deductions are
 * supplied by the user because canton, age or gross salary cannot determine them.
 */
export function calculateSwissNetSalary({
  grossPerPayPeriod,
  paymentsPerYear = 12,
  age = 35,
  postReferenceAgeAllowance = false,
  contributionStatus = 'standard',
  pensionDeductionAnnual = 0,
  accidentDeductionAnnual = 0,
  sourceTaxAnnual = 0,
  otherDeductionsAnnual = 0,
}) {
  const perPay = nonnegative(grossPerPayPeriod, 'Gross pay');
  const years = Number(paymentsPerYear);
  if (![12, 13].includes(years)) throw new RangeError('Choose 12 or 13 salary payments per year.');
  const ageYears = Number(age);
  if (!Number.isInteger(ageYears) || ageYears < 15 || ageYears > 100) throw new RangeError('Age must be a whole number from 15 to 100.');
  if (!['standard', 'underContributionAge', 'postReferenceAge'].includes(contributionStatus)) throw new TypeError('Choose a supported contribution status.');
  if (contributionStatus === 'underContributionAge' && postReferenceAgeAllowance) throw new TypeError('The post-reference-age allowance does not apply to this selection.');

  const annualGross = perPay * years;
  if (annualGross > CHF_MAX) throw new RangeError('Annual salary exceeds the supported limit.');
  const allowance = contributionStatus === 'postReferenceAge' && postReferenceAgeAllowance
    ? Math.min(annualGross, swissPayrollRules2026.postReferenceAgeMonthlyAllowance * 12)
    : 0;
  const ahvBase = contributionStatus === 'underContributionAge' ? 0 : Math.max(0, annualGross - allowance);
  const ahvIvEo = Math.round(ahvBase * swissPayrollRules2026.ahvIvEoEmployeeRate * 100) / 100;
  const alvBase = contributionStatus === 'standard'
    ? Math.min(annualGross, swissPayrollRules2026.unemploymentAnnualCap)
    : 0;
  const unemployment = Math.round(alvBase * swissPayrollRules2026.unemploymentEmployeeRate * 100) / 100;
  const employerAhvIvEo = ahvIvEo;
  const employerUnemployment = unemployment;
  const pension = nonnegative(pensionDeductionAnnual, 'Pension deduction');
  const accident = nonnegative(accidentDeductionAnnual, 'Accident insurance deduction');
  const withholding = nonnegative(sourceTaxAnnual, 'Source tax');
  const other = nonnegative(otherDeductionsAnnual, 'Other deductions');
  const totalKnownDeductions = ahvIvEo + unemployment + pension + accident + withholding + other;
  if (totalKnownDeductions > annualGross + 0.01) throw new RangeError('Entered deductions cannot exceed gross salary.');
  const annualNet = Math.round((annualGross - totalKnownDeductions) * 100) / 100;

  return Object.freeze({
    year: swissPayrollRules2026.year,
    age: ageYears,
    contributionStatus,
    paymentsPerYear: years,
    grossPerPayPeriod: perPay,
    annualGross,
    ahvAllowance: allowance,
    ahvIvEoBase: ahvBase,
    ahvIvEo,
    unemploymentBase: alvBase,
    unemployment,
    employerAhvIvEo,
    employerUnemployment,
    pension,
    accident,
    sourceTax: withholding,
    otherDeductions: other,
    totalKnownDeductions: Math.round(totalKnownDeductions * 100) / 100,
    annualNet,
    averageNetPerPayment: Math.round((annualNet / years) * 100) / 100,
    estimatedNetPerRegularPay: Math.round((annualNet / years) * 100) / 100,
    estimatedNetPerMonth: Math.round((annualNet / 12) * 100) / 100,
  });
}
