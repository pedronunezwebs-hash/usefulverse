import { buildBondYieldCurve, calculateBondPrice, solveBondYield } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="bond-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const chart = root.querySelector('[data-bond-chart]');
  const mode = form.elements.namedItem('mode');
  let output = '';
  const locale = () => document.documentElement.lang || 'en';
  const format = (value, digits = 4) => numberFormat(locale(), value, digits);
  const common = () => ({
    faceValue: form.elements.namedItem('faceValue').value,
    couponPercent: form.elements.namedItem('couponPercent').value,
    years: form.elements.namedItem('years').value,
    frequency: form.elements.namedItem('frequency').value,
  });

  function clear() { clearResult(root); content.replaceChildren(); chart.replaceChildren(); output = ''; }

  function syncMode() {
    const priceMode = mode.value === 'price';
    const priceField = form.querySelector('[data-bond-field="yield"]');
    const yieldField = form.querySelector('[data-bond-field="market-price"]');
    priceField.hidden = !priceMode;
    priceField.querySelector('input').disabled = !priceMode;
    yieldField.hidden = priceMode;
    yieldField.querySelector('input').disabled = priceMode;
    clear();
  }

  function renderChart(points, centerYield) {
    const ns = 'http://www.w3.org/2000/svg';
    const make = (tag, attributes = {}) => {
      const node = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
      return node;
    };
    const valid = points.filter((point) => Number.isFinite(point.price));
    if (valid.length < 2) return;
    const prices = valid.map(({ price }) => price);
    const lowPrice = Math.min(...prices);
    const highPrice = Math.max(...prices);
    const span = highPrice - lowPrice || Math.max(Math.abs(highPrice) * 0.1, 1);
    const minYield = points[0].yieldPercent;
    const maxYield = points.at(-1).yieldPercent;
    const x = (value) => 48 + (value - minYield) / (maxYield - minYield) * 464;
    const y = (value) => 24 + (highPrice - value) / span * 152;
    chart.setAttribute('viewBox', '0 0 560 230');
    chart.setAttribute('role', 'img');
    chart.setAttribute('aria-labelledby', 'bond-chart-title bond-chart-description');
    const title = make('title', { id: 'bond-chart-title' }); title.textContent = copy.fields.chartTitle;
    const description = make('desc', { id: 'bond-chart-description' }); description.textContent = copy.fields.chartDescription;
    chart.append(title, description, make('line', { x1: 48, y1: 176, x2: 512, y2: 176, stroke: 'currentColor', 'stroke-opacity': '.45' }), make('line', { x1: 48, y1: 24, x2: 48, y2: 176, stroke: 'currentColor', 'stroke-opacity': '.45' }));
    const path = valid.map(({ yieldPercent, price }, index) => `${index ? 'L' : 'M'}${x(yieldPercent).toFixed(2)},${y(price).toFixed(2)}`).join(' ');
    chart.append(make('path', { d: path, fill: 'none', stroke: 'var(--accent, #476bdb)', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    const point = points.reduce((best, candidate) => Math.abs(candidate.yieldPercent - centerYield) < Math.abs(best.yieldPercent - centerYield) ? candidate : best, points[0]);
    if (Number.isFinite(point.price)) chart.append(make('circle', { cx: x(point.yieldPercent), cy: y(point.price), r: 5, fill: 'var(--accent, #476bdb)' }));
    const axisStyle = { fill: 'currentColor', 'font-size': 12 };
    const yieldLabel = make('text', { x: 280, y: 218, 'text-anchor': 'middle', ...axisStyle }); yieldLabel.textContent = copy.fields.chartYield;
    const priceLabel = make('text', { x: 8, y: 15, ...axisStyle }); priceLabel.textContent = copy.fields.chartPrice;
    const left = make('text', { x: 48, y: 194, 'text-anchor': 'start', ...axisStyle }); left.textContent = `${format(minYield)}%`;
    const right = make('text', { x: 512, y: 194, 'text-anchor': 'end', ...axisStyle }); right.textContent = `${format(maxYield)}%`;
    chart.append(yieldLabel, priceLabel, left, right);
  }

  function calculate(event) {
    event?.preventDefault();
    clear();
    try {
      const bond = common();
      let centerYield;
      let rows;
      if (mode.value === 'price') {
        const estimate = calculateBondPrice({ ...bond, yieldPercent: form.elements.namedItem('yieldPercent').value });
        centerYield = estimate.yieldPercent;
        rows = [
          [copy.fields.estimatedPrice, format(estimate.price)],
          [copy.fields.couponPayment, format(estimate.couponPayment)],
          [copy.fields.totalCoupons, format(estimate.totalCouponPayments)],
          [copy.fields.premiumDiscount, format(estimate.premiumDiscount)],
          [copy.fields.periods, String(estimate.periods)],
        ];
      } else {
        const estimate = solveBondYield({ ...bond, marketPrice: form.elements.namedItem('marketPrice').value });
        centerYield = estimate.yieldPercent;
        rows = [
          [copy.fields.yieldToMaturity, `${format(estimate.yieldPercent)}%`],
          [copy.fields.currentYield, `${format(estimate.currentYieldPercent)}%`],
          [copy.fields.couponPayment, format(estimate.couponPayment)],
          [copy.fields.periods, String(estimate.periods)],
        ];
      }
      showRows(root, rows);
      const points = buildBondYieldCurve(bond, centerYield);
      renderChart(points, centerYield);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch (error) {
      announce(root, copy.messages[error?.code] ?? copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', syncMode);
  form.addEventListener('input', clear);
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => queueMicrotask(() => { syncMode(); clear(); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'yield';
    form.elements.namedItem('faceValue').value = '1000';
    form.elements.namedItem('couponPercent').value = '5';
    form.elements.namedItem('years').value = '5';
    form.elements.namedItem('frequency').value = 'annual';
    form.elements.namedItem('marketPrice').value = '1000';
    syncMode();
    calculate();
    announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
  syncMode();
}
