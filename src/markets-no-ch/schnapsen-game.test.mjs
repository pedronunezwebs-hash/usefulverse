import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCHNAPSEN_POINTS, availableSchnapsenMarriage, canCloseSchnapsenTalon, canExchangeSchnapsenTrumpJack,
  claimSchnapsen66, closeSchnapsenTalon, createSchnapsenDeck, createSchnapsenGame,
  declareSchnapsenMarriage, exchangeSchnapsenTrumpJack, legalSchnapsenCards, playSchnapsenCard,
  playSchnapsenCpuTurn, schnapsenCardCount,
} from './schnapsen-game.mjs';

const card = (suit, rank) => ({ id: suit * 5 + rank, suit, rank });

test('builds a 20-card deck with exactly 120 card points', () => {
  const deck = createSchnapsenDeck(77);
  assert.equal(deck.length, 20);
  assert.equal(new Set(deck.map((item) => item.id)).size, 20);
  assert.equal(deck.reduce((sum, item) => sum + SCHNAPSEN_POINTS[item.rank], 0), 120);
});

test('deals five each, exposes a trump and preserves all cards', () => {
  const game = createSchnapsenGame({ seed: 17, dealer: 1 });
  assert.deepEqual(game.hands.map((hand) => hand.length), [5, 5]);
  assert.equal(game.stock.length, 9);
  assert.equal(game.toMove, 0);
  assert.equal(schnapsenCardCount(game), 20);
});

test('open talon permits discarding; strict phase requires following and heading when possible', () => {
  const game = createSchnapsenGame({ seed: 1 });
  game.trumpSuit = 2;
  game.hands[1] = [card(0, 0), card(0, 4), card(1, 4)];
  game.trick = [{ seat: 0, card: card(0, 3) }];
  assert.deepEqual(legalSchnapsenCards(game, 1).map((item) => item.id), [0, 4, 9]);
  game.phase = 'strict';
  assert.deepEqual(legalSchnapsenCards(game, 1).map((item) => item.id), [4]);
  game.hands[1] = [card(0, 0), card(1, 4)];
  assert.deepEqual(legalSchnapsenCards(game, 1).map((item) => item.id), [0]);
  game.trick[0].card = card(2, 4);
  game.hands[1] = [card(2, 0), card(1, 4)];
  assert.deepEqual(legalSchnapsenCards(game, 1).map((item) => item.id), [10]);
});

test('trump jack exchange swaps the card without changing the deck size', () => {
  const game = createSchnapsenGame({ seed: 4 });
  const jack = card(game.trumpSuit, 0);
  game.hands[game.toMove][0] = jack;
  const upcard = game.trumpCard;
  assert.equal(canExchangeSchnapsenTrumpJack(game, game.toMove), true);
  exchangeSchnapsenTrumpJack(game, game.toMove);
  assert.equal(game.trumpCard.id, jack.id);
  assert.equal(game.hands[game.toMove].some((item) => item.id === upcard.id), true);
  assert.equal(schnapsenCardCount(game), 20);
});

test('closing requires a prior draw and full hands, and records the opponent score', () => {
  const game = createSchnapsenGame({ seed: 5 });
  game.points = [15, 28]; game.tricksWon = [1, 2];
  assert.equal(canCloseSchnapsenTalon(game, game.toMove), false);
  game.tricks.push({ plays: [], winner: game.toMove, points: 0 });
  assert.equal(canCloseSchnapsenTalon(game, game.toMove), true);
  closeSchnapsenTalon(game, game.toMove);
  assert.equal(game.phase, 'strict');
  assert.deepEqual(game.closeSnapshot, { closer: game.toMove, opponentPoints: 28, opponentTricks: 2 });
  assert.equal(canCloseSchnapsenTalon(game, game.toMove), false);
});

test('marriage points wait until its player wins a trick and requires a marriage card lead', () => {
  const game = createSchnapsenGame({ seed: 6 });
  const seat = game.toMove;
  game.trumpSuit = 3;
  game.hands[seat] = [card(0, 2), card(0, 1), card(0, 4), card(1, 0), card(3, 0)];
  game.tricks.push({ plays: [], winner: seat, points: 0 });
  game.hands[1 - seat] = [card(0, 0), card(1, 1), card(1, 2), card(2, 2), card(3, 2)];
  assert.deepEqual(availableSchnapsenMarriage(game, seat), [{ suit: 0, points: 20 }]);
  declareSchnapsenMarriage(game, seat, 0);
  assert.throws(() => playSchnapsenCard(game, seat, card(0, 4).id), /marriage/u);
  playSchnapsenCard(game, seat, card(0, 2).id);
  playSchnapsenCard(game, 1 - seat, card(0, 0).id);
  assert.equal(game.points[seat], 26);
  assert.equal(game.marriageEvents[0].counted, true);
});

test('a successful claim ends a hand and deducts game points', () => {
  const game = createSchnapsenGame({ seed: 9 });
  const seat = game.toMove;
  game.points[seat] = 66; game.tricksWon[1 - seat] = 1; game.tricks.push({});
  const result = claimSchnapsen66(game, seat);
  assert.equal(result.winner, seat);
  assert.equal(result.gamePointsWon, 2);
  assert.equal(game.status, 'handComplete');
  assert.equal(game.gamePoints[seat], 5);
});

test('a claim by the opponent after a close uses the closure penalty', () => {
  const game = createSchnapsenGame({ seed: 9 });
  const closer = game.toMove;
  game.closeSnapshot = { closer, opponentPoints: 5, opponentTricks: 0 };
  game.points[1 - closer] = 66; game.tricks[0] = {}; game.toMove = 1 - closer;
  const result = claimSchnapsen66(game, 1 - closer);
  assert.equal(result.winner, 1 - closer);
  assert.equal(result.gamePointsWon, 3);
});

test('a closed-talon player who fails to reach 66 loses even on the last trick', () => {
  const game = createSchnapsenGame({ seed: 91 });
  const closer = game.toMove;
  game.closeSnapshot = { closer, opponentPoints: 0, opponentTricks: 0 };
  game.closed = true; game.phase = 'strict'; game.stock = []; game.trumpCard = null; game.trumpSuit = 3;
  game.tricks = Array.from({ length: 9 }, (_, index) => ({ plays: [], winner: index % 2, points: 0 }));
  game.points = [0, 0]; game.hands = [[], []]; game.trick = [];
  const lastWinner = 0;
  const expected = 1 - closer;
  game.hands[lastWinner] = [card(0, 0)];
  game.hands[1 - lastWinner] = [card(2, 0)];
  game.toMove = lastWinner;
  playSchnapsenCard(game, lastWinner, card(0, 0).id);
  game.toMove = 1 - lastWinner;
  playSchnapsenCard(game, 1 - lastWinner, card(2, 0).id);
  assert.equal(game.status, 'handComplete');
  assert.equal(game.result.winner, expected);
  assert.equal(game.result.gamePointsWon, 3);
});

test('CPU finishes 500 complete hands without losing or duplicating a card', () => {
  for (let seed = 1; seed <= 500; seed += 1) {
    const game = createSchnapsenGame({ seed });
    let turns = 0;
    while (game.status === 'playing' && turns < 60) {
      playSchnapsenCpuTurn(game, game.toMove);
      assert.equal(schnapsenCardCount(game), 20);
      turns += 1;
    }
    assert.notEqual(game.status, 'playing', `seed ${seed} did not finish`);
    assert.ok(turns <= 60);
  }
});
