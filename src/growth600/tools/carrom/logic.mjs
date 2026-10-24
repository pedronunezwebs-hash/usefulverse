export const CARROM_BOARD = Object.freeze({ size: 600, edge: 72, pocketRadius: 24, coinRadius: 11, strikerRadius: 15 });
const POCKETS = Object.freeze([[80, 80], [520, 80], [80, 520], [520, 520]]);
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

export function createCarromGame() {
  const coins = [];
  for (let index = 0; index < 12; index += 1) {
    const angle = index * Math.PI / 6;
    coins.push({ id: `c${index}`, owner: index % 2 ? 'two' : 'one', x: 300 + Math.cos(angle) * 48, y: 300 + Math.sin(angle) * 48, vx: 0, vy: 0, kind: 'coin' });
  }
  for (let index = 0; index < 6; index += 1) {
    const angle = index * Math.PI / 3 + Math.PI / 6;
    coins.push({ id: `i${index}`, owner: index % 2 ? 'two' : 'one', x: 300 + Math.cos(angle) * 24, y: 300 + Math.sin(angle) * 24, vx: 0, vy: 0, kind: 'coin' });
  }
  coins.push({ id: 'queen', owner: null, x: 300, y: 300, vx: 0, vy: 0, kind: 'queen' });
  return { coins, striker: null, turn: 'one', score: { one: 0, two: 0 }, shot: null, winner: null, last: 'ready' };
}

export function shootCarrom(game, angleDegrees, power) {
  if (game.winner || game.shot || game.coins.some((coin) => Math.hypot(coin.vx, coin.vy) > 0)) return false;
  const angle = Number(angleDegrees); const force = Number(power);
  if (!Number.isFinite(angle) || angle < -60 || angle > 60 || !Number.isFinite(force) || force < 120 || force > 620) throw new RangeError('Aim and power are outside the supported range.');
  const base = game.turn === 'one' ? -Math.PI / 2 : Math.PI / 2;
  const direction = base + angle * Math.PI / 180;
  game.striker = { id: 'striker', owner: game.turn, x: 300, y: game.turn === 'one' ? 500 : 100, vx: Math.cos(direction) * force, vy: Math.sin(direction) * force, kind: 'striker' };
  game.shot = { pocketed: [], scratch: false };
  game.last = 'moving';
  return true;
}

function stepBody(body, dt, shot) {
  body.x += body.vx * dt; body.y += body.vy * dt;
  const pocketIndex = POCKETS.findIndex(([x, y]) => Math.hypot(body.x - x, body.y - y) < CARROM_BOARD.pocketRadius);
  if (pocketIndex >= 0) {
    if (body.kind === 'striker') shot.scratch = true;
    else shot.pocketed.push(body);
    return 'pocket';
  }
  const radius = body.kind === 'striker' ? CARROM_BOARD.strikerRadius : CARROM_BOARD.coinRadius;
  const min = CARROM_BOARD.edge + radius; const max = CARROM_BOARD.size - min;
  if (body.x < min) { body.x = min; body.vx = Math.abs(body.vx) * .82; }
  if (body.x > max) { body.x = max; body.vx = -Math.abs(body.vx) * .82; }
  if (body.y < min) { body.y = min; body.vy = Math.abs(body.vy) * .82; }
  if (body.y > max) { body.y = max; body.vy = -Math.abs(body.vy) * .82; }
  const friction = Math.exp(-1.9 * dt); body.vx *= friction; body.vy *= friction;
  if (Math.hypot(body.vx, body.vy) < 3) { body.vx = 0; body.vy = 0; }
  return 'board';
}

function collide(a, b) {
  let dx = b.x - a.x; let dy = b.y - a.y; let distance = Math.hypot(dx, dy);
  const radiusA = a.kind === 'striker' ? CARROM_BOARD.strikerRadius : CARROM_BOARD.coinRadius;
  const radiusB = b.kind === 'striker' ? CARROM_BOARD.strikerRadius : CARROM_BOARD.coinRadius;
  const minimum = radiusA + radiusB;
  if (!distance || distance >= minimum) return;
  dx /= distance; dy /= distance;
  const overlap = (minimum - distance) / 2;
  a.x -= dx * overlap; a.y -= dy * overlap; b.x += dx * overlap; b.y += dy * overlap;
  const relative = (b.vx - a.vx) * dx + (b.vy - a.vy) * dy;
  if (relative < 0) { a.vx += relative * dx; a.vy += relative * dy; b.vx -= relative * dx; b.vy -= relative * dy; }
}

function resolveShot(game) {
  const shot = game.shot; const current = game.turn; const other = current === 'one' ? 'two' : 'one';
  const own = shot.pocketed.filter((coin) => coin.owner === current);
  const opponent = shot.pocketed.filter((coin) => coin.owner === other);
  const queen = shot.pocketed.some((coin) => coin.kind === 'queen');
  if (shot.scratch) {
    game.last = 'foul'; game.turn = other;
    for (const coin of shot.pocketed) if (coin.kind === 'queen' || coin.owner === current) { coin.x = 300; coin.y = 300; coin.vx = 0; coin.vy = 0; game.coins.push(coin); }
  } else {
    game.score[current] += own.length;
    game.score[other] += opponent.length;
    if (queen) {
      if (own.length) game.score[current] += 3;
      else game.coins.push({ id: 'queen', owner: null, x: 300, y: 300, vx: 0, vy: 0, kind: 'queen' });
    }
    game.last = queen && own.length ? 'queenCovered' : own.length ? 'ownPocketed' : opponent.length ? 'opponentPocketed' : 'miss';
    if (!own.length) game.turn = other;
  }
  game.striker = null; game.shot = null;
  if (!game.coins.some((coin) => coin.kind === 'coin')) {
    game.coins = game.coins.filter((coin) => coin.kind !== 'queen');
    game.winner = game.score.one === game.score.two ? 'draw' : game.score.one > game.score.two ? 'one' : 'two';
    game.last = game.winner === 'draw' ? 'draw' : 'gameOver';
  }
}

export function advanceCarromGame(game, frameSeconds) {
  if (!game.shot) return false;
  const dt = clamp(Number(frameSeconds) || 0, 0, 1 / 30);
  const bodies = [...game.coins, ...(game.striker ? [game.striker] : [])];
  const removed = new Set();
  let strikerPocketed = false;
  for (const body of bodies) if (stepBody(body, dt, game.shot) === 'pocket') {
    if (body.kind === 'striker') strikerPocketed = true;
    else removed.add(body.id);
  }
  if (removed.size) game.coins = game.coins.filter((coin) => !removed.has(coin.id));
  if (strikerPocketed) game.striker = null;
  const current = [...game.coins, ...(game.striker ? [game.striker] : [])];
  for (let i = 0; i < current.length; i += 1) for (let j = i + 1; j < current.length; j += 1) collide(current[i], current[j]);
  if (current.every((body) => Math.hypot(body.vx, body.vy) === 0)) resolveShot(game);
  return true;
}
