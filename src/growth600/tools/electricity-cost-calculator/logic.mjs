const POWER_TO_KW = Object.freeze({ W: 0.001, kW: 1 });

function bounded(name, value, min, max, integer = false) {
  if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateElectricityCost({ appliances = [], ratePerKwh, billingDays = 30, fixedCharge = 0 } = {}) {
  bounded('Billing period', billingDays, 1, 31, true);
  bounded('Electricity rate', ratePerKwh, 0, 1_000_000);
  bounded('Fixed charge', fixedCharge, 0, 1_000_000);
  if (!Array.isArray(appliances) || appliances.length > 4) throw new RangeError('Use at most four appliances.');

  const included = appliances.map((item, index) => {
    const values = [item?.power, item?.quantity, item?.hoursPerDay, item?.activeDays];
    const name = String(item?.name ?? '').trim();
    const empty = [...values, name].every((value) => value === null || value === undefined || value === '');
    if (empty) return null;
    if (values.some((value) => value === null || value === undefined || value === '')) throw new RangeError(`Complete every value for appliance ${index + 1}.`);
    const factor = POWER_TO_KW[item.powerUnit];
    if (!factor) throw new TypeError('Choose W or kW for appliance power.');
    const power = bounded(`Appliance ${index + 1} power`, item.power, 0.01, 10_000_000) * factor;
    const quantity = bounded(`Appliance ${index + 1} quantity`, item.quantity, 1, 10_000, true);
    const hoursPerDay = bounded(`Appliance ${index + 1} hours`, item.hoursPerDay, 0, 24);
    const activeDays = bounded(`Appliance ${index + 1} active days`, item.activeDays, 0, billingDays, true);
    const energyKwh = power * quantity * hoursPerDay * activeDays;
    return Object.freeze({
      name: name.slice(0, 60) || `Appliance ${index + 1}`,
      powerKw: power,
      quantity,
      hoursPerDay,
      activeDays,
      energyKwh,
      energyCost: energyKwh * ratePerKwh,
    });
  }).filter(Boolean);

  if (!included.length) throw new RangeError('Enter at least one appliance.');
  const energyKwh = included.reduce((sum, item) => sum + item.energyKwh, 0);
  const energyCost = energyKwh * ratePerKwh;
  const totalCost = energyCost + fixedCharge;
  const averageDailyKwh = energyKwh / billingDays;
  return Object.freeze({
    appliances: Object.freeze(included), billingDays, ratePerKwh, fixedCharge,
    energyKwh, energyCost, totalCost, averageDailyKwh, averageDailyCost: totalCost / billingDays,
  });
}
