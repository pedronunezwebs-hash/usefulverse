const MAX_ROWS = 8;
const MAX_COLUMNS = 8;
const MAX_ABSOLUTE_VALUE = 1e6;
const MAX_JACOBI_STEPS = 512;

export function parseSvdMatrix(source) {
  const text = String(source ?? '').replace(/[٠-٩۰-۹]/gu, (digit) => {
    const code = digit.codePointAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  }).replace(/[−–]/gu, '-').trim();
  if (!text) throw new RangeError('Enter a matrix with one row per line.');
  const lines = text.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2 || lines.length > MAX_ROWS) throw new RangeError(`Use between 2 and ${MAX_ROWS} rows.`);
  const matrix = lines.map((line) => {
    const tokens = line.split(/[\s,،]+/u).filter(Boolean);
    if (tokens.length < 2 || tokens.length > MAX_COLUMNS) throw new RangeError(`Use between 2 and ${MAX_COLUMNS} columns.`);
    return tokens.map((token) => {
      if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/iu.test(token)) throw new SyntaxError('Use finite decimal numbers separated by commas or spaces.');
      const value = Number(token);
      if (!Number.isFinite(value) || Math.abs(value) > MAX_ABSOLUTE_VALUE) throw new RangeError('Each value must be between −1,000,000 and 1,000,000.');
      return value;
    });
  });
  const columns = matrix[0].length;
  if (matrix.some((row) => row.length !== columns)) throw new RangeError('Every row must have the same number of values.');
  return matrix;
}

function symmetricJacobi(matrix) {
  const size = matrix.length;
  const a = matrix.map((row) => [...row]);
  const vectors = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => Number(row === column)));
  let converged = size < 2;
  for (let step = 0; step < MAX_JACOBI_STEPS && !converged; step += 1) {
    let p = 0, q = 1, largest = Math.abs(a[0][1]);
    for (let row = 0; row < size; row += 1) for (let column = row + 1; column < size; column += 1) {
      const magnitude = Math.abs(a[row][column]);
      if (magnitude > largest) { largest = magnitude; p = row; q = column; }
    }
    if (largest <= 1e-14) { converged = true; break; }
    const apq = a[p][q];
    const tau = (a[q][q] - a[p][p]) / (2 * apq);
    const t = (tau < 0 ? -1 : 1) / (Math.abs(tau) + Math.hypot(1, tau));
    const cosine = 1 / Math.hypot(1, t), sine = t * cosine;
    const app = a[p][p], aqq = a[q][q];
    a[p][p] = app - t * apq;
    a[q][q] = aqq + t * apq;
    a[p][q] = 0; a[q][p] = 0;
    for (let index = 0; index < size; index += 1) {
      if (index !== p && index !== q) {
        const aip = a[index][p], aiq = a[index][q];
        a[index][p] = cosine * aip - sine * aiq;
        a[p][index] = a[index][p];
        a[index][q] = sine * aip + cosine * aiq;
        a[q][index] = a[index][q];
      }
      const vip = vectors[index][p], viq = vectors[index][q];
      vectors[index][p] = cosine * vip - sine * viq;
      vectors[index][q] = sine * vip + cosine * viq;
    }
  }
  if (!converged) throw new Error('The numerical decomposition did not converge. Try a smaller matrix.');
  return { values: a.map((row, index) => row[index]), vectors };
}

export function calculateSvd(source) {
  const input = Array.isArray(source) ? source.map((row) => [...row]) : parseSvdMatrix(source);
  const rows = input.length, columns = input[0]?.length;
  if (!Number.isInteger(rows) || !Number.isInteger(columns) || rows < 2 || rows > MAX_ROWS || columns < 2 || columns > MAX_COLUMNS || input.some((row) => row.length !== columns || row.some((value) => !Number.isFinite(value) || Math.abs(value) > MAX_ABSOLUTE_VALUE))) {
    throw new RangeError('Use a rectangular matrix with 2–8 rows and 2–8 columns, with finite bounded values.');
  }
  const scale = Math.max(1, ...input.flat().map(Math.abs));
  const normalized = input.map((row) => row.map((value) => value / scale));
  const gram = Array.from({ length: columns }, (_, left) => Array.from({ length: columns }, (_, right) => normalized.reduce((sum, row) => sum + row[left] * row[right], 0)));
  const eigen = symmetricJacobi(gram);
  const order = eigen.values.map((value, index) => ({ value: Math.max(0, value), index })).sort((left, right) => right.value - left.value).slice(0, Math.min(rows, columns));
  const singularValues = order.map(({ value }) => Math.sqrt(value) * scale);
  const maxSingular = singularValues[0] ?? 0;
  const threshold = maxSingular * Math.max(rows, columns) * Number.EPSILON * 64;
  const v = Array.from({ length: columns }, (_, row) => order.map(({ index }) => eigen.vectors[row][index]));
  const uColumns = [];
  for (let component = 0; component < order.length; component += 1) {
    const sigma = singularValues[component];
    let candidate = sigma > threshold ? normalized.map((row) => row.reduce((sum, value, column) => sum + value * v[column][component], 0) / (sigma / scale)) : null;
    if (candidate) {
      for (const previous of uColumns) {
        const projection = candidate.reduce((sum, value, row) => sum + value * previous[row], 0);
        candidate = candidate.map((value, row) => value - projection * previous[row]);
      }
      const norm = Math.hypot(...candidate);
      candidate = norm > 1e-10 ? candidate.map((value) => value / norm) : null;
    }
    if (!candidate) {
      singularValues[component] = 0;
      for (let basis = 0; basis < rows && !candidate; basis += 1) {
        const orthogonal = Array.from({ length: rows }, (_, row) => Number(row === basis));
        for (const previous of uColumns) {
          const projection = orthogonal.reduce((sum, value, row) => sum + value * previous[row], 0);
          for (let row = 0; row < rows; row += 1) orthogonal[row] -= projection * previous[row];
        }
        const norm = Math.hypot(...orthogonal);
        if (norm > 1e-10) candidate = orthogonal.map((value) => value / norm);
      }
      if (!candidate) throw new Error('Could not complete the orthogonal left-vector basis.');
    }
    uColumns.push(candidate);
  }
  const rank = singularValues.filter((value) => value > threshold).length;
  const u = Array.from({ length: rows }, (_, row) => uColumns.map((column) => column[row]));
  const vt = order.map((_, component) => Array.from({ length: columns }, (_, column) => v[column][component]));
  const reconstruction = Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => u[row].reduce((sum, value, component) => sum + value * singularValues[component] * vt[component][column], 0)));
  const residual = Math.hypot(...input.flatMap((row, index) => row.map((value, column) => value - reconstruction[index][column])));
  const inputNorm = Math.hypot(...input.flat());
  return Object.freeze({
    input: Object.freeze(input.map((row) => Object.freeze(row))),
    u: Object.freeze(u.map((row) => Object.freeze(row))),
    singularValues: Object.freeze(singularValues),
    vt: Object.freeze(vt.map((row) => Object.freeze(row))),
    reconstruction: Object.freeze(reconstruction.map((row) => Object.freeze(row))),
    rows, columns, compactDimension: singularValues.length, rank, residualFrobenius: residual,
    relativeReconstructionError: inputNorm === 0 ? 0 : residual / inputNorm,
    rankTolerance: threshold,
  });
}

export const SVD_LIMITS = Object.freeze({ maxRows: MAX_ROWS, maxColumns: MAX_COLUMNS, maxAbsoluteValue: MAX_ABSOLUTE_VALUE });
