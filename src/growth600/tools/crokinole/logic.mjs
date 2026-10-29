export const CROKINOLE_BOARD = Object.freeze({ size: 600, radius: 270, puckRadius: 11, launchRadius: 220 });
const clamp = (number, low, high) => Math.min(high, Math.max(low, number));

export function createCrokinoleGame() {
  return { pucks: [], turn: 'one', shots: { one: 0, two: 0 }, points: { one: 0, two: 0 }, shot: null, winner: null, last: 'ready' };
}

export function crokinolePoints(x, y) {
  const radius = Math.hypot(x - 300, y - 300);
  if (radius <= 30) return 20;
  if (radius <= 90) return 15;
  if (radius <= 150) return 10;
  if (radius <= 220) return 5;
  return 0;
}

export function shootCrokinole(game, angleDegrees, power) {
  if (game.shot || game.winner || game.shots[game.turn] >= 8) return false;
  const angle = Number(angleDegrees); const force = Number(power);
  if (!Number.isFinite(angle) || angle < -180 || angle > 180 || !Number.isFinite(force) || force < 80 || force > 450) throw new RangeError('Aim and power are outside the supported range.');
  const angleRad = angle * Math.PI / 180;
  const puck = { id: `${game.turn}-${game.shots[game.turn] + 1}`, owner: game.turn, x: 300 + Math.sin(angleRad) * CROKINOLE_BOARD.launchRadius, y: 300 + Math.cos(angleRad) * CROKINOLE_BOARD.launchRadius, vx: Math.sin(angleRad) * force, vy: -Math.cos(angleRad) * force, activeShot: true };
  game.pucks.push(puck); game.shots[game.turn] += 1;
  game.shot = { owner: game.turn, puckId: puck.id, opponentContact: false, out: new Set() };
  game.last = 'moving';
  return true;
}

function collide(a, b, shot) {
  let dx = b.x - a.x; let dy = b.y - a.y; const distance = Math.hypot(dx, dy); const minimum = CROKINOLE_BOARD.puckRadius * 2;
  if (!distance || distance >= minimum) return;
  if (shot && ((a.activeShot && b.owner !== shot.owner) || (b.activeShot && a.owner !== shot.owner))) shot.opponentContact = true;
  dx /= distance; dy /= distance;
  const overlap = (minimum - distance) / 2; a.x -= dx * overlap; a.y -= dy * overlap; b.x += dx * overlap; b.y += dy * overlap;
  const relative = (b.vx - a.vx) * dx + (b.vy - a.vy) * dy;
  if (relative < 0) { a.vx += relative * dx; a.vy += relative * dy; b.vx -= relative * dx; b.vy -= relative * dy; }
}

export function advanceCrokinoleGame(game, frameSeconds) {
  if (!game.shot) return false;
  const dt = clamp(Number(frameSeconds) || 0, 0, 1 / 30);
  for (const puck of game.pucks) {
    if (puck.vx === 0 && puck.vy === 0) continue;
    puck.x += puck.vx * dt; puck.y += puck.vy * dt;
    if (Math.hypot(puck.x - 300, puck.y - 300) > CROKINOLE_BOARD.radius - CROKINOLE_BOARD.puckRadius) { game.shot.out.add(puck.id); puck.vx = 0; puck.vy = 0; continue; }
    const friction = Math.exp(-1.6 * dt); puck.vx *= friction; puck.vy *= friction;
    if (Math.hypot(puck.vx, puck.vy) < 2) { puck.vx = 0; puck.vy = 0; }
  }
  for (let i = 0; i < game.pucks.length; i += 1) for (let j = i + 1; j < game.pucks.length; j += 1) collide(game.pucks[i], game.pucks[j], game.shot);
  if (game.pucks.every((puck) => puck.vx === 0 && puck.vy === 0)) {
    const shot = game.shot; const flying = game.pucks.find((puck) => puck.id === shot.puckId);
    const hasOpponentOnBoard = game.pucks.some((puck) => puck.owner !== shot.owner && !shot.out.has(puck.id));
    const foul = hasOpponentOnBoard && !shot.opponentContact;
    if (flying && (shot.out.has(flying.id) || foul)) game.pucks = game.pucks.filter((puck) => puck.id !== flying.id);
    else if (flying) flying.activeShot = false;
    game.pucks = game.pucks.filter((puck) => !shot.out.has(puck.id));
    game.points = { one: 0, two: 0 };
    for (const puck of game.pucks) game.points[puck.owner] += crokinolePoints(puck.x, puck.y);
    game.last = foul ? 'foul' : shot.out.has(shot.puckId) ? 'offBoard' : 'settled';
    game.shot = null; game.turn = shot.owner === 'one' ? 'two' : 'one';
    if (game.shots.one === 8 && game.shots.two === 8) {
      game.winner = game.points.one === game.points.two ? 'draw' : game.points.one > game.points.two ? 'one' : 'two';
      game.last = game.winner === 'draw' ? 'draw' : 'gameOver';
    }
  }
  return true;
}
