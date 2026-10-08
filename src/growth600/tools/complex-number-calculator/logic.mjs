const MAX_COMPONENT = 1_000_000_000;
const MAX_ANGLE = 1_000_000;
const MIN_ROOT_DEGREE = 2;
const MAX_ROOT_DEGREE = 12;
const OPERATIONS = Object.freeze(['add', 'subtract', 'multiply', 'divide', 'magnitude', 'argument', 'rectangularToPolar', 'polarToRectangular', 'roots']);

function complexError(code) {
  const error = new RangeError(code);
  error.code = code;
  return error;
}

function finiteInput(value, code = 'componentOutOfRange', maximum = MAX_COMPONENT) {
  const text = String(value ?? '').trim();
  if (!text) throw complexError('missingValue');
  const number = Number(text);
  if (!Number.isFinite(number) || Math.abs(number) > maximum) throw complexError(code);
  return number;
}

function readCartesian(real, imaginary) {
  return Object.freeze({
    real: finiteInput(real),
    imaginary: finiteInput(imaginary),
  });
}

function readPolar(radiusInput, angleInput, angleUnit) {
  const radius = finiteInput(radiusInput, 'radiusOutOfRange');
  if (radius < 0) throw complexError('negativeRadius');
  const angle = finiteInput(angleInput, 'angleOutOfRange', MAX_ANGLE);
  if (!['degrees', 'radians'].includes(angleUnit)) throw complexError('invalidAngleUnit');
  const radians = angleUnit === 'degrees' ? angle * Math.PI / 180 : angle;
  return Object.freeze({
    real: radius * Math.cos(radians),
    imaginary: radius * Math.sin(radians),
  });
}

function add(a, b) {
  return { real: a.real + b.real, imaginary: a.imaginary + b.imaginary };
}

function subtract(a, b) {
  return { real: a.real - b.real, imaginary: a.imaginary - b.imaginary };
}

function multiply(a, b) {
  return {
    real: a.real * b.real - a.imaginary * b.imaginary,
    imaginary: a.real * b.imaginary + a.imaginary * b.real,
  };
}

function divide(a, b) {
  if (b.real === 0 && b.imaginary === 0) throw complexError('divisionByZero');
  // Smith's ratio form avoids squaring a very large or very small denominator.
  if (Math.abs(b.real) >= Math.abs(b.imaginary)) {
    const ratio = b.imaginary / b.real;
    const denominator = b.real + b.imaginary * ratio;
    return {
      real: (a.real + a.imaginary * ratio) / denominator,
      imaginary: (a.imaginary - a.real * ratio) / denominator,
    };
  }
  const ratio = b.real / b.imaginary;
  const denominator = b.imaginary + b.real * ratio;
  return {
    real: (a.real * ratio + a.imaginary) / denominator,
    imaginary: (a.imaginary * ratio - a.real) / denominator,
  };
}

function describe(value, angleUnit) {
  const radius = Math.hypot(value.real, value.imaginary);
  const angleDefined = radius !== 0;
  const radians = angleDefined ? Math.atan2(value.imaginary, value.real) : null;
  // Use the conventional principal interval (-π, π], mapping negative zero on
  // the negative real axis to +π so the displayed branch is deterministic.
  const principalRadians = radians === null ? null : radians <= -Math.PI ? Math.PI : radians;
  return Object.freeze({
    real: value.real,
    imaginary: value.imaginary,
    modulus: radius,
    angleDefined,
    argument: principalRadians === null ? null : angleUnit === 'degrees' ? principalRadians * 180 / Math.PI : principalRadians,
    angleUnit,
  });
}

function assertFiniteResult(value) {
  if (![value.real, value.imaginary].every(Number.isFinite)) throw complexError('resultOutOfRange');
  return value;
}

function readDegree(value) {
  const degree = Number(value);
  if (!Number.isInteger(degree) || degree < MIN_ROOT_DEGREE || degree > MAX_ROOT_DEGREE) throw complexError('invalidRootDegree');
  return degree;
}

function rootsOf(value, degree, angleUnit) {
  const order = readDegree(degree);
  const radius = Math.hypot(value.real, value.imaginary);
  const rootRadius = radius ** (1 / order);
  const baseAngle = radius === 0 ? 0 : Math.atan2(value.imaginary, value.real);
  return Array.from({ length: order }, (_, index) => {
    const angle = (baseAngle + 2 * Math.PI * index) / order;
    const result = assertFiniteResult({ real: rootRadius * Math.cos(angle), imaginary: rootRadius * Math.sin(angle) });
    return describe(result, angleUnit);
  });
}

export function calculateComplexOperation({ operation, realA, imaginaryA, realB, imaginaryB, radius, angle, degree, angleUnit = 'degrees' }) {
  if (!OPERATIONS.includes(operation)) throw complexError('invalidOperation');
  if (!['degrees', 'radians'].includes(angleUnit)) throw complexError('invalidAngleUnit');
  let a;
  let b;
  if (operation === 'polarToRectangular') {
    a = readPolar(radius, angle, angleUnit);
  } else {
    a = readCartesian(realA, imaginaryA);
  }

  if (operation === 'roots') {
    const roots = rootsOf(a, degree, angleUnit);
    return Object.freeze({ operation, input: describe(a, angleUnit), roots: Object.freeze(roots) });
  }
  if (operation === 'magnitude') return Object.freeze({ operation, input: describe(a, angleUnit), value: Math.hypot(a.real, a.imaginary) });
  if (operation === 'argument') {
    const input = describe(a, angleUnit);
    if (!input.angleDefined) throw complexError('zeroArgument');
    return Object.freeze({ operation, input, value: input.argument, angleUnit });
  }
  if (operation === 'rectangularToPolar') {
    const input = describe(a, angleUnit);
    if (!input.angleDefined) return Object.freeze({ operation, input, value: Object.freeze({ radius: 0, angle: null, angleUnit }) });
    return Object.freeze({ operation, input, value: Object.freeze({ radius: input.modulus, angle: input.argument, angleUnit }) });
  }
  if (operation === 'polarToRectangular') {
    const result = assertFiniteResult(a);
    return Object.freeze({ operation, result: describe(result, angleUnit) });
  }

  b = readCartesian(realB, imaginaryB);
  let result;
  switch (operation) {
    case 'add': result = add(a, b); break;
    case 'subtract': result = subtract(a, b); break;
    case 'multiply': result = multiply(a, b); break;
    case 'divide': result = divide(a, b); break;
    default: throw complexError('invalidOperation');
  }
  assertFiniteResult(result);
  return Object.freeze({ operation, result: describe(result, angleUnit), inputA: describe(a, angleUnit), inputB: describe(b, angleUnit) });
}
