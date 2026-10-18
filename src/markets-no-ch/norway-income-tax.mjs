const RULES_2026 = Object.freeze({
  year: 2026,
  ordinaryIncomeTax: Object.freeze({ standard: 0.22, measuresZone: 0.185 }),
  measuresZoneDeduction: 45_000,
  personalAllowance: 114_540,
  salaryDeductionRate: 0.46,
  salaryDeductionCap: 95_700,
  pensionDeductionRate: 0.40,
  pensionDeductionCap: 75_400,
  nationalInsuranceThreshold: 99_650,
  insurance: Object.freeze({ salary: 0.076, pension: 0.051 }),
  insuranceReductionCap: 0.25,
  brackets: Object.freeze([
    Object.freeze({ from: 226_100, rate: 0.017 }),
    Object.freeze({ from: 318_300, rate: 0.04 }),
    Object.freeze({ from: 725_050, rate: 0.137 }),
    Object.freeze({ from: 980_100, rate: 0.168 }),
    Object.freeze({ from: 1_467_200, rate: 0.178 }),
  ]),
  pensionCredit: Object.freeze({ maximum: 37_100, firstThreshold: 284_950, firstRate: 0.167, secondThreshold: 436_050, secondRate: 0.06 }),
});

function amount(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 10_000_000) throw new RangeError('Income must be between NOK 0 and NOK 10,000,000.');
  return number;
}

function progressiveTax(income) {
  let tax = 0;
  RULES_2026.brackets.forEach(({ from, rate }, index) => {
    const next = RULES_2026.brackets[index + 1]?.from ?? Infinity;
    tax += Math.max(0, Math.min(income, next) - from) * rate;
  });
  return tax;
}

function insuranceContribution(income, rate) {
  const threshold = RULES_2026.nationalInsuranceThreshold;
  if (income <= threshold) return 0;
  return Math.min(income * rate, (income - threshold) * RULES_2026.insuranceReductionCap);
}

function pensionCredit(pensionIncome) {
  const rule = RULES_2026.pensionCredit;
  const firstBand = Math.max(0, Math.min(pensionIncome, rule.secondThreshold) - rule.firstThreshold);
  const secondBand = Math.max(0, pensionIncome - rule.secondThreshold);
  return Math.max(0, rule.maximum - firstBand * rule.firstRate - secondBand * rule.secondRate);
}

export function calculateNorwayIncomeTax({ income, type = 'salary', zone = 'standard' }) {
  const gross = amount(income);
  if (!['salary', 'pension'].includes(type)) throw new TypeError('Choose salary or pension.');
  if (!['standard', 'measuresZone'].includes(zone)) throw new TypeError('Choose a supported tax zone.');

  const deductionRate = type === 'salary' ? RULES_2026.salaryDeductionRate : RULES_2026.pensionDeductionRate;
  const deductionCap = type === 'salary' ? RULES_2026.salaryDeductionCap : RULES_2026.pensionDeductionCap;
  const standardDeduction = Math.min(gross * deductionRate, deductionCap);
  const zoneDeduction = zone === 'measuresZone' ? RULES_2026.measuresZoneDeduction : 0;
  const ordinaryIncomeBase = Math.max(0, gross - standardDeduction - RULES_2026.personalAllowance - zoneDeduction);
  const ordinaryIncomeTax = ordinaryIncomeBase * RULES_2026.ordinaryIncomeTax[zone];
  const bracketTax = progressiveTax(gross);
  const nationalInsurance = insuranceContribution(gross, RULES_2026.insurance[type]);
  const eligiblePensionCredit = type === 'pension' ? pensionCredit(gross) : 0;
  const taxBeforeCredit = ordinaryIncomeTax + bracketTax + nationalInsurance;
  const displayedTaxBeforeCredit = Math.round(ordinaryIncomeTax) + Math.round(bracketTax) + Math.round(nationalInsurance);
  // Keep the displayed rounded credit from exceeding the displayed rounded
  // pre-credit tax by one NOK at rounding boundaries.
  const credit = Math.min(eligiblePensionCredit, displayedTaxBeforeCredit);
  const roundedCredit = Math.round(credit);
  const tax = Math.max(0, displayedTaxBeforeCredit - roundedCredit);

  return Object.freeze({
    year: RULES_2026.year,
    type,
    zone,
    gross,
    standardDeduction: Math.round(standardDeduction),
    personalAllowance: RULES_2026.personalAllowance,
    zoneDeduction,
    ordinaryIncomeBase: Math.round(ordinaryIncomeBase),
    ordinaryIncomeTax: Math.round(ordinaryIncomeTax),
    bracketTax: Math.round(bracketTax),
    nationalInsurance: Math.round(nationalInsurance),
    pensionCredit: roundedCredit,
    tax,
    net: Math.round(gross) - tax,
    effectiveRate: gross === 0 ? 0 : tax / gross,
  });
}

export const norwayTaxRules2026 = RULES_2026;
