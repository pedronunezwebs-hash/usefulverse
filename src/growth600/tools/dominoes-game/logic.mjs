export const DOMINO_SET_SIZE = 28;
export const DOMINO_HAND_SIZE = 7;

function randomIndex(random, length) {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number from 0 (inclusive) to 1 (exclusive).');
  return Math.floor(value * length);
}

export function createDoubleSixSet() {
  const tiles = [];
  for (let a = 0; a <= 6; a += 1) for (let b = a; b <= 6; b += 1) tiles.push({ id: `${a}-${b}`, a, b });
  return tiles;
}

export function createDominoGame({ mode = 'computer', variant = 'draw', random = Math.random } = {}) {
  if (!['computer', 'two-player'].includes(mode)) throw new RangeError('Choose computer or two-player mode.');
  if (!['draw', 'block'].includes(variant)) throw new RangeError('Choose draw or block rules.');
  if (typeof random !== 'function') throw new TypeError('Random source must be a function.');
  const tiles = createDoubleSixSet();
  for (let index = tiles.length - 1; index > 0; index -= 1) {
    const swap = randomIndex(random, index + 1);
    [tiles[index], tiles[swap]] = [tiles[swap], tiles[index]];
  }
  const hands = [tiles.slice(0, DOMINO_HAND_SIZE), tiles.slice(DOMINO_HAND_SIZE, DOMINO_HAND_SIZE * 2)];
  const stock = tiles.slice(DOMINO_HAND_SIZE * 2);
  const dealt = [...hands[0].map((tile) => ({ ...tile, owner: 0 })), ...hands[1].map((tile) => ({ ...tile, owner: 1 }))];
  const openingTile = dealt.filter(({ a, b }) => a === b).sort((left, right) => right.a - left.a)[0]
    ?? dealt.slice().sort((left, right) => right.a + right.b - (left.a + left.b) || right.a - left.a)[0];
  const currentPlayer = openingTile.owner;
  return { hands, stock, board: [], currentPlayer, openingTileId: openingTile.id, mode, variant, over: false, winner: null, reason: null, lastAction: 'start' };
}

function findTile(game, player, tileId) {
  return game?.hands?.[player]?.find((tile) => tile.id === tileId) ?? null;
}

export function legalDominoMoves(game, player = game?.currentPlayer) {
  if (!game || game.over || ![0, 1].includes(player) || !Array.isArray(game.hands?.[player])) return [];
  const left = game.board.length ? game.board[0].a : null;
  const right = game.board.length ? game.board.at(-1).b : null;
  const moves = [];
  for (const tile of game.hands[player]) {
    if (left === null) {
      if (tile.id === game.openingTileId) moves.push({ tileId: tile.id, side: 'right', a: tile.a, b: tile.b });
    }
    else {
      if (tile.b === left) moves.push({ tileId: tile.id, side: 'left', a: tile.a, b: tile.b });
      if (tile.a === left && tile.a !== tile.b) moves.push({ tileId: tile.id, side: 'left', a: tile.b, b: tile.a });
      if (tile.a === right) moves.push({ tileId: tile.id, side: 'right', a: tile.a, b: tile.b });
      if (tile.b === right && tile.a !== tile.b) moves.push({ tileId: tile.id, side: 'right', a: tile.b, b: tile.a });
    }
  }
  return moves;
}

function finishIfNeeded(game, player, reason) {
  const emptyHand = game.hands[player].length === 0;
  const noMoves = (game.variant === 'block' || game.stock.length === 0)
    && legalDominoMoves(game, 0).length === 0
    && legalDominoMoves(game, 1).length === 0;
  if (!emptyHand && !noMoves) return game;
  const pips = game.hands.map((hand) => hand.reduce((sum, tile) => sum + tile.a + tile.b, 0));
  const winner = emptyHand
    ? (pips[player] <= pips[1 - player] ? player : 1 - player)
    : pips[0] === pips[1] ? 'tie' : pips[0] < pips[1] ? 0 : 1;
  return { ...game, over: true, winner, reason: emptyHand ? 'empty-hand' : reason };
}

export function playDomino(game, { tileId, side } = {}) {
  if (!game || game.over || !['left', 'right'].includes(side)) return null;
  const player = game.currentPlayer;
  const move = legalDominoMoves(game, player).find((candidate) => candidate.tileId === tileId && candidate.side === side);
  if (!move) return null;
  const hands = game.hands.map((hand, index) => index === player ? hand.filter((tile) => tile.id !== tileId) : hand.slice());
  const board = game.board.slice();
  const placed = { a: move.a, b: move.b, id: move.tileId };
  if (side === 'left') board.unshift(placed);
  else board.push(placed);
  let next = { ...game, hands, board, currentPlayer: 1 - player, lastAction: 'play' };
  next = finishIfNeeded(next, player, 'blocked');
  return next;
}

export function drawDomino(game) {
  if (!game || game.over || game.variant !== 'draw' || legalDominoMoves(game).length || !game.stock.length) return null;
  const stock = game.stock.slice();
  const tile = stock.shift();
  const hands = game.hands.map((hand, index) => index === game.currentPlayer ? [...hand, tile] : hand.slice());
  return { ...game, hands, stock, lastAction: 'draw' };
}

export function passDominoTurn(game) {
  if (!game || game.over || legalDominoMoves(game).length || (game.variant === 'draw' && game.stock.length)) return null;
  let next = { ...game, currentPlayer: 1 - game.currentPlayer, lastAction: 'pass' };
  next = finishIfNeeded(next, next.currentPlayer, 'blocked');
  return next;
}

export function chooseDominoMove(game) {
  const moves = legalDominoMoves(game);
  if (!moves.length) return null;
  return moves.slice().sort((left, right) => {
    const leftTile = findTile(game, game.currentPlayer, left.tileId);
    const rightTile = findTile(game, game.currentPlayer, right.tileId);
    const leftScore = (leftTile.a === leftTile.b ? 2 : 0) + leftTile.a + leftTile.b;
    const rightScore = (rightTile.a === rightTile.b ? 2 : 0) + rightTile.a + rightTile.b;
    return rightScore - leftScore || left.tileId.localeCompare(right.tileId) || left.side.localeCompare(right.side);
  })[0];
}
