export const PINBALL_WIDTH = 400;
export const PINBALL_HEIGHT = 640;
export const PINBALL_STEP_SECONDS = 1 / 120;
export const PINBALL_BALLS = 3;
export const PINBALL_BUMPERS = Object.freeze([
  Object.freeze({ x: 110, y: 145, radius: 24, value: 100 }),
  Object.freeze({ x: 200, y: 215, radius: 25, value: 100 }),
  Object.freeze({ x: 290, y: 145, radius: 24, value: 100 }),
  Object.freeze({ x: 145, y: 305, radius: 23, value: 150 }),
  Object.freeze({ x: 255, y: 305, radius: 23, value: 150 }),
]);
const BALL_RADIUS = 9;
const GRAVITY = 760;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const hash32 = (value) => { let x = value >>> 0; x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16; return x >>> 0; };
const freeze = (game) => Object.freeze({ ...game, ball: Object.freeze({ ...game.ball }), controls: Object.freeze({ ...game.controls }), bumperCooldowns: Object.freeze([...game.bumperCooldowns]) });
const newBall = () => ({ x: 350, y: 560, vx: 0, vy: 0 });

export function createPinballGame({ seed = 1 } = {}) {
  assert(Number.isInteger(seed) && Number.isFinite(seed), 'Provide an integer random seed.');
  return freeze({ seed: hash32(seed), status: 'ready', score: 0, ballsRemaining: PINBALL_BALLS, ball: newBall(), controls: { left: false, right: false }, tick: 0, bumperCooldowns: Array(PINBALL_BUMPERS.length).fill(0), lastHit: null });
}

export function launchPinballBall(game) {
  assert(game && ['ready', 'ballLost'].includes(game.status) && game.ballsRemaining > 0, 'The ball cannot be launched in this state.');
  const seed = hash32(game.seed + 0x6d2b79f5);
  return freeze({ ...game, seed, status: 'playing', ball: { ...newBall(), vx: -85 - (seed % 70), vy: -610 - (seed % 60) }, controls: { left: false, right: false }, lastHit: null });
}

export function setPinballControls(game, controls) {
  assert(game && ['playing', 'paused'].includes(game.status), 'Start the game before moving the flippers.');
  assert(controls && (controls.left === undefined || typeof controls.left === 'boolean') && (controls.right === undefined || typeof controls.right === 'boolean'), 'Flipper controls must be boolean.');
  return freeze({ ...game, controls: { ...game.controls, ...controls } });
}

export function togglePinballPause(game) {
  assert(game && ['playing', 'paused'].includes(game.status), 'The game cannot be paused in this state.');
  return freeze({ ...game, status: game.status === 'paused' ? 'playing' : 'paused', controls: { left: false, right: false } });
}

function collideSegment(ball, ax, ay, bx, by, impulse = 0) {
  const dx = bx - ax; const dy = by - ay; const length2 = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((ball.x - ax) * dx + (ball.y - ay) * dy) / length2));
  const cx = ax + t * dx; const cy = ay + t * dy; const ox = ball.x - cx; const oy = ball.y - cy;
  const distance = Math.hypot(ox, oy); const minDistance = BALL_RADIUS + 5;
  if (distance >= minDistance || distance === 0) return false;
  const nx = ox / distance; const ny = oy / distance; const dot = ball.vx * nx + ball.vy * ny;
  ball.x = cx + nx * minDistance; ball.y = cy + ny * minDistance;
  if (dot < 0) { ball.vx -= 1.82 * dot * nx; ball.vy -= 1.82 * dot * ny; }
  ball.vy -= impulse;
  return true;
}

function stepOnce(game) {
  let { x, y, vx, vy } = game.ball;
  const tick = game.tick + 1;
  const dt = PINBALL_STEP_SECONDS;
  vy += GRAVITY * dt; x += vx * dt; y += vy * dt;
  if (x < 30 + BALL_RADIUS) { x = 30 + BALL_RADIUS; vx = Math.abs(vx) * 0.84; }
  if (x > 370 - BALL_RADIUS && y < 545) { x = 370 - BALL_RADIUS; vx = -Math.abs(vx) * 0.84; }
  if (y < 30 + BALL_RADIUS) { y = 30 + BALL_RADIUS; vy = Math.abs(vy) * 0.82; }
  if (x > 337 && y < 540 && y > 40) { x = 337; vx = -Math.abs(vx) * 0.78; }
  if (y >= PINBALL_HEIGHT) {
    const ballsRemaining = game.ballsRemaining - 1;
    return freeze({ ...game, tick, ballsRemaining, status: ballsRemaining > 0 ? 'ballLost' : 'gameOver', ball: newBall(), controls: { left: false, right: false }, lastHit: 'drain' });
  }
  const ball = { x, y, vx, vy };
  const cooldowns = [...game.bumperCooldowns];
  let score = game.score; let lastHit = null;
  PINBALL_BUMPERS.forEach((bumper, index) => {
    const dx = ball.x - bumper.x; const dy = ball.y - bumper.y; const distance = Math.hypot(dx, dy); const minDistance = bumper.radius + BALL_RADIUS;
    if (distance >= minDistance || distance === 0) return;
    const nx = dx / distance; const ny = dy / distance; const dot = ball.vx * nx + ball.vy * ny;
    ball.x = bumper.x + nx * (minDistance + 0.5); ball.y = bumper.y + ny * (minDistance + 0.5);
    if (dot < 0) { ball.vx -= 2.05 * dot * nx; ball.vy -= 2.05 * dot * ny; }
    ball.vx += nx * 35; ball.vy += ny * 35;
    if (cooldowns[index] <= tick) { score += bumper.value; lastHit = `bumper-${index + 1}`; cooldowns[index] = tick + 18; }
  });
  const leftPivot = { x: 135, y: 545 };
  const rightPivot = { x: 265, y: 545 };
  const leftTip = game.controls.left ? { x: 205, y: 502 } : { x: 202, y: 535 };
  const rightTip = game.controls.right ? { x: 195, y: 502 } : { x: 198, y: 535 };
  if (collideSegment(ball, leftPivot.x, leftPivot.y, leftTip.x, leftTip.y, game.controls.left ? 95 : 0)) lastHit ??= game.controls.left ? 'left-flipper' : null;
  if (collideSegment(ball, rightPivot.x, rightPivot.y, rightTip.x, rightTip.y, game.controls.right ? 95 : 0)) lastHit ??= game.controls.right ? 'right-flipper' : null;
  return freeze({ ...game, ball, tick, score, bumperCooldowns: cooldowns, lastHit });
}

export function stepPinballGame(game, steps = 1) {
  assert(game && Number.isInteger(steps) && steps >= 0 && steps <= 240, 'Use 0 to 240 fixed simulation steps.');
  if (game.status !== 'playing' || steps === 0) return game;
  let next = game;
  for (let index = 0; index < steps && next.status === 'playing'; index += 1) next = stepOnce(next);
  return next;
}

export function drainPinballBall(game) {
  assert(game && game.status === 'playing', 'Only an active ball can drain.');
  const ballsRemaining = game.ballsRemaining - 1;
  return freeze({ ...game, ballsRemaining, status: ballsRemaining > 0 ? 'ballLost' : 'gameOver', ball: newBall(), controls: { left: false, right: false }, lastHit: 'drain' });
}
