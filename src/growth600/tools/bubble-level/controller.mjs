import { normalizeTilt, orientationTilt, bubblePosition } from './logic.mjs';

const root = document.querySelector('[data-tool="bubble-level"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const fields = copy.fields;
  let angle = 0, offset = 0, handler = null, frame = 0;
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = String(text);
    if (className) element.className = className;
    return element;
  };
  function stop() {
    if (handler) window.removeEventListener('deviceorientation', handler);
    handler = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }
  function paint() {
    content.replaceChildren();
    const axis = form.elements.namedItem('axis').value;
    const position = bubblePosition(angle, axis);
    const level = node('div', undefined, 'pending-level');
    level.setAttribute('role', 'img');
    level.setAttribute('aria-label', `${fields.tilt}: ${angle.toFixed(1)}°`);
    const rail = node('div', undefined, 'pending-level__rail');
    const bubble = node('span', undefined, 'pending-level__bubble');
    bubble.style.transform = `translate(${position.x * 40}%, ${position.y * 40}%)`;
    rail.append(bubble);
    level.append(rail);
    content.append(level, node('p', `${fields.tilt}: ${angle.toFixed(1)}°`));
    const controls = node('div', undefined, 'pending-level-controls');
    const sensor = node('button', fields.useSensor, 'button button--secondary');
    sensor.type = 'button';
    sensor.addEventListener('click', async () => {
      try {
        if (typeof DeviceOrientationEvent === 'undefined') throw new Error(copy.messages.unsupported);
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission !== 'granted') throw new Error(copy.messages.denied);
        }
        stop();
        handler = (event) => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            try {
              angle = normalizeTilt(orientationTilt(event, form.elements.namedItem('axis').value) - offset);
              form.elements.namedItem('angle').value = angle.toFixed(1);
              paint();
            } catch {}
          });
        };
        window.addEventListener('deviceorientation', handler);
        status.textContent = copy.messages.sensor;
        status.classList.remove('status--error');
      } catch (error) {
        status.textContent = error.message;
        status.classList.add('status--error');
      }
    });
    controls.append(sensor);
    const calibrate = node('button', fields.calibrate, 'button button--secondary');
    calibrate.type = 'button';
    calibrate.addEventListener('click', () => { offset += angle; angle = 0; paint(); status.textContent = copy.messages.calibrated; });
    controls.append(calibrate);
    const stopButton = node('button', fields.stopSensor, 'button button--secondary');
    stopButton.type = 'button';
    stopButton.addEventListener('click', () => { stop(); status.textContent = copy.messages.stopped; });
    controls.append(stopButton);
    content.append(controls);
    result.hidden = false;
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      stop();
      angle = normalizeTilt(form.elements.namedItem('angle').value);
      offset = 0;
      status.textContent = copy.messages.manual;
      status.classList.remove('status--error');
      paint();
    } catch (error) {
      status.textContent = error.message;
      status.classList.add('status--error');
      result.hidden = false;
    }
  });
  form.elements.namedItem('axis').addEventListener('change', () => { offset = 0; paint(); });
  form.addEventListener('reset', () => queueMicrotask(() => {
    stop(); angle = 0; offset = 0; content.replaceChildren(); result.hidden = true;
    status.textContent = ''; status.classList.remove('status--error');
  }));
  window.addEventListener('pagehide', stop, { once: true });
  paint();
}
