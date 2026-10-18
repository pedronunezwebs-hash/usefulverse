import { createPinballGame, launchPinballBall, setPinballControls, stepPinballGame, togglePinballPause, PINBALL_BUMPERS, PINBALL_HEIGHT, PINBALL_WIDTH } from './pinball.mjs';

const root = document.querySelector('[data-market-tool="pinball"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const canvas = q('[data-pinball-canvas]');
  const context = canvas?.getContext('2d');
  const storageKey = 'usefulverse.pinball.best.v1';
  let game = createPinballGame({ seed: 1 });
  let best = 0; let storageAvailable = true; let muted = true; let reduceMotion = false;
  let animationFrame = 0; let previousTime = 0; let accumulator = 0; let audioContext = null; let lastSoundAt = 0;
  try { best = Math.max(0, Number(localStorage.getItem(storageKey)) || 0); } catch { storageAvailable = false; }

  const updateCopy = () => {
    q('[data-pinball-mute]').textContent = muted ? (copy.mute ?? 'Sound: off') : (copy.unmute ?? 'Sound: on');
    q('[data-pinball-mute]').setAttribute('aria-pressed', String(!muted));
    q('[data-pinball-pause]').hidden = game.status !== 'playing';
    q('[data-pinball-resume]').hidden = game.status !== 'paused';
    q('[data-pinball-launch]').disabled = !['ready', 'ballLost'].includes(game.status);
    q('[data-pinball-status]').textContent = game.status === 'ready' ? (copy.ready ?? '')
      : game.status === 'playing' ? (copy.yourTurn ?? '')
        : game.status === 'paused' ? (copy.paused ?? '')
          : game.status === 'ballLost' ? (copy.ballLost ?? '')
            : (copy.gameOver ?? '').replace('{score}', String(game.score));
    q('[data-pinball-score]').textContent = String(game.score);
    q('[data-pinball-balls]').textContent = String(game.ballsRemaining);
    q('[data-pinball-best]').textContent = String(best);
    q('[data-pinball-best-note]').textContent = storageAvailable ? '' : (copy.saveUnavailable ?? '');
  };

  function draw() {
    if (!context || !canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = canvas.clientWidth || 400; const height = Math.round(width * PINBALL_HEIGHT / PINBALL_WIDTH);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    }
    context.setTransform(canvas.width / PINBALL_WIDTH, 0, 0, canvas.height / PINBALL_HEIGHT, 0, 0);
    context.clearRect(0, 0, PINBALL_WIDTH, PINBALL_HEIGHT);
    const background = context.createLinearGradient(0, 25, 400, 620); background.addColorStop(0, '#152a44'); background.addColorStop(1, '#07131f');
    context.fillStyle = background; context.fillRect(0, 0, PINBALL_WIDTH, PINBALL_HEIGHT);
    context.strokeStyle = '#bdd0dc'; context.lineWidth = 8; context.strokeRect(27, 27, 346, 586);
    context.fillStyle = '#263f56'; context.fillRect(336, 34, 34, 520);
    context.strokeStyle = '#94aabb'; context.lineWidth = 3; context.beginPath(); context.moveTo(337, 35); context.lineTo(337, 540); context.stroke();
    for (const [index, bumper] of PINBALL_BUMPERS.entries()) {
      const gradient = context.createRadialGradient(bumper.x - 7, bumper.y - 8, 2, bumper.x, bumper.y, bumper.radius);
      gradient.addColorStop(0, '#fff5bf'); gradient.addColorStop(.38, index < 3 ? '#ffae50' : '#6ce1d2'); gradient.addColorStop(1, '#246075');
      context.fillStyle = gradient; context.beginPath(); context.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2); context.fill();
      context.strokeStyle = '#e9f2ef'; context.lineWidth = 2; context.stroke();
      context.fillStyle = '#102332'; context.font = '700 12px system-ui'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(String(bumper.value), bumper.x, bumper.y);
    }
    const drawFlipper = (side, pressed) => {
      const x = side === 'left' ? 135 : 265; const tipX = side === 'left' ? (pressed ? 205 : 202) : (pressed ? 195 : 198);
      const tipY = pressed ? 502 : 535; const y = 545;
      context.lineCap = 'round'; context.strokeStyle = pressed ? '#fff2a4' : '#f4a851'; context.lineWidth = 15;
      context.beginPath(); context.moveTo(x, y); context.lineTo(tipX, tipY); context.stroke();
      context.fillStyle = '#f6d69a'; context.beginPath(); context.arc(x, y, 10, 0, Math.PI * 2); context.fill();
    };
    drawFlipper('left', game.controls.left); drawFlipper('right', game.controls.right);
    const ball = game.ball;
    if (!reduceMotion && game.lastHit?.startsWith('bumper')) {
      context.fillStyle = 'rgba(255,245,185,.24)'; context.beginPath(); context.arc(ball.x, ball.y, 18, 0, Math.PI * 2); context.fill();
    }
    context.fillStyle = '#fff'; context.shadowColor = '#fff'; context.shadowBlur = reduceMotion ? 0 : 8;
    context.beginPath(); context.arc(ball.x, ball.y, 8, 0, Math.PI * 2); context.fill(); context.shadowBlur = 0;
  }

  function playSound() {
    if (muted || !window.AudioContext) return;
    const now = performance.now(); if (now - lastSoundAt < 90) return; lastSoundAt = now;
    try {
      audioContext ??= new AudioContext();
      if (audioContext.state === 'suspended') void audioContext.resume();
      const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = 620; gain.gain.setValueAtTime(.035, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .06);
      oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + .06);
    } catch { /* Audio is optional; game logic stays available. */ }
  }

  function loop(now) {
    if (game.status !== 'playing') { animationFrame = 0; previousTime = 0; accumulator = 0; draw(); return; }
    if (!previousTime) previousTime = now;
    accumulator += Math.min(.1, (now - previousTime) / 1000); previousTime = now;
    let steps = 0; let priorHit = game.lastHit;
    while (accumulator >= 1 / 120 && steps < 12 && game.status === 'playing') {
      game = stepPinballGame(game, 1); accumulator -= 1 / 120; steps += 1;
      if (game.lastHit && game.lastHit !== priorHit) playSound();
      priorHit = game.lastHit;
    }
    if (game.score > best) {
      best = game.score;
      try { localStorage.setItem(storageKey, String(best)); storageAvailable = true; } catch { storageAvailable = false; }
      q('[data-pinball-best-note]').textContent = copy.bestUpdated ?? '';
    }
    if (game.status === 'ballLost' || game.status === 'gameOver') updateCopy();
    if (game.status === 'ballLost') q('[data-pinball-status]').textContent = copy.ballLost ?? '';
    if (game.status === 'gameOver') q('[data-pinball-status]').textContent = (copy.gameOver ?? '').replace('{score}', String(game.score));
    q('[data-pinball-score]').textContent = String(game.score); q('[data-pinball-balls]').textContent = String(game.ballsRemaining); q('[data-pinball-best]').textContent = String(best);
    draw(); animationFrame = game.status === 'playing' ? window.requestAnimationFrame(loop) : 0;
  }
  function startLoop() { if (!animationFrame) animationFrame = window.requestAnimationFrame(loop); }
  function setFlipper(side, value) {
    if (game.status !== 'playing') return;
    game = setPinballControls(game, { [side]: value }); draw();
  }
  function bindFlipper(selector, side) {
    const button = q(selector);
    button.addEventListener('pointerdown', (event) => { event.preventDefault(); button.setPointerCapture?.(event.pointerId); setFlipper(side, true); });
    for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave']) button.addEventListener(eventName, () => setFlipper(side, false));
    button.addEventListener('blur', () => setFlipper(side, false));
  }
  bindFlipper('[data-pinball-left]', 'left'); bindFlipper('[data-pinball-right]', 'right');
  q('[data-pinball-new]').addEventListener('click', () => {
    let seed; try { seed = crypto.getRandomValues(new Uint32Array(1))[0]; } catch { seed = Date.now() >>> 0; }
    if (animationFrame) cancelAnimationFrame(animationFrame); game = createPinballGame({ seed }); updateCopy(); draw();
    q('[data-pinball-status]').textContent = copy.ready ?? '';
  });
  q('[data-pinball-launch]').addEventListener('click', () => {
    if (!['ready', 'ballLost'].includes(game.status)) return;
    game = launchPinballBall(game); updateCopy(); q('[data-pinball-status]').textContent = copy.launched ?? '';
    if (!muted) playSound(); startLoop();
  });
  q('[data-pinball-pause]').addEventListener('click', () => { game = togglePinballPause(game); updateCopy(); if (animationFrame) cancelAnimationFrame(animationFrame); animationFrame = 0; draw(); });
  q('[data-pinball-resume]').addEventListener('click', () => { game = togglePinballPause(game); updateCopy(); startLoop(); });
  q('[data-pinball-mute]').addEventListener('click', () => { muted = !muted; updateCopy(); if (!muted) playSound(); });
  reduceMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  q('[data-pinball-reduce-motion]').checked = reduceMotion;
  q('[data-pinball-reduce-motion]').addEventListener('change', () => { reduceMotion = q('[data-pinball-reduce-motion]').checked; draw(); });
  root.addEventListener('keydown', (event) => {
    if (event.target.closest('input,select,textarea,button')) return;
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') { event.preventDefault(); setFlipper('left', true); }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') { event.preventDefault(); setFlipper('right', true); }
    if (event.code === 'Space' && ['ready', 'ballLost'].includes(game.status)) { event.preventDefault(); q('[data-pinball-launch]').click(); }
    if (event.code === 'Escape' && game.status === 'playing') q('[data-pinball-pause]').click();
  });
  root.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') setFlipper('left', false);
    if (event.code === 'ArrowRight' || event.code === 'KeyD') setFlipper('right', false);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.status === 'playing') q('[data-pinball-pause]').click();
  });
  window.addEventListener('blur', () => { if (game.status === 'playing') game = setPinballControls(game, { left: false, right: false }); });
  updateCopy(); draw();
}
