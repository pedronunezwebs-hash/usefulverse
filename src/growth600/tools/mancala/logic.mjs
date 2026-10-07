export const MANCALA_PITS_PER_SIDE = 6;
export const MANCALA_SEEDS_PER_PIT = 4;
export const MANCALA_INITIAL_SEEDS = MANCALA_PITS_PER_SIDE * 2 * MANCALA_SEEDS_PER_PIT;

export function createMancalaGame(seedsPerPit = MANCALA_SEEDS_PER_PIT) {
  if (!Number.isInteger(seedsPerPit) || seedsPerPit < 1 || seedsPerPit > 12) throw new RangeError('Seeds per pit must be a whole number from 1 to 12.');
  const board = Array(14).fill(0);
  for (let pit = 0; pit < 14; pit += 1) if (pit !== 6 && pit !== 13) board[pit] = seedsPerPit;
  return { board, currentPlayer: 0, over: false, winner: null, seedsPerPit };
}

export function legalMancalaPits(game, player = game?.currentPlayer) {
  if (!game || !Array.isArray(game.board) || game.board.length !== 14 || ![0, 1].includes(player)) return [];
  const start = player === 0 ? 0 : 7;
  return Array.from({ length: 6 }, (_, offset) => start + offset).filter((pit) => game.board[pit] > 0);
}

export function playMancalaMove(game, pit) {
  if (!game || game.over || !legalMancalaPits(game).includes(pit)) return null;
  const player = game.currentPlayer;
  const ownStore = player === 0 ? 6 : 13;
  const opponentStore = player === 0 ? 13 : 6;
  const ownStart = player === 0 ? 0 : 7;
  const board = game.board.slice();
  let seeds = board[pit];
  board[pit] = 0;
  let index = pit;
  while (seeds > 0) {
    index = (index + 1) % 14;
    if (index === opponentStore) continue;
    board[index] += 1;
    seeds -= 1;
  }

  let captured = 0;
  const lastOwnPit = index >= ownStart && index < ownStart + 6;
  if (lastOwnPit && board[index] === 1) {
    const opposite = 12 - index;
    if (board[opposite] > 0) {
      captured = board[index] + board[opposite];
      board[ownStore] += captured;
      board[index] = 0;
      board[opposite] = 0;
    }
  }

  const extraTurn = index === ownStore;
  const ownSideEmpty = board.slice(ownStart, ownStart + 6).every((count) => count === 0);
  const otherStart = player === 0 ? 7 : 0;
  const otherSideEmpty = board.slice(otherStart, otherStart + 6).every((count) => count === 0);
  const over = ownSideEmpty || otherSideEmpty;
  if (over) {
    for (let offset = 0; offset < 6; offset += 1) {
      board[6] += board[offset]; board[offset] = 0;
      board[13] += board[offset + 7]; board[offset + 7] = 0;
    }
  }
  const winner = over ? (board[6] === board[13] ? 'tie' : board[6] > board[13] ? 0 : 1) : null;
  return {
    game: { ...game, board, currentPlayer: over || extraTurn ? player : 1 - player, over, winner },
    extraTurn,
    captured,
    lastPit: index,
  };
}

export function chooseMancalaMove(game, random = Math.random) {
  if (!game || typeof random !== 'function') return null;
  const candidates = legalMancalaPits(game).map((pit) => {
    const result = playMancalaMove(game, pit);
    const storeGain = result.game.board[game.currentPlayer === 0 ? 6 : 13] - game.board[game.currentPlayer === 0 ? 6 : 13];
    return { pit, score: storeGain + (result.extraTurn ? 8 : 0) + result.captured * 2 + (result.game.winner === game.currentPlayer ? 1000 : 0) };
  });
  if (!candidates.length) return null;
  const bestScore = Math.max(...candidates.map(({ score }) => score));
  const best = candidates.filter(({ score }) => score === bestScore);
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return best[Math.floor(value * best.length)].pit;
}
