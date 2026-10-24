import { chooseMusWinner, createMusDeck, evaluateMusHand, scorePassedLance } from './logic.mjs';
const LANCES = Object.freeze(['grande', 'chica', 'pares', 'juego']);
const nextSeat = (seat) => (seat + 1) % 4;
const team = (seat) => seat % 2;
const teamRepresentative = (state, targetTeam) => targetTeam === 0 ? 0 : team(state.mano) === 1 ? state.mano : 1;
function shuffled(cards, random) {
  const result = [...cards];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const sample = Number(random());
    if (!(sample >= 0 && sample < 1)) throw new RangeError('Random source must return values in [0, 1).');
    const other = Math.floor(sample * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
function dealHand({ scores = [0, 0], mano = 0, gamesWon = [0, 0], random = Math.random } = {}) {
  const deck = shuffled(createMusDeck(), random), hands = [[], [], [], []];
  for (let pass = 0; pass < 4; pass += 1) for (let offset = 0; offset < 4; offset += 1) hands[(mano + offset) % 4].push(deck.pop());
  return { scores: [...scores], mano, gamesWon: [...gamesWon], hands, drawPile: deck, discardPile: [], phase: 'mus', turn: mano, musVotes: [], discardTurns: 0, exchangeRounds: 0, lanceIndex: 0, lanceName: null, passes: 0, betAmount: 0, betCount: 0, betTeam: null, betLastSeat: null, isOrdago: false, ordagoPreviousAmount: 0, lanceResults: [], handHistory: [] };
}
function copyState(state) {
  return { ...state, scores: [...state.scores], gamesWon: [...state.gamesWon], hands: state.hands.map((hand) => [...hand]), drawPile: [...state.drawPile], discardPile: [...state.discardPile], musVotes: [...state.musVotes], lanceResults: state.lanceResults.map((entry) => ({ ...entry })), handHistory: [...state.handHistory] };
}
function drawFor(state, count, random) {
  const next = copyState(state);
  if (next.drawPile.length < count) {
    next.drawPile = shuffled([...next.drawPile, ...next.discardPile], random);
    next.discardPile = [];
  }
  if (next.drawPile.length < count) throw new RangeError('There are not enough cards to complete this exchange.');
  return next;
}
function lanceEligible(state, lance) {
  const present = state.hands.map((hand) => { const evaluation = evaluateMusHand(hand); return lance === 'pares' ? evaluation.pairs.strength > 0 : evaluation.game > 0; });
  return [present[0] || present[2], present[1] || present[3]];
}
function prepareLance(state) {
  const next = copyState(state);
  while (next.lanceIndex < LANCES.length) {
    let lance = LANCES[next.lanceIndex];
    if (lance === 'juego') {
      const [first, second] = lanceEligible(next, 'juego');
      if (!first && !second) lance = 'punto';
    }
    if (['pares', 'juego'].includes(lance)) {
      const [first, second] = lanceEligible(next, lance);
      if (!first || !second) {
        const teamWithLance = first ? 0 : second ? 1 : null;
        next.lanceResults.push({ lance, outcome: teamWithLance === null ? 'no-qualifying-hands' : 'uncontested', team: teamWithLance, amount: 0 });
        next.lanceIndex += 1;
        continue;
      }
    }
    next.lanceName = lance; next.phase = 'betting'; next.turn = teamRepresentative(next, team(next.mano)); next.passes = 0; next.betAmount = 0; next.betCount = 0; next.betTeam = null; next.betLastSeat = null; next.isOrdago = false; next.ordagoPreviousAmount = 0;
    return next;
  }
  return settleHand(next);
}
function completeLance(state, outcome) {
  const next = copyState(state);
  next.lanceResults.push({ lance: next.lanceName, ...outcome });
  next.lanceIndex += 1;
  return prepareLance(next);
}
function teamLanceValue(state, side, lance) {
  const seats = [side, side + 2];
  return seats.reduce((sum, seat) => {
    const value = evaluateMusHand(state.hands[seat]);
    if (lance === 'pares') return sum + value.pairs.value;
    if (lance === 'juego') return sum + (value.game ? value.gameTotal === 31 ? 3 : 2 : 0);
    return 0;
  }, 0);
}
function settleHand(state) {
  const next = copyState(state), handPoints = [0, 0], resolved = [];
  for (const result of next.lanceResults) {
    let winnerTeam = result.team, points = 0, winnerSeat = null;
    if (result.outcome === 'passed') {
      const scoring = scorePassedLance(next.hands, result.lance, next.mano);
      winnerTeam = scoring.team; winnerSeat = scoring.winner; points = scoring.points;
    } else if (result.outcome === 'accepted') {
      const winner = chooseMusWinner(next.hands, result.lance, next.mano);
      winnerTeam = winner?.team ?? result.team; winnerSeat = winner?.seat ?? null;
      points = result.amount + (['pares', 'juego'].includes(result.lance) ? teamLanceValue(next, winnerTeam, result.lance) : result.lance === 'punto' ? 1 : 0);
    } else if (result.outcome === 'folded') {
      winnerTeam = result.team; points = result.foldBonus + (['pares', 'juego'].includes(result.lance) ? teamLanceValue(next, winnerTeam, result.lance) : 0);
    } else if (result.outcome === 'uncontested') {
      points = teamLanceValue(next, winnerTeam, result.lance);
    }
    if (winnerTeam !== null && points > 0) handPoints[winnerTeam] += points;
    resolved.push(Object.freeze({ ...result, winnerTeam, winnerSeat, points }));
  }
  const scoreEvents = [];
  for (const result of resolved) {
    if (result.winnerTeam !== null && result.points > 0) {
      next.scores[result.winnerTeam] += result.points;
      scoreEvents.push(result);
      if (next.scores[result.winnerTeam] >= 40) break;
    }
  }
  const winningTeam = next.scores.findIndex((score) => score >= 40);
  next.phase = 'showdown'; next.turn = 0; next.handHistory.push(Object.freeze({ mano: next.mano, results: Object.freeze(resolved), scoreEvents: Object.freeze(scoreEvents), handPoints: Object.freeze(handPoints), scores: Object.freeze([...next.scores]), winningTeam: winningTeam < 0 ? null : winningTeam }));
  if (winningTeam >= 0) {
    next.gamesWon[winningTeam] += 1;
    if (next.gamesWon[winningTeam] >= 2) next.phase = 'finished';
    else { next.scores = [0, 0]; next.phase = 'game-won'; }
  }
  return next;
}
function settleOrdago(state, lance, winningTeam, winningSeat, accepted) {
  const next = copyState(state), points = 40 - next.scores[winningTeam];
  next.scores[winningTeam] = 40;
  next.phase = 'showdown'; next.turn = 0;
  const result = Object.freeze({ lance, outcome: accepted ? 'ordago-accepted' : 'ordago-unanswered', team: winningTeam, winnerTeam: winningTeam, winnerSeat: winningSeat, amount: 40, points });
  next.lanceResults.push(result);
  next.handHistory.push(Object.freeze({ mano: next.mano, results: Object.freeze([...next.lanceResults]), scoreEvents: Object.freeze([result]), handPoints: Object.freeze([0, 0]), scores: Object.freeze([...next.scores]), winningTeam }));
  next.gamesWon[winningTeam] += 1;
  if (next.gamesWon[winningTeam] >= 2) next.phase = 'finished';
  else { next.scores = [0, 0]; next.phase = 'game-won'; }
  return next;
}
function beginNextHand(state, random) {
  const next = dealHand({ scores: state.scores, mano: nextSeat(state.mano), gamesWon: state.gamesWon, random });
  return next;
}

export function createMusGame({ random = Math.random } = {}) {
  return dealHand({ random });
}

export function actMus(state, seat, action, { random = Math.random } = {}) {
  if (!state || !Number.isInteger(seat) || seat < 0 || seat > 3 || seat !== state.turn) throw new RangeError('Action must come from the active seat.');
  const next = copyState(state);
  if (['showdown', 'game-won'].includes(state.phase)) {
    if (seat !== 0 || action.type !== 'next-hand') throw new RangeError('The human player starts the next hand.');
    return beginNextHand(state, random);
  }
  if (state.phase === 'mus') {
    if (!['mus', 'no-mus'].includes(action.type)) throw new RangeError('Choose Mus or No Mus.');
    if (action.type === 'no-mus') { next.musVotes.push({ seat, agrees: false }); next.phase = 'betting'; return prepareLance(next); }
    next.musVotes.push({ seat, agrees: true }); next.turn = nextSeat(seat);
    if (next.musVotes.length === 4) { next.phase = 'discard'; next.turn = next.mano; next.discardTurns = 0; next.exchangeRounds += 1; }
    return next;
  }
  if (state.phase === 'discard') {
    if (action.type !== 'discard' || !Array.isArray(action.cardIds) || action.cardIds.length > 4 || new Set(action.cardIds).size !== action.cardIds.length) throw new RangeError('Choose zero to four distinct cards to exchange.');
    const hand = next.hands[seat], selected = action.cardIds.map((id) => hand.find((card) => card.id === id));
    if (selected.some((card) => !card)) throw new RangeError('A selected card is not in this hand.');
    const drawn = drawFor(next, selected.length, random);
    drawn.hands[seat] = hand.filter((card) => !action.cardIds.includes(card.id)).concat(drawn.drawPile.splice(0, selected.length));
    drawn.discardPile.push(...selected); drawn.discardTurns += 1;
    if (drawn.discardTurns === 4) { drawn.phase = 'mus'; drawn.turn = drawn.mano; drawn.musVotes = []; }
    else drawn.turn = nextSeat(seat);
    return drawn;
  }
  if (state.phase !== 'betting') throw new RangeError('This Mus game is not accepting an action.');
  if (action.type === 'pass') {
    if (state.betAmount > 0) throw new RangeError('Respond with See, Fold or Raise.');
    next.passes += 1;
    if (next.passes === 2) return completeLance(next, { outcome: 'passed', team: null, amount: 0 });
    next.turn = teamRepresentative(next, 1 - team(seat)); return next;
  }
  if (action.type === 'bet' || action.type === 'raise') {
    const amount = Number(action.amount);
    if (!Number.isInteger(amount) || amount < 2 || amount > 40 || (action.type === 'raise' && amount < state.betAmount + 2) || (action.type === 'bet' && state.betAmount > 0)) throw new RangeError('A bet starts at 2 and raises must add at least 2, up to the 40-point game limit.');
    if (state.betAmount > 0 && team(seat) === state.betTeam) throw new RangeError('Only the opposing team can respond to this bet.');
    next.betAmount = amount; next.betCount += 1; next.betTeam = team(seat); next.betLastSeat = seat; next.passes = 0; next.isOrdago = amount === 40; next.ordagoPreviousAmount = amount === 40 ? state.betAmount : 0; next.turn = teamRepresentative(next, 1 - team(seat)); return next;
  }
  if (['see', 'fold'].includes(action.type)) {
    if (!state.betAmount || team(seat) === state.betTeam) throw new RangeError('Only the opposing team can answer the current bet.');
    if (state.isOrdago && action.type === 'see') {
      const winner = chooseMusWinner(state.hands, state.lanceName, state.mano);
      return settleOrdago(state, state.lanceName, winner.team, winner.seat, true);
    }
    if (state.isOrdago && action.type === 'fold') {
      return completeLance(next, { outcome: 'folded', team: state.betTeam, amount: state.betAmount, foldBonus: state.ordagoPreviousAmount || 1 });
    }
    if (action.type === 'see') return completeLance(next, { outcome: 'accepted', team: state.betTeam, amount: state.betAmount });
    const foldBonus = state.betCount === 1 ? 1 : state.betAmount;
    return completeLance(next, { outcome: 'folded', team: state.betTeam, amount: state.betAmount, foldBonus });
  }
  if (action.type === 'ordago') {
    if (state.betAmount > 0 && team(seat) === state.betTeam) throw new RangeError('Only the opposing team can answer this bet.');
    next.betAmount = 40; next.betCount += 1; next.betTeam = team(seat); next.betLastSeat = seat; next.passes = 0; next.isOrdago = true; next.ordagoPreviousAmount = state.betAmount; next.turn = teamRepresentative(next, 1 - team(seat)); return next;
  }
  throw new RangeError('Unknown Mus action.');
}

function botStrength(hand, lance) {
  const value = evaluateMusHand(hand);
  if (lance === 'grande') return value.grande[0] * 4 + value.grande[1] * 2 + value.grande[2];
  if (lance === 'chica') return 100 - (value.chica[0] * 4 + value.chica[1] * 2 + value.chica[2]);
  if (lance === 'pares') return value.pairs.strength * 20 + value.pairs.rank;
  if (lance === 'juego') return value.game * 16 + value.gameTotal / 10;
  return value.gameTotal;
}
export function chooseMusBotAction(state, seat) {
  if (!state || !Number.isInteger(seat) || seat < 1 || seat > 3 || state.turn !== seat) throw new RangeError('Choose an active local bot seat.');
  const hand = state.hands[seat];
  if (state.phase === 'mus') {
    const evaluation = evaluateMusHand(hand);
    const goodPairs = evaluation.pairs.strength >= 2, goodGame = evaluation.game >= 7, high = evaluation.grande[0] >= 12 && evaluation.grande[1] >= 11;
    return { type: !goodPairs && !goodGame && !high && state.exchangeRounds < 3 ? 'mus' : 'no-mus' };
  }
  if (state.phase === 'discard') {
    const candidates = [];
    for (let mask = 0; mask < 16; mask += 1) {
      const kept = hand.filter((_, index) => !(mask & (1 << index)));
      const discarded = hand.filter((_, index) => mask & (1 << index));
      const retainedRanks = new Set(kept.map((card) => card.rank === 2 ? 1 : card.rank === 3 ? 12 : card.rank));
      const replacements = [1, 4, 5, 6, 7, 10, 11, 12].filter((rank) => !retainedRanks.has(rank)).slice(0, 4 - kept.length).map((rank) => ({ rank }));
      const evaluated = evaluateMusHand(kept.concat(replacements));
      const score = evaluated.pairs.strength * 1_000 + evaluated.pairs.rank * 30 + evaluated.game * 200 + evaluated.grande[0] * 4 + evaluated.grande[1] * 2 + evaluated.grande[2] - discarded.length * 120;
      candidates.push({ discarded, score });
    }
    const best = candidates.sort((a, b) => b.score - a.score || a.discarded.length - b.discarded.length)[0];
    return { type: 'discard', cardIds: best.discarded.map(({ id }) => id) };
  }
  if (state.phase === 'betting') {
    const score = botStrength(hand, state.lanceName), thresholds = { grande: 44, chica: 55, pares: 30, juego: 100, punto: 29 };
    if (!state.betAmount) return score >= thresholds[state.lanceName] ? { type: 'bet', amount: 2 } : { type: 'pass' };
    if (team(seat) === state.betTeam) return { type: 'pass' };
    if (score >= thresholds[state.lanceName] + 22 && state.betCount < 2) return { type: 'raise', amount: Math.min(40, state.betAmount + 2) };
    return score >= thresholds[state.lanceName] - 10 ? { type: 'see' } : { type: 'fold' };
  }
  throw new RangeError('Local bot has no action in this phase.');
}

export function advanceMusBots(state, { random = Math.random, maxActions = 30 } = {}) {
  let next = state, actions = 0;
  while (next.phase !== 'finished' && next.phase !== 'showdown' && next.phase !== 'game-won' && next.turn !== 0 && actions < maxActions) {
    if (next.phase === 'betting' && next.turn === 2) { next = { ...next, turn: 0 }; break; }
    const action = chooseMusBotAction(next, next.turn);
    next = actMus(next, next.turn, action, { random }); actions += 1;
  }
  if (actions >= maxActions && next.turn !== 0) throw new RangeError('The local bot action limit was reached.');
  return Object.freeze({ state: next, actions });
}

export const MUS_GAME_RULES = Object.freeze({ seats: 4, teams: Object.freeze([[0, 2], [1, 3]]), targetPoints: 40, gamesToWin: 2, lances: LANCES, profile: '40-card Spanish deck; threes count as kings and twos count as aces for ranks and pairs.' });
