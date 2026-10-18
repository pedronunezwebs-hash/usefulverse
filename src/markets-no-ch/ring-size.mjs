const MM_PER_INCH = 25.4;

function parseLength(value) {
  const source = String(value ?? '').trim().replace(/[\u00a0\u202f\s]/gu, '');
  if (!source) return NaN;
  const normalized = source.includes(',') && !source.includes('.') ? source.replace(',', '.')
    : source.includes(',') && source.includes('.') ? source.replaceAll('.', '').replace(',', '.') : source;
  return Number(normalized);
}

function toMm(value, unit) {
  const number = parseLength(value);
  const factor = unit === 'mm' ? 1 : unit === 'cm' ? 10 : unit === 'in' ? MM_PER_INCH : NaN;
  if (!Number.isFinite(number) || !Number.isFinite(factor) || number <= 0) throw new RangeError('Enter a positive measurement and a supported unit.');
  return number * factor;
}

function fromBasisToCircumference(value, unit, basis) {
  const mm = toMm(value, unit);
  return basis === 'circumference' ? mm : basis === 'diameter' ? mm * Math.PI : NaN;
}

function splitChartLine(line) {
  if (line.includes('\t')) return line.split('\t');
  if (line.includes(';')) return line.split(';');
  return line.split(',');
}

export function parseRingChart(text, { unit = 'mm', basis = 'circumference' } = {}) {
  if (!['mm', 'cm', 'in'].includes(unit) || !['circumference', 'diameter'].includes(basis)) throw new RangeError('Choose a supported chart unit and measurement type.');
  const lines = String(text ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  const rows = [];
  for (const [index, line] of lines.entries()) {
    const cells = splitChartLine(line).map((cell) => cell.trim());
    if (cells.length !== 2) throw new RangeError(`Chart row ${index + 1} must contain one label and one measurement.`);
    const value = parseLength(cells[1]);
    if (!Number.isFinite(value) && index === 0 && rows.length === 0) continue;
    if (!cells[0] || cells[0].length > 80 || !Number.isFinite(value) || value <= 0) throw new RangeError(`Chart row ${index + 1} is invalid.`);
    const circumferenceMm = fromBasisToCircumference(value, unit, basis);
    rows.push({ label: cells[0], value, circumferenceMm, diameterMm: circumferenceMm / Math.PI });
    if (rows.length > 100) throw new RangeError('A chart can contain at most 100 rows.');
  }
  if (rows.some((row, index) => index > 0 && row.circumferenceMm <= rows[index - 1].circumferenceMm)) throw new RangeError('Chart measurements must increase from smallest to largest.');
  return rows;
}

export function calculateRingComparison({ value, unit = 'mm', basis = 'circumference', chart = '', chartUnit = 'mm', chartBasis = 'circumference' } = {}) {
  if (!['circumference', 'diameter'].includes(basis)) throw new RangeError('Choose circumference or inner diameter.');
  const circumferenceMm = fromBasisToCircumference(value, unit, basis);
  if (circumferenceMm < 35 || circumferenceMm > 90) throw new RangeError('Measurement must represent 35–90 mm circumference.');
  const diameterMm = circumferenceMm / Math.PI;
  const rows = parseRingChart(chart, { unit: chartUnit, basis: chartBasis });
  const target = chartBasis === 'circumference' ? circumferenceMm : diameterMm;
  const values = rows.map((row) => chartBasis === 'circumference' ? row.circumferenceMm : row.diameterMm);
  const insideRange = rows.length > 0 && target >= values[0] && target <= values.at(-1);
  const nearest = insideRange ? rows.reduce((best, row, index) => {
    const difference = Math.abs(values[index] - target);
    return !best || difference < best.difference ? { ...row, difference } : best;
  }, null) : null;
  return Object.freeze({ circumferenceMm, diameterMm, chartRows: rows, chartBasis, chartUnit, chartRange: rows.length ? [values[0], values.at(-1)] : null, nearest, outside: rows.length > 0 && !insideRange });
}
