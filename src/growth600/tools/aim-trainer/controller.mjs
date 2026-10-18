import { AIM_TRAINER_TARGET_DIAMETERS, createAimSession, finishAimSession, getAimAccuracy, placeAimTarget, recordAimAttempt } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="aim-trainer"]');
if (root) {
  const copy = readToolCopy(root);
  const area = root.querySelector('[data-area]');
  const target = root.querySelector('[data-target]');
  const duration = root.querySelector('[data-duration]');
  const targetSize = root.querySelector('[data-target-size]');
  let session;
  let deadline = 0;
  let timer = 0;

  function render() {
    root.querySelector('[data-time]').textContent = String(Math.max(0, Math.ceil((deadline - performance.now()) / 1000)) || (session.status === 'ready' ? Number(duration.value) : 0));
    root.querySelector('[data-hits]').textContent = String(session.hits);
    root.querySelector('[data-misses]').textContent = String(session.misses);
    root.querySelector('[data-accuracy]').textContent = `${getAimAccuracy(session)}%`;
    const running = session.status === 'running';
    root.querySelector('[data-action="start"]').disabled = running;
    duration.disabled = running;
    targetSize.disabled = running;
    area.setAttribute('aria-disabled', String(!running));
    target.hidden = !running;
  }

  function moveTarget() {
    const width = area.clientWidth;
    const height = area.clientHeight;
    const diameter = Math.min(AIM_TRAINER_TARGET_DIAMETERS[targetSize.value], width, height);
    if (!width || !height || !diameter) { target.hidden = true; return; }
    const position = placeAimTarget({ width, height, diameter });
    target.style.width = `${diameter}px`;
    target.style.height = `${diameter}px`;
    target.style.left = `${position.x}px`;
    target.style.top = `${position.y}px`;
    target.hidden = false;
  }

  function endRound() {
    if (timer) window.clearInterval(timer);
    timer = 0;
    session = finishAimSession(session);
    render();
    announce(root, copy.messages.finished, 'success');
  }

  function startRound() {
    if (timer) window.clearInterval(timer);
    session = createAimSession({ durationSeconds: Number(duration.value), diameter: AIM_TRAINER_TARGET_DIAMETERS[targetSize.value] });
    session = Object.freeze({ ...session, status: 'running' });
    deadline = performance.now() + session.durationSeconds * 1000;
    moveTarget();
    render();
    announce(root, copy.messages.starting);
    timer = window.setInterval(() => {
      if (performance.now() >= deadline) endRound();
      else render();
    }, 100);
  }

  area.addEventListener('click', (event) => {
    if (session.status !== 'running') return;
    const hit = event.target.closest('[data-target]') === target;
    session = recordAimAttempt(session, hit);
    moveTarget();
    render();
    announce(root, hit ? copy.messages.hit : copy.messages.miss);
  });
  root.querySelector('[data-action="start"]').addEventListener('click', startRound);
  root.querySelector('[data-action="restart"]').addEventListener('click', startRound);
  session = createAimSession();
  deadline = performance.now() + session.durationSeconds * 1000;
  render();
  announce(root, copy.messages.ready);
}
