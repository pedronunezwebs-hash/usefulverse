import test from 'node:test';
import assert from 'node:assert/strict';
import {
  amerikanerBid, amerikanerInventory, amerikanerLead, amerikanerPlay,
  chooseAmerikanerCpuBid, chooseAmerikanerCpuCard, chooseAmerikanerCpuLead,
  createAmerikanerDeck, createAmerikanerGame, legalAmerikanerCards,
} from './amerikaner-game.mjs';

const card = (suit, rank) => ({ id: `${suit}-${rank}`, suit, rank });
function fixture(hands, bid = { playerId: 0, type: 'americaner', tricks: hands[0].length }) {
  const players = hands.map((hand, id) => ({ id, hand: [...hand], score: 0, tricks: 0 }));
  return { players, dealer: 0, round: 1, seed: 1, deckSize: hands.reduce((n, hand) => n + hand.length, 0), removedTwos: 52 - hands.reduce((n, hand) => n + hand.length, 0), captured: [], status: 'lead', winner: null, currentBid: bid, passed: [], bidOrder: [], bidCursor: 0, turn: bid.playerId, trick: [], trickNumber: 0, partnerId: null, trumpSuit: null, requestedCardId: null, declarerTricks: 0, lastAction: 'declarer', lastResult: null };
}

test('deals 3–6 players evenly and removes only enough twos for equal hands', () => {
  for (const count of [3, 4, 5, 6]) {
    const game = createAmerikanerGame({ seed: 42, players: count });
    const sizes = game.players.map(({ hand }) => hand.length);
    assert.ok(sizes.every((size) => size === sizes[0]));
    assert.deepEqual([game.deckSize, game.removedTwos], ({ 3: [51, 1], 4: [52, 0], 5: [50, 2], 6: [48, 4] })[count]);
    assert.equal(new Set(createAmerikanerDeck(42, count).map(({ id }) => id)).size, game.deckSize);
    assert.equal(amerikanerInventory(game), game.deckSize);
  }
  assert.throws(() => createAmerikanerGame({ players: 2 }), /3 to 6/u);
});

test('auction starts left of dealer, rejects invalid bids, and ends after everyone else passes', () => {
  const game = createAmerikanerGame({ seed: 2, players: 4 });
  assert.equal(game.turn, 1);
  assert.throws(() => amerikanerBid(game, { playerId: 1, bid: 6 }), /from 7 to 13/u);
  amerikanerBid(game, { playerId: 1, bid: 7 });
  assert.equal(game.turn, 2);
  amerikanerBid(game, { playerId: 2, bid: 'pass' });
  amerikanerBid(game, { playerId: 3, bid: 'pass' });
  assert.equal(game.turn, 0);
  amerikanerBid(game, { playerId: 0, bid: 'pass' });
  assert.equal(game.status, 'lead');
  assert.equal(game.turn, 1);
});

test('all-pass deals rotate the dealer and start a fresh bidding round', () => {
  const game = createAmerikanerGame({ seed: 5, players: 3 });
  const firstSeed = game.seed;
  for (let i = 0; i < 3; i += 1) amerikanerBid(game, { bid: 'pass' });
  assert.equal(game.status, 'bidding');
  assert.equal(game.dealer, 1);
  assert.equal(game.round, 2);
  assert.equal(game.seed, firstSeed + 1);
  assert.equal(game.turn, 2);
  assert.equal(amerikanerInventory(game), 51);
});

test('Americaner ends bidding immediately and must be played without trump or partner', () => {
  const game = createAmerikanerGame({ seed: 8, players: 3 });
  amerikanerBid(game, { playerId: 1, bid: 'americaner' });
  assert.equal(game.status, 'lead');
  assert.equal(game.currentBid.type, 'americaner');
  game.players[1].hand = [card(0, 14)]; game.players[0].hand = [card(0, 9)]; game.players[2].hand = [card(1, 10)]; game.deckSize = 3;
  amerikanerLead(game, { cardId: '0-14' });
  assert.equal(game.trumpSuit, null);
  assert.equal(game.requestedCardId, null);
  assert.equal(legalAmerikanerCards(game, 2).length, 1);
  amerikanerPlay(game, { cardId: '1-10' });
  amerikanerPlay(game, { cardId: '0-9' });
  assert.equal(game.players[1].tricks, 1);
  assert.equal(amerikanerInventory(game), 3);
});

test('asked partner card is forced in the first trick and trump beats an off-suit ace', () => {
  const game = fixture([[card(2, 4)], [card(2, 14)], [card(1, 14)], [card(0, 14)]], { playerId: 0, type: 'tricks', tricks: 1 });
  game.deckSize = 8;
  amerikanerLead(game, { cardId: '2-4', requestedCardId: '2-14' });
  assert.equal(game.trumpSuit, 2);
  assert.deepEqual(legalAmerikanerCards(game, 1).map(({ id }) => id), ['2-14']);
  amerikanerPlay(game, { playerId: 1, cardId: '2-14' });
  assert.equal(game.partnerId, 1);
});

test('the requested card reveals the partner even when a higher trump wins the first trick', () => {
  const game = fixture([[card(1, 10)], [card(1, 2)], [card(0, 14)]], { playerId: 0, type: 'tricks', tricks: 1 });
  game.deckSize = 3;
  amerikanerLead(game, { cardId: '1-10', requestedCardId: '1-2' });
  amerikanerPlay(game, { playerId: 1, cardId: '1-2' });
  amerikanerPlay(game, { playerId: 2, cardId: '0-14' });
  assert.equal(game.lastResult.partner, 1);
  assert.equal(game.lastResult.tricks[0], 1);
  assert.equal(game.lastResult.tricks[1], 0);
  assert.equal(game.lastResult.scores[0], 1);
  assert.equal(game.lastResult.scores[1], 1);
});

test('winner comparison follows suit and allows trump to beat a higher off-suit card', () => {
  const game = fixture([[card(2, 4)], [card(2, 14)], [card(1, 14)], [card(0, 14)]], { playerId: 0, type: 'tricks', tricks: 1 });
  game.deckSize = 8;
  amerikanerLead(game, { cardId: '2-4', requestedCardId: '2-14' });
  amerikanerPlay(game, { playerId: 1, cardId: '2-14' });
  amerikanerPlay(game, { playerId: 2, cardId: '1-14' });
  amerikanerPlay(game, { playerId: 3, cardId: '0-14' });
  assert.equal(game.players[1].tricks, 1);
  assert.equal(game.turn, 1);
  assert.equal(amerikanerInventory(game), 4);
});

test('must follow the led suit whenever possible', () => {
  const game = fixture([[card(0, 6)], [card(0, 7), card(1, 14)], [card(2, 4)], [card(3, 8)]], { playerId: 0, type: 'americaner', tricks: 1 });
  game.deckSize = 8;
  amerikanerLead(game, { cardId: '0-6' });
  assert.deepEqual(legalAmerikanerCards(game, 1).map(({ id }) => id), ['0-7']);
});

test('normal scoring gives the declarer and found partner the bid, otherwise minus the bid', () => {
  const game = fixture([[card(0, 4)], [card(0, 14)], [card(1, 14)], [card(2, 14)]], { playerId: 0, type: 'tricks', tricks: 1 });
  game.deckSize = 4;
  amerikanerLead(game, { cardId: '0-4', requestedCardId: '0-14' });
  amerikanerPlay(game, { playerId: 1, cardId: '0-14' });
  amerikanerPlay(game, { playerId: 2, cardId: '1-14' });
  amerikanerPlay(game, { playerId: 3, cardId: '2-14' });
  assert.deepEqual(game.lastResult.tricks, [0, 1, 0, 0]);
  assert.equal(game.lastResult.partner, 1);
  assert.deepEqual(game.lastResult.scores, [1, 1, 0, 0]);
  assert.equal(game.status, 'bidding');
});

test('CPU helpers choose legal bids, leads, and cards', () => {
  const game = createAmerikanerGame({ seed: 11, players: 4 });
  const playerId = game.turn;
  const bid = chooseAmerikanerCpuBid(game, playerId);
  assert.ok(bid === 'pass' || bid >= Math.ceil(game.players[playerId].hand.length / 2));
  game.currentBid = { playerId, type: 'tricks', tricks: 7 };
  game.status = 'lead';
  const lead = chooseAmerikanerCpuLead(game, playerId);
  assert.ok(lead.card && lead.requestedCard && lead.card.suit === lead.requestedCard.suit);
  game.status = 'playing'; game.trickNumber = 1; game.trick = [{ playerId: (playerId + 3) % 4, card: card(lead.card.suit, 3) }]; game.turn = playerId;
  const choice = chooseAmerikanerCpuCard(game, playerId);
  assert.ok(legalAmerikanerCards(game, playerId).some(({ id }) => id === choice.id));
});

test('seeded CPU games complete for every seat count without losing cards', () => {
  for (const seats of [3, 4, 5, 6]) {
    const game = createAmerikanerGame({ seed: 700 + seats, players: seats });
    for (let action = 0; action < 2000 && !['complete', 'tie'].includes(game.status); action += 1) {
      if (game.status === 'bidding') amerikanerBid(game, { bid: chooseAmerikanerCpuBid(game) });
      else if (game.status === 'lead') {
        const lead = chooseAmerikanerCpuLead(game);
        amerikanerLead(game, { cardId: lead.card.id, requestedCardId: lead.requestedCard?.id });
      } else amerikanerPlay(game, { cardId: chooseAmerikanerCpuCard(game).id });
      assert.equal(amerikanerInventory(game), game.deckSize, `${seats} players, action ${action}`);
    }
    assert.ok(['complete', 'tie'].includes(game.status), `${seats} players reached a terminal result`);
  }
});
