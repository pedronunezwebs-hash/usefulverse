import test from 'node:test';
import assert from 'node:assert/strict';
import {
  choosePresidentCpuAction, createPresidentDeck, createPresidentGame, presidentInventory,
  presidentIsLegalPlay, presidentPass, presidentPlay, presidentReturnExchange,
} from './president-game.mjs';

const card = (deck, suit, rank) => ({ id: `${deck}-${suit}-${rank}`, deck, suit, rank });
function fixture({ hands, trick = [], currentPlayer = 0, lastPlay = null, passed = [], players = hands.length } = {}) {
  const deck = createPresidentDeck(2);
  const used = new Set([...hands.flat(), ...trick].map(({ id }) => id));
  return {
    players: Array.from({ length: players }, (_, id) => ({ id, score: 0, hand: [...(hands[id] ?? [])] })),
    deckCount: 1, currentPlayer, status: 'playing', round: 1, targetScore: 11,
    trick: [...trick], discard: deck.filter(({ id }) => !used.has(id)).slice(0, 0),
    lastPlay, passed: [...passed], placements: [], lastPlacements: [], exchangeQueue: [], exchangeIndex: 0, exchangeStage: null,
    winner: null, seed: 2, turns: 0, lastAction: 'fixture',
  };
}

test('deals all cards across three to eight seats with one or two decks and no jokers', () => {
  assert.equal(createPresidentDeck(7).length, 52);
  for (let players = 3; players <= 8; players += 1) {
    const game = createPresidentGame({ seed: 7, players });
    assert.equal(game.deckCount, players > 6 ? 2 : 1);
    assert.equal(presidentInventory(game), game.deckCount * 52);
    assert.ok(game.players.every(({ hand }) => hand.length === Math.floor(game.deckCount * 52 / players) || hand.length === Math.ceil(game.deckCount * 52 / players)));
    assert.ok(game.players[game.currentPlayer].hand.some((card) => card.rank === 3 && card.suit === 3));
  }
  assert.throws(() => createPresidentGame({ players: 2 }), /3 to 8/u);
});

test('requires equal-sized sets and strictly higher rank; twos beat aces', () => {
  const pair = fixture({ hands: [[card(0, 0, 8), card(0, 1, 8), card(0, 2, 2)], [card(0, 0, 9), card(0, 1, 2)]] });
  pair.trick = [card(1, 0, 7), card(1, 1, 7)];
  pair.lastPlay = { player: 1, rank: 7, cards: pair.trick };
  assert.equal(presidentIsLegalPlay(pair, 0, ['0-0-8', '0-1-8']), true);
  assert.equal(presidentIsLegalPlay(pair, 0, ['0-2-2']), false);
  assert.equal(presidentIsLegalPlay(pair, 0, ['0-0-8']), false);
  const two = fixture({ hands: [[card(0, 0, 2)], [card(0, 1, 2)]] });
  two.trick = [card(1, 0, 14)]; two.lastPlay = { player: 1, rank: 14, cards: two.trick };
  assert.equal(presidentIsLegalPlay(two, 0, ['0-0-2']), true);
});

test('passing is optional and a pass can rejoin after a new player climbs', () => {
  const game = fixture({
    hands: [[card(0, 0, 8), card(0, 1, 12)], [card(0, 0, 9), card(0, 1, 3)], [card(0, 0, 10), card(0, 1, 4)], [card(0, 0, 11), card(0, 1, 5)]],
    trick: [card(1, 0, 7)], lastPlay: { player: 2, rank: 7, cards: [card(1, 0, 7)] }, currentPlayer: 0,
  });
  presidentPass(game, 0);
  assert.deepEqual(game.passed, [0]);
  assert.equal(game.currentPlayer, 1);
  presidentPlay(game, 1, ['0-0-9']);
  assert.deepEqual(game.passed, []);
  assert.equal(game.currentPlayer, 2);
  presidentPlay(game, 2, ['0-0-10']);
  assert.equal(game.currentPlayer, 3);
  presidentPlay(game, 3, ['0-0-11']);
  assert.equal(game.currentPlayer, 0);
  assert.equal(presidentIsLegalPlay(game, 0, ['0-1-12']), true);
});

test('clears a trick only after every other active player passes and the last player leads', () => {
  const game = fixture({
    hands: [[card(0, 0, 9), card(0, 1, 13)], [card(0, 0, 10), card(0, 1, 12)], [card(0, 0, 11), card(0, 1, 14)]],
    trick: [card(1, 0, 8)], lastPlay: { player: 2, rank: 8, cards: [card(1, 0, 8)] }, currentPlayer: 0,
  });
  presidentPass(game, 0);
  presidentPass(game, 1);
  assert.equal(game.trick.length, 0);
  assert.equal(game.currentPlayer, 2);
  assert.equal(game.discard.length, 1);
});

test('rankings award points and start next deal with two-card exchange; human President chooses returns', () => {
  const game = fixture({
    hands: [[card(0, 0, 3)], [card(0, 1, 5), card(0, 2, 8)], [card(0, 3, 7)], [card(0, 0, 9), card(0, 1, 10)]],
    currentPlayer: 0,
  });
  game.players[1].hand = [];
  game.players[0].hand = [card(0, 0, 3)];
  game.players[2].hand = [card(0, 3, 7)];
  game.players[3].hand = [card(0, 0, 9), card(0, 1, 10)];
  presidentPlay(game, 0, ['0-0-3']);
  presidentPlay(game, 2, ['0-3-7']);
  assert.equal(game.players[0].score, 2);
  assert.equal(game.round, 2);
  assert.equal(game.status, 'exchange');
  assert.equal(game.lastPlacements[0], 0);
  assert.equal(game.exchangeQueue[0].from, 3);
  assert.equal(game.exchangeQueue[0].to, 0);
  const humanExchange = createPresidentGame({ seed: 20, players: 4 });
  humanExchange.round = 1;
  humanExchange.lastPlacements = [0, 1, 2, 3];
  humanExchange.status = 'exchange';
  humanExchange.exchangeQueue = [{ from: 3, to: 0, count: 2 }];
  humanExchange.exchangeIndex = 0;
  humanExchange.exchangeStage = 'return';
  const ids = humanExchange.players[0].hand.slice(0, 2).map(({ id }) => id);
  presidentReturnExchange(humanExchange, ids);
  assert.equal(humanExchange.status, 'playing');
  assert.equal(humanExchange.currentPlayer, 3);
  assert.equal(presidentInventory(humanExchange), 52);
});

test('CPU only returns legal plays or passes when it cannot climb', () => {
  const game = fixture({
    hands: [[card(0, 0, 5)], [card(0, 0, 9), card(0, 1, 9)]],
    trick: [card(1, 0, 7)], lastPlay: { player: 0, rank: 7, cards: [card(1, 0, 7)] }, currentPlayer: 1,
  });
  const action = choosePresidentCpuAction(game, 1);
  assert.equal(action.type, 'play');
  assert.equal(presidentIsLegalPlay(game, 1, action.cardIds), true);
  game.players[1].hand = [card(0, 0, 5)];
  assert.deepEqual(choosePresidentCpuAction(game, 1), { type: 'pass' });
});

test('seeded CPU matches preserve every card through passes, scoring and exchanges', () => {
  for (let seats = 3; seats <= 8; seats += 1) {
    const game = createPresidentGame({ seed: 8042 + seats, players: seats, targetScore: 4 });
    let actions = 0;
    while (game.status !== 'complete' && actions < 12000) {
      if (game.status === 'exchange') {
        const exchange = game.exchangeQueue[game.exchangeIndex];
        if (exchange?.to <= 1) presidentReturnExchange(game, game.players[exchange.to].hand.slice(0, exchange.count).map(({ id }) => id));
      } else if (game.status === 'playing') {
        const player = game.currentPlayer;
        const action = choosePresidentCpuAction(game, player);
        if (action.type === 'play') presidentPlay(game, player, action.cardIds);
        else presidentPass(game, player);
      }
      const cards = [...game.players.flatMap(({ hand }) => hand), ...game.trick, ...game.discard];
      assert.equal(cards.length, game.deckCount * 52, `${seats} seats retain full inventory after action ${actions}`);
      assert.equal(new Set(cards.map(({ id }) => id)).size, cards.length, `${seats} seats do not duplicate cards after action ${actions}`);
      actions += 1;
    }
    assert.equal(game.status, 'complete', `${seats} seats finish within the safety bound`);
    assert.ok(actions > seats, `${seats} seats complete multiple turns`);
  }
});
