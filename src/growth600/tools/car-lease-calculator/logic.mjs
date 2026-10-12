export const CAR_LEASE_LIMITS = Object.freeze({ maxAmount: 1_000_000_000, maxTermMonths: 120, maxMoneyFactor: 1, maxTaxPercent: 100 });

export function calculateCarLease({ capitalizedCost, residualValue, termMonths, moneyFactor, capCostReduction = 0, taxPercent = 0 }) {
  const raw = { capitalizedCost, residualValue, termMonths, moneyFactor, capCostReduction, taxPercent };
  if (Object.values(raw).some((value) => typeof value === 'string' && !value.trim())) throw new RangeError('Enter a value for every field, or enter zero where appropriate.');
  const values = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Number(value)]));
  if (Object.values(values).some((value) => !Number.isFinite(value))) throw new RangeError('Enter finite numbers.');
  const { capitalizedCost: capCost, residualValue: residual, termMonths: term, moneyFactor: factor, capCostReduction: reduction, taxPercent: tax } = values;
  if (capCost < 0 || capCost > CAR_LEASE_LIMITS.maxAmount || residual < 0 || residual > CAR_LEASE_LIMITS.maxAmount || reduction < 0 || reduction > CAR_LEASE_LIMITS.maxAmount) throw new RangeError('Lease amounts must be non-negative and within the supported range.');
  if (!Number.isInteger(term) || term < 1 || term > CAR_LEASE_LIMITS.maxTermMonths) throw new RangeError('Enter a lease term from 1 to 120 whole months.');
  if (factor < 0 || factor > CAR_LEASE_LIMITS.maxMoneyFactor) throw new RangeError('Enter a money factor from 0 to 1.');
  if (tax < 0 || tax > CAR_LEASE_LIMITS.maxTaxPercent) throw new RangeError('Enter a tax rate from 0% to 100%.');
  const adjustedCapitalizedCost = capCost - reduction;
  if (residual > adjustedCapitalizedCost) throw new RangeError('Residual value cannot exceed the adjusted capitalized cost in this estimate.');
  const monthlyDepreciation = (adjustedCapitalizedCost - residual) / term;
  const monthlyRentCharge = (adjustedCapitalizedCost + residual) * factor;
  const monthlyPretaxPayment = monthlyDepreciation + monthlyRentCharge;
  const estimatedMonthlyTax = monthlyPretaxPayment * tax / 100;
  const estimatedMonthlyPayment = monthlyPretaxPayment + estimatedMonthlyTax;
  return Object.freeze({
    capitalizedCost: capCost, residualValue: residual, termMonths: term, moneyFactor: factor, capCostReduction: reduction, taxPercent: tax,
    adjustedCapitalizedCost, monthlyDepreciation, monthlyRentCharge, monthlyPretaxPayment, estimatedMonthlyTax, estimatedMonthlyPayment,
    estimatedPaymentsPlusCapReduction: estimatedMonthlyPayment * term + reduction,
  });
}
