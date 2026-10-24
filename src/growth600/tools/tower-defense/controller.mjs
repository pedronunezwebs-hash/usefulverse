import { createTowerDefense, placeDefenseTower, positionOnDefensePath, stepTowerDefense, TD_BOARD, TD_PATH, TD_TOWERS } from './logic.mjs';

const root = document.querySelector('[data-tool="tower-defense"]');
if (root) {
  const form = root.querySelector('[data-pending-form]'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}'); const { fields: f, messages: m } = copy;
  const make = (tag, text, cls) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = String(text); if (cls) el.className = cls; return el; };
  let game = null; let canvas = null; let ctx = null; let raf = 0; let previous = 0; let cursor = { x: 0, y: 0 };
  function summary() {
    const output = content.querySelector('[data-td-summary]');
    if (output && game) output.textContent = `${f.money}: ${game.money} · ${f.lives}: ${game.lives} · ${f.wave}: ${game.wave} · ${f.score}: ${game.score}`;
  }
  function draw() {
    const size = TD_BOARD.cell; ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#122033'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const point of TD_PATH) { ctx.fillStyle = '#766345'; ctx.fillRect(point.x * size + 2, point.y * size + 2, size - 4, size - 4); }
    ctx.strokeStyle = '#526075'; ctx.lineWidth = 1;
    for (let x = 0; x <= TD_BOARD.columns; x += 1) { ctx.beginPath(); ctx.moveTo(x * size, 0); ctx.lineTo(x * size, canvas.height); ctx.stroke(); }
    for (let y = 0; y <= TD_BOARD.rows; y += 1) { ctx.beginPath(); ctx.moveTo(0, y * size); ctx.lineTo(canvas.width, y * size); ctx.stroke(); }
    for (const tower of game.towers) {
      ctx.fillStyle = tower.type === 'rapid' ? '#51d7cb' : '#ffd166'; ctx.beginPath(); ctx.arc((tower.x + .5) * size, (tower.y + .5) * size, size * .27, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f7f7f7'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc((tower.x + .5) * size, (tower.y + .5) * size, size * .34, 0, Math.PI * 2); ctx.stroke();
    }
    for (const enemy of game.enemies) {
      const p = positionOnDefensePath(enemy.progress); const x = (p.x + .5) * size; const y = (p.y + .5) * size;
      ctx.fillStyle = '#ff647c'; ctx.beginPath(); ctx.arc(x, y, size * .2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#222'; ctx.fillRect(x - 12, y - 17, 24, 3); ctx.fillStyle = '#9af08f'; ctx.fillRect(x - 12, y - 17, 24 * Math.max(0, enemy.hp / enemy.maxHp), 3);
    }
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.strokeRect(cursor.x * size + 3, cursor.y * size + 3, size - 6, size - 6);
  }
  function place(x, y) {
    if (!game?.running) return;
    cursor = { x, y }; draw();
    const outcome = placeDefenseTower(game, x, y);
    if (!outcome.placed) {
      const messages = { outside: m.outside, path: m.path, occupied: m.occupied, funds: m.funds, limit: m.limit };
      status.textContent = messages[outcome.reason] ?? m.invalid; return;
    }
    cursor = { x, y }; status.textContent = m.placed; draw(); summary();
  }
  function pointer(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * TD_BOARD.columns);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * TD_BOARD.rows);
    cursor = { x: Math.max(0, Math.min(TD_BOARD.columns - 1, x)), y: Math.max(0, Math.min(TD_BOARD.rows - 1, y)) }; place(cursor.x, cursor.y);
  }
  function keydown(event) {
    if (event.target !== canvas || !game?.running || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') cursor.x = Math.max(0, cursor.x - 1);
    if (event.key === 'ArrowRight') cursor.x = Math.min(TD_BOARD.columns - 1, cursor.x + 1);
    if (event.key === 'ArrowUp') cursor.y = Math.max(0, cursor.y - 1);
    if (event.key === 'ArrowDown') cursor.y = Math.min(TD_BOARD.rows - 1, cursor.y + 1);
    if (event.key === 'Enter' || event.key === ' ') place(cursor.x, cursor.y); else draw();
  }
  function tick(time) {
    if (!game?.running || document.hidden) { raf = 0; previous = 0; return; }
    const dt = previous ? Math.min(.05, (time - previous) / 1000) : 0; previous = time;
    stepTowerDefense(game, dt); draw(); summary();
    if (game.running) raf = requestAnimationFrame(tick);
    else { status.textContent = game.lives > 0 && game.wave >= 10 ? m.victory : m.gameOver; }
  }
  function cleanup() { if (raf) cancelAnimationFrame(raf); raf = 0; document.removeEventListener('keydown', keydown); document.removeEventListener('visibilitychange', visibility); }
  function visibility() { if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; previous = 0; } else if (game?.running && !raf) { previous = 0; raf = requestAnimationFrame(tick); } }
  function start() {
    cleanup(); game = createTowerDefense(); cursor = { x: 0, y: 0 }; content.replaceChildren();
    const hud = make('p', '', 'pending-td-summary'); hud.dataset.tdSummary = 'true'; content.append(hud);
    const chooser = make('div', undefined, 'pending-td-chooser');
    for (const [type, key] of [['rapid','rapidTower'],['heavy','heavyTower']]) {
      const button = make('button', `${f[key]} (${f.cost}: ${TD_TOWERS[type].cost})`, 'button button--secondary'); button.type = 'button'; button.dataset.tower = type; button.setAttribute('aria-pressed', String(type === game.selectedTower)); if (type === game.selectedTower) button.classList.add('is-selected');
      button.addEventListener('click', () => { game.selectedTower = type; for (const option of chooser.querySelectorAll('[data-tower]')) { const selected = option.dataset.tower === type; option.setAttribute('aria-pressed', String(selected)); option.classList.toggle('is-selected', selected); } status.textContent = type === 'rapid' ? m.rapidSelected : m.heavySelected; }); chooser.append(button);
    }
    content.append(chooser);
    const help = make('p', f.instructions, 'hint'); content.append(help);
    canvas = make('canvas', undefined, 'pending-td-canvas'); canvas.width = TD_BOARD.columns * TD_BOARD.cell; canvas.height = TD_BOARD.rows * TD_BOARD.cell; canvas.tabIndex = 0; canvas.setAttribute('role','application'); canvas.setAttribute('aria-label', f.boardLabel); canvas.addEventListener('pointerdown', (event) => { canvas.focus(); pointer(event); }); ctx = canvas.getContext('2d');
    if (!ctx) { game.running = false; status.textContent = m.canvasUnavailable; status.classList.add('status--error'); result.hidden = false; return; }
    content.append(canvas); result.hidden = false; status.classList.remove('status--error'); status.textContent = m.started; summary(); draw();
    document.addEventListener('keydown', keydown); document.addEventListener('visibilitychange', visibility); raf = requestAnimationFrame(tick); canvas.focus();
  }
  form.addEventListener('submit', (event) => { event.preventDefault(); start(); });
  form.addEventListener('reset', () => queueMicrotask(() => { cleanup(); game = null; content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
