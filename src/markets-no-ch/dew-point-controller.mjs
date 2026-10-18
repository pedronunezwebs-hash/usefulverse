import { calculateDewPoint, compareSurfaceToDewPoint, humidityCurve } from './dew-point.mjs';

const root = document.querySelector('[data-market-tool="dewPoint"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const input = (id) => root.querySelector(`#${id}`);
  const status = root.querySelector('[data-dew-status]');
  const results = root.querySelector('[data-dew-results]');
  const summary = root.querySelector('[data-dew-summary]');
  const surface = root.querySelector('[data-dew-surface]');
  const surfaceStatus = root.querySelector('[data-dew-surface-status]');
  const surfaceGap = root.querySelector('[data-dew-surface-gap]');
  const chart = root.querySelector('[data-dew-chart]');
  const numberFormat = new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 2 });
  const format = (value) => numberFormat.format(Object.is(value, -0) ? 0 : value);
  const toCelsius = (value, unit) => unit === 'F' ? ((value - 32) * 5) / 9 : value;
  const fromCelsius = (value, unit) => unit === 'F' ? (value * 9) / 5 + 32 : value;
  const clearChildren = (element) => element.replaceChildren();
  const cell = (tag, text, scope) => { const node = document.createElement(tag); node.textContent = text; if (scope) node.scope = scope; return node; };

  function drawChart(temperatureC, selectedHumidity, selectedAbsoluteHumidity) {
    const points = humidityCurve({ temperatureC });
    const left = 54, right = 452, top = 18, bottom = 204;
    const maxValue = Math.max(1, Math.ceil(points.at(-1).absoluteHumidityGm3 / 5) * 5);
    const x = (rh) => left + ((rh - 1) / 99) * (right - left);
    const y = (value) => bottom - (value / maxValue) * (bottom - top);
    const make = (tag, attributes = {}, text = '') => {
      const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
      if (text) node.textContent = text;
      return node;
    };
    clearChildren(chart);
    chart.setAttribute('aria-label', f.chartDescription);
    for (let step = 0; step <= 4; step += 1) {
      const value = (maxValue * step) / 4;
      const py = y(value);
      chart.append(make('line', { x1: left, y1: py, x2: right, y2: py, stroke: '#d8e0e6', 'stroke-width': 1 }));
      chart.append(make('text', { x: left - 8, y: py + 4, 'text-anchor': 'end', fill: '#536474', 'font-size': 11 }, format(value)));
    }
    chart.append(make('line', { x1: left, y1: top, x2: left, y2: bottom, stroke: '#536474', 'stroke-width': 1.2 }));
    chart.append(make('line', { x1: left, y1: bottom, x2: right, y2: bottom, stroke: '#536474', 'stroke-width': 1.2 }));
    chart.append(make('path', { d: points.map((point, index) => `${index ? 'L' : 'M'}${x(point.relativeHumidity)} ${y(point.absoluteHumidityGm3)}`).join(' '), fill: 'none', stroke: '#406b18', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    chart.append(make('circle', { cx: x(selectedHumidity), cy: y(selectedAbsoluteHumidity), r: 6, fill: '#d38a00', stroke: '#fff', 'stroke-width': 2 }));
    for (const tick of [1, 20, 40, 60, 80, 100]) chart.append(make('text', { x: x(tick), y: bottom + 17, 'text-anchor': 'middle', fill: '#536474', 'font-size': 10 }, String(tick)));
    chart.append(make('text', { x: (left + right) / 2, y: 248, 'text-anchor': 'middle', fill: '#253544', 'font-size': 12 }, f.xAxis));
    const yLabel = make('text', { x: 13, y: (top + bottom) / 2, transform: `rotate(-90 13 ${(top + bottom) / 2})`, 'text-anchor': 'middle', fill: '#253544', 'font-size': 12 }, f.yAxis);
    chart.append(yLabel);
  }

  function calculate() {
    try {
      const unit = input('dew-unit').value;
      const temperatureC = toCelsius(input('dew-air-temp').valueAsNumber, unit);
      const relativeHumidity = input('dew-humidity').valueAsNumber;
      const result = calculateDewPoint({ temperatureC, relativeHumidity });
      const rows = [
        [f.phaseModel, result.phase === 'ice' ? f.phaseIce : f.phaseWater],
        [f.dewPoint, `${format(fromCelsius(result.dewPointC, unit))} °${unit}`],
        [f.absoluteHumidity, `${format(result.absoluteHumidityGm3)} g/m³`],
        [f.actualPressure, `${format(result.actualVapourPressureHpa)} hPa`],
        [f.saturationPressure, `${format(result.saturationVapourPressureHpa)} hPa`],
      ];
      const table = document.createElement('table');
      const body = document.createElement('tbody');
      for (const [label, value] of rows) {
        const row = document.createElement('tr');
        row.append(cell('th', label, 'row'), cell('td', value));
        body.append(row);
      }
      table.append(body);
      summary.replaceChildren(table);
      const surfaceValue = input('dew-surface-temp').value;
      surface.hidden = surfaceValue.trim() === '';
      if (!surface.hidden) {
        const comparison = compareSurfaceToDewPoint({ temperatureC, relativeHumidity, surfaceTemperatureC: toCelsius(input('dew-surface-temp').valueAsNumber, unit) });
        surfaceStatus.textContent = comparison.condensationPossible ? f.condensationPossible : f.condensationUnlikely;
        surfaceGap.textContent = `${f.surfaceGap}: ${format(fromCelsius(comparison.differenceC, unit))} °${unit}`;
      }
      drawChart(temperatureC, relativeHumidity, result.absoluteHumidityGm3);
      results.hidden = false;
      status.textContent = f.complete;
      status.classList.remove('result--error');
    } catch (error) {
      results.hidden = true;
      surface.hidden = true;
      clearChildren(summary);
      clearChildren(chart);
      status.textContent = error instanceof RangeError && error.message.includes('outside the supported formula range') ? f.outsideModel : f.invalid;
      status.classList.add('result--error');
    }
  }

  root.querySelector('[data-action="calculateDewPoint"]').addEventListener('click', calculate);
  root.querySelector('[data-action="sampleDewPoint"]').addEventListener('click', () => {
    input('dew-air-temp').value = '20'; input('dew-humidity').value = '50'; input('dew-unit').value = 'C'; input('dew-surface-temp').value = '8'; calculate();
  });
  root.querySelector('[data-action="clearDewPoint"]').addEventListener('click', () => {
    input('dew-air-temp').value = ''; input('dew-humidity').value = ''; input('dew-surface-temp').value = '';
    results.hidden = true; surface.hidden = true; clearChildren(summary); clearChildren(chart); status.textContent = f.ready; status.classList.remove('result--error'); input('dew-air-temp').focus();
  });
}
