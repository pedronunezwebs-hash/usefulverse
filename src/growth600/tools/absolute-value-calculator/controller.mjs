import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { calculateAbsoluteValue } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="absolute-value-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale(), value, 8);
  const numberFields = form.querySelector('[data-number-fields]');
  const solverFields = form.querySelector('[data-solver-fields]');
  const relation = form.elements.namedItem('relation');
  let output = '';

  function updateMode() {
    const mode = form.elements.namedItem('mode').value;
    numberFields.hidden = mode !== 'number';
    solverFields.hidden = mode === 'number';
    relation.disabled = mode !== 'inequality';
    if (mode === 'equation') relation.value = '=';
    else if (mode === 'inequality' && relation.value === '=') relation.value = '<=';
  }

  function solutionText(solution) {
    if (solution.kind === 'all') return 'ℝ';
    if (solution.kind === 'empty') return '∅';
    if (solution.kind === 'point') return `x = ${format(solution.points[0])}`;
    if (solution.kind === 'points') return `x = ${solution.points.map(format).join(` ${copy.fields.orSeparator} x = `)}`;
    if (solution.kind === 'all-except-point') return `ℝ \\ {${format(solution.points[0])}}`;
    return solution.intervals.map(({ lower, upper, lowerInclusive, upperInclusive }) => `${lowerInclusive ? '[' : '('}${lower === -Infinity ? '−∞' : format(lower)}, ${upper === Infinity ? '∞' : format(upper)}${upperInclusive ? ']' : ')'}`).join(' ∪ ');
  }

  function renderNumberLine(solution) {
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.setAttribute('viewBox', '0 0 360 48');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', copy.fields.numberLine);
    svg.classList.add('absolute-value-number-line');
    const finite = [];
    for (const point of solution.points ?? []) if (Number.isFinite(point)) finite.push(point);
    for (const item of solution.intervals ?? []) for (const endpoint of [item.lower, item.upper]) if (Number.isFinite(endpoint)) finite.push(endpoint);
    let low = finite.length ? Math.min(...finite) : -10;
    let high = finite.length ? Math.max(...finite) : 10;
    const pad = low === high ? Math.max(Math.abs(low) * 0.1, 1) : Math.max((high - low) * 0.22, 1e-9);
    low -= pad; high += pad;
    const position = (value) => 24 + ((value - low) / (high - low)) * 312;
    const el = (name, attrs) => {
      const node = document.createElementNS(svgNs, name);
      for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
      svg.append(node);
      return node;
    };
    el('line', { x1: 24, y1: 24, x2: 336, y2: 24, stroke: '#64748b', 'stroke-width': 2 });
    el('path', { d: 'M24 24l8-5v10z M336 24l-8-5v10z', fill: '#64748b' });
    const bar = (x1, x2) => el('line', { x1, y1: 24, x2, y2: 24, stroke: '#2563eb', 'stroke-width': 6, 'stroke-linecap': 'round' });
    const dot = (value, filled) => el('circle', { cx: position(value), cy: 24, r: 6, fill: filled ? '#2563eb' : '#fff', stroke: '#2563eb', 'stroke-width': 3 });
    if (solution.kind === 'all' || solution.kind === 'all-except-point') bar(24, 336);
    if (solution.kind === 'point' || solution.kind === 'points' || solution.kind === 'all-except-point') {
      for (const point of solution.points) dot(point, solution.kind !== 'all-except-point');
    }
    for (const item of solution.intervals ?? []) {
      bar(item.lower === -Infinity ? 24 : position(item.lower), item.upper === Infinity ? 336 : position(item.upper));
      if (Number.isFinite(item.lower)) dot(item.lower, item.lowerInclusive);
      if (Number.isFinite(item.upper)) dot(item.upper, item.upperInclusive);
    }
    return svg;
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    output = '';
    const currentLocale = locale();
    const read = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, currentLocale);
    try {
      const mode = form.elements.namedItem('mode').value;
      const result = calculateAbsoluteValue(mode === 'number'
        ? { mode, value: read('value') }
        : { mode, a: read('a'), b: read('b'), relation: form.elements.namedItem('relation').value, c: read('c') });
      if (mode === 'number') {
        const value = `${copy.fields.resultValue}: ${format(result.result)}\n|${format(result.value)}| = ${format(result.result)}`;
        showRows(root, [[copy.fields.resultValue, format(result.result)]]);
        output = value;
      } else {
        const solution = solutionText(result.solution);
        const expression = `|${format(result.a)}x ${result.b < 0 ? '−' : '+'} ${format(Math.abs(result.b))}| ${result.relation} ${format(result.c)}`;
        const rows = [[copy.fields.resultSolution, solution], [copy.fields.solutionLabel, expression]];
        if (result.solution.kind === 'all') rows[0][1] = copy.fields.allReal;
        if (result.solution.kind === 'empty') rows[0][1] = copy.fields.noSolution;
        showRows(root, rows);
        root.querySelector('[data-result-content]')?.append(renderNumberLine(result.solution));
        output = `${copy.fields.resultSolution}: ${rows[0][1]}\n${expression}`;
      }
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  function clear() { clearResult(root); output = ''; announce(root, ''); }
  form.addEventListener('input', clear);
  form.addEventListener('change', (event) => { if (event.target.name === 'mode') updateMode(); clear(); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { updateMode(); clear(); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    const mode = form.elements.namedItem('mode').value;
    if (mode === 'number') form.elements.namedItem('value').value = '-12.5';
    else {
      form.elements.namedItem('a').value = '1';
      form.elements.namedItem('b').value = '0';
      form.elements.namedItem('c').value = '3';
      form.elements.namedItem('relation').value = mode === 'equation' ? '=' : '<=';
    }
    calculate();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
  updateMode();
}
