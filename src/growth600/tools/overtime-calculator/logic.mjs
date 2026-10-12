export const OVERTIME_LIMITS = Object.freeze({ maxWeeklyHours: 168, maxThresholdHours: 168, maxHourlyRate: 1_000_000, maxMultiplier: 5 });

export function calculateOvertime({ totalHours, hourlyRate, thresholdHours, overtimeMultiplier }) {
  const values = { totalHours: Number(totalHours), hourlyRate: Number(hourlyRate), thresholdHours: Number(thresholdHours), overtimeMultiplier: Number(overtimeMultiplier) };
  if (Object.values(values).some((value) => !Number.isFinite(value))) throw new RangeError('Enter finite numbers.');
  const { totalHours: hours, hourlyRate: rate, thresholdHours: threshold, overtimeMultiplier: multiplier } = values;
  if (hours < 0 || hours > OVERTIME_LIMITS.maxWeeklyHours) throw new RangeError('Weekly hours must be between 0 and 168.');
  if (threshold < 0 || threshold > OVERTIME_LIMITS.maxThresholdHours) throw new RangeError('The user-entered threshold must be between 0 and 168 hours.');
  if (rate < 0 || rate > OVERTIME_LIMITS.maxHourlyRate) throw new RangeError('Hourly rate is outside the supported range.');
  if (multiplier < 1 || multiplier > OVERTIME_LIMITS.maxMultiplier) throw new RangeError('The multiplier must be from 1 to 5.');
  const regularHours = Math.min(hours, threshold);
  const overtimeHours = Math.max(0, hours - threshold);
  const regularPay = regularHours * rate;
  const overtimePay = overtimeHours * rate * multiplier;
  return Object.freeze({
    totalHours: hours, regularHours, overtimeHours, hourlyRate: rate, thresholdHours: threshold, overtimeMultiplier: multiplier,
    regularPay, overtimePay, totalPay: regularPay + overtimePay,
    blendedHourlyRate: hours === 0 ? null : (regularPay + overtimePay) / hours,
  });
}
