import { addConstructionObject, addFreePoint, createConstruction, evaluateConstruction, moveFreePoint } from './logic.mjs';

const root = document.querySelector('[data-geometry-construction]');
if (root) {
  const svg = root.querySelector('[data-canvas]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  let state = createConstruction();
  let mode = 'select';
  let chosen = [];
  let dragging = null;
  const NS = 'http://www.w3.org/2000/svg';
  const modeMap = { perpendicularBisector: 'perpendicular-bisector' };
  const make = (tag, attrs = {}) => {
    const el = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
    return el;
  };
  const localPoint = (event) => {
    const rect = svg.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * 800 / rect.width, y: (event.clientY - rect.top) * 500 / rect.height };
  };
  const render = () => {
    svg.replaceChildren(make('rect', { class: 'geometry-construction__background', width: 800, height: 500 }));
    const evaluated = evaluateConstruction(state);
    const points = new Map(evaluated.points.map((point) => [point.id, point]));
    for (const object of evaluated.objects) {
      if (object.kind === 'circle') svg.append(make('circle', { class: 'geometry-construction__object', cx: object.cx, cy: object.cy, r: object.radius }));
      else {
        let { x1, y1, x2, y2 } = object;
        if (object.kind === 'line' || object.kind === 'ray') {
          const dx = x2 - x1, dy = y2 - y1, length = Math.hypot(dx, dy) || 1;
          if (object.kind === 'line') { x1 -= dx / length * 1600; y1 -= dy / length * 1600; }
          x2 += dx / length * 1600; y2 += dy / length * 1600;
        }
        svg.append(make('line', { class: `geometry-construction__object geometry-construction__object--${object.kind}`, x1, y1, x2, y2 }));
      }
    }
    for (const point of evaluated.points) {
      const group = make('g', { class: `geometry-construction__point${chosen.includes(point.id) ? ' is-selected' : ''}`, 'data-point-id': point.id, tabindex: 0, role: 'button', 'aria-label': `${point.kind === 'free' ? copy.fields.freePoint : copy.fields.derivedPoint} ${point.id}` });
      group.append(make('circle', { cx: point.x, cy: point.y, r: point.kind === 'free' ? 7 : 5 }));
      const text = make('text', { x: point.x + 9, y: point.y - 8 });
      text.textContent = `P${point.id}`;
      group.append(text);
      svg.append(group);
    }
  };
  const getPointId = (event) => {
    const target = event.target.closest?.('[data-point-id]');
    if (target) return Number(target.getAttribute('data-point-id'));
    const { x, y } = localPoint(event);
    const nearest = evaluateConstruction(state).points.map((point) => ({ ...point, distance: Math.hypot(point.x - x, point.y - y) })).sort((a, b) => a.distance - b.distance)[0];
    return nearest?.distance <= 18 ? nearest.id : null;
  };
  root.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    chosen = [];
    root.querySelectorAll('[data-mode]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    status.textContent = mode === 'point' ? copy.messages.addPoint : copy.messages.selectPoints;
    render();
  }));
  svg.addEventListener('pointerdown', (event) => {
    const id = getPointId(event);
    if (mode === 'select') {
      const point = state.points.find((item) => item.id === id && item.kind === 'free');
      if (point) { dragging = id; svg.setPointerCapture(event.pointerId); event.preventDefault(); }
      return;
    }
    if (mode === 'point') {
      try { addFreePoint(state, ...Object.values(localPoint(event))); status.textContent = copy.messages.pointAdded; render(); }
      catch { status.textContent = copy.messages.limit; }
      return;
    }
    if (!id) { status.textContent = copy.messages.clickPoint; return; }
    if (!chosen.includes(id)) chosen.push(id);
    if (chosen.length === 2) {
      try { addConstructionObject(state, modeMap[mode] ?? mode, chosen); status.textContent = copy.messages.objectAdded; chosen = []; }
      catch { status.textContent = copy.messages.invalid; chosen = []; }
    }
    render();
  });
  svg.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const point = localPoint(event);
    try { moveFreePoint(state, dragging, point.x, point.y); render(); }
    catch { status.textContent = copy.messages.invalid; }
  });
  const stopDragging = () => { dragging = null; };
  svg.addEventListener('pointerup', stopDragging);
  svg.addEventListener('pointercancel', stopDragging);
  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    state = createConstruction(); chosen = []; dragging = null; mode = 'select';
    root.querySelectorAll('[data-mode]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    status.textContent = copy.messages.reset;
    render();
  });
  root.querySelector('[data-mode="select"]')?.setAttribute('aria-pressed', 'true');
  render();
}
