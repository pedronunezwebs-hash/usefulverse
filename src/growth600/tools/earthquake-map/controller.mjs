import { normalizeEarthquakeFeed, projectEarthquakePoint } from './logic.mjs';

const root = document.querySelector('[data-tool="earthquake-map"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const node = (tag, text) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = String(text); return el; };
  const feeds = Object.freeze({
    hour: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_hour.geojson',
    day: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson',
    week: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson',
    month: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson',
  });
  async function readFeed(response) {
    const declared = Number(response.headers.get('content-length'));
    if (Number.isFinite(declared) && declared > 4_000_000) throw Object.assign(new RangeError('The feed exceeds the local size limit.'), { code: 'feed-too-large' });
    if (!response.body?.getReader) {
      const text = await response.text();
      if (text.length > 4_000_000) throw Object.assign(new RangeError('The feed exceeds the local size limit.'), { code: 'feed-too-large' });
      return JSON.parse(text);
    }
    const reader = response.body.getReader();
    const chunks = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > 4_000_000) { await reader.cancel(); throw Object.assign(new RangeError('The feed exceeds the local size limit.'), { code: 'feed-too-large' }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  function render(events, generated) {
    content.replaceChildren();
    const summary = node('p', `${events.length} ${copy.fields.eventsShown}`);
    const generatedText = Number.isFinite(Number(generated)) ? new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: 'medium', timeStyle: 'short' }).format(Number(generated)) : copy.fields.timeUnavailable;
    const updated = node('p', `${copy.fields.feedGenerated}: ${generatedText}`);
    content.append(summary, updated);
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 960 480');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', copy.fields.mapDescription);
    svg.classList.add('earthquake-map-chart');
    for (const longitude of [-120, -60, 0, 60, 120]) {
      const point = projectEarthquakePoint(longitude, 0);
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', String(point.x)); line.setAttribute('x2', String(point.x)); line.setAttribute('y1', '32'); line.setAttribute('y2', '448'); line.classList.add('earthquake-map-grid'); svg.append(line);
    }
    for (const latitude of [-60, -30, 0, 30, 60]) {
      const point = projectEarthquakePoint(0, latitude);
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', '32'); line.setAttribute('x2', '928'); line.setAttribute('y1', String(point.y)); line.setAttribute('y2', String(point.y)); line.classList.add('earthquake-map-grid'); svg.append(line);
    }
    for (const event of events) {
      const point = projectEarthquakePoint(event.longitude, event.latitude);
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', String(point.x)); circle.setAttribute('cy', String(point.y));
      circle.setAttribute('r', String(Math.min(12, 3 + event.magnitude * 0.8)));
      circle.classList.add('earthquake-map-marker'); circle.setAttribute('aria-hidden', 'true');
      const title = document.createElementNS(svgNS, 'title'); title.textContent = `${copy.fields.magnitude} ${event.magnitude.toFixed(1)} · ${event.place}`;
      circle.append(title); svg.append(circle);
    }
    const map = node('div'); map.className = 'earthquake-map-frame';
    const land = node('img'); land.src = '/assets/earthquake-world-land.svg'; land.alt = ''; land.setAttribute('aria-hidden', 'true'); land.width = 960; land.height = 480;
    map.append(land, svg); content.append(map);
    const note = node('p', copy.fields.mapLimit); note.className = 'hint'; content.append(note);
    const list = node('ol'); list.className = 'earthquake-map-list'; list.setAttribute('aria-label', copy.fields.eventList);
    const number = new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 1 });
    const timeFormat = new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: 'medium', timeStyle: 'short' });
    for (const event of events) {
      const item = node('li');
      const link = node('a', `${copy.fields.magnitude} ${number.format(event.magnitude)} · ${event.place}`);
      link.href = event.eventUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
      const details = node('p', `${timeFormat.format(event.time)} · ${copy.fields.depth}: ${number.format(event.depth)} km · ${copy.fields.coordinates}: ${number.format(event.latitude)}, ${number.format(event.longitude)}`);
      item.append(link, details); list.append(item);
    }
    if (!events.length) list.append(node('li', copy.messages.noEvents));
    content.append(list);
    const source = node('a', copy.fields.dataCredit);
    source.href = 'https://www.usgs.gov/information-policies-and-instructions/acknowledging-or-crediting-usgs';
    source.target = '_blank'; source.rel = 'noopener noreferrer'; content.append(source);
    const docs = node('a', copy.fields.feedDocumentation);
    docs.href = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php';
    docs.target = '_blank'; docs.rel = 'noopener noreferrer'; content.append(docs);
    const mapSource = node('a', copy.fields.mapDataCredit);
    mapSource.href = 'https://www.naturalearthdata.com/about/terms-of-use/';
    mapSource.target = '_blank'; mapSource.rel = 'noopener noreferrer'; content.append(mapSource);
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    content.replaceChildren(); status.classList.remove('status--error'); status.textContent = copy.messages.loading; result.hidden = false;
    const period = form.elements.namedItem('period').value;
    const feedUrl = feeds[period];
    if (!feedUrl) { status.textContent = copy.messages.invalidPeriod; status.classList.add('status--error'); return; }
    try {
      const response = await fetch(feedUrl, { method: 'GET', mode: 'cors', credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer', headers: { accept: 'application/geo+json, application/json' } });
      if (!response.ok) throw Object.assign(new Error('feed'), { code: 'feed-error' });
      const feed = await readFeed(response);
      const events = normalizeEarthquakeFeed(feed, Number(form.elements.namedItem('minimumMagnitude').value), Number(form.elements.namedItem('eventLimit').value));
      render(events, feed.metadata?.generated);
      status.textContent = `${copy.messages.complete} ${copy.fields.dataTime}: ${new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: 'medium', timeStyle: 'short' }).format(Date.now())}`;
    } catch (error) {
      status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error');
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); status.textContent = ''; status.classList.remove('status--error'); result.hidden = true; }));
}
