const MAX_COMPONENT = 1_000_000_000;

function vectorError(code) {
  const error = new RangeError(code);
  error.code = code;
  return error;
}

function readVector(values, dimension) {
  if (!Array.isArray(values) || values.length < dimension) throw vectorError('missingComponent');
  const vector = values.slice(0, dimension).map((value) => {
    const text = String(value ?? '').trim();
    if (!text) throw vectorError('missingComponent');
    const number = Number(text);
    if (!Number.isFinite(number) || Math.abs(number) > MAX_COMPONENT) {
      throw vectorError('componentOutOfRange');
    }
    return number;
  });
  return vector;
}

function dot(a, b) {
  return a.reduce((sum, component, index) => sum + component * b[index], 0);
}

function norm(vector) {
  return Math.hypot(...vector);
}

export function calculateVectorOperation({ dimension, operation, vectorA, vectorB }) {
  if (![2, 3].includes(Number(dimension))) throw vectorError('invalidDimension');
  const size = Number(dimension);
  const a = readVector(vectorA, size);
  const b = readVector(vectorB, size);
  const magnitudeA = norm(a);
  const magnitudeB = norm(b);
  let result;
  let kind = 'scalar';

  switch (operation) {
    case 'add': result = a.map((value, index) => value + b[index]); kind = 'vector'; break;
    case 'subtract': result = a.map((value, index) => value - b[index]); kind = 'vector'; break;
    case 'dot': result = dot(a, b); break;
    case 'cross':
      result = size === 2
        ? a[0] * b[1] - a[1] * b[0]
        : [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      kind = size === 2 ? 'z-component' : 'vector';
      break;
    case 'magnitudeA': result = magnitudeA; break;
    case 'magnitudeB': result = magnitudeB; break;
    case 'normalizeA':
      if (magnitudeA === 0) throw vectorError('zeroNormalize');
      result = a.map((value) => value / magnitudeA); kind = 'vector'; break;
    case 'normalizeB':
      if (magnitudeB === 0) throw vectorError('zeroNormalize');
      result = b.map((value) => value / magnitudeB); kind = 'vector'; break;
    case 'angle':
      if (magnitudeA === 0 || magnitudeB === 0) throw vectorError('zeroAngle');
      result = Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (magnitudeA * magnitudeB)))) * 180 / Math.PI;
      break;
    case 'projection':
      if (magnitudeB === 0) throw vectorError('zeroProjection');
      result = b.map((value) => value * dot(a, b) / (magnitudeB ** 2)); kind = 'vector'; break;
    default: throw vectorError('invalidOperation');
  }

  const values = kind === 'vector' ? result : [result];
  if (!values.every(Number.isFinite)) throw vectorError('resultOutOfRange');
  return Object.freeze({
    dimension: size,
    operation,
    kind,
    result: Object.freeze(Array.isArray(result) ? result : [result]),
    magnitudeA,
    magnitudeB,
    dotProduct: dot(a, b),
  });
}
