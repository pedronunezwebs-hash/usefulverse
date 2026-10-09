import { calculateTorque, convertTorqueValue } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="torque-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const unitNames = { force: 'forceUnit', arm: 'distanceUnit', torque: 'torqueUnit' };
  const selectedUnits = Object.fromEntries(Object.entries(unitNames).map(([dimension, name]) => [dimension, form.elements.namedItem(name).value]));
  const locale = () => document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale(), value, 8);
  let outputText = '';

  function syncMode() {
    for (const dimension of ['force', 'arm', 'torque']) {
      const shown = mode.value === 'solve-torque' ? dimension !== 'torque' : dimension !== mode.value.replace('solve-', '');
      root.querySelector(`[data-torque-field="${dimension}"]`).hidden = !shown;
      form.elements.namedItem(dimension).required = shown;
    }
    root.querySelector('[data-torque-field="direction"]').hidden = mode.value !== 'solve-torque';
  }

  function drawDiagram(result) {
    const content = root.querySelector('[data-result-content]');
    const figure = document.createElement('figure');
    figure.className = 'torque-diagram';
    const caption = document.createElement('figcaption');
    caption.textContent = copy.messages.diagram;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 320 150');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', copy.messages.diagram);
    const line = (x1, y1, x2, y2, width = 4) => {
      const node = document.createElementNS(svg.namespaceURI, 'line');
      for (const [key, value] of Object.entries({ x1, y1, x2, y2 })) node.setAttribute(key, String(value));
      node.setAttribute('stroke', 'currentColor'); node.setAttribute('stroke-width', String(width)); node.setAttribute('stroke-linecap', 'round');
      svg.append(node);
    };
    const pivot = document.createElementNS(svg.namespaceURI, 'circle');
    pivot.setAttribute('cx', '42'); pivot.setAttribute('cy', '91'); pivot.setAttribute('r', '8'); pivot.setAttribute('fill', 'currentColor'); svg.append(pivot);
    line(42, 91, 273, 91, 5);
    const theta = result.angleDeg * Math.PI / 180 * (result.direction === 'clockwise' ? -1 : 1);
    const endX = 273 + Math.cos(theta) * 56;
    const endY = 91 - Math.sin(theta) * 56;
    line(273, 91, endX, endY, 4);
    const tip = document.createElementNS(svg.namespaceURI, 'path');
    const dir = theta >= 0 ? 1 : -1;
    tip.setAttribute('d', `M ${endX} ${endY} l ${-8} ${-4 * dir} l 3 ${8 * dir} Z`); tip.setAttribute('fill', 'currentColor'); svg.append(tip);
    const label = document.createElementNS(svg.namespaceURI, 'text');
    label.setAttribute('x', '155'); label.setAttribute('y', '119'); label.setAttribute('text-anchor', 'middle'); label.setAttribute('fill', 'currentColor');
    label.textContent = `${format(result.arm)} ${result.distanceUnit} · ${format(result.angleDeg)}°`;
    svg.append(label); figure.append(caption, svg); content.append(figure);
  }

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const read = (name) => form.elements.namedItem(name).value.trim();
      const result = calculateTorque({ mode: read('mode'), force: read('force'), forceUnit: read('forceUnit'), arm: read('arm'), distanceUnit: read('distanceUnit'), angle: read('angle'), torque: read('torque'), torqueUnit: read('torqueUnit'), direction: read('direction') });
      const torqueShown = `${format(result.torque)} ${result.torqueUnit}`;
      const rows = [
        [copy.messages.torque, torqueShown],
        [copy.messages.direction, copy.fields[result.direction]],
        [copy.messages.force, `${format(result.force)} ${result.forceUnit}`],
        [copy.messages.arm, `${format(result.arm)} ${result.distanceUnit}`],
        [copy.messages.angle, `${format(result.angleDeg)}°`],
        [copy.messages.perpendicularForce, `${format(result.perpendicularForceN)} N`],
        [copy.messages.momentArm, `${format(result.momentArmM)} m`],
        [copy.messages.formula, 'τ = r × F × sin(θ)'],
      ];
      showRows(root, rows); drawDiagram(result);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', () => { syncMode(); clearResult(root); });
  for (const [dimension, unitName] of Object.entries(unitNames)) {
    const select = form.elements.namedItem(unitName);
    select.addEventListener('change', () => {
      const input = form.elements.namedItem(dimension);
      const nextUnit = select.value;
      if (input.value.trim()) {
        try { input.value = String(convertTorqueValue(input.value, dimension, selectedUnits[dimension], nextUnit)); }
        catch { select.value = selectedUnits[dimension]; announce(root, copy.messages.checkInputs, 'error'); return; }
      }
      selectedUnits[dimension] = nextUnit; clearResult(root);
    });
  }
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = ''; clearResult(root); announce(root, '');
    for (const [dimension, unitName] of Object.entries(unitNames)) selectedUnits[dimension] = form.elements.namedItem(unitName).value;
    syncMode();
  }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ mode: 'solve-torque', force: '10', forceUnit: 'N', arm: '2', distanceUnit: 'm', angle: '90', torque: '', torqueUnit: 'N·m', direction: 'counterclockwise' })) form.elements.namedItem(name).value = value;
    for (const [dimension, unitName] of Object.entries(unitNames)) selectedUnits[dimension] = form.elements.namedItem(unitName).value;
    syncMode(); calculate(); announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncMode();
}
