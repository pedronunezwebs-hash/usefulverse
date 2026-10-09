const SHAPES = new Set(['rectangle', 'circle', 'hollow-rectangle', 'hollow-circle', 'triangle']);

function positive(name, value) {
  if (!Number.isFinite(value) || value <= 0 || value > 1e6) throw new RangeError(`${name} must be greater than zero and at most 1,000,000.`);
  return value;
}

export function calculateSectionProperties({ shape = 'rectangle', width, height, diameter, outerWidth, outerHeight, innerWidth, innerHeight, outerDiameter, innerDiameter } = {}) {
  if (!SHAPES.has(shape)) throw new TypeError('Choose a supported section shape.');
  let area; let centroidX; let centroidY; let ix; let iy; let extremeTop; let extremeBottom;
  if (shape === 'rectangle') {
    const b = positive('Width', width); const h = positive('Height', height);
    area = b * h; centroidX = b / 2; centroidY = h / 2; ix = b * h ** 3 / 12; iy = h * b ** 3 / 12;
    extremeTop = extremeBottom = h / 2;
  } else if (shape === 'circle') {
    const d = positive('Diameter', diameter); const r = d / 2;
    area = Math.PI * r ** 2; centroidX = centroidY = r; ix = iy = Math.PI * d ** 4 / 64;
    extremeTop = extremeBottom = r;
  } else if (shape === 'hollow-rectangle') {
    const b = positive('Outer width', outerWidth); const h = positive('Outer height', outerHeight);
    const bi = positive('Inner width', innerWidth); const hi = positive('Inner height', innerHeight);
    if (bi >= b || hi >= h) throw new RangeError('Inner dimensions must be smaller than outer dimensions.');
    area = b * h - bi * hi; centroidX = b / 2; centroidY = h / 2;
    ix = (b * h ** 3 - bi * hi ** 3) / 12; iy = (h * b ** 3 - hi * bi ** 3) / 12;
    extremeTop = extremeBottom = h / 2;
  } else if (shape === 'hollow-circle') {
    const outer = positive('Outer diameter', outerDiameter); const inner = positive('Inner diameter', innerDiameter);
    if (inner >= outer) throw new RangeError('Inner diameter must be smaller than outer diameter.');
    area = Math.PI * (outer ** 2 - inner ** 2) / 4; centroidX = centroidY = outer / 2;
    ix = iy = Math.PI * (outer ** 4 - inner ** 4) / 64;
    extremeTop = extremeBottom = outer / 2;
  } else {
    const b = positive('Base width', width); const h = positive('Height', height);
    area = b * h / 2; centroidX = b / 2; centroidY = h / 3;
    ix = b * h ** 3 / 36; iy = b ** 3 * h / 48;
    extremeBottom = h / 3; extremeTop = 2 * h / 3;
  }
  const values = [area, centroidX, centroidY, ix, iy, ix / extremeTop, ix / extremeBottom, iy / centroidX];
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) throw new RangeError('The section dimensions exceed the supported calculation range.');
  return Object.freeze({ shape, area, centroidX, centroidY, ix, iy, zxTop: ix / extremeTop, zxBottom: ix / extremeBottom, zy: iy / centroidX, extremeTop, extremeBottom });
}
