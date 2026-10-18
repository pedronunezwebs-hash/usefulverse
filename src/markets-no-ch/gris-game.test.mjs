import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseGrisCpuCard, createGrisDeck, createGrisGame, grisInventory, grisNextRound, grisPass, grisReact, grisResolveReturnedCard, sameSuitCount } from './gris-game.mjs';

test('Gris deck is a reproducible standard 52-card pack without jokers', () => {
  const a = createGrisDeck(42); const b = createGrisDeck(42);
  assert.equal(a.length, 52); assert.deepEqual(a, b); assert.equal(new Set(a.map(({ id }) => id)).size, 52);
});

test('Gris accepts three to eight seats and deals five each plus one extra', () => {
  for (let players = 3; players <= 8; players += 1) {
    const game = createGrisGame({ seed: players, players });
    assert.equal(grisInventory(game), 52);
    assert.equal(game.players.filter(({ hand }) => hand.length === 6).length, 1);
    assert.equal(game.players.filter(({ hand }) => hand.length === 5).length, players - 1);
    assert.equal(game.stock.length, 52 - (players * 5 + 1));
  }
  assert.throws(() => createGrisGame({ players: 2 }), /3 to 8/);
});

test('only the six-card seat can pass one card to the next seat on the left', () => {
  const game = createGrisGame({ seed: 17, players: 4 });
  const card = game.players[game.activePlayer].hand[0];
  assert.throws(() => grisPass(game, { playerId: 1, cardId: card.id }), /passing turn/);
  grisPass(game, { cardId: card.id });
  assert.equal(game.players[1].hand.length, 6);
  assert.equal(game.players[0].hand.length, 5);
  assert.equal(grisInventory(game), 52);
});

test('CPU passes a card outside a five-card suit when it can preserve the collection', () => {
  const game = createGrisGame({ seed: 23, players: 3 });
  const playerId = game.activePlayer;
  const hand = Array.from({ length: 5 }, (_, index) => ({ id: `s-${index}`, suit: 2, rank: index + 2, originalOwner: playerId, passCount: 0 }));
  hand.push({ id: 'off-suit', suit: 1, rank: 14, originalOwner: playerId, passCount: 0 });
  game.players[playerId].hand = hand;
  assert.equal(chooseGrisCpuCard(game, playerId).id, 'off-suit');
});

test('five same-suit cards start one signal phase after the sixth card is passed', () => {
  const game = createGrisGame({ seed: 19, players: 3 });
  const player = game.players[game.activePlayer];
  const suit = player.hand[0].suit;
  const chosen = player.hand.filter(({ suit: cardSuit }) => cardSuit === suit).slice(0, 5);
  while (chosen.length < 5) chosen.push({ ...player.hand.find(({ suit: cardSuit }) => cardSuit !== suit), suit });
  player.hand = [...chosen, { id: 'extra', suit: (suit + 1) % 4, rank: 2, originalOwner: player.id, passCount: 0 }];
  const receiver = (player.id + 1) % 3;
  grisPass(game, { cardId: 'extra' });
  assert.equal(game.status, 'signal');
  assert.equal(game.signaler, player.id);
  assert.equal(sameSuitCount(game.players[player.id].hand), 5);
  const resolution = game.reactionOrder.map((playerId) => grisReact(game, { playerId }));
  assert.equal(resolution.at(-1).status, 'round-end');
  assert.equal(game.players[game.lastPenaltyPlayer].letters, 1);
});

test('a returned card can be replaced from stock or kept after a disputed circuit', () => {
  const game = createGrisGame({ seed: 7, players: 3 });
  const receiver = 1; const card = game.stock.pop(); card.originalOwner = receiver; card.passCount = 1;
  game.players[receiver].hand.push(card); game.pendingCard = card.id; game.pendingReturn = true; game.activePlayer = receiver; game.status = 'return-check';
  const before = game.players[receiver].hand.length; const stockBefore = game.stock.length;
  grisResolveReturnedCard(game, { discardCard: false });
  assert.equal(game.players[receiver].hand.length, before);
  assert.equal(game.stock.length, stockBefore);
  game.status = 'return-check'; game.pendingCard = card.id; game.pendingReturn = true;
  grisResolveReturnedCard(game, { discardCard: true });
  assert.equal(game.players[receiver].hand.length, before);
  assert.equal(game.stock.length, stockBefore - 1);
  assert.equal(game.discard.at(-1).id, card.id);
  assert.equal(grisInventory(game), 52);
});

test('word is configurable and a complete word eliminates a seat; rounds redeal to remaining players', () => {
  const game = createGrisGame({ seed: 5, players: 3, word: 'PIG' });
  assert.throws(() => createGrisGame({ players: 3, word: 'x' }), /2 to 12/);
  game.players[1].letters = 2;
  const previousDealer = game.dealer;
  game.status = 'signal'; game.reactionOrder = [0, 2, 1]; game.reactionCursor = 0;
  for (const playerId of game.reactionOrder) grisReact(game, { playerId });
  assert.equal(game.players[1].eliminated, true);
  assert.equal(game.status, 'round-end');
  grisNextRound(game);
  assert.equal(game.round, 2); assert.equal(game.status, 'passing');
  assert.equal(game.dealer, 0);
  assert.notEqual(game.dealer, previousDealer);
  assert.equal(game.starter, 2);
  assert.equal(game.players[1].eliminated, true);
  assert.equal(game.players.filter(({ hand }) => hand.length === 6).length, 1);
  assert.equal(grisInventory(game), 52);
});
