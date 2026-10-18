export const FOOT_LENGTH_LIMITS_MM = Object.freeze({ min: 50, max: 400 });
const MM_PER_INCH = 25.4;

export function toMillimeters(value, unit = 'mm') {
  const length = Number(value);
  if (!Number.isFinite(length) || length <= 0) throw new RangeError('Enter a positive foot length.');
  const factor = unit === 'mm' ? 1 : unit === 'cm' ? 10 : unit === 'in' ? MM_PER_INCH : NaN;
  if (!Number.isFinite(factor)) throw new RangeError('Choose millimetres, centimetres or inches.');
  const millimeters = length * factor;
  if (millimeters < FOOT_LENGTH_LIMITS_MM.min || millimeters > FOOT_LENGTH_LIMITS_MM.max) throw new RangeError('Foot length is outside the supported 50–400 mm range.');
  return millimeters;
}

function numberFromCell(value) {
  const normalized = String(value).trim().replace(',', '.');
  if (!/^\d{1,3}(?:\.\d{1,2})?$/u.test(normalized)) return NaN;
  return Number(normalized);
}

/** Parse only the chart the person supplies; no copyrighted conversion table is bundled. */
export function parseFootwearChart(text, { unit = 'mm' } = {}) {
  if (typeof text !== 'string' || text.length > 20_000) throw new RangeError('Enter a chart of at most 20,000 characters.');
  const rows = [];
  for (const line of text.split(/\r?\n/u).map((value) => value.trim()).filter(Boolean)) {
    const delimiter = line.includes('\t') ? '\t' : line.includes(';') ? ';' : ',';
    const cells = line.split(delimiter).map((value) => value.trim());
    if (cells.length !== 2) throw new TypeError('Use two columns: size label and corresponding length.');
    if (!rows.length && /\p{L}/u.test(cells[0]) && /\p{L}/u.test(cells[1]) && !/\d/u.test(cells[1]) && !Number.isFinite(numberFromCell(cells[1]))) continue;
    if (/^(?:size|talla|størrelse|größe|pointure)$/iu.test(cells[0]) && /(?:length|läng|long|cm|mm|foot|pie|fuß|pied)/iu.test(cells[1])) continue;
    if (!cells[0] || cells[0].length > 32) throw new TypeError('Each chart row needs a short size label.');
    const length = toMillimeters(numberFromCell(cells[1]), unit);
    rows.push(Object.freeze({ label: cells[0], lengthMm: length }));
  }
  if (rows.length < 2 || rows.length > 100) throw new RangeError('Enter between 2 and 100 shoe chart rows.');
  if (new Set(rows.map(({ label }) => label.toLowerCase())).size !== rows.length) throw new TypeError('Size labels must be unique.');
  if (rows.some((row, index) => index > 0 && row.lengthMm < rows[index - 1].lengthMm)) throw new TypeError('Chart lengths must not decrease from top to bottom.');
  return Object.freeze(rows);
}

export function compareFootLengths({ left, right, unit = 'mm', chartText, chartUnit = 'mm', chartBasis = 'foot', allowanceMm = 0 } = {}) {
  const leftMm = toMillimeters(left, unit);
  const rightMm = toMillimeters(right, unit);
  const longerFootMm = Math.max(leftMm, rightMm);
  const allowance = Number(allowanceMm);
  if (!Number.isFinite(allowance) || allowance < 0 || allowance > 30) throw new RangeError('Choose a toe allowance from 0 to 30 mm.');
  if (!['foot', 'inside'].includes(chartBasis)) throw new RangeError('Choose whether chart lengths describe the foot or shoe interior.');
  const chart = parseFootwearChart(chartText, { unit: chartUnit });
  const targetMm = longerFootMm + (chartBasis === 'inside' ? allowance : 0);
  const match = chart.reduce((best, row) => Math.abs(row.lengthMm - targetMm) < Math.abs(best.lengthMm - targetMm) ? row : best);
  return Object.freeze({
    leftMm, rightMm, longerFootMm, targetMm,
    mondopointLengthMm: Math.round(longerFootMm),
    chartBasis, allowanceMm: chartBasis === 'inside' ? allowance : 0,
    match: Object.freeze({ ...match, differenceMm: Math.abs(match.lengthMm - targetMm) }),
    chartRange: Object.freeze({ minMm: chart[0].lengthMm, maxMm: chart.at(-1).lengthMm }),
    outsideChartRange: targetMm < chart[0].lengthMm || targetMm > chart.at(-1).lengthMm,
  });
}
