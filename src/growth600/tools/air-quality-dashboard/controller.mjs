import { parseAirQualityCsv } from './logic.mjs';

const root = document.querySelector('[data-tool="air-quality-dashboard"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const input = form.elements.namedItem('csvFile');
  const node = (tag, text) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = String(text);
    return element;
  };
  const locale = document.documentElement.lang || 'en';
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 3 });
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });

  function makeTable(label, headers, rows) {
    const table = node('table');
    table.className = 'pending-table';
    table.append(node('caption', label));
    const head = node('thead');
    const headRow = node('tr');
    for (const value of headers) headRow.append(node('th', value));
    head.append(headRow);
    table.append(head);
    const body = node('tbody');
    for (const row of rows) {
      const tr = node('tr');
      for (const value of row) tr.append(node('td', value));
      body.append(tr);
    }
    table.append(body);
    return table;
  }

  function render(dataset) {
    const summary = node('dl');
    for (const [label, value] of [
      [copy.fields.measurements, number.format(dataset.recordCount)],
      [copy.fields.stations, number.format(dataset.stationCount)],
      [copy.fields.period, `${date.format(dataset.startTime)} – ${date.format(dataset.endTime)}`],
    ]) {
      summary.append(node('dt', label), node('dd', value));
    }
    content.append(summary);
    content.append(node('p', copy.fields.timeZoneNote));

    const statsRows = dataset.summaries.map(group => [
      group.pollutant,
      group.unit,
      number.format(group.count),
      `${number.format(group.average)} ${group.unit}`,
      `${number.format(group.minimum)} – ${number.format(group.maximum)} ${group.unit}`,
      `${number.format(group.latestValue)} ${group.unit} · ${date.format(group.latestTime)}`,
    ]);
    content.append(makeTable(copy.fields.summaryTable, [
      copy.fields.pollutant,
      copy.fields.unit,
      copy.fields.readings,
      copy.fields.average,
      copy.fields.range,
      copy.fields.latest,
    ], statsRows));

    const recordRows = dataset.recentRecords.map(record => [
      date.format(record.time),
      record.station || copy.fields.stationNotProvided,
      record.pollutant,
      number.format(record.value),
      record.unit,
    ]);
    content.append(makeTable(copy.fields.recentTable, [
      copy.fields.date,
      copy.fields.station,
      copy.fields.pollutant,
      copy.fields.value,
      copy.fields.unit,
    ], recordRows));
    if (dataset.recordCount > dataset.recentRecords.length) {
      content.append(node('p', copy.messages.recentLimit.replace('{shown}', number.format(dataset.recentRecords.length)).replace('{total}', number.format(dataset.recordCount))));
    }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    content.replaceChildren();
    status.classList.remove('status--error');
    result.hidden = false;
    const file = input.files?.[0];
    if (!file) {
      status.textContent = copy.messages.chooseFile;
      status.classList.add('status--error');
      return;
    }
    if (file.size > 100_000) {
      status.textContent = copy.messages['file-too-large'];
      status.classList.add('status--error');
      return;
    }
    status.textContent = copy.messages.loading;
    try {
      const dataset = parseAirQualityCsv(await file.text());
      render(dataset);
      status.textContent = copy.messages.complete;
    } catch (error) {
      status.textContent = copy.messages[error?.code] ?? copy.messages.error;
      status.classList.add('status--error');
      content.replaceChildren();
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    content.replaceChildren();
    status.textContent = '';
    status.classList.remove('status--error');
    result.hidden = true;
  }));
}
