const CORNERS = Object.freeze(['top-left', 'top-right', 'bottom-right', 'bottom-left']);
const MAX_PX = 500;

function radiusValue(value, unit) {
  const number = Number(value);
  const max = unit === '%' ? 100 : MAX_PX;
  if (!Number.isFinite(number) || number < 0 || number > max) throw new RangeError(`Radius must be between 0 and ${max}${unit}.`);
  return `${Number(number.toFixed(3))}${unit}`;
}

export function normalizeRadii({ horizontal, vertical = horizontal, unit = 'px' } = {}) {
  if (!['px', '%'].includes(unit)) throw new TypeError('Choose px or percent.');
  if (!Array.isArray(horizontal) || horizontal.length !== 4 || !Array.isArray(vertical) || vertical.length !== 4) throw new TypeError('Enter four horizontal and four vertical corner radii.');
  return Object.freeze({
    unit,
    horizontal: Object.freeze(horizontal.map((value) => radiusValue(value, unit))),
    vertical: Object.freeze(vertical.map((value) => radiusValue(value, unit))),
  });
}

export function buildBorderRadiusCss(options = {}) {
  const radii = normalizeRadii(options);
  const x = radii.horizontal.join(' ');
  const y = radii.vertical.join(' ');
  const value = x === y ? x : `${x} / ${y}`;
  return Object.freeze({ radii, value, css: `.shape {\n  border-radius: ${value};\n}` });
}

export function borderRadiusPreviewStyle(options = {}) {
  return buildBorderRadiusCss(options).value;
}

export { CORNERS, MAX_PX };
