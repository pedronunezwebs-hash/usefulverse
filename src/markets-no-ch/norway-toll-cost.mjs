import { norwayTollStations, norwayTollDataMetadata } from './norway-toll-stations-data.mjs';

const finite = (value, name, min = 0, max = 1e9) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
};
const NVDB_TOLL_EXPORT = 'https://nvdb-eksport.atlas.vegvesen.no/vegobjekter/45.csv?segmentering=true&inkluder=alle&api=https://nvdbapiles-v3.atlas.vegvesen.no&srid=4326';

function parseSemicolonCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted && character === '"' && text[index + 1] === '"') { cell += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (!quoted && character === ';') { row.push(cell); cell = ''; }
    else if (!quoted && (character === '\n' || character === '\r')) {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell); cell = '';
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
    } else cell += character;
  }
  if (cell || row.length) { row.push(cell); if (row.some((value) => value !== '')) rows.push(row); }
  return rows;
}
function csvNumber(value) {
  const clean = String(value ?? '').trim().replaceAll(' ', '').replace(',', '.');
  const number = clean ? Number(clean) : null;
  return number !== null && Number.isFinite(number) ? number : null;
}
function csvValue(row, headers, prefix) {
  const index = headers.findIndex((header) => header.startsWith(prefix));
  return index < 0 ? '' : (row[index] ?? '').trim();
}

/** Fetches the official open NVDB toll-station export only after a user requests a refresh. */
export async function fetchLatestNorwayTollStations({ fetcher = fetch, now = new Date() } = {}) {
  const response = await fetcher(NVDB_TOLL_EXPORT, { signal: AbortSignal.timeout(60000), headers: { accept: 'text/csv' } });
  if (!response.ok) throw new Error(`NVDB returned HTTP ${response.status}.`);
  const text = await response.text();
  if (new TextEncoder().encode(text).byteLength < 1000 || new TextEncoder().encode(text).byteLength > 20_000_000) throw new Error('Unexpected NVDB download size.');
  const rows = parseSemicolonCsv(text);
  const headers = rows.shift()?.map((value) => value.replace(/^\uFEFF/u, '').trim()) ?? [];
  if (!headers.includes('OBJ.TYPE-ID') || !headers.some((header) => header.startsWith('GEO.GEOMETRI'))) throw new Error('NVDB response does not contain expected station data.');
  const asOf = new Date(now).toISOString().slice(0, 10);
  const stations = [];
  for (const row of rows) {
    if (csvValue(row, headers, 'EGS.BOMSTASJONSTYPE.') !== 'AutoPASS bomstasjon') continue;
    const start = csvValue(row, headers, 'OBJ.STARTDATO');
    const end = csvValue(row, headers, 'OBJ.SLUTTDATO');
    if (start && start.slice(0, 10) > asOf) continue;
    if (end && end.slice(0, 10) < asOf) continue;
    const point = /POINT(?: Z)?\(\s*([-\d.]+)\s+([-\d.]+)(?:\s+[-\d.]+)?\s*\)/u.exec(csvValue(row, headers, 'GEO.GEOMETRI'));
    if (!point) continue;
    const location = [Number(point[1]), Number(point[2])];
    if (!location.every(Number.isFinite) || location[0] < 57 || location[0] > 71 || location[1] < 4 || location[1] > 32) continue;
    const baseSmallNok = csvNumber(csvValue(row, headers, 'EGS.TAKST LITEN BIL (KR).'));
    const baseLargeNok = csvNumber(csvValue(row, headers, 'EGS.TAKST STOR BIL (KR).'));
    if (baseSmallNok === null && baseLargeNok === null) continue;
    stations.push(Object.freeze({
      id: csvValue(row, headers, 'OBJ.VEGOBJEKT-ID'), name: csvValue(row, headers, 'EGS.NAVN BOMSTASJON.'),
      project: csvValue(row, headers, 'EGS.NAVN BOMPENGEANLEGG.'), municipality: csvValue(row, headers, 'LOK.KOMMUNE'),
      county: csvValue(row, headers, 'LOK.FYLKE'), operator: csvValue(row, headers, 'EGS.LENKE TIL BOMSTASJON.'),
      direction: csvValue(row, headers, 'EGS.INNKREVNINGSRETNING.'), roadRef: csvValue(row, headers, 'VSR.VEGSYSTEMREFERANSE'),
      location: Object.freeze(location), baseSmallNok, baseSmallElectricNok: csvNumber(csvValue(row, headers, 'EGS.TAKST LITEN ELBIL (KR).')),
      baseLargeNok, rushSmallNok: csvNumber(csvValue(row, headers, 'EGS.RUSHTIDSTAKST LITEN BIL (KR).')),
      rushSmallElectricNok: csvNumber(csvValue(row, headers, 'EGS.RUSHTIDSTAKST LITEN ELBIL (KR).')),
      rushLargeNok: csvNumber(csvValue(row, headers, 'EGS.RUSHTIDSTAKST STOR BIL (KR).')),
      rushMorningFrom: csvValue(row, headers, 'EGS.RUSHTID MORGEN, FRA.'), rushMorningTo: csvValue(row, headers, 'EGS.RUSHTID MORGEN, TIL.'),
      rushEveningFrom: csvValue(row, headers, 'EGS.RUSHTID ETTERMIDDAG, FRA.'), rushEveningTo: csvValue(row, headers, 'EGS.RUSHTID ETTERMIDDAG, TIL.'),
      timeDifferentiated: csvValue(row, headers, 'EGS.TIDSDIFFERENSIERT TAKST.'), hourRule: csvValue(row, headers, 'EGS.TIMESREGEL.'),
      hourRuleMinutes: csvNumber(csvValue(row, headers, 'EGS.TIMESREGEL, VARIGHET (MIN).')),
      passageGroup: csvValue(row, headers, 'EGS.TIMESREGEL, PASSERINGSGRUPPE.'), objectStartDate: start,
      objectModifiedAt: csvValue(row, headers, 'OBJ.SIST MODIFISERT'),
    }));
  }
  if (stations.length < 300) throw new Error('NVDB returned fewer stations than expected; keep using the included snapshot.');
  return Object.freeze({ stations: Object.freeze(stations), fetchedAt: asOf, attribution: 'Source: Statens vegvesen (NVDB). Retrieved on request; reused under NLOD.' });
}
const clockSeconds = (value) => {
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/u.exec(String(value ?? ''));
  if (!match) return null;
  const [, hh, mm, ss = '0'] = match;
  const seconds = Number(hh) * 3600 + Number(mm) * 60 + Number(ss);
  return seconds <= 86399 ? seconds : null;
};
function withinWindow(time, from, to) {
  const current = clockSeconds(time);
  const start = clockSeconds(from);
  const end = clockSeconds(to);
  return current !== null && start !== null && end !== null && (start <= end ? current >= start && current <= end : current >= start || current <= end);
}
function nearestOnSegment(point, a, b) {
  const rad = Math.PI / 180;
  const scaleX = Math.cos(point[0] * rad) * 111320;
  const scaleY = 110574;
  const px = (point[1] - a[1]) * scaleX;
  const py = (point[0] - a[0]) * scaleY;
  const bx = (b[1] - a[1]) * scaleX;
  const by = (b[0] - a[0]) * scaleY;
  const lengthSquared = bx * bx + by * by;
  const fraction = lengthSquared ? Math.max(0, Math.min(1, (px * bx + py * by) / lengthSquared)) : 0;
  return { distance: Math.hypot(px - bx * fraction, py - by * fraction), fraction };
}

/** Parses GPX track/route points offline. Coordinates and timestamps never leave the page. */
export function parseNorwayTollGpx(xml) {
  const source = String(xml ?? '');
  if (!source.trim() || source.length > 8_000_000 || !/<\s*gpx\b/iu.test(source)) throw new RangeError('Choose a valid GPX file under 8 MB.');
  const points = [];
  const pattern = /<(?:[\w.-]+:)?(trkpt|rtept)\b([^>]*)>([\s\S]*?)<\/(?:[\w.-]+:)?\1\s*>/giu;
  for (const match of source.matchAll(pattern)) {
    const latMatch = /\blat\s*=\s*["']([-+\d.]+)["']/iu.exec(match[2]);
    const lonMatch = /\blon\s*=\s*["']([-+\d.]+)["']/iu.exec(match[2]);
    const lat = Number(latMatch?.[1]);
    const lon = Number(lonMatch?.[1]);
    if (!latMatch || !lonMatch || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
    const time = /<(?:[\w.-]+:)?time\b[^>]*>\s*([^<]+)\s*<\/(?:[\w.-]+:)?time\s*>/iu.exec(match[3])?.[1]?.trim() ?? null;
    points.push(Object.freeze({ coordinate: Object.freeze([lat, lon]), time: time && Number.isFinite(Date.parse(time)) ? new Date(time).toISOString() : null }));
    if (points.length > 50000) throw new RangeError('The GPX route is too large; use a track with at most 50,000 route points.');
  }
  if (points.length < 2) throw new RangeError('The GPX file needs at least two route or track points.');
  return Object.freeze(points);
}

/** Returns nearby stations as suggestions only. The user confirms every pass and direction. */
export function findNorwayTollCandidates(routePoints, { stations = norwayTollStations, radiusMeters = 45 } = {}) {
  if (!Array.isArray(routePoints) || routePoints.length < 2 || routePoints.length > 50000) throw new RangeError('A route with 2–50,000 points is required.');
  const radius = finite(radiusMeters, 'Route-match radius', 10, 100);
  const candidates = [];
  for (const station of stations) {
    let best = null;
    for (let index = 0; index < routePoints.length - 1; index += 1) {
      const a = routePoints[index].coordinate ?? routePoints[index];
      const b = routePoints[index + 1].coordinate ?? routePoints[index + 1];
      const point = station.location;
      if (Math.min(a[0], b[0]) - 0.0012 > point[0] || Math.max(a[0], b[0]) + 0.0012 < point[0]) continue;
      if (Math.min(a[1], b[1]) - 0.0020 > point[1] || Math.max(a[1], b[1]) + 0.0020 < point[1]) continue;
      const match = nearestOnSegment(point, a, b);
      if (match.distance <= radius && (!best || match.distance < best.distance)) {
        const aTime = routePoints[index].time ? Date.parse(routePoints[index].time) : NaN;
        const bTime = routePoints[index + 1].time ? Date.parse(routePoints[index + 1].time) : NaN;
        const passTime = Number.isFinite(aTime) && Number.isFinite(bTime) && bTime >= aTime
          ? new Date(aTime + (bTime - aTime) * match.fraction).toISOString()
          : null;
        best = { distance: match.distance, segmentIndex: index, passTime };
      }
    }
    if (best) candidates.push(Object.freeze({ stationId: station.id, matchDistanceMeters: Math.round(best.distance), segmentIndex: best.segmentIndex, passTime: best.passTime, station }));
  }
  return Object.freeze(candidates.sort((a, b) => a.segmentIndex - b.segmentIndex || a.matchDistanceMeters - b.matchDistanceMeters));
}

function stationRate(station, vehicleClass, passTime) {
  let rate;
  let missingElectric = false;
  if (vehicleClass === 'large') rate = station.baseLargeNok;
  else if (vehicleClass === 'electric-small') {
    rate = station.baseSmallElectricNok;
    if (rate === null) { rate = station.baseSmallNok; missingElectric = true; }
  } else rate = station.baseSmallNok;
  const rush = station.timeDifferentiated === 'Ja' && (withinWindow(passTime, station.rushMorningFrom, station.rushMorningTo)
    || withinWindow(passTime, station.rushEveningFrom, station.rushEveningTo));
  if (rush && vehicleClass === 'large' && station.rushLargeNok !== null) rate = station.rushLargeNok;
  if (rush && vehicleClass === 'small' && station.rushSmallNok !== null) rate = station.rushSmallNok;
  if (rush && vehicleClass === 'electric-small') {
    if (station.rushSmallElectricNok !== null) rate = station.rushSmallElectricNok;
    else if (station.rushSmallNok !== null && missingElectric) rate = station.rushSmallNok;
  }
  return { rateNok: rate, rush, missingElectric };
}

function norwayLocalTime(passTime) {
  const date = new Date(passTime);
  if (!Number.isFinite(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Oslo', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(date);
}

/** Estimates only the confirmed toll passes supplied by the user or GPX suggestions. */
export function estimateNorwayTollCost({ passes, vehicleClass = 'small', verifiedDiscountPct = 0, stations = norwayTollStations, dataDate = norwayTollDataMetadata.asOf } = {}) {
  if (!Array.isArray(passes) || passes.length < 1 || passes.length > 2000) throw new RangeError('Enter or confirm between 1 and 2,000 toll-station passes.');
  if (!['small', 'large', 'electric-small'].includes(vehicleClass)) throw new RangeError('Choose a supported vehicle group.');
  const discount = finite(verifiedDiscountPct, 'Verified discount', 0, 100);
  const stationById = new Map(stations.map((station) => [station.id, station]));
  const previousByGroup = new Map();
  let totalNok = 0;
  let missingElectricRates = 0;
  const rows = passes.map((pass, index) => {
    if (!pass || typeof pass !== 'object' || pass.directionConfirmed !== true) throw new RangeError(`Confirm the collection direction for pass ${index + 1}.`);
    const station = stationById.get(String(pass.stationId)) ?? pass.station;
    if (!station || !station.id || !station.location) throw new RangeError(`Choose a valid toll station for pass ${index + 1}.`);
    const time = pass.localTime || (pass.passTime ? norwayLocalTime(pass.passTime) : null);
    const chosen = stationRate(station, vehicleClass, time);
    const override = pass.rateOverrideNok === '' || pass.rateOverrideNok == null ? null : finite(pass.rateOverrideNok, `Pass ${index + 1} tariff`);
    const base = override ?? chosen.rateNok;
    if (base === null || base === undefined) throw new RangeError(`Enter the published tariff for pass ${index + 1}.`);
    let hourlyWaived = false;
    const timestamp = pass.passTime ? Date.parse(pass.passTime) : NaN;
    const group = station.passageGroup;
    if (station.hourRule === 'Første passering gjelder' && group && Number.isFinite(timestamp)) {
      const previous = previousByGroup.get(group);
      const windowMs = (station.hourRuleMinutes ?? 60) * 60000;
      if (previous && timestamp >= previous.timestamp && timestamp - previous.timestamp < windowMs) hourlyWaived = true;
      else previousByGroup.set(group, { timestamp, stationId: station.id });
    }
    const beforeDiscount = hourlyWaived ? 0 : base;
    const amountNok = Math.round((beforeDiscount * (1 - discount / 100) + Number.EPSILON) * 100) / 100;
    totalNok += amountNok;
    if (chosen.missingElectric && vehicleClass === 'electric-small' && override === null) missingElectricRates += 1;
    return Object.freeze({
      stationId: station.id, stationName: station.name, project: station.project, municipality: station.municipality,
      passTime: pass.passTime ?? null, rateNok: base, rushTariffApplied: chosen.rush && override === null,
      electricTariffMissing: chosen.missingElectric && vehicleClass === 'electric-small' && override === null,
      verifiedDiscountPct: discount, hourlyWaived, amountNok, collectionDirection: station.direction,
      matchDistanceMeters: pass.matchDistanceMeters ?? null,
    });
  });
  return Object.freeze({
    dataDate, rulesYear: 2026, vehicleClass, verifiedDiscountPct: discount,
    confirmedPassCount: rows.length, totalNok: Math.round((totalNok + Number.EPSILON) * 100) / 100,
    missingElectricRates, passes: Object.freeze(rows),
    attribution: norwayTollDataMetadata.attribution, licenseUrl: norwayTollDataMetadata.licenseUrl,
  });
}
