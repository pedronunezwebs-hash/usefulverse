import assert from 'node:assert/strict';
import test from 'node:test';
import { bidEuchre, chooseEuchreBid, chooseEuchreCard, chooseEuchreDiscard, createEuchreDeck, createEuchreGame, dealEuchreHand, discardEuchreCard, getEuchreCardStrength, getEuchreCardSuit, getLegalEuchreCards, isEuchreGameWon, playEuchreCard, resolveEuchreTrick, scoreEuchreHand } from './logic.mjs';

const card = (rank, suit) => createEuchreDeck().find((item) => item.rank === rank && item.suit === suit);

test('the Euchre deck has 24 unique cards and deals five to each player plus four kitty cards', () => {
  const dealt = dealEuchreHand({ random: () => 0.5, dealer: 2 });
  assert.equal(createEuchreDeck().length, 24);
  assert.equal(new Set(createEuchreDeck().map(({ id }) => id)).size, 24);
  assert.deepEqual(dealt.hands.map((hand) => hand.length), [5, 5, 5, 5]);
  assert.equal(dealt.kitty.length, 4);
  assert.equal(dealt.upcard.id, dealt.kitty[0].id);
  assert.equal(dealt.firstBidder, 3);
});

test('left bower belongs to trump suit for following suit and ranks below right bower', () => {
  const leftBower = card('J', 'diamonds');
  assert.equal(getEuchreCardSuit(leftBower, 'hearts'), 'hearts');
  const hand = [leftBower, card('A', 'diamonds'), card('9', 'clubs')];
  assert.deepEqual(getLegalEuchreCards(hand, 'hearts', 'hearts'), [leftBower]);
  assert.deepEqual(getLegalEuchreCards(hand, 'diamonds', 'hearts'), [card('A', 'diamonds')]);
  const trick = [
    { player: 0, card: card('A', 'clubs') },
    { player: 1, card: leftBower },
    { player: 2, card: card('J', 'hearts') },
    { player: 3, card: card('K', 'clubs') },
  ];
  assert.equal(resolveEuchreTrick(trick, 'hearts').winner, 2);
});

test('trick ranking distinguishes trump, led suit, and off-suit cards', () => {
  const trick = [
    { player: 0, card: card('A', 'clubs') },
    { player: 1, card: card('9', 'hearts') },
    { player: 2, card: card('K', 'clubs') },
    { player: 3, card: card('A', 'spades') },
  ];
  assert.equal(resolveEuchreTrick(trick, 'hearts').winner, 1);
  assert.equal(resolveEuchreTrick(trick, 'diamonds').winner, 0);
  assert.throws(() => resolveEuchreTrick(trick.slice(0, 3), 'hearts'), /exactly four/u);
});

test('normal and trump cards rank from ace down, with the two bowers above the ace', () => {
  const trump = 'hearts';
  assert.ok(getEuchreCardStrength(card('A', 'clubs'), trump) > getEuchreCardStrength(card('K', 'clubs'), trump));
  assert.ok(getEuchreCardStrength(card('A', trump), trump) > getEuchreCardStrength(card('K', trump), trump));
  assert.ok(getEuchreCardStrength(card('J', 'hearts'), trump) > getEuchreCardStrength(card('J', 'diamonds'), trump));
  assert.ok(getEuchreCardStrength(card('J', 'diamonds'), trump) > getEuchreCardStrength(card('A', trump), trump));
});

test('hand score follows Euchre maker, march, euchre, and lone-maker rules', () => {
  assert.deepEqual(scoreEuchreHand({ makerTeam: 0, makerTricks: 3 }), { team: 0, points: 1, outcome: 'made' });
  assert.deepEqual(scoreEuchreHand({ makerTeam: 1, makerTricks: 5 }), { team: 1, points: 2, outcome: 'march' });
  assert.deepEqual(scoreEuchreHand({ makerTeam: 0, makerTricks: 5, alone: true }), { team: 0, points: 4, outcome: 'march' });
  assert.deepEqual(scoreEuchreHand({ makerTeam: 1, makerTricks: 2 }), { team: 0, points: 2, outcome: 'euchred' });
  assert.throws(() => scoreEuchreHand({ makerTeam: 0, makerTricks: 6 }), /Invalid/u);
});

test('shuffle rejects a broken random source instead of producing a corrupt deal', () => {
  assert.throws(() => dealEuchreHand({ random: () => 1 }), /Random source/u);
});

test('bidding passes into round two, rejects the turned-up suit there, then lets the maker discard', () => {
  let game = createEuchreGame({ random: () => 0.25, target: 5, dealer: 3 });
  const first = game.currentPlayer;
  for (let count = 0; count < 4; count += 1) game = bidEuchre(game, { type: 'pass' });
  assert.equal(game.bidRound, 2);
  assert.equal(game.currentPlayer, first);
  assert.equal(bidEuchre(game, { type: 'name-trump', suit: game.upcard.suit }), null);
  const maker = game.currentPlayer;
  const chosenTrump = ['clubs', 'diamonds', 'hearts', 'spades'].find((suit) => suit !== game.upcard.suit);
  game = bidEuchre(game, { type: 'name-trump', suit: chosenTrump });
  assert.equal(game.phase, 'discard');
  assert.equal(game.maker, maker);
  assert.equal(game.hands[maker].length, 6);
  assert.equal(discardEuchreCard(game, 'not-a-card'), null);
  game = discardEuchreCard(game, chooseEuchreDiscard(game));
  assert.equal(game.phase, 'play');
  assert.equal(game.hands[maker].length, 5);
});

test('all-pass bids redeal and rotate the dealer without changing the score', () => {
  let game = createEuchreGame({ random: () => 0.4, dealer: 0 });
  for (let round = 0; round < 2; round += 1) {
    for (let count = 0; count < 4; count += 1) game = bidEuchre(game, { type: 'pass' });
  }
  assert.equal(game.phase, 'bidding');
  assert.equal(game.dealer, 1);
  assert.deepEqual(game.scores, [0, 0]);
  assert.equal(game.handNumber, 2);
});

test('a complete local bot game follows suit, scores each hand and stops at its target', () => {
  let seed = 12345;
  const random = () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
  let game = createEuchreGame({ random, target: 5 });
  let turns = 0;
  while (game.phase !== 'over' && turns < 1_000) {
    turns += 1;
    if (game.phase === 'bidding') game = bidEuchre(game, chooseEuchreBid(game), { random });
    else if (game.phase === 'discard') game = discardEuchreCard(game, chooseEuchreDiscard(game));
    else if (game.phase === 'play') game = playEuchreCard(game, chooseEuchreCard(game), { random });
    else assert.fail(`Unexpected phase: ${game.phase}`);
    assert.ok(game, `Turn ${turns} was rejected unexpectedly`);
  }
  assert.equal(game.phase, 'over');
  assert.ok([0, 1].includes(game.winner));
  assert.equal(isEuchreGameWon(game.scores, 5), game.winner);
  assert.ok(turns < 1_000);
});
