export const PEG_BOARD_SIZE = 7;
export const PEG_HOLES = Object.freeze(Array.from({ length: PEG_BOARD_SIZE * PEG_BOARD_SIZE }, (_, index) => {
  const row = Math.floor(index / PEG_BOARD_SIZE);
  const column = index % PEG_BOARD_SIZE;
  return (row >= 2 && row <= 4) || (column >= 2 && column <= 4);
}));
export const PEG_START = Object.freeze(PEG_HOLES.map((_, index) => index).filter((index) => PEG_HOLES[index] && index !== 24));

export function createPegSolitaireGame() {
  return { pegs: new Set(PEG_START), moves: 0 };
}

export function pegSolitaireMoves(game) {
  if (!game || !(game.pegs instanceof Set)) return [];
  const moves = [];
  for (const from of game.pegs) {
    const row = Math.floor(from / PEG_BOARD_SIZE);
    const column = from % PEG_BOARD_SIZE;
    for (const [dr, dc] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) {
      const toRow = row + dr;
      const toColumn = column + dc;
      if (toRow < 0 || toRow >= PEG_BOARD_SIZE || toColumn < 0 || toColumn >= PEG_BOARD_SIZE) continue;
      const to = toRow * PEG_BOARD_SIZE + toColumn;
      const middle = (row + dr / 2) * PEG_BOARD_SIZE + column + dc / 2;
      if (PEG_HOLES[to] && game.pegs.has(middle) && !game.pegs.has(to)) moves.push({ from, middle, to });
    }
  }
  return moves;
}

export function playPegSolitaireMove(game, move) {
  if (!game || !move || !pegSolitaireMoves(game).some(({ from, middle, to }) => from === move.from && middle === move.middle && to === move.to)) return null;
  const pegs = new Set(game.pegs);
  pegs.delete(move.from);
  pegs.delete(move.middle);
  pegs.add(move.to);
  return { pegs, moves: game.moves + 1 };
}

export function pegSolitaireStatus(game) {
  if (!game || !(game.pegs instanceof Set)) return 'invalid';
  if (game.pegs.size === 1) return 'won';
  return pegSolitaireMoves(game).length ? 'playing' : 'no-moves';
}

export function pegSolitaireHint(game) {
  return pegSolitaireMoves(game)[0] ?? null;
}
