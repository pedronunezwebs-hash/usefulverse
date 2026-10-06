import { addFurniture, createRoomPlan, moveFurniture, removeFurniture, resizeRoom, rotateFurniture } from './room-planner-logic.mjs';

export function setupRoomPlanner(root) {
  const messages = (() => { try { return JSON.parse(root.dataset.plannerMessages || '{}'); } catch { return {}; } })();
  const t = (key) => messages[key] ?? key;
  const $ = (selector) => root.querySelector(selector);
  const svg = $('[data-room-svg]'); const list = $('[data-room-items]'); const status = $('#op-status'); const sizeLabel = $('[data-room-size]');
  let plan = createRoomPlan(); let selected = null; let dragging = null;
  const ns = 'http://www.w3.org/2000/svg';
  const makeSvg = (tag, attrs = {}) => { const item = document.createElementNS(ns, tag); for (const [name, value] of Object.entries(attrs)) item.setAttribute(name, String(value)); return item; };
  const labels = Object.fromEntries(['bed','sofa','desk','table','chair'].map((type) => [type, t(type[0].toUpperCase() + type.slice(1))]));
  const say = (key) => { status.textContent = t(key); };
  const render = () => {
    svg.replaceChildren(); svg.setAttribute('viewBox', `0 0 ${plan.width} ${plan.depth}`); svg.setAttribute('width', '1200'); svg.setAttribute('height', String(Math.round(1200 * plan.depth / plan.width))); svg.style.aspectRatio = `${plan.width}/${plan.depth}`;
    const style = makeSvg('style');
    style.textContent = '.room-planner__floor{fill:#fbfaf5;stroke:#253047;stroke-width:.035}.room-planner__gridline{stroke:#d9dde5;stroke-width:.012;pointer-events:none}.room-planner__item{cursor:move;touch-action:none}.room-planner__furniture{stroke:#58647a;stroke-width:.035}.room-planner__item.is-selected .room-planner__furniture{stroke:#286bcb;stroke-width:.075;stroke-dasharray:.12 .07}.room-planner__label{fill:#1a2438;pointer-events:none;user-select:none}';
    svg.append(style);
    sizeLabel.textContent = t('Room {width} × {depth} {unit}').replace('{width}', plan.width).replace('{depth}', plan.depth).replace('{unit}', plan.unit);
    svg.append(makeSvg('rect', { x: 0, y: 0, width: plan.width, height: plan.depth, class: 'room-planner__floor' }));
    for (let x = 1; x < plan.width; x += 1) svg.append(makeSvg('line', { x1: x, y1: 0, x2: x, y2: plan.depth, class: 'room-planner__gridline' }));
    for (let y = 1; y < plan.depth; y += 1) svg.append(makeSvg('line', { x1: 0, y1: y, x2: plan.width, y2: y, class: 'room-planner__gridline' }));
    const color = { bed: '#cedcff', sofa: '#d9d0ff', desk: '#f6dfae', table: '#ffe6bf', chair: '#c8ecda' };
    for (const item of plan.items) {
      const group = makeSvg('g', { transform: `translate(${item.x} ${item.y})`, tabindex: '0', role: 'button', 'aria-pressed': selected === item.id, 'aria-label': t('Selected: {item}').replace('{item}', `${labels[item.type]}, ${item.width} × ${item.depth} ${plan.unit}`), 'data-room-item': item.id, class: `room-planner__item${selected === item.id ? ' is-selected' : ''}` });
      group.append(makeSvg('rect', { x: 0.025, y: 0.025, width: Math.max(0.01, item.width - 0.05), height: Math.max(0.01, item.depth - 0.05), rx: 0.08, fill: color[item.type], class: 'room-planner__furniture' }));
      const name = makeSvg('text', { x: item.width / 2, y: item.depth / 2, class: 'room-planner__label', 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-size': Math.min(item.width, item.depth) * 0.16 }); name.textContent = labels[item.type]; group.append(name);
      svg.append(group);
    }
    list.replaceChildren();
    if (!plan.items.length) { const empty = document.createElement('p'); empty.className = 'tool-hint'; empty.textContent = t('Select an item to edit it.'); list.append(empty); }
    for (const item of plan.items) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'button button--ghost'; button.dataset.roomSelect = String(item.id); button.setAttribute('aria-pressed', selected === item.id ? 'true' : 'false'); button.textContent = `${labels[item.type]} · ${item.width} × ${item.depth} ${plan.unit}`; list.append(button);
    }
    $('[data-room-rotate]').disabled = selected == null; $('[data-room-remove]').disabled = selected == null;
  };
  const updateRoom = () => {
    try {
      plan = resizeRoom(plan, Number($('[data-room-width]').value), Number($('[data-room-depth]').value), $('[data-room-unit]').value);
      render(); say('Room dimensions updated.');
    } catch (error) { say(error.message.includes('does not fit') ? 'A furniture item does not fit in the new room size.' : error.message.includes('overlap') ? 'These dimensions would make furniture overlap.' : 'Room width and depth must be from 2 to 30.'); }
  };
  $('[data-room-update]').addEventListener('click', updateRoom);
  $('[data-room-add]').addEventListener('click', () => {
    try { plan = addFurniture(plan, $('[data-room-furniture]').value); selected = plan.items.at(-1)?.id ?? null; render(); say('Furniture added.'); }
    catch (error) { say(error.message.includes('fit') ? 'This item does not fit in the room.' : 'There is no clear place for another item.'); }
  });
  const select = (id, target = 'list') => { selected = Number(id); render(); (target === 'canvas' ? svg.querySelector(`[data-room-item="${selected}"]`) : list.querySelector(`[data-room-select="${selected}"]`))?.focus(); };
  list.addEventListener('click', (event) => { const button = event.target.closest('[data-room-select]'); if (button) select(button.dataset.roomSelect, 'list'); });
  svg.addEventListener('click', (event) => { const item = event.target.closest('[data-room-item]'); if (item) select(item.dataset.roomItem, 'canvas'); });
  $('[data-room-rotate]').addEventListener('click', () => { if (selected == null) return; plan = rotateFurniture(plan, selected); render(); say('Furniture rotated.'); });
  $('[data-room-remove]').addEventListener('click', () => { if (selected == null) return; plan = removeFurniture(plan, selected); selected = null; render(); say('Furniture removed.'); });
  $('[data-room-clear]').addEventListener('click', () => { plan = Object.freeze({ ...plan, items: Object.freeze([]) }); selected = null; render(); say('Furniture cleared.'); });
  const worldPoint = (event) => { const box = svg.getBoundingClientRect(); return { x: (event.clientX - box.left) / box.width * plan.width, y: (event.clientY - box.top) / box.height * plan.depth }; };
  svg.addEventListener('pointerdown', (event) => {
    const item = event.target.closest('[data-room-item]'); if (!item) return;
    const id = Number(item.dataset.roomItem); const point = worldPoint(event); const furniture = plan.items.find((candidate) => candidate.id === id);
    selected = id; dragging = { id, dx: point.x - furniture.x, dy: point.y - furniture.y, changed: false }; svg.setPointerCapture(event.pointerId); render(); event.preventDefault();
  });
  svg.addEventListener('pointermove', (event) => { if (!dragging) return; const point = worldPoint(event); const previous = plan; plan = moveFurniture(plan, dragging.id, point.x - dragging.dx, point.y - dragging.dy); dragging.changed ||= plan !== previous; render(); });
  const endDrag = () => { if (dragging?.changed) say('Furniture moved.'); dragging = null; };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);
  svg.addEventListener('keydown', (event) => {
    if (selected == null) return;
    const steps = plan.unit === 'ft' ? 1 : 0.1; const item = plan.items.find((candidate) => candidate.id === selected);
    const moves = { ArrowLeft: [-steps,0], ArrowRight: [steps,0], ArrowUp: [0,-steps], ArrowDown: [0,steps] };
    if (moves[event.key]) { event.preventDefault(); const previous = plan; plan = moveFurniture(plan, selected, item.x + moves[event.key][0], item.y + moves[event.key][1]); render(); say(plan === previous ? 'Furniture cannot overlap another item.' : 'Furniture moved.'); svg.querySelector(`[data-room-item="${selected}"]`)?.focus(); }
    else if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); plan = removeFurniture(plan, selected); selected = null; render(); say('Furniture removed.'); svg.focus(); }
  });
  $('[data-room-download]').addEventListener('click', () => {
    const content = `<?xml version="1.0" encoding="UTF-8"?>\n${svg.outerHTML}`;
    const url = URL.createObjectURL(new Blob([content], { type: 'image/svg+xml;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'room-floor-plan.svg'; link.click(); URL.revokeObjectURL(url); say('Floor plan download started.');
  });
  render();
}
