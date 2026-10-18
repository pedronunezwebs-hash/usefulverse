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
    case 'acrostic-poem-maker': return acrostic(input);
    case 'word-frequency-counter': return wordFrequency(input);
    case 'color-palette-from-image': return colorPalette(input);
    case 'image-histogram': return imageHistogram(input);
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
};
