export const TABLE = Object.freeze({ width: 1000, height: 500, ballRadius: 13, pocketRadius: 27 });

const POCKETS = Object.freeze([[0, 0], [TABLE.width / 2, 0], [TABLE.width, 0], [0, TABLE.height], [TABLE.width / 2, TABLE.height], [TABLE.width, TABLE.height]]);

export function isPoolCuePlacementValid(balls, x, y) {
  if (!Array.isArray(balls) || !Number.isFinite(x) || !Number.isFinite(y)) return false;
  if (x < TABLE.ballRadius || x > TABLE.width - TABLE.ballRadius || y < TABLE.ballRadius || y > TABLE.height - TABLE.ballRadius) return false;
  if (POCKETS.some(([px, py]) => Math.hypot(px - x, py - y) < TABLE.pocketRadius)) return false;
  return balls.filter(({ kind }) => kind !== 'cue').every((ball) => Math.hypot(ball.x - x, ball.y - y) >= TABLE.ballRadius * 2);
}

export function createPoolRack() {
  const balls = [{ id: 0, x: 220, y: 250, vx: 0, vy: 0, kind: 'cue', color: '#f8f8f5' }];
  const colors = ['#f1d32b', '#2466d4', '#d83438', '#7a3eaa', '#f08c25', '#268e50', '#7c2536'];
  const rack = [[1], [9, 2], [3, 8, 10], [11, 4, 12, 5], [6, 13, 7, 14, 15]];
  rack.forEach((column, xIndex) => column.forEach((id, row) => {
    const kind = id === 8 ? 'eight' : id <= 7 ? 'solid' : 'stripe';
    balls.push({ id, x: 675 + xIndex * 25, y: 250 + (row - xIndex / 2) * 27, vx: 0, vy: 0, kind, color: id === 8 ? '#171717' : colors[(id - 1) % 7] });
  }));
  return balls;
}

export function createPoolGame() {
  return { balls: createPoolRack(), turn: 0, groups: [null, null], ballInHand: false, winner: null };
}

export function simulatePoolStep(balls, dt, shot) {
  const elapsed = Math.min(Math.max(Number(dt) || 0, 0), 1 / 30);
  const steps = 4;
  const step = elapsed / steps;
  let pocketed = 0;
  for (let substep = 0; substep < steps; substep += 1) {
    for (let index = balls.length - 1; index >= 0; index -= 1) {
      const ball = balls[index];
      ball.x += ball.vx * step;
      ball.y += ball.vy * step;
      const pocket = POCKETS.find(([x, y]) => Math.hypot(ball.x - x, ball.y - y) < TABLE.pocketRadius - 3);
      if (pocket) {
        if (ball.kind === 'cue') {
          ball.x = 220; ball.y = TABLE.height / 2; ball.vx = 0; ball.vy = 0;
          if (shot) shot.cueScratch = true;
        } else {
          balls.splice(index, 1); pocketed += 1;
          shot?.pocketed.push({ id: ball.id, kind: ball.kind });
        }
        continue;
      }
      if (ball.x < TABLE.ballRadius) { ball.x = TABLE.ballRadius; ball.vx = Math.abs(ball.vx) * 0.82; if (ball.kind !== 'cue' && shot?.firstContactId !== null && shot?.firstContactId !== undefined) shot.railAfterContact = true; }
      if (ball.x > TABLE.width - TABLE.ballRadius) { ball.x = TABLE.width - TABLE.ballRadius; ball.vx = -Math.abs(ball.vx) * 0.82; if (ball.kind !== 'cue' && shot?.firstContactId !== null && shot?.firstContactId !== undefined) shot.railAfterContact = true; }
      if (ball.y < TABLE.ballRadius) { ball.y = TABLE.ballRadius; ball.vy = Math.abs(ball.vy) * 0.82; if (ball.kind !== 'cue' && shot?.firstContactId !== null && shot?.firstContactId !== undefined) shot.railAfterContact = true; }
      if (ball.y > TABLE.height - TABLE.ballRadius) { ball.y = TABLE.height - TABLE.ballRadius; ball.vy = -Math.abs(ball.vy) * 0.82; if (ball.kind !== 'cue' && shot?.firstContactId !== null && shot?.firstContactId !== undefined) shot.railAfterContact = true; }
      const friction = Math.exp(-1.45 * step);
      ball.vx *= friction; ball.vy *= friction;
      if (Math.hypot(ball.vx, ball.vy) < 5) { ball.vx = 0; ball.vy = 0; }
    }
    for (let left = 0; left < balls.length; left += 1) {
      for (let right = left + 1; right < balls.length; right += 1) {
        const a = balls[left]; const b = balls[right];
        let dx = b.x - a.x; let dy = b.y - a.y; let distance = Math.hypot(dx, dy);
        const minimum = TABLE.ballRadius * 2;
        if (!distance || distance >= minimum) continue;
        if (shot && shot.firstContactId === null) {
          if (a.kind === 'cue' && b.kind !== 'cue') { shot.firstContactId = b.id; shot.firstContactKind = b.kind; }
          else if (b.kind === 'cue' && a.kind !== 'cue') { shot.firstContactId = a.id; shot.firstContactKind = a.kind; }
        }
        dx /= distance; dy /= distance;
        const overlap = (minimum - distance) / 2;
        a.x -= dx * overlap; a.y -= dy * overlap; b.x += dx * overlap; b.y += dy * overlap;
        const relative = (b.vx - a.vx) * dx + (b.vy - a.vy) * dy;
        if (relative < 0) { const impulse = -relative; a.vx -= impulse * dx; a.vy -= impulse * dy; b.vx += impulse * dx; b.vy += impulse * dy; }
      }
    }
  }
  return pocketed;
}

export function resolvePoolShot(game, shot) {
  const player = game.turn;
  const ownKind = game.groups[player];
  const firstKind = shot.firstContactKind;
  const wrongFirst = !firstKind || firstKind === 'eight' || (ownKind && firstKind !== ownKind);
  const foul = Boolean(shot.cueScratch || wrongFirst || (!shot.pocketed.length && !shot.railAfterContact));
  const eightPocketed = shot.pocketed.some(({ id }) => id === 8);
  const remainingOwn = ownKind && game.balls.some(({ kind }) => kind === ownKind);
  if (eightPocketed) {
    game.winner = !foul && ownKind && !remainingOwn ? player : 1 - player;
    return { kind: game.winner === player ? 'win' : 'loss', foul, turn: player, groups: [...game.groups], winner: game.winner };
  }
  let assigned = false;
  if (!foul && !ownKind) {
    const firstPocketed = shot.pocketed.find(({ id }) => id !== 8);
    if (firstPocketed) {
      game.groups[player] = firstPocketed.kind; game.groups[1 - player] = firstPocketed.kind === 'solid' ? 'stripe' : 'solid'; assigned = true;
    }
  }
  const validPot = shot.pocketed.some(({ kind }) => kind === game.groups[player]);
  if (foul) game.ballInHand = true;
  if (foul || !validPot) game.turn = 1 - player;
  const kind = foul ? 'foul' : validPot ? 'continue' : 'switch';
  return { kind, foul, assigned, turn: game.turn, groups: [...game.groups], winner: null };
}

export function shootCueBall(balls, aimX, aimY, power) {
  const cue = balls.find(({ kind }) => kind === 'cue');
  const magnitude = Math.hypot(aimX, aimY);
  const force = Math.min(Math.max(Number(power) || 0, 0), 850);
  if (!cue || magnitude < 1 || force < 1) return false;
  cue.vx = (aimX / magnitude) * force;
  cue.vy = (aimY / magnitude) * force;
  return true;
}
