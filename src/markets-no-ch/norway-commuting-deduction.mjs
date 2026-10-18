/** 2026 Norwegian home-to-work distance deduction scenario. */
export const norwayCommutingRules2026 = Object.freeze({
  year: 2026,
  checkedAt: '2026-10-17',
  rateNokPerKm: 1.9,
  minimumOneWayKm: 2.5,
  lowerThresholdNok: 12000,
  upperGrossLimitNok: 120000,
  sourceRates: 'https://www.skatteetaten.no/nn/tabellar-og-satsar/fradrag-for-reiser-mellom-hjem-og-arbeid/',
  sourceRules: 'https://www.skatteetaten.no/en/rettskilder/type/handboker/skatte-abc/gjeldende/r-8-reise-mellom-hjem-og-fast-arbeidssted-arbeidsreiser/R-8.015/R-8.016/',
  source2026: 'https://www.skatteetaten.no/rettskilder/type/uttalelser/uttalelser/forskuddsutskrivingen-2026/',
});

function amount(value, name, min = 0, max = 1e9) {
  const result = Number(value);
  if (!Number.isFinite(result) || result < min || result > max) throw new RangeError(`${name} is outside the supported range.`);
  return result;
}

/** Estimates distance-based eligible expenses and the resulting deduction. */
export function estimateNorwayCommutingDeduction({ oneWayDistanceKm, commutingDays, extraHomeOfficeDays = 0, taxEffectRatePct } = {}) {
  const distance = amount(oneWayDistanceKm, 'One-way distance', 0, 10000);
  const days = amount(commutingDays, 'Commuting days', 0, 366);
  const homeOfficeDays = amount(extraHomeOfficeDays, 'Additional home-office days', 0, 366);
  const taxRate = amount(taxEffectRatePct, 'Tax effect rate', 0, 100);
  if (![days, homeOfficeDays].every(Number.isInteger) || days + homeOfficeDays > 366) throw new RangeError('Commuting and comparison days must be whole numbers within a calendar year.');
  const distanceQualifies = distance >= norwayCommutingRules2026.minimumOneWayKm;
  const unboundedDistanceCostNok = distanceQualifies ? distance * 2 * days * norwayCommutingRules2026.rateNokPerKm : 0;
  const cappedTravelCostNok = Math.min(unboundedDistanceCostNok, norwayCommutingRules2026.upperGrossLimitNok);
  const deductibleAmountNok = Math.max(0, cappedTravelCostNok - norwayCommutingRules2026.lowerThresholdNok);
  const comparisonDistanceCostNok = distanceQualifies ? distance * 2 * (days + homeOfficeDays) * norwayCommutingRules2026.rateNokPerKm : 0;
  const comparisonDeductibleAmountNok = Math.max(0, Math.min(comparisonDistanceCostNok, norwayCommutingRules2026.upperGrossLimitNok) - norwayCommutingRules2026.lowerThresholdNok);
  return Object.freeze({
    rulesYear: norwayCommutingRules2026.year,
    checkedAt: norwayCommutingRules2026.checkedAt,
    oneWayDistanceKm: distance,
    commutingDays: days,
    extraHomeOfficeDays: homeOfficeDays,
    rateNokPerKm: norwayCommutingRules2026.rateNokPerKm,
    distanceQualifies,
    unboundedDistanceCostNok,
    cappedTravelCostNok,
    lowerThresholdNok: norwayCommutingRules2026.lowerThresholdNok,
    upperGrossLimitNok: norwayCommutingRules2026.upperGrossLimitNok,
    deductibleAmountNok,
    taxEffectRatePct: taxRate,
    estimatedTaxEffectNok: deductibleAmountNok * taxRate / 100,
    deductionIfThoseDaysWereCommutedNok: comparisonDeductibleAmountNok,
    estimatedTaxEffectIfThoseDaysWereCommutedNok: comparisonDeductibleAmountNok * taxRate / 100,
    estimatedTaxEffectDifferenceNok: (comparisonDeductibleAmountNok - deductibleAmountNok) * taxRate / 100,
  });
}
