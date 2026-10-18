export const SOKOBAN_LEVELS = Object.freeze([
  Object.freeze({ name: 'First push', map: Object.freeze(['#####', '#@$.#', '#####']), solution: 'R' }),
  Object.freeze({ name: 'Up the lane', map: Object.freeze(['#####', '# . #', '# $ #', '# @ #', '#####']), solution: 'U' }),
]);
export const SOKOBAN_DIRECTIONS = Object.freeze({ up: Object.freeze({ x: 0, y: -1 }), down: Object.freeze({ x: 0, y: 1 }), left: Object.freeze({ x: -1, y: 0 }), right: Object.freeze({ x: 1, y: 0 }) });
const MAX_MOVES = 10000;

export function createSokoban(levelIndex = 0) {
  if (!Number.isInteger(levelIndex) || levelIndex < 0 || levelIndex >= SOKOBAN_LEVELS.length) throw new RangeError('Choose an available level.');
  const level = SOKOBAN_LEVELS[levelIndex];
  const width = level.map[0]?.length ?? 0;
  if (!width || level.map.some((row) => row.length !== width)) throw new Error('The level must be a rectangular map.');
  const walls = new Set();
  const goals = new Set();
  const boxes = new Set();
  let player = null;
  level.map.forEach((row, y) => [...row].forEach((tile, x) => {
    const key = x + ',' + y;
    if (tile === '#') walls.add(key);
    else if (tile === '.') goals.add(key);
    else if (tile === '$') boxes.add(key);
    else if (tile === '*') { boxes.add(key); goals.add(key); }
    else if (tile === '@') player = key;
    else if (tile === '+') { player = key; goals.add(key); }
    else if (tile !== ' ') throw new Error('Unknown map tile: ' + tile);
  }));
  if (!player || !boxes.size || boxes.size !== goals.size) throw new Error('A level needs one player and matching non-empty box and goal sets.');
  return Object.freeze({ levelIndex, width, height: level.map.length, walls, goals, boxes, player, moves: 0, pushes: 0, solved: [...boxes].every((box) => goals.has(box)), history: Object.freeze([]) });
}

export function moveSokoban(game, direction) {
  const delta = SOKOBAN_DIRECTIONS[direction];
  if (!game || !delta || game.solved || game.moves >= MAX_MOVES) return game;
  const [x, y] = game.player.split(',').map(Number);
  const target = (x + delta.x) + ',' + (y + delta.y);
  if (game.walls.has(target)) return game;
  const boxes = new Set(game.boxes);
  let pushes = game.pushes;
  if (boxes.has(target)) {
    const beyond = (x + delta.x * 2) + ',' + (y + delta.y * 2);
    if (game.walls.has(beyond) || boxes.has(beyond)) return game;
    boxes.delete(target);
    boxes.add(beyond);
    pushes += 1;
  }
  const previous = Object.freeze({ player: game.player, boxes: game.boxes, moves: game.moves, pushes: game.pushes, solved: game.solved });
  return Object.freeze({
    ...game,
    player: target,
    boxes,
    moves: game.moves + 1,
    pushes,
    solved: [...boxes].every((box) => game.goals.has(box)),
    history: Object.freeze([...game.history, previous]),
  });
}

export function undoSokoban(game) {
  if (!game?.history?.length) return game;
  const previous = game.history.at(-1);
  return Object.freeze({ ...game, ...previous, history: Object.freeze(game.history.slice(0, -1)) });
}

export function getSokobanTile(game, x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= game.width || y >= game.height) return 'wall';
  const key = x + ',' + y;
  if (game.walls.has(key)) return 'wall';
  if (game.boxes.has(key)) return game.goals.has(key) ? 'box-on-goal' : 'box';
  if (game.player === key) return game.goals.has(key) ? 'player-on-goal' : 'player';
  return game.goals.has(key) ? 'goal' : 'floor';
}
