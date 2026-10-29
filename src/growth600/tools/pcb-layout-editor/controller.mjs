import { addPcbPart, createPcbBoard, exportPcbArtifacts, pcbFootprints, removePcbPart, renderPcbPreviewSvg, routePcbTrack } from './logic.mjs';

const root = document.querySelector('[data-tool="pcb-layout-editor"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copyNode = root.querySelector('[data-tool-copy]') ?? document.querySelector('[data-tool-copy]');
  const copy = JSON.parse(copyNode?.textContent ?? '{}');
  const f = copy.fields;
  let board = null;
  const node = (tag, value, className) => {
    const element = document.createElement(tag);
    if (value !== undefined) element.textContent = String(value);
    if (className) element.className = className;
    return element;
  };
  const button = (label, action, className = 'button button--secondary') => {
    const element = node('button', label, className);
    element.type = 'button';
    element.dataset.action = action;
    return element;
  };
  const labeled = (label, control) => { const wrapper = node('label', label); wrapper.append(control); return wrapper; };
  const input = (name, type, value, { min, max, step } = {}) => {
    const element = document.createElement('input');
    element.name = name;
    element.type = type;
    element.value = String(value);
    if (min !== undefined) element.min = String(min);
    if (max !== undefined) element.max = String(max);
    if (step !== undefined) element.step = String(step);
    return element;
  };
  const select = (name, options) => {
    const element = document.createElement('select');
    element.name = name;
    for (const [value, label] of options) { const option = node('option', label); option.value = String(value); element.append(option); }
    return element;
  };
  function setStatus(message, error = false) {
    status.textContent = message;
    status.classList.toggle('status--error', error);
    result.hidden = false;
  }
  function download(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = node('a', name);
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function render() {
    content.replaceChildren();
    if (!board) return;
    const preview = node('div', undefined, 'pcb-layout-preview');
    preview.style.overflow = 'auto';
    preview.innerHTML = renderPcbPreviewSvg(board);
    const svg = preview.querySelector('svg');
    svg.setAttribute('aria-label', f.boardPreview);
    content.append(preview);

    const parts = node('fieldset');
    parts.append(node('legend', f.addPart));
    const footprintOptions = Object.keys(pcbFootprints).map((id) => [id, f[{ resistor: 'resistor', 'header-2': 'header2', led: 'led', 'dip-8': 'dip8' }[id]]]);
    const partForm = node('form');
    partForm.className = 'calculator-grid';
    const ref = input('reference', 'text', `R${board.parts.length + 1}`); ref.maxLength = 12;
    const footprint = select('footprint', footprintOptions);
    const x = input('x', 'number', Math.max(4, Math.min(board.width - 4, board.width / 2)), { min: 0, max: board.width, step: board.grid });
    const y = input('y', 'number', Math.max(4, Math.min(board.height - 4, board.height / 2)), { min: 0, max: board.height, step: board.grid });
    const rotation = select('rotation', [[0, f.degrees0], [90, f.degrees90], [180, f.degrees180], [270, f.degrees270]]);
    partForm.append(labeled(f.reference, ref), labeled(f.footprint, footprint), labeled(f.positionX, x), labeled(f.positionY, y), labeled(f.rotation, rotation));
    const add = button(copy.actions.addPart, 'add-part', 'button button--primary');
    add.type = 'submit';
    partForm.append(add);
    partForm.addEventListener('submit', (event) => { event.preventDefault(); try { board = addPcbPart(board, { ref: ref.value, footprint: footprint.value, x: x.value, y: y.value, rotation: rotation.value }); render(); setStatus(copy.messages.partAdded); } catch (error) { setStatus(copy.messages[error?.code] ?? copy.messages.error, true); } });
    parts.append(partForm);
    if (board.parts.length) {
      const list = node('ul');
      for (const part of board.parts) list.append(node('li', `${part.ref} · ${f[({ resistor: 'resistor', 'header-2': 'header2', led: 'led', 'dip-8': 'dip8' })[part.footprint]]} · ${part.x}, ${part.y} mm · ${part.rotation}°`));
      parts.append(node('h3', f.partList), list);
    } else parts.append(node('p', f.noParts, 'hint'));
    content.append(parts);

    const pads = board.parts.flatMap((part) => Array.from({ length: pcbFootprints[part.footprint].padCount }, (_, index) => [`${part.ref}.${index + 1}`, `${part.ref} · pad ${index + 1}`]));
    const routing = node('fieldset');
    routing.append(node('legend', f.route));
    if (pads.length < 2) routing.append(node('p', f.noPads, 'hint'));
    else {
      const routeForm = node('form'); routeForm.className = 'calculator-grid';
      const from = select('from', pads), to = select('to', pads.slice(1));
      const net = input('net', 'text', `NET${board.tracks.length + 1}`); net.maxLength = 12;
      const width = input('width', 'number', 0.3, { min: 0.15, max: 2, step: 0.05 });
      const waypoints = document.createElement('textarea'); waypoints.name = 'waypoints'; waypoints.rows = 2; waypoints.maxLength = 240;
      routeForm.append(labeled(f.fromPad, from), labeled(f.toPad, to), labeled(f.netName, net), labeled(f.traceWidth, width), labeled(f.waypoints, waypoints), node('p', f.waypointsHint, 'hint'));
      const routeButton = button(copy.actions.route, 'route', 'button button--primary'); routeButton.type = 'submit'; routeForm.append(routeButton);
      routeForm.addEventListener('submit', (event) => { event.preventDefault(); try { const parse = waypoints.value.trim() ? waypoints.value.split(';').map((pair) => { const [a, b, extra] = pair.split(',').map((value) => value.trim()); if (extra !== undefined || a === undefined || b === undefined) throw Object.assign(new RangeError('Invalid waypoint.'), { code: 'outside-board' }); return { x: a, y: b }; }) : []; board = routePcbTrack(board, { net: net.value, from: { ref: from.value.split('.')[0], pad: from.value.split('.')[1] }, to: { ref: to.value.split('.')[0], pad: to.value.split('.')[1] }, waypoints: parse, width: width.value }); render(); setStatus(copy.messages.routeAdded); } catch (error) { setStatus(copy.messages[error?.code] ?? copy.messages.error, true); } });
      routing.append(routeForm);
    }
    if (board.tracks.length) { const list = node('ul'); for (const track of board.tracks) list.append(node('li', `${track.net}: ${track.from} → ${track.to} · ${track.width} mm`)); routing.append(node('h3', f.routeList), list); }
    content.append(routing);

    if (board.parts.length) {
      const removeBox = node('fieldset'); removeBox.append(node('legend', f.removePart));
      const removeForm = node('form'); removeForm.className = 'actions';
      const partSelect = select('part', board.parts.map((part) => [part.ref, part.ref]));
      const removeButton = button(copy.actions.remove, 'remove'); removeButton.type = 'submit'; removeForm.append(labeled(f.removePart, partSelect), removeButton);
      removeForm.addEventListener('submit', (event) => { event.preventDefault(); try { board = removePcbPart(board, partSelect.value); render(); setStatus(copy.messages.partRemoved); } catch (error) { setStatus(copy.messages[error?.code] ?? copy.messages.error, true); } });
      removeBox.append(removeForm); content.append(removeBox);
    }

    const exports = node('fieldset'); exports.append(node('legend', f.files));
    const files = exportPcbArtifacts(board);
    for (const [key, label] of [['F.Cu.gbr', copy.actions.exportCopper], ['Edge.Cuts.gbr', copy.actions.exportProfile], ['PTH.drl', copy.actions.exportDrill]]) {
      const save = button(label, `export-${key}`); save.addEventListener('click', () => download(key, files[key], key.endsWith('.drl') ? 'text/plain;charset=utf-8' : 'application/octet-stream')); exports.append(save);
    }
    content.append(exports);
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try { board = createPcbBoard({ width: form.elements.namedItem('boardWidth').value, height: form.elements.namedItem('boardHeight').value, grid: form.elements.namedItem('grid').value }); render(); setStatus(copy.messages.complete); }
    catch (error) { setStatus(copy.messages[error?.code] ?? copy.messages.error, true); }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { board = null; content.replaceChildren(); status.textContent = ''; status.classList.remove('status--error'); result.hidden = true; }));
}
