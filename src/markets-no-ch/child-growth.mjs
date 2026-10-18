import { cdcGrowthData } from './cdc-growth-data.mjs';

const DAY_MS = 86_400_000;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}

function monthAnniversary(date, offset) {
  const monthIndex = date.getUTCFullYear() * 12 + date.getUTCMonth() + offset;
  const year = Math.floor(monthIndex / 12); const month = monthIndex % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), lastDay)));
}

export function ageInMonths(birthDate, measurementDate) {
  const birth = validDate(birthDate); const measured = validDate(measurementDate);
  if (!birth || !measured || measured < birth) throw new RangeError('Enter valid dates and a measurement date on or after birth.');
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  if (measurementDate > localToday) throw new RangeError('Measurement date cannot be in the future.');
  let months = (measured.getUTCFullYear() - birth.getUTCFullYear()) * 12 + measured.getUTCMonth() - birth.getUTCMonth();
  if (measured.getUTCDate() < birth.getUTCDate()) months -= 1;
  const anniversary = monthAnniversary(birth, months);
  const next = monthAnniversary(birth, months + 1);
  return months + clamp((measured - anniversary) / Math.max(1, next - anniversary), 0, 0.999999);
}

function normalCdf(z) {
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return (1 + Math.sign(z) * erf) / 2;
}

function chartAge(ageMonths) {
  if (!Number.isFinite(ageMonths) || ageMonths < 24 || ageMonths > 240) throw new RangeError('This reference covers ages 2 through 20 years.');
  if (ageMonths === 240) return 240;
  return ageMonths < 25 ? 24.5 : Math.floor(ageMonths) + 0.5;
}

function findRow(series, sexCode, age) {
  const row = series.find((item) => item[0] === sexCode && item[1] === age);
  if (!row) throw new RangeError('No reference value is available for this age.');
  return row;
}

function percentileFor(row, value) {
  const [, , l, m, s] = row;
  if (!Number.isFinite(value) || value <= 0) throw new RangeError('Measurements must be positive numbers.');
  const z = Math.abs(l) < 1e-8 ? Math.log(value / m) / s : (Math.pow(value / m, l) - 1) / (l * s);
  return { z, percentile: normalCdf(z) * 100 };
}

export function calculateChildGrowth({ birthDate, measurementDate, sex, heightCm, weightKg } = {}) {
  const ageMonths = ageInMonths(birthDate, measurementDate);
  const referenceAge = chartAge(ageMonths);
  if (!['female', 'male'].includes(sex)) throw new RangeError('Choose the sex category used by this reference chart.');
  const sexCode = sex === 'male' ? 1 : 2;
  const height = Number(heightCm); const weight = Number(weightKg);
  if (!Number.isFinite(height) || height < 60 || height > 230 || !Number.isFinite(weight) || weight < 5 || weight > 250) {
    throw new RangeError('Enter plausible height and weight values for the selected age.');
  }
  const bmi = weight / ((height / 100) ** 2);
  const bmiRow = findRow(cdcGrowthData.bmi, sexCode, referenceAge);
  const extendedRow = findRow(cdcGrowthData.bmiExtended, sexCode, referenceAge);
  const legacyBmi = percentileFor(bmiRow, bmi);
  const bmiAboveExtendedRange = bmi >= 60;
  const bmiPercentile = bmi <= extendedRow[14] ? legacyBmi.percentile
    : bmiAboveExtendedRange ? 99.99 : 90 + 10 * normalCdf((bmi - extendedRow[14]) / extendedRow[5]);
  const heightResult = percentileFor(findRow(cdcGrowthData.stature, sexCode, referenceAge), height);
  const weightResult = percentileFor(findRow(cdcGrowthData.weight, sexCode, referenceAge), weight);
  return Object.freeze({ ageMonths, referenceAge, bmi, bmiPercentile, bmiZ: legacyBmi.z,
    heightPercentile: heightResult.percentile, weightPercentile: weightResult.percentile, bmiAboveExtendedRange });
}

export function buildGrowthSeries(records, sex) {
  if (!Array.isArray(records) || records.length < 1 || records.length > 100) throw new RangeError('Add 1–100 measurements.');
  return records.map((record) => ({ ...record, ...calculateChildGrowth({ ...record, sex }) }))
    .sort((a, b) => a.measurementDate.localeCompare(b.measurementDate));
}
