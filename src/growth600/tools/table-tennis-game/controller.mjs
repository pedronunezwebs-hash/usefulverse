import { TABLE_HEIGHT, TABLE_WIDTH, moveTableTennisPaddle, newTableTennisGame, stepTableTennisGame } from './logic.mjs';

const root = document.querySelector('[data-tool="table-tennis-game"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  let state = null; let frame = 0; let lastAnnouncement = '';
  const node = (tag, text, className) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = String(text); if (className) el.className = className; return el; };
  function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; }
  function draw(canvas, score, live, timestamp) {
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);
    ctx.fillStyle = '#165d49'; ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(TABLE_WIDTH / 2, 0); ctx.lineTo(TABLE_WIDTH / 2, TABLE_HEIGHT); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#fff'; ctx.fillRect(42, state.playerY - 41, 12, 82); ctx.fillRect(TABLE_WIDTH - 54, state.cpuY - 41, 12, 82);
    ctx.beginPath(); ctx.arc(state.ballX, state.ballY, 8, 0, Math.PI * 2); ctx.fill();
    score.textContent = `${state.playerScore} – ${state.cpuScore}`;
    const outcome = state.winner === 'player' ? copy.fields.youWin : state.winner === 'cpu' ? copy.fields.cpuWins : state.running ? copy.fields.playing : copy.fields.ready;
    const text = `${outcome} · ${copy.fields.rally}: ${state.rally}`;
    if (text !== lastAnnouncement && (state.winner || timestamp % 60 < 16)) { live.textContent = text; lastAnnouncement = text; }
  }
  function tick(canvas, score, live, timestamp) { state = stepTableTennisGame(state); draw(canvas, score, live, timestamp); if (state.running) frame = requestAnimationFrame((time) => tick(canvas, score, live, time)); else { frame = 0; status.textContent = state.winner === 'player' ? copy.messages.complete : copy.fields.cpuWins; } }
  function start() {
    stop(); state = newTableTennisGame(); lastAnnouncement = ''; content.replaceChildren();
    const score = node('p', undefined, 'pending-tt-score'); score.setAttribute('aria-label', copy.fields.score);
    const canvas = document.createElement('canvas'); canvas.width = TABLE_WIDTH; canvas.height = TABLE_HEIGHT; canvas.tabIndex = 0; canvas.setAttribute('role', 'application'); canvas.setAttribute('aria-label', copy.fields.canvasLabel); canvas.style.width = '100%'; canvas.style.height = 'auto'; canvas.style.maxWidth = '720px'; canvas.style.borderRadius = '12px';
    const live = node('p', copy.fields.ready, 'hint'); live.setAttribute('aria-live', 'polite');
    const controls = node('div', undefined, 'actions');
    for (const [direction, label] of [[-1, copy.fields.moveUp], [1, copy.fields.moveDown]]) { const button = node('button', label, 'button button--secondary'); button.type = 'button'; button.addEventListener('click', () => { state = moveTableTennisPaddle(state, direction); }); controls.append(button); }
    canvas.addEventListener('keydown', (event) => { const direction = ['ArrowUp','w','W'].includes(event.key) ? -1 : ['ArrowDown','s','S'].includes(event.key) ? 1 : 0; if (direction) { event.preventDefault(); state = moveTableTennisPaddle(state, direction); } });
    content.append(score, canvas, live, controls); result.hidden = false; status.textContent = copy.fields.instructions; canvas.focus(); frame = requestAnimationFrame((time) => tick(canvas, score, live, time));
  }
  form.addEventListener('submit', (event) => { event.preventDefault(); start(); });
  form.addEventListener('reset', () => queueMicrotask(() => { stop(); state = null; content.replaceChildren(); result.hidden = true; status.textContent = ''; }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (state?.running && !frame) { const canvas = content.querySelector('canvas'); const score = content.querySelector('.pending-tt-score'); const live = content.querySelector('[aria-live="polite"]'); if (canvas && score && live) frame = requestAnimationFrame((time) => tick(canvas, score, live, time)); } });
}
