const SUITS = ['m', 'p', 's'];
export const MAHJONG_TILES = Object.freeze([
  ...SUITS.flatMap((suit) => Array.from({ length: 9 }, (_, index) => `${index + 1}${suit}`)),
  'E', 'S', 'W', 'N', 'Wh', 'G', 'R',
]);

function validTileCounts(tiles) {
  if (!Array.isArray(tiles) || tiles.length !== 14) return false;
  const counts = new Map();
  for (const tile of tiles) {
    if (!MAHJONG_TILES.includes(tile)) return false;
    const count = (counts.get(tile) ?? 0) + 1;
    if (count > 4) return false;
    counts.set(tile, count);
  }
  return counts;
}

function canMakeMelds(counts) {
  let first;
  for (const tile of MAHJONG_TILES) if ((counts.get(tile) ?? 0) > 0) { first = tile; break; }
  if (first === undefined) return true;

  if (counts.get(first) >= 3) {
    counts.set(first, counts.get(first) - 3);
    if (canMakeMelds(counts)) { counts.set(first, counts.get(first) + 3); return true; }
    counts.set(first, counts.get(first) + 3);
  }

  const rank = Number(first[0]);
  if (rank >= 1 && rank <= 7 && SUITS.includes(first[1])) {
    const next = `${rank + 1}${first[1]}`; const after = `${rank + 2}${first[1]}`;
    if ((counts.get(next) ?? 0) > 0 && (counts.get(after) ?? 0) > 0) {
      counts.set(first, counts.get(first) - 1); counts.set(next, counts.get(next) - 1); counts.set(after, counts.get(after) - 1);
      if (canMakeMelds(counts)) {
        counts.set(first, counts.get(first) + 1); counts.set(next, counts.get(next) + 1); counts.set(after, counts.get(after) + 1);
        return true;
      }
      counts.set(first, counts.get(first) + 1); counts.set(next, counts.get(next) + 1); counts.set(after, counts.get(after) + 1);
    }
  }
  return false;
}

export function mahjongHandWins(tiles) {
  const counts = validTileCounts(tiles);
  if (!counts) return false;
  for (const tile of MAHJONG_TILES) {
    if ((counts.get(tile) ?? 0) < 2) continue;
    counts.set(tile, counts.get(tile) - 2);
    if (canMakeMelds(counts)) { counts.set(tile, counts.get(tile) + 2); return true; }
    counts.set(tile, counts.get(tile) + 2);
  }
  return false;
}

function shuffledWall(random = Math.random) {
  const wall = MAHJONG_TILES.flatMap((tile) => Array(4).fill(tile));
  for (let index = wall.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [wall[index], wall[target]] = [wall[target], wall[index]];
  }
  return wall;
}

export function startMahjongGame(names, random = Math.random) {
  if (!Array.isArray(names) || names.length !== 4 || names.some((name) => !String(name).trim() || String(name).length > 24)) {
    throw new RangeError('Enter four player names, up to 24 characters each.');
  }
  const wall = shuffledWall(random);
  const players = names.map((name) => ({ name: String(name).trim(), hand: wall.splice(0, 13), discards: [] }));
  const dealer = Math.floor(random() * 4);
  players[dealer].hand.push(wall.shift());
  return { players, wall, dealer, turn: dealer, phase: 'discard', status: 'playing', winner: null };
}

export function drawMahjongTile(game) {
  if (game?.status !== 'playing' || game.phase !== 'draw') throw new RangeError('A tile cannot be drawn now.');
  if (!game.wall.length) return { ...game, status: 'draw' };
  const players = game.players.map((player) => ({ ...player, hand: [...player.hand], discards: [...player.discards] }));
  players[game.turn].hand.push(game.wall[0]);
  return { ...game, players, wall: game.wall.slice(1), phase: 'discard' };
}

export function discardMahjongTile(game, tileIndex) {
  if (game?.status !== 'playing' || game.phase !== 'discard') throw new RangeError('A tile cannot be discarded now.');
  const hand = game.players[game.turn].hand;
  if (!Number.isInteger(tileIndex) || tileIndex < 0 || tileIndex >= hand.length) throw new RangeError('Select a tile in the active hand.');
  const players = game.players.map((player) => ({ ...player, hand: [...player.hand], discards: [...player.discards] }));
  const [tile] = players[game.turn].hand.splice(tileIndex, 1);
  players[game.turn].discards.push(tile);
  return { ...game, players, turn: (game.turn + 1) % players.length, phase: 'draw' };
}

export function declareMahjongWin(game) {
  if (game?.status !== 'playing' || game.phase !== 'discard' || !mahjongHandWins(game.players[game.turn].hand)) {
    throw new RangeError('The active 14-tile hand does not form four sets and a pair.');
  }
  return { ...game, status: 'won', winner: game.turn };
}
