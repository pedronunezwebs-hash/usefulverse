import { convertCoordinate, convertCoordinateBatch, formatDms } from './swiss-coordinate-converter.mjs';

const root = document.querySelector('[data-market-tool="swissCoordinates"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const source = root.querySelector('#coordinate-source');
  const target = root.querySelector('#coordinate-target');
  const first = root.querySelector('#coordinate-first');
  const second = root.querySelector('#coordinate-second');
  const firstLabel = root.querySelector('[data-coordinate-first-label]');
  const secondLabel = root.querySelector('[data-coordinate-second-label]');
  const zoneField = root.querySelector('[data-coordinate-zone-field]');
  const hemisphereField = root.querySelector('[data-coordinate-hemisphere-field]');
  const batch = root.querySelector('#coordinate-batch');
  const status = root.querySelector('[data-coordinate-status]');
  const output = root.querySelector('[data-coordinate-results]');
  const exportButton = root.querySelector('[data-action="exportCoordinates"]');
  let rows = [];
  let resultTarget = 'lv95';
  const setStatus = (message, error = false) => { status.textContent = message; status.classList.toggle('result--error', error); };
  const labels = () => {
    const geographic = source.value === 'wgs84';
    firstLabel.firstChild.textContent = geographic ? f.latitude : f.easting;
    secondLabel.firstChild.textContent = geographic ? f.longitude : f.northing;
    zoneField.hidden = source.value !== 'utm';
    hemisphereField.hidden = source.value !== 'utm';
    first.placeholder = geographic ? '46.9480 or 46° 56′ 52.8″ N' : source.value === 'lv95' ? '2600000' : source.value === 'lv03' ? '600000' : '500000';
    second.placeholder = geographic ? '7.4474 or 7° 26′ 50.6″ E' : source.value === 'lv95' ? '1200000' : source.value === 'lv03' ? '200000' : '1200000';
  };
  const accuracyLabel = (code) => ({
    'better-than-1-metre': f.swissForwardAccuracy,
    'better-than-0.12-arcsecond': f.swissInverseAccuracy,
    'up-to-1.6-metres-distortion': f.lv03OffsetAccuracy,
    'standard-wgs84-utm': f.utmAccuracy,
    'input-wgs84': f.unchangedAccuracy,
    'input-utm': f.unchangedAccuracy,
    'input-lv95': f.unchangedAccuracy,
    'input-lv03': f.unchangedAccuracy,
    'unchanged-lv03': f.unchangedAccuracy,
  }[code] ?? f.utmAccuracy);
  const crsLabel = (row) => resultTarget === 'utm'
    ? `WGS 84 / UTM ${row.zone}${row.hemisphere} · EPSG:${row.hemisphere === 'S' ? 32700 : 32600}${row.zone}`
    : ({ wgs84: 'WGS 84 · EPSG:4326', lv95: 'CH1903+ / LV95 · EPSG:2056', lv03: 'CH1903 / LV03 · EPSG:21781' }[resultTarget]);
  const displayRows = () => {
    const table = document.createElement('table');
    const head = document.createElement('thead');
    const header = document.createElement('tr');
    for (const label of [f.value1, f.value2, f.dms, f.crs, f.accuracy]) {
      const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = label; header.append(cell);
    }
    head.append(header);
    const body = document.createElement('tbody');
    for (const row of rows) {
      const geographic = Number.isFinite(row.latitude);
      const values = geographic
        ? [row.latitude.toFixed(8), row.longitude.toFixed(8), `${formatDms(row.latitude, 'latitude')} · ${formatDms(row.longitude, 'longitude')}`, crsLabel(row), accuracyLabel(row.accuracy)]
        : [row.easting.toFixed(3), row.northing.toFixed(3), '—', crsLabel(row), accuracyLabel(row.accuracy)];
      const tr = document.createElement('tr');
      for (const value of values) { const cell = document.createElement('td'); cell.textContent = value; tr.append(cell); }
      body.append(tr);
    }
    table.append(head, body);
    output.replaceChildren(table);
    output.hidden = false;
    exportButton.disabled = rows.length === 0;
  };
  const convert = () => {
    try {
      const options = { source: source.value, target: target.value, zone: Number(root.querySelector('#coordinate-zone').value), hemisphere: root.querySelector('#coordinate-hemisphere').value };
      const next = batch.value.trim()
        ? convertCoordinateBatch(batch.value, options)
        : [convertCoordinate({ ...options, first: first.value, second: second.value })];
      rows = next;
      resultTarget = target.value;
      displayRows();
      setStatus(`${f.complete} ${rows.length}`);
    } catch {
      rows = []; output.replaceChildren(); output.hidden = true; exportButton.disabled = true;
      setStatus(f.invalid, true);
    }
  };
  source.addEventListener('change', labels);
  root.querySelector('[data-action="convertCoordinates"]').addEventListener('click', convert);
  root.querySelector('[data-action="sampleCoordinates"]').addEventListener('click', () => {
    source.value = 'wgs84'; target.value = 'lv95'; labels(); first.value = '46.9480'; second.value = '7.4474'; batch.value = '';
    setStatus(f.ready); first.focus();
  });
  root.querySelector('[data-action="clearCoordinates"]').addEventListener('click', () => {
    first.value = ''; second.value = ''; batch.value = ''; rows = []; output.replaceChildren(); output.hidden = true; exportButton.disabled = true; setStatus(f.ready); first.focus();
  });
  exportButton.addEventListener('click', () => {
    if (!rows.length) { setStatus(f.noExport, true); return; }
    const headers = [f.value1, f.value2, f.dms, f.crs, f.accuracy];
    const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const data = rows.map((row) => {
      const geographic = Number.isFinite(row.latitude);
      return geographic
        ? [row.latitude.toFixed(8), row.longitude.toFixed(8), `${formatDms(row.latitude, 'latitude')} ${formatDms(row.longitude, 'longitude')}`, crsLabel(row), accuracyLabel(row.accuracy)]
        : [row.easting.toFixed(3), row.northing.toFixed(3), '', crsLabel(row), accuracyLabel(row.accuracy)];
    });
    const csv = `\uFEFF${[headers, ...data].map((line) => line.map(quote).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'coordinate-conversion.csv'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  labels();
}
