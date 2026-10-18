const validDie = (value) => Number.isInteger(value) && value >= 1 && value <= 6;

export function scoreFarkleDice(dice, scoringVariant = 'fixed') {
  if (!Array.isArray(dice) || dice.length < 1 || dice.length > 6 || dice.some((die) => !validDie(die))) throw new RangeError('Provide one to six valid dice.');
  if (!['fixed', 'doubling'].includes(scoringVariant)) throw new RangeError('Choose a supported Farkle scoring table.');
  const counts = Array(7).fill(0); for (const die of dice) counts[die] += 1;
  if (dice.length === 6 && counts.slice(1).every((count) => count === 1)) return Object.freeze({ score: 1500, scoringDice: dice.length, label: 'straight' });
  if (dice.length === 6 && counts.slice(1).filter((count) => count === 2).length === 3) return Object.freeze({ score: 1500, scoringDice: 6, label: 'threePairs' });
  if (dice.length === 6 && counts.slice(1).filter((count) => count === 3).length === 2) return Object.freeze({ score: 2500, scoringDice: 6, label: 'twoTriplets' });
  if (scoringVariant === 'fixed' && dice.length === 6 && counts.slice(1).includes(4) && counts.slice(1).some((count) => count === 2)) return Object.freeze({ score: 1500, scoringDice: 6, label: 'fourAndPair' });
  let score = 0; let scoringDice = 0; const remaining = [...counts];
  for (let face = 1; face <= 6; face += 1) if (remaining[face] >= 3) {
    const number = remaining[face];
    const triple = scoringVariant === 'fixed' ? (face === 1 ? 300 : face * 100) : (face === 1 ? 1000 : face * 100);
    const largerSet = scoringVariant === 'fixed' ? ({ 4: 1000, 5: 2000, 6: 3000 })[number] : triple * 2 ** (number - 3);
    score += number === 3 ? triple : largerSet; scoringDice += number; remaining[face] = 0;
  }
  for (const [face, value] of [[1, 100], [5, 50]]) { score += remaining[face] * value; scoringDice += remaining[face]; }
  return Object.freeze({ score, scoringDice, label: score ? 'scoring' : 'farkle' });
}

function randomFor(seed) {
  let value = seed >>> 0;
  return () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296; };
}

export function createFarkleGame({ seed = Date.now(), names = ['You', 'Computer'], cpuPlayers = [false, true], targetScore = 10000, entryScore = 500, scoringVariant = 'fixed' } = {}) {
  if (!Number.isSafeInteger(seed) || !Array.isArray(names) || names.length < 1 || names.length > 4 || names.some((name) => typeof name !== 'string' || !name.trim() || name.length > 24) || !Array.isArray(cpuPlayers) || cpuPlayers.length !== names.length || cpuPlayers.some((value) => typeof value !== 'boolean') || (names.length === 1 && cpuPlayers[0]) || !Number.isInteger(targetScore) || targetScore < 1000 || targetScore > 100000 || !Number.isInteger(entryScore) || entryScore < 100 || entryScore > targetScore || !['fixed', 'doubling'].includes(scoringVariant)) throw new RangeError('Invalid Farkle game settings.');
  const rng = randomFor(seed);
  const players = names.map((name, id) => Object.freeze({ id, name: name.trim(), total: 0, opened: false, cpu: cpuPlayers[id] }));
  return Object.freeze({ players, currentPlayer: 0, turnPoints: 0, dice: [], remainingDice: 6, targetScore, entryScore, scoringVariant, seed: seed >>> 0, rngState: rng() * 4294967296 >>> 0, status: 'playing', lastOutcome: null, scoreSheet: [] });
}

function rollValues(game, count) {
  const random = randomFor(game.rngState);
  const dice = Array.from({ length: count }, () => 1 + Math.floor(random() * 6));
  return { dice, rngState: random() * 4294967296 >>> 0 };
}

function nextTurn(game, outcome) {
  const current = game.players[game.currentPlayer];
  const scoreSheet = outcome === 'farkle' ? [...(game.scoreSheet ?? []), Object.freeze({ player: current.name, points: game.turnPoints, total: current.total, outcome: 'farkle' })] : game.scoreSheet;
  return Object.freeze({ ...game, scoreSheet, currentPlayer: (game.currentPlayer + 1) % game.players.length, turnPoints: 0, dice: [], remainingDice: 6, lastOutcome: outcome });
}

export function rollFarkle(game) {
  if (!game || game.status !== 'playing' || game.dice.length) throw new RangeError('Hold scoring dice or end the turn before rolling.');
  const rolled = rollValues(game, game.remainingDice);
  if (scoreFarkleDice(rolled.dice, game.scoringVariant).score === 0) return nextTurn({ ...game, rngState: rolled.rngState }, 'farkle');
  return Object.freeze({ ...game, dice: rolled.dice, rngState: rolled.rngState, lastOutcome: null });
}

export function holdFarkleDice(game, indexes) {
  if (!game || game.status !== 'playing' || !Array.isArray(indexes) || !game.dice.length || indexes.length < 1 || indexes.length > game.dice.length || new Set(indexes).size !== indexes.length || indexes.some((index) => !Number.isInteger(index) || index < 0 || index >= game.dice.length)) throw new RangeError('Select one or more dice from this roll.');
  const selected = indexes.map((index) => game.dice[index]); const scored = scoreFarkleDice(selected, game.scoringVariant);
  if (scored.score === 0 || scored.scoringDice !== selected.length) throw new RangeError('Every selected die must score under the displayed rules.');
  const remaining = game.dice.length - indexes.length;
  return Object.freeze({ ...game, turnPoints: game.turnPoints + scored.score, dice: [], remainingDice: remaining || 6, lastOutcome: remaining ? null : 'hotDice' });
}

export function bankFarkle(game) {
  if (!game || game.status !== 'playing' || game.dice.length || game.turnPoints < 1) throw new RangeError('Hold scoring dice before banking points.');
  const current = game.players[game.currentPlayer];
  if (!current.opened && current.total + game.turnPoints < game.entryScore) throw new RangeError(`Reach ${game.entryScore} points before banking your first score.`);
  const total = current.total + game.turnPoints;
  const players = game.players.map((player, index) => index === game.currentPlayer ? Object.freeze({ ...player, total, opened: true }) : player);
  const winner = total >= game.targetScore ? game.currentPlayer : null;
  const scoreSheet = [...(game.scoreSheet ?? []), Object.freeze({ player: current.name, points: game.turnPoints, total, outcome: 'banked' })];
  return Object.freeze({ ...nextTurn({ ...game, players, scoreSheet, status: winner === null ? 'playing' : 'won', winner }, 'banked'), status: winner === null ? 'playing' : 'won', winner });
}

export function playFarkleCpuTurn(source) {
  if (!source || source.status !== 'playing' || !source.players[source.currentPlayer]?.cpu || source.dice.length) throw new RangeError('It is not the CPU turn.');
  let game = source; let rolls = 0;
  while (rolls < 12 && game.status === 'playing' && game.currentPlayer === source.currentPlayer) {
    game = rollFarkle(game); rolls += 1;
    if (game.lastOutcome === 'farkle') return game;
    const fullRollScore = scoreFarkleDice(game.dice, game.scoringVariant);
    const scored = game.dice.map((die, index) => ({ die, index }));
    const counts = new Map(); for (const { die } of scored) counts.set(die, (counts.get(die) ?? 0) + 1);
    const selection = fullRollScore.scoringDice === game.dice.length ? scored.map(({ index }) => index) : scored.filter(({ die }) => counts.get(die) >= 3 || die === 1 || die === 5).map(({ index }) => index);
    try { game = holdFarkleDice(game, selection); } catch { return nextTurn(game, 'farkle'); }
    const player = game.players[game.currentPlayer]; const canBank = player.opened || player.total + game.turnPoints >= game.entryScore;
    if (canBank && (game.turnPoints >= 600 || player.total + game.turnPoints >= game.targetScore || rolls >= 6)) return bankFarkle(game);
  }
  const player = game.players[game.currentPlayer];
  if (game.turnPoints && (player.opened || player.total + game.turnPoints >= game.entryScore)) return bankFarkle(game);
  return nextTurn(game, 'farkle');
}
