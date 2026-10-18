/** Norway-bound vehicle cost estimate with the one-off tax supplied from Skatteetaten. */
export const norwayCarImportRules2026 = Object.freeze({
  year: 2026,
  checkedAt: '2026-10-17',
  standardVatRatePct: 25,
  passengerCarScrapDepositTaxNok: 2400,
  sourceImport: 'https://www.skatteetaten.no/en/person/duties/cars-and-other-vehicles/importing/',
  sourceOtherTaxes: 'https://www.skatteetaten.no/en/person/duties/cars-and-other-vehicles/importing/other-taxes/',
  sourceOneOffTax: 'https://www.skatteetaten.no/en/person/duties/cars-and-other-vehicles/importing/one-off-registration-tax/',
});

function finite(value, name, min = 0, max = 1e12) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}
function round(value) { return Math.round((value + Number.EPSILON) * 100) / 100; }

export function estimateNorwayCarImportCost({ purchasePrice, shippingCost = 0, insuranceCost = 0, exchangeRateToNok = 1, currencyCode = 'NOK', vatRatePct = norwayCarImportRules2026.standardVatRatePct, oneOffRegistrationTaxNok, scrapDepositTaxNok = norwayCarImportRules2026.passengerCarScrapDepositTaxNok, greenhouseGasTaxNok = 0, otherFeesNok = 0, comparableNorwayPriceNok = null } = {}) {
  const currency = String(currencyCode).toUpperCase();
  if (!/^[A-Z]{3}$/u.test(currency)) throw new RangeError('Currency must be a three-letter ISO code.');
  new Intl.NumberFormat('en', { style: 'currency', currency });
  const exchangeRate = finite(exchangeRateToNok, 'Exchange rate to NOK', 0.00000001, 1e9);
  const purchaseNok = finite(purchasePrice, 'Purchase price') * exchangeRate;
  const shippingNok = finite(shippingCost, 'Shipping') * exchangeRate;
  const insuranceNok = finite(insuranceCost, 'Insurance') * exchangeRate;
  const customsValueNok = purchaseNok + shippingNok + insuranceNok;
  const vatRate = finite(vatRatePct, 'VAT rate', 0, 100);
  const importVatNok = customsValueNok * vatRate / 100;
  const oneOffTax = finite(oneOffRegistrationTaxNok, 'One-off registration tax');
  const scrapTax = finite(scrapDepositTaxNok, 'Scrap deposit tax');
  const greenhouseTax = finite(greenhouseGasTaxNok, 'Greenhouse-gas tax');
  const otherFees = finite(otherFeesNok, 'Other fees');
  const totalImportCostNok = customsValueNok + importVatNok + oneOffTax + scrapTax + greenhouseTax + otherFees;
  const localPrice = comparableNorwayPriceNok === null || comparableNorwayPriceNok === '' ? null : finite(comparableNorwayPriceNok, 'Comparable Norway price');
  return Object.freeze({
    rulesYear: norwayCarImportRules2026.year, checkedAt: norwayCarImportRules2026.checkedAt,
    currencyCode: currency, exchangeRateToNok: exchangeRate,
    purchaseNok: round(purchaseNok), shippingNok: round(shippingNok), insuranceNok: round(insuranceNok), customsValueNok: round(customsValueNok),
    vatRatePct: vatRate, importVatNok: round(importVatNok), oneOffRegistrationTaxNok: round(oneOffTax),
    scrapDepositTaxNok: round(scrapTax), greenhouseGasTaxNok: round(greenhouseTax), otherFeesNok: round(otherFees),
    totalImportCostNok: round(totalImportCostNok), totalIncludingPurchaseNok: round(totalImportCostNok),
    comparableNorwayPriceNok: localPrice === null ? null : round(localPrice),
    differenceVsNorwayPriceNok: localPrice === null ? null : round(localPrice - totalImportCostNok),
  });
}
