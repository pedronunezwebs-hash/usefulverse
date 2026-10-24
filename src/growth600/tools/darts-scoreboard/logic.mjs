const board = Object.freeze([
  ...Array.from({ length: 20 }, (_, index) => ({ code: `S${index + 1}`, points: index + 1, double: false })),
  ...Array.from({ length: 20 }, (_, index) => ({ code: `D${index + 1}`, points: (index + 1) * 2, double: true })),
  ...Array.from({ length: 20 }, (_, index) => ({ code: `T${index + 1}`, points: (index + 1) * 3, double: false })),
  { code: 'SB', points: 25, double: false }, { code: 'DB', points: 50, double: true },
]);
const byCode = new Map(board.map((dart) => [dart.code, dart]));

export function parseDartScores(input) {
  if (typeof input !== 'string') throw Object.assign(new TypeError('Enter dart notation.'), { code: 'invalidDarts' });
  const tokens = input.trim().toUpperCase().split(/[\s,;]+/u).filter(Boolean);
  if (!tokens.length || tokens.length > 3) throw Object.assign(new RangeError('Enter one to three dart scores.'), { code: 'invalidDarts' });
  return Object.freeze(tokens.map((token) => {
    if (token === '0') return Object.freeze({ code: '0', points: 0, double: false });
    const dart = byCode.get(token);
    if (!dart) throw Object.assign(new RangeError(`Unsupported dart segment: ${token}`), { code: 'invalidDarts' });
    return dart;
  }));
}

export function createDartsGame({ startScore = 501, players = ['Player 1'] } = {}) {
  const starting = Number(startScore);
  if (![301, 501].includes(starting)) throw Object.assign(new RangeError('Starting score must be 301 or 501.'), { code: 'invalidDarts' });
  if (!Array.isArray(players) || players.length < 1 || players.length > 4 || players.some((name) => typeof name !== 'string' || !name.trim() || name.trim().length > 32)) {
    throw Object.assign(new RangeError('Enter one to four player names, up to 32 characters each.'), { code: 'invalidDarts' });
  }
  const names = players.map((name) => name.trim());
  if (new Set(names.map((name) => name.toLocaleLowerCase())).size !== names.length) throw Object.assign(new RangeError('Player names must be unique.'), { code: 'invalidDarts' });
  return Object.freeze({ startScore: starting, players: Object.freeze(names), scores: Object.freeze(names.map(() => starting)), currentPlayer: 0, winner: null, visits: Object.freeze([]) });
}

export function recordDartsVisit(game, notation) {
  if (!game || game.winner !== null) throw Object.assign(new RangeError('The leg is finished.'), { code: 'gameFinished' });
  const darts = parseDartScores(notation);
  const before = game.scores[game.currentPlayer];
  const points = darts.reduce((sum, dart) => sum + dart.points, 0);
  const remaining = before - points;
  const bust = remaining < 0 || remaining === 1 || (remaining === 0 && !darts.at(-1).double);
  const won = remaining === 0 && !bust;
  const scores = [...game.scores];
  if (!bust) scores[game.currentPlayer] = remaining;
  const visit = Object.freeze({
    player: game.currentPlayer, darts: Object.freeze(darts.map(({ code }) => code)), points,
    scoreBefore: before, scoreAfter: scores[game.currentPlayer], bust, won,
    scoresBefore: game.scores, currentPlayerBefore: game.currentPlayer, winnerBefore: game.winner,
  });
  const visits = [...game.visits, visit].slice(-500);
  const currentPlayer = won || game.players.length === 1 ? game.currentPlayer : (game.currentPlayer + 1) % game.players.length;
  return Object.freeze({ ...game, scores: Object.freeze(scores), currentPlayer, winner: won ? game.currentPlayer : null, visits: Object.freeze(visits) });
}

export function undoDartsVisit(game) {
  const visit = game?.visits?.at(-1);
  if (!visit) return game;
  return Object.freeze({ ...game, scores: visit.scoresBefore, currentPlayer: visit.currentPlayerBefore, winner: visit.winnerBefore, visits: Object.freeze(game.visits.slice(0, -1)) });
}

export function suggestDartsCheckouts(score, limit = 5) {
  const target = Number(score);
  if (!Number.isInteger(target) || target < 2 || target > 170) return Object.freeze([]);
  const finishers = board.filter((dart) => dart.double);
  const routes = new Set();
  for (const finish of finishers) if (finish.points === target) routes.add(finish.code);
  if (routes.size < limit) {
    for (const first of board) {
      for (const finish of finishers) if (first.points + finish.points === target) routes.add(`${first.code} ${finish.code}`);
    }
  }
  if (routes.size < limit) {
    for (const first of board) {
      for (const second of board) {
        for (const finish of finishers) if (first.points + second.points + finish.points === target) routes.add(`${first.code} ${second.code} ${finish.code}`);
      }
    }
  }
  const routeList = [...routes].sort((a, b) => a.split(' ').length - b.split(' ').length || a.localeCompare(b, 'en'));
  return Object.freeze(routeList.slice(0, Math.min(5, Math.max(1, limit))));
}
