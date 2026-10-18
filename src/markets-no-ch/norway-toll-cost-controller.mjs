import { norwayTollStations, norwayTollDataMetadata } from './norway-toll-stations-data.mjs';
import { estimateNorwayTollCost, fetchLatestNorwayTollStations, findNorwayTollCandidates, parseNorwayTollGpx } from './norway-toll-cost.mjs';

const root = document.querySelector('[data-norway-toll-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const q = (selector) => root.querySelector(selector);
  const escape = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const rows = [];
  let suggestions = [];
  let lastResult = null;
  let routePoints = null;
  let activeStations = norwayTollStations;
  let activeDataDate = norwayTollDataMetadata.asOf;
  const result = q('[data-toll-result]');
  const status = q('[data-toll-status]');
  const routeStatus = q('[data-toll-route-status]');
  const passList = q('[data-toll-passes]');
  const candidateList = q('[data-toll-candidates]');
  const exportButton = q('[data-toll-export]');

  function clearResult() {
    lastResult = null;
    result.hidden = true;
    result.replaceChildren();
    exportButton.disabled = true;
    status.textContent = copy.fields.ready;
  }
  function localClock(passTime) {
    if (!passTime) return '';
    const date = new Date(passTime);
    if (!Number.isFinite(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Oslo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
  }
  function renderPasses() {
    if (!rows.length) { passList.innerHTML = `<p class="hint">${escape(copy.fields.noPasses)}</p>`; return; }
    passList.innerHTML = rows.map((pass, index) => `<fieldset class="toll-pass" data-toll-pass="${index}"><legend>${index + 1}. ${escape(pass.station.name)} — ${escape(pass.station.municipality)}</legend><p>${escape(pass.station.project)} · ${escape(pass.station.direction || copy.fields.directionResult)} · ${pass.matchDistanceMeters == null ? '' : `${escape(copy.fields.matchDistance)}: ${pass.matchDistanceMeters} m`}</p><div class="fields"><label class="field"><span>${escape(copy.fields.passTime)}</span><input data-pass-time type="time" value="${escape(pass.localTime || localClock(pass.passTime))}"></label><label class="field"><span>${escape(copy.fields.customRate)}</span><input data-pass-rate type="number" min="0" max="1000000" step="any" value="${escape(pass.rateOverrideNok ?? '')}"></label><label class="check"><input data-pass-direction type="checkbox" ${pass.directionConfirmed ? 'checked' : ''}> ${escape(copy.fields.direction)}</label></div><button type="button" data-remove-pass="${index}">${escape(copy.fields.removePass)}</button></fieldset>`).join('');
  }
  function updateStationChoices() {
    const query = q('#toll-station-search').value.trim().toLocaleLowerCase();
    const matches = activeStations.filter((station) => !query || `${station.name} ${station.project} ${station.municipality} ${station.county}`.toLocaleLowerCase().includes(query)).slice(0, 60);
    q('#toll-station-choice').innerHTML = `<option value="">${escape(copy.fields.noStation)}</option>${matches.map((station) => `<option value="${escape(station.id)}">${escape(station.name)} · ${escape(station.municipality)} · ${escape(station.project)}</option>`).join('')}`;
  }
  function addPass(station, passTime = null, matchDistanceMeters = null) {
    rows.push({ stationId: station.id, station, passTime, matchDistanceMeters, directionConfirmed: false, localTime: '', rateOverrideNok: '' });
    renderPasses();
    clearResult();
  }
  function renderCandidates() {
    if (!suggestions.length) { candidateList.innerHTML = `<p class="hint">${escape(copy.fields.noMatches)}</p>`; return; }
    candidateList.innerHTML = suggestions.map((candidate, index) => `<article class="toll-candidate"><p><strong>${escape(candidate.station.name)}</strong> · ${escape(candidate.station.municipality)} · ${escape(candidate.station.project)}</p><p>${escape(candidate.matchDistanceMeters)} m · ${escape(candidate.station.direction || copy.fields.directionResult)}${candidate.passTime ? ` · ${escape(localClock(candidate.passTime))}` : ''}</p><button type="button" data-add-candidate="${index}">${escape(copy.fields.addSuggestion)}</button></article>`).join('');
  }
  q('#toll-station-search').addEventListener('input', updateStationChoices);
  q('[data-toll-add-station]').addEventListener('click', () => {
    const station = activeStations.find((item) => item.id === q('#toll-station-choice').value);
    if (!station) { status.textContent = copy.fields.noStation; return; }
    addPass(station);
  });
  q('[data-toll-match]').addEventListener('click', async () => {
    const file = q('#toll-gpx-file').files?.[0];
    if (!file) { routeStatus.textContent = copy.fields.noGpx; return; }
    if (file.size > 8_000_000 || !file.name.toLowerCase().endsWith('.gpx')) { routeStatus.textContent = copy.fields.error; return; }
    try {
      const xml = await file.text();
      routePoints = parseNorwayTollGpx(xml);
      suggestions = findNorwayTollCandidates(routePoints, { stations: activeStations });
      renderCandidates();
      routeStatus.textContent = suggestions.length ? copy.fields.routeParsed : copy.fields.noMatches;
      clearResult();
    } catch { routeStatus.textContent = copy.fields.error; }
  });
  q('[data-toll-refresh]').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    try {
      const refreshed = await fetchLatestNorwayTollStations();
      activeStations = refreshed.stations;
      activeDataDate = refreshed.fetchedAt;
      const byId = new Map(activeStations.map((station) => [station.id, station]));
      for (const pass of rows) if (byId.has(pass.stationId)) pass.station = byId.get(pass.stationId);
      updateStationChoices();
      if (routePoints) {
        suggestions = findNorwayTollCandidates(routePoints, { stations: activeStations });
        renderCandidates();
      }
      routeStatus.textContent = `${copy.fields.dataRefreshed}: ${activeDataDate}`;
      clearResult();
    } catch {
      routeStatus.textContent = copy.fields.refreshUnavailable;
    } finally { button.disabled = false; }
  });
  candidateList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-candidate]');
    if (!button) return;
    const candidate = suggestions[Number(button.dataset.addCandidate)];
    if (candidate) addPass(candidate.station, candidate.passTime, candidate.matchDistanceMeters);
  });
  passList.addEventListener('input', (event) => {
    const fieldset = event.target.closest('[data-toll-pass]');
    if (!fieldset) return;
    const pass = rows[Number(fieldset.dataset.tollPass)];
    if (event.target.matches('[data-pass-time]')) pass.localTime = event.target.value;
    if (event.target.matches('[data-pass-rate]')) pass.rateOverrideNok = event.target.value;
    if (event.target.matches('[data-pass-direction]')) pass.directionConfirmed = event.target.checked;
    clearResult();
  });
  passList.addEventListener('change', (event) => {
    const fieldset = event.target.closest('[data-toll-pass]');
    if (!fieldset) return;
    const pass = rows[Number(fieldset.dataset.tollPass)];
    if (event.target.matches('[data-pass-time]')) pass.localTime = event.target.value;
    if (event.target.matches('[data-pass-rate]')) pass.rateOverrideNok = event.target.value;
    if (event.target.matches('[data-pass-direction]')) pass.directionConfirmed = event.target.checked;
    clearResult();
  });
  passList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-pass]');
    if (!button) return;
    rows.splice(Number(button.dataset.removePass), 1);
    renderPasses();
    clearResult();
  });
  q('#toll-vehicle').addEventListener('change', clearResult);
  q('#toll-discount').addEventListener('input', clearResult);
  q('[data-toll-calculate]').addEventListener('click', () => {
    try {
      lastResult = estimateNorwayTollCost({ passes: rows, vehicleClass: q('#toll-vehicle').value, verifiedDiscountPct: q('#toll-discount').value, stations: activeStations, dataDate: activeDataDate });
      const body = lastResult.passes.map((pass) => `<tr><td>${escape(pass.stationName)}<br>${escape(pass.municipality)}</td><td>${escape(pass.project)}</td><td>${pass.passTime ? escape(new Date(pass.passTime).toLocaleString(undefined, { timeZone: 'Europe/Oslo' })) : escape(pass.localTime || '—')}</td><td>${escape(pass.rateNok.toFixed(2))} NOK${pass.rushTariffApplied ? `<br>${escape(copy.fields.rush)}` : ''}${pass.hourlyWaived ? `<br>${escape(copy.fields.hourlyWaived)}` : ''}${pass.electricTariffMissing ? `<br><strong>${escape(copy.fields.electricMissing)}</strong>` : ''}</td><td>${escape(pass.amountNok.toFixed(2))} NOK</td></tr>`).join('');
      result.innerHTML = `<h3>${escape(copy.fields.resultHeading)}</h3><p>${escape(copy.fields.dataDate)}: ${escape(lastResult.dataDate)} · ${escape(copy.fields.passes)}: ${lastResult.confirmedPassCount}</p><div class="table-wrap"><table><thead><tr><th>${escape(copy.fields.station)}</th><th>${escape(copy.fields.project)}</th><th>${escape(copy.fields.time)}</th><th>${escape(copy.fields.tariff)}</th><th>${escape(copy.fields.amount)}</th></tr></thead><tbody>${body}</tbody></table></div><p><strong>${escape(copy.fields.total)}: ${escape(lastResult.totalNok.toFixed(2))} NOK</strong></p><p class="hint">${escape(copy.fields.attribution)}</p>`;
      result.hidden = false;
      exportButton.disabled = false;
      status.textContent = copy.fields.statusCalculated;
    } catch { status.textContent = copy.fields.error; }
  });
  function csvCell(value) {
    const text = String(value ?? '');
    const safe = /^[=+\-@\t\r]/u.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  }
  exportButton.addEventListener('click', () => {
    if (!lastResult) return;
    const lines = [[copy.fields.station, copy.fields.project, copy.fields.municipality, copy.fields.time, copy.fields.directionResult, copy.fields.tariff, copy.fields.amount].map(csvCell).join(',')];
    for (const pass of lastResult.passes) lines.push([pass.stationName, pass.project, pass.municipality, pass.passTime ?? pass.localTime, pass.collectionDirection, pass.rateNok, pass.amountNok].map(csvCell).join(','));
    lines.push([copy.fields.total, '', '', '', '', '', lastResult.totalNok].map(csvCell).join(','));
    const url = URL.createObjectURL(new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'norway-toll-estimate.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  q('[data-toll-clear]').addEventListener('click', () => {
    rows.splice(0);
    suggestions = [];
    routePoints = null;
    q('#toll-gpx-file').value = '';
    q('#toll-station-search').value = '';
    q('#toll-discount').value = '0';
    q('#toll-vehicle').value = 'small';
    updateStationChoices();
    routeStatus.textContent = copy.fields.ready;
    candidateList.replaceChildren();
    renderPasses();
    clearResult();
    status.textContent = copy.fields.statusCleared;
  });
  updateStationChoices();
  renderPasses();
}
