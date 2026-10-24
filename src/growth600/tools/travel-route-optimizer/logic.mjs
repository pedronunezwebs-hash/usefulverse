const EARTH_KM = 6371.0088;
const radians = (value) => value * Math.PI / 180;
function distance(a, b) {
  const p1 = radians(a.lat), p2 = radians(b.lat), dp = p2 - p1, dl = radians(b.lon - a.lon);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(Math.min(1, h)));
}
function routeLength(order, points, closeLoop) {
  let total = 0;
  for (let i = 1; i < order.length; i++) total += distance(points[order[i - 1]], points[order[i]]);
  if (closeLoop && order.length > 1) total += distance(points[order.at(-1)], points[order[0]]);
  return total;
}
export function optimizeCoordinateRoute(points, { closeLoop = false } = {}) {
  if (!Array.isArray(points) || points.length < 2 || points.length > 16) throw new RangeError('Enter between 2 and 16 locations.');
  const seen = new Set();
  const checked = points.map((point, i) => {
    const name = String(point.name ?? '').trim(), lat = Number(point.lat), lon = Number(point.lon);
    if (!name || name.length > 60 || !Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) throw new RangeError(`Check location ${i + 1}.`);
    const key = name.normalize('NFC').toLocaleLowerCase('und'); if (seen.has(key)) throw new RangeError('Location names must be unique.'); seen.add(key);
    return { name, lat, lon };
  });
  let order = [0];
  const remaining = new Set(checked.slice(1).map((_, i) => i + 1));
  while (remaining.size) {
    const last = order.at(-1); let nearest = null, best = Infinity;
    for (const candidate of remaining) { const d = distance(checked[last], checked[candidate]); if (d < best || (d === best && candidate < nearest)) { best = d; nearest = candidate; } }
    order.push(nearest); remaining.delete(nearest);
  }
  let improved = true, passes = 0;
  while (improved && passes++ < 100) {
    improved = false;
    for (let i = 1; i < order.length - 1; i++) for (let k = i + 1; k < order.length; k++) {
      const candidate = [...order.slice(0, i), ...order.slice(i, k + 1).reverse(), ...order.slice(k + 1)];
      if (routeLength(candidate, checked, closeLoop) + 1e-8 < routeLength(order, checked, closeLoop)) { order = candidate; improved = true; }
    }
  }
  const originalKm = routeLength(checked.map((_, i) => i), checked, closeLoop);
  const optimizedKm = routeLength(order, checked, closeLoop);
  return Object.freeze({ points: checked, order, optimizedKm, originalKm, savedKm: Math.max(0, originalKm - optimizedKm), closeLoop: Boolean(closeLoop), method: 'nearest-neighbor + 2-opt', exact: false });
}
