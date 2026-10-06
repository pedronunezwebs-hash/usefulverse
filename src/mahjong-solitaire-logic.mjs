const WIDTH = 8;
const HEIGHT = 6;
const SUITS = ['●', '◆', '▰'];
const VALUES = Array.from({ length: 8 }, (_, index) => index + 1);
const makeTile = (value, suit) => `${SUITS[suit]}${value}`;

function isFree(board, index) {
  if (board[index] == null) return false;
  const row = Math.floor(index / WIDTH);
  const column = index % WIDTH;
  const leftBlocked = column > 0 && board[index - 1] != null;
  const rightBlocked = column < WIDTH - 1 && board[index + 1] != null;
  return !leftBlocked || !rightBlocked;
}

function randomIndex(length, random) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a value from 0 up to 1.');
  return Math.floor(value * length);
}

export function createMahjongGame(random = Math.random) {
  const board = Array(WIDTH * HEIGHT).fill(true);
  const pairs = [];
  const tileTypes = VALUES.slice(0, 4).flatMap((value) => SUITS.map((_, suit) => makeTile(value, suit)));
  for (let pair = 0; pair < 24; pair += 1) {
    const free = board.map((tile, index) => tile && isFree(board, index) ? index : -1).filter((index) => index >= 0);
    if (free.length < 2) throw new Error('Could not generate a removable tile pair.');
    const firstOffset = randomIndex(free.length, random);
    const first = free[firstOffset];
    const remaining = free.filter((index) => index !== first);
    const second = remaining[randomIndex(remaining.length, random)];
    board[first] = null;
    board[second] = null;
    pairs.push([first, second, tileTypes[pair % tileTypes.length]]);
  }
  const tiles = Array(WIDTH * HEIGHT).fill(null);
  for (const [first, second, tile] of pairs) { tiles[first] = tile; tiles[second] = tile; }
  // Shuffle faces across the fixed, solvable removal pairs without changing their equality.
  // Each pair has its own symbol; only the location pair is prescribed by the generator.
  return Object.freeze({ width: WIDTH, height: HEIGHT, tiles: Object.freeze(tiles), solution: Object.freeze(pairs.map(([first, second]) => Object.freeze([first, second]))) });
}

export function isMahjongTileFree(game, index) {
  if (!game?.tiles || !Number.isInteger(index) || index < 0 || index >= game.tiles.length || game.tiles[index] == null) return false;
  return isFree(game.tiles, index);
}

export function selectMahjongTile(game, selected, index) {
  if (!game?.tiles || !Number.isInteger(index) || index < 0 || index >= game.tiles.length) throw new RangeError('Choose a tile on the board.');
  if (game.tiles[index] == null) return { game, selected: null, status: 'empty' };
  if (!isMahjongTileFree(game, index)) return { game, selected, status: 'blocked' };
  if (selected == null || selected === index) return { game, selected: selected === index ? null : index, status: selected === index ? 'deselected' : 'selected' };
  if (game.tiles[selected] !== game.tiles[index]) return { game, selected: index, status: 'mismatch' };
  const tiles = [...game.tiles]; tiles[selected] = null; tiles[index] = null;
  const next = Object.freeze({ ...game, tiles: Object.freeze(tiles) });
  return { game: next, selected: null, status: tiles.every((tile) => tile == null) ? 'won' : 'matched' };
}

export function getMahjongTileLabel(tile) {
  if (typeof tile !== 'string' || !/^[●◆▰][1-8]$/u.test(tile)) return null;
  return { suit: tile[0], value: Number(tile[1]) };
}
