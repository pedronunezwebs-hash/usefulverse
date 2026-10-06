export const minesweeperDifficulties = Object.freeze({
  easy: Object.freeze({ rows: 9, columns: 9, mines: 10 }),
  medium: Object.freeze({ rows: 16, columns: 16, mines: 40 }),
  hard: Object.freeze({ rows: 16, columns: 30, mines: 99 }),
});

const randomIndex = (random, length) => {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return Math.floor(value * length);
};

export function createMinesweeperGame(difficulty = 'easy') {
  const settings = minesweeperDifficulties[difficulty];
  if (!settings) throw new RangeError('Choose easy, medium or hard difficulty.');
  return { difficulty, ...settings, cells: Array.from({ length: settings.rows * settings.columns }, () => ({ mine: false, adjacent: 0, revealed: false, flagged: false })), status: 'ready', flags: 0, revealedSafe: 0, startedAt: 0 };
}

export function neighborsOf(game, index) {
  if (!Number.isInteger(index) || index < 0 || index >= game.cells.length) return [];
  const row = Math.floor(index / game.columns); const column = index % game.columns; const result = [];
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
    if (!rowOffset && !columnOffset) continue;
    const nextRow = row + rowOffset; const nextColumn = column + columnOffset;
    if (nextRow >= 0 && nextRow < game.rows && nextColumn >= 0 && nextColumn < game.columns) result.push(nextRow * game.columns + nextColumn);
  }
  return result;
}

function placeMines(game, firstIndex, random) {
  const safe = new Set([firstIndex, ...neighborsOf(game, firstIndex)]);
  const candidates = game.cells.map((_, index) => index).filter((index) => !safe.has(index));
  if (candidates.length < game.mines) {
    safe.clear(); safe.add(firstIndex);
    candidates.splice(0, candidates.length, ...game.cells.map((_, index) => index).filter((index) => !safe.has(index)));
  }
  for (let index = 0; index < game.mines; index += 1) {
    const swap = index + randomIndex(random, candidates.length - index);
    [candidates[index], candidates[swap]] = [candidates[swap], candidates[index]];
    game.cells[candidates[index]].mine = true;
  }
  for (let index = 0; index < game.cells.length; index += 1) {
    if (game.cells[index].mine) continue;
    game.cells[index].adjacent = neighborsOf(game, index).filter((neighbor) => game.cells[neighbor].mine).length;
  }
  game.status = 'playing';
}

function finishIfWon(game, now = Date.now()) {
  if (game.revealedSafe === game.cells.length - game.mines) { game.status = 'won'; game.endedAt = now; }
  return game.status;
}

function revealFlood(game, firstIndex) {
  const queue = [firstIndex]; const queued = new Set(queue);
  while (queue.length) {
    const index = queue.pop(); const cell = game.cells[index];
    if (cell.revealed || cell.flagged || cell.mine) continue;
    cell.revealed = true; game.revealedSafe += 1;
    if (cell.adjacent === 0) for (const neighbor of neighborsOf(game, index)) if (!queued.has(neighbor)) { queued.add(neighbor); queue.push(neighbor); }
  }
}

export function revealMinesweeperCell(game, index, random = Math.random, now = Date.now()) {
  if (!Number.isInteger(index) || index < 0 || index >= game.cells.length) throw new RangeError('Choose a cell on the board.');
  if (game.status === 'won' || game.status === 'lost') return 'finished';
  const cell = game.cells[index];
  if (cell.flagged || cell.revealed) return 'ignored';
  if (game.status === 'ready') { placeMines(game, index, random); game.startedAt = now; }
  if (cell.mine) { cell.revealed = true; game.status = 'lost'; game.endedAt = now; return 'lost'; }
  revealFlood(game, index);
  return finishIfWon(game, now) === 'won' ? 'won' : 'revealed';
}

export function toggleMinesweeperFlag(game, index) {
  if (!Number.isInteger(index) || index < 0 || index >= game.cells.length) throw new RangeError('Choose a cell on the board.');
  if (game.status === 'won' || game.status === 'lost' || game.cells[index].revealed) return false;
  const cell = game.cells[index];
  if (!cell.flagged && game.flags >= game.mines) return false;
  cell.flagged = !cell.flagged; game.flags += cell.flagged ? 1 : -1;
  return true;
}

export function chordMinesweeperCell(game, index, now = Date.now()) {
  if (game.status !== 'playing' || !Number.isInteger(index) || index < 0 || index >= game.cells.length) return 'ignored';
  const cell = game.cells[index];
  if (!cell.revealed || !cell.adjacent) return 'ignored';
  const neighbors = neighborsOf(game, index);
  if (neighbors.filter((neighbor) => game.cells[neighbor].flagged).length !== cell.adjacent) return 'ignored';
  for (const neighbor of neighbors) if (!game.cells[neighbor].flagged && game.cells[neighbor].mine) { game.cells[neighbor].revealed = true; game.status = 'lost'; game.endedAt = now; return 'lost'; }
  for (const neighbor of neighbors) if (!game.cells[neighbor].flagged) revealFlood(game, neighbor);
  return finishIfWon(game, now) === 'won' ? 'won' : 'revealed';
}

export function minesweeperRemaining(game) { return game.mines - game.flags; }

export function elapsedMinesweeperSeconds(game, now = Date.now()) {
  return game.startedAt ? Math.max(0, Math.floor(((game.status === 'playing' ? now : game.endedAt ?? now) - game.startedAt) / 1000)) : 0;
}
