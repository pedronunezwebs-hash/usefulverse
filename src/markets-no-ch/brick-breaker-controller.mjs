import { BRICK_FIELD, createBrickGame, launchBrickGame, movePaddle, nextBrickLevel, tickBrickGame } from './brick-breaker.mjs';

const SAVE_KEY = 'usefulverse.brick-breaker.best.v1';

export function mountBrickBreaker(root, copy, storage = globalThis.localStorage) {
  const q = (selector) => root.querySelector(selector);
  const canvas = q('[data-brick-canvas]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return () => {};
  const f = copy.fields;
  let saved = 0;
  try { saved = Math.max(0, Number(JSON.parse(storage.getItem(SAVE_KEY) ?? '0')) || 0); } catch {}
  let game = createBrickGame({ seed: (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0, best: saved });
  let frame = 0;
  let last = 0;
  let accumulator = 0;
  let audio = null;
  let disposed = false;
  const status = q('[data-brick-status]');
  const startButton = q('[data-brick-start]');
  const pauseButton = q('[data-brick-pause]');
  const nextButton = q('[data-brick-next]');

  function announce(message) { status.textContent = message; }
  function sound(frequency = 440) {
    if (game.muted || !audio) return;
    try {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.04, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.06);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + 0.06);
    } catch {}
  }
  function ensureAudio() {
    if (game.muted) return;
    try {
      const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (AudioContext) { audio ??= new AudioContext(); void audio.resume(); }
    } catch {}
  }
  function updateLabels() {
    q('[data-brick-score]').textContent = String(game.score);
    q('[data-brick-best]').textContent = String(Math.max(game.best, saved));
    q('[data-brick-lives]').textContent = String(game.lives);
    q('[data-brick-level]').textContent = String(game.level);
    startButton.textContent = game.status === 'ready' ? (game.score ? f.resume : f.start) : f.start;
    startButton.disabled = game.status === 'playing' || game.status === 'levelComplete' || game.status === 'lost';
    pauseButton.disabled = game.status !== 'playing' && game.status !== 'paused';
    pauseButton.textContent = game.status === 'paused' ? f.resume : f.pause;
    nextButton.hidden = game.status !== 'levelComplete';
    q('[data-brick-mute]').textContent = game.muted ? f.unmute : f.mute;
    q('[data-brick-save]').disabled = game.best <= saved;
  }
  function draw() {
    ctx.clearRect(0, 0, BRICK_FIELD.width, BRICK_FIELD.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, BRICK_FIELD.height);
    gradient.addColorStop(0, '#152b3c'); gradient.addColorStop(1, '#0b1724');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, BRICK_FIELD.width, BRICK_FIELD.height);
    ctx.fillStyle = '#e7f09a';
    for (const brick of game.bricks) {
      const shade = Math.max(0, Math.min(1, (game.level + game.bricks.length % 5) / 9));
      ctx.fillStyle = `hsl(${72 + game.level * 8} 78% ${62 - shade * 10}%)`;
      ctx.beginPath(); ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4); ctx.fill();
      if (brick.hits > 1) { ctx.fillStyle = '#203545'; ctx.fillRect(brick.x + 6, brick.y + brick.height - 4, brick.width - 12, 2); }
    }
    const paddleY = BRICK_FIELD.height - 34;
    const paddleGradient = ctx.createLinearGradient(game.paddle.x - game.paddle.width / 2, 0, game.paddle.x + game.paddle.width / 2, 0);
    paddleGradient.addColorStop(0, '#91ca27'); paddleGradient.addColorStop(1, '#e2f288');
    ctx.fillStyle = paddleGradient;
    ctx.beginPath(); ctx.roundRect(game.paddle.x - game.paddle.width / 2, paddleY, game.paddle.width, BRICK_FIELD.paddleHeight, 6); ctx.fill();
    ctx.fillStyle = '#fff8db'; ctx.shadowColor = '#fff2ba'; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    if (game.status !== 'playing') {
      ctx.fillStyle = '#07111dcc'; ctx.fillRect(0, 215, BRICK_FIELD.width, 90);
      ctx.fillStyle = '#fff'; ctx.font = '700 18px system-ui,sans-serif'; ctx.textAlign = 'center';
      const message = game.status === 'levelComplete' ? f.levelComplete : game.status === 'lost' ? f.lost : game.status === 'paused' ? f.paused : game.status === 'ready' ? f.launch : '';
      ctx.fillText(message, BRICK_FIELD.width / 2, 264, BRICK_FIELD.width - 36);
    }
    updateLabels();
  }
  function stopFrame() { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; accumulator = 0; }
  function step(timestamp) {
    if (disposed || game.status !== 'playing') { stopFrame(); return; }
    if (!last) last = timestamp;
    accumulator += Math.min(0.1, (timestamp - last) / 1000); last = timestamp;
    const previousLives = game.lives;
    const previousBricks = game.bricks.length;
    while (accumulator >= 1 / 120 && game.status === 'playing') {
      game = tickBrickGame(game, 1 / 120);
      accumulator -= 1 / 120;
    }
    if (game.bricks.length < previousBricks) sound(560);
    if (game.status !== 'playing') {
      stopFrame();
      if (game.status === 'levelComplete') announce(f.levelComplete);
      else if (game.status === 'lost') announce(f.lost);
      else if (game.lives < previousLives) announce(f.lifeLost);
    }
    draw();
    if (game.status === 'playing') frame = requestAnimationFrame(step);
  }
  function serve() {
    if (game.status === 'lost' || game.status === 'levelComplete') return;
    ensureAudio(); game = launchBrickGame(game); announce(f.running); stopFrame(); frame = requestAnimationFrame(step); draw();
  }
  function newGame() {
    stopFrame(); game = createBrickGame({ seed: (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0, best: Math.max(game.best, saved) });
    announce(f.ready); draw();
  }
  function setPaddle(clientX) {
    const bounds = canvas.getBoundingClientRect();
    game = movePaddle(game, (clientX - bounds.left) * BRICK_FIELD.width / bounds.width);
    if (game.status === 'ready') game.ball.x = game.paddle.x;
    draw();
  }
  startButton.addEventListener('click', serve);
  q('[data-brick-new]').addEventListener('click', newGame);
  pauseButton.addEventListener('click', () => {
    if (game.status === 'playing') { stopFrame(); game = { ...game, status: 'paused' }; announce(f.paused); draw(); }
    else if (game.status === 'paused') serve();
  });
  nextButton.addEventListener('click', () => { game = nextBrickLevel(game); announce(f.ready); draw(); });
  q('[data-brick-mute]').addEventListener('click', () => {
    game = { ...game, muted: !game.muted }; if (!game.muted) ensureAudio(); draw();
  });
  q('[data-brick-save]').addEventListener('click', () => {
    try { saved = Math.max(saved, game.best, game.score); storage.setItem(SAVE_KEY, JSON.stringify(saved)); announce(f.saved); }
    catch { announce(f.noSave); }
    draw();
  });
  q('[data-brick-delete]').addEventListener('click', () => {
    try { storage.removeItem(SAVE_KEY); saved = 0; game = { ...game, best: game.score }; announce(f.deleted); }
    catch { announce(f.noSave); }
    draw();
  });
  canvas.addEventListener('pointermove', (event) => { if (event.pointerType === 'mouse' || event.buttons || event.isPrimary) setPaddle(event.clientX); });
  canvas.addEventListener('pointerdown', (event) => { canvas.setPointerCapture?.(event.pointerId); setPaddle(event.clientX); if (game.status === 'ready') serve(); });
  canvas.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(event.key)) {
      event.preventDefault(); const direction = ['ArrowLeft', 'a', 'A'].includes(event.key) ? -1 : 1;
      game = movePaddle(game, game.paddle.x + direction * 28); if (game.status === 'ready') game.ball.x = game.paddle.x; draw();
    } else if (event.code === 'Space') { event.preventDefault(); if (game.status === 'playing') pauseButton.click(); else serve(); }
  });
  const onVisibility = () => {
    if (document.hidden && game.status === 'playing') { stopFrame(); game = { ...game, status: 'paused' }; announce(f.pauseHidden); draw(); }
  };
  document.addEventListener('visibilitychange', onVisibility);
  draw();
  return () => { disposed = true; stopFrame(); document.removeEventListener('visibilitychange', onVisibility); try { audio?.close(); } catch {} };
}

const brickRoot = document.querySelector('[data-brick-breaker]');
if (brickRoot) mountBrickBreaker(brickRoot, JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}'));
