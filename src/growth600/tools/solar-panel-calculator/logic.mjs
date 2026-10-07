const CURRENCY_CODES = new Set(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'BRL', 'INR']);

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} must be from ${min} to ${max}.`);
  return value;
}

export function calculateSolarPanel({
  mode = 'production', panelCount = 1, dailyTargetKwh = null, panelWatts, peakSunHours, lossPercent = 0,
  panelLengthM = null, panelWidthM = null, electricityRate = null, systemCost = null, currency = 'USD',
} = {}) {
  if (!['production', 'sizing'].includes(mode)) throw new RangeError('Choose production or sizing mode.');
  const watts = bounded('Panel rating', panelWatts, 50, 2000);
  const sunHours = bounded('Peak sun hours', peakSunHours, 0.1, 14);
  const losses = bounded('System losses', lossPercent, 0, 60);
  const target = dailyTargetKwh === null ? null : bounded('Daily energy target', dailyTargetKwh, 0.1, 1000);
  if (mode === 'sizing' && target === null) throw new RangeError('Enter a daily energy target for sizing mode.');
  if (mode === 'production' && target !== null) throw new RangeError('Daily target is only used in sizing mode.');

  let count;
  if (mode === 'production') {
    bounded('Panel count', panelCount, 1, 10_000);
    if (!Number.isInteger(panelCount)) throw new RangeError('Panel count must be a whole number.');
    count = panelCount;
  } else {
    const energyPerPanel = watts / 1000 * sunHours * (1 - losses / 100);
    count = Math.ceil(target / energyPerPanel - 1e-12);
    if (!Number.isSafeInteger(count) || count < 1 || count > 10_000) throw new RangeError('The required panel count is outside the supported range.');
  }

  const panelAreaValues = [panelLengthM, panelWidthM];
  if (panelAreaValues.some((value) => value !== null) && panelAreaValues.some((value) => value === null)) {
    throw new RangeError('Enter both panel dimensions or leave both blank.');
  }
  if (panelLengthM !== null) bounded('Panel length', panelLengthM, 0.2, 5);
  if (panelWidthM !== null) bounded('Panel width', panelWidthM, 0.2, 5);

  const rate = electricityRate === null ? null : bounded('Electricity rate', electricityRate, 0, 100);
  const installedCost = systemCost === null ? null : bounded('System cost', systemCost, 0, 1_000_000_000);
  if ((rate !== null || installedCost !== null) && !CURRENCY_CODES.has(currency)) throw new RangeError('Choose a supported currency.');

  const systemSizeKw = count * watts / 1000;
  const dailyProductionKwh = systemSizeKw * sunHours * (1 - losses / 100);
  const monthlyProductionKwh = dailyProductionKwh * (365 / 12);
  const annualProductionKwh = dailyProductionKwh * 365;
  const panelAreaM2 = panelLengthM === null ? null : count * panelLengthM * panelWidthM;
  const annualBillOffset = rate === null ? null : annualProductionKwh * rate;
  const simplePaybackYears = installedCost === null || annualBillOffset === null || annualBillOffset <= 0
    ? null
    : installedCost / annualBillOffset;
  if (![systemSizeKw, dailyProductionKwh, monthlyProductionKwh, annualProductionKwh, ...(panelAreaM2 === null ? [] : [panelAreaM2]), ...(annualBillOffset === null ? [] : [annualBillOffset]), ...(simplePaybackYears === null ? [] : [simplePaybackYears])].every(Number.isFinite)) {
    throw new RangeError('The requested estimate is too large to calculate.');
  }

  return Object.freeze({
    mode, panelCount: count, panelWatts: watts, systemSizeKw, peakSunHours: sunHours, lossPercent: losses,
    dailyTargetKwh: target, dailyProductionKwh, monthlyProductionKwh, annualProductionKwh,
    panelAreaM2, annualBillOffset, simplePaybackYears, electricityRate: rate, systemCost: installedCost,
    currency: rate === null && installedCost === null ? null : currency,
  });
}
