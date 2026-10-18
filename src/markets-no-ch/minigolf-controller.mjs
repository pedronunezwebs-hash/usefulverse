import { GOLF_COURT, aimGolf, createGolfState, formatCourseCode, nextGolfHole, normalizeCourseCode, puttGolf, resetGolfHole, tickGolf, undoGolfStroke } from './minigolf.mjs';

const SAVE_KEY = 'usefulverse.minigolf.best.v1';

export function mountMinigolf(root, copy, storage = globalThis.localStorage) {
  const q = (selector) => root.querySelector(selector);
  const canvas = q('[data-golf-canvas]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return () => {};
  const f = copy.fields;
  let seed = ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) || 1;
  let saved = null;
  try { const value = Number(storage.getItem(SAVE_KEY)); if (Number.isFinite(value) && value >= 9) saved = Math.floor(value); } catch {}
  let state = createGolfState({ seed, best: saved ?? Infinity });
  let frame = 0;
  let last = 0;
  let disposed = false;
  let audio;

  function say(message) { q('[data-golf-status]').textContent = message; }
  function sound(freq) {
    if (!q('[data-golf-sound]').checked) return;
    try {
      const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AudioContext) return;
      audio ??= new AudioContext(); void audio.resume();
      const oscillator = audio.createOscillator(); const gain = audio.createGain();
      oscillator.frequency.value = freq; gain.gain.setValueAtTime(0.035, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.08);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + 0.08);
    } catch {}
  }
  function currentHole() { return state.course[state.holeIndex]; }
  function draw() {
    ctx.clearRect(0, 0, GOLF_COURT.width, GOLF_COURT.height);
    ctx.fillStyle = '#1c6b50'; ctx.fillRect(0, 0, GOLF_COURT.width, GOLF_COURT.height);
    ctx.fillStyle = '#277d5d';
    for (let y = 20; y < GOLF_COURT.height; y += 38) for (let x = (y / 38 % 2) ? 18 : 0; x < GOLF_COURT.width; x += 36) ctx.fillRect(x, y, 18, 18);
    const hole = currentHole();
    for (const water of hole.water) {
      ctx.fillStyle = '#43b6cc'; ctx.beginPath(); ctx.roundRect(water.x, water.y, water.width, water.height, 14); ctx.fill();
      ctx.strokeStyle = '#a9eff5'; ctx.lineWidth = 2; ctx.stroke();
    }
    for (const bumper of hole.bumpers) {
      ctx.fillStyle = '#d6c49c'; ctx.beginPath(); ctx.arc(bumper.x, bumper.y, bumper.radius + 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#6b4e33'; ctx.beginPath(); ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#101820'; ctx.beginPath(); ctx.arc(hole.cup[0], hole.cup[1], GOLF_COURT.holeRadius, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hole.cup[0], hole.cup[1]); ctx.lineTo(hole.cup[0], hole.cup[1] - 45); ctx.stroke();
    ctx.fillStyle = '#f06b54'; ctx.beginPath(); ctx.moveTo(hole.cup[0], hole.cup[1] - 45); ctx.lineTo(hole.cup[0] + 24, hole.cup[1] - 38); ctx.lineTo(hole.cup[0], hole.cup[1] - 30); ctx.fill();
    ctx.fillStyle = '#e8f08d'; ctx.beginPath(); ctx.arc(hole.tee[0], hole.tee[1], 5, 0, Math.PI * 2); ctx.fill();
    if (state.status === 'aiming') {
      const length = 22 + state.power * 6;
      ctx.setLineDash([5, 5]); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(state.ball.x, state.ball.y); ctx.lineTo(state.ball.x + Math.cos(state.angle) * length, state.ball.y + Math.sin(state.angle) * length); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.fillStyle = '#f8f5e9'; ctx.beginPath(); ctx.arc(state.ball.x, state.ball.y, GOLF_COURT.radius, 0, Math.PI * 2); ctx.fill();
    q('[data-golf-hole]').textContent = String(state.holeIndex + 1);
    q('[data-golf-par]').textContent = String(hole.par);
    q('[data-golf-strokes]').textContent = String(state.strokes);
    q('[data-golf-total]').textContent = String(state.scorecard.reduce((sum, value) => sum + (value ?? 0), state.strokes));
    q('[data-golf-best]').textContent = saved === null ? '—' : String(saved);
    q('[data-golf-code]').textContent = formatCourseCode(state.seed);
    q('[data-golf-power-output]').textContent = String(state.power);
    q('[data-golf-undo]').disabled = !state.lastStroke || state.status === 'rolling';
    q('[data-golf-next]').hidden = state.status !== 'holeComplete';
    q('[data-golf-new]').disabled = state.status === 'rolling';
    const scorecard = q('[data-golf-scorecard]');
    scorecard.innerHTML = state.scorecard.map((score, index) => `<span class="golf-card-cell"${index === state.holeIndex ? ' aria-current="step"' : ''}>${index + 1}: ${score ?? '–'}</span>`).join('');
  }
  function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; }
  function animate(time) {
    if (disposed || state.status !== 'rolling' || document.hidden) { stop(); return; }
    const elapsed = last ? Math.min(0.05, (time - last) / 1000) : 0; last = time;
    const previous = state.status;
    state = tickGolf(state, elapsed);
    draw();
    if (previous === 'rolling' && state.status !== 'rolling') {
      if (state.status === 'holeComplete') { say(f.holeDone); sound(650); }
      else if (state.status === 'roundComplete') { say(f.roundDone); sound(760); }
      else say(f.stopped);
    }
    if (state.status === 'rolling') frame = requestAnimationFrame(animate);
  }
  function startAnimation() { stop(); frame = requestAnimationFrame(animate); }
  function doPutt() {
    const before = state.strokes; state = puttGolf(state);
    if (state.strokes > before) { say(f.rolling); sound(360); startAnimation(); draw(); }
  }
  function newCourse(nextSeed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) {
    stop(); seed = nextSeed || 1; state = createGolfState({ seed, best: saved ?? Infinity });
    say(f.ready); draw();
  }
  function setAimFromPointer(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * GOLF_COURT.width / rect.width;
    const y = (event.clientY - rect.top) * GOLF_COURT.height / rect.height;
    state = aimGolf(state, Math.atan2(y - state.ball.y, x - state.ball.x)); draw();
  }
  q('[data-golf-putt]').addEventListener('click', doPutt);
  q('[data-golf-new]').addEventListener('click', () => newCourse());
  q('[data-golf-power]').addEventListener('input', (event) => { state = aimGolf(state, state.angle, Number(event.target.value)); draw(); });
  q('[data-golf-angle-minus]').addEventListener('click', () => { state = aimGolf(state, state.angle - Math.PI / 12); draw(); });
  q('[data-golf-angle-plus]').addEventListener('click', () => { state = aimGolf(state, state.angle + Math.PI / 12); draw(); });
  canvas.addEventListener('pointerdown', setAimFromPointer);
  canvas.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); state = aimGolf(state, state.angle + (event.key === 'ArrowLeft' ? -1 : 1) * Math.PI / 36); draw(); }
    else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); state = aimGolf(state, state.angle, state.power + (event.key === 'ArrowUp' ? 1 : -1)); q('[data-golf-power]').value = String(state.power); draw(); }
    else if (event.code === 'Space' || event.key === 'Enter') { event.preventDefault(); doPutt(); }
  });
  q('[data-golf-undo]').addEventListener('click', () => { state = undoGolfStroke(state); say(f.undone); draw(); });
  q('[data-golf-reset]').addEventListener('click', () => { stop(); state = resetGolfHole(state); say(f.reset); draw(); });
  q('[data-golf-next]').addEventListener('click', () => { state = nextGolfHole(state); say(f.ready); draw(); });
  q('[data-golf-code-copy]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(formatCourseCode(state.seed)); say(f.codeCopied); }
    catch { say(f.codeCopyHelp); }
  });
  q('[data-golf-code-load]').addEventListener('click', () => {
    const code = normalizeCourseCode(q('[data-golf-code-input]').value);
    if (code === null) { say(f.codeInvalid); return; }
    newCourse(code);
  });
  q('[data-golf-save]').addEventListener('click', () => {
    if (state.status !== 'roundComplete') { say(f.saveAfterRound); return; }
    const total = state.scorecard.reduce((sum, value) => sum + (value ?? 0), 0);
    try { saved = Math.min(saved ?? Infinity, total); storage.setItem(SAVE_KEY, String(saved)); say(f.saved); } catch { say(f.saveFailed); }
    draw();
  });
  q('[data-golf-delete]').addEventListener('click', () => {
    try { storage.removeItem(SAVE_KEY); saved = null; say(f.deleted); } catch { say(f.saveFailed); }
    draw();
  });
  const onVisibility = () => { if (!document.hidden && state.status === 'rolling') startAnimation(); else if (document.hidden) stop(); };
  document.addEventListener('visibilitychange', onVisibility);
  draw();
  return () => { disposed = true; stop(); document.removeEventListener('visibilitychange', onVisibility); try { audio?.close(); } catch {} };
}

const root = document.querySelector('[data-mini-golf]');
if (root) mountMinigolf(root, JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}'));
