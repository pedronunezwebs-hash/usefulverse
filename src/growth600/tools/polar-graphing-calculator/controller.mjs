import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy } from '../controller-helpers.mjs';
import { calculatePolarGraph } from './logic.mjs';

const root = document.querySelector('[data-tool="polar-graphing-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const countLabel = root.querySelector('[data-result-count]');
  const locale = () => document.documentElement.lang || 'en';
  const number = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
  const format = (value) => numberFormat(locale(), value, 5);
  let graph;
  let objectUrl;

  function clear() {
    clearResult(root); content.replaceChildren(); countLabel.textContent = ''; graph = undefined;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = undefined;
  }

  function draw(points) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 640 420'); svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', copy.fields.chartLabel); svg.classList.add('polar-graph-chart');
    const title = document.createElementNS(ns, 'title'); title.textContent = copy.fields.chartLabel; svg.append(title);
    const valid = points.filter((point) => point.valid);
    const extent = Math.max(1, ...valid.map(({ x, y }) => Math.max(Math.abs(x), Math.abs(y))));
    const pad = 28, size = 364, center = pad + size / 2, scale = size / (2 * extent);
    const px = (value) => center + value * scale;
    const py = (value) => center - value * scale;
    const axes = document.createElementNS(ns, 'path'); axes.setAttribute('d', `M${pad},${center}H${pad + size}M${center},${pad}V${pad + size}`); axes.classList.add('polar-graph-chart__axes'); svg.append(axes);
    const ring = document.createElementNS(ns, 'circle'); ring.setAttribute('cx', String(center)); ring.setAttribute('cy', String(center)); ring.setAttribute('r', String(size / 2)); ring.classList.add('polar-graph-chart__frame'); svg.append(ring);
    let data = '', drawing = false, previous;
    const maxJump = extent * 0.25;
    for (const point of points) {
      if (!point.valid || (previous && Math.hypot(point.x - previous.x, point.y - previous.y) > maxJump)) drawing = false;
      if (point.valid) { data += `${drawing ? 'L' : 'M'}${px(point.x).toFixed(2)},${py(point.y).toFixed(2)}`; drawing = true; previous = point; }
      else previous = undefined;
    }
    const path = document.createElementNS(ns, 'path'); path.setAttribute('d', data); path.setAttribute('fill', 'none'); path.classList.add('polar-graph-chart__curve'); svg.append(path);
    return svg;
  }

  function calculate(event) {
    event?.preventDefault(); clear();
    try {
      graph = calculatePolarGraph({
        radiusExpression: form.elements.namedItem('radiusExpression').value,
        angleMin: number('angleMin'), angleMax: number('angleMax'),
        angleUnit: form.elements.namedItem('angleUnit').value, samples: number('samples'),
      });
      content.append(draw(graph.points));
      countLabel.textContent = `${copy.fields.resultCount}: ${graph.validCount} / ${graph.points.length}`;
      result.hidden = false; announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }

  function summary() {
    if (!graph) return '';
    const samplePoints = [graph.points[0], graph.points[Math.floor((graph.points.length - 1) / 2)], graph.points.at(-1)].filter((point) => point?.valid);
    return samplePoints.map((point) => `θ=${format(point.angle)} ${graph.angleUnit}; r=${format(point.radius)}; x=${format(point.x)}; y=${format(point.y)}`).join('\n');
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('radiusExpression').value = '1'; form.elements.namedItem('angleMin').value = '0';
    form.elements.namedItem('angleMax').value = '360'; form.elements.namedItem('angleUnit').value = 'degrees';
    form.elements.namedItem('samples').value = '361'; calculate(); announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (graph) copyText(root, summary(), copy); });
  root.querySelector('[data-action="downloadCsv"]')?.addEventListener('click', () => {
    if (!graph) return announce(root, copy.messages.checkInputs, 'error');
    try {
      const rows = ['angle,radius,x,y', ...graph.points.filter(({ valid }) => valid).map(({ angle, radius, x, y }) => [angle, radius, x, y].join(','))];
      const blob = new Blob([`\uFEFF${rows.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = objectUrl; link.download = 'polar-graph-points.csv'; link.click();
      announce(root, copy.messages.downloaded, 'success');
    } catch { announce(root, copy.messages.downloadUnavailable, 'error'); }
  });
  window.addEventListener('pagehide', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, { once: true });
}
