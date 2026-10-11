const MAX_DIMENSION = 8;
const MAX_ENTRY = 1_000_000;
const SYMMETRY_TOLERANCE = 1e-10;
const CONVERGENCE_TOLERANCE = 1e-12;

function fail(code) {
  const error = new RangeError(code);
  error.code = code;
  throw error;
}

export function parseSymmetricMatrix(input) {
  const text = String(input ?? '').trim();
  if (!text) fail('emptyMatrix');
  const rows = text.split(/\r?\n/u).map((row) => row.trim()).filter(Boolean)
    .map((row) => row.split(/[\s,;]+/u).filter(Boolean).map((token) => {
      const value = Number(token);
      if (!Number.isFinite(value) || Math.abs(value) > MAX_ENTRY) fail('invalidEntry');
      return value;
    }));
  if (rows.length < 2 || rows.length > MAX_DIMENSION) fail('invalidSize');
  if (rows.some((row) => row.length !== rows.length)) fail('notSquare');
  let scale = 1;
  for (const row of rows) for (const value of row) scale = Math.max(scale, Math.abs(value));
  for (let i = 0; i < rows.length; i += 1) for (let j = i + 1; j < rows.length; j += 1) {
    if (Math.abs(rows[i][j] - rows[j][i]) > SYMMETRY_TOLERANCE * scale) fail('notSymmetric');
  }
  return rows;
}

export function calculateEigenpairs(input) {
  const source = Array.isArray(input) ? input.map((row) => [...row]) : parseSymmetricMatrix(input);
  const n = source.length;
  if (n < 2 || n > MAX_DIMENSION || source.some((row) => row.length !== n)) fail('invalidSize');
  let scale = 0;
  for (const row of source) for (const value of row) {
    if (!Number.isFinite(value) || Math.abs(value) > MAX_ENTRY) fail('invalidEntry');
    scale = Math.max(scale, Math.abs(value));
  }
  scale ||= 1;
  const a = source.map((row) => row.map((value) => value / scale));
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) {
    if (Math.abs(a[i][j] - a[j][i]) > SYMMETRY_TOLERANCE) fail('notSymmetric');
    const average = (a[i][j] + a[j][i]) / 2;
    a[i][j] = average; a[j][i] = average;
  }
  const vectors = Array.from({ length: n }, (_, row) => Array.from({ length: n }, (_, col) => Number(row === col)));
  const maxIterations = 100 * n * n;
  let converged = false;
  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    let p = 0; let q = 1; let largest = 0; let diagonalScale = 1;
    for (let i = 0; i < n; i += 1) {
      diagonalScale = Math.max(diagonalScale, Math.abs(a[i][i]));
      for (let j = i + 1; j < n; j += 1) if (Math.abs(a[i][j]) > largest) { largest = Math.abs(a[i][j]); p = i; q = j; }
    }
    if (largest <= CONVERGENCE_TOLERANCE * diagonalScale) { converged = true; break; }
    const tau = (a[q][q] - a[p][p]) / (2 * a[p][q]);
    const t = (tau < 0 ? -1 : 1) / (Math.abs(tau) + Math.hypot(1, tau));
    const c = 1 / Math.hypot(1, t); const s = t * c;
    const app = a[p][p]; const aqq = a[q][q]; const apq = a[p][q];
    a[p][p] = app - t * apq; a[q][q] = aqq + t * apq; a[p][q] = 0; a[q][p] = 0;
    for (let k = 0; k < n; k += 1) {
      if (k !== p && k !== q) {
        const akp = a[k][p]; const akq = a[k][q];
        a[k][p] = c * akp - s * akq; a[p][k] = a[k][p];
        a[k][q] = s * akp + c * akq; a[q][k] = a[k][q];
      }
      const vkp = vectors[k][p]; const vkq = vectors[k][q];
      vectors[k][p] = c * vkp - s * vkq; vectors[k][q] = s * vkp + c * vkq;
    }
  }
  if (!converged) fail('didNotConverge');
  const eigenpairs = Array.from({ length: n }, (_, col) => {
    const vector = vectors.map((row) => row[col]);
    const pivot = vector.reduce((best, value, index) => Math.abs(value) > Math.abs(vector[best]) ? index : best, 0);
    if (vector[pivot] < 0) for (let i = 0; i < n; i += 1) vector[i] *= -1;
    const eigenvalue = a[col][col] * scale;
    const residual = Math.hypot(...source.map((row, i) => row.reduce((sum, value, j) => sum + value * vector[j], 0) - eigenvalue * vector[i]));
    return { eigenvalue, eigenvector: vector, residual };
  }).sort((left, right) => left.eigenvalue - right.eigenvalue);
  return { dimension: n, eigenpairs, method: 'Jacobi rotations for real symmetric matrices' };
}
