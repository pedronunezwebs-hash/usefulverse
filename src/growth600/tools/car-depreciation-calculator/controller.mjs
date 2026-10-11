import { calculateCarDepreciation } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="car-depreciation-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  let outputText = '';
  const lang = () => document.documentElement.lang || 'en';
  const amount = (value, currency) => new Intl.NumberFormat(lang(), { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
  const number = (value, maximumFractionDigits = 2) => new Intl.NumberFormat(lang(), { maximumFractionDigits }).format(value);

  function drawChart(schedule, currency) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 480 220');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', copy.fields.chartLabel);
    const title = document.createElementNS(svg.namespaceURI, 'title'); title.textContent = copy.fields.chartLabel;
    const description = document.createElementNS(svg.namespaceURI, 'desc'); description.textContent = copy.fields.chartDescription;
    svg.append(title, description);
    svg.dataset.carDepreciationChart = '';
    const maxValue = Math.max(1, ...schedule.map(({ value }) => value));
    const points = schedule.map((point, index) => {
      const x = 42 + (schedule.length < 2 ? 0 : index * 420 / (schedule.length - 1));
      const y = 18 + (1 - point.value / maxValue) * 158;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
    const line = document.createElementNS(svg.namespaceURI, 'polyline');
    line.setAttribute('points', points); line.setAttribute('fill', 'none'); line.setAttribute('stroke', 'currentColor'); line.setAttribute('stroke-width', '3');
    svg.append(line);
    const axis = document.createElementNS(svg.namespaceURI, 'line');
    axis.setAttribute('x1', '42'); axis.setAttribute('y1', '18'); axis.setAttribute('x2', '42'); axis.setAttribute('y2', '180'); axis.setAttribute('stroke', 'currentColor'); axis.setAttribute('opacity', '.45'); svg.append(axis);
    const base = document.createElementNS(svg.namespaceURI, 'line');
    base.setAttribute('x1', '42'); base.setAttribute('y1', '180'); base.setAttribute('x2', '462'); base.setAttribute('y2', '180'); base.setAttribute('stroke', 'currentColor'); base.setAttribute('opacity', '.45'); svg.append(base);
    const labels = document.createElementNS(svg.namespaceURI, 'text');
    labels.setAttribute('x', '462'); labels.setAttribute('y', '203'); labels.setAttribute('text-anchor', 'end'); labels.textContent = `${number(schedule.at(-1).year, 0)} ${copy.fields.yearLabel}`; svg.append(labels);
    root.querySelector('[data-result-content]').append(svg);
  }

  function drawSchedule(schedule, unit, currency) {
    const table = document.createElement('table'); table.setAttribute('aria-label', copy.fields.tableLabel);
    const head = document.createElement('thead'); const header = document.createElement('tr');
    for (const label of [copy.fields.yearLabel, copy.fields.ageLabel, `${copy.fields.distanceLabel} (${unit})`, copy.fields.valueLabel]) {
      const th = document.createElement('th'); th.scope = 'col'; th.textContent = label; header.append(th);
    }
    head.append(header);
    const body = document.createElement('tbody');
    for (const point of schedule) {
      const row = document.createElement('tr');
      for (const value of [number(point.year, 0), number(point.age), number(point.distance, 0), amount(point.value, currency)]) {
        const td = document.createElement('td'); td.textContent = value; row.append(td);
      }
      body.append(row);
    }
    table.append(head, body); root.querySelector('[data-result-content]').append(table);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateCarDepreciation({
        purchasePrice: readNumber(form, 'purchasePrice', { min: 0.01, max: 1e9 }),
        yearsOwned: readNumber(form, 'yearsOwned', { min: 0, max: 50 }),
        odometerAtPurchase: readNumber(form, 'odometerAtPurchase', { min: 0, max: 1e7 }),
        currentDistance: readNumber(form, 'currentDistance', { min: 0, max: 1e7 }),
        annualDistance: readNumber(form, 'annualDistance', { min: 0, max: 1e7 }),
        annualDepreciationPercent: readNumber(form, 'annualDepreciationPercent', { min: 0, max: 100 }),
        distanceDepreciationPercent: readNumber(form, 'distanceDepreciationPercent', { min: 0, max: 100 }),
        projectionYears: readNumber(form, 'projectionYears', { min: 0, max: 50 }),
        distanceUnit: form.elements.namedItem('distanceUnit').value,
        currency: form.elements.namedItem('currency').value,
      });
      const rows = [
        [copy.messages.currentValue, amount(result.currentValue, result.currency)],
        [copy.messages.lossSincePurchase, amount(result.lossSincePurchase, result.currency)],
        [copy.messages.projectedValue, amount(result.projectedValue, result.currency)],
        [copy.messages.projectedLoss, `${amount(result.projectedLoss, result.currency)} (${number(result.projectedLossPercent)}%)`],
        [copy.messages.projectedDistance, `${number(result.schedule.at(-1).distance, 0)} ${result.distanceUnit}`],
      ];
      showRows(root, rows);
      drawChart(result.schedule, result.currency);
      drawSchedule(result.schedule, result.distanceUnit, result.currency);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  form.addEventListener('input', () => { outputText = ''; clearResult(root); announce(root, ''); });
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ purchasePrice: '20000', yearsOwned: '3', odometerAtPurchase: '0', currentDistance: '36000', annualDistance: '12000', annualDepreciationPercent: '10', distanceDepreciationPercent: '3', projectionYears: '5', distanceUnit: 'mi', currency: 'USD' })) form.elements.namedItem(name).value = value;
    form.requestSubmit(); announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  form.elements.namedItem('distanceUnit').addEventListener('change', (event) => {
    const currentUnit = event.target.value;
    const factor = currentUnit === 'mi' ? 1 / 1.609344 : 1.609344;
    for (const fieldName of ['odometerAtPurchase', 'currentDistance', 'annualDistance']) {
      const field = form.elements.namedItem(fieldName);
      if (field.value !== '') field.value = String(Number(field.value) * factor);
    }
    const rate = form.elements.namedItem('distanceDepreciationPercent');
    if (rate.value !== '') rate.value = String(100 * (1 - (1 - Number(rate.value) / 100) ** (1 / factor)));
    outputText = ''; clearResult(root); announce(root, '');
  });
  form.elements.namedItem('currency').addEventListener('change', () => { outputText = ''; clearResult(root); announce(root, ''); });
}
