import { generateFancyText } from './fancy-text.mjs';

const DAY = 86_400_000;

function finite(value, name, min = -Infinity, max = Infinity) {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) throw new RangeError(`${name} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

function lines(value, delimiter = '|') {
  return String(value ?? '').split(/\r?\n/u).map((line) => line.split(delimiter).map((part) => part.trim())).filter((row) => row.some(Boolean));
}

function dateUtc(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(String(value))) throw new RangeError('Enter a valid date.');
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) throw new RangeError('Enter a valid date.');
  return date;
}

function formatInstant(instant, timeZone) {
  try {
    return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'short' }).format(instant);
  } catch { throw new RangeError('Enter a valid IANA time zone, such as Europe/Madrid.'); }
}

function localDateKey(instant, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(instant);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function zonedDayBounds(dateText, timeZone) {
  try {
    const target = dateText;
    const center = Date.parse(`${target}T12:00:00Z`);
    let low = center - 36 * 60 * 60_000; let high = center + 36 * 60 * 60_000;
    while (high - low > 1) {
      const mid = Math.floor((low + high) / 2);
      if (localDateKey(new Date(mid), timeZone) < target) low = mid; else high = mid;
    }
    const start = high;
    low = start; high = center + 48 * 60 * 60_000;
    while (high - low > 1) {
      const mid = Math.floor((low + high) / 2);
      if (localDateKey(new Date(mid), timeZone) <= target) low = mid; else high = mid;
    }
    if (localDateKey(new Date(start), timeZone) !== target) throw new RangeError('Could not resolve that date in the selected time zone.');
    return { start, end: high };
  } catch (error) {
    if (error instanceof RangeError && error.message.includes('Could not resolve')) throw error;
    throw new RangeError('Enter a valid IANA time zone, such as Europe/Madrid.');
  }
}

// NOAA fractional-year approximation, with an explicit approximate-UTC result.
function solarAltitudeAt(instant, latitude, longitude) {
  const yearStart = Date.UTC(instant.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor((Date.UTC(instant.getUTCFullYear(), instant.getUTCMonth(), instant.getUTCDate()) - yearStart) / DAY) + 1;
  const minuteUtc = instant.getUTCHours() * 60 + instant.getUTCMinutes() + instant.getUTCSeconds() / 60;
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (minuteUtc / 60 - 12) / 24);
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma) - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const hourAngle = ((minuteUtc + eqTime + 4 * longitude) / 4 - 180) * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  return Math.asin(Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(hourAngle)) * 180 / Math.PI;
}

function solarEvent(bounds, latitude, longitude, targetAltitude, rising) {
  let previous = solarAltitudeAt(new Date(bounds.start), latitude, longitude) - targetAltitude;
  for (let t = bounds.start + 60_000; t < bounds.end; t += 60_000) {
    const current = solarAltitudeAt(new Date(t), latitude, longitude) - targetAltitude;
    if ((rising && previous < 0 && current >= 0) || (!rising && previous >= 0 && current < 0)) {
      const fraction = Math.abs(previous) / (Math.abs(previous) + Math.abs(current));
      return new Date(t - 60_000 + fraction * 60_000);
    }
    previous = current;
  }
  return null;
}

function solarEvents({ date: inputDate, latitude, longitude, timeZone = 'UTC' }) {
  dateUtc(inputDate);
  const lat = finite(latitude, 'Latitude', -90, 90);
  const lon = finite(longitude, 'Longitude', -180, 180);
  const bounds = zonedDayBounds(inputDate, timeZone);
  const events = {
    sunrise: solarEvent(bounds, lat, lon, -0.833, true),
    sunset: solarEvent(bounds, lat, lon, -0.833, false),
    civilDawn: solarEvent(bounds, lat, lon, -6, true),
    civilDusk: solarEvent(bounds, lat, lon, -6, false),
  };
  return Object.freeze({ date: inputDate, latitude: lat, longitude: lon, timeZone, events: Object.fromEntries(Object.entries(events).map(([key, value]) => [key, value ? formatInstant(value, timeZone) : null])) });
}

// Low-precision lunar altitude model. Searching the UTC day in 10-minute steps
// finds local horizon crossings; the displayed result is intentionally approximate.
function moonAltitude(instant, latitude, longitude) {
  const d = (instant.valueOf() - Date.UTC(2000, 0, 1, 12)) / DAY;
  const L = (218.316 + 13.176396 * d) * Math.PI / 180;
  const M = (134.963 + 13.064993 * d) * Math.PI / 180;
  const F = (93.272 + 13.229350 * d) * Math.PI / 180;
  const lon = L + (6.289 * Math.PI / 180) * Math.sin(M);
  const lat = (5.128 * Math.PI / 180) * Math.sin(F);
  const ob = 23.4397 * Math.PI / 180;
  const ra = Math.atan2(Math.sin(lon) * Math.cos(ob) - Math.tan(lat) * Math.sin(ob), Math.cos(lon));
  const dec = Math.asin(Math.sin(lat) * Math.cos(ob) + Math.cos(lat) * Math.sin(ob) * Math.sin(lon));
  const sidereal = (280.16 + 360.9856235 * d + longitude) * Math.PI / 180;
  const hour = sidereal - ra;
  return Math.asin(Math.sin(latitude * Math.PI / 180) * Math.sin(dec) + Math.cos(latitude * Math.PI / 180) * Math.cos(dec) * Math.cos(hour)) * 180 / Math.PI;
}

function moonEvents({ date: inputDate, latitude, longitude, timeZone = 'UTC' }) {
  dateUtc(inputDate); const lat = finite(latitude, 'Latitude', -90, 90); const lon = finite(longitude, 'Longitude', -180, 180);
  const { start, end } = zonedDayBounds(inputDate, timeZone);
  let prev = moonAltitude(new Date(start), lat, lon) + 0.125;
  let rise = null; let set = null;
  for (let t = start + 5 * 60_000; t <= end; t += 5 * 60_000) {
    const current = moonAltitude(new Date(t), lat, lon) + 0.125;
    if (prev < 0 && current >= 0 && !rise) rise = new Date(t - 150_000);
    if (prev >= 0 && current < 0 && !set) set = new Date(t - 150_000);
    prev = current;
  }
  return Object.freeze({ moonrise: rise ? formatInstant(rise, timeZone) : null, moonset: set ? formatInstant(set, timeZone) : null });
}

function persianDate({ mode = 'to-persian', date, persianYear, persianMonth, persianDay }) {
  const formatter = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' });
  if (mode === 'to-persian') {
    const d = dateUtc(date); const parts = Object.fromEntries(formatter.formatToParts(d).map((p) => [p.type, p.value]));
    return Object.freeze({ gregorian: date, persian: `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}` });
  }
  const year = Math.trunc(finite(persianYear, 'Persian year', 1, 3000)); const month = Math.trunc(finite(persianMonth, 'Persian month', 1, 12)); const day = Math.trunc(finite(persianDay, 'Persian day', 1, 31));
  const start = Date.UTC(year + 620, 2, 15, 12); const end = Date.UTC(year + 622, 3, 1, 12);
  for (let t = start; t <= end; t += DAY) {
    const d = new Date(t); const parts = Object.fromEntries(formatter.formatToParts(d).map((p) => [p.type, p.value]));
    if (Number(parts.year) === year && Number(parts.month) === month && Number(parts.day) === day) return Object.freeze({ gregorian: d.toISOString().slice(0, 10), persian: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` });
  }
  throw new RangeError('That date is not valid in the selected Persian calendar year.');
}

function riskMatrix({ rows }) {
  const entries = lines(rows).map(([name, likelihood, impact]) => ({ name, likelihood: Math.trunc(finite(likelihood, 'Likelihood', 1, 5)), impact: Math.trunc(finite(impact, 'Impact', 1, 5)) }));
  if (!entries.length || entries.length > 100) throw new RangeError('Enter 1 to 100 risks as name | likelihood (1–5) | impact (1–5).');
  return entries.map((e) => Object.freeze({ ...e, score: e.likelihood * e.impact, level: e.likelihood * e.impact >= 15 ? 'High' : e.likelihood * e.impact >= 6 ? 'Medium' : 'Low' }));
}

function orgChart({ rows }) {
  const entries = lines(rows).map(([name, manager = '']) => ({ name, manager }));
  if (!entries.length || entries.length > 200) throw new RangeError('Enter 1 to 200 rows as person | manager; leave manager blank for the top role.');
  const byName = new Map();
  for (const entry of entries) {
    if (!entry.name || byName.has(entry.name)) throw new RangeError('Every person needs a unique, non-empty name.');
    byName.set(entry.name, { ...entry, reports: [] });
  }
  const roots = [];
  for (const node of byName.values()) {
    if (!node.manager) roots.push(node);
    else {
      const manager = byName.get(node.manager);
      if (!manager) throw new RangeError(`Manager “${node.manager}” is not in the list.`);
      manager.reports.push(node);
    }
  }
  if (roots.length !== 1) throw new RangeError('Provide exactly one top role with no manager.');
  const seen = new Set();
  function visit(node) {
    if (seen.has(node.name)) throw new RangeError('The reporting lines contain a cycle.');
    seen.add(node.name);
    return Object.freeze({ name: node.name, reports: Object.freeze(node.reports.map(visit)) });
  }
  const tree = visit(roots[0]);
  if (seen.size !== entries.length) throw new RangeError('Some roles are disconnected from the top role.');
  return tree;
}

function eventBudget({ rows }) {
  const entries = lines(rows).map(([category, planned, actual]) => ({ category, planned: finite(planned, 'Planned amount', 0), actual: finite(actual, 'Actual amount', 0) }));
  if (!entries.length || entries.length > 100) throw new RangeError('Enter 1 to 100 rows as category | planned | actual.');
  const total = (key) => entries.reduce((sum, row) => sum + row[key], 0);
  return Object.freeze({ entries, planned: total('planned'), actual: total('actual'), variance: total('planned') - total('actual') });
}

function subscriptions({ rows }) {
  const factors = { weekly: 52 / 12, monthly: 1, quarterly: 1 / 3, yearly: 1 / 12 };
  const entries = lines(rows).map(([name, amount, period]) => {
    const cost = finite(amount, 'Subscription amount', 0);
    if (!(period in factors)) throw new RangeError('Billing period must be weekly, monthly, quarterly, or yearly.');
    return Object.freeze({ name, amount: cost, period, monthly: cost * factors[period], yearly: cost * factors[period] * 12 });
  });
  if (!entries.length || entries.length > 100) throw new RangeError('Enter 1 to 100 subscriptions as name | amount | weekly/monthly/quarterly/yearly.');
  return Object.freeze({ entries, monthly: entries.reduce((s, e) => s + e.monthly, 0), yearly: entries.reduce((s, e) => s + e.yearly, 0) });
}

function packingBox({ boxLength, boxWidth, boxHeight, itemLength, itemWidth, itemHeight }) {
  const box = [finite(boxLength, 'Box length', 0.001), finite(boxWidth, 'Box width', 0.001), finite(boxHeight, 'Box height', 0.001)];
  const item = [finite(itemLength, 'Item length', 0.001), finite(itemWidth, 'Item width', 0.001), finite(itemHeight, 'Item height', 0.001)];
  const orientations = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  const perBox = Math.max(...orientations.map((order) => order.reduce((count, axis, boxAxis) => count * Math.floor(box[boxAxis] / item[axis]), 1)));
  const boxVolume = box.reduce((a,b)=>a*b,1); const itemVolume = item.reduce((a,b)=>a*b,1);
  return Object.freeze({ perBox, fits: perBox > 0, boxVolume, itemVolume, volumeUpperBound: Math.floor(boxVolume / itemVolume), testedOrientations: orientations.length });
}

function carCosts({ distance, fuelEfficiency, fuelPrice, maintenancePerDistance, insurancePerYear, taxPerYear }) {
  const km = finite(distance, 'Annual distance', 0, 2_000_000); const efficiency = finite(fuelEfficiency, 'Fuel efficiency', 0.01, 1000); const price = finite(fuelPrice, 'Fuel price', 0, 1_000_000);
  const annualOther = finite(insurancePerYear, 'Annual insurance', 0) + finite(taxPerYear, 'Annual tax', 0);
  const maintenance = finite(maintenancePerDistance, 'Maintenance per distance', 0) * km;
  const fuel = km / 100 * efficiency * price;
  return Object.freeze({ annualDistance: km, fuel, maintenance, fixed: annualOther, annualTotal: fuel + maintenance + annualOther, monthlyAverage: (fuel + maintenance + annualOther) / 12, costPerDistance: km ? (fuel + maintenance + annualOther) / km : null });
}

function braSize({ underbust, bust, unit = 'cm', system = 'US' }) {
  const cm = unit === 'in' ? 2.54 : 1;
  const under = finite(underbust, 'Underbust', 40 / cm, 180 / cm); const bustValue = finite(bust, 'Bust', 40 / cm, 200 / cm);
  if (bustValue <= under) throw new RangeError('Bust measurement must be larger than underbust.');
  const u = under * cm; const b = bustValue * cm;
  const band = Math.round(u / 2.5) * 2.5;
  const cupIndex = Math.max(0, Math.min(12, Math.round((b - band) / 2.5)));
  const cups = system === 'UK' ? ['AA','A','B','C','D','DD','E','F','FF','G','GG','H','HH'] : ['AA','A','B','C','D','DD','DDD','G','H','I','J','K','L'];
  return Object.freeze({ underbustCm: u, bustCm: b, approximateBandCm: band, approximateBandUS: Math.round(band / 2.54 * 2) / 2, cup: cups[cupIndex], estimate: `${system} ${Math.round(band / 2.54 * 2) / 2}${cups[cupIndex]}` });
}

function summarize({ text, maxSentences = 3 }) {
  const source = String(text ?? '').trim(); if (source.length < 80 || source.length > 100_000) throw new RangeError('Enter between 80 and 100,000 characters.');
  const sentences = source.match(/[^.!?。！？\n]+[.!?。！？]?/gu)?.map((s) => s.trim()).filter(Boolean) ?? [];
  if (sentences.length < 2) return Object.freeze({ summary: source, sentenceCount: sentences.length, method: 'single-sentence' });
  const words = (s) => s.toLocaleLowerCase().match(/[\p{L}\p{N}]{2,}/gu) ?? [];
  const freq = new Map(); for (const s of sentences) for (const w of words(s)) freq.set(w, (freq.get(w) ?? 0) + 1);
  const ranked = sentences.map((sentence, index) => ({ sentence, index, score: words(sentence).reduce((sum, w) => sum + (freq.get(w) ?? 0), 0) / Math.sqrt(Math.max(1, words(sentence).length)) }));
  const count = Math.max(1, Math.min(10, Math.trunc(finite(maxSentences, 'Summary length', 1, 10))));
  const selected = ranked.sort((a, b) => b.score - a.score || a.index - b.index).slice(0, count).sort((a, b) => a.index - b.index);
  return Object.freeze({ summary: selected.map((s) => s.sentence).join(' '), sentenceCount: selected.length, method: 'extractive-frequency-ranking' });
}

function acrostic({ keyword, words = '' }) {
  const chars = [...String(keyword ?? '').trim().normalize('NFC')];
  if (!chars.length || chars.length > 40) throw new RangeError('Enter a keyword with 1 to 40 characters.');
  const pool = String(words).split(/\r?\n/u).map((w) => w.trim()).filter(Boolean);
  return chars.map((letter, index) => Object.freeze({ letter, suggestion: pool.find((w) => w.toLocaleLowerCase().startsWith(letter.toLocaleLowerCase())) ?? '' , index }));
}

function wordFrequency({ text, limit = 50 }) {
  const tokens = String(text ?? '').toLocaleLowerCase().match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}'’_-]*/gu) ?? [];
  if (!tokens.length || tokens.length > 250_000) throw new RangeError('Enter text containing 1 to 250,000 words.');
  const counts = new Map(); for (const word of tokens) counts.set(word, (counts.get(word) ?? 0) + 1);
  return Object.freeze({ totalWords: tokens.length, uniqueWords: counts.size, entries: [...counts].map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count || a.word.localeCompare(b.word)).slice(0, Math.trunc(finite(limit, 'Result limit', 1, 500))) });
}

function qiblaDirection({ latitude, longitude }) {
  const lat = finite(latitude, 'Latitude', -90, 90);
  const lon = finite(longitude, 'Longitude', -180, 180);
  const kaabaLat = 21.4224779 * Math.PI / 180;
  const kaabaLon = 39.8251832 * Math.PI / 180;
  const phi = lat * Math.PI / 180;
  const lambda = lon * Math.PI / 180;
  const deltaLambda = kaabaLon - lambda;
  const y = Math.sin(deltaLambda) * Math.cos(kaabaLat);
  const x = Math.cos(phi) * Math.sin(kaabaLat) - Math.sin(phi) * Math.cos(kaabaLat) * Math.cos(deltaLambda);
  const distanceAngle = 2 * Math.asin(Math.sqrt(
    Math.sin((kaabaLat - phi) / 2) ** 2
      + Math.cos(phi) * Math.cos(kaabaLat) * Math.sin(deltaLambda / 2) ** 2,
  ));
  const atKaaba = distanceAngle < 1e-12;
  const antipodalBearingUndefined = Math.hypot(x, y) < 1e-12;
  return Object.freeze({
    latitude: lat,
    longitude: lon,
    bearingDegrees: atKaaba || antipodalBearingUndefined ? null : (Math.atan2(y, x) * 180 / Math.PI + 360) % 360,
    distanceKm: 6371.0088 * distanceAngle,
    destination: 'Kaaba, Masjid al-Haram',
  });
}

export function geographicDistance({ fromLatitude, fromLongitude, toLatitude, toLongitude, waypoints = [], unit = 'km' }) {
  const points=[
    {lat:finite(fromLatitude,'Start latitude',-90,90),lon:finite(fromLongitude,'Start longitude',-180,180)},
    ...waypoints.map((point,index)=>({lat:finite(point.lat,`Waypoint ${index+1} latitude`,-90,90),lon:finite(point.lon,`Waypoint ${index+1} longitude`,-180,180)})),
    {lat:finite(toLatitude,'End latitude',-90,90),lon:finite(toLongitude,'End longitude',-180,180)},
  ];
  if(points.length>102)throw new RangeError('Use no more than 100 intermediate waypoints.');
  if(!['km','mi','nmi'].includes(unit)) throw new RangeError('Choose kilometers, miles, or nautical miles.');
  let km=0,totalAngle=0,initialBearing=null;
  for(let index=1;index<points.length;index++){
    const aPoint=points[index-1],bPoint=points[index];
    const lat1=aPoint.lat*Math.PI/180,lat2=bPoint.lat*Math.PI/180,lon1=aPoint.lon*Math.PI/180,lon2=bPoint.lon*Math.PI/180;
    const dLat=lat2-lat1,dLon=lon2-lon1;
    const a=Math.min(1,Math.max(0,Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2));
    const central=2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a)));
    km+=6371.0088*central;totalAngle+=central;
    if(initialBearing===null&&central>=1e-12&&Math.abs(Math.PI-central)>1e-12){const y=Math.sin(dLon)*Math.cos(lat2);const x=Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);if(Math.hypot(x,y)>1e-12)initialBearing=(Math.atan2(y,x)*180/Math.PI+360)%360;}
  }
  const unitFactor={km:1,mi:1/1.609344,nmi:1/1.852}[unit];
  return Object.freeze({distance:km*unitFactor,unit,initialBearing,centralAngleDegrees:totalAngle*180/Math.PI,segmentCount:points.length-1});
}

export function playRockPaperScissors({ choice }) {
  const choices=['rock','paper','scissors'];
  if(!choices.includes(choice))throw new RangeError('Choose rock, paper, or scissors.');
  const bytes=new Uint32Array(1);let sample;const ceiling=Math.floor(0x1_0000_0000/choices.length)*choices.length;
  do { crypto.getRandomValues(bytes);sample=bytes[0]; } while(sample>=ceiling);
  const computerChoice=choices[sample%choices.length];
  const outcome=choice===computerChoice?'draw':((choice==='rock'&&computerChoice==='scissors')||(choice==='paper'&&computerChoice==='rock')||(choice==='scissors'&&computerChoice==='paper'))?'win':'loss';
  return Object.freeze({choice,computerChoice,outcome});
}

function gamepadSnapshot(gamepads, deadzone = 0.15) {
  const threshold = finite(deadzone, 'Dead zone', 0, 0.5);
  if (!Array.isArray(gamepads)) throw new TypeError('Gamepad list is required.');
  return Object.freeze(gamepads.filter((pad) => pad?.connected).slice(0, 8).map((pad) => Object.freeze({
    index: Math.max(0, Math.floor(finite(pad.index, 'Controller index', 0, 255))),
    id: String(pad.id ?? 'Controller').slice(0, 160),
    mapping: String(pad.mapping ?? ''),
    buttons: Array.from(pad.buttons ?? []).slice(0, 64).map((button) => {
      const value = typeof button === 'number' ? button : button?.value;
      return Object.freeze({ pressed: Boolean(typeof button === 'number' ? button > 0.5 : button?.pressed), value: Math.max(0, Math.min(1, Number(value) || 0)) });
    }),
    axes: Array.from(pad.axes ?? []).slice(0, 16).map((axis) => {
      const value = Math.max(-1, Math.min(1, Number(axis) || 0));
      return Math.abs(value) < threshold ? 0 : value;
    }),
  })));
}

function sankey({ rows }) {
  const entries = lines(rows).map(([source, target, value]) => ({ source, target, value: finite(value, 'Flow value', 0) }));
  if (!entries.length || entries.length > 100) throw new RangeError('Enter 1 to 100 flows as source | destination | value.');
  if (entries.some((e) => !e.source || !e.target || e.source === e.target)) throw new RangeError('Every flow needs two different, non-empty labels.');
  const nodes = [...new Set(entries.flatMap(({ source, target }) => [source, target]))];
  return Object.freeze({ entries, nodes, total: entries.reduce((sum, entry) => sum + entry.value, 0), outgoing: Object.fromEntries(nodes.map((node) => [node, entries.filter((e) => e.source === node).reduce((sum, e) => sum + e.value, 0)])) });
}

function decisionTree({ rows }) {
  const entries = lines(rows).map(([question, yes, no]) => ({ question, yes, no }));
  if (!entries.length || entries.length > 100) throw new RangeError('Enter 1 to 100 rows as question | yes result | no result.');
  if (entries.some((e) => !e.question || !e.yes || !e.no)) throw new RangeError('Each decision needs a question and both outcomes.');
  const byQuestion = new Map(entries.map((entry) => [entry.question, entry]));
  if (byQuestion.size !== entries.length) throw new RangeError('Each decision question must be unique.');
  const seen = new Set();
  function build(question) {
    if (seen.has(question)) throw new RangeError('The decision tree contains a cycle.');
    const entry = byQuestion.get(question);
    if (!entry) return Object.freeze({ outcome: question });
    seen.add(question);
    const yes = byQuestion.has(entry.yes) ? build(entry.yes) : Object.freeze({ outcome: entry.yes });
    const no = byQuestion.has(entry.no) ? build(entry.no) : Object.freeze({ outcome: entry.no });
    return Object.freeze({ question: entry.question, yes, no });
  }
  const root = build(entries[0].question);
  if (seen.size !== entries.length) throw new RangeError('Connect every decision to the first question or remove unused rows.');
  const paths = [];
  function collect(node, answers = []) {
    if (node.outcome) { paths.push([...answers, node.outcome].join(' → ')); return; }
    collect(node.yes, [...answers, `${node.question}: Yes`]);
    collect(node.no, [...answers, `${node.question}: No`]);
  }
  collect(root);
  return Object.freeze({ root, nodes: Object.freeze(entries), paths: Object.freeze(paths) });
}

function shiftSchedule({ rows }) {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayAliases = new Map(dayNames.flatMap((day, index) => [[day, index], [String(index + 1), index]]));
  const minute = (time) => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/u.test(time ?? '')) throw new RangeError('Use 24-hour times such as 09:00.');
    const [h, m] = time.split(':').map(Number); return h * 60 + m;
  };
  const entries = lines(rows).map(([person, day, start, end]) => {
    const dayIndex = dayAliases.get(String(day ?? '').trim());
    if (!person || dayIndex === undefined) throw new RangeError('Use a person name and weekday code 1–7 (Monday–Sunday).');
    const from = minute(start); const to = minute(end);
    if (to <= from) throw new RangeError('Shift end must be later than its start on the same day.');
    return { person, day: dayNames[dayIndex], dayIndex, start, end, from, to, hours: (to - from) / 60 };
  });
  if (!entries.length || entries.length > 300) throw new RangeError('Enter 1 to 300 shifts as person | day | start | end.');
  for (let i = 0; i < entries.length; i++) for (let j = i + 1; j < entries.length; j++) {
    const a = entries[i], b = entries[j];
    if (a.person === b.person && a.day === b.day && a.from < b.to && b.from < a.to) throw new RangeError(`${a.person} has overlapping shifts on ${a.day}.`);
  }
  return Object.freeze({ entries, totalHours: entries.reduce((sum, e) => sum + e.hours, 0), byPerson: Object.fromEntries([...new Set(entries.map((e) => e.person))].map((person) => [person, entries.filter((e) => e.person === person).reduce((sum, e) => sum + e.hours, 0)])) });
}

function radarChart({ rows }) {
  const entries = lines(rows).map(([label, score]) => ({ label, score: finite(score, 'Score', 0, 100) }));
  if (entries.length < 3 || entries.length > 12 || entries.some((e) => !e.label)) throw new RangeError('Enter 3 to 12 labeled scores from 0 to 100.');
  return Object.freeze(entries);
}

function writingPrompt({ genre = 'any', seed = '' }) {
  const prompts = {
    any: ['Write about a promise that arrives ten years late.', 'A familiar object appears in a place it cannot be.', 'Two strangers must agree on one memory before sunrise.'],
    fantasy: ['A map changes only when nobody is looking.', 'A village hires a dragon to guard its library.', 'Magic works once, and the price is a forgotten name.'],
    mystery: ['The locked room is empty, but every clock stopped at a different time.', 'A witness remembers the event in perfect reverse order.', 'The missing item was never owned by the person who reported it.'],
    sciFi: ['A spacecraft receives a message from its own maintenance log, dated tomorrow.', 'A city can rent one hour of another planet’s gravity.', 'The first contact signal is a list of household chores.'],
    romance: ['Two people keep receiving each other’s library holds by mistake.', 'A planned goodbye is interrupted by a shared unfinished project.', 'A couple meets every year at the same train platform, never by arrangement.'],
  };
  const selectedGenre = Object.prototype.hasOwnProperty.call(prompts, genre) ? genre : 'any';
  const list = prompts[selectedGenre];
  let hash = 2166136261; for (const char of String(seed)) hash = Math.imul(hash ^ char.codePointAt(0), 16777619);
  return Object.freeze({ prompt: list[(hash >>> 0) % list.length], genre: selectedGenre });
}

function imagePixels(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob) || file.size > 20 * 1024 * 1024) return reject(new RangeError('Choose an image up to 20 MiB.'));
    const url = URL.createObjectURL(file); const image = new Image();
    image.onload = () => { try { const canvas = document.createElement('canvas'); const scale = Math.min(1, 512 / Math.max(image.width, image.height)); canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale)); const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(image, 0, 0, canvas.width, canvas.height); resolve({ data: ctx.getImageData(0, 0, canvas.width, canvas.height).data, width: canvas.width, height: canvas.height }); } catch (error) { reject(error); } finally { URL.revokeObjectURL(url); } };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new TypeError('The selected file is not a supported browser image.')); }; image.src = url;
  });
}

function colorPalette({ pixels, colors = 6 }) {
  const data = pixels?.data; if (!data?.length) throw new TypeError('Load an image first.');
  const bins = new Map();
  const pixelCount = Math.floor(data.length / 4);
  const stride = 4 * Math.max(1, Math.ceil(pixelCount / 4096));
  for (let i = 0; i < data.length; i += stride) {
    if (data[i + 3] < 128) continue;
    const rgb = [data[i], data[i + 1], data[i + 2]].map((n) => Math.round(n / 32) * 32);
    const key = rgb.map((n) => Math.min(255, n).toString(16).padStart(2, '0')).join('').toUpperCase(); bins.set(key, (bins.get(key) ?? 0) + 1);
  }
  return Object.freeze([...bins].sort((a, b) => b[1] - a[1]).slice(0, Math.trunc(finite(colors, 'Palette size', 2, 12))).map(([hex, count]) => ({ hex: `#${hex}`, count })));
}

function imageHistogram({ pixels }) {
  const data = pixels?.data; if (!data?.length) throw new TypeError('Load an image first.');
  const channels = { red: new Array(16).fill(0), green: new Array(16).fill(0), blue: new Array(16).fill(0), luminance: new Array(16).fill(0) }; let total = 0;
  for (let i = 0; i < data.length; i += 4) { if (data[i + 3] < 128) continue; channels.red[data[i] >> 4]++; channels.green[data[i + 1] >> 4]++; channels.blue[data[i + 2] >> 4]++; channels.luminance[Math.min(15, Math.floor((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 16))]++; total++; }
  return Object.freeze({ channels, total, width: pixels.width, height: pixels.height });
}

export function reviewText({ text, language }) {
  const source = String(text ?? '');
  if (!source.trim()) throw new RangeError('Enter some text to review.');
  if (source.length > 50_000) throw new RangeError('Text is longer than the 50,000-character limit.');
  const findings = [];
  const patterns = [
    ['repeatedWord', /(^|[^\p{L}\p{M}])([\p{L}\p{M}]{2,})\s+\2(?![\p{L}\p{M}])/giu, 1],
    ['spaceBeforePunctuation', /[\t \u3000]+([,.;:!?，。；：！？、؟،؛])/gu],
    ['repeatedPunctuation', /([,.;:!?，。；：！？、؟،؛])\1+/gu],
    ['repeatedSpaces', /[\t \u3000]{2,}/gu],
  ];
  for (const [kind, pattern, prefixGroup] of patterns) {
    for (const match of source.matchAll(pattern)) {
      const prefixLength = prefixGroup ? match[prefixGroup].length : 0;
      const sample = match[0].slice(prefixLength);
      const start = match.index + prefixLength;
      findings.push(Object.freeze({ kind, start, end: start + sample.length, sample }));
    }
  }
  findings.sort((a, b) => a.start - b.start || a.end - b.end);
  return Object.freeze({ language: String(language ?? 'en').trim().slice(0, 35), characterCount: source.length, findingCount: findings.length, findings: Object.freeze(findings.slice(0, 200)) });
}

export function musicInterval({ firstNote, secondNote }) {
  const letters = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
  const pitchClasses = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const parse = (value) => {
    const match = String(value ?? '').trim().match(/^([A-G])((?:#{1,2}|b{1,2}|x)?)(-?\d{1,2})$/u);
    if (!match) throw new RangeError('Use scientific pitch notation, for example C4, F#3 or Bb5.');
    const octave = Number(match[3]);
    if (!Number.isInteger(octave) || octave < -1 || octave > 9) throw new RangeError('Use an octave from -1 to 9.');
    const accidental = match[2] === 'x' ? 2 : match[2].startsWith('#') ? match[2].length : match[2].startsWith('b') ? -match[2].length : 0;
    return { letter: match[1], octave, midi: (octave + 1) * 12 + pitchClasses[match[1]] + accidental, diatonic: octave * 7 + letters[match[1]] };
  };
  const a = parse(firstNote); const b = parse(secondNote);
  let lower = a; let upper = b; let direction = b.midi < a.midi ? -1 : 1;
  if (a.midi === b.midi && b.diatonic < a.diatonic) direction = -1;
  if (direction < 0) { lower = b; upper = a; }
  const number = Math.abs(upper.diatonic - lower.diatonic) + 1;
  const semitones = Math.abs(b.midi - a.midi);
  const simpleDegree = ((number - 1) % 7) + 1;
  const octaves = Math.floor((number - 1) / 7);
  const base = [0, 2, 4, 5, 7, 9, 11][simpleDegree - 1] + octaves * 12;
  const offset = semitones - base;
  let quality;
  if ([1, 4, 5].includes(simpleDegree)) {
    quality = offset === 0 ? 'perfect' : offset === 1 ? 'augmented' : offset === -1 ? 'diminished' : 'unusual';
  } else {
    quality = offset === 0 ? 'major' : offset === -1 ? 'minor' : offset === 1 ? 'augmented' : offset === -2 ? 'diminished' : 'unusual';
  }
  return Object.freeze({ firstNote: String(firstNote).trim(), secondNote: String(secondNote).trim(), direction: semitones === 0 ? 'samePitch' : direction < 0 ? 'descending' : 'ascending', number, semitones, quality, alteration: offset });
}

export function transposeMusicXML({ musicXML, semitones, spelling = 'sharp' }) {
  const source = String(musicXML ?? '');
  if (!source.trim() || source.length > 1_000_000) throw new RangeError('Paste a MusicXML score up to 1,000,000 characters.');
  const delta = finite(semitones, 'Semitone shift', -24, 24);
  if (!Number.isInteger(delta)) throw new RangeError('The semitone shift must be a whole number.');
  if (!['sharp', 'flat'].includes(spelling)) throw new RangeError('Choose sharps or flats for the output.');
  if (typeof DOMParser === 'undefined' || typeof XMLSerializer === 'undefined') throw new Error('This browser does not support local MusicXML editing.');
  if (/<!ENTITY/iu.test(source)) throw new RangeError('Custom XML entities are not supported.');
  const doc = new DOMParser().parseFromString(source, 'application/xml');
  if (doc.querySelector('parsererror')) throw new RangeError('The pasted text is not valid XML.');
  if (doc.doctype?.systemId && !/^https?:\/\/(?:www\.)?musicxml\.org\/dtds\/(?:partwise|timewise)\.dtd$/iu.test(doc.doctype.systemId)) throw new RangeError('This MusicXML document type is not supported.');
  if (doc.documentElement?.localName !== 'score-partwise') throw new RangeError('Use an uncompressed, partwise MusicXML score.');
  const root = doc.documentElement;
  const naturalPitch = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const majorFifths = new Map([[-7,11],[-6,6],[-5,1],[-4,8],[-3,3],[-2,10],[-1,5],[0,0],[1,7],[2,2],[3,9],[4,4],[5,11],[6,6],[7,1]]);
  for (const key of root.getElementsByTagName('key')) {
    if (key.querySelector(':scope > key-step') || key.querySelector(':scope > key-alter') || key.querySelector(':scope > key-octave')) throw new RangeError('Non-traditional or octave-specific key signatures are not supported.');
    const fifths = key.querySelector(':scope > fifths');
    if (!fifths) throw new RangeError('Custom MusicXML key signatures are not supported.');
    const oldFifths = Number(fifths.textContent);
    if (!Number.isInteger(oldFifths) || !majorFifths.has(oldFifths)) throw new RangeError('A key signature is outside the supported seven-sharp/seven-flat range.');
    const modeValue = key.querySelector(':scope > mode')?.textContent?.trim().toLowerCase() || 'major';
    if (!['major', 'minor'].includes(modeValue)) throw new RangeError('Only major and minor key modes are supported.');
    const mode = modeValue;
    const tonic = majorFifths.get(oldFifths) + (mode === 'minor' ? -3 : 0);
    const transposedTonic = ((tonic + delta + (mode === 'minor' ? 3 : 0)) % 12 + 12) % 12;
    const options = [...majorFifths].filter(([, value]) => value === transposedTonic).map(([count]) => count);
    const targetFifths = spelling === 'flat' ? Math.min(...options) : Math.max(...options);
    fifths.textContent = String(targetFifths);
  }
  const signatureAlter = (fifths, step) => {
    const sharps = ['F','C','G','D','A','E','B']; const flats = ['B','E','A','D','G','C','F'];
    if (fifths > 0 && sharps.slice(0, fifths).includes(step)) return 1;
    if (fifths < 0 && flats.slice(0, -fifths).includes(step)) return -1;
    return 0;
  };
  const keyTarget = (key) => Number(key.querySelector(':scope > fifths')?.textContent ?? 0);
  let noteCount = 0;
  for (const part of root.getElementsByTagName('part')) {
    const activeKeys = new Map([['*', 0]]);
    const previousKeys = new Map();
    for (const measure of part.getElementsByTagName('measure')) {
      const accidentalState = new Map();
      for (const child of measure.children) {
        if (child.localName === 'attributes') {
          for (const key of child.children) if (key.localName === 'key') {
            const id = key.getAttribute('number') || '*';
            const fifths = keyTarget(key);
            const priorFifths = previousKeys.get(id) ?? previousKeys.get('*');
            const cancellation = [...key.children].find((entry) => entry.localName === 'cancel');
            if (cancellation && priorFifths !== undefined) cancellation.textContent = String(Math.abs(priorFifths));
            previousKeys.set(id, fifths);
            activeKeys.set(id, fifths);
            if (id === '*') { for (const staff of activeKeys.keys()) if (staff !== '*') activeKeys.set(staff, fifths); }
            for (const [stateKey] of accidentalState) if (id === '*' || stateKey.startsWith(`${id}:`)) accidentalState.delete(stateKey);
          }
        }
        if (child.localName !== 'note') continue;
        const pitch = [...child.children].find((entry) => entry.localName === 'pitch');
        if (!pitch) continue;
        const step = pitch.querySelector(':scope > step'); const alter = pitch.querySelector(':scope > alter'); const octave = pitch.querySelector(':scope > octave');
        if (!step || !octave || !Object.prototype.hasOwnProperty.call(naturalPitch, step.textContent)) throw new RangeError('A score pitch is missing a supported step or octave.');
        const alterValue = alter ? Number(alter.textContent) : 0; const octaveValue = Number(octave.textContent);
        if (!Number.isInteger(alterValue) || !Number.isInteger(octaveValue)) throw new RangeError('Microtonal or incomplete pitches are not supported.');
        const midi = (octaveValue + 1) * 12 + naturalPitch[step.textContent] + alterValue + delta;
        const targetOctave = Math.floor(midi / 12) - 1; const targetPitch = ((midi % 12) + 12) % 12;
        if (targetOctave < -1 || targetOctave > 9) throw new RangeError('A transposed note would fall outside the supported octave range.');
        const staff = child.querySelector(':scope > staff')?.textContent?.trim() || '1';
        const fifths = activeKeys.get(staff) ?? activeKeys.get('*') ?? 0;
        const candidates = [];
        for (const letter of Object.keys(naturalPitch)) for (let candidateAlter = -2; candidateAlter <= 2; candidateAlter++) {
          if (((naturalPitch[letter] + candidateAlter) % 12 + 12) % 12 !== targetPitch) continue;
          const keyAlter = signatureAlter(fifths, letter);
          const preferencePenalty = spelling === 'sharp' ? (candidateAlter < 0 ? 1 : 0) : (candidateAlter > 0 ? 1 : 0);
          candidates.push({ letter, candidateAlter, score: [candidateAlter === keyAlter ? 0 : 1, Math.abs(candidateAlter - keyAlter), Math.abs(candidateAlter), preferencePenalty] });
        }
        candidates.sort((a, b) => { for (let i = 0; i < a.score.length; i++) if (a.score[i] !== b.score[i]) return a.score[i] - b.score[i]; return a.letter.localeCompare(b.letter); });
        const chosen = candidates[0];
        step.textContent = chosen.letter; octave.textContent = String(targetOctave);
        if (chosen.candidateAlter === 0) alter?.remove();
        else if (alter) alter.textContent = String(chosen.candidateAlter);
        else { const node = doc.createElementNS(pitch.namespaceURI, 'alter'); node.textContent = String(chosen.candidateAlter); octave.before(node); }
        const stateKey = `${staff}:${chosen.letter}:${targetOctave}`;
        const expectedAlter = accidentalState.get(stateKey) ?? signatureAlter(fifths, chosen.letter);
        const accidental = [...child.children].find((entry) => entry.localName === 'accidental');
        const accidentalNames = { '-2': 'flat-flat', '-1': 'flat', '0': 'natural', '1': 'sharp', '2': 'double-sharp' };
        if (chosen.candidateAlter === expectedAlter) accidental?.remove();
        else if (accidental) accidental.textContent = accidentalNames[String(chosen.candidateAlter)];
        else { const node = doc.createElementNS(child.namespaceURI, 'accidental'); node.textContent = accidentalNames[String(chosen.candidateAlter)]; pitch.after(node); }
        accidentalState.set(stateKey, chosen.candidateAlter);
        noteCount++;
      }
    }
  }
  if (!noteCount) throw new RangeError('The score contains no pitched notes to transpose.');
  return Object.freeze({ xml: new XMLSerializer().serializeToString(doc), noteCount, semitones: delta, spelling });
}

function removeObjectInpaint({ pixels, width, height, mask, action = 'preview' }) {
  const w=finite(width,'Image width',1,900),h=finite(height,'Image height',1,900),total=w*h;
  if(!Number.isInteger(w)||!Number.isInteger(h)||total>600000||!pixels||pixels.length!==total*4)throw new RangeError('Choose an image that fits the local editing limit.');
  const original=new Uint8ClampedArray(pixels);
  if(action!=='inpaint')return Object.freeze({width:w,height:h,pixels:original,changed:false,maskedPixels:0});
  if(!mask||mask.length!==total)throw new RangeError('Mark part of the image first.');
  const masked=new Uint8Array(total);const maskPixels=[];for(let i=0;i<total;i++)if(mask[i]){masked[i]=1;maskPixels.push(i);}
  if(!maskPixels.length||maskPixels.length>Math.floor(total*.4))throw new RangeError('Mark a visible area up to 40% of the image.');
  const filled=new Uint8Array(total);const queue=new Int32Array(maskPixels.length);let tail=0;const neighbors=(index,visit)=>{const x=index%w,y=Math.floor(index/w);if(x>0)visit(index-1);if(x+1<w)visit(index+1);if(y>0)visit(index-w);if(y+1<h)visit(index+w);};
  for(const index of maskPixels){let count=0,r=0,g=0,b=0;neighbors(index,(next)=>{if(!masked[next]){count++;r+=original[next*4];g+=original[next*4+1];b+=original[next*4+2];}});if(count){original[index*4]=r/count;original[index*4+1]=g/count;original[index*4+2]=b/count;filled[index]=1;queue[tail++]=index;}}
  for(let head=0;head<tail;head++){const index=queue[head];neighbors(index,(next)=>{if(masked[next]&&!filled[next]){original[next*4]=original[index*4];original[next*4+1]=original[index*4+1];original[next*4+2]=original[index*4+2];filled[next]=1;queue[tail++]=next;}});}
  let current=original;let next=new Uint8ClampedArray(original);
  for(let pass=0;pass<36;pass++){next.set(current);for(const index of maskPixels){let count=0,r=0,g=0,b=0;neighbors(index,(neighbor)=>{count++;r+=current[neighbor*4];g+=current[neighbor*4+1];b+=current[neighbor*4+2];});if(count){next[index*4]=r/count;next[index*4+1]=g/count;next[index*4+2]=b/count;}}[current,next]=[next,current];}
  return Object.freeze({width:w,height:h,pixels:current,changed:true,maskedPixels:maskPixels.length});
}

function franceHousingScreen({ household = 'single', dependents = 0, zone = 1, colocation = 'tenant', rent = 0, resources = 0 }) {
  const people = finite(dependents, 'Dependents', 0, 3); const area = finite(zone, 'Zone', 1, 3); const monthlyRent = finite(rent, 'Monthly rent', 0, 100000); const twelveMonthResources = finite(resources, 'Resources over 12 months', 0, 100000000);
  if (![people, area].every(Number.isInteger) || !['single','couple'].includes(household) || !['tenant','roommate'].includes(colocation)) throw new RangeError('Choose a supported household, dependency count, zone and rental type.');
  const incomeTable = { single:[15900,14900,14500], couple:[19200,18200,17600], 1:[24300,23100,22400], 2:[28900,27400,26600], 3:[35300,33600,32500] };
  const rentTable = {
    tenant:{single:[336.97,293.68,275.25],couple:[406.40,359.47,333.67],1:[459.32,404.49,374.13],2:[525.97,463.37,427.75],3:[592.62,522.25,481.37]},
    roommate:{single:[252.73,220.26,206.44],couple:[304.80,269.60,250.25],1:[344.49,303.37,280.60],2:[394.48,347.53,320.82],3:[444.47,391.69,361.04]},
  };
  const composition=people===0?household:people;const resourceCeiling=incomeTable[composition][area-1];const rentCeiling=rentTable[colocation][composition][area-1];
  return Object.freeze({ household, dependents:people, zone:area, colocation, monthlyRent, resources12Months:twelveMonthResources, resourceCeiling, rentCeiling, rentCounted:Math.min(monthlyRent,rentCeiling), rentAboveCeiling:Math.max(0,monthlyRent-rentCeiling), underResourceCeiling:twelveMonthResources<=resourceCeiling, effectiveDate:'2026-10-01' });
}

function skyscrapersPuzzle({ size = 4, seed = 1, entries = '' }) {
  const n = finite(size, 'Grid size', 4, 7); const seedValue = finite(seed, 'Puzzle seed', 0, 2147483647);
  if (!Number.isInteger(n) || !Number.isInteger(seedValue)) throw new RangeError('Grid size and seed must be whole numbers.');
  let state = seedValue >>> 0 || 1;
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
  const shuffle = (values) => { const result=[...values];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result; };
  const rowOrder=shuffle(Array.from({length:n},(_,i)=>i));const columnOrder=shuffle(Array.from({length:n},(_,i)=>i));const values=shuffle(Array.from({length:n},(_,i)=>i+1));
  const solution=rowOrder.map((r)=>columnOrder.map((c)=>values[(r+c)%n]));
  const visible=(line)=>{let highest=0,count=0;for(const value of line)if(value>highest){highest=value;count++;}return count;};
  const left=solution.map(visible);const right=solution.map((row)=>visible([...row].reverse()));const top=Array.from({length:n},(_,col)=>visible(solution.map((row)=>row[col])));const bottom=Array.from({length:n},(_,col)=>visible(solution.map((row)=>row[col]).reverse()));
  const rows=String(entries).trim()?String(entries).trim().split(/\r?\n/u).map((line)=>line.trim().split(/[\s,;]+/u).map((part)=>finite(part,'Grid entry',0,7))):[];
  const board=rows.length===n&&rows.every((row)=>row.length===n)?rows:Array.from({length:n},()=>Array(n).fill(0));
  if(board.some((row)=>row.some((value)=>!Number.isInteger(value)||value>n)))throw new RangeError(`Enter blank cells or whole heights from 1 to ${n}.`);
  const rowValid=board.map((row)=>new Set(row.filter(Boolean)).size===row.filter(Boolean).length);
  const columnValid=Array.from({length:n},(_,col)=>new Set(board.map((row)=>row[col]).filter(Boolean)).size===board.map((row)=>row[col]).filter(Boolean).length);
  const leftValid=board.map((row,index)=>row.includes(0)||visible(row)===left[index]);const rightValid=board.map((row,index)=>row.includes(0)||visible([...row].reverse())===right[index]);
  const topValid=Array.from({length:n},(_,col)=>board.some((row)=>row[col]===0)||visible(board.map((row)=>row[col]))===top[col]);const bottomValid=Array.from({length:n},(_,col)=>board.some((row)=>row[col]===0)||visible(board.map((row)=>row[col]).reverse())===bottom[col]);
  const complete=board.every((row)=>row.every(Boolean))&&rowValid.every(Boolean)&&columnValid.every(Boolean)&&leftValid.every(Boolean)&&rightValid.every(Boolean)&&topValid.every(Boolean)&&bottomValid.every(Boolean);
  return Object.freeze({size:n,seed:seedValue,left:Object.freeze(left),right:Object.freeze(right),top:Object.freeze(top),bottom:Object.freeze(bottom),entries:Object.freeze(board.map((row)=>Object.freeze(row))),rowValid:Object.freeze(rowValid),columnValid:Object.freeze(columnValid),leftValid:Object.freeze(leftValid),rightValid:Object.freeze(rightValid),topValid:Object.freeze(topValid),bottomValid:Object.freeze(bottomValid),complete});
}

function linearAlgebraView({ matrixA = '', matrixB = '' }) {
  const parse = (value, label) => {
    const rows = String(value).trim().split(/\r?\n/u).map((row) => row.trim()).filter(Boolean);
    if (rows.length !== 2) throw new RangeError(`${label} needs two rows with two numbers each.`);
    const cells = rows.map((row) => row.split(/[\s,;]+/u).map((part) => finite(part, `${label} entry`, -10, 10)));
    if (cells.some((row) => row.length !== 2)) throw new RangeError(`${label} needs two rows with two numbers each.`);
    return cells;
  };
  const a = parse(matrixA, 'Matrix A'); const b = parse(matrixB, 'Matrix B');
  const multiply = (left, right) => left.map((row) => right[0].map((_, col) => row[0] * right[0][col] + row[1] * right[1][col]));
  const determinant = (matrix) => matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  const apply = (matrix, [x,y]) => [matrix[0][0] * x + matrix[0][1] * y, matrix[1][0] * x + matrix[1][1] * y];
  const composed = multiply(b,a); const coordinates = Array.from({length:5},(_,row)=>Array.from({length:5},(_,col)=>[col-2,2-row]));
  const meshes = [null,a,composed].map((matrix)=>coordinates.map((row)=>row.map((point)=>matrix?apply(matrix,point):point)));
  return Object.freeze({ matrixA:a, matrixB:b, composed, determinantA:determinant(a), determinantB:determinant(b), determinantComposed:determinant(composed), basisA:Object.freeze([[a[0][0],a[1][0]],[a[0][1],a[1][1]]]), basisComposed:Object.freeze([[composed[0][0],composed[1][0]],[composed[0][1],composed[1][1]]]), meshes:Object.freeze(meshes.map((mesh)=>Object.freeze(mesh.map((row)=>Object.freeze(row.map((point)=>Object.freeze(point))))))) });
}

function editGpxTrack({ xml, fileName = 'track.gpx', action = 'inspect', segment = 1, pointStart = 1, pointEnd = 1, distanceUnit = 'km' }) {
  if (typeof xml !== 'string' || xml.length > 15_000_000) throw new RangeError('Choose a GPX file smaller than 15 MB.');
  if (/<!DOCTYPE|<!ENTITY/iu.test(xml)) throw new RangeError('GPX files with document type or entity declarations are not supported.');
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length || doc.documentElement?.localName !== 'gpx') throw new RangeError('Choose a valid GPX XML file.');
  const segmentNodes = [];
  for (const track of Array.from(doc.getElementsByTagNameNS('*', 'trk'))) for (const child of Array.from(track.children)) if (child.localName === 'trkseg') segmentNodes.push(child);
  let pointNodes = segmentNodes.map((segmentNode) => Array.from(segmentNode.children).filter((child) => child.localName === 'trkpt'));
  if (pointNodes.reduce((sum, points) => sum + points.length, 0) > 50000) throw new RangeError('This file contains more than 50,000 track points.');
  const segmentNumber = finite(segment, 'Segment number', 1, 5000) - 1;
  const start = finite(pointStart, 'First point', 1, 50000) - 1;
  const end = finite(pointEnd, 'Last point', 1, 50000) - 1;
  if (![segmentNumber, start, end].every(Number.isInteger)) throw new RangeError('Segment and point indexes must be whole numbers.');
  if (!['inspect','remove','move-up','move-down'].includes(action)) throw new RangeError('Choose a supported edit action.');
  const target = pointNodes[segmentNumber];
  if (!target) throw new RangeError('That track segment does not exist.');
  if (action !== 'inspect') {
    if (start >= target.length) throw new RangeError('The selected point does not exist in this segment.');
    if (action === 'remove') {
      if (end < start || end >= target.length) throw new RangeError('Choose a valid point range within this segment.');
      if (target.length - (end - start + 1) < 2) throw new RangeError('Keep at least two points in each track segment.');
      for (const point of target.slice(start, end + 1)) point.remove();
    } else {
      const neighbor = action === 'move-up' ? start - 1 : start + 1;
      if (neighbor < 0 || neighbor >= target.length) throw new RangeError('That point is already at the end of its segment.');
      if (action === 'move-up') target[neighbor].before(target[start]); else target[start].after(target[neighbor]);
    }
  }
  pointNodes = segmentNodes.map((segmentNode) => Array.from(segmentNode.children).filter((child) => child.localName === 'trkpt'));
  const segmentStats = pointNodes.map((nodes) => {
    const points = nodes.map((node) => {
      const lat = Number(node.getAttribute('lat')); const lon = Number(node.getAttribute('lon'));
      if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) throw new RangeError('A track point has invalid latitude or longitude.');
      const elevationNode = Array.from(node.children).find((child) => child.localName === 'ele'); const elevation = elevationNode && elevationNode.textContent.trim() !== '' ? Number(elevationNode.textContent) : null;
      return { lat, lon, elevation: Number.isFinite(elevation) ? elevation : null };
    });
    let meters = 0; let gain = 0; let loss = 0;
    for (let index = 1; index < points.length; index++) {
      const a = points[index - 1]; const b = points[index]; const toRad = Math.PI / 180;
      const dLat = (b.lat - a.lat) * toRad; const dLon = (b.lon - a.lon) * toRad;
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toRad) * Math.cos(b.lat * toRad) * Math.sin(dLon / 2) ** 2;
      meters += 6_371_000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
      if (a.elevation !== null && b.elevation !== null) { const delta = b.elevation - a.elevation; if (delta > 0) gain += delta; else loss -= delta; }
    }
    return Object.freeze({ points: points.length, meters, elevationGain: gain, elevationLoss: loss });
  });
  const total = segmentStats.reduce((sum, item) => ({ points: sum.points + item.points, meters: sum.meters + item.meters, elevationGain: sum.elevationGain + item.elevationGain, elevationLoss: sum.elevationLoss + item.elevationLoss }), { points: 0, meters: 0, elevationGain: 0, elevationLoss: 0 });
  return Object.freeze({ xml: new XMLSerializer().serializeToString(doc), fileName: String(fileName || 'track.gpx').replace(/[^\p{L}\p{N}._-]/gu, '_').slice(0, 100), action, segment: segmentNumber + 1, distanceUnit, segments: Object.freeze(segmentStats), total: Object.freeze(total), distance: total.meters / (distanceUnit === 'mi' ? 1609.344 : 1000) });
}

function starBattleState({ board = '' }) {
  const rows = String(board).split(/\r?\n/u);
  if (rows.length !== 8 || rows.some((row) => !/^[.*]{8}$/u.test(row))) throw new RangeError('The board must contain eight rows of eight cells.');
  const selected = rows.map((row) => [...row].map((cell) => cell === '*'));
  const rowCounts = selected.map((row) => row.filter(Boolean).length);
  const columnCounts = Array.from({ length: 8 }, (_, col) => selected.reduce((count, row) => count + Number(row[col]), 0));
  const regionCounts = [0,0,0,0];
  for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) if (selected[row][col]) regionCounts[(row >= 4 ? 2 : 0) + (col >= 4 ? 1 : 0)]++;
  let touchingPairs = 0;
  for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) if (selected[row][col]) for (const [dr, dc] of [[0,1],[1,-1],[1,0],[1,1]]) if (selected[row+dr]?.[col+dc]) touchingPairs++;
  const complete = rowCounts.every((count) => count === 2) && columnCounts.every((count) => count === 2) && regionCounts.every((count) => count === 4) && touchingPairs === 0;
  return Object.freeze({ board: Object.freeze(selected.map((row) => Object.freeze(row))), rowCounts: Object.freeze(rowCounts), columnCounts: Object.freeze(columnCounts), regionCounts: Object.freeze(regionCounts), touchingPairs, starCount: rowCounts.reduce((sum, count) => sum + count, 0), complete });
}

function analyzeRecipeNutrition({ rows = '', servings }) {
  const portionCount = finite(servings, 'Servings', 1, 100);
  if (!Number.isInteger(portionCount)) throw new RangeError('Servings must be a whole number.');
  const lines = String(rows).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || lines.length > 100) throw new RangeError('Enter between 1 and 100 ingredient rows.');
  const ingredients = lines.map((line, index) => {
    const parts = line.split('|').map((part) => part.trim());
    if (parts.length !== 6 || !parts[0] || parts[0].length > 80) throw new RangeError(`Ingredient row ${index + 1} needs: name | grams | kcal | protein g | carbohydrates g | fat g per 100 g.`);
    const [name, gramsText, kcalText, proteinText, carbsText, fatText] = parts;
    const grams = finite(gramsText, `Ingredient ${index + 1} grams`, 0.01, 100000);
    const per100 = [kcalText, proteinText, carbsText, fatText].map((value, nutrientIndex) => finite(value, `Ingredient ${index + 1} nutrient ${nutrientIndex + 1}`, 0, 1000));
    const factor = grams / 100;
    return Object.freeze({ name, grams, calories: per100[0] * factor, protein: per100[1] * factor, carbohydrates: per100[2] * factor, fat: per100[3] * factor });
  });
  const totals = ingredients.reduce((sum, ingredient) => { for (const key of ['calories','protein','carbohydrates','fat']) sum[key] += ingredient[key]; return sum; }, { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
  const perServing = Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, value / portionCount]));
  return Object.freeze({ ingredients: Object.freeze(ingredients), servings: portionCount, totals: Object.freeze(totals), perServing: Object.freeze(perServing) });
}

function factorial(value) { let result = 1; for (let i = 2; i <= value; i++) result *= i; return result; }
function associatedLaguerre(order, alpha, x) {
  if (order === 0) return 1;
  let previous = 1; let current = 1 + alpha - x;
  for (let k = 2; k <= order; k++) { const next = ((2 * k - 1 + alpha - x) * current - (k - 1 + alpha) * previous) / k; previous = current; current = next; }
  return current;
}
function associatedLegendre(degree, order, x) {
  let pmm = 1;
  if (order > 0) { const root = Math.sqrt(Math.max(0, 1 - x * x)); let factor = 1; for (let i = 1; i <= order; i++) { pmm *= -factor * root; factor += 2; } }
  if (degree === order) return pmm;
  let pmmp1 = x * (2 * order + 1) * pmm;
  if (degree === order + 1) return pmmp1;
  let previous = pmm; let current = pmmp1;
  for (let l = order + 2; l <= degree; l++) { const next = ((2 * l - 1) * x * current - (l + order - 1) * previous) / (l - order); previous = current; current = next; }
  return current;
}
function quantumOrbital({ n, l, m, z, plane = 'xy' }) {
  const principal = finite(n, 'Principal quantum number', 1, 8);
  const angular = finite(l, 'Angular quantum number', 0, principal - 1);
  const magnetic = finite(m, 'Magnetic quantum number', -angular, angular);
  const charge = finite(z, 'Nuclear charge', 1, 10);
  if (![principal, angular, magnetic, charge].every(Number.isInteger)) throw new RangeError('Quantum numbers and nuclear charge must be whole numbers.');
  if (!['xy', 'xz', 'yz'].includes(plane)) throw new RangeError('Choose an available cross-section plane.');
  const size = 161; const half = (size - 1) / 2; const extent = 5 * principal * principal / charge;
  const absM = Math.abs(magnetic); const radialOrder = principal - angular - 1; const data = new Float32Array(size * size); let maximum = 0;
  const radialNorm = Math.sqrt((2 * charge / principal) ** 3 * factorial(radialOrder) / (2 * principal * factorial(principal + angular)));
  const angularNorm = Math.sqrt(((2 * angular + 1) / (4 * Math.PI)) * factorial(angular - absM) / factorial(angular + absM));
  for (let row = 0; row < size; row++) for (let col = 0; col < size; col++) {
    const u = (col - half) / half * extent; const v = (half - row) / half * extent;
    let x = u, y = v, zz = 0;
    if (plane === 'xz') { x = u; y = 0; zz = v; } else if (plane === 'yz') { x = 0; y = u; zz = v; }
    const r = Math.hypot(x, y, zz); const rho = 2 * charge * r / principal;
    const radial = radialNorm * Math.exp(-rho / 2) * rho ** angular * associatedLaguerre(radialOrder, 2 * angular + 1, rho);
    const cosTheta = r === 0 ? (angular === 0 ? 1 : 0) : zz / r;
    const legendre = associatedLegendre(angular, absM, cosTheta); const phi = Math.atan2(y, x);
    const trig = magnetic === 0 ? 1 : magnetic > 0 ? Math.cos(absM * phi) : Math.sin(absM * phi);
    const realComponentScale = magnetic === 0 ? 1 : Math.sqrt(2);
    const density = radial * radial * (angularNorm * legendre * realComponentScale * trig) ** 2;
    const index = row * size + col; data[index] = Number.isFinite(density) ? density : 0; if (data[index] > maximum) maximum = data[index];
  }
  if (!(maximum > 0)) throw new RangeError('This cross-section has no visible density. Choose another plane or orbital orientation.');
  for (let i = 0; i < data.length; i++) data[i] /= maximum;
  return Object.freeze({ n: principal, l: angular, m: magnetic, z: charge, plane, size, extentBohr: extent, energyEv: -13.605693 * charge * charge / (principal * principal), density: Array.from(data) });
}

export async function calculatePendingTool(id, input) {
  switch (id) {
    case 'sunrise-sunset-calculator': return solarEvents(input);
    case 'moonrise-moonset-calculator': return moonEvents(input);
    case 'persian-calendar-converter': return persianDate(input);
    case 'project-risk-matrix': return riskMatrix(input);
    case 'org-chart-maker': return orgChart(input);
    case 'event-budget-calculator': return eventBudget(input);
    case 'subscription-tracker': return subscriptions(input);
    case 'packing-box-calculator': return packingBox(input);
    case 'car-running-cost-calculator': return carCosts(input);
    case 'bra-size-calculator': return braSize(input);
    case 'writing-prompt-generator': return writingPrompt(input);
    case 'text-summarizer': return summarize(input);
    case 'grammar-checker': return reviewText(input);
    case 'music-interval-calculator': return musicInterval(input);
    case 'music-transposition': return transposeMusicXML(input);
    case 'orbital-visualizer': return quantumOrbital(input);
    case 'recipe-nutrition-analyzer': return analyzeRecipeNutrition(input);
    case 'star-battle': return starBattleState(input);
    case 'gpx-track-editor': return editGpxTrack(input);
    case 'linear-algebra-visualizer': return linearAlgebraView(input);
    case 'skyscrapers-puzzle': return skyscrapersPuzzle(input);
    case 'france-housing-benefit': return franceHousingScreen(input);
    case 'object-remover': return removeObjectInpaint(input);
    case 'acrostic-poem-maker': return acrostic(input);
    case 'word-frequency-counter': return wordFrequency(input);
    case 'india-epf-calculator': return calculateIndiaEpf(input);
    case 'sleepiness-questionnaire': return summarizeSleepiness(input);
    case 'futures-position-calculator': return calculateFuturesPosition(input);
    case 'pet-feeding-calculator': return calculatePetFoodPortion(input);
    case 'font-editor': return createFontStyle(input);
    case 'password-breach-checker': return checkPwnedPassword(input);
    case 'survival-analysis': return kaplanMeier(input);
    case 'lithophane-generator': return generateLithophane(input);
    case 'karaoke-lyrics-editor': return editLrc(input);
    case 'creatinine-clearance-calculator': return calculateCreatinineClearance(input);
    case 'medication-schedule': return buildMedicationSchedule(input);
    case 'database-migration-converter': return convertCreateTable(input);
    case 'color-vision-check': return createColorDifferenceRound(input);
    case 'audio-denoiser': return gateAudioNoise(input);
    case 'brazil-termination-calculator': return estimateBrazilTermination(input);
    case 'germany-net-salary': return estimateGermanyNetSalary(input);
    case 'qibla-compass': return qiblaDirection(input);
    case 'geographic-distance-calculator': return geographicDistance(input);
    case 'rock-paper-scissors': return playRockPaperScissors(input);
    case 'would-you-rather': return wouldYouRatherVote(input);
    case 'dns-lookup': return dnsLookup(input);
    case 'charades': return pickCharadesPrompt(input);
    case 'static-website-builder': return buildStaticWebsite(input);
    case 'word-cloud-generator': return wordCloud(input);
    case 'hanoi-tower': return newHanoiGame(input);
    case 'raci-matrix-builder': return buildRaciMatrix(input);
    case 'business-model-canvas': return businessModelCanvas(input);
    case 'gamepad-tester': return gamepadSnapshot(input.gamepads, input.deadzone);
    case 'soundboard': return Object.freeze({ samples: input.files?.length ?? 0, volume: finite(input.volume, 'Volume', 0, 1) });
    case 'color-palette-from-image': return colorPalette(input);
    case 'image-histogram': return imageHistogram(input);
    case 'fancy-text-generator': return generateFancyText(input.text);
    case 'mockup-generator': return Object.freeze({ ready: Boolean(input.file), width: input.width, frame: input.frame });
    case 'speed-reading-app': { const words = String(input.text ?? '').trim().split(/\s+/u).filter(Boolean); return Object.freeze({ words: words.length, minutes: words.length / finite(input.wpm, 'Reading speed', 60, 1500) }); }
    case 'logo-maker': return Object.freeze({ text: String(input.text ?? '').trim().slice(0, 40), color: String(input.color ?? '#4257D6'), background: String(input.background ?? '#F4F5FA'), shape: ['round','square','none'].includes(input.shape) ? input.shape : 'round', layout: ['inline','stacked'].includes(input.layout) ? input.layout : 'inline' });
    case 'radar-chart-maker': return radarChart(input);
    case 'sankey-diagram-generator': return sankey(input);
    case 'decision-tree-maker': return decisionTree(input);
    case 'shift-scheduler': return shiftSchedule(input);
    default: throw new RangeError(`Unknown pending tool: ${id}`);
  }
}

function wouldYouRatherVote({ question, optionA, optionB, choice }) {
  const clean = (value, label, max) => {
    const text = String(value ?? '').trim();
    if (!text || text.length > max || /[\u0000-\u001f\u007f]/u.test(text)) throw new RangeError(`${label} must contain 1 to ${max} printable characters.`);
    return text;
  };
  const prompt = clean(question, 'Question', 240);
  const first = clean(optionA, 'First option', 120);
  const second = clean(optionB, 'Second option', 120);
  const foldOption = (value) => value.normalize('NFC').toLocaleLowerCase('und');
  if (foldOption(first) === foldOption(second)) throw new RangeError('Enter two different options.');
  if (!['a', 'b'].includes(choice)) throw new RangeError('Choose one of the two options.');
  return Object.freeze({ question: prompt, optionA: first, optionB: second, votesForA: choice === 'a' ? 1 : 0, votesForB: choice === 'b' ? 1 : 0, totalVotes: 1 });
}

function neverHaveIEverVote({ prompt, participants, answer }) {
  const question = String(prompt ?? '').trim();
  if (!question || question.length > 240 || /[\u0000-\u001f\u007f]/u.test(question)) throw new RangeError('Enter a prompt with 1 to 240 printable characters.');
  const count = finite(participants, 'Participants', 2, 50);
  if (!Number.isInteger(count)) throw new RangeError('Enter a whole number of 2 to 50 participants.');
  if (!['yes', 'no'].includes(answer)) throw new RangeError('Choose whether the statement applies to you.');
  return Object.freeze({ prompt: question, participants: count, answer });
}

export function basketballShot({ angle, power, distance }) {
  const launchAngle = finite(angle, 'Launch angle', 25, 75) * Math.PI / 180;
  const speed = finite(power, 'Shot power', 5, 12);
  const targetDistance = finite(distance, 'Target distance', 3, 8);
  const startHeight = 2;
  const targetHeight = 3.05;
  const gravity = 9.81;
  const horizontalSpeed = speed * Math.cos(launchAngle);
  const timeAtTarget = targetDistance / horizontalSpeed;
  const heightAtTarget = startHeight + speed * Math.sin(launchAngle) * timeAtTarget - gravity * timeAtTarget ** 2 / 2;
  const verticalError = heightAtTarget - targetHeight;
  const verticalVelocityAtTarget = speed * Math.sin(launchAngle) - gravity * timeAtTarget;
  return Object.freeze({
    angle: launchAngle * 180 / Math.PI,
    power: speed,
    distance: targetDistance,
    heightAtTarget,
    verticalError,
    verticalVelocityAtTarget,
    made: Math.abs(verticalError) <= 0.105 && verticalVelocityAtTarget < 0,
    trajectory: Object.freeze(Array.from({ length: 25 }, (_, index) => {
      const time = timeAtTarget * index / 24;
      return Object.freeze({ x: horizontalSpeed * time, y: startHeight + speed * Math.sin(launchAngle) * time - gravity * time ** 2 / 2 });
    })),
  });
}

function chineseZodiac({ date, locale = 'en' }) {
  const inputDate = dateUtc(date);
  const animals = ['animalMonkey', 'animalRooster', 'animalDog', 'animalPig', 'animalRat', 'animalOx', 'animalTiger', 'animalRabbit', 'animalDragon', 'animalSnake', 'animalHorse', 'animalGoat'];
  let formatter;
  try {
    formatter = new Intl.DateTimeFormat(locale || 'en', { calendar: 'chinese', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  } catch {
    formatter = new Intl.DateTimeFormat('en', { calendar: 'chinese', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  }
  const parts = formatter.formatToParts(inputDate);
  const relatedYear = Number(parts.find((part) => part.type === 'relatedYear')?.value);
  if (formatter.resolvedOptions().calendar !== 'chinese' || !Number.isInteger(relatedYear)) {
    return Object.freeze({ supported: false, lunarDate: formatter.format(inputDate) });
  }
  return Object.freeze({ supported: true, relatedYear, animalKey: animals[((relatedYear % 12) + 12) % 12], lunarDate: formatter.format(inputDate) });
}

export const EGFR_MAINTENANCE = Object.freeze({ effectiveFrom: '2021-01-01', checkedAt: '2026-10-19', reviewDue: '2026-11-19', sourceUrl: 'https://www.niddk.nih.gov/research-funding/research-programs/kidney-clinical-research-epidemiology/laboratory/glomerular-filtration-rate-equations/adults' });

function egfrCalculator({ creatinine, unit, age, sex, asOf = new Date().toISOString().slice(0, 10) }) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(String(asOf)) || new Date(`${asOf}T00:00:00.000Z`).toISOString().slice(0, 10) !== asOf) throw new RangeError('Choose a valid estimate date.');
  if (asOf < EGFR_MAINTENANCE.effectiveFrom) { const error = new RangeError('The 2021 CKD-EPI equation is not available for this estimate date.'); error.code = 'rules-not-effective'; throw error; }
  if (asOf > EGFR_MAINTENANCE.reviewDue) { const error = new RangeError('This clinical equation needs a fresh official-source review.'); error.code = 'rules-expired'; throw error; }
  const reportedValue = finite(creatinine, 'Serum creatinine', 0.1, 1800);
  const years = finite(age, 'Age', 18, 120);
  if (!Number.isInteger(years)) throw new RangeError('Age must be a whole number from 18 to 120.');
  if (!['female', 'male'].includes(sex)) throw new RangeError('Choose the equation sex category shown by the source.');
  if (!['mg-dl', 'umol-l'].includes(unit)) throw new RangeError('Choose mg/dL or µmol/L.');
  const serumCreatinineMgDl = unit === 'umol-l' ? reportedValue / 88.4 : reportedValue;
  if (serumCreatinineMgDl < 0.1 || serumCreatinineMgDl > 20) throw new RangeError('Enter a serum creatinine value within the supported range for the selected unit.');
  const kappa = sex === 'female' ? 0.7 : 0.9;
  const alpha = sex === 'female' ? -0.241 : -0.302;
  const ratio = serumCreatinineMgDl / kappa;
  const estimate = 142 * Math.min(ratio, 1) ** alpha * Math.max(ratio, 1) ** -1.2 * 0.9938 ** years * (sex === 'female' ? 1.012 : 1);
  return Object.freeze({ estimate, age: years, sex, serumCreatinineMgDl, effectiveFrom: EGFR_MAINTENANCE.effectiveFrom, checkedAt: EGFR_MAINTENANCE.checkedAt, reviewDue: EGFR_MAINTENANCE.reviewDue, sourceUrl: EGFR_MAINTENANCE.sourceUrl });
}

async function dnsLookup({ domain, recordType }) {
  const raw = String(domain ?? '').trim().replace(/\.$/u, '');
  if (!raw || raw.length > 253 || /[\s/\\:@?#]/u.test(raw)) throw new RangeError('Enter a domain or DNS name without a URL, port, or path.');
  let hostname;
  try { hostname = new URL(`http://${raw}`).hostname.toLowerCase(); } catch { throw new RangeError('Enter a valid domain or DNS name.'); }
  const labels = hostname.split('.');
  if (hostname.length > 253 || labels.length < 2 || labels.some((label) => !label || label.length > 63 || !/^[a-z0-9_](?:[a-z0-9_-]*[a-z0-9_])?$/u.test(label))) throw new RangeError('Enter a valid domain or DNS name.');
  const types = new Set(['A','AAAA','CNAME','MX','TXT','NS','CAA','SOA','SRV','DNSKEY']);
  const type = String(recordType ?? '').toUpperCase();
  if (!types.has(type)) throw new RangeError('Choose a supported DNS record type.');
  const url = new URL('https://cloudflare-dns.com/dns-query'); url.searchParams.set('name', hostname); url.searchParams.set('type', type); url.searchParams.set('do', 'true');
  const response = await fetch(url, { headers: { Accept: 'application/dns-json' }, credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new TypeError('The public DNS resolver is temporarily unavailable.');
  const payload = await response.json();
  if (!Number.isInteger(payload.Status)) throw new TypeError('The DNS resolver returned an unsupported response.');
  const answers = Array.isArray(payload.Answer) ? payload.Answer.slice(0, 100).map((entry) => Object.freeze({ name: String(entry.name ?? ''), value: String(entry.data ?? ''), ttl: Number.isFinite(entry.TTL) ? entry.TTL : null, type: entry.type })) : [];
  return Object.freeze({ name: hostname, type, status: payload.Status, dnssec: payload.AD === true, answers: Object.freeze(answers), resolver: 'Cloudflare public DNS' });
}

function pickCharadesPrompt({ prompts }) {
  const entries = String(prompts ?? '').split(/\r?\n/u).map((entry) => entry.trim()).filter(Boolean);
  if (entries.length < 2 || entries.length > 500 || entries.some((entry) => entry.length > 120 || /[\u0000-\u001f\u007f]/u.test(entry))) throw new RangeError('Enter 2 to 500 prompts, with no prompt over 120 printable characters.');
  if (!globalThis.crypto?.getRandomValues) throw new TypeError('Secure random selection is not available in this browser.');
  const limit = Math.floor(0x1_0000_0000 / entries.length) * entries.length;
  const sample = new Uint32Array(1);
  do { crypto.getRandomValues(sample); } while (sample[0] >= limit);
  return Object.freeze({ prompt: entries[sample[0] % entries.length], promptCount: entries.length });
}

export function drawTruthOrDare({ kind = 'random', ageMode = 'family', truths, dares, players = [], turn = 0, usedPromptsByKind = {}, playerLabel = 'Player' }) {
  const parse = (value, label) => {
    const entries = [...new Set((Array.isArray(value) ? value : String(value ?? '').split(/\r?\n/u)).map((entry) => String(entry).trim()).filter(Boolean))];
    if (entries.length < 2 || entries.length > 200 || entries.some((entry) => entry.length > 240 || /[\u0000-\u001f\u007f]/u.test(entry))) {
      throw new RangeError(`The ${label} prompt set must contain 2 to 200 prompts of at most 240 printable characters.`);
    }
    return entries;
  };
  if (!['truth', 'dare', 'random'].includes(kind)) throw new RangeError('Choose truth, dare, or random.');
  if (!['family', 'adult'].includes(ageMode)) throw new RangeError('Choose the family or adult prompt set.');
  const truthPrompts = parse(truths, 'truth');
  const darePrompts = parse(dares, 'dare');
  const names = (Array.isArray(players) ? players : String(players ?? '').split(/\r?\n/u)).map((name) => String(name).trim()).filter(Boolean);
  const participants = names.length ? names : [`${playerLabel} 1`, `${playerLabel} 2`];
  if (participants.length > 12 || participants.some((name) => name.length > 40 || /[\u0000-\u001f\u007f]/u.test(name))) throw new RangeError('Use up to 12 player names, each with at most 40 printable characters.');
  const playerTurn = Math.trunc(finite(turn, 'Turn number', 0, Number.MAX_SAFE_INTEGER - 1));
  if (!globalThis.crypto?.getRandomValues) throw new TypeError('Secure random selection is not available in this browser.');
  const sampleIndex = (length) => {
    const limit = Math.floor(0x1_0000_0000 / length) * length;
    const sample = new Uint32Array(1);
    do { crypto.getRandomValues(sample); } while (sample[0] >= limit);
    return sample[0] % length;
  };
  const selectedKind = kind === 'random' ? (sampleIndex(2) ? 'dare' : 'truth') : kind;
  const prompts = selectedKind === 'truth' ? truthPrompts : darePrompts;
  const used = new Set(Array.isArray(usedPromptsByKind?.[selectedKind]) ? usedPromptsByKind[selectedKind] : []);
  const unused = prompts.filter((prompt) => !used.has(prompt));
  const pool = unused.length ? unused : prompts;
  return Object.freeze({ kind: selectedKind, ageMode, prompt: pool[sampleIndex(pool.length)], truthCount: truthPrompts.length, dareCount: darePrompts.length, player: participants[playerTurn % participants.length], playerIndex: playerTurn % participants.length, turn: playerTurn + 1, players: Object.freeze(participants) });
}

export function buildStaticWebsite(input) {
  const text = (value, label, max, required = true) => {
    const result = String(value ?? '').trim();
    if ((!result && required) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(result)) throw new RangeError(`${label} is required and must use at most ${max} printable characters.`);
    return result;
  };
  const siteTitle = text(input.siteTitle, 'Site title', 80);
  const rawLanguage = text(input.siteLanguage, 'Website content language', 35);
  let siteLanguage;
  try { siteLanguage = Intl.getCanonicalLocales(rawLanguage)[0]; } catch { throw new RangeError('Enter a valid BCP 47 language tag, such as en, es, or ar.'); }
  if (!siteLanguage) throw new RangeError('Enter a valid BCP 47 language tag, such as en, es, or ar.');
  const direction = String(input.direction ?? 'auto');
  if (!['auto', 'ltr', 'rtl'].includes(direction)) throw new RangeError('Choose automatic, left-to-right, or right-to-left text direction.');
  const headline = text(input.headline, 'Headline', 160);
  const intro = text(input.intro, 'Introduction', 600);
  const ctaLabel = text(input.ctaLabel, 'Button label', 60);
  const ctaUrl = text(input.ctaUrl, 'Button URL', 2048);
  let parsedUrl;
  try { parsedUrl = new URL(ctaUrl); } catch { throw new RangeError('Enter a full HTTPS link for the button.'); }
  if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password) throw new RangeError('The button link must use HTTPS and cannot contain login credentials.');
  const accentColor = String(input.accentColor ?? '').trim();
  if (!/^#[\da-f]{6}$/iu.test(accentColor)) throw new RangeError('Choose a valid six-digit accent color.');
  const sections = [
    { title: text(input.sectionOneTitle, 'Section title', 80, false), body: text(input.sectionOneBody, 'Section text', 1200, false) },
    { title: text(input.sectionTwoTitle, 'Section title', 80, false), body: text(input.sectionTwoBody, 'Section text', 1200, false) },
  ].filter((section) => section.title || section.body);
  if (!sections.length || sections.some((section) => !section.title || !section.body)) throw new RangeError('Add a title and text to at least one section; complete or clear the other section.');
  return Object.freeze({ siteTitle, siteLanguage, direction, headline, intro, ctaLabel, ctaUrl: parsedUrl.href, accentColor: accentColor.toUpperCase(), sections: Object.freeze(sections.map(Object.freeze)) });
}

export function loveNameScore({ nameA, nameB }) {
  const normalize = (value, label) => {
    const name = String(value ?? '').normalize('NFC').trim();
    if (!name || [...name].length > 60 || /[\u0000-\u001f\u007f]/u.test(name)) throw new RangeError(`${label} must contain 1 to 60 printable characters.`);
    return name;
  };
  const first = normalize(nameA, 'First name');
  const second = normalize(nameB, 'Second name');
  const folded = `${first.toLowerCase()}${second.toLowerCase()}`;
  const codePointSum = [...folded].reduce((sum, character) => sum + character.codePointAt(0), 0);
  return Object.freeze({ nameA: first, nameB: second, score: codePointSum % 101, formulaSum: codePointSum });
}

function wordCloud({ text, stopWords = '', limit = 40, locale = 'en' }) {
  const source = String(text ?? '');
  if (!source.trim() || source.length > 100_000) throw new RangeError('Enter between 1 and 100,000 characters of text.');
  const maxTerms = Math.trunc(finite(limit, 'Maximum terms', 1, 100));
  let language = String(locale || 'en').replaceAll('_', '-');
  try { language = Intl.getCanonicalLocales(language)[0] ?? 'en'; } catch { language = 'en'; }
  const fold = (word) => { try { return word.toLocaleLowerCase(language); } catch { return word.toLowerCase(); } };
  const excluded = new Set(String(stopWords).split(/\r?\n/u).map((word) => fold(word.trim())).filter(Boolean));
  const tokens = [];
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(language, { granularity: 'word' });
    for (const segment of segmenter.segment(source)) if (segment.isWordLike) tokens.push(segment.segment);
  } else tokens.push(...(source.match(/[\p{L}\p{N}]+/gu) ?? []));
  if (!tokens.length || tokens.length > 50_000) throw new RangeError('Enter text containing 1 to 50,000 recognizable words.');
  const counts = new Map();
  for (const token of tokens) {
    const key = fold(token);
    if (!excluded.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  if (!counts.size) throw new RangeError('No words remain after applying the excluded-word list.');
  const collator = new Intl.Collator(language, { sensitivity: 'base', numeric: true });
  const entries = [...counts].sort((a, b) => b[1] - a[1] || collator.compare(a[0], b[0])).slice(0, maxTerms).map(([word, count]) => Object.freeze({ word, count }));
  return Object.freeze({ totalWords: tokens.length, uniqueTerms: entries.length, entries: Object.freeze(entries) });
}

function newHanoiGame({ disks = 4 }) {
  const count = Math.trunc(finite(disks, 'Number of disks', 3, 8));
  return Object.freeze({ diskCount: count, moves: 0, minimumMoves: 2 ** count - 1, complete: false, towers: Object.freeze([Object.freeze(Array.from({ length: count }, (_, index) => count - index)), Object.freeze([]), Object.freeze([])]) });
}

function buildRaciMatrix({ tasks, roles }) {
  const entries = (value, label, max) => {
    const rows = String(value ?? '').split(/\r?\n/u).map((entry) => entry.trim()).filter(Boolean);
    if (!rows.length || rows.length > max || rows.some((entry) => entry.length > 120 || /[\u0000-\u001f\u007f]/u.test(entry))) throw new RangeError(`Enter 1 to ${max} ${label}, with no entry over 120 printable characters.`);
    const keys = rows.map((entry) => entry.normalize('NFKC').toLocaleLowerCase());
    if (new Set(keys).size !== keys.length) throw new RangeError(`Each ${label} entry must be unique.`);
    return rows;
  };
  const taskList = entries(tasks, 'tasks', 50); const roleList = entries(roles, 'roles', 12);
  return Object.freeze({ roles: Object.freeze(roleList), rows: Object.freeze(taskList.map((task) => Object.freeze({ task, assignments: Object.freeze(Array(roleList.length).fill('')) }))) });
}

export function moveHanoiDisk(game, from, to) {
  if (!game || !Array.isArray(game.towers) || game.towers.length !== 3 || !Number.isInteger(from) || from < 0 || from > 2 || !Number.isInteger(to) || to < 0 || to > 2 || from === to) throw new RangeError('Choose two different rods.');
  if (game.complete) throw new RangeError('This puzzle is already solved. Start a new game to play again.');
  const towers = game.towers.map((tower) => [...tower]); const disk = towers[from].pop();
  if (disk === undefined) throw new RangeError('Choose a rod that has a disk on top.');
  const top = towers[to].at(-1);
  if (top !== undefined && top < disk) throw new RangeError('A larger disk cannot be placed on a smaller disk.');
  towers[to].push(disk);
  const complete = towers[2].length === game.diskCount;
  return Object.freeze({ ...game, moves: game.moves + 1, complete, towers: Object.freeze(towers.map((tower) => Object.freeze(tower))) });
}

function businessModelCanvas(input) {
  const keys = ['keyPartners','keyActivities','keyResources','valuePropositions','customerRelationships','channels','customerSegments','costStructure','revenueStreams'];
  const blocks = Object.fromEntries(keys.map((key) => {
    const value = String(input[key] ?? '').trim();
    if (value.length > 1500 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)) throw new RangeError('Each canvas block supports up to 1,500 printable characters.');
    return [key, value];
  }));
  if (!Object.values(blocks).some(Boolean)) throw new RangeError('Fill in at least one Business Model Canvas block.');
  return Object.freeze(blocks);
}


// IPIP 50-item Big-Five factor markers. Item wording is sourced from the public-domain IPIP sample questionnaire.
const BIG_FIVE_ITEMS = Object.freeze([
  [0,1],[1,-1],[2,1],[3,-1],[4,1],[0,-1],[1,1],[2,-1],[3,1],[4,-1],
  [0,1],[1,-1],[2,1],[3,-1],[4,1],[0,-1],[1,1],[2,-1],[3,1],[4,-1],
  [0,1],[1,-1],[2,1],[3,-1],[4,1],[0,-1],[1,1],[2,-1],[3,-1],[4,-1],
  [0,1],[1,-1],[2,1],[3,-1],[4,1],[0,-1],[1,1],[2,-1],[3,-1],[4,1],
  [0,1],[1,1],[2,1],[3,-1],[4,1],[0,-1],[1,1],[2,1],[3,-1],[4,1],
]);
export function scoreBigFive(responses = {}) {
  const totals = [0,0,0,0,0];
  BIG_FIVE_ITEMS.forEach(([factor, direction], index) => {
    const value = Number(responses[`q${String(index + 1).padStart(2,'0')}`]);
    if (!Number.isInteger(value) || value < 1 || value > 5) throw new RangeError('Answer all 50 statements using a value from 1 to 5.');
    totals[factor] += direction === 1 ? value : 6 - value;
  });
  return Object.freeze({
    extraversion: totals[0] / 10, extraversionTotal: totals[0],
    agreeableness: totals[1] / 10, agreeablenessTotal: totals[1],
    conscientiousness: totals[2] / 10, conscientiousnessTotal: totals[2],
    emotionalStability: totals[3] / 10, emotionalStabilityTotal: totals[3],
    intellectImagination: totals[4] / 10, intellectImaginationTotal: totals[4],
  });
}

export const INDIA_GRATUITY_MAINTENANCE = Object.freeze({
  effectiveFrom: '2025-11-21',
  checkedAt: '2026-10-19',
  reviewDue: '2026-11-19',
  sources: Object.freeze([
    'https://www.labour.gov.in/static/uploads/2026/03/a4ccf4c6d97c4f1f36a6d83f8c64213d.pdf',
    'https://labour.gov.in/sites/default/files/184299.pdf',
  ]),
});

export function calculateIndiaGratuity({ monthlyWages, years, extraMonths = 0, employmentType = 'regular', reason = 'resignation', asOf = new Date().toISOString().slice(0, 10) } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(String(asOf)) || new Date(`${asOf}T00:00:00.000Z`).toISOString().slice(0, 10) !== asOf) throw new RangeError('Choose a valid as-of date.');
  if (asOf < INDIA_GRATUITY_MAINTENANCE.effectiveFrom) {
    const error = new RangeError('These gratuity rules are not effective for the selected date.');
    error.code = 'rules-not-effective';
    throw error;
  }
  if (asOf > INDIA_GRATUITY_MAINTENANCE.reviewDue) {
    const error = new RangeError('The gratuity rules need a fresh official-source review.');
    error.code = 'rules-expired';
    throw error;
  }
  const wages = finite(monthlyWages, 'Monthly statutory wages', 0.01, 1_000_000_000);
  const serviceYears = finite(years, 'Completed service years', 0, 100);
  const months = finite(extraMonths, 'Additional service months', 0, 11);
  if (!Number.isInteger(serviceYears) || !Number.isInteger(months)) throw new RangeError('Enter whole years and months.');
  if (!['regular','fixed-term'].includes(employmentType)) throw new RangeError('Choose a supported employment type.');
  if (!['resignation','retirement','death','disablement'].includes(reason)) throw new RangeError('Choose a supported reason for leaving.');
  const completedYears = serviceYears + (months > 6 ? 1 : 0);
  const minimumYears = employmentType === 'fixed-term' ? 1 : 5;
  const minimumWaived = reason === 'death' || reason === 'disablement';
  const eligible = minimumWaived ? completedYears >= 0 : employmentType === 'fixed-term' ? serviceYears >= minimumYears : completedYears >= minimumYears;
  const uncapped = eligible ? Math.round(wages * 15 / 26 * completedYears * 100) / 100 : 0;
  const statutoryCap = 2_000_000;
  return Object.freeze({ eligible, completedYears, uncappedAmount: uncapped, statutoryCap, estimate: Math.min(uncapped, statutoryCap), capApplied: uncapped > statutoryCap, monthlyWages: wages });
}

export function calculateIndiaEpf({ eligibleWage, employeeRate = 12, employerRate = 12, epsWageCap = 15000, epsRate = 8.33 } = {}) {
  const wage = finite(eligibleWage, 'Eligible monthly wage', 0, 100_000_000);
  const eeRate = finite(employeeRate, 'Employee rate', 0, 100);
  const erRate = finite(employerRate, 'Employer rate', 0, 100);
  const pensionCap = finite(epsWageCap, 'EPS pension wage base', 0, 100_000_000);
  const pensionRate = finite(epsRate, 'EPS rate', 0, 100);
  const employeeContribution = Math.round(wage * eeRate) / 100;
  const employerContribution = Math.round(wage * erRate) / 100;
  const epsContribution = Math.min(employerContribution, Math.round(Math.min(wage, pensionCap) * pensionRate) / 100);
  const employerEpfContribution = Math.max(0, Math.round((employerContribution - epsContribution) * 100) / 100);
  return Object.freeze({ eligibleWage: wage, employeeRate: eeRate, employerRate: erRate, epsWageCap: pensionCap, epsRate: pensionRate, employeeContribution, employerContribution, epsContribution, employerEpfContribution, combinedMonthlyContribution: Math.round((employeeContribution + employerContribution) * 100) / 100 });
}

export function summarizeSleepiness(input = {}) {
  const answers = Array.from({ length: 6 }, (_, index) => finite(input[`situation${index + 1}`], `Situation ${index + 1} rating`, 0, 3));
  if (answers.some((value) => !Number.isInteger(value))) throw new RangeError('Choose a whole-number response for every situation.');
  const total = answers.reduce((sum, value) => sum + value, 0);
  return Object.freeze({ answers: Object.freeze(answers), total, average: total / answers.length, highestItem: answers.indexOf(Math.max(...answers)) + 1, highFrequencyCount: answers.filter((value) => value >= 2).length });
}

export function calculateFuturesPosition({ direction = 'long', contracts, multiplier, entryPrice, stopPrice, targetPrice, fees = 0 } = {}) {
  if (!['long','short'].includes(direction)) throw new RangeError('Choose long or short.');
  const count = finite(contracts, 'Contract count', 1, 1_000_000);
  const size = finite(multiplier, 'Contract multiplier', 0.000001, 100_000_000);
  const entry = finite(entryPrice, 'Entry price', 0.000001, 1_000_000_000);
  const stop = finite(stopPrice, 'Stop price', 0.000001, 1_000_000_000);
  const target = finite(targetPrice, 'Target price', 0.000001, 1_000_000_000);
  const costs = finite(fees, 'Fees', 0, 1_000_000_000);
  if (!Number.isInteger(count)) throw new RangeError('Enter a whole number of contracts.');
  if (direction === 'long' ? (stop >= entry || target <= entry) : (stop <= entry || target >= entry)) throw new RangeError('For a long position, stop must be below entry and target above; reverse this for short.');
  const exposure = entry * count * size;
  const risk = Math.max(0, Math.abs(entry - stop) * count * size - costs);
  const reward = Math.max(0, Math.abs(target - entry) * count * size - costs);
  return Object.freeze({ direction, contracts: count, multiplier: size, entryPrice: entry, notionalExposure: exposure, estimatedRisk: risk, estimatedReward: reward, rewardRiskRatio: risk ? reward / risk : null, fees: costs });
}

export function calculatePetFoodPortion({ dailyKcal, foodKcalPer100g, treatKcal = 0, mealsPerDay = 2 } = {}) {
  const daily = finite(dailyKcal, 'Daily calorie target', 1, 100_000);
  const density = finite(foodKcalPer100g, 'Food calories per 100 g', 1, 100_000);
  const treats = finite(treatKcal, 'Treat calories', 0, 100_000);
  const meals = finite(mealsPerDay, 'Meals per day', 1, 24);
  if (!Number.isInteger(meals)) throw new RangeError('Enter a whole number of meals.');
  if (treats >= daily) throw new RangeError('Treat calories must be less than the daily target.');
  const foodKcal = daily - treats;
  const grams = foodKcal / density * 100;
  return Object.freeze({ dailyKcal: daily, foodKcalPer100g: density, treatKcal: treats, mealsPerDay: meals, foodKcal, gramsPerDay: grams, gramsPerMeal: grams / meals, treatSharePercent: treats / daily * 100 });
}

export function createFontStyle({ text = '', fontFamily = 'system-ui', fontSize = 24, fontWeight = 400, lineHeight = 1.5, letterSpacing = 0, textColor = '#20243A', backgroundColor = '#FFFFFF' } = {}) {
  const families = new Map([['system-ui','system-ui'],['Arial, sans-serif','Arial, sans-serif'],['Georgia, serif','Georgia, serif'],['ui-monospace, monospace','ui-monospace, monospace']]);
  if (!families.has(fontFamily)) throw new RangeError('Choose a listed system font.');
  const size = finite(fontSize,'Font size',8,96); const weight = finite(fontWeight,'Font weight',400,700); const leading = finite(lineHeight,'Line height',1,2.5); const spacing = finite(letterSpacing,'Letter spacing',-2,10);
  if (![400,600,700].includes(weight)) throw new RangeError('Choose a listed font weight.');
  const color = (value,label) => { const result=String(value??'');if(!/^#[0-9a-f]{6}$/iu.test(result))throw new RangeError(`${label} must be a six-digit hex color.`);return result.toUpperCase(); };
  return Object.freeze({text:String(text).slice(0,3000),fontFamily:families.get(fontFamily),fontSize:size,fontWeight:weight,lineHeight:leading,letterSpacing:spacing,textColor:color(textColor,'Text color'),backgroundColor:color(backgroundColor,'Background color')});
}

export async function checkPwnedPassword({ password, sharePrefix = false, cryptoImpl = globalThis.crypto } = {}) {
  const secret=String(password??'');if(!secret||secret.length>1024)throw new RangeError('Enter a password from 1 to 1,024 characters.');
  if(sharePrefix!==true)throw new RangeError('Confirm the privacy notice before checking.');
  if(typeof fetch!=='function'||!cryptoImpl?.subtle)throw new Error('Secure password checking is unavailable in this browser.');
  const digest=await cryptoImpl.subtle.digest('SHA-1',new TextEncoder().encode(secret));
  const hash=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('').toUpperCase();
  const prefix=hash.slice(0,5);const suffix=hash.slice(5);
  const response=await fetch(`https://api.pwnedpasswords.com/range/${prefix}`,{method:'GET',mode:'cors',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Add-Padding':'true'},signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw new Error('The password database is temporarily unavailable.');
  const body=await response.text();if(body.length>300_000)throw new Error('The password database response exceeded the safe size limit.');
  let count=0;for(const line of body.split(/\r?\n/u)){const match=/^([A-F0-9]{35}):([0-9]+)$/u.exec(line.trim());if(match&&match[1]===suffix){count=Number(match[2]);break;}}
  return Object.freeze({found:count>0,count,checkedAt:new Date().toISOString()});
}

export function kaplanMeier({ observations, timeUnit = 'time units' } = {}) {
  const rows=lines(observations).map((parts,index)=>{
    if(parts.length!==3)throw new RangeError(`Row ${index+1} needs: label | time | event (1 or 0).`);
    const [label,timeText,eventText]=parts;const time=finite(timeText,`Row ${index+1} time`,0,1e12);
    if(!label||label.length>100||/[\u0000-\u001f\u007f]/u.test(label))throw new RangeError(`Row ${index+1} needs a short printable label.`);
    if(!['0','1'].includes(eventText))throw new RangeError(`Row ${index+1} event must be 1 or 0.`);
    return {label,time,event:Number(eventText)};
  });
  if(!rows.length||rows.length>5000)throw new RangeError('Enter between 1 and 5,000 observations.');
  rows.sort((a,b)=>a.time-b.time);
  let atRisk=rows.length,survival=1,median=null;const grouped=[];
  for(let index=0;index<rows.length;){const time=rows[index].time;let events=0,censored=0;while(index<rows.length&&rows[index].time===time){if(rows[index].event)events++;else censored++;index++;}
    if(events){survival*=1-events/atRisk;if(median===null&&survival<=0.5)median=time;}
    grouped.push(Object.freeze({time,atRisk,events,censored,survival:Math.max(0,survival)}));atRisk-=events+censored;
  }
  return Object.freeze({count:rows.length,eventCount:rows.filter(row=>row.event).length,censoredCount:rows.filter(row=>!row.event).length,median,timeUnit:String(timeUnit||'time units').slice(0,30),table:Object.freeze(grouped)});
}

export function generateLithophane({ pixels, widthMm = 100, baseMm = 1.2, reliefMinMm = 0.8, reliefMaxMm = 3.2 } = {}) {
  if(!pixels||!(pixels.data instanceof Uint8ClampedArray)||!Number.isInteger(pixels.width)||!Number.isInteger(pixels.height)||pixels.width<2||pixels.height<2||pixels.width>128||pixels.height>128||pixels.data.length!==pixels.width*pixels.height*4)throw new RangeError('Choose a valid image preview no larger than 128 × 128 samples.');
  const width=finite(widthMm,'Model width',30,200),base=finite(baseMm,'Base thickness',0.8,3),minRelief=finite(reliefMinMm,'Minimum relief',0.4,2),maxRelief=finite(reliefMaxMm,'Maximum relief',1,5);
  if(maxRelief<=minRelief)throw new RangeError('Maximum relief must exceed minimum relief.');
  const w=pixels.width,h=pixels.height,depth=width*h/w,vertices=new Float32Array(w*h*3),sample=(x,y)=>{const index=(y*w+x)*4;const alpha=pixels.data[index+3]/255;return (0.2126*pixels.data[index]+0.7152*pixels.data[index+1]+0.0722*pixels.data[index+2])*alpha+255*(1-alpha);};
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const light=sample(x,y)/255;const z=base+minRelief+(1-light)*(maxRelief-minRelief);const i=(y*w+x)*3;vertices[i]=width*x/(w-1);vertices[i+1]=depth*(h-1-y)/(h-1);vertices[i+2]=z;}
  const triangles=[];const push=(a,b,c)=>triangles.push([a,b,c]);const point=(x,y,z=0)=>[width*x/(w-1),depth*(h-1-y)/(h-1),z];
  const top=(x,y)=>{const i=(y*w+x)*3;return [vertices[i],vertices[i+1],vertices[i+2]];};
  for(let y=0;y<h-1;y++)for(let x=0;x<w-1;x++){const a=top(x,y),b=top(x+1,y),c=top(x,y+1),d=top(x+1,y+1);push(a,c,b);push(b,c,d);push(point(x,y),point(x+1,y),point(x,y+1));push(point(x+1,y),point(x+1,y+1),point(x,y+1));}
  for(let x=0;x<w-1;x++){const topA=top(x,0),topB=top(x+1,0),botA=point(x,0),botB=point(x+1,0);push(botA,topA,botB);push(botB,topA,topB);const y=h-1;const ta=top(x,y),tb=top(x+1,y),ba=point(x,y),bb=point(x+1,y);push(ba,bb,ta);push(bb,tb,ta);}
  for(let y=0;y<h-1;y++){const ta=top(0,y),tb=top(0,y+1),ba=point(0,y),bb=point(0,y+1);push(ba,ta,bb);push(bb,ta,tb);const x=w-1;const tc=top(x,y),td=top(x,y+1),bc=point(x,y),bd=point(x,y+1);push(bc,bd,tc);push(bd,td,tc);}
  if(triangles.length>100000)throw new RangeError('The generated mesh exceeds the 100,000-triangle safety limit.');
  const buffer=new ArrayBuffer(84+triangles.length*50),view=new DataView(buffer);new TextEncoder().encodeInto('UsefulVerse local grayscale lithophane; inspect and test print before use.',new Uint8Array(buffer,0,80));view.setUint32(80,triangles.length,true);
  let offset=84;for(const [a,b,c] of triangles){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],length=Math.hypot(...n)||1;for(const value of n)view.setFloat32(offset,value/length,true),offset+=4;for(const point3 of [a,b,c])for(const value of point3)view.setFloat32(offset,value,true),offset+=4;view.setUint16(offset,0,true);offset+=2;}
  return Object.freeze({stl:new Uint8Array(buffer),triangleCount:triangles.length,widthMm:width,heightMm:depth,sampleWidth:w,sampleHeight:h,minThicknessMm:base+minRelief,maxThicknessMm:base+maxRelief});
}

export function editLrc({ lrcText, offsetSeconds = 0 } = {}) {
  const source=String(lrcText??'');if(!source.trim()||source.length>50000)throw new RangeError('Enter an LRC file from 1 to 50,000 characters.');
  const offset=finite(offsetSeconds,'Timestamp offset',-600,600);const entries=[];const metadata=[];const timestamp=/\[(\d{1,4}):([0-5]\d)(?:[.:](\d{1,3}))?\]/gu;let validCount=0;
  for(const [index,line] of source.replace(/\r/g,'').split('\n').entries()){
    if(!line.trim())continue;const meta=/^\[(ti|ar|al|by|re|ve|length):([^\]]*)\]$/iu.exec(line.trim());if(meta){metadata.push(meta[0]);continue;}
    const tags=[...line.matchAll(timestamp)];if(!tags.length)throw new RangeError(`Line ${index+1} needs a timestamp such as [00:12.34], or a supported metadata tag.`);
    const lyric=line.slice(tags.at(-1).index+tags.at(-1)[0].length);if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(lyric))throw new RangeError(`Line ${index+1} contains unsupported control characters.`);
    for(const tag of tags){const fraction=tag[3]??'0';const centiseconds=Math.round(Number(`0.${fraction}`)*100);let ms=(Number(tag[1])*60+Number(tag[2]))*1000+centiseconds*10+offset*1000;ms=Math.max(0,Math.round(ms/10)*10);entries.push({ms,lyric});validCount++;}
  }
  if(!validCount)throw new RangeError('Add at least one timestamped lyric line.');entries.sort((a,b)=>a.ms-b.ms);
  const format=(ms)=>{const centis=Math.floor(ms/10);return `[${String(Math.floor(centis/6000)).padStart(2,'0')}:${String(Math.floor(centis/100)%60).padStart(2,'0')}.${String(centis%100).padStart(2,'0')}]`;};
  const output=[...metadata,...entries.map(({ms,lyric})=>`${format(ms)}${lyric}`)].join('\n');
  return Object.freeze({lrc:output,lineCount:entries.length,metadataCount:metadata.length,offsetSeconds:offset,durationMs:entries.at(-1).ms});
}

export function calculateCreatinineClearance({ ageYears, weightKg, serumCreatinine, coefficient = 1 } = {}) {
  const age=finite(ageYears,'Age',18,120),weight=finite(weightKg,'Weight',20,400),creatinine=finite(serumCreatinine,'Serum creatinine',0.1,30),factor=finite(coefficient,'Equation coefficient',0.85,1);
  if(!Number.isInteger(age)||![0.85,1].includes(factor))throw new RangeError('Enter a whole adult age and select one listed equation coefficient.');
  const estimate=((140-age)*weight)/(72*creatinine)*factor;
  return Object.freeze({ageYears:age,weightKg:weight,serumCreatinine:creatinine,coefficient:factor,clearanceMlMin:Math.round(estimate*10)/10,equation:'(140 − age) × weight ÷ (72 × serum creatinine) × selected coefficient'});
}

export function buildMedicationSchedule({ schedule } = {}) {
  const rows=lines(schedule).map((parts,index)=>{
    if(parts.length!==4)throw new RangeError(`Line ${index+1} needs: name | prescribed instructions | time (HH:MM) | days.`);
    const [name,instructions,time,daysText]=parts;
    if(!name||name.length>100||!instructions||instructions.length>120||/[\u0000-\u001f\u007f]/u.test(name+instructions))throw new RangeError(`Line ${index+1} needs a short name and instruction.`);
    if(!/^([01]\d|2[0-3]):[0-5]\d$/u.test(time))throw new RangeError(`Line ${index+1} needs a 24-hour time such as 08:30.`);
    const days=daysText.split(',').map((day)=>day.trim().toLowerCase());if(!days.length||days.some((day)=>!['daily','mon','tue','wed','thu','fri','sat','sun'].includes(day)))throw new RangeError(`Line ${index+1} days must be daily or comma-separated weekday abbreviations.`);
    return Object.freeze({name,instructions,time,days:Object.freeze(days)});
  });
  if(!rows.length||rows.length>100)throw new RangeError('Enter between 1 and 100 schedule entries.');
  rows.sort((a,b)=>a.time.localeCompare(b.time));
  const csvCell=(value)=>`"${String(value).replaceAll('"','""')}"`;
  const csv=[['Name','Prescribed instructions','Time','Days'],...rows.map(row=>[row.name,row.instructions,row.time,row.days.join(', ')])].map(row=>row.map(csvCell).join(',')).join('\r\n');
  return Object.freeze({entries:Object.freeze(rows),count:rows.length,csv});
}

export function convertCreateTable({ sourceDialect, targetDialect, ddl } = {}) {
  const sources=['mysql','postgresql','sqlite'];if(!sources.includes(sourceDialect)||!sources.includes(targetDialect))throw new RangeError('Choose a listed SQL dialect.');
  const sql=String(ddl??'').trim();if(!sql||sql.length>50000)throw new RangeError('Enter one CREATE TABLE statement up to 50,000 characters.');
  if(/--|\/\*|\*\//u.test(sql))throw new RangeError('SQL comments are outside the supported conversion subset.');
  const match=/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(`[^`]+`|"[^"]+"|\[[^\]]+\]|[A-Za-z_][A-Za-z0-9_]*)\s*\(([\s\S]*)\)\s*;?$/iu.exec(sql);
  if(!match)throw new RangeError('Enter exactly one simple CREATE TABLE statement with balanced parentheses.');
  const unquote=(identifier)=>identifier.replace(/^`|`$|^"|"$|^\[|\]$/gu,'');
  const split=(text)=>{const out=[];let start=0,depth=0,quote='';for(let i=0;i<text.length;i++){const ch=text[i];if(quote){if(ch===quote){if(text[i+1]===quote)i++;else quote='';}continue;}if(ch==='"'||ch==='`'||ch==="'"){quote=ch;continue;}if(ch==='(')depth++;else if(ch===')'){depth--;if(depth<0)throw new RangeError('Unbalanced SQL parentheses.');}else if(ch===','&&depth===0){out.push(text.slice(start,i).trim());start=i+1;}}if(depth!==0||quote)throw new RangeError('Unbalanced SQL parentheses or quotes.');out.push(text.slice(start).trim());return out;};
  const quoteId=(name)=>targetDialect==='mysql'?`\`${name.replaceAll('`','``')}\``:`"${name.replaceAll('"','""')}"`;
  const typeMap=(raw)=>{const type=raw.trim().replace(/\s+/gu,' ').toUpperCase();const maps={mysql:{'INTEGER':'INT','INT4':'INT','INT8':'BIGINT','BOOL':'TINYINT(1)','BOOLEAN':'TINYINT(1)','DATETIME':'DATETIME','SERIAL':'BIGINT'},postgresql:{'INT':'INTEGER','INT4':'INTEGER','INT8':'BIGINT','BOOL':'BOOLEAN','DATETIME':'TIMESTAMP','TINYINT(1)':'BOOLEAN'},sqlite:{'INT':'INTEGER','INT4':'INTEGER','INT8':'INTEGER','BOOL':'INTEGER','BOOLEAN':'INTEGER','DATETIME':'TEXT','TIMESTAMP':'TEXT','SERIAL':'INTEGER','VARCHAR':'TEXT','CHAR':'TEXT'}};const base=type.replace(/\([^)]*\)$/u,'').trim();const mapped=maps[targetDialect]?.[type]??maps[targetDialect]?.[base]??type;if(!/^(?:TINYINT\(1\)|(?:VAR)?CHAR\(\d+\)|(?:DECIMAL|NUMERIC)\(\d+(?:,\d+)?\)|INTEGER|INT|BIGINT|SMALLINT|REAL|FLOAT|DOUBLE(?: PRECISION)?|BOOLEAN|TEXT|DATE|TIME|TIMESTAMP|DATETIME|BLOB|BYTEA|SERIAL|BIGSERIAL)$/u.test(mapped))throw new RangeError(`Unsupported or unsafe column type: ${raw}.`);return mapped;};
  const definitions=split(match[2]);if(!definitions.length||definitions.some((part)=>!part))throw new RangeError('The table needs non-empty column definitions.');const warnings=[];const columns=[];
  for(const definition of definitions){if(/^(?:PRIMARY\s+KEY|UNIQUE)\b/iu.test(definition)){const constraint=/^(PRIMARY\s+KEY|UNIQUE)\s*\(([^)]+)\)$/iu.exec(definition);if(!constraint)throw new RangeError('Only simple PRIMARY KEY and UNIQUE table constraints are supported.');const names=constraint[2].split(',').map((part)=>{const ident=/^\s*(`[^`]+`|"[^"]+"|\[[^\]]+\]|[A-Za-z_][A-Za-z0-9_]*)\s*$/u.exec(part);if(!ident)throw new RangeError('Complex expressions in table constraints are not converted.');return quoteId(unquote(ident[1]));});columns.push(`${constraint[1].toUpperCase()} (${names.join(', ')})`);continue;}
    if(/^(?:FOREIGN\s+KEY|CHECK|CONSTRAINT|INDEX|KEY)\b/iu.test(definition))throw new RangeError('Foreign keys, CHECK constraints, named constraints and indexes are not converted yet; stopping to avoid losing rules.');
    const column=/^(`[^`]+`|"[^"]+"|\[[^\]]+\]|[A-Za-z_][A-Za-z0-9_]*)\s+((?:DOUBLE\s+PRECISION|[A-Za-z][A-Za-z0-9_]*)(?:\(\s*\d+(?:\s*,\s*\d+)?\s*\))?)([\s\S]*)$/u.exec(definition);if(!column)throw new RangeError(`Could not parse column definition: ${definition.slice(0,80)}.`);
    const name=unquote(column[1]);let type=typeMap(column[2]);let rest=column[3].trim();const auto=sourceDialect==='mysql'?/\bAUTO_INCREMENT\b/iu.test(rest):sourceDialect==='sqlite'?/\bAUTOINCREMENT\b/iu.test(rest):/^SERIAL$|^BIGSERIAL$/iu.test(column[2].trim());
    if(/\bUNSIGNED\b/iu.test(rest))throw new RangeError('UNSIGNED numeric types need an explicit target policy and are not converted.');rest=rest.replace(/\bAUTO_INCREMENT\b|\bAUTOINCREMENT\b/giu,'').trim();
    if(auto){if(targetDialect==='postgresql'){if(!/\bPRIMARY\s+KEY\b/iu.test(rest))throw new RangeError('Identity conversion is supported only for an inline primary key.');type=type==='BIGINT'?'BIGINT':'INTEGER';rest=rest.replace(/\bPRIMARY\s+KEY\b/iu,'').trim();rest=`GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY ${rest}`.trim();}else if(targetDialect==='mysql'){type=type==='BIGINT'?'BIGINT':'INT';rest=`${rest} AUTO_INCREMENT`.trim();}else{if(!/\bPRIMARY\s+KEY\b/iu.test(rest))throw new RangeError('SQLite AUTOINCREMENT requires an inline primary key.');type='INTEGER';rest=rest.replace(/\bPRIMARY\s+KEY\b/iu,'').replace(/\bAUTOINCREMENT\b/iu,'').trim();rest=`PRIMARY KEY AUTOINCREMENT ${rest}`.trim();}warnings.push(`${name}: auto-increment syntax was mapped; verify target engine behavior.`);}
    if(sourceDialect!==targetDialect&&/\bDEFAULT\s+(?:CURRENT_TIMESTAMP|CURRENT_DATE|CURRENT_TIME)\b/iu.test(rest))warnings.push(`${name}: verify default-expression support in the target engine.`);
    columns.push(`${quoteId(name)} ${type}${rest?` ${rest}`:''}`);
  }
  const table=quoteId(unquote(match[1]));const converted=`CREATE TABLE ${table} (\n  ${columns.join(',\n  ')}\n);`;return Object.freeze({sql:converted,sourceDialect,targetDialect,columnCount:columns.length,warnings:Object.freeze([...new Set(warnings)])});
}

export function createColorDifferenceRound({ difficulty='clear', random=Math.random } = {}) {
  if(!['clear','subtle'].includes(difficulty))throw new RangeError('Choose a listed exercise difficulty.');
  if(typeof random!=='function')throw new RangeError('A random-number function is required.');
  const nextRandom=()=>{const value=random();if(!Number.isFinite(value)||value<0||value>=1)throw new RangeError('Random values must be in the range from zero up to, but not including, one.');return value;};
  const hue=nextRandom()*360,saturation=64,lightness=52,delta=difficulty==='clear'?24:12;
  const toHex=(h)=>{const c=(1-Math.abs(2*lightness/100-1))*saturation/100,x=c*(1-Math.abs((h/60)%2-1)),m=lightness/100-c/2;const [r,g,b]=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return `#${[r,g,b].map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('').toUpperCase()}`;};
  const offsets=[0,delta,-delta,delta*2];for(let i=offsets.length-1;i>0;i--){const j=Math.floor(nextRandom()*(i+1));[offsets[i],offsets[j]]=[offsets[j],offsets[i]];}
  const answerIndex=offsets.indexOf(0);return Object.freeze({target:toHex(hue),options:Object.freeze(offsets.map((offset)=>toHex((hue+offset+360)%360))),answerIndex,difficulty});
}

export function gateAudioNoise({ channels, sampleRate, thresholdDb=-40, reductionDb=24, attackMs=10, releaseMs=120 } = {}) {
  if(!Array.isArray(channels)||channels.length<1||channels.length>2||!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>48000)throw new RangeError('Use mono or stereo audio sampled at 8–48 kHz.');
  const frameCount=channels[0]?.length;if(!Number.isInteger(frameCount)||frameCount<1||frameCount>sampleRate*60||channels.some((channel)=>!(channel instanceof Float32Array)||channel.length!==frameCount))throw new RangeError('Audio must be up to 60 seconds with matching mono or stereo channels.');
  const threshold=finite(thresholdDb,'Noise threshold',-80,-10),reduction=finite(reductionDb,'Noise reduction',0,60),attack=finite(attackMs,'Attack',1,100),release=finite(releaseMs,'Release',10,500);
  const block=Math.max(1,Math.floor(sampleRate*0.01)),thresholdAmplitude=10**(threshold/20),floorGain=10**(-reduction/20),attackCoefficient=Math.exp(-(block/sampleRate)/(attack/1000)),releaseCoefficient=Math.exp(-(block/sampleRate)/(release/1000));
  const output=channels.map((channel)=>new Float32Array(channel));let gain=1;
  for(let start=0;start<frameCount;start+=block){const end=Math.min(frameCount,start+block);let sum=0;for(const channel of channels)for(let i=start;i<end;i++)sum+=channel[i]*channel[i];const rms=Math.sqrt(sum/((end-start)*channels.length));const target=rms<thresholdAmplitude?floorGain:1;const coefficient=target>gain?attackCoefficient:releaseCoefficient;gain=target+(gain-target)*coefficient;for(const channel of output)for(let i=start;i<end;i++)channel[i]=Math.max(-1,Math.min(1,channel[i]*gain));}
  const dataBytes=frameCount*channels.length*2,buffer=new ArrayBuffer(44+dataBytes),view=new DataView(buffer);const write=(offset,text)=>{for(let i=0;i<text.length;i++)view.setUint8(offset+i,text.charCodeAt(i));};write(0,'RIFF');view.setUint32(4,36+dataBytes,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels.length,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*channels.length*2,true);view.setUint16(32,channels.length*2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,dataBytes,true);let offset=44;for(let i=0;i<frameCount;i++)for(const channel of output){const sample=channel[i];view.setInt16(offset,sample<0?sample*32768:sample*32767,true);offset+=2;}
  return Object.freeze({wav:new Uint8Array(buffer),sampleRate,channels:channels.length,durationSeconds:frameCount/sampleRate,thresholdDb:threshold,reductionDb:reduction,attackMs:attack,releaseMs:release,format:'PCM 16-bit WAV'});
}

export const BRAZIL_TERMINATION_MAINTENANCE = Object.freeze({
  effectiveFrom: '2017-11-11',
  checkedAt: '2026-10-19',
  reviewDue: '2026-11-19',
  sources: Object.freeze([
    'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12506.htm',
    'https://planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm',
    'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/perguntas-frequentes',
  ]),
});

export function estimateBrazilTermination({ monthlySalary, workedDays, serviceYears, terminationType, thirteenthMonths, vacationMonths, fgtsBase, asOf = new Date().toISOString().slice(0, 10) } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(String(asOf)) || new Date(`${asOf}T00:00:00.000Z`).toISOString().slice(0, 10) !== asOf) throw new RangeError('Choose a valid as-of date.');
  if (asOf < BRAZIL_TERMINATION_MAINTENANCE.effectiveFrom) {
    const error = new RangeError('These termination rules are not effective for the selected date.');
    error.code = 'rules-not-effective';
    throw error;
  }
  if (asOf > BRAZIL_TERMINATION_MAINTENANCE.reviewDue) {
    const error = new RangeError('The Brazilian termination rules need a fresh official-source review.');
    error.code = 'rules-expired';
    throw error;
  }
  const salary=finite(monthlySalary,'Monthly salary',0,100_000_000);
  const days=finite(workedDays,'Worked days in final month',0,30);
  const years=finite(serviceYears,'Completed service years',0,60);
  const thirteenth=finite(thirteenthMonths,'Eligible 13th-salary months',0,12);
  const vacation=finite(vacationMonths,'Eligible proportional-vacation months',0,12);
  const base=finite(fgtsBase,'FGTS termination base',0,1_000_000_000);
  if(!Number.isInteger(days)||!Number.isInteger(years)||!Number.isInteger(thirteenth)||!Number.isInteger(vacation)) throw new RangeError('Days, completed years and eligible months must be whole numbers.');
  if(!['employer-no-cause','mutual-agreement','resignation','just-cause'].includes(terminationType)) throw new RangeError('Choose a listed termination type.');
  const employerInitiated=terminationType==='employer-no-cause'||terminationType==='mutual-agreement';
  const noticeDays=employerInitiated?Math.min(90,30+Math.max(0,years-1)*3):0;
  const noticeShare=terminationType==='employer-no-cause'?1:terminationType==='mutual-agreement'?0.5:0;
  const fgtsRate=terminationType==='employer-no-cause'?0.4:terminationType==='mutual-agreement'?0.2:0;
  const round=value=>Math.round((value+Number.EPSILON)*100)/100;
  const salaryBalance=round(salary*days/30);
  const thirteenthSalary=round(salary*thirteenth/12);
  const proportionalVacation=round(salary*vacation/12*4/3);
  const noticePay=round(salary*noticeDays/30*noticeShare);
  const fgtsPenalty=round(base*fgtsRate);
  const cashBeforeDeductions=round(salaryBalance+thirteenthSalary+proportionalVacation+noticePay);
  return Object.freeze({terminationType,noticeDays,noticeShare,fgtsRate,salaryBalance,thirteenthSalary,proportionalVacation,noticePay,fgtsPenalty,cashBeforeDeductions,totalIncludingFgtsPenalty:round(cashBeforeDeductions+fgtsPenalty)});
}

// Annualized estimate for an employee using statutory public insurance, based
// on Germany's published 2026 tariff and contribution ceilings. It is not the
// official wage-tax withholding procedure and deliberately excludes surcharge.
export function estimateGermanyNetSalary({ grossMonthly, healthAdditionalRate = 2.9, hasChildren = false, childrenUnder25 = 0, age = 35, state = 'other', churchTaxRate = 0 } = {}) {
  const gross = finite(grossMonthly, 'Monthly gross salary', 0.01, 10_000_000);
  const additional = finite(healthAdditionalRate, 'Health insurer additional rate', 0, 10);
  const children = finite(childrenUnder25, 'Children under 25', 0, 5);
  const years = finite(age, 'Age', 16, 100);
  const churchRate = finite(churchTaxRate, 'Church tax rate', 0, 9);
  if (![children, years].every(Number.isInteger) || ![0, 8, 9].includes(churchRate) || !['other', 'saxony'].includes(state)) {
    throw new RangeError('Choose valid age, child count, federal state and church-tax rate.');
  }
  const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
  const annualGross = gross * 12;
  const pension = Math.min(annualGross, 101_400) * 0.093;
  const unemployment = Math.min(annualGross, 101_400) * 0.013;
  const health = Math.min(annualGross, 69_750) * (0.073 + additional / 200);
  const careBase = state === 'saxony' ? 0.023 : 0.018;
  const childDiscount = Math.min(4, Math.max(0, children - 1)) * 0.0025;
  const childlessSurcharge = !(Boolean(hasChildren) || children > 0) && years >= 23 ? 0.006 : 0;
  const careRate = Math.max(0, careBase - childDiscount + childlessSurcharge);
  const care = Math.min(annualGross, 69_750) * careRate;
  const taxableIncome = Math.max(0, Math.floor(annualGross - pension - unemployment - health - care - 1_230));
  let incomeTax;
  if (taxableIncome <= 12_348) incomeTax = 0;
  else if (taxableIncome <= 17_799) { const y = (taxableIncome - 12_348) / 10_000; incomeTax = (914.51 * y + 1_400) * y; }
  else if (taxableIncome <= 69_878) { const z = (taxableIncome - 17_799) / 10_000; incomeTax = (173.10 * z + 2_397) * z + 1_034.87; }
  else if (taxableIncome <= 277_825) incomeTax = 0.42 * taxableIncome - 11_135.63;
  else incomeTax = 0.45 * taxableIncome - 19_470.38;
  incomeTax = Math.max(0, round(incomeTax));
  const churchTax = round(incomeTax * churchRate / 100);
  const monthly = (amount) => round(amount / 12);
  const monthlyGross = round(gross);
  const monthlyPension = monthly(pension); const monthlyUnemployment = monthly(unemployment);
  const monthlyHealth = monthly(health); const monthlyCare = monthly(care);
  const monthlyIncomeTax = monthly(incomeTax); const monthlyChurchTax = monthly(churchTax);
  const estimatedMonthlyNet = round(monthlyGross - monthlyPension - monthlyUnemployment - monthlyHealth - monthlyCare - monthlyIncomeTax - monthlyChurchTax);
  return Object.freeze({
    year: 2026, grossMonthly: monthlyGross, taxableIncomeAnnual: taxableIncome,
    pensionMonthly: monthlyPension, unemploymentMonthly: monthlyUnemployment,
    healthMonthly: monthlyHealth, careMonthly: monthlyCare,
    incomeTaxMonthly: monthlyIncomeTax, churchTaxMonthly: monthlyChurchTax,
    estimatedMonthlyNet, estimatedAnnualNet: round(estimatedMonthlyNet * 12),
    healthAdditionalRate: additional, careRate: round(careRate * 100),
  });
}

export function projectIndiaPpf({ annualDeposit, annualRate, years = 15 } = {}) {
  const deposit=finite(annualDeposit,'Annual deposit',0,1_000_000_000);
  const rate=finite(annualRate,'Annual interest rate',0,100);
  const term=finite(years,'Projection term',1,15);
  if(!Number.isInteger(term))throw new RangeError('Choose a whole-year projection from 1 to 15 years.');
  let balance=0;let deposits=0;const schedule=[];
  for(let year=1;year<=term;year++){
    const opening=balance;deposits+=deposit;const interest=Math.round((opening+deposit)*rate)/100;balance=Math.round((opening+deposit+interest)*100)/100;
    schedule.push(Object.freeze({year,deposit,openingBalance:opening,interest,balance}));
  }
  return Object.freeze({annualDeposit:deposit,annualRate:rate,years:term,totalDeposits:Math.round(deposits*100)/100,totalInterest:Math.round((balance-deposits)*100)/100,maturityValue:balance,schedule:Object.freeze(schedule)});
}

export const INDIA_INCOME_TAX_MAINTENANCE = Object.freeze({
  effectiveFrom: '2026-04-01',
  checkedAt: '2026-10-19',
  reviewDue: '2026-11-19',
});

export function estimateIndiaIncomeTax({ taxableIncome, residency = 'resident', asOf = new Date().toISOString().slice(0, 10) } = {}) {
  const asOfTimestamp = typeof asOf === 'string' && /^\d{4}-\d{2}-\d{2}$/u.test(asOf) ? Date.parse(`${asOf}T00:00:00Z`) : NaN;
  if (Number.isNaN(asOfTimestamp) || new Date(asOfTimestamp).toISOString().slice(0, 10) !== asOf) throw new RangeError('A valid ISO calendar date is required.');
  if (asOf < INDIA_INCOME_TAX_MAINTENANCE.effectiveFrom) {
    const error = new RangeError('These tax rules are not effective yet.');
    error.code = 'rules-not-effective';
    throw error;
  }
  if (asOf > INDIA_INCOME_TAX_MAINTENANCE.reviewDue) {
    const error = new RangeError('These tax rules have expired and must be reviewed.');
    error.code = 'rules-expired';
    throw error;
  }
  const income = finite(taxableIncome, 'Taxable income', 0, 5_000_000);
  if (!['resident', 'non-resident'].includes(residency)) throw new RangeError('Choose resident or non-resident status.');
  const slabs = [[400_000, 0], [800_000, 0.05], [1_200_000, 0.10], [1_600_000, 0.15], [2_000_000, 0.20], [2_400_000, 0.25], [Infinity, 0.30]];
  let lower = 0; let baseTax = 0;
  for (const [upper, rate] of slabs) {
    const taxableAtRate = Math.max(0, Math.min(income, upper) - lower);
    baseTax += taxableAtRate * rate;
    if (income <= upper) break;
    lower = upper;
  }
  const rebate = residency === 'resident'
    ? income <= 1_200_000 ? Math.min(baseTax, 60_000) : Math.max(0, baseTax - (income - 1_200_000))
    : 0;
  const taxAfterRebate = Math.max(0, baseTax - rebate);
  const cess = taxAfterRebate * 0.04;
  return Object.freeze({ taxableIncome: income, residency, baseTax, rebate, taxAfterRebate, cess, estimatedTax: taxAfterRebate + cess, effectiveRate: income ? (taxAfterRebate + cess) / income * 100 : 0 });
}

export {
  solarEvents,
  moonEvents,
  persianDate,
  riskMatrix,
  orgChart,
  sankey,
  eventBudget,
  decisionTree,
  shiftSchedule,
  subscriptions,
  radarChart,
  packingBox,
  carCosts,
  braSize,
  writingPrompt,
  colorPalette,
  summarize,
  imagePixels,
  imageHistogram,
  acrostic,
  wordFrequency,
  qiblaDirection,
  gamepadSnapshot,
  wouldYouRatherVote,
  neverHaveIEverVote,
  chineseZodiac,
  egfrCalculator,
  dnsLookup,
  pickCharadesPrompt,
  wordCloud,
  newHanoiGame,
  buildRaciMatrix,
  businessModelCanvas,
  removeObjectInpaint,
  franceHousingScreen,
  skyscrapersPuzzle,
  linearAlgebraView,
  editGpxTrack,
  starBattleState,
  analyzeRecipeNutrition,
  quantumOrbital,
};
