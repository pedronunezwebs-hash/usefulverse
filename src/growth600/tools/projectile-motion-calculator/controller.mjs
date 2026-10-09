import { calculateProjectileMotion, projectilePositionAt, sampleProjectilePath } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { parseLocalizedNumber } from '../../../advanced-logic.mjs';

const root = document.querySelector('[data-tool="projectile-motion-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const visual = root.querySelector('[data-trajectory-visual]');
  const svg = root.querySelector('[data-trajectory-plot]');
  const locale = () => document.documentElement.lang || 'en';
  const parseNumber = (value) => parseLocalizedNumber(value, locale());
  const format = (value, digits = 5) => numberFormat(locale(), value, digits);
  let result = null;
  let output = '';
  let marker = null;
  let frame = 0;
  let animationGeneration = 0;

  function cancelTrajectoryAnimation() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    animationGeneration += 1;
  }

  function scaledPoint(point, current) {
    const xMax = Math.max(current.range, 1);
    const yMax = Math.max(current.maxHeight, current.initialHeight, 1);
    return { x: 42 + point.x / xMax * 536, y: 278 - point.y / yMax * 250 };
  }

  function svgElement(name, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
    return element;
  }

  function drawTrajectory(current) {
    svg.replaceChildren();
    svg.setAttribute('aria-label', `${copy.fields.plotDescription} ${copy.fields.lengthUnit}: ${current.lengthUnit}.`);
    const title = svgElement('title'); title.textContent = copy.fields.plotTitle;
    const description = svgElement('desc'); description.textContent = copy.fields.plotDescription;
    svg.append(title, description);
    const baseline = svgElement('line', { x1: 40, y1: 280, x2: 580, y2: 280, stroke: 'currentColor', 'stroke-width': 1.5 });
    const vertical = svgElement('line', { x1: 40, y1: 20, x2: 40, y2: 280, stroke: 'currentColor', 'stroke-width': 1.5 });
    svg.append(baseline, vertical);
    for (let index = 1; index <= 3; index += 1) {
      const y = 280 - index * 62.5;
      svg.append(svgElement('line', { x1: 40, y1: y, x2: 580, y2: y, stroke: 'currentColor', 'stroke-opacity': 0.12, 'stroke-width': 1 }));
    }
    const points = sampleProjectilePath(current, 41).map((point) => scaledPoint(point, current));
    const path = svgElement('path', { d: points.map(({ x, y }, index) => `${index ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' '), fill: 'none', stroke: 'var(--accent, #4169e1)', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    marker = svgElement('circle', { cx: points[0].x, cy: points[0].y, r: 7, fill: 'var(--accent, #4169e1)', stroke: 'white', 'stroke-width': 2 });
    svg.append(path, marker);
  }

  function moveMarker(seconds, trajectory = result) {
    if (!trajectory || !marker) return;
    const boundedTime = Math.min(trajectory.timeOfFlight, Math.max(0, seconds));
    const point = scaledPoint(projectilePositionAt(trajectory, boundedTime), trajectory);
    marker.setAttribute('cx', point.x.toFixed(2));
    marker.setAttribute('cy', point.y.toFixed(2));
  }

  function calculate(event) {
    event?.preventDefault();
    cancelTrajectoryAnimation();
    clearResult(root);
    visual.hidden = true;
    output = '';
    result = null;
    try {
      result = calculateProjectileMotion({
        speed: parseNumber(form.elements.namedItem('speed').value),
        speedUnit: form.elements.namedItem('speedUnit').value,
        angleDegrees: parseNumber(form.elements.namedItem('angleDegrees').value),
        initialHeight: parseNumber(form.elements.namedItem('initialHeight').value),
        lengthUnit: form.elements.namedItem('lengthUnit').value,
        gravity: parseNumber(form.elements.namedItem('gravity').value),
      });
      const suffix = result.lengthUnit;
      const rows = [
        [copy.messages.time, `${format(result.timeOfFlight)} s`],
        [copy.messages.range, `${format(result.range)} ${suffix}`],
        [copy.messages.maximumHeight, `${format(result.maxHeight)} ${suffix}`],
        [copy.messages.apexTime, `${format(result.apexTime)} s`],
        [copy.messages.impactSpeed, `${format(result.impactSpeed)} ${result.speedUnit}`],
        [copy.messages.model, `${copy.messages.horizontalVelocity}: ${format(result.horizontalVelocityMps)} m/s · ${copy.messages.verticalVelocity}: ${format(result.verticalVelocityMps)} m/s`],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      drawTrajectory(result);
      visual.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { cancelTrajectoryAnimation(); result = null; output = ''; visual.hidden = true; clearResult(root); announce(root, ''); });
  form.addEventListener('reset', () => setTimeout(() => { cancelTrajectoryAnimation(); result = null; output = ''; visual.hidden = true; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('speed').value = '20';
    form.elements.namedItem('speedUnit').value = 'm/s';
    form.elements.namedItem('angleDegrees').value = '45';
    form.elements.namedItem('initialHeight').value = '0';
    form.elements.namedItem('lengthUnit').value = 'm';
    form.elements.namedItem('gravity').value = '9.80665';
    calculate();
  });
  root.querySelector('[data-action="playTrajectory"]')?.addEventListener('click', () => {
    if (!result || !marker) return;
    cancelTrajectoryAnimation();
    const trajectory = result;
    const generation = animationGeneration;
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      moveMarker(trajectory.timeOfFlight, trajectory);
      announce(root, copy.fields.motionReduced);
      return;
    }
    const start = performance.now();
    const duration = Math.min(6000, Math.max(800, trajectory.timeOfFlight * 500));
    const animate = (now) => {
      if (generation !== animationGeneration) return;
      const progress = Math.min(1, (now - start) / duration);
      moveMarker(trajectory.timeOfFlight * progress, trajectory);
      if (progress < 1) frame = requestAnimationFrame(animate);
      else frame = 0;
    };
    moveMarker(0, trajectory);
    frame = requestAnimationFrame(animate);
  });
  root.querySelector('[data-action="resetAnimation"]')?.addEventListener('click', () => {
    cancelTrajectoryAnimation();
    if (result) moveMarker(0, result);
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
