/** User supplied customs/VAT scenario for one Norway-bound parcel or item group. */
export const norwayImportRules2026 = Object.freeze({
  year: 2026,
  checkedAt: '2026-10-17',
  standardVatRatePct: 25,
  foodVatRatePct: 15,
  voecItemLimitNok: 3000,
  sourceCalculation: 'https://www.toll.no/en/online-shopping/calculation-norwegian-vat',
  sourceVoec: 'https://www.skatteetaten.no/en/business-and-organisation/vat-and-duties/vat/foreign/e-commerce-voec/sending-goods-under-the-voec-scheme/',
  sourceCustoms: 'https://www.toll.no/en/online-shopping/shopping-from-online-shops-not-registered-in-the-voec-scheme',
});

function finite(value, name, min = 0, max = 1e12) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}
function round(value) { return Math.round((value + Number.EPSILON) * 100) / 100; }

export function estimateNorwayImportCost({ purchasePrice, shippingCost = 0, insuranceCost = 0, otherTaxes = 0, carrierFee = 0, customsDutyRatePct = 0, vatRatePct = norwayImportRules2026.standardVatRatePct, exchangeRateToNok = 1, currencyCode = 'NOK', voecAtCheckout = false, voecEligibleGoods = false } = {}) {
  const exchangeRate = finite(exchangeRateToNok, 'Exchange rate to NOK', 0.00000001, 1e9);
  const currency = String(currencyCode).toUpperCase();
  if (!/^[A-Z]{3}$/u.test(currency)) throw new RangeError('Currency must be a three-letter ISO code.');
  new Intl.NumberFormat('en', { style: 'currency', currency });
  for (const [value, name] of [[voecAtCheckout, 'VOEC payment'], [voecEligibleGoods, 'VOEC eligibility']]) if (typeof value !== 'boolean') throw new TypeError(`${name} must be true or false.`);
  const toNok = (value, name) => finite(value, name) * exchangeRate;
  const purchaseNok = toNok(purchasePrice, 'Purchase price');
  const shippingNok = toNok(shippingCost, 'Shipping');
  const insuranceNok = toNok(insuranceCost, 'Insurance');
  const otherTaxesNok = toNok(otherTaxes, 'Other import taxes');
  const carrierFeeNok = toNok(carrierFee, 'Carrier clearance fee');
  const dutyRate = finite(customsDutyRatePct, 'Customs duty rate', 0, 1000);
  const vatRate = finite(vatRatePct, 'VAT rate', 0, 100);
  const customsValueNok = purchaseNok + shippingNok + insuranceNok;
  const voecAllowed = voecEligibleGoods && purchaseNok < norwayImportRules2026.voecItemLimitNok;
  if (voecAtCheckout && !voecAllowed) throw new RangeError('The entered item does not meet the selected VOEC eligibility conditions.');
  if (voecAtCheckout && otherTaxesNok > 0) throw new RangeError('VOEC cannot be used for goods subject to excise or other import taxes.');
  const customsDutyNok = voecAtCheckout ? 0 : customsValueNok * dutyRate / 100;
  const vatBaseAtImportNok = customsValueNok + customsDutyNok + otherTaxesNok + carrierFeeNok;
  const vatBaseAtCheckoutNok = purchaseNok + shippingNok + insuranceNok + otherTaxesNok;
  const checkoutVatNok = voecAtCheckout ? vatBaseAtCheckoutNok * vatRate / 100 : 0;
  const importVatNok = voecAtCheckout ? 0 : vatBaseAtImportNok * vatRate / 100;
  const arrivalChargesNok = customsDutyNok + importVatNok + otherTaxesNok + (voecAtCheckout ? 0 : carrierFeeNok);
  const carrierFeeAppliedNok = voecAtCheckout ? 0 : carrierFeeNok;
  const totalLandedCostNok = purchaseNok + shippingNok + insuranceNok + otherTaxesNok + carrierFeeAppliedNok + customsDutyNok + importVatNok + checkoutVatNok;
  return Object.freeze({
    rulesYear: norwayImportRules2026.year, checkedAt: norwayImportRules2026.checkedAt,
    currencyCode: currency, exchangeRateToNok: exchangeRate,
    purchaseNok: round(purchaseNok), shippingNok: round(shippingNok), insuranceNok: round(insuranceNok),
    otherTaxesNok: round(otherTaxesNok), carrierFeeNok: round(carrierFeeAppliedNok), customsValueNok: round(customsValueNok),
    customsDutyRatePct: dutyRate, customsDutyNok: round(customsDutyNok), vatRatePct: vatRate,
    vatBaseAtImportNok: round(vatBaseAtImportNok), importVatNok: round(importVatNok),
    vatBaseAtCheckoutNok: round(vatBaseAtCheckoutNok), checkoutVatNok: round(checkoutVatNok),
    voecEligibleGoods: voecAllowed, voecAtCheckout, arrivalChargesNok: round(arrivalChargesNok), totalLandedCostNok: round(totalLandedCostNok),
  });
}
