export const COLOR_MIXER_LIMITS = Object.freeze({ minColors: 2, maxColors: 8, maxWeight: 1000, minSteps: 2, maxSteps: 16 });

export function parseMixerHex(value) {
  const text = String(value ?? '').trim();
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/iu.exec(text);
  if (!match) throw new RangeError('Enter a 3- or 6-digit hexadecimal color.');
  const hex = match[1].length === 3 ? [...match[1]].map((digit) => digit + digit).join('') : match[1];
  return Object.freeze({ hex: `#${hex.toUpperCase()}`, r: Number.parseInt(hex.slice(0, 2), 16), g: Number.parseInt(hex.slice(2, 4), 16), b: Number.parseInt(hex.slice(4, 6), 16) });
}

function channelToLinear(value) { const c = value / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
function channelToSrgb(value) { const c = value <= 0.0031308 ? 12.92 * value : 1.055 * (value ** (1 / 2.4)) - 0.055; return Math.round(Math.min(1, Math.max(0, c)) * 255); }
function toHex({ r, g, b }) { return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()}`; }

export function rgbToHsl({ r, g, b }) {
  const red = r / 255; const green = g / 255; const blue = b / 255;
  const max = Math.max(red, green, blue); const min = Math.min(red, green, blue); const delta = max - min;
  let hue = 0; const lightness = (max + min) / 2;
  let saturation = 0;
  if (delta) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue *= 60; if (hue < 0) hue += 360;
  }
  return Object.freeze({ h: Math.round(hue), s: Math.round(saturation * 100), l: Math.round(lightness * 100) });
}

export function mixColors(inputs, space = 'linear') {
  if (!Array.isArray(inputs) || inputs.length < COLOR_MIXER_LIMITS.minColors || inputs.length > COLOR_MIXER_LIMITS.maxColors) throw new RangeError('Mix between 2 and 8 colors.');
  if (!['linear', 'srgb'].includes(space)) throw new RangeError('Choose sRGB or linear-light mixing.');
  const colors = inputs.map((entry) => {
    const color = parseMixerHex(entry?.hex);
    const weight = Number(entry?.weight);
    if (!Number.isFinite(weight) || weight < 0 || weight > COLOR_MIXER_LIMITS.maxWeight) throw new RangeError('Each weight must be from 0 to 1000.');
    return { color, weight };
  });
  const total = colors.reduce((sum, entry) => sum + entry.weight, 0);
  if (!total) throw new RangeError('At least one color needs a weight above zero.');
  const mixed = ['r', 'g', 'b'].map((channel) => {
    const average = colors.reduce((sum, entry) => {
      const value = space === 'linear' ? channelToLinear(entry.color[channel]) : entry.color[channel] / 255;
      return sum + value * (entry.weight / total);
    }, 0);
    return space === 'linear' ? channelToSrgb(average) : Math.round(average * 255);
  });
  const rgb = Object.freeze({ r: mixed[0], g: mixed[1], b: mixed[2] });
  return Object.freeze({ hex: toHex(rgb), ...rgb, hsl: rgbToHsl(rgb), space, totalWeight: total });
}

export function buildColorRamp(startHex, endHex, steps, space = 'srgb') {
  if (!Number.isInteger(steps) || steps < COLOR_MIXER_LIMITS.minSteps || steps > COLOR_MIXER_LIMITS.maxSteps) throw new RangeError('Choose from 2 to 16 swatches.');
  const start = parseMixerHex(startHex); const end = parseMixerHex(endHex);
  return Object.freeze(Array.from({ length: steps }, (_, index) => {
    const ratio = index / (steps - 1);
    const mixed = mixColors([{ hex: start.hex, weight: 1 - ratio }, { hex: end.hex, weight: ratio }], space);
    return mixed.hex;
  }));
}
