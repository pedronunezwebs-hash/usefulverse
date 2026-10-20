const WIDTH = 480;
const HEIGHT = 640;
const PLAYER_Y = 585;

export function createSpaceGame() {
  return { playerX: WIDTH / 2, bullets: [], enemies: [], lives: 3, score: 0, kills: 0, wave: 1, spawnTimer: 0.5, fireTimer: 0, running: true, elapsed: 0 };
}

export function stepSpaceGame(game, input, deltaSeconds, random = Math.random) {
  if (!game?.running || !Number.isFinite(deltaSeconds) || deltaSeconds < 0 || deltaSeconds > 0.05) throw new RangeError('The space game step is outside its safe time range.');
  const dt = deltaSeconds;
  game.elapsed += dt;
  if (input.left) game.playerX -= 260 * dt;
  if (input.right) game.playerX += 260 * dt;
  game.playerX = Math.max(22, Math.min(WIDTH - 22, game.playerX));
  game.fireTimer -= dt;
  if (input.fire && game.fireTimer <= 0) { game.bullets.push({ x: game.playerX, y: PLAYER_Y - 18 }); game.fireTimer = 0.24; }
  for (const bullet of game.bullets) bullet.y -= 500 * dt;
  game.bullets = game.bullets.filter((bullet) => bullet.y > -10);
  game.spawnTimer -= dt;
  if (game.spawnTimer <= 0) {
    const chance = random();
    if (!Number.isFinite(chance) || chance < 0 || chance >= 1) throw new RangeError('The enemy selector must return a value from zero to below one.');
    game.enemies.push({ x: 24 + chance * (WIDTH - 48), y: -18, speed: 80 + game.wave * 9, drift: (random() - 0.5) * 34 });
    game.spawnTimer = Math.max(0.34, 1.1 - game.wave * 0.06);
  }
  for (const enemy of game.enemies) { enemy.y += enemy.speed * dt; enemy.x += enemy.drift * dt; }
  const remainingBullets = [];
  for (const bullet of game.bullets) {
    const hitIndex = game.enemies.findIndex((enemy) => Math.abs(enemy.x - bullet.x) < 16 && Math.abs(enemy.y - bullet.y) < 18);
    if (hitIndex >= 0) { game.enemies.splice(hitIndex, 1); game.score += 100; game.kills += 1; game.wave = 1 + Math.floor(game.kills / 10); }
    else remainingBullets.push(bullet);
  }
  game.bullets = remainingBullets;
  const survivors = [];
  for (const enemy of game.enemies) {
    if (enemy.y >= PLAYER_Y - 14 && enemy.y <= PLAYER_Y + 14 && Math.abs(enemy.x - game.playerX) < 25) { game.lives -= 1; continue; }
    if (enemy.y > HEIGHT + 10) { game.lives -= 1; continue; }
    survivors.push(enemy);
  }
  game.enemies = survivors;
  if (game.lives <= 0) { game.lives = 0; game.running = false; }
  return game;
}

export const SPACE_GAME_SIZE = Object.freeze({ width: WIDTH, height: HEIGHT, playerY: PLAYER_Y });
