import { announce, clearResult, numberFormat, readToolCopy } from '../controller-helpers.mjs';
import { calculateParametricCurve } from './logic.mjs';

const root = document.querySelector('[data-tool="parametric-equation-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const countLabel = root.querySelector('[data-result-count]');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  let curve;
  let pendingObjectUrl;

  function clear() {
    clearResult(root);
    countLabel.textContent = '';
    curve = undefined;
    if (pendingObjectUrl) URL.revokeObjectURL(pendingObjectUrl);
    pendingObjectUrl = undefined;
  }

  function draw(points) {
    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', '0 0 640 400');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', copy.fields.chartLabel);
    svg.classList.add('parametric-curve-chart');
    const title = document.createElementNS(namespace, 'title');
    title.textContent = copy.fields.chartLabel;
    svg.append(title);

    const finite = points.filter((point) => point.valid);
    const xs = finite.map(({ x }) => x).sort((a, b) => a - b);
    const ys = finite.map(({ y }) => y).sort((a, b) => a - b);
    const quantile = (values, fraction) => values[Math.min(values.length - 1, Math.floor((values.length - 1) * fraction))];
    let minX = quantile(xs, 0.02), maxX = quantile(xs, 0.98);
    let minY = quantile(ys, 0.02), maxY = quantile(ys, 0.98);
    if (minX === maxX) { minX -= 1; maxX += 1; }
    if (minY === maxY) { minY -= 1; maxY += 1; }
    const xSpan = maxX - minX, ySpan = maxY - minY;
    const span = Math.max(xSpan, ySpan);
    const xMid = (minX + maxX) / 2, yMid = (minY + maxY) / 2;
    minX = xMid - span / 2; maxX = xMid + span / 2;
    minY = yMid - span / 2; maxY = yMid + span / 2;
    const left = 28, top = 20, width = 584, height = 360;
    const xPixel = (value) => left + ((value - minX) / (maxX - minX)) * width;
    const yPixel = (value) => top + (1 - (value - minY) / (maxY - minY)) * height;

    const axes = document.createElementNS(namespace, 'path');
    let axesPath = '';
    if (minX <= 0 && maxX >= 0) axesPath += `M${xPixel(0)},${top}V${top + height}`;
    if (minY <= 0 && maxY >= 0) axesPath += `M${left},${yPixel(0)}H${left + width}`;
    axes.setAttribute('d', axesPath);
    axes.classList.add('parametric-curve-chart__axes');
    svg.append(axes);

    let pathData = '';
    let drawing = false;
    let previous;
    const gapThreshold = span * 0.2;
    for (const point of points) {
      if (!point.valid || (previous && Math.hypot(point.x - previous.x, point.y - previous.y) > gapThreshold)) drawing = false;
      if (point.valid) {
        const command = drawing ? 'L' : 'M';
        pathData += `${command}${xPixel(point.x).toFixed(2)},${yPixel(point.y).toFixed(2)}`;
        drawing = true;
        previous = point;
      } else previous = undefined;
    }
    const curvePath = document.createElementNS(namespace, 'path');
    curvePath.setAttribute('d', pathData);
    curvePath.setAttribute('fill', 'none');
    curvePath.classList.add('parametric-curve-chart__line');
    svg.append(curvePath);
    return svg;
  }

  function calculate(event) {
    event?.preventDefault();
    clear();
    try {
      curve = calculateParametricCurve({
        xExpression: form.elements.namedItem('xExpression').value,
        yExpression: form.elements.namedItem('yExpression').value,
        tMin: form.elements.namedItem('tMin').value,
        tMax: form.elements.namedItem('tMax').value,
        samples: form.elements.namedItem('samples').value,
      });
      content.append(draw(curve.points));
      countLabel.textContent = `${copy.fields.resultCount}: ${curve.validCount} / ${curve.points.length}`;
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('xExpression').value = 'cos(t)';
    form.elements.namedItem('yExpression').value = 'sin(t)';
    form.elements.namedItem('tMin').value = '0';
    form.elements.namedItem('tMax').value = String(2 * Math.PI);
    form.elements.namedItem('samples').value = '360';
    calculate();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="downloadCsv"]')?.addEventListener('click', () => {
    if (!curve) return announce(root, copy.messages.checkInputs, 'error');
    try {
      const rows = ['t,x,y', ...curve.points.filter(({ valid }) => valid).map(({ t, x, y }) => `${t},${x},${y}`)];
      const blob = new Blob([`\uFEFF${rows.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
      if (pendingObjectUrl) URL.revokeObjectURL(pendingObjectUrl);
      pendingObjectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pendingObjectUrl;
      link.download = 'parametric-curve-coordinates.csv';
      link.click();
      announce(root, copy.messages.downloaded, 'success');
    } catch {
      announce(root, copy.messages.downloadUnavailable, 'error');
    }
  });
  window.addEventListener('pagehide', () => { if (pendingObjectUrl) URL.revokeObjectURL(pendingObjectUrl); }, { once: true });
}
