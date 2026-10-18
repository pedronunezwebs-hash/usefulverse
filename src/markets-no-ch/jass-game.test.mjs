import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseJassContractAction, chooseJassCpuCard, chooseJassCpuContract, createJassGame, jassGameSummary, legalJassCards, playJassCard, resolveJassTrick, runJassCpuAction } from './jass-game.mjs';

const card = (suit, rank) => ({ id: `${suit}-${rank}`, suit, rank });
const played = (player, suit, rank) => ({ player, card: card(suit, rank) });
const ids = (cards) => cards.map(({ id }) => id);

test('deals 36 unique cards into four nine-card hands reproducibly from a seed', () => {
  const first = createJassGame({ seed: 12345 });
  const same = createJassGame({ seed: 12345 });
  const other = createJassGame({ seed: 54321 });
  assert.deepEqual(first.hands, same.hands);
  assert.notDeepEqual(first.hands, other.hands);
  assert.deepEqual(first.hands.map((hand) => hand.length), [9, 9, 9, 9]);
  assert.equal(new Set(first.hands.flat().map(({ id }) => id)).size, 36);
});

test('enforces follow-suit and permits a trump, but blocks an undertrump while a non-trump is held', () => {
  const hand = [card('hearts', 6), card('spades', 6), card('spades', 9), card('clubs', 14)];
  const noTrumpYet = [played(0, 'hearts', 14), played(1, 'clubs', 6)];
  assert.deepEqual(ids(legalJassCards(hand, noTrumpYet, 'spades')), ['hearts-6', 'spades-6', 'spades-9']);
  const spadesAlreadyTrumped = [...noTrumpYet, played(2, 'spades', 11)];
  assert.deepEqual(ids(legalJassCards(hand, spadesAlreadyTrumped, 'spades')), ['hearts-6']);
  const lowerTrumped = [...noTrumpYet, played(2, 'spades', 6)];
  assert.deepEqual(ids(legalJassCards(hand, lowerTrumped, 'spades')), ['hearts-6', 'spades-9']);
});

test('allows an undertrump only when every remaining card is trump', () => {
  const hand = [card('spades', 6), card('spades', 9)];
  const trick = [played(0, 'hearts', 14), played(1, 'spades', 11), played(2, 'clubs', 6)];
  assert.deepEqual(ids(legalJassCards(hand, trick, 'spades')), ['spades-6', 'spades-9']);
});

test('a trump lead must be followed unless the player holds only the trump jack', () => {
  const trick = [played(0, 'spades', 9)];
  assert.deepEqual(ids(legalJassCards([card('spades', 14), card('hearts', 6)], trick, 'spades')), ['spades-14']);
  assert.deepEqual(ids(legalJassCards([card('spades', 11), card('hearts', 6)], trick, 'spades')), ['spades-11', 'hearts-6']);
});

test('top-down and bottom-up require following suit and select the correct rank order', () => {
  const hand = [card('clubs', 6), card('hearts', 14)];
  assert.deepEqual(ids(legalJassCards(hand, [played(0, 'hearts', 6)], 'top-down')), ['hearts-14']);
  assert.deepEqual(ids(legalJassCards(hand, [played(0, 'hearts', 14), played(1, 'clubs', 14), played(2, 'hearts', 7)], 'bottom-up')), ['hearts-14']);
  const top = resolveJassTrick([played(0, 'hearts', 14), played(1, 'hearts', 6), played(2, 'hearts', 8), played(3, 'hearts', 10)], 'top-down');
  const bottom = resolveJassTrick([played(0, 'hearts', 14), played(1, 'hearts', 6), played(2, 'hearts', 8), played(3, 'hearts', 10)], 'bottom-up');
  assert.equal(top.winner, 0);
  assert.equal(bottom.winner, 1);
});

test('calculates trump rank, card points and the five-point last-trick bonus', () => {
  const trick = [played(0, 'hearts', 14), played(1, 'spades', 9), played(2, 'spades', 11), played(3, 'spades', 6)];
  const outcome = resolveJassTrick(trick, 'spades', true);
  assert.equal(outcome.winner, 2);
  assert.equal(outcome.cardPoints, 45);
  assert.equal(outcome.lastTrickBonus, 5);
  assert.equal(outcome.points, 50);
  const totals = [
    ['hearts', 'diamonds', 'spades', 'clubs'].flatMap((suit) => [6, 7, 8, 9, 10, 11, 12, 13, 14].map((rank) => card(suit, rank))),
  ][0];
  assert.equal(totals.reduce((sum, item) => sum + (item.suit === 'spades' ? ({ 11: 20, 9: 14, 14: 11, 13: 4, 12: 3, 10: 10 }[item.rank] ?? 0) : ({ 14: 11, 13: 4, 12: 3, 11: 2, 10: 10 }[item.rank] ?? 0)), 0), 152);
});

test('contract chooser and CPU card player return supported contracts and only legal cards', () => {
  const game = createJassGame({ seed: 7 });
  const contract = chooseJassCpuContract(game.hands[1]);
  assert.ok(['hearts', 'diamonds', 'spades', 'clubs', 'top-down', 'bottom-up'].includes(contract));
  const trick = [played(0, 'hearts', 6)];
  const cpuHand = [card('hearts', 14), card('clubs', 6), card('spades', 11)];
  const result = chooseJassCpuCard({ hand: cpuHand, trick, contract: 'spades', player: 1, seed: 99 });
  assert.ok(legalJassCards(cpuHand, trick, 'spades').some(({ id }) => id === result.id));
  assert.equal(chooseJassCpuCard({ hand: cpuHand, trick, contract: 'spades', player: 1, seed: 99 }).id, result.id);
});

test('forehand may pass once and the partner then chooses the contract', () => {
  const game = createJassGame({ seed: 77 });
  const passed = chooseJassContractAction(game, 0, 'pass');
  assert.equal(passed.bidder, 2);
  assert.equal(passed.pendingBid, 'partner');
  const started = chooseJassContractAction(passed, 2, 'bottom-up');
  assert.equal(started.status, 'playing');
  assert.equal(started.contract, 'bottom-up');
  assert.deepEqual(started.turnOrder, [0, 1, 2, 3]);
  assert.throws(() => chooseJassContractAction(started, 2, 'hearts'), /contract choice/u);
});

test('the forehand advances clockwise after each deal', () => {
  let game = createJassGame({ seed: 4141 });
  const startingForehand = game.forehand;
  let actions = 0;
  while (game.round === 1 && game.status !== 'complete' && actions++ < 100) {
    if (game.status === 'bidding') game = game.bidder === 0 ? chooseJassContractAction(game, 0, 'hearts') : runJassCpuAction(game);
    else {
      const player = game.turnOrder[game.nextIndex];
      game = player === 0 ? playJassCard(game, 0, legalJassCards(game.hands[0], game.trick, game.contract)[0].id) : runJassCpuAction(game);
    }
  }
  assert.equal(game.round, 2);
  assert.equal(game.forehand, (startingForehand + 1) % 4);
  assert.equal(game.pendingBid, 'forehand');
});

test('a full 12-deal local match finishes with all 157 points allocated in each deal', () => {
  let game = createJassGame({ seed: 20261016 });
  let actions = 0;
  while (game.status !== 'complete' && actions++ < 600) {
    if (game.status === 'bidding') {
      game = game.bidder === 0
        ? chooseJassContractAction(game, 0, game.pendingBid === 'forehand' && game.round % 3 === 0 ? 'pass' : 'hearts')
        : runJassCpuAction(game);
    } else {
      const player = game.turnOrder[game.nextIndex];
      if (player !== 0) game = runJassCpuAction(game);
      else {
        const legal = legalJassCards(game.hands[0], game.trick, game.contract);
        game = playJassCard(game, 0, legal[0].id);
      }
    }
  }
  assert.equal(game.status, 'complete');
  assert.equal(game.scorecard.length, 12);
  assert.equal(game.scorecard.reduce((sum, hand) => sum + hand.team0 + hand.team1, 0), 1884);
  assert.equal(game.scores[0] + game.scores[1], 1884);
  assert.deepEqual(jassGameSummary(game), { roundsPlayed: 12, team0: game.scores[0], team1: game.scores[1], winner: game.scores[0] === game.scores[1] ? 'draw' : game.scores[0] > game.scores[1] ? 0 : 1, remaining: 0 });
});
