const root = document.querySelector('[data-dxf-viewer]');
if (root) {
  const copy = JSON.parse(root.closest('main').querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const q = (selector) => root.querySelector(selector);
  const fileInput = q('#dxf-file');
  const status = q('[data-dxf-status]');
  const stage = q('[data-dxf-stage]');
  const info = q('[data-dxf-info]');
  const metadata = q('[data-dxf-metadata]');
  let worker = null;
  let model = null;
  let svg = null;
  let geometryGroup = null;
  let viewBox = null;
  let measureMode = false;
  let firstMeasurePoint = null;
  let pointerStart = null;
  let dragStarted = false;
  let pinchStartDistance = 0;
  let pinchStartView = null;
  let request = 0;
  const pointerMap = new Map();
  const measure = q('[data-dxf-measure-result]');

  const setStatus = (text, error = false) => {
    status.textContent = text;
    status.classList.toggle('result--error', error);
  };
  const safeName = (name) => name.replace(/\.[^.]+$/u, '').replace(/[^\p{L}\p{N}._-]+/gu, '-').slice(0, 80) || 'drawing';
  const fmt = (number) => new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 4 }).format(number);
  const svgNode = (name, attributes = {}) => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    return node;
  };
  const appendMeta = (label, value) => {
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); dd.textContent = value;
    metadata.append(dt, dd);
  };

  function clearModel() {
    request += 1;
    worker?.terminate(); worker = null;
    model = null; svg = null; geometryGroup = null; viewBox = null;
    info.hidden = true; metadata.replaceChildren();
    q('[data-dxf-layers]').replaceChildren(); q('[data-dxf-unsupported]').replaceChildren();
    q('[data-dxf-no-layers]').hidden = true;
    for (const button of root.querySelectorAll('[data-dxf-fit], [data-dxf-zoom], [data-dxf-measure], [data-dxf-svg], [data-dxf-png], [data-dxf-clear]')) button.disabled = true;
    q('[data-dxf-cancel]').hidden = true;
    q('[data-dxf-clear-measure]').hidden = true; q('[data-dxf-measure-help]').hidden = true;
    measure.hidden = true; measure.replaceChildren();
    measureMode = false; firstMeasurePoint = null; pointerMap.clear(); pointerStart = null; pinchStartDistance = 0; pinchStartView = null;
    stage.replaceChildren(document.createTextNode(f.ready));
  }

  function errorText(code) {
    return ({ binary: f.binary, geometryTooLarge: f.geometryTooLarge, empty: f.empty, unsupported: f.unsupported, tooLarge: f.tooLarge, renderUnsupported: f.renderUnsupported })[code] ?? f.invalid;
  }

  function updateViewBox() {
    if (svg && viewBox) svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
  }

  function zoomView(factor, anchor = null) {
    if (!viewBox) return;
    const x = anchor?.x ?? viewBox.x + viewBox.width / 2; const y = anchor?.y ?? viewBox.y + viewBox.height / 2;
    const ratioX = (x - viewBox.x) / viewBox.width; const ratioY = (y - viewBox.y) / viewBox.height;
    viewBox.width *= factor; viewBox.height *= factor;
    viewBox.x = x - ratioX * viewBox.width; viewBox.y = y - ratioY * viewBox.height; updateViewBox();
  }

  function panView(directionX, directionY) {
    if (!viewBox) return;
    viewBox.x += viewBox.width * directionX * 0.1; viewBox.y += viewBox.height * directionY * 0.1; updateViewBox();
  }

  function fitDrawing() {
    if (!model || !svg) return;
    const { minX, minY, maxX, maxY } = model.bounds;
    const width = Math.max(maxX - minX, 1e-6); const height = Math.max(maxY - minY, 1e-6);
    const pad = Math.max(width, height) * 0.04 || 1;
    viewBox = { x: minX - pad, y: minY - pad, width: width + 2 * pad, height: height + 2 * pad };
    updateViewBox();
  }

  function screenPoint(event, node = svg) {
    const point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    return point.matrixTransform(node.getScreenCTM().inverse());
  }

  function drawGeometry() {
    geometryGroup.replaceChildren();
    const { minY, maxY } = model.bounds;
    const flip = svgNode('g', { transform: `translate(0 ${minY + maxY}) scale(1 -1)` });
    const layerGroups = new Map();
    for (const layer of model.layers) {
      const group = svgNode('g', { 'data-dxf-layer': layer.name, 'stroke-width': Math.max(model.bounds.maxX - model.bounds.minX, model.bounds.maxY - model.bounds.minY) / 700, fill: 'none', stroke: '#185f89', 'vector-effect': 'non-scaling-stroke' });
      if (!layer.visible) group.setAttribute('display', 'none');
      layerGroups.set(layer.name, group); flip.append(group);
    }
    for (const entity of model.entities) {
      const group = layerGroups.get(entity.layer);
      if (!group) continue;
      if (entity.type === 'LINE') {
        const d = entity.points.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ');
        group.append(svgNode('path', { d }));
      } else if (entity.type === 'POLYLINE') {
        const commands = entity.points.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ');
        group.append(svgNode('path', { d: `${commands}${entity.closed ? ' Z' : ''}` }));
      } else if (entity.type === 'CIRCLE') {
        group.append(svgNode('circle', { cx: entity.center[0], cy: entity.center[1], r: entity.radius }));
      } else if (entity.type === 'ARC') {
        const [cx, cy] = entity.center;
        const start = [cx + Math.cos(entity.start) * entity.radius, cy + Math.sin(entity.start) * entity.radius];
        const endAngle = entity.start + entity.sweep;
        const end = [cx + Math.cos(endAngle) * entity.radius, cy + Math.sin(endAngle) * entity.radius];
        const large = entity.sweep > Math.PI ? 1 : 0;
        group.append(svgNode('path', { d: `M ${start[0]} ${start[1]} A ${entity.radius} ${entity.radius} 0 ${large} 0 ${end[0]} ${end[1]}` }));
      }
    }
    geometryGroup.append(flip);
  }

  function showModel(data, file) {
    model = { ...data, fileName: file.name };
    svg = svgNode('svg', { xmlns: 'http://www.w3.org/2000/svg', role: 'img', 'aria-label': f.drawing, preserveAspectRatio: 'xMidYMid meet' });
    svg.style.width = '100%'; svg.style.height = 'min(65vh, 620px)'; svg.style.display = 'block'; svg.style.background = '#fff'; svg.style.touchAction = 'none';
    geometryGroup = svgNode('g'); svg.append(geometryGroup); drawGeometry();
    stage.replaceChildren(svg); fitDrawing();
    info.hidden = false;
    const unit = model.unit ? f.units[String(model.unitCode)] ?? model.unit : f.unitless;
    appendMeta(f.unit, unit);
    appendMeta(f.bounds, `${fmt(model.bounds.minX)}, ${fmt(model.bounds.minY)} — ${fmt(model.bounds.maxX)}, ${fmt(model.bounds.maxY)} ${unit}`);
    appendMeta(f.width, `${fmt(model.bounds.maxX - model.bounds.minX)} ${unit}`);
    appendMeta(f.height, `${fmt(model.bounds.maxY - model.bounds.minY)} ${unit}`);
    appendMeta(f.entities, fmt(model.totalEntities)); appendMeta(f.supportedEntities, fmt(model.shownEntities));
    const unsupportedCount = Object.values(model.unsupportedCounts).reduce((sum, count) => sum + count, 0);
    appendMeta(f.unsupportedEntities, fmt(unsupportedCount));
    const layerRoot = q('[data-dxf-layers]');
    q('[data-dxf-no-layers]').hidden = model.layers.length > 0;
    for (const layer of model.layers) {
      const label = document.createElement('label'); label.className = 'dxf-layer';
      const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = layer.visible; checkbox.setAttribute('aria-label', `${f.layer}: ${layer.name}`);
      const name = document.createElement('span'); name.textContent = layer.name;
      checkbox.addEventListener('change', () => {
        const target = [...svg.querySelectorAll('[data-dxf-layer]')].find((group) => group.getAttribute('data-dxf-layer') === layer.name);
        if (target) target.setAttribute('display', checkbox.checked ? 'inline' : 'none');
      });
      label.append(checkbox, name); layerRoot.append(label);
    }
    const unsupportedList = q('[data-dxf-unsupported]');
    const unsupportedEntries = Object.entries(model.unsupportedCounts).sort(([a], [b]) => a.localeCompare(b));
    if (unsupportedEntries.length) for (const [type, count] of unsupportedEntries) {
      const item = document.createElement('li'); item.textContent = `${type}: ${fmt(count)}`; unsupportedList.append(item);
    }
    else { const item = document.createElement('li'); item.textContent = '—'; unsupportedList.append(item); }
    for (const button of root.querySelectorAll('[data-dxf-fit], [data-dxf-zoom], [data-dxf-measure], [data-dxf-svg], [data-dxf-png], [data-dxf-clear]')) button.disabled = false;
    q('[data-dxf-cancel]').hidden = true; q('[data-dxf-measure-help]').hidden = true;
    setStatus(f.loaded);
  }

  function beginLoad(file) {
    clearModel();
    if (file.size > 10 * 1024 * 1024) { setStatus(f.tooLarge, true); return; }
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (extension !== '.dxf') { setStatus(f.unsupported, true); return; }
    setStatus(f.parsing); q('[data-dxf-cancel]').hidden = false;
    const thisRequest = ++request;
    void file.arrayBuffer().then((buffer) => {
      if (thisRequest !== request) return;
      worker = new Worker(new URL('./dxf-viewer-worker.mjs', import.meta.url), { type: 'module' });
      worker.onmessage = ({ data }) => {
        if (thisRequest !== request) return;
        worker?.terminate(); worker = null;
        if (!data.ok) { q('[data-dxf-cancel]').hidden = true; setStatus(errorText(data.error), true); return; }
        try { showModel(data, file); }
        catch { q('[data-dxf-cancel]').hidden = true; setStatus(f.renderUnsupported, true); }
      };
      worker.onerror = () => {
        if (thisRequest !== request) return;
        worker?.terminate(); worker = null; q('[data-dxf-cancel]').hidden = true; setStatus(f.invalid, true);
      };
      worker.postMessage({ buffer }, [buffer]);
    }).catch(() => { if (thisRequest === request) { q('[data-dxf-cancel]').hidden = true; setStatus(f.invalid, true); } });
  }

  function coordinateFromEvent(event) {
    const point = screenPoint(event, geometryGroup.firstElementChild);
    return [point.x, point.y];
  }

  function displayMeasurement(a, b) {
    geometryGroup?.querySelectorAll('[data-dxf-measurement]').forEach((overlay) => overlay.remove());
    const distance = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const unit = model.unit ? f.units[String(model.unitCode)] ?? model.unit : f.unitless;
    measure.replaceChildren(); measure.textContent = `${f.measurementResult}: ${fmt(distance)} ${unit}`; measure.hidden = false;
    q('[data-dxf-clear-measure]').hidden = false;
    const layer = svgNode('g', { 'data-dxf-measurement': '', stroke: '#b13b20', 'stroke-width': Math.max(viewBox.width, viewBox.height) / 500, fill: 'none' });
    layer.append(svgNode('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }));
    layer.append(svgNode('circle', { cx: a[0], cy: a[1], r: Math.max(viewBox.width, viewBox.height) / 160 }));
    layer.append(svgNode('circle', { cx: b[0], cy: b[1], r: Math.max(viewBox.width, viewBox.height) / 160 }));
    geometryGroup.firstElementChild.append(layer);
  }

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) { clearModel(); setStatus(f.ready); return; }
    beginLoad(file);
  });
  q('[data-dxf-cancel]').addEventListener('click', () => { clearModel(); fileInput.value = ''; setStatus(f.cancelled); });
  q('[data-dxf-clear]').addEventListener('click', () => { clearModel(); fileInput.value = ''; setStatus(f.ready); });
  q('[data-dxf-fit]').addEventListener('click', fitDrawing);
  root.querySelectorAll('[data-dxf-zoom]').forEach((button) => button.addEventListener('click', () => zoomView(button.dataset.dxfZoom === 'in' ? 0.8 : 1.25)));
  q('[data-dxf-measure]').addEventListener('click', () => {
    measureMode = true; firstMeasurePoint = null; q('[data-dxf-measure-help]').hidden = false;
    setStatus(f.measureHelp);
  });
  q('[data-dxf-clear-measure]').addEventListener('click', () => {
    geometryGroup?.querySelector('[data-dxf-measurement]')?.remove(); firstMeasurePoint = null;
    measure.hidden = true; measure.replaceChildren(); q('[data-dxf-clear-measure]').hidden = true;
  });
  q('[data-dxf-coordinate-measure]').addEventListener('click', () => {
    const values = ['#dxf-x1', '#dxf-y1', '#dxf-x2', '#dxf-y2'].map((selector) => q(selector).value.trim());
    const coordinates = values.map(Number);
    if (values.some((value) => value === '') || coordinates.some((value) => !Number.isFinite(value))) { setStatus(f.invalidCoordinates, true); return; }
    displayMeasurement(coordinates.slice(0, 2), coordinates.slice(2, 4)); setStatus(f.loaded);
  });
  const serializeExport = () => {
    const exportSvg = svg.cloneNode(true); exportSvg.querySelector('[data-dxf-measurement]')?.remove();
    for (const layer of exportSvg.querySelectorAll('[data-dxf-layer]')) {
      if (layer.getAttribute('display') === 'none' || layer.childElementCount === 0) layer.remove();
      else layer.removeAttribute('display');
    }
    exportSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    exportSvg.setAttribute('width', String(Math.max(1, stage.clientWidth)));
    exportSvg.setAttribute('height', String(Math.max(1, stage.clientHeight)));
    exportSvg.removeAttribute('style');
    return new Blob([new XMLSerializer().serializeToString(exportSvg)], { type: 'image/svg+xml;charset=utf-8' });
  };
  q('[data-dxf-svg]').addEventListener('click', () => {
    if (!svg || !model) return;
    const blob = serializeExport();
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${safeName(model.fileName)}.svg`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  q('[data-dxf-png]').addEventListener('click', async () => {
    if (!svg || !model) return;
    let imageUrl = null;
    try {
      const blob = serializeExport();
      imageUrl = URL.createObjectURL(blob);
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = imageUrl;
      });
      const canvas = document.createElement('canvas'); const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(stage.clientWidth * ratio)); canvas.height = Math.max(1, Math.round(stage.clientHeight * ratio));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('canvas unavailable');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const png = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!png) { setStatus(f.pngUnavailable, true); return; }
      const url = URL.createObjectURL(png); const link = document.createElement('a'); link.href = url; link.download = `${safeName(model.fileName)}.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setStatus(f.pngUnavailable, true); }
    finally { if (imageUrl) URL.revokeObjectURL(imageUrl); }
  });
  stage.addEventListener('pointerdown', (event) => {
    if (!svg || measureMode) return;
    stage.setPointerCapture(event.pointerId); pointerMap.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointerMap.size === 1) { pointerStart = screenPoint(event); dragStarted = false; }
    else if (pointerMap.size === 2 && viewBox) {
      const [a, b] = [...pointerMap.values()]; pinchStartDistance = Math.hypot(a.x - b.x, a.y - b.y); pinchStartView = { ...viewBox }; pointerStart = null;
    }
  });
  stage.addEventListener('pointermove', (event) => {
    if (!pointerMap.has(event.pointerId) || !viewBox) return;
    pointerMap.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointerMap.size === 2 && pinchStartDistance > 0 && pinchStartView) {
      const [a, b] = [...pointerMap.values()]; const distance = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
      const ratio = Math.min(8, Math.max(0.125, pinchStartDistance / distance));
      const currentCenter = screenPoint({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      const centerX = pinchStartView.x + ((currentCenter.x - viewBox.x) / viewBox.width) * pinchStartView.width;
      const centerY = pinchStartView.y + ((currentCenter.y - viewBox.y) / viewBox.height) * pinchStartView.height;
      const anchorX = (centerX - pinchStartView.x) / pinchStartView.width; const anchorY = (centerY - pinchStartView.y) / pinchStartView.height;
      viewBox.width = pinchStartView.width * ratio; viewBox.height = pinchStartView.height * ratio;
      viewBox.x = centerX - anchorX * viewBox.width; viewBox.y = centerY - anchorY * viewBox.height; updateViewBox(); return;
    }
    if (!pointerStart || pointerMap.size > 1) return;
    const current = screenPoint(event); const dx = current.x - pointerStart.x; const dy = current.y - pointerStart.y;
    if (Math.hypot(dx, dy) > 1) dragStarted = true;
    if (dragStarted) { viewBox.x -= dx; viewBox.y -= dy; updateViewBox(); pointerStart = current; }
  });
  stage.addEventListener('pointerup', (event) => {
    pointerMap.delete(event.pointerId); pointerStart = null; pinchStartDistance = 0; pinchStartView = null;
  });
  stage.addEventListener('click', (event) => {
    if (!measureMode || !geometryGroup) return;
    const point = coordinateFromEvent(event);
    if (!firstMeasurePoint) { firstMeasurePoint = point; return; }
    displayMeasurement(firstMeasurePoint, point); measureMode = false; q('[data-dxf-measure-help]').hidden = true; setStatus(f.loaded);
  });
  stage.addEventListener('wheel', (event) => {
    if (!svg || !viewBox) return;
    event.preventDefault();
    zoomView(event.deltaY < 0 ? 0.85 : 1.18, screenPoint(event));
  }, { passive: false });
  stage.addEventListener('keydown', (event) => {
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomView(0.8); }
    else if (event.key === '-' || event.key === '_') { event.preventDefault(); zoomView(1.25); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); panView(-1, 0); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); panView(1, 0); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); panView(0, -1); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); panView(0, 1); }
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && measureMode) { measureMode = false; firstMeasurePoint = null; q('[data-dxf-measure-help]').hidden = true; setStatus(f.loaded); }
  });
  window.addEventListener('pagehide', clearModel, { once: true });
}
