import { parseNumberLineIntervals } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const SVG_NS = 'http://www.w3.org/2000/svg';
const root = document.querySelector('[data-tool="number-line-graphing-tool"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const input = form.elements.namedItem('intervals');
  const result = root.querySelector('[data-number-line-result]');
  const chart = root.querySelector('[data-number-line-chart]');
  const downloadButton = root.querySelector('[data-action="download-svg"]');
  let currentSvg = null;

  function createSvgElement(name, attributes = {}, text = '') {
    const element = document.createElementNS(SVG_NS, name);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
    if (text) element.textContent = text;
    return element;
  }

  function renderGraph(report) {
    const left = 40;
    const right = 600;
    const rowHeight = 64;
    const top = 28;
    const height = top + (report.intervals.length * rowHeight) + 12;
    const scale = (value) => left + ((value - report.plotMin) / (report.plotMax - report.plotMin)) * (right - left);
    const svg = createSvgElement('svg', { xmlns: SVG_NS, viewBox: `0 0 640 ${height}`, role: 'img', 'aria-label': copy.fields.chartDescription, focusable: 'false' });
    const tickFormatter = new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 3 });

    report.intervals.forEach((interval, index) => {
      const y = top + 18 + (index * rowHeight);
      svg.append(createSvgElement('text', { x: left, y: y - 8, fill: '#111827', 'font-size': '13' }, interval.source));
      svg.append(createSvgElement('line', { x1: left, y1: y + 18, x2: right, y2: y + 18, stroke: '#111827', 'stroke-width': '1.5' }));

      for (let tick = 0; tick <= 8; tick += 1) {
        const x = left + ((right - left) * tick / 8);
        const value = report.plotMin + ((report.plotMax - report.plotMin) * tick / 8);
        svg.append(createSvgElement('line', { x1: x, y1: y + 14, x2: x, y2: y + 22, stroke: '#111827', 'stroke-width': '1' }));
        svg.append(createSvgElement('text', { x, y: y + 40, fill: '#111827', 'font-size': '10', 'text-anchor': 'middle' }, tickFormatter.format(value)));
      }

      const start = interval.lower === -Infinity ? left : scale(interval.lower);
      const end = interval.upper === Infinity ? right : scale(interval.upper);
      if (!interval.point) svg.append(createSvgElement('line', { x1: start, y1: y + 18, x2: end, y2: y + 18, stroke: '#111827', 'stroke-width': '5', 'stroke-linecap': 'round' }));
      if (interval.lower === -Infinity) svg.append(createSvgElement('path', { d: `M ${left} ${y + 18} l 10 -6 v 12 z`, fill: '#111827' }));
      else svg.append(createSvgElement('circle', { cx: start, cy: y + 18, r: '6', fill: interval.lowerClosed ? '#111827' : '#fff', stroke: '#111827', 'stroke-width': '2' }));
      if (interval.upper === Infinity) svg.append(createSvgElement('path', { d: `M ${right} ${y + 18} l -10 -6 v 12 z`, fill: '#111827' }));
      else if (!interval.point) svg.append(createSvgElement('circle', { cx: end, cy: y + 18, r: '6', fill: interval.upperClosed ? '#111827' : '#fff', stroke: '#111827', 'stroke-width': '2' }));
    });
    chart.replaceChildren(svg);
    currentSvg = svg;
    result.hidden = false;
    downloadButton.disabled = false;
  }

  function clearGraph() {
    result.hidden = true;
    chart.replaceChildren();
    currentSvg = null;
    downloadButton.disabled = true;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearGraph();
    try {
      renderGraph(parseNumberLineIntervals(input.value));
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  form.addEventListener('input', clearGraph);
  form.addEventListener('reset', () => {
    queueMicrotask(clearGraph);
    announce(root, '');
  });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    input.value = copy.fields.exampleInput;
    clearGraph();
    announce(root, copy.messages.exampleLoaded, 'info');
  });
  downloadButton.addEventListener('click', () => {
    if (!currentSvg) return;
    const source = new XMLSerializer().serializeToString(currentSvg);
    const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usefulverse-number-line.svg';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    announce(root, copy.messages.downloaded, 'success');
  });
}
