const bounded = (value, min, max, name) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} must be between ${min} and ${max}.`);
  return number;
};

export function buildAnimationCss({ effect, duration, delay, iterations, timing }) {
  const motions = {
    fade: [['from', 'opacity:0'], ['to', 'opacity:1']],
    slide: [['from', 'opacity:0;transform:translateX(-24px)'], ['to', 'opacity:1;transform:translateX(0)']],
    bounce: [['0%', 'transform:translateY(-18px)'], ['65%', 'transform:translateY(5px)'], ['100%', 'transform:translateY(0)']],
    rotate: [['from', 'transform:rotate(-12deg)'], ['to', 'transform:rotate(0deg)']],
    pulse: [['from', 'transform:scale(.94)'], ['to', 'transform:scale(1)']],
  };
  if (!Object.hasOwn(motions, effect)) throw new TypeError('Choose a supported CSS animation.');
  const seconds = bounded(duration, 0.2, 5, 'Duration');
  const wait = bounded(delay, 0, 3, 'Delay');
  if (!['1', '2', '3', 'infinite'].includes(String(iterations))) throw new TypeError('Choose a valid repetition count.');
  if (!['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'].includes(timing)) throw new TypeError('Choose a supported timing function.');
  const keyframes = motions[effect].map(([position, declarations]) => `  ${position} { ${declarations}; }`).join('\n');
  return `@keyframes usefulverse-motion {\n${keyframes}\n}\n\n.my-element {\n  animation: usefulverse-motion ${seconds}s ${timing} ${wait}s ${iterations};\n}`;
}

const clipShapes = Object.freeze({
  circle: 'circle(50% at 50% 50%)',
  ellipse: 'ellipse(48% 38% at 50% 50%)',
  inset: 'inset(8% 10% 8% 10% round 12px)',
  triangle: 'polygon(50% 0%, 100% 100%, 0% 100%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
});

export function buildClipPathCss(shape) {
  if (!Object.hasOwn(clipShapes, shape)) throw new TypeError('Choose a supported clip-path shape.');
  return `.my-element {\n  clip-path: ${clipShapes[shape]};\n}`;
}

export function buildFilterCss(values) {
  const fields = {
    brightness: [0, 200, '%'], contrast: [0, 200, '%'], grayscale: [0, 100, '%'],
    hue: [0, 360, 'deg'], invert: [0, 100, '%'], sepia: [0, 100, '%'],
    saturate: [0, 200, '%'], blur: [0, 12, 'px'],
  };
  const declarations = Object.entries(fields).map(([name, [min, max, unit]]) => {
    const value = bounded(values[name], min, max, name);
    const property = name === 'hue' ? 'hue-rotate' : name;
    return `${property}(${value}${unit})`;
  });
  return `.my-element {\n  filter: ${declarations.join(' ')};\n}`;
}

export const CLIP_PATH_SHAPES = Object.freeze(Object.keys(clipShapes));
