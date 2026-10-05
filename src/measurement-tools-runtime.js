import { angleBetweenRays, calibrateRuler, protractorPoint, rulerDistance } from './measurement-tools-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const numberFormat = new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 2 });

function ruler(root) {
  const start = $('[data-ruler-start]', root); const end = $('[data-ruler-end]', root);
  const referencePixels = $('[data-ruler-calibration-px]', root); const referenceMillimeters = $('[data-ruler-calibration-mm]', root);
  const output = $('[data-ruler-output]', root); const startMarker = $('[data-ruler-start-marker]', root); const endMarker = $('[data-ruler-end-marker]', root);
  const messages = JSON.parse(root.dataset.plannerMessages || '{}'); const say = (key) => messages[key] ?? key;
  const render = () => {
    const a = Number(start.value); const b = Number(end.value); const distance = rulerDistance(a, b);
    startMarker.setAttribute('x1', String(30 + a)); startMarker.setAttribute('x2', String(30 + a));
    endMarker.setAttribute('x1', String(30 + b)); endMarker.setAttribute('x2', String(30 + b));
    let result = `${say('Measured length')}: ${numberFormat.format(distance)} ${say('Uncalibrated CSS pixels')}`;
    const px = Number(referencePixels.value); const mm = Number(referenceMillimeters.value);
    if (referencePixels.value && referenceMillimeters.value && Number.isFinite(px) && Number.isFinite(mm) && px > 0 && mm > 0) {
      const physical = calibrateRuler(distance, px, mm);
      result += ` · ${numberFormat.format(physical.millimeters)} ${say('mm')} · ${numberFormat.format(physical.inches)} ${say('in')}`;
    }
    output.textContent = result;
  };
  root.addEventListener('input', (event) => {
    if (event.target.matches('[data-ruler-start], [data-ruler-end], [data-ruler-calibration-px], [data-ruler-calibration-mm]')) render();
  });
  $('[data-ruler-clear-calibration]', root).addEventListener('click', () => { referencePixels.value = ''; referenceMillimeters.value = ''; render(); });
  render();
}

function protractor(root) {
  const controls = [...root.querySelectorAll('[data-protractor-angle]')]; const rays = [...root.querySelectorAll('[data-protractor-ray]')];
  const handles = [...root.querySelectorAll('[data-protractor-handle]')]; const output = $('[data-protractor-output]', root);
  const svg = $('.digital-protractor__face', root); const messages = JSON.parse(root.dataset.plannerMessages || '{}'); const say = (key) => messages[key] ?? key;
  const render = () => {
    const values = controls.map((control) => Number(control.value));
    values.forEach((angle, index) => {
      const point = protractorPoint(angle);
      rays[index].setAttribute('x2', point.x.toFixed(2)); rays[index].setAttribute('y2', point.y.toFixed(2));
      handles[index].setAttribute('cx', point.x.toFixed(2)); handles[index].setAttribute('cy', point.y.toFixed(2));
      handles[index].setAttribute('aria-valuenow', String(angle));
    });
    output.textContent = `${say('Angle')}: ${numberFormat.format(angleBetweenRays(values[0], values[1]))} ${say('degrees')}`;
  };
  const setAngle = (index, value) => { controls[index].value = String(Math.max(0, Math.min(180, Math.round(value)))); render(); };
  controls.forEach((control, index) => control.addEventListener('input', render));
  handles.forEach((handle, index) => {
    handle.addEventListener('keydown', (event) => {
      const delta = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 0;
      if (delta) { event.preventDefault(); setAngle(index, Number(controls[index].value) + delta * (event.shiftKey ? 5 : 1)); }
      else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); setAngle(index, event.key === 'Home' ? 0 : 180); }
    });
    handle.addEventListener('pointerdown', (event) => { handle.setPointerCapture(event.pointerId); handle.dataset.dragging = 'true'; event.preventDefault(); });
    handle.addEventListener('pointermove', (event) => {
      if (handle.dataset.dragging !== 'true') return;
      const rect = svg.getBoundingClientRect(); const x = (event.clientX - rect.left) * 320 / rect.width; const y = (event.clientY - rect.top) * 190 / rect.height;
      const radians = Math.atan2(160 - y, x - 160);
      setAngle(index, Math.max(0, Math.min(180, radians * 180 / Math.PI)));
    });
    const stopDragging = () => { delete handle.dataset.dragging; };
    handle.addEventListener('pointerup', stopDragging); handle.addEventListener('pointercancel', stopDragging); handle.addEventListener('lostpointercapture', stopDragging);
  });
  $('[data-protractor-reset]', root).addEventListener('click', () => { controls[0].value = '30'; controls[1].value = '120'; render(); });
  render();
}

export function setupMeasurementTool(id, root) {
  if (id === 'screen-ruler') ruler(root);
  else if (id === 'protractor') protractor(root);
}
