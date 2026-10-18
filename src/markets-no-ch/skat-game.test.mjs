import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SKAT_BIDS, SKAT_CARD_POINTS, SKAT_TARGET_POINTS, bidSkat, chooseSkatCpuCard,
  createSkatGame, finishSkatCpuContract, legalSkatCards, playSkatCard,
  skatCardCount, skatNextBid, scoreSkatGame, selectSkatContract, winningSkatPlay,
} from './skat-game.mjs';

const card = (suit, rank) => ({ id: suit * 8 + rank, suit, rank });

test('a shuffled deal has 32 unique cards, 10 per hand and two in the Skat', () => {
  const game = createSkatGame({ seed: 42, forehand: 2 });
  assert.deepEqual(game.hands.map((hand) => hand.length), [10, 10, 10]);
  assert.equal(game.skat.length, 2);
  assert.equal(skatCardCount(game), 32);
  assert.equal(new Set([...game.hands.flat(), ...game.skat].map(({ id }) => id)).size, 32);
  assert.equal(createSkatGame({ seed: 42, forehand: 2 }).hands[0][0].id, game.hands[0][0].id);
});

test('the 32-card deck contains 120 eyes and a standard bid ladder', () => {
  assert.equal(SKAT_CARD_POINTS.reduce((sum, value) => sum + value, 0) * 4, 120);
  assert.equal(skatNextBid(0), 18);
  assert.equal(skatNextBid(18), 20);
  assert.equal(skatNextBid(264), null);
  assert.ok(SKAT_BIDS.every((bid, index) => index === 0 || bid > SKAT_BIDS[index - 1]));
  assert.equal(SKAT_TARGET_POINTS, 61);
});

test('auction resolves a winning bidder and gives the last unbid seat a turn when all pass', () => {
  const game = createSkatGame({ seed: 1, forehand: 0 });
  bidSkat(game, 0, 18);
  bidSkat(game, 1, null);
  bidSkat(game, 2, null);
  assert.equal(game.phase, 'contract');
  assert.equal(game.declarer, 0);

  const redeal = createSkatGame({ seed: 2, forehand: 0 });
  bidSkat(redeal, 0, null);
  bidSkat(redeal, 1, null);
  assert.equal(redeal.phase, 'auction');
  assert.equal(redeal.toMove, 2);
  bidSkat(redeal, 2, null);
  assert.equal(redeal.status, 'redeal');
});

test('a pickup contract takes the two-card Skat then returns exactly two discards', () => {
  const game = createSkatGame({ seed: 3, forehand: 0 });
  game.phase = 'contract'; game.declarer = 0;
  const before = game.skat.map(({ id }) => id);
  const discard = game.hands[0].slice(0, 2).map(({ id }) => id);
  selectSkatContract(game, 0, { kind: 'suit', suit: 0, hand: false }, discard);
  assert.equal(game.hands[0].length, 10);
  assert.deepEqual(game.skat.map(({ id }) => id), discard);
  assert.ok(before.every((id) => game.hands[0].some((item) => item.id === id)));
  assert.equal(skatCardCount(game), 32);
});

test('a Hand contract leaves the Skat unseen and does not discard two cards', () => {
  const game = createSkatGame({ seed: 4, forehand: 0 });
  game.phase = 'contract'; game.declarer = 0;
  const skat = [...game.skat];
  selectSkatContract(game, 0, { kind: 'grand', hand: true }, []);
  assert.equal(game.hands[0].length, 10);
  assert.deepEqual(game.skat, skat);
  assert.throws(() => selectSkatContract({ ...game, phase: 'contract' }, 0, { kind: 'null', hand: true }, [skat[0].id, skat[1].id]), /does not discard/u);
});

test('players must follow the led suit or trump when they can', () => {
  const contract = { kind: 'suit', suit: 0, hand: false };
  const trick = [{ player: 0, card: card(1, 2) }];
  const hand = [card(1, 0), card(2, 6), card(0, 1)];
  assert.deepEqual(legalSkatCards(hand, trick, contract).map(({ id }) => id), [card(1, 0).id]);
  const forcedTrump = [{ player: 0, card: card(0, 7) }];
  assert.deepEqual(legalSkatCards(hand, forcedTrump, contract).map(({ id }) => id), [card(0, 1).id]);
  assert.throws(() => playSkatCard({ phase: 'play', status: 'playing', toMove: 1, hands: [[], hand], trick, contract }, 1, card(2, 6).id), /follow/u);
});

test('clubs jack outranks spades jack and Null uses its distinct rank order', () => {
  const grandTrick = [
    { player: 0, card: card(2, 3) },
    { player: 1, card: card(3, 3) },
    { player: 2, card: card(0, 3) },
  ];
  assert.equal(winningSkatPlay(grandTrick, { kind: 'grand' }).player, 0);
  const nullTrick = [
    { player: 0, card: card(0, 7) },
    { player: 1, card: card(0, 3) },
    { player: 2, card: card(0, 6) },
  ];
  assert.equal(winningSkatPlay(nullTrick, { kind: 'null' }).player, 0);
  const nullHighCards = [
    { player: 0, card: card(1, 6) }, // ten
    { player: 1, card: card(1, 5) }, // king
    { player: 2, card: card(1, 7) }, // ace
  ];
  assert.equal(winningSkatPlay(nullHighCards, { kind: 'null' }).player, 2);
});

test('suit base values follow Skat order and recorded matadors survive the deal', () => {
  const expected = [10, 9, 12, 11]; // hearts, diamonds, clubs, spades
  for (let suit = 0; suit < 4; suit += 1) {
    const game = createSkatGame({ seed: 30 + suit });
    game.declarer = 0;
    game.contract = { kind: 'suit', suit, hand: false };
    game.contractMatadors = 0;
    game.pointsWon = [61, 59, 0];
    game.tricksWon = [6, 3, 1];
    game.skat = [];
    assert.equal(scoreSkatGame(game).value, expected[suit]);
  }
  const game = createSkatGame({ seed: 3 });
  game.phase = 'contract'; game.declarer = 0;
  selectSkatContract(game, 0, { kind: 'grand', hand: false }, game.hands[0].slice(0, 2).map(({ id }) => id));
  const recorded = game.contractMatadors;
  assert.ok(recorded >= 0 && recorded <= 4);
  game.hands[0] = [];
  assert.equal(game.contractMatadors, recorded);
});

test('the matador ladder starts clubs, spades, hearts, diamonds', () => {
  const game = createSkatGame({ seed: 43, forehand: 0 });
  game.phase = 'contract'; game.declarer = 0;
  game.hands[0] = [card(2, 3), card(3, 3), card(0, 0), card(0, 1), card(0, 2), card(1, 0), card(1, 1), card(1, 2), card(2, 0), card(3, 0)];
  selectSkatContract(game, 0, { kind: 'grand', hand: true }, []);
  assert.equal(game.contractMatadors, 2);
});

test('an invalid pickup discard is rejected before the hand or Skat changes', () => {
  const game = createSkatGame({ seed: 44, forehand: 0 });
  game.phase = 'contract'; game.declarer = 0;
  const beforeHand = game.hands[0].map(({ id }) => id);
  const beforeSkat = game.skat.map(({ id }) => id);
  assert.throws(() => selectSkatContract(game, 0, { kind: 'suit', suit: 0, hand: false }, [999, 998]), /Choose two cards/u);
  assert.deepEqual(game.hands[0].map(({ id }) => id), beforeHand);
  assert.deepEqual(game.skat.map(({ id }) => id), beforeSkat);
});

test('lost suit games add Schneider and Schwarz levels correctly before doubling', () => {
  const schneider = createSkatGame({ seed: 45 });
  schneider.declarer = 0; schneider.contract = { kind: 'suit', suit: 0, hand: false };
  schneider.contractMatadors = 0; schneider.auction.bid = 18;
  schneider.pointsWon = [30, 90, 0]; schneider.tricksWon = [4, 6, 0]; schneider.skat = [];
  assert.equal(scoreSkatGame(schneider).value, 20);
  assert.deepEqual(schneider.roundScore, [-40, 20, 20]);

  const schwarz = createSkatGame({ seed: 46 });
  schwarz.declarer = 0; schwarz.contract = { kind: 'suit', suit: 0, hand: false };
  schwarz.contractMatadors = 0; schwarz.auction.bid = 18;
  schwarz.pointsWon = [0, 120, 0]; schwarz.tricksWon = [0, 10, 0]; schwarz.skat = [];
  assert.equal(scoreSkatGame(schwarz).value, 30);
  assert.deepEqual(schwarz.roundScore, [-60, 30, 30]);
});

test('three CPUs can complete ten tricks, obey follow rules and account for all 120 eyes', () => {
  const game = createSkatGame({ seed: 77, forehand: 1 });
  game.phase = 'play'; game.declarer = 0; game.contract = { kind: 'suit', suit: 2, hand: false };
  game.auction.bid = 18; game.leader = game.forehand; game.toMove = game.leader;
  let guard = 0;
  while (game.status === 'playing' && guard < 32) {
    const player = game.toMove;
    playSkatCard(game, player, chooseSkatCpuCard(game, player));
    guard += 1;
  }
  assert.equal(game.phase, 'complete');
  assert.equal(game.tricks.length, 10);
  assert.equal(game.tricksWon.reduce((a, b) => a + b, 0), 10);
  assert.equal(game.pointsWon.reduce((a, b) => a + b, 0) + game.skat.reduce((sum, item) => sum + SKAT_CARD_POINTS[item.rank], 0), 120);
  assert.equal(skatCardCount(game), 32);
  assert.equal(game.scores.reduce((sum, value) => sum + value, 0), game.roundScore.reduce((sum, value) => sum + value, 0));
});

test('Null is won only with no declarer tricks, and the CPU can prepare a legal hand', () => {
  const nullGame = createSkatGame({ seed: 11 });
  nullGame.declarer = 0;
  nullGame.contract = { kind: 'null', hand: false };
  nullGame.tricksWon = [0, 7, 3];
  nullGame.pointsWon = [0, 85, 35];
  const scored = scoreSkatGame(nullGame);
  assert.equal(scored.won, true);
  assert.equal(scored.value, 23);

  const cpu = createSkatGame({ seed: 12 });
  cpu.phase = 'contract'; cpu.declarer = 2;
  finishSkatCpuContract(cpu, 2);
  assert.equal(cpu.phase, 'play');
  assert.equal(cpu.hands[2].length, 10);
  assert.equal(skatCardCount(cpu), 32);
});
