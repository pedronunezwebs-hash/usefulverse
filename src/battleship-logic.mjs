export const BATTLESHIP_SIZE = 8;
export const BATTLESHIP_FLEET = Object.freeze([4, 3, 2]);

function randomIndex(length, random) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return Math.floor(value * length);
}

export function createBattleshipFleet(random = Math.random) {
  if (typeof random !== 'function') throw new TypeError('Provide a random function.');
  const board = Array(BATTLESHIP_SIZE * BATTLESHIP_SIZE).fill(0);
  for (const [shipId, length] of BATTLESHIP_FLEET.entries()) {
    let placed = false;
    for (let attempt = 0; attempt < 2000 && !placed; attempt += 1) {
      const horizontal = randomIndex(2, random) === 0;
      const row = randomIndex(horizontal ? BATTLESHIP_SIZE : BATTLESHIP_SIZE - length + 1, random);
      const column = randomIndex(horizontal ? BATTLESHIP_SIZE - length + 1 : BATTLESHIP_SIZE, random);
      const cells = Array.from({ length }, (_, offset) => (row + (horizontal ? 0 : offset)) * BATTLESHIP_SIZE + column + (horizontal ? offset : 0));
      if (cells.some((index) => board[index] !== 0)) continue;
      cells.forEach((index) => { board[index] = shipId + 1; }); placed = true;
    }
    if (!placed) throw new Error('Could not place the fleet. Try starting a new game.');
  }
  return board;
}

export function createBattleshipGame(random = Math.random) {
  return {
    playerFleet: createBattleshipFleet(random),
    enemyFleet: createBattleshipFleet(random),
    playerShots: Array(BATTLESHIP_SIZE * BATTLESHIP_SIZE).fill(0),
    enemyShots: Array(BATTLESHIP_SIZE * BATTLESHIP_SIZE).fill(0),
    over: false,
    winner: null,
    turns: 0,
  };
}

export function fireBattleshipShot(fleet, shots, index) {
  if (!Array.isArray(fleet) || fleet.length !== BATTLESHIP_SIZE ** 2 || !Array.isArray(shots) || shots.length !== fleet.length
      || !Number.isInteger(index) || index < 0 || index >= fleet.length || shots[index] !== 0) return null;
  const nextShots = shots.slice();
  nextShots[index] = fleet[index] === 0 ? -1 : fleet[index];
  const shipIds = [...new Set(fleet.filter(Boolean))];
  const isSunk = (shotMarks, shipId) => fleet.every((cell, cellIndex) => cell !== shipId || shotMarks[cellIndex] === shipId);
  const sunk = shipIds.filter((shipId) => !isSunk(shots, shipId) && isSunk(nextShots, shipId));
  return { shots: nextShots, hit: fleet[index] !== 0, sunk, allSunk: shipIds.every((shipId) => isSunk(nextShots, shipId)) };
}

export function chooseBattleshipTarget(shots, random = Math.random) {
  if (!Array.isArray(shots) || shots.length !== BATTLESHIP_SIZE ** 2 || typeof random !== 'function') return -1;
  const available = shots.flatMap((mark, index) => mark === 0 ? [index] : []);
  return available.length ? available[randomIndex(available.length, random)] : -1;
}

export function playBattleshipTurn(game, targetIndex, random = Math.random) {
  if (!game || game.over || !Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= BATTLESHIP_SIZE ** 2) return null;
  const playerResult = fireBattleshipShot(game.enemyFleet, game.playerShots, targetIndex);
  if (!playerResult) return null;
  const next = { ...game, playerShots: playerResult.shots, turns: game.turns + 1 };
  if (playerResult.allSunk) return { game: { ...next, over: true, winner: 'player' }, playerHit: playerResult.hit, playerSunk: playerResult.sunk.length, enemyShot: null };
  const enemyShot = chooseBattleshipTarget(next.enemyShots, random);
  if (enemyShot < 0) return null;
  const enemyResult = fireBattleshipShot(next.playerFleet, next.enemyShots, enemyShot);
  const finished = enemyResult.allSunk;
  return {
    game: { ...next, enemyShots: enemyResult.shots, over: finished, winner: finished ? 'computer' : null },
    playerHit: playerResult.hit,
    playerSunk: playerResult.sunk.length,
    enemyShot: { index: enemyShot, hit: enemyResult.hit, sunk: enemyResult.sunk.length },
  };
}
