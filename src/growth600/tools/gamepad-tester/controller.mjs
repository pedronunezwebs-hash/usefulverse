import { gamepadSnapshot } from '../pending-23/logic.mjs';

const root = document.querySelector('[data-tool="gamepad-tester"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const actions = form.querySelector('.actions');
  const stop = document.createElement('button'); stop.type = 'button'; stop.className = 'button button--secondary'; stop.textContent = copy.actions.stop; stop.hidden = true; actions.append(stop);
  content.setAttribute('aria-live', 'off');
  let frame = 0; let active = false; let lastConnected = -1;
  const announce = (message, kind = '') => { status.textContent = message; status.dataset.state = kind; };
  const getPads = () => Array.from(navigator.getGamepads?.() ?? []).filter(Boolean);
  const stopReading = (clear = false) => {
    active = false; if (frame) cancelAnimationFrame(frame); frame = 0; stop.hidden = true;
    if (clear) { content.replaceChildren(); result.hidden = true; announce(''); }
  };
  const row = (parent, label, value) => { const item = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = `${label}: `; const span = document.createElement('span'); span.textContent = String(value); item.append(strong, span); parent.append(item); };
  const renderPads = (pads, deadzone) => {
    const snapshots = gamepadSnapshot(pads, deadzone); content.replaceChildren();
    if (!snapshots.length) { const empty = document.createElement('p'); empty.textContent = copy.fields.noControllers; content.append(empty); return 0; }
    for (const pad of snapshots) {
      const section = document.createElement('section'); section.className = 'gamepad-tester__controller';
      const heading = document.createElement('h3'); heading.textContent = `${copy.fields.controller} ${pad.index + 1}`; section.append(heading);
      row(section, copy.fields.connected, pad.id); row(section, copy.fields.mapping, pad.mapping || '—');
      const buttonsHeading = document.createElement('h4'); buttonsHeading.textContent = copy.fields.button; section.append(buttonsHeading);
      const buttons = document.createElement('ul'); buttons.className = 'gamepad-tester__buttons';
      pad.buttons.forEach((button, index) => { const item = document.createElement('li'); item.textContent = `${copy.fields.button} ${index}: ${button.pressed ? copy.fields.pressed : copy.fields.released} · ${Math.round(button.value * 100)}%`; item.dataset.pressed = String(button.pressed); buttons.append(item); });
      section.append(buttons);
      const axesHeading = document.createElement('h4'); axesHeading.textContent = copy.fields.axis; section.append(axesHeading);
      const axes = document.createElement('ul'); axes.className = 'gamepad-tester__axes';
      pad.axes.forEach((value, index) => { const item = document.createElement('li'); const label = document.createElement('label'); label.textContent = `${copy.fields.axis} ${index}: ${value.toFixed(3)}`; const meter = document.createElement('meter'); meter.min = '-1'; meter.max = '1'; meter.value = String(value); meter.setAttribute('aria-label', label.textContent); item.append(label, meter); axes.append(item); });
      section.append(axes);
      const physical = pads.find((candidate) => candidate?.connected && candidate.index === pad.index);
      const actuator = physical?.vibrationActuator ?? physical?.hapticActuators?.[0];
      const vibration = document.createElement('button'); vibration.type = 'button'; vibration.className = 'button button--secondary'; vibration.textContent = copy.fields.testVibration;
      if (!actuator?.playEffect) { vibration.disabled = true; vibration.title = copy.fields.vibrationUnsupported; }
      else vibration.addEventListener('click', async () => {
        try { const response = await actuator.playEffect('dual-rumble', { duration: 150, strongMagnitude: 0.25, weakMagnitude: 0.25 }); announce(response === 'complete' ? copy.fields.vibrationDone : copy.messages.vibrationInterrupted, response === 'complete' ? 'success' : 'error'); }
        catch { announce(copy.fields.vibrationUnsupported, 'error'); }
      });
      section.append(vibration); content.append(section);
    }
    return snapshots.length;
  };
  const poll = () => {
    if (!active) return;
    try {
      const deadzone = Number(form.elements.namedItem('deadzone').value);
      const count = renderPads(getPads(), deadzone);
      if (count !== lastConnected) { lastConnected = count; announce(count ? `${copy.fields.connected}: ${count}` : copy.fields.noControllers, count ? 'success' : ''); }
    } catch { announce(copy.messages.error, 'error'); stopReading(); return; }
    frame = requestAnimationFrame(poll);
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault(); stopReading(); active = true; lastConnected = -1; stop.hidden = false; result.hidden = false; poll();
  });
  stop.addEventListener('click', () => { stopReading(); announce(copy.actions.stop); });
  form.elements.namedItem('deadzone').addEventListener('input', () => { if (active) { if (frame) cancelAnimationFrame(frame); frame = requestAnimationFrame(poll); } });
  form.addEventListener('reset', () => queueMicrotask(() => stopReading(true)));
  window.addEventListener('pagehide', () => stopReading(true), { once: true });
}
