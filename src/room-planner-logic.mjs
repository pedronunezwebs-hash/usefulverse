export const furnitureCatalog = Object.freeze({
  bed: Object.freeze({ width: 2, depth: 1.5 }),
  sofa: Object.freeze({ width: 2, depth: 0.9 }),
  desk: Object.freeze({ width: 1.2, depth: 0.6 }),
  table: Object.freeze({ width: 1.2, depth: 0.8 }),
  chair: Object.freeze({ width: 0.5, depth: 0.5 }),
});

function dimension(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 2 || number > 30) throw new RangeError(`${name} must be between 2 and 30.`);
  return Math.round(number * 10) / 10;
}

export function createRoomPlan(width = 5, depth = 4, unit = 'm') {
  if (!['m', 'ft'].includes(unit)) throw new TypeError('Choose meters or feet.');
  return Object.freeze({ width: dimension(width, 'Room width'), depth: dimension(depth, 'Room depth'), unit, items: Object.freeze([]), nextId: 1 });
}

export function addFurniture(plan, type) {
  const base = furnitureCatalog[type];
  if (!base) throw new TypeError('Choose a furniture type.');
  const scale = plan.unit === 'ft' ? 3.28084 : 1;
  const width = Math.round(base.width * scale * 10) / 10; const depth = Math.round(base.depth * scale * 10) / 10;
  if (width > plan.width || depth > plan.depth) throw new RangeError('This furniture item does not fit in the room.');
  const step = plan.unit === 'ft' ? 1 : 0.5;
  const maxX = Math.floor((plan.width - width) / step); const maxY = Math.floor((plan.depth - depth) / step);
  let position = null;
  for (let row = 0; row <= maxY && !position; row += 1) {
    for (let column = 0; column <= maxX; column += 1) {
      const x = Math.round(column * step * 10) / 10; const y = Math.round(row * step * 10) / 10;
      if (!plan.items.some((item) => intersects({ x, y, width, depth }, item))) { position = { x, y }; break; }
    }
  }
  if (!position) throw new RangeError('There is no clear place for another item. Move furniture or make the room larger.');
  const item = Object.freeze({ id: plan.nextId, type, width, depth, ...position, rotated: false });
  return Object.freeze({ ...plan, items: Object.freeze([...plan.items, item]), nextId: plan.nextId + 1 });
}

export function resizeRoom(plan, width, depth, unit = plan.unit) {
  const next = createRoomPlan(width, depth, unit);
  const ratio = (unit === 'ft' ? 3.28084 : 1) / (plan.unit === 'ft' ? 3.28084 : 1);
  const items = plan.items.map((item) => {
    const itemWidth = Math.round(item.width * ratio * 10) / 10; const itemDepth = Math.round(item.depth * ratio * 10) / 10;
    if (itemWidth > next.width || itemDepth > next.depth) throw new RangeError('A furniture item does not fit in the new room size.');
    return Object.freeze({ ...item, width: itemWidth, depth: itemDepth, x: Math.round(Math.min(item.x * ratio, next.width - itemWidth) * 10) / 10, y: Math.round(Math.min(item.y * ratio, next.depth - itemDepth) * 10) / 10 });
  });
  for (let index = 0; index < items.length; index += 1) {
    if (items.slice(index + 1).some((item) => intersects(items[index], item))) throw new RangeError('Furniture items would overlap in the new room size.');
  }
  return Object.freeze({ ...next, items: Object.freeze(items), nextId: plan.nextId });
}

export function moveFurniture(plan, id, x, y) {
  const item = plan.items.find((candidate) => candidate.id === Number(id));
  if (!item) throw new RangeError('Choose a furniture item.');
  if (![x, y].every(Number.isFinite)) throw new TypeError('Enter valid room coordinates.');
  const step = plan.unit === 'ft' ? 1 : 0.1;
  const left = Math.min(plan.width - item.width, Math.max(0, Math.round(x / step) * step));
  const top = Math.min(plan.depth - item.depth, Math.max(0, Math.round(y / step) * step));
  const updated = Object.freeze({ ...item, x: Math.round(left * 10) / 10, y: Math.round(top * 10) / 10 });
  if (plan.items.some((candidate) => candidate.id !== item.id && intersects(updated, candidate))) return plan;
  return Object.freeze({ ...plan, items: Object.freeze(plan.items.map((candidate) => candidate.id === item.id ? updated : candidate)) });
}

export function rotateFurniture(plan, id) {
  const item = plan.items.find((candidate) => candidate.id === Number(id));
  if (!item) throw new RangeError('Choose a furniture item.');
  const width = item.depth; const depth = item.width;
  const x = Math.min(item.x + (item.width - width) / 2, plan.width - width);
  const y = Math.min(item.y + (item.depth - depth) / 2, plan.depth - depth);
  const updated = Object.freeze({ ...item, width, depth, x: Math.max(0, x), y: Math.max(0, y), rotated: !item.rotated });
  if (plan.items.some((candidate) => candidate.id !== item.id && intersects(updated, candidate))) return plan;
  return Object.freeze({ ...plan, items: Object.freeze(plan.items.map((candidate) => candidate.id === item.id ? updated : candidate)) });
}

export function removeFurniture(plan, id) {
  const items = plan.items.filter((item) => item.id !== Number(id));
  if (items.length === plan.items.length) return plan;
  return Object.freeze({ ...plan, items: Object.freeze(items) });
}

export function intersects(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.depth && a.y + a.depth > b.y;
}
