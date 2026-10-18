/** Norway's 2026 BSU contribution and tax-deduction scenario. */
export const norwayBsuRules2026 = Object.freeze({
  year: 2026,
  checkedAt: '2026-10-17',
  annualDepositLimitNok: 27500,
  lifetimeDepositLimitNok: 300000,
  taxDeductionRate: 0.10,
  lastEligibleAge: 33,
  sourceRates: 'https://www.skatteetaten.no/en/Rates/Deduction-for-young-peoples-housing-savings-BSU/',
  sourceRules: 'https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/bank-and-loans/bsu/',
  sourceTaxRates: 'https://www.regjeringen.no/no/tema/okonomi-og-budsjett/skatter-og-avgifter/skatte-og-avgiftssatser/skattesatser-2026/id3121978/',
});

function finite(value, name, { min = 0, max = 1e9 } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

/**
 * Calculates a single 2026 BSU deposit and optional savings projection.
 * Tax credit is capped by the user's available tax; unused credit is lost.
 */
export function estimateNorwayBsu({
  ageAtIncomeYearEnd,
  priorTotalDepositsNok,
  alreadyDepositedThisYearNok,
  plannedDepositNok,
  availableTaxForDeductionNok,
  existingBsuAccountBalanceNok = 0,
  ownsResidentialPropertyAtYearEnd = false,
  withdrewBsuFundsThisYear = false,
  eligibleBsuAccount = true,
  ordinaryAccountBalanceNok = 0,
  projectionYears = 0,
  bsuAnnualRatePct = null,
  ordinaryAnnualRatePct = null,
} = {}) {
  const rules = norwayBsuRules2026;
  const age = finite(ageAtIncomeYearEnd, 'Age at year end', { max: 120 });
  const priorDeposits = finite(priorTotalDepositsNok, 'Prior total BSU deposits');
  const currentYearDeposits = finite(alreadyDepositedThisYearNok, 'Deposits already made this year');
  const plannedDeposit = finite(plannedDepositNok, 'Planned deposit');
  const availableTax = finite(availableTaxForDeductionNok, 'Tax available to use the deduction');
  const existingBsu = finite(existingBsuAccountBalanceNok, 'Current BSU account balance');
  const ordinary = finite(ordinaryAccountBalanceNok, 'Ordinary savings balance');
  const years = finite(projectionYears, 'Projection years', { max: 50 });
  for (const [value, name] of [[ownsResidentialPropertyAtYearEnd, 'Property ownership'], [withdrewBsuFundsThisYear, 'BSU withdrawal'], [eligibleBsuAccount, 'Eligible account']]) {
    if (typeof value !== 'boolean') throw new TypeError(`${name} must be true or false.`);
  }
  if (![age, years].every(Number.isInteger)) throw new RangeError('Age and projection years must be whole numbers.');
  const bsuRate = bsuAnnualRatePct === null || bsuAnnualRatePct === '' ? null : finite(bsuAnnualRatePct, 'BSU annual interest rate', { max: 100 });
  const ordinaryRate = ordinaryAnnualRatePct === null || ordinaryAnnualRatePct === '' ? null : finite(ordinaryAnnualRatePct, 'Ordinary savings annual interest rate', { max: 100 });
  if (years > 0 && (bsuRate === null || ordinaryRate === null)) throw new RangeError('Enter both interest rates for the optional comparison.');

  const ageEligible = age <= rules.lastEligibleAge;
  const contractEligible = eligibleBsuAccount && ageEligible && !withdrewBsuFundsThisYear;
  const totalRoomNok = Math.max(0, rules.lifetimeDepositLimitNok - priorDeposits - currentYearDeposits);
  const annualRoomNok = Math.max(0, rules.annualDepositLimitNok - currentYearDeposits);
  const depositAcceptedNok = contractEligible ? Math.min(plannedDeposit, annualRoomNok, totalRoomNok) : 0;
  const housingOwnershipBlocksDeduction = ownsResidentialPropertyAtYearEnd;
  const deductionConditionsMet = contractEligible && !housingOwnershipBlocksDeduction && !withdrewBsuFundsThisYear;
  const nominalDeductionNok = deductionConditionsMet ? depositAcceptedNok * rules.taxDeductionRate : 0;
  const effectiveDeductionNok = Math.min(nominalDeductionNok, availableTax);
  const unusedDeductionNok = Math.max(0, nominalDeductionNok - effectiveDeductionNok);
  const endingBsuBalanceNok = existingBsu + depositAcceptedNok;
  let projectedBsuBalanceNok = null;
  let projectedOrdinaryBalanceNok = null;
  if (years > 0) {
    projectedBsuBalanceNok = endingBsuBalanceNok;
    projectedOrdinaryBalanceNok = ordinary;
    let futureBsuDepositsNok = 0;
    for (let year = 1; year <= years; year += 1) {
      projectedBsuBalanceNok *= 1 + bsuRate / 100;
      projectedOrdinaryBalanceNok *= 1 + ordinaryRate / 100;
      if (age + year <= rules.lastEligibleAge && contractEligible) {
        const remainingRoom = Math.max(0, rules.lifetimeDepositLimitNok - priorDeposits - currentYearDeposits - depositAcceptedNok - futureBsuDepositsNok);
        const futureDeposit = Math.min(plannedDeposit, rules.annualDepositLimitNok, remainingRoom);
        projectedBsuBalanceNok += futureDeposit;
        futureBsuDepositsNok += futureDeposit;
      }
      projectedOrdinaryBalanceNok += plannedDeposit;
    }
  }
  return Object.freeze({
    rulesYear: rules.year,
    checkedAt: rules.checkedAt,
    ageEligible,
    contractEligible,
    ownsResidentialPropertyAtYearEnd,
    withdrewBsuFundsThisYear,
    annualDepositLimitNok: rules.annualDepositLimitNok,
    lifetimeDepositLimitNok: rules.lifetimeDepositLimitNok,
    priorTotalDepositsNok: priorDeposits,
    alreadyDepositedThisYearNok: currentYearDeposits,
    remainingLifetimeRoomNok: totalRoomNok,
    remainingAnnualRoomNok: annualRoomNok,
    plannedDepositNok: plannedDeposit,
    depositAcceptedNok,
    plannedDepositAboveLimitsNok: Math.max(0, plannedDeposit - depositAcceptedNok),
    nominalDeductionNok,
    deductionConditionsMet,
    effectiveDeductionNok,
    unusedDeductionNok,
    endingBsuBalanceNok,
    ordinaryAccountBalanceNok: ordinary,
    projectionYears: years,
    bsuAnnualRatePct: bsuRate,
    ordinaryAnnualRatePct: ordinaryRate,
    projectedBsuBalanceNok,
    projectedOrdinaryBalanceNok,
  });
}
