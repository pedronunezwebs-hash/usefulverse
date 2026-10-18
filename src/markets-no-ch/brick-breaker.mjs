export const BRICK_WIDTH = 48;
export const BRICK_HEIGHT = 18;
export const BRICK_GAP = 4;
export const BRICK_COLUMNS = 7;
export const BRICK_ROWS = 5;
export const BRICK_FIELD = Object.freeze({ width: 420, height: 520, paddleWidth: 82, paddleHeight: 12, radius: 7 });

export function createBrickLayout(level = 1) {
  const rows = Math.min(BRICK_ROWS, 2 + Math.max(0, Math.floor(level) - 1));
  return Array.from({ length: rows * BRICK_COLUMNS }, (_, index) => {
    const row = Math.floor(index / BRICK_COLUMNS);
    const column = index % BRICK_COLUMNS;
    const pattern = (row + column + Math.floor(level / 2)) % 5;
    const gap = level > 1 && pattern === 0;
    return {
      id: `${level}-${row}-${column}`,
      x: 23 + column * (BRICK_WIDTH + BRICK_GAP),
      y: 58 + row * (BRICK_HEIGHT + BRICK_GAP),
      width: BRICK_WIDTH,
      height: BRICK_HEIGHT,
      hits: gap ? 0 : 1 + (level > 3 && pattern === 1 ? 1 : 0),
      maxHits: gap ? 0 : 1 + (level > 3 && pattern === 1 ? 1 : 0),
    };
  }).filter(({ hits }) => hits > 0);
}

export function createBrickGame({ level = 1, seed = 1, best = 0 } = {}) {
  const safeLevel = Math.max(1, Math.min(20, Math.floor(level) || 1));
  const angle = ((Math.imul(seed >>> 0, 1664525) + 1013904223) >>> 0) / 0x100000000 * 0.72 - 0.36;
  const speed = Math.min(310, 220 + (safeLevel - 1) * 9);
  return {
    level: safeLevel,
    score: 0,
    best: Math.max(0, Math.floor(best)),
    lives: 3,
    status: 'ready',
    paddle: { x: BRICK_FIELD.width / 2, width: BRICK_FIELD.paddleWidth },
    ball: { x: BRICK_FIELD.width / 2, y: BRICK_FIELD.height - 50, vx: speed * Math.sin(angle), vy: -speed * Math.cos(angle), radius: BRICK_FIELD.radius },
    bricks: createBrickLayout(safeLevel),
    seed: seed >>> 0,
    muted: true,
  };
}

export function movePaddle(game, x) {
  const half = game.paddle.width / 2;
  return { ...game, paddle: { ...game.paddle, x: Math.max(half, Math.min(BRICK_FIELD.width - half, Number(x) || 0)) } };
}

export function launchBrickGame(game) {
  if (game.status === 'won' || game.status === 'lost') return game;
  return { ...game, status: 'playing' };
}

function hitsRect(ball, rect) {
  const nearestX = Math.max(rect.x, Math.min(ball.x, rect.x + rect.width));
  const nearestY = Math.max(rect.y, Math.min(ball.y, rect.y + rect.height));
  const dx = ball.x - nearestX;
  const dy = ball.y - nearestY;
  if (dx * dx + dy * dy > ball.radius * ball.radius) return false;
  const overlapX = ball.radius - Math.abs(dx);
  const overlapY = ball.radius - Math.abs(dy);
  return { axis: overlapX < overlapY ? 'x' : 'y', dx, dy };
}

export function tickBrickGame(game, seconds) {
  if (game.status !== 'playing' || !Number.isFinite(seconds) || seconds <= 0) return game;
  const dt = Math.min(1 / 30, seconds);
  const ball = { ...game.ball, x: game.ball.x + game.ball.vx * dt, y: game.ball.y + game.ball.vy * dt };
  const paddleY = BRICK_FIELD.height - 34;
  let score = game.score;
  let bricks = game.bricks.map((brick) => ({ ...brick }));

  if (ball.x - ball.radius < 0) { ball.x = ball.radius; ball.vx = Math.abs(ball.vx); }
  if (ball.x + ball.radius > BRICK_FIELD.width) { ball.x = BRICK_FIELD.width - ball.radius; ball.vx = -Math.abs(ball.vx); }
  if (ball.y - ball.radius < 0) { ball.y = ball.radius; ball.vy = Math.abs(ball.vy); }

  const paddle = { x: game.paddle.x - game.paddle.width / 2, y: paddleY, width: game.paddle.width, height: BRICK_FIELD.paddleHeight };
  const paddleHit = hitsRect(ball, paddle);
  if (paddleHit && ball.vy > 0) {
    const offset = Math.max(-1, Math.min(1, (ball.x - game.paddle.x) / (game.paddle.width / 2)));
    const speed = Math.hypot(ball.vx, ball.vy);
    const angle = offset * 1.08;
    ball.y = paddleY - ball.radius;
    ball.vx = speed * Math.sin(angle);
    ball.vy = -Math.max(100, speed * Math.cos(angle));
  }

  for (const brick of bricks) {
    const collision = hitsRect(ball, brick);
    if (!collision) continue;
    brick.hits -= 1;
    score += 10;
    if (collision.axis === 'x') ball.vx *= -1;
    else ball.vy *= -1;
    ball.x += Math.sign(ball.vx) * 0.8;
    ball.y += Math.sign(ball.vy) * 0.8;
    break;
  }
  bricks = bricks.filter(({ hits }) => hits > 0);

  if (ball.y - ball.radius > BRICK_FIELD.height) {
    const lives = game.lives - 1;
    if (lives <= 0) return { ...game, score, best: Math.max(game.best, score), lives: 0, bricks, status: 'lost', ball };
    return { ...game, score, best: Math.max(game.best, score), lives, bricks, status: 'ready', ball: { ...game.ball, x: game.paddle.x, y: BRICK_FIELD.height - 50 } };
  }
  if (bricks.length === 0) {
    return { ...game, score, best: Math.max(game.best, score), bricks, status: 'levelComplete', ball };
  }
  return { ...game, score, best: Math.max(game.best, score), bricks, ball };
}

export function nextBrickLevel(game) {
  if (game.status !== 'levelComplete') return game;
  return { ...createBrickGame({ level: game.level + 1, seed: (game.seed + 0x9e3779b9) >>> 0, best: game.best }), score: game.score, lives: game.lives };
}
