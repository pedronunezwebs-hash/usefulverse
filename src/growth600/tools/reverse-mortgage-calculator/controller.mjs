import { calculateReverseMortgage } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="reverse-mortgage-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 2);
  let outputText = '';

  function drawChart(schedule) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 480 220');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', copy.fields.chartLabel);
    const title = document.createElementNS(svg.namespaceURI, 'title');
    title.textContent = copy.fields.chartLabel;
    const description = document.createElementNS(svg.namespaceURI, 'desc');
    description.textContent = copy.fields.chartDescription;
    svg.append(title, description);
    svg.dataset.reverseMortgageChart = '';
    const max = Math.max(1, ...schedule.flatMap((item) => [item.balance, item.homeValue]));
    const pointsFor = (key) => schedule.map((item, index) => {
      const x = 46 + (schedule.length < 2 ? 0 : index * 410 / (schedule.length - 1));
      const y = 18 + (1 - item[key] / max) * 158;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
    const series = schedule.at(-1).homeValue > 0 ? [['balance', ''], ['homeValue', '7 4']] : [['balance', '']];
    for (const [key, dash] of series) {
      const line = document.createElementNS(svg.namespaceURI, 'polyline');
      line.setAttribute('points', pointsFor(key));
      if (dash) line.setAttribute('stroke-dasharray', dash);
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke', key === 'balance' ? 'currentColor' : 'var(--accent, #8fbf00)');
      line.setAttribute('stroke-width', '3');
      svg.append(line);
    }
    const axis = document.createElementNS(svg.namespaceURI, 'line');
    axis.setAttribute('x1', '46'); axis.setAttribute('y1', '18'); axis.setAttribute('x2', '46'); axis.setAttribute('y2', '180');
    axis.setAttribute('stroke', 'currentColor'); axis.setAttribute('opacity', '.45');
    svg.append(axis);
    const base = document.createElementNS(svg.namespaceURI, 'line');
    base.setAttribute('x1', '46'); base.setAttribute('y1', '180'); base.setAttribute('x2', '456'); base.setAttribute('y2', '180');
    base.setAttribute('stroke', 'currentColor'); base.setAttribute('opacity', '.45');
    svg.append(base);
    const endLabel = document.createElementNS(svg.namespaceURI, 'text');
    endLabel.setAttribute('x', '456'); endLabel.setAttribute('y', '203'); endLabel.setAttribute('text-anchor', 'end');
    endLabel.textContent = `${format(schedule.at(-1).month / 12)} ${copy.fields.yearLabel}`;
    svg.append(endLabel);
    root.querySelector('[data-result-content]').append(svg);
  }

  function drawSchedule(schedule) {
    const table = document.createElement('table');
    table.setAttribute('aria-label', copy.fields.tableLabel);
    const head = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const hasHomeValueScenario = schedule.at(-1).homeValue > 0;
    const columns = hasHomeValueScenario ? [copy.fields.yearLabel, copy.fields.balanceLabel, copy.fields.homeValueLabel] : [copy.fields.yearLabel, copy.fields.balanceLabel];
    for (const text of columns) {
      const th = document.createElement('th'); th.scope = 'col'; th.textContent = text; headerRow.append(th);
    }
    head.append(headerRow);
    const body = document.createElement('tbody');
    for (const item of schedule) {
      const row = document.createElement('tr');
      const values = hasHomeValueScenario ? [format(item.month / 12), format(item.balance), format(item.homeValue)] : [format(item.month / 12), format(item.balance)];
      for (const value of values) {
        const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
      }
      body.append(row);
    }
    table.append(head, body);
    const legend = document.createElement('ul');
    legend.className = 'reverse-mortgage-calculator__legend';
    legend.setAttribute('aria-label', copy.fields.chartLabel);
    for (const text of hasHomeValueScenario ? [copy.fields.balanceLegend, copy.fields.homeValueLegend] : [copy.fields.balanceLegend]) {
      const item = document.createElement('li'); item.textContent = text; legend.append(item);
    }
    root.querySelector('[data-result-content]').append(table);
    root.querySelector('[data-result-content]').append(legend);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearResult(root); outputText = '';
    try {
      const result = calculateReverseMortgage({
        startingBalance: readNumber(form, 'startingBalance', { min: 0, max: 1e10 }),
        upfrontFees: readNumber(form, 'upfrontFees', { min: 0, max: 1e10 }),
        monthlyAdvance: readNumber(form, 'monthlyAdvance', { min: 0, max: 1e10 }),
        monthlyFee: readNumber(form, 'monthlyFee', { min: 0, max: 1e10 }),
        annualRatePercent: readNumber(form, 'annualRatePercent', { min: 0, max: 100 }),
        years: readNumber(form, 'years', { min: 0, max: 50 }),
        homeValue: form.elements.namedItem('homeValue').value.trim() ? readNumber(form, 'homeValue', { min: 0, max: 1e10 }) : 0,
        annualHomeChangePercent: readNumber(form, 'annualHomeChangePercent', { min: -100, max: 100 }),
      });
      const rows = [
        [copy.messages.openingBalance, format(result.startingBalance)],
        [copy.messages.endingBalance, format(result.endingBalance)],
        [copy.messages.interestAccrued, format(result.interestAccrued)],
        [copy.messages.totalAdvances, format(result.totalAdvances)],
        [copy.messages.totalFees, format(result.upfrontFees + result.totalMonthlyFees)],
      ];
      if (result.hasHomeValueScenario) rows.push(
        [copy.messages.projectedHomeValue, format(result.projectedHomeValue)],
        [copy.messages.estimatedEquity, format(result.estimatedEquity)],
      );
      showRows(root, rows);
      drawChart(result.schedule);
      drawSchedule(result.schedule);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ startingBalance: '85000', upfrontFees: '3500', monthlyAdvance: '650', monthlyFee: '35', annualRatePercent: '6.5', years: '12', homeValue: '300000', annualHomeChangePercent: '2' })) form.elements.namedItem(name).value = value;
    form.requestSubmit();
    announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
