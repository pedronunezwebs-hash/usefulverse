export const norwayCompanyCarRules2026 = Object.freeze({
  taxYear: 2026,
  sourcedOn: '2026-10-16',
  source: 'https://www.skatteetaten.no/en/rates/car-rates---company-cars/',
  privateUseSource: 'https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/property-and-belongings/cars-boats-and-other-vehicles/company-car/private-use-of-a-company-car/',
  thresholdNok: 370300,
  lowerRatePct: 30,
  excessRatePct: 20,
  ageReductionPct: 25,
  highWorkMileageReductionPct: 25,
  highWorkMileageThresholdKm: 40000,
});

const finite = (value, name, { min = 0, max = 1e12 } = {}) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} must be between ${min} and ${max}.`);
  return number;
};

/** Standard Norwegian passenger-car company benefit. Does not model special vehicles. */
export function calculateNorwayCompanyCarBenefit({
  listPriceNewNok,
  monthsAvailable = 12,
  olderThanThreeYearsOnJan1 = false,
  documentedWorkKm = 0,
  hasMileageLog = false,
  marginalTaxRatePct = 0,
  ownCarAnnualCostNok = 0,
} = {}) {
  const listPrice = finite(listPriceNewNok, 'List price', { min: 1, max: 1e9 });
  const months = finite(monthsAvailable, 'Months available', { min: 1, max: 12 });
  const workKm = finite(documentedWorkKm, 'Documented work mileage', { max: 2e6 });
  const marginalRate = finite(marginalTaxRatePct, 'Marginal tax rate', { max: 100 });
  const ownCost = finite(ownCarAnnualCostNok, 'Own-car annual cost');
  if (typeof olderThanThreeYearsOnJan1 !== 'boolean' || typeof hasMileageLog !== 'boolean') throw new TypeError('Age and mileage-log flags must be true or false.');
  const highMileageEligible = hasMileageLog && workKm > norwayCompanyCarRules2026.highWorkMileageThresholdKm;
  const baseFactor = (olderThanThreeYearsOnJan1 ? 0.75 : 1) * (highMileageEligible ? 0.75 : 1);
  const reducedListPriceNok = listPrice * baseFactor;
  const annualTaxableBenefitNok = Math.min(reducedListPriceNok, norwayCompanyCarRules2026.thresholdNok) * 0.30
    + Math.max(0, reducedListPriceNok - norwayCompanyCarRules2026.thresholdNok) * 0.20;
  const taxableBenefitNok = annualTaxableBenefitNok * months / 12;
  const estimatedPersonalTaxNok = taxableBenefitNok * marginalRate / 100;
  return Object.freeze({
    taxYear: norwayCompanyCarRules2026.taxYear,
    sourcedOn: norwayCompanyCarRules2026.sourcedOn,
    listPriceNewNok: listPrice,
    reducedListPriceNok,
    baseFactor,
    olderThanThreeYearsOnJan1,
    documentedWorkKm: workKm,
    hasMileageLog,
    highMileageEligible,
    monthsAvailable: months,
    annualTaxableBenefitNok,
    taxableBenefitNok,
    estimatedPersonalTaxNok,
    marginalTaxRatePct: marginalRate,
    ownCarAnnualCostNok: ownCost,
    contextDifferenceOwnCostMinusEstimatedTaxNok: ownCost - estimatedPersonalTaxNok,
  });
}
