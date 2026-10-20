const eventPagePrefix = 'https://earthquake.usgs.gov/earthquakes/eventpage/';

export function normalizeEarthquakeFeed(feed, minimumMagnitude = 2.5, limit = 100) {
  if (!feed || feed.type !== 'FeatureCollection' || !Array.isArray(feed.features) || feed.features.length > 25000) {
    throw Object.assign(new TypeError('The earthquake feed has an unexpected format.'), { code: 'invalid-feed' });
  }
  if (![2.5, 4.5, 6].includes(Number(minimumMagnitude))) throw Object.assign(new RangeError('Choose a supported minimum magnitude.'), { code: 'invalid-filter' });
  const cap = Number(limit);
  if (![50, 100, 250, 500].includes(cap)) throw Object.assign(new RangeError('Choose a supported event limit.'), { code: 'invalid-filter' });
  const events = [];
  for (const feature of feed.features) {
    const properties = feature?.properties;
    const coordinates = feature?.geometry?.coordinates;
    const magnitude = Number(properties?.mag);
    const longitude = Number(coordinates?.[0]);
    const latitude = Number(coordinates?.[1]);
    const depth = Number(coordinates?.[2]);
    const time = Number(properties?.time);
    if (!Number.isFinite(magnitude) || magnitude < minimumMagnitude || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(depth) || !Number.isFinite(time)) continue;
    const id = String(feature.id ?? '');
    if (!/^[A-Za-z0-9_-]{1,80}$/u.test(id)) continue;
    events.push(Object.freeze({
      id, magnitude, longitude, latitude, depth, time,
      place: String(properties.place ?? '').slice(0, 180) || '—',
      eventUrl: `${eventPagePrefix}${encodeURIComponent(id)}`,
    }));
  }
  events.sort((a, b) => b.time - a.time);
  return Object.freeze(events.slice(0, cap));
}

export function projectEarthquakePoint(longitude, latitude, width = 960, height = 480) {
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new RangeError('Coordinates must be valid longitude and latitude values.');
  }
  const padding = 32;
  return Object.freeze({
    x: padding + ((longitude + 180) / 360) * (width - padding * 2),
    y: padding + ((90 - latitude) / 180) * (height - padding * 2),
  });
}
