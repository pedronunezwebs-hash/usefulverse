export const SHUT_BOX_TILES = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const validDiceRules = new Set(['two-dice', 'one-after-high', 'one-when-sum-six']);
const assert = (condition, message) => { if (!condition) throw new RangeError(message); };

function freezeGame(game) {
  return Object.freeze({
    ...game,
    players: Object.freeze(game.players.map((player) => Object.freeze({ ...player, open: Object.freeze([...player.open]), scores: Object.freeze([...player.scores]) }))),
    dice: Object.freeze([...game.dice]), selected: Object.freeze([...game.selected]),
  });
}

export function legalShutBoxCombinations(openTiles, total) {
  if (!Array.isArray(openTiles) || !Number.isInteger(total) || total < 1) return [];
  const tiles = [...new Set(openTiles.filter((tile) => Number.isInteger(tile) && tile >= 1 && tile <= 9))].sort((a, b) => a - b);
  const combinations = [];
  const visit = (start, sum, selected) => {
    if (sum === total) { combinations.push(selected); return; }
    if (sum > total) return;
    for (let index = start; index < tiles.length; index += 1) visit(index + 1, sum + tiles[index], [...selected, tiles[index]]);
  };
  visit(0, 0, []);
  return combinations;
}

export function shutBoxDiceCount(openTiles, rule = 'one-after-high') {
  assert(validDiceRules.has(rule), 'Unknown Shut the Box dice rule.');
  if (rule === 'two-dice') return 2;
  if (rule === 'one-after-high') return openTiles.length > 0 && openTiles.every((tile) => tile <= 6) ? 1 : 2;
  return openTiles.reduce((sum, tile) => sum + tile, 0) <= 6 ? 1 : 2;
}

export function createShutBoxGame({ mode = 'practice', diceRule = 'one-after-high', rounds = 1, seed = 1 } = {}) {
  assert(mode === 'practice' || mode === 'computer', 'Choose solo practice or play against the computer.');
  assert(validDiceRules.has(diceRule), 'Unknown Shut the Box dice rule.');
  assert([1, 3, 5].includes(rounds), 'Choose 1, 3, or 5 rounds.');
  assert(Number.isInteger(seed) && seed >= 0 && seed <= 0xffffffff, 'Seed must be a 32-bit unsigned integer.');
  const players = [{ id: 'you', kind: 'human', open: [...SHUT_BOX_TILES], scores: [] }];
  if (mode === 'computer') players.push({ id: 'cpu', kind: 'computer', open: [...SHUT_BOX_TILES], scores: [] });
  return freezeGame({ mode, diceRule, rounds, round: 1, players, activePlayer: 0, seed: seed >>> 0, stage: 'rolling', dice: [], selected: [], turnScore: null, winner: null });
}

function nextRandom(seed) {
  let value = seed >>> 0;
  value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
  return value >>> 0;
}

export function rollShutBoxDice(game, dice = null) {
  assert(game?.stage === 'rolling', 'Roll only when a turn is ready for dice.');
  const player = game.players[game.activePlayer];
  assert(player?.kind === 'human', 'The computer controls its own turn.');
  const count = shutBoxDiceCount(player.open, game.diceRule);
  assert(dice === null || (Array.isArray(dice) && dice.length === count && dice.every((face) => Number.isInteger(face) && face >= 1 && face <= 6)), `This turn needs ${count} six-sided ${count === 1 ? 'die' : 'dice'}.`);
  let seed = game.seed;
  const faces = dice ?? Array.from({ length: count }, () => { seed = nextRandom(seed || 0x9e3779b9); return (seed % 6) + 1; });
  const total = faces.reduce((sum, face) => sum + face, 0);
  const moves = legalShutBoxCombinations(player.open, total);
  if (!moves.length) return finishTurn(freezeGame({ ...game, seed, dice: faces, selected: [], stage: 'turn-complete' }));
  return freezeGame({ ...game, seed, dice: faces, selected: [], stage: 'selecting' });
}

function finishTurn(game, open = game.players[game.activePlayer].open) {
  const players = game.players.map((player, index) => index === game.activePlayer ? { ...player, open: [...open], scores: [...player.scores, open.reduce((sum, tile) => sum + tile, 0)] } : player);
  return freezeGame({ ...game, players, stage: 'turn-complete', turnScore: open.reduce((sum, tile) => sum + tile, 0) });
}

export function toggleShutBoxTile(game, tile) {
  assert(game?.stage === 'selecting', 'Choose tiles only after a roll with a legal move.');
  const player = game.players[game.activePlayer];
  assert(player.kind === 'human', 'The computer controls its own turn.');
  assert(player.open.includes(tile), 'That tile is already closed or is not on the board.');
  const selected = game.selected.includes(tile) ? game.selected.filter((item) => item !== tile) : [...game.selected, tile];
  return freezeGame({ ...game, selected });
}

export function applyShutBoxSelection(game, tiles = game?.selected) {
  assert(game?.stage === 'selecting', 'There is no pending dice selection.');
  const player = game.players[game.activePlayer];
  assert(player.kind === 'human', 'The computer controls its own turn.');
  const total = game.dice.reduce((sum, face) => sum + face, 0);
  const chosen = [...new Set(tiles ?? [])];
  assert(chosen.length > 0 && chosen.length === (tiles ?? []).length, 'Choose one or more distinct tiles.');
  assert(chosen.every((tile) => player.open.includes(tile)), 'Choose only tiles that are still open.');
  assert(chosen.reduce((sum, tile) => sum + tile, 0) === total, 'The selected tiles must equal the dice total.');
  const open = player.open.filter((tile) => !chosen.includes(tile));
  if (!open.length) {
    const players = game.players.map((item, index) => index === game.activePlayer ? { ...item, open: [], scores: [...item.scores, 0] } : item);
    return freezeGame({ ...game, players, stage: 'round-complete', turnScore: 0, winner: game.activePlayer });
  }
  const players = game.players.map((item, index) => index === game.activePlayer ? { ...item, open } : item);
  return freezeGame({ ...game, players, dice: [], selected: [], stage: 'rolling', turnScore: null });
}

export function chooseComputerShutBoxMove(openTiles, total) {
  const moves = legalShutBoxCombinations(openTiles, total);
  if (!moves.length) return null;
  return [...moves].sort((left, right) => {
    const removedLeft = left.reduce((sum, tile) => sum + tile, 0);
    const removedRight = right.reduce((sum, tile) => sum + tile, 0);
    return removedRight - removedLeft || right.length - left.length || left.join(',').localeCompare(right.join(','));
  })[0];
}

export function playComputerShutBoxTurn(game) {
  assert(game?.stage === 'rolling' && game.players[game.activePlayer]?.kind === 'computer', 'It is not the computer’s turn.');
  let state = game;
  while (state.stage === 'rolling') {
    const player = state.players[state.activePlayer];
    const count = shutBoxDiceCount(player.open, state.diceRule);
    let seed = state.seed;
    const dice = Array.from({ length: count }, () => { seed = nextRandom(seed || 0x9e3779b9); return (seed % 6) + 1; });
    const total = dice.reduce((sum, face) => sum + face, 0);
    const moves = legalShutBoxCombinations(player.open, total);
    if (!moves.length) return finishTurn(freezeGame({ ...state, seed, dice, stage: 'turn-complete' }));
    const chosen = chooseComputerShutBoxMove(player.open, total);
    const open = player.open.filter((tile) => !chosen.includes(tile));
    if (!open.length) {
      const players = state.players.map((item, index) => index === state.activePlayer ? { ...item, open: [], scores: [...item.scores, 0] } : item);
      return freezeGame({ ...state, seed, players, dice, stage: 'round-complete', turnScore: 0, winner: state.activePlayer });
    }
    state = freezeGame({ ...state, seed, players: state.players.map((item, index) => index === state.activePlayer ? { ...item, open } : item), dice: [], selected: [], stage: 'rolling' });
  }
  return state;
}

export function advanceShutBoxTurn(game) {
  assert(game?.stage === 'turn-complete', 'Finish the current turn before advancing.');
  const next = game.activePlayer + 1;
  if (next >= game.players.length) return freezeGame({ ...game, stage: 'round-complete', dice: [], selected: [] });
  return freezeGame({ ...game, activePlayer: next, stage: 'rolling', dice: [], selected: [], turnScore: null });
}

export function advanceShutBoxRound(game) {
  assert(game?.stage === 'round-complete' && game.round < game.rounds, 'There is no next round.');
  return freezeGame({ ...game, round: game.round + 1, players: game.players.map((player) => ({ ...player, open: [...SHUT_BOX_TILES] })), activePlayer: 0, stage: 'rolling', dice: [], selected: [], turnScore: null, winner: null });
}
