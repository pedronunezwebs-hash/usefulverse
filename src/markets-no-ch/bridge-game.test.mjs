import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bridgeCardCount, callBridge, chooseBridgeCpuCard, createBridgeGame, legalBridgeCalls, legalBridgeCards,
  playBridgeCard, chooseBridgeCpuCall, scoreBridgeDuplicate, startNextBridgeHand, winningBridgePlay,
} from './bridge-game.mjs';

test('deal conserves 52 unique cards and rotates all four seats', () => {
  const game = createBridgeGame({ seed: 42, dealer: 3 });
  assert.equal(game.hands.length, 4);
  assert.deepEqual(game.hands.map((hand) => hand.length), [13, 13, 13, 13]);
  assert.equal(new Set(game.hands.flat().map(({ id }) => id)).size, 52);
  assert.equal(bridgeCardCount(game), 52);
  assert.equal(game.toMove, 3);
});

test('auction validates bid order, ends after three passes, and assigns declarer, dummy and leader', () => {
  const game = createBridgeGame({ seed: 7, dealer: 2 });
  callBridge(game, 2, { type: 'bid', level: 1, strain: 3 });
  callBridge(game, 3, { type: 'pass' });
  callBridge(game, 0, { type: 'bid', level: 2, strain: 3 });
  callBridge(game, 1, { type: 'pass' });
  callBridge(game, 2, { type: 'pass' });
  callBridge(game, 3, { type: 'pass' });
  assert.equal(game.phase, 'play');
  assert.equal(game.contract.level, 2);
  assert.equal(game.contract.strain, 3);
  assert.equal(game.declarer, 2); // First South bid of spades for North–South.
  assert.equal(game.dummy, 0);
  assert.equal(game.leader, 3);
  assert.equal(game.toMove, 3);
});

test('double and redouble require the opposing and declaring sides respectively', () => {
  const game = createBridgeGame({ seed: 1, dealer: 2 });
  callBridge(game, 2, { type: 'bid', level: 1, strain: 0 });
  assert.ok(legalBridgeCalls(game, 3).some(({ type }) => type === 'double'));
  callBridge(game, 3, { type: 'double' });
  assert.ok(legalBridgeCalls(game, 0).some(({ type }) => type === 'redouble'));
  callBridge(game, 0, { type: 'redouble' });
  callBridge(game, 1, { type: 'pass' }); callBridge(game, 2, { type: 'pass' }); callBridge(game, 3, { type: 'pass' });
  assert.equal(game.contract.doubled, 2);
});

test('four opening passes produce a passed-out board', () => {
  const game = createBridgeGame({ seed: 2, dealer: 0 });
  for (const seat of [0, 1, 2, 3]) callBridge(game, seat, { type: 'pass' });
  assert.equal(game.status, 'complete');
  assert.equal(game.phase, 'passedOut');
  assert.equal(game.result.passedOut, true);
});

test('players must follow suit when able; a void player may discard or trump', () => {
  const game = createBridgeGame({ seed: 3, dealer: 0 });
  game.phase = 'play'; game.contract = { level: 1, strain: 2, side: 0, doubled: 0 }; game.toMove = 1; game.openingLeadMade = true;
  game.hands[1] = [{ id: 1, suit: 0, rank: 14 }, { id: 2, suit: 1, rank: 3 }, { id: 3, suit: 2, rank: 2 }];
  game.trick = [{ seat: 0, card: { id: 0, suit: 0, rank: 2 } }];
  assert.deepEqual(legalBridgeCards(game, 1).map(({ id }) => id), [1]);
  game.hands[1] = [{ id: 2, suit: 1, rank: 3 }, { id: 3, suit: 2, rank: 2 }];
  assert.deepEqual(new Set(legalBridgeCards(game, 1).map(({ id }) => id)), new Set([2, 3]));
});

test('trick winner respects led suit, trump and notrump', () => {
  const trick = [
    { seat: 0, card: { id: 1, suit: 0, rank: 14 } },
    { seat: 1, card: { id: 2, suit: 3, rank: 2 } },
    { seat: 2, card: { id: 3, suit: 0, rank: 3 } },
    { seat: 3, card: { id: 4, suit: 3, rank: 14 } },
  ];
  assert.equal(winningBridgePlay(trick, null).seat, 0);
  assert.equal(winningBridgePlay(trick, 3).seat, 3);
});

test('duplicate scoring covers major contracts, vulnerability, doubles and undertricks', () => {
  assert.equal(scoreBridgeDuplicate({ level: 4, strain: 3, doubled: 0 }, 10, false).declarerScore, 420);
  assert.equal(scoreBridgeDuplicate({ level: 4, strain: 3, doubled: 0 }, 10, true).declarerScore, 620);
  assert.equal(scoreBridgeDuplicate({ level: 4, strain: 3, doubled: 1 }, 8, false).declarerScore, -300);
  assert.equal(scoreBridgeDuplicate({ level: 6, strain: 4, doubled: 0 }, 12, true).declarerScore, 1440);
  assert.equal(scoreBridgeDuplicate({ level: 3, strain: 4, doubled: 0 }, 10, false).declarerScore, 430);
});

test('CPU auction and full 13-trick hand terminate with legal plays', () => {
  const game = createBridgeGame({ seed: 991, dealer: 3 });
  let auctionSafety = 0;
  while (game.phase === 'auction' && auctionSafety < 80) {
    const seat = game.toMove;
    callBridge(game, seat, seat === 2 ? { type: 'pass' } : chooseBridgeCpuCall(game, seat));
    auctionSafety += 1;
  }
  if (game.phase === 'passedOut') {
    game.phase = 'auction'; game.status = 'playing'; game.auction = []; game.highestBid = null; game.consecutivePasses = 0; game.toMove = game.dealer;
    callBridge(game, game.dealer, { type: 'bid', level: 1, strain: 4 });
    for (let i = 0; i < 3; i += 1) callBridge(game, game.toMove, { type: 'pass' });
  }
  let playSafety = 0;
  while (game.phase === 'play' && playSafety < 52) {
    const seat = game.toMove;
    const actingSeat = seat === game.dummy ? game.declarer : seat;
    playBridgeCard(game, seat, chooseBridgeCpuCard(game, seat), actingSeat);
    assert.equal(bridgeCardCount(game), 52);
    playSafety += 1;
  }
  assert.equal(game.status, 'complete');
  assert.equal(game.tricks.length, 13);
  assert.equal(game.result.tricksBySide[0] + game.result.tricksBySide[1], 13);
  const next = startNextBridgeHand(game, { vulnerability: 'ew' });
  assert.equal(next.dealer, (game.dealer + 1) % 4);
  assert.equal(next.vulnerability, 'ew');
  assert.deepEqual(next.scores, game.scores);
});

