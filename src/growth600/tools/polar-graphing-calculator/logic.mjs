import { compileParametricExpression } from '../parametric-equation-calculator/logic.mjs';

const MAX_RADIUS = 1e9;

export function calculatePolarGraph({ radiusExpression, angleMin, angleMax, angleUnit = 'radians', samples }) {
  const minimum = Number(angleMin);
  const maximum = Number(angleMax);
  const count = Number(samples);
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || maximum <= minimum || Math.abs(minimum) > 10000 || Math.abs(maximum) > 10000) throw new RangeError('Enter an increasing, bounded angle interval.');
  if (!['radians', 'degrees'].includes(angleUnit)) throw new RangeError('Choose radians or degrees.');
  if (!Number.isInteger(count) || count < 50 || count > 1500) throw new RangeError('Choose between 50 and 1,500 points.');
  const normalized = String(radiusExpression ?? '').replace(/[θϑ]/gu, 't');
  const radiusAt = compileParametricExpression(normalized, { angleUnit });
  const toRadians = angleUnit === 'degrees' ? Math.PI / 180 : 1;
  const points = [];
  for (let index = 0; index < count; index += 1) {
    const angle = minimum + (maximum - minimum) * index / (count - 1);
    const theta = angle * toRadians;
    const radius = radiusAt(angle);
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);
    const valid = Number.isFinite(radius) && Math.abs(radius) <= MAX_RADIUS && Number.isFinite(x) && Number.isFinite(y) && Math.abs(x) <= MAX_RADIUS && Math.abs(y) <= MAX_RADIUS;
    points.push(Object.freeze({ angle, theta, radius, x, y, valid }));
  }
  const validCount = points.filter(({ valid }) => valid).length;
  if (validCount < 2) throw new RangeError('The expression did not produce enough finite points.');
  return Object.freeze({ points: Object.freeze(points), validCount, angleUnit, minimum, maximum, radiusExpression: String(radiusExpression).trim() });
}

export const POLAR_GRAPH_LIMITS = Object.freeze({ minSamples: 50, maxSamples: 1500, maxMagnitude: MAX_RADIUS, maxAngle: 10000 });
