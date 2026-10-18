import { calculateNatalChart, natalBodies } from './natal-chart.mjs';

const root = document.querySelector('[data-market-tool="natalChart"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const bodyIndex = Object.fromEntries(natalBodies.map((body, index) => [body, index]));
  const input = (id) => root.querySelector(`#${id}`);
  const calculateButton = root.querySelector('[data-action="calculateNatalChart"]');
  const status = root.querySelector('[data-natal-status]');
  const results = root.querySelector('[data-natal-results]');
  const tableBody = root.querySelector('[data-natal-table] tbody');
  const reading = root.querySelector('[data-natal-reading]');
  const chart = root.querySelector('[data-natal-chart]');
  let lastChart = null;
  let astronomyPromise = null;

  function loadAstronomy() {
    if (window.Astronomy) return Promise.resolve(window.Astronomy);
    if (astronomyPromise) return astronomyPromise;
    astronomyPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/assets/vendor/astronomy.browser.min.js';
      script.async = true;
      script.onload = () => window.Astronomy ? resolve(window.Astronomy) : reject(new Error('library-global'));
      script.onerror = () => reject(new Error('library-load'));
      document.head.append(script);
    }).catch((error) => {
      astronomyPromise = null;
      throw error;
    });
    return astronomyPromise;
  }

  function labelBody(body) {
    return f.planetNames[bodyIndex[body]] ?? body;
  }

  function drawWheel(chartData) {
    const cx = 180, cy = 180, radius = 126, dotRadius = 74;
    const el = (name, attrs = {}, text = '') => {
      const node = document.createElementNS('http://www.w3.org/2000/svg', name);
      for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
      if (text) node.textContent = text;
      return node;
    };
    chart.replaceChildren();
    chart.setAttribute('aria-label', f.chartAlt);
    chart.append(el('circle', { cx, cy, r: radius, fill: '#fff', stroke: '#34495a', 'stroke-width': 2 }));
    chart.append(el('circle', { cx, cy, r: 96, fill: 'none', stroke: '#91a0ad', 'stroke-width': 1 }));
    chart.append(el('circle', { cx, cy, r: 49, fill: 'none', stroke: '#c3ccd3', 'stroke-width': 1 }));
    const rotation = 180 - chartData.ascendant.longitude;
    for (let index = 0; index < 12; index += 1) {
      const angle = ((index * 30 + rotation - 90) * Math.PI) / 180;
      const inner = 96;
      const x1 = cx + Math.cos(angle) * inner, y1 = cy + Math.sin(angle) * inner;
      const x2 = cx + Math.cos(angle) * radius, y2 = cy + Math.sin(angle) * radius;
      chart.append(el('line', { x1, y1, x2, y2, stroke: '#91a0ad', 'stroke-width': 1 }));
    }
    const angles = [chartData.ascendant.longitude, chartData.midheaven.longitude];
    for (const [index, longitude] of angles.entries()) {
      const angle = ((longitude + rotation - 90) * Math.PI) / 180;
      const x2 = cx + Math.cos(angle) * radius, y2 = cy + Math.sin(angle) * radius;
      chart.append(el('line', { x1: cx, y1: cy, x2, y2, stroke: index === 0 ? '#bc6b00' : '#365d86', 'stroke-width': 2 }));
      chart.append(el('circle', { cx: x2, cy: y2, r: 3.5, fill: index === 0 ? '#bc6b00' : '#365d86' }));
    }
    const ordered = [...chartData.positions].sort((a, b) => a.longitude - b.longitude);
    ordered.forEach((placement, index) => {
      const angle = ((placement.longitude + rotation - 90) * Math.PI) / 180;
      const radiusOffset = dotRadius + (index % 2 ? 9 : -5);
      const x = cx + Math.cos(angle) * radiusOffset, y = cy + Math.sin(angle) * radiusOffset;
      const group = el('g', { 'aria-hidden': 'true' });
      group.append(el('circle', { cx: x, cy: y, r: 8, fill: placement.retrograde ? '#fff3dc' : '#e6f0df', stroke: '#406b18', 'stroke-width': 1.4 }));
      group.append(el('text', { x, y: y + 3, 'text-anchor': 'middle', fill: '#253544', 'font-size': 8, 'font-weight': 700 }, String(bodyIndex[placement.body] + 1)));
      chart.append(group);
    });
    chart.append(el('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', fill: '#253544', 'font-size': 11, 'font-weight': 700 }, f.ascendantShort));
  }

  function renderResults(chartData) {
    const number = new Intl.NumberFormat(document.documentElement.lang, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    const textCell = (tag, text) => { const node = document.createElement(tag); node.textContent = text; return node; };
    const rows = chartData.positions.map((placement) => {
      const row = document.createElement('tr');
      const sign = f.signs[placement.signIndex] ?? placement.sign;
      const exact = `${number.format(placement.degree)}${f.degree} ${sign}`;
      row.append(textCell('th', labelBody(placement.body)), textCell('td', exact), textCell('td', placement.retrograde ? f.retrograde : f.direct));
      row.firstElementChild.scope = 'row';
      return row;
    });
    const ascText = `${number.format(chartData.ascendant.degree)}${f.degree} ${f.signs[chartData.ascendant.signIndex]}`;
    const mcText = `${number.format(chartData.midheaven.degree)}${f.degree} ${f.signs[chartData.midheaven.signIndex]}`;
    const angleRow = (name, value) => {
      const row = document.createElement('tr');
      const heading = textCell('th', name); heading.scope = 'row';
      row.append(heading, textCell('td', value), textCell('td', ''));
      return row;
    };
    tableBody.replaceChildren(...rows, angleRow(f.ascendant, ascText), angleRow(f.midheaven, mcText));
    reading.replaceChildren();
    for (const [label, placement] of [
      [f.sunRole, chartData.positions[0]],
      [f.moonRole, chartData.positions[1]],
      [f.ascendantRole, chartData.ascendant],
    ]) {
      const paragraph = document.createElement('p');
      const signName = f.signs[placement.signIndex] ?? placement.sign;
      const trait = f.signTraits[placement.signIndex] ?? '';
      paragraph.textContent = `${label}: ${signName} — ${trait}`;
      reading.append(paragraph);
    }
    drawWheel(chartData);
    results.hidden = false;
    lastChart = chartData;
    root.querySelector('[data-action="downloadNatalChart"]').disabled = false;
    root.querySelector('[data-action="printNatalChart"]').disabled = false;
  }

  async function calculate() {
    const requiredInputs = [...root.querySelectorAll('input[required]')];
    const invalidInput = requiredInputs.find((field) => !field.checkValidity());
    if (invalidInput) {
      invalidInput.reportValidity();
      status.textContent = f.invalid;
      status.classList.add('result--error');
      return;
    }
    calculateButton.disabled = true;
    status.textContent = f.loading;
    status.classList.remove('result--error');
    try {
      const Astronomy = await loadAstronomy();
      const chartData = calculateNatalChart({
        Astronomy,
        localDateTime: input('natal-birth-time').value,
        timeZone: input('natal-time-zone').value.trim(),
        utcOffsetMinutes: input('natal-utc-offset').value,
        latitude: input('natal-latitude').value,
        longitude: input('natal-longitude').value,
      });
      renderResults(chartData);
      status.textContent = f.complete;
    } catch (error) {
      results.hidden = true;
      lastChart = null;
      root.querySelector('[data-action="downloadNatalChart"]').disabled = true;
      root.querySelector('[data-action="printNatalChart"]').disabled = true;
      status.textContent = localizedError(error);
      status.classList.add('result--error');
    } finally {
      calculateButton.disabled = false;
    }
  }

  function localizedError(error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('library')) return f.libraryError;
    if (message.includes('does not exist because the clock changes')) return f.dstGap;
    if (message.includes('occurs twice when the clock changes')) return f.dstFold;
    if (message.includes('one of the UTC offsets')) return f.dstOffset;
    if (message.includes('UTC offset does not match')) return f.offsetMismatch;
    if (message.includes('IANA time zone')) return f.invalidTimeZone;
    if (message.includes('supported date range')) return f.dateRange;
    if (message.includes('calendar date')) return f.invalidDate;
    if (message.includes('Latitude must')) return f.coordinateRange;
    return f.invalid;
  }

  calculateButton.addEventListener('click', calculate);
  root.querySelector('[data-action="sampleNatalChart"]').addEventListener('click', () => {
    input('natal-birth-time').value = '1990-06-15T12:00';
    input('natal-time-zone').value = 'Europe/Zurich';
    input('natal-latitude').value = '47.3769';
    input('natal-longitude').value = '8.5417';
    input('natal-utc-offset').value = '';
    calculate();
  });
  root.querySelector('[data-action="clearNatalChart"]').addEventListener('click', () => {
    for (const id of ['natal-birth-time', 'natal-utc-offset']) input(id).value = '';
    input('natal-time-zone').value = 'Europe/Zurich';
    input('natal-latitude').value = '';
    input('natal-longitude').value = '';
    results.hidden = true; lastChart = null; tableBody.replaceChildren(); reading.replaceChildren(); chart.replaceChildren();
    root.querySelector('[data-action="downloadNatalChart"]').disabled = true;
    root.querySelector('[data-action="printNatalChart"]').disabled = true;
    status.textContent = f.ready; status.classList.remove('result--error'); input('natal-birth-time').focus();
  });
  root.querySelector('[data-action="downloadNatalChart"]').addEventListener('click', () => {
    if (!lastChart) return;
    const blob = new Blob([new XMLSerializer().serializeToString(chart)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'natal-chart.svg'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  });
  root.querySelector('[data-action="printNatalChart"]').addEventListener('click', () => { if (lastChart) window.print(); });
}
