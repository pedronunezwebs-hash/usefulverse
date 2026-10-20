const finite = Number.isFinite;
const MAX_POINTS = 80;
const MAX_OBJECTS = 160;

export function createConstruction() {
  return { points: [], objects: [], nextId: 1 };
}

export function addFreePoint(state, x, y) {
  if (!state || state.points.length >= MAX_POINTS || !finite(x) || !finite(y) || x < 0 || x > 800 || y < 0 || y > 500) throw new RangeError('A construction supports up to 80 points within the canvas.');
  const point = Object.freeze({ id: state.nextId++, kind: 'free', x, y });
  state.points.push(point);
  return point.id;
}

export function addConstructionObject(state, kind, pointIds) {
  if (!state || state.objects.length >= MAX_OBJECTS) throw new RangeError('A construction supports up to 160 objects.');
  const needed = kind === 'circle' ? 2 : 2;
  if (!['segment', 'line', 'ray', 'circle', 'midpoint', 'perpendicular-bisector'].includes(kind) || !Array.isArray(pointIds) || pointIds.length !== needed || pointIds[0] === pointIds[1]) throw new RangeError('Choose two distinct points and a supported construction.');
  const ids = new Set([...state.points.map(({ id }) => id), ...state.objects.filter((item) => item.kind === 'midpoint').map(({ id }) => id)]);
  if (pointIds.some((id) => !ids.has(id))) throw new RangeError('Construction points must already exist.');
  const object = Object.freeze({ id: state.nextId++, kind, pointIds: Object.freeze([...pointIds]) });
  state.objects.push(object);
  return object.id;
}

export function moveFreePoint(state, id, x, y) {
  const index = state?.points.findIndex((point) => point.id === id && point.kind === 'free');
  if (index < 0 || !finite(x) || !finite(y)) throw new RangeError('Only an existing free point can be moved.');
  state.points[index] = Object.freeze({ ...state.points[index], x: Math.max(0, Math.min(800, x)), y: Math.max(0, Math.min(500, y)) });
}

export function evaluateConstruction(state) {
  const points = new Map(state.points.map((point) => [point.id, { ...point }]));
  const values = [];
  for (const object of state.objects) {
    const [aId, bId] = object.pointIds;
    const a = points.get(aId), b = points.get(bId);
    if (!a || !b) continue;
    const dx = b.x - a.x, dy = b.y - a.y;
    const length = Math.hypot(dx, dy);
    if (length < 0.001) continue;
    if (object.kind === 'midpoint') {
      points.set(object.id, { id: object.id, kind: 'derived', x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, parentIds: object.pointIds });
    } else if (object.kind === 'circle') values.push({ ...object, cx: a.x, cy: a.y, radius: length });
    else if (object.kind === 'perpendicular-bisector') {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      values.push({ ...object, x1: mx - dy / length * 1000, y1: my + dx / length * 1000, x2: mx + dy / length * 1000, y2: my - dx / length * 1000 });
    } else values.push({ ...object, x1: a.x, y1: a.y, x2: b.x, y2: b.y });
  }
  return Object.freeze({ points: Object.freeze([...points.values()].map(Object.freeze)), objects: Object.freeze(values.map(Object.freeze)) });
}
