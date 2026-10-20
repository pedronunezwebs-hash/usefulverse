export const TD_BOARD = Object.freeze({ columns: 10, rows: 12, cell: 48 });
export const TD_PATH = Object.freeze([[0,2],[1,2],[2,2],[3,2],[4,2],[4,3],[4,4],[3,4],[2,4],[1,4],[1,5],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[6,5],[6,4],[7,4],[8,4],[9,4]].map(([x,y]) => Object.freeze({x,y})));
export const TD_TOWERS = Object.freeze({ rapid: Object.freeze({ cost: 40, range: 2.45, damage: 1, interval: 0.36 }), heavy: Object.freeze({ cost: 65, range: 3.35, damage: 3, interval: 1.05 }) });

export function createTowerDefense() {
  return { towers: [], enemies: [], money: 100, lives: 10, wave: 1, score: 0, spawnLeft: 6, spawnTimer: 0.4, nextEnemyId: 1, selectedTower: 'rapid', running: true, elapsed: 0 };
}

export function placeDefenseTower(game, x, y) {
  const type = TD_TOWERS[game.selectedTower];
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= TD_BOARD.columns || y >= TD_BOARD.rows) return { placed: false, reason: 'outside' };
  if (TD_PATH.some((cell) => cell.x === x && cell.y === y)) return { placed: false, reason: 'path' };
  if (game.towers.some((tower) => tower.x === x && tower.y === y)) return { placed: false, reason: 'occupied' };
  if (!type || game.money < type.cost) return { placed: false, reason: 'funds' };
  if (game.towers.length >= 24) return { placed: false, reason: 'limit' };
  game.money -= type.cost;
  game.towers.push({ x, y, type: game.selectedTower, cooldown: 0 });
  return { placed: true };
}

export function stepTowerDefense(game, deltaSeconds) {
  if (!game?.running || !Number.isFinite(deltaSeconds) || deltaSeconds < 0 || deltaSeconds > 0.05) throw new RangeError('Tower-defense step is outside its safe time range.');
  const dt = deltaSeconds; game.elapsed += dt;
  game.spawnTimer -= dt;
  while (game.spawnLeft > 0 && game.spawnTimer <= 0) {
    game.enemies.push({ id: game.nextEnemyId++, progress: 0, hp: 2 + Math.floor(game.wave / 2), maxHp: 2 + Math.floor(game.wave / 2), speed: 1.65 + game.wave * 0.08, reward: 5 + Math.floor(game.wave / 2) });
    game.spawnLeft -= 1; game.spawnTimer += 0.8;
  }
  const escaped = new Set();
  for (const enemy of game.enemies) { enemy.progress += enemy.speed * dt; if (enemy.progress >= TD_PATH.length - 1) escaped.add(enemy.id); }
  if (escaped.size) { game.lives = Math.max(0, game.lives - escaped.size); game.enemies = game.enemies.filter((enemy) => !escaped.has(enemy.id)); }
  for (const tower of game.towers) {
    tower.cooldown -= dt;
    if (tower.cooldown > 0) continue;
    const stats = TD_TOWERS[tower.type];
    let target = null; let nearest = Infinity;
    for (const enemy of game.enemies) {
      const point = positionOnDefensePath(enemy.progress);
      const distance = Math.hypot(point.x - tower.x, point.y - tower.y);
      if (distance <= stats.range && distance < nearest) { nearest = distance; target = enemy; }
    }
    if (target) {
      target.hp -= stats.damage; tower.cooldown = stats.interval;
      if (target.hp <= 0) { game.enemies = game.enemies.filter((enemy) => enemy.id !== target.id); game.money += target.reward; game.score += 10 * game.wave; }
    }
  }
  if (game.lives <= 0) { game.lives = 0; game.running = false; }
  else if (game.spawnLeft === 0 && game.enemies.length === 0 && game.spawnTimer < 0) {
    if (game.wave >= 10) game.running = false;
    else { game.wave += 1; game.spawnLeft = 5 + game.wave; game.spawnTimer = 1.5; }
  }
  return game;
}

export function positionOnDefensePath(progress) {
  const value = Math.max(0, Math.min(TD_PATH.length - 1, progress));
  const index = Math.min(TD_PATH.length - 2, Math.floor(value)); const fraction = value - index;
  const from = TD_PATH[index]; const to = TD_PATH[index + 1];
  return { x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction };
}
