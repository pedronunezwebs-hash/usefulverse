const RULES_2026 = Object.freeze({
  year: 2026,
  singleAllowance: 1_900_000,
  singleStateSecondBand: 21_500_000,
  municipalMaximumRate: 0.0035,
  stateFirstRate: 0.0065,
  stateSecondRate: 0.0075,
  primaryHomeFirstBandLimit: 14_000_000,
  primaryHomeFirstBandTaxableRate: 0.25,
  primaryHomeUpperBandTaxableRate: 0.70,
  shareTaxableRate: 0.80,
  businessTaxableRate: 0.70,
});

const assetKeys = Object.freeze(['primaryHome', 'secondaryHome', 'shares', 'businessAssets', 'cashOther']);

function amount(value, name) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 10_000_000_000) {
    throw new RangeError(`${name} must be between NOK 0 and NOK 10,000,000,000.`);
  }
  return parsed;
}

function assessPrimaryHome(marketValue) {
  const lowerBand = Math.min(marketValue, RULES_2026.primaryHomeFirstBandLimit) * RULES_2026.primaryHomeFirstBandTaxableRate;
  const upperBand = Math.max(0, marketValue - RULES_2026.primaryHomeFirstBandLimit) * RULES_2026.primaryHomeUpperBandTaxableRate;
  return lowerBand + upperBand;
}

function taxByBand(netWealth, allowance, upperThreshold, firstRate, secondRate) {
  const taxable = Math.max(0, netWealth - allowance);
  const firstBand = Math.max(0, Math.min(netWealth, upperThreshold) - allowance);
  const secondBand = Math.max(0, netWealth - upperThreshold);
  return { taxable, firstBandTax: firstBand * firstRate, secondBandTax: secondBand * secondRate };
}

/**
 * Estimate Norwegian personal wealth tax for 2026.
 * Home values are market estimates; shares/business assets are pre-discount tax bases.
 * Debt reduction is apportioned by full values before asset discounts.
 */
export function calculateNorwayWealthTax({
  primaryHome = 0,
  secondaryHome = 0,
  shares = 0,
  businessAssets = 0,
  cashOther = 0,
  debt = 0,
  jointlyTaxed = false,
  municipalRate = RULES_2026.municipalMaximumRate,
} = {}) {
  const values = Object.fromEntries(assetKeys.map((key) => [key, amount(({ primaryHome, secondaryHome, shares, businessAssets, cashOther })[key] ?? 0, key)]));
  const totalDebt = amount(debt, 'debt');
  const localRate = Number(municipalRate);
  if (!Number.isFinite(localRate) || localRate < 0 || localRate > RULES_2026.municipalMaximumRate) {
    throw new RangeError('Municipal rate must be between 0% and the 2026 maximum of 0.35%.');
  }
  if (typeof jointlyTaxed !== 'boolean') throw new TypeError('jointlyTaxed must be true or false.');

  const fullValues = {
    primaryHome: values.primaryHome,
    secondaryHome: values.secondaryHome,
    shares: values.shares,
    businessAssets: values.businessAssets,
    cashOther: values.cashOther,
  };
  const fullAssetTotal = Object.values(fullValues).reduce((sum, value) => sum + value, 0);
  const taxableValues = {
    primaryHome: assessPrimaryHome(values.primaryHome),
    secondaryHome: values.secondaryHome,
    shares: values.shares * RULES_2026.shareTaxableRate,
    businessAssets: values.businessAssets * RULES_2026.businessTaxableRate,
    cashOther: values.cashOther,
  };
  const assetTaxableTotal = Object.values(taxableValues).reduce((sum, value) => sum + value, 0);

  // Only shares and operating assets get a discount-linked reduction to allocated debt.
  const discountedDebtFraction = fullAssetTotal === 0 ? 0 : (
    (values.shares / fullAssetTotal) * (1 - RULES_2026.shareTaxableRate)
    + (values.businessAssets / fullAssetTotal) * (1 - RULES_2026.businessTaxableRate)
  );
  const debtReduction = Math.min(totalDebt, totalDebt * discountedDebtFraction);
  const deductibleDebt = totalDebt - debtReduction;
  const netWealth = assetTaxableTotal - deductibleDebt;
  const allowance = RULES_2026.singleAllowance * (jointlyTaxed ? 2 : 1);
  const stateUpperThreshold = RULES_2026.singleStateSecondBand * (jointlyTaxed ? 2 : 1);
  const municipality = taxByBand(netWealth, allowance, Infinity, localRate, 0);
  const state = taxByBand(netWealth, allowance, stateUpperThreshold, RULES_2026.stateFirstRate, RULES_2026.stateSecondRate);

  return Object.freeze({
    year: RULES_2026.year,
    jointlyTaxed,
    fullAssetTotal: Math.round(fullAssetTotal),
    taxableAssets: Math.round(assetTaxableTotal),
    taxableValues: Object.freeze(Object.fromEntries(Object.entries(taxableValues).map(([key, value]) => [key, Math.round(value)]))),
    debt: Math.round(totalDebt),
    debtReduction: Math.round(debtReduction),
    deductibleDebt: Math.round(deductibleDebt),
    netWealth: Math.round(netWealth),
    allowance,
    taxableWealth: Math.max(0, Math.round(netWealth - allowance)),
    municipalTax: Math.max(0, Math.round(municipality.firstBandTax)),
    stateTax: Math.max(0, Math.round(state.firstBandTax + state.secondBandTax)),
    stateFirstBandTax: Math.max(0, Math.round(state.firstBandTax)),
    stateSecondBandTax: Math.max(0, Math.round(state.secondBandTax)),
    totalTax: Math.max(0, Math.round(municipality.firstBandTax) + Math.round(state.firstBandTax + state.secondBandTax)),
    municipalRate: localRate,
    municipalityUsesMaximumRate: localRate === RULES_2026.municipalMaximumRate,
  });
}

export function compareNorwayWealthTaxSensitivity(input, percentage = 0.10) {
  const sensitivity = Number(percentage);
  if (!Number.isFinite(sensitivity) || sensitivity < 0 || sensitivity > 0.5) throw new RangeError('Sensitivity must be between 0% and 50%.');
  const normalized = { primaryHome: 0, secondaryHome: 0, shares: 0, businessAssets: 0, cashOther: 0, debt: 0, ...input };
  const base = calculateNorwayWealthTax(normalized);
  const low = calculateNorwayWealthTax({ ...normalized, primaryHome: normalized.primaryHome * (1 - sensitivity), secondaryHome: normalized.secondaryHome * (1 - sensitivity) });
  const high = calculateNorwayWealthTax({ ...normalized, primaryHome: normalized.primaryHome * (1 + sensitivity), secondaryHome: normalized.secondaryHome * (1 + sensitivity) });
  return Object.freeze({ percentage: sensitivity, low, base, high });
}

export const norwayWealthTaxRules2026 = RULES_2026;
