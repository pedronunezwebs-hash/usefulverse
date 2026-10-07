const HEAT_OUTPUT_TO_KW = Object.freeze({ kW: 1, 'BTU/h': 1 / 3412.141633 });

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateHeatPump({ heatOutput, heatOutputUnit = 'kW', cop, electricityRatePerKwh, hoursPerDay, currency = 'USD' } = {}) {
  const outputFactor = HEAT_OUTPUT_TO_KW[heatOutputUnit];
  if (!outputFactor) throw new TypeError('Choose kW or BTU/h as the heat-output unit.');
  if (!/^[A-Za-z]{3}$/u.test(currency)) throw new TypeError('Currency must be a three-letter code.');
  const heatOutputKw = bounded('Heat output', heatOutput, 0, 10_000_000) * outputFactor;
  const coefficientOfPerformance = bounded('COP', cop, 0.1, 30);
  const electricityRate = bounded('Electricity rate', electricityRatePerKwh, 0, 1_000_000);
  const dailyHours = bounded('Operating hours per day', hoursPerDay, 0, 24);
  const electricalInputKw = heatOutputKw / coefficientOfPerformance;
  const dailyEnergyKwh = electricalInputKw * dailyHours;
  const resistanceDailyEnergyKwh = heatOutputKw * dailyHours;
  const dailyCost = dailyEnergyKwh * electricityRate;
  const resistanceDailyCost = resistanceDailyEnergyKwh * electricityRate;
  return Object.freeze({
    heatOutputKw,
    heatOutputBtuPerHour: heatOutputKw * 3412.141633,
    heatOutputUnit,
    cop: coefficientOfPerformance,
    electricalInputKw,
    dailyHours,
    dailyEnergyKwh,
    monthlyEnergyKwh: dailyEnergyKwh * 30,
    dailyCost,
    monthlyCost: dailyCost * 30,
    resistanceDailyEnergyKwh,
    resistanceMonthlyEnergyKwh: resistanceDailyEnergyKwh * 30,
    resistanceDailyCost,
    resistanceMonthlyCost: resistanceDailyCost * 30,
    dailyEnergyDifferenceKwh: resistanceDailyEnergyKwh - dailyEnergyKwh,
    dailyCostDifference: resistanceDailyCost - dailyCost,
    currency: currency.toUpperCase(),
  });
}
