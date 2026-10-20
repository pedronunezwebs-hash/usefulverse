import { createSpaceGame, SPACE_GAME_SIZE, stepSpaceGame } from './logic.mjs';

const root = document.querySelector('[data-tool="space-shooter"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  let game = null; let canvas; let context; let frame = 0; let previousTime = 0;
  const input = { left: false, right: false, fire: false };
  const stars = Array.from({ length: 54 }, (_, index) => ({ x: (index * 83 + 29) % SPACE_GAME_SIZE.width, y: (index * 137 + 17) % SPACE_GAME_SIZE.height, size: index % 5 === 0 ? 2 : 1 }));
  const node = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };

  function updateSummary() {
    const summary = content.querySelector('[data-game-summary]');
    if (summary && game) summary.textContent = `${f.score}: ${game.score} · ${f.lives}: ${game.lives} · ${f.wave}: ${game.wave}`;
  }
  function draw() {
    const { width, height, playerY } = SPACE_GAME_SIZE;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#071426'; context.fillRect(0, 0, width, height);
    context.fillStyle = '#c9defa'; for (const star of stars) context.fillRect(star.x, (star.y + game.elapsed * (12 + star.size * 5)) % height, star.size, star.size);
    context.fillStyle = '#62d8ff';
    context.beginPath(); context.moveTo(game.playerX, playerY - 18); context.lineTo(game.playerX - 14, playerY + 12); context.lineTo(game.playerX + 14, playerY + 12); context.closePath(); context.fill();
    context.fillStyle = '#ffe17b'; for (const bullet of game.bullets) context.fillRect(bullet.x - 2, bullet.y - 7, 4, 14);
    context.fillStyle = '#ff6c7e'; for (const enemy of game.enemies) { context.beginPath(); context.moveTo(enemy.x, enemy.y - 13); context.lineTo(enemy.x + 14, enemy.y); context.lineTo(enemy.x, enemy.y + 13); context.lineTo(enemy.x - 14, enemy.y); context.closePath(); context.fill(); }
  }
  function tick(time) {
    if (!game?.running) return;
    if (document.hidden) { previousTime = time; frame = requestAnimationFrame(tick); return; }
    const dt = previousTime ? Math.min(0.05, (time - previousTime) / 1000) : 0;
    previousTime = time;
    stepSpaceGame(game, input, dt);
    draw(); updateSummary();
    if (game.running) frame = requestAnimationFrame(tick);
    else { status.textContent = `${copy.messages.gameOver} ${f.score}: ${game.score}`; status.classList.remove('status--error'); }
  }
  function setControl(name, value) { input[name] = value; }
  function stopGame() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; previousTime = 0; input.left = false; input.right = false; input.fire = false;
    document.removeEventListener('keydown', keydown); document.removeEventListener('keyup', keyup); document.removeEventListener('visibilitychange', visibility);
  }
  function keydown(event) {
    if (!game?.running) return;
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') { input.left = true; event.preventDefault(); }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') { input.right = true; event.preventDefault(); }
    if (event.code === 'Space') { input.fire = true; event.preventDefault(); }
  }
  function keyup(event) { if (event.code === 'ArrowLeft' || event.code === 'KeyA') input.left = false; if (event.code === 'ArrowRight' || event.code === 'KeyD') input.right = false; if (event.code === 'Space') input.fire = false; }
  function visibility() { if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; } else if (!document.hidden && game?.running && !frame) { previousTime = 0; frame = requestAnimationFrame(tick); } }
  function hold(button, key) {
    button.addEventListener('pointerdown', (event) => { event.preventDefault(); button.setPointerCapture?.(event.pointerId); setControl(key, true); });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave']) button.addEventListener(type, () => setControl(key, false));
  }
  function start() {
    stopGame(); game = createSpaceGame(); content.replaceChildren();
    const summary = node('p', '', 'pending-space-summary'); summary.dataset.gameSummary = 'true'; content.append(summary);
    canvas = node('canvas', undefined, 'pending-space-canvas'); canvas.width = SPACE_GAME_SIZE.width; canvas.height = SPACE_GAME_SIZE.height; canvas.tabIndex = 0; canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', f.canvasLabel); content.append(canvas);
    context = canvas.getContext('2d');
    if (!context) { game.running = false; status.textContent = copy.messages.canvasUnavailable; status.classList.add('status--error'); result.hidden = false; return; }
    const controls = node('div', undefined, 'pending-space-controls');
    for (const [key, label] of [['left', f.left], ['right', f.right], ['fire', f.fire]]) { const button = node('button', label, 'button button--secondary'); button.type = 'button'; button.setAttribute('aria-label', label); hold(button, key); controls.append(button); }
    content.append(controls); draw(); updateSummary(); result.hidden = false;
    status.textContent = copy.messages.started; status.classList.remove('status--error');
    canvas.focus(); document.addEventListener('keydown', keydown); document.addEventListener('keyup', keyup); document.addEventListener('visibilitychange', visibility);
    frame = requestAnimationFrame(tick);
  }
  form.addEventListener('submit', (event) => { event.preventDefault(); start(); });
  form.addEventListener('reset', () => queueMicrotask(() => { stopGame(); game = null; content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
  root.addEventListener('blur', () => { input.left = false; input.right = false; input.fire = false; }, true);
}
