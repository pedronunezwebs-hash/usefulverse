import { calculateScale, calculateScaleTable, createScaleBarSvg, scaleTableCsv } from './scale-drawing.mjs';

const root = document.querySelector('[data-market-tool="scaleDrawing"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const input = (id) => root.querySelector(`#${id}`);
  const status = root.querySelector('[data-scale-status]');
  const results = root.querySelector('[data-scale-results]');
  const summary = root.querySelector('[data-scale-summary]');
  const tableHost = root.querySelector('[data-scale-table]');
  const barHost = root.querySelector('[data-scale-bar]');
  const exportButton = root.querySelector('[data-action="exportScaleCsv"]');
  const printButton = root.querySelector('[data-action="printScale"]');
  let latestRows = null;
  const factors = Object.freeze({ mm: 1, cm: 10, m: 1000, km: 1_000_000, in: 25.4, ft: 304.8 });
  const formatter = new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 3 });
  const format = (number) => formatter.format(Math.abs(number) < 1e-10 ? 0 : number);
  const parseLocalized = (value) => {
    const parts = new Intl.NumberFormat(document.documentElement.lang).formatToParts(12345.6);
    const group = parts.find((part) => part.type === 'group')?.value;
    const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
    let normalized = String(value).trim();
    if (group) normalized = normalized.replaceAll(group, '');
    if (decimal !== '.') normalized = normalized.replace(decimal, '.');
    const number = Number(normalized);
    if (!normalized || !Number.isFinite(number)) throw new RangeError(f.invalid);
    return number;
  };
  const setStatus = (message, error = false) => { status.textContent = message; status.classList.toggle('result--error', error); };
  const addRow = (tbody, cells, headingFirst = false) => {
    const row = document.createElement('tr');
    cells.forEach((value, index) => {
      const cell = document.createElement(headingFirst && index === 0 ? 'th' : 'td');
      if (headingFirst && index === 0) cell.scope = 'row';
      cell.textContent = String(value);
      row.append(cell);
    });
    tbody.append(row);
  };
  const calculate = () => {
    try {
      const sourceDenominator = parseLocalized(input('scale-source').value);
      const targetDenominator = parseLocalized(input('scale-target').value);
      const realUnit = input('scale-real-unit').value;
      const main = calculateScale({ sourceDenominator, targetDenominator, drawingDistance: parseLocalized(input('scale-drawing-distance').value), drawingUnit: input('scale-drawing-unit').value });
      const distances = input('scale-distances').value.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).map(parseLocalized);
      const rows = calculateScaleTable({ sourceDenominator, targetDenominator, distances, realUnit });
      let bar;
      try {
        bar = createScaleBarSvg({ denominator: targetDenominator, realDistance: parseLocalized(input('scale-bar-distance').value), realUnit });
      } catch (error) {
        if (/between 1 mm and 250 mm/u.test(error.message)) throw new RangeError(f.barLimit);
        throw error;
      }
      const realLength = main.realLengthMm / factors[realUnit];
      const targetDrawing = main.targetDrawingLengthMm / factors[input('scale-drawing-unit').value];
      const mainTable = document.createElement('table');
      const body = document.createElement('tbody');
      addRow(body, [f.realLength, `${format(realLength)} ${realUnit}`], true);
      addRow(body, [f.paperLength, `${format(targetDrawing)} ${input('scale-drawing-unit').value}`], true);
      addRow(body, [f.printPercent, `${format(main.printScalePercent)}%`], true);
      mainTable.append(body);
      summary.replaceChildren(mainTable);

      const measurementTable = document.createElement('table');
      const caption = document.createElement('caption'); caption.textContent = f.comparisonTable;
      const heading = document.createElement('thead'); const headingRow = document.createElement('tr');
      for (const label of [f.row, f.realDistance, f.currentLength, f.newLength]) { const th = document.createElement('th'); th.scope = 'col'; th.textContent = label; headingRow.append(th); }
      heading.append(headingRow); const tableBody = document.createElement('tbody');
      for (const row of rows) addRow(tableBody, [row.index, `${format(row.realDistance)} ${row.realUnit}`, format(row.sourceDrawingMm), format(row.targetDrawingMm)]);
      measurementTable.append(caption, heading, tableBody); tableHost.replaceChildren(measurementTable);

      const parser = new DOMParser();
      const parsedSvg = parser.parseFromString(bar.svg, 'image/svg+xml').documentElement;
      barHost.replaceChildren(document.importNode(parsedSvg, true));
      barHost.setAttribute('aria-label', bar.label);
      results.hidden = false; results.dataset.scalePrintReady = 'true'; exportButton.disabled = rows.length === 0; printButton.disabled = rows.length === 0; setStatus(f.complete);
      latestRows = rows;
    } catch (error) {
      latestRows = null; results.hidden = true; delete results.dataset.scalePrintReady; exportButton.disabled = true; printButton.disabled = true;
      summary.replaceChildren(); tableHost.replaceChildren(); barHost.replaceChildren(); setStatus(error.message === f.barLimit ? f.barLimit : f.invalid, true);
    }
  };

  root.querySelector('[data-action="calculateScale"]').addEventListener('click', calculate);
  root.querySelector('[data-action="sampleScale"]').addEventListener('click', () => {
    input('scale-source').value = '100'; input('scale-target').value = '50'; input('scale-drawing-distance').value = '10';
    input('scale-drawing-unit').value = 'mm'; input('scale-real-unit').value = 'm'; input('scale-distances').value = '1\n2.5\n10'; input('scale-bar-distance').value = '10'; calculate();
  });
  root.querySelector('[data-action="clearScale"]').addEventListener('click', () => {
    for (const id of ['scale-source', 'scale-target', 'scale-drawing-distance', 'scale-distances', 'scale-bar-distance']) input(id).value = '';
    latestRows = null; results.hidden = true; delete results.dataset.scalePrintReady; exportButton.disabled = true; printButton.disabled = true;
    summary.replaceChildren(); tableHost.replaceChildren(); barHost.replaceChildren(); setStatus(f.ready); input('scale-source').focus();
  });
  exportButton.addEventListener('click', () => {
    if (!latestRows?.length) { setStatus(f.noExport, true); return; }
    const url = URL.createObjectURL(new Blob([scaleTableCsv(latestRows)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'scale-drawing-measurements.csv'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  root.querySelector('[data-action="printScale"]').addEventListener('click', () => {
    if (!latestRows) { setStatus(f.noExport, true); return; }
    window.print();
  });
}
