function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateEvCharging({ batteryCapacityKwh, startSocPercent, targetSocPercent, chargerPowerKw, efficiencyPercent = 100, electricityRatePerKwh = null, currency = 'USD' } = {}) {
  const capacity = bounded('Battery capacity', batteryCapacityKwh, 0.001, 1_000_000);
  const start = bounded('Starting state of charge', startSocPercent, 0, 100);
  const target = bounded('Target state of charge', targetSocPercent, 0, 100);
  if (target < start) throw new RangeError('Target charge must be at least the starting charge.');
  const power = bounded('Charger power', chargerPowerKw, 0.001, 1_000_000);
  const efficiency = bounded('Charging efficiency', efficiencyPercent, 0.1, 100);
  const batteryEnergyKwh = capacity * (target - start) / 100;
  const gridEnergyKwh = batteryEnergyKwh / (efficiency / 100);
  const chargingHours = gridEnergyKwh / power;
  let estimatedCost = null;
  if (electricityRatePerKwh !== null && electricityRatePerKwh !== undefined) {
    const rate = bounded('Electricity rate', electricityRatePerKwh, 0, 1_000_000);
    if (!/^[A-Z]{3}$/u.test(currency)) throw new TypeError('Enter a three-letter currency code, such as USD or EUR.');
    estimatedCost = gridEnergyKwh * rate;
  }
  if (![batteryEnergyKwh, gridEnergyKwh, chargingHours, estimatedCost ?? 0].every(Number.isFinite)) throw new RangeError('The requested charge estimate is too large.');
  return Object.freeze({ batteryCapacityKwh: capacity, startSocPercent: start, targetSocPercent: target, chargerPowerKw: power, efficiencyPercent: efficiency, batteryEnergyKwh, gridEnergyKwh, chargingHours, chargingMinutes: chargingHours * 60, electricityRatePerKwh, currency, estimatedCost });
}
