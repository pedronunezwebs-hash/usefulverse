import test from 'node:test';
import assert from 'node:assert/strict';
import { bidPinochle, choosePinochleBotCard, choosePinochleExchangeCards, choosePinochleTrump, createPinochleDeck, createPinochleGame, legalPinochleCards, playPinochleCard, returnPinochleExchange, scorePinochleMeld } from './logic.mjs';

const random = () => 0.37;

test('deals unique card ids and correct hand sizes in both deck profiles', () => {
  for (const [decks, total, handSize] of [[1, 48, 12], [2, 80, 20]]) {
    const deck = createPinochleDeck(decks);
    const game = createPinochleGame({ decks, random });
    assert.equal(deck.length, total);
    assert.equal(new Set(deck.map((card) => card.id)).size, total);
    assert.deepEqual(game.hands.map((hand) => hand.length), [handSize, handSize, handSize, handSize]);
  }
});

test('scores single and double deck runs, marriages, pinochles and counters', () => {
  const run = ['clubs-14-0','clubs-10-0','clubs-13-0','clubs-12-0','clubs-11-0'].map((id) => {
    const [, rank, copy] = id.split('-'); return { id, suit: 'clubs', rank: Number(rank), copy: Number(copy) };
  });
  assert.equal(scorePinochleMeld(run, 'clubs', 1).total, 150);
  const doubleRun = [...run, ...run.map((card) => ({ ...card, id: `${card.id}-second`, copy: 1 }))];
  assert.equal(scorePinochleMeld(doubleRun, 'clubs', 1).total, 1500);
  const doubleDeckHand = ['14','10','13','12','11'].flatMap((rank) => [0,1,2,3].map((copy) => ({ id:`c-${rank}-${copy}`, suit:'clubs', rank:Number(rank), copy })));
  assert.equal(scorePinochleMeld(doubleDeckHand, 'clubs', 2).total, 300);
  const pinochle = [{ id:'jd',suit:'diamonds',rank:11,copy:0 },{ id:'qs',suit:'spades',rank:12,copy:0 }];
  assert.equal(scorePinochleMeld(pinochle, 'hearts', 1).total, 40);
});

test('auction locks passed players, forces dealer after three opening passes, and selects trump', () => {
  let game = createPinochleGame({ random });
  game = bidPinochle(game, 0, 250);
  game = bidPinochle(game, 1, null);
  game = bidPinochle(game, 2, null);
  assert.equal(game.currentPlayer, 3);
  game = bidPinochle(game, 3, null);
  assert.equal(game.phase, 'choose-trump');
  assert.equal(game.declarer, 0);
  game = choosePinochleTrump(game, 0, 'spades');
  assert.equal(game.phase, 'exchange-return');
  assert.deepEqual(game.hands.map((hand)=>hand.length),[16,12,8,12]);
  const received = game.exchangeReceived.map(({id})=>id);
  assert.equal(received.length,4);
  assert.equal(choosePinochleExchangeCards(game.hands[0],game.trump).length,4);
  game = returnPinochleExchange(game,0,choosePinochleExchangeCards(game.hands[0],game.trump).map(({id})=>id));
  assert.deepEqual(game.hands.map((hand)=>hand.length),[12,12,12,12]);
  assert.equal(game.phase,'playing');
  assert.throws(() => choosePinochleTrump(game, 0, 'stars'), RangeError);
});

test('must follow and beat where possible, and trump when void', () => {
  const base = { phase:'playing',currentPlayer:1,trump:'spades',hands:[[],[
    {id:'c-a',suit:'clubs',rank:14},{id:'c-k',suit:'clubs',rank:13},{id:'h-a',suit:'hearts',rank:14},{id:'s-9',suit:'spades',rank:9},
  ],[],[]],currentTrick:[{player:0,card:{id:'c-q',suit:'clubs',rank:12}}] };
  assert.deepEqual(legalPinochleCards(base,1).map((card)=>card.id),['c-a','c-k']);
  const voidInClubs = { ...base, hands:[[],[{id:'s-k',suit:'spades',rank:13},{id:'h-a',suit:'hearts',rank:14}],[],[]],currentTrick:[{player:0,card:{id:'c-a',suit:'clubs',rank:14}}] };
  assert.deepEqual(legalPinochleCards(voidInClubs,1).map((card)=>card.id),['s-k']);
});

test('plays a complete hand with legal bot moves and the expected trick count', () => {
  for (const decks of [1, 2]) {
    let game = createPinochleGame({ decks, random });
    const opening = decks === 1 ? 250 : 50;
    for (const [player,bid] of [[0,opening],[1,null],[2,null],[3,null]]) if (game.phase === 'auction') game = bidPinochle(game, player, bid);
    game = choosePinochleTrump(game, game.declarer, 'hearts');
    if (game.phase === 'exchange-return') game = returnPinochleExchange(game, game.declarer, choosePinochleExchangeCards(game.hands[game.declarer], game.trump).map(({id})=>id));
    let moves = 0;
    while (game.phase === 'playing' && moves < 100) {
      const card = choosePinochleBotCard(game);
      assert.ok(legalPinochleCards(game).some(({id})=>id===card.id));
      game = playPinochleCard(game, game.currentPlayer, card.id);
      moves += 1;
    }
    assert.equal(game.phase, 'complete');
    assert.equal(game.tricks.length, game.handSize);
    assert.equal(moves, game.handSize * 4);
    assert.equal(game.trickPoints[0] + game.trickPoints[1], decks === 1 ? 250 : 50);
  }
});
