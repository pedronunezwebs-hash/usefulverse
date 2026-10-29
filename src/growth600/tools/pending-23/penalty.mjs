const DIRECTIONS = new Set(['left', 'center', 'right']);
function roll(random) { const value = random(); if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a value from 0 up to 1.'); return value; }
export function newPenaltyShootout() { return Object.freeze({ turn: 0, playerGoals: 0, cpuGoals: 0, playerShots: 0, cpuShots: 0, history: Object.freeze([]), complete: false, winner: '' }); }
export function playPenaltyTurn(game, direction, random = Math.random) {
  if (!game || game.complete || !DIRECTIONS.has(direction) || typeof random !== 'function') throw new RangeError('Choose a direction in an active shootout.');
  const playerShoots = game.turn % 2 === 0;
  const opponentDirection = ['left', 'center', 'right'][Math.floor(roll(random) * 3)];
  const shotDirection = playerShoots ? direction : opponentDirection;
  const keeperDirection = playerShoots ? opponentDirection : direction;
  const goal = shotDirection !== keeperDirection;
  const playerGoals = game.playerGoals + (playerShoots && goal ? 1 : 0);
  const cpuGoals = game.cpuGoals + (!playerShoots && goal ? 1 : 0);
  const playerShots = game.playerShots + (playerShoots ? 1 : 0);
  const cpuShots = game.cpuShots + (playerShoots ? 0 : 1);
  let winner = '';
  if (playerShots >= 5 && cpuShots >= 5 && playerShots === cpuShots && playerGoals !== cpuGoals) winner = playerGoals > cpuGoals ? 'player' : 'cpu';
  if (playerShots < 5 && cpuShots >= 5 && cpuGoals > playerGoals + (5 - playerShots)) winner = 'cpu';
  if (cpuShots < 5 && playerShots >= 5 && playerGoals > cpuGoals + (5 - cpuShots)) winner = 'player';
  const shot = Object.freeze({ shooter: playerShoots ? 'player' : 'cpu', direction: shotDirection, saved: !goal });
  return Object.freeze({ turn: game.turn + 1, playerGoals, cpuGoals, playerShots, cpuShots, history: Object.freeze([...game.history, shot]), complete: Boolean(winner), winner });
}
