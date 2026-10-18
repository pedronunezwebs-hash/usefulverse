import assert from 'node:assert/strict';
import test from 'node:test';
import { blackjackHandValue, createBlackjackGame, doubleBlackjack, getBlackjackState, hitBlackjack, splitBlackjack, standBlackjack, startBlackjackRound } from './logic.mjs';

test('aces count as eleven when safe and one when needed', () => {
  assert.deepEqual(blackjackHandValue([{ rank: 'A' }, { rank: '7' }]), { total: 18, soft: true });
  assert.deepEqual(blackjackHandValue([{ rank: 'A' }, { rank: '9' }, { rank: '5' }]), { total: 15, soft: false });
  assert.deepEqual(blackjackHandValue([{ rank: 'A' }, { rank: 'A' }, { rank: '9' }]), { total: 21, soft: true });
});

test('rounds use a shuffled standard deck, keep dealer hole card private until resolution and count a bust', () => {
  let n = 0; const game = createBlackjackGame({ random: () => (n++ % 50) / 50 });
  startBlackjackRound(game); const state = getBlackjackState(game);
  assert.equal(game.drawPile.length + game.player.length + game.dealer.length, 52);
  assert.equal(state.dealer.length, 1);
  if (state.phase !== 'finished') {
    assert.equal(hitBlackjack(game).ok, true);
    while (game.phase === 'player' && blackjackHandValue(game.player).total < 21) hitBlackjack(game);
    if (game.phase === 'player') standBlackjack(game);
  }
  assert.equal(getBlackjackState(game).hiddenDealerCards, 0);
  assert.ok(getBlackjackState(game).dealer.length >= 2);
  assert.equal(game.stats.rounds, 1);
});

test('stand makes dealer draw below 17 and stops at 17; finished rounds reject further actions', () => {
  const game = createBlackjackGame({ random: () => 0.37 }); startBlackjackRound(game);
  if (game.phase === 'player') standBlackjack(game);
  assert.ok(blackjackHandValue(game.dealer).total >= 17 || blackjackHandValue(game.player).total > 21);
  assert.equal(hitBlackjack(game).ok, false);
  assert.equal(standBlackjack(game).ok, false);
});

test('reaching 21 by hitting reveals the completed dealer hand before settling', () => {
  const game = createBlackjackGame();
  game.phase = 'player';
  game.player = [{ rank: 'K' }, { rank: '6' }];
  game.dealer = [{ rank: '10' }, { rank: '6' }];
  game.drawPile = [{ rank: '9' }, { rank: '5' }];
  const result = hitBlackjack(game);
  assert.equal(result.ok, true);
  assert.equal(blackjackHandValue(game.player).total, 21);
  assert.equal(game.phase, 'finished');
  assert.equal(blackjackHandValue(game.dealer).total, 25);
  assert.equal(game.outcome, 'player-wins');
});

test('invalid random sources are rejected', () => {
  assert.throws(() => createBlackjackGame({ random: () => 1 }), /Random values/u);
});

test('a fresh table reports a full deck before the first hand starts', () => {
  assert.equal(getBlackjackState(createBlackjackGame()).remainingCards, 52);
});

test('double takes exactly one card, then ends that hand without a stake', () => {
  const game = createBlackjackGame(); game.phase = 'player';
  game.player = [{ rank: '5' }, { rank: '6' }]; game.dealer = [{ rank: '10' }, { rank: '8' }];
  game.drawPile = [{ rank: '2' }, { rank: '10' }];
  assert.equal(getBlackjackState(game).canDouble, true);
  const result = doubleBlackjack(game);
  assert.equal(result.ok, true); assert.equal(game.player.length, 3); assert.equal(game.phase, 'finished');
  assert.equal(game.drawPile.length, 1); assert.equal(game.stats.rounds, 1);
  assert.equal(doubleBlackjack(game).ok, false);
});

test('split needs equal ranks, creates two hands, plays them in sequence, and settles one practice round', () => {
  const game = createBlackjackGame(); game.phase = 'player';
  game.player = [{ rank: '8', id: '8-a' }, { rank: '8', id: '8-b' }]; game.dealer = [{ rank: '10' }, { rank: '7' }];
  game.drawPile = [{ rank: '5', id: 'five' }, { rank: '3', id: 'three' }, { rank: '2', id: 'two' }];
  assert.equal(getBlackjackState(game).canSplit, true);
  const result = splitBlackjack(game);
  assert.equal(result.ok, true); assert.equal(game.hands.length, 2); assert.equal(game.hands[0].length, 2); assert.equal(game.hands[1].length, 2);
  assert.equal(game.hands[0][1].rank, '2'); assert.equal(game.hands[1][1].rank, '3');
  assert.equal(splitBlackjack(game).reason, 'split-unavailable');
  assert.equal(standBlackjack(game).state.activeHandIndex, 1);
  assert.equal(standBlackjack(game).state.phase, 'finished');
  assert.equal(game.stats.rounds, 1); assert.equal(game.handOutcomes.length, 2);
});

test('split hands can double independently and a non-pair cannot split', () => {
  const game = createBlackjackGame(); game.phase = 'player';
  game.player = [{ rank: '9' }, { rank: '8' }]; game.dealer = [{ rank: '10' }, { rank: '7' }]; game.drawPile = [{ rank: '4' }, { rank: '2' }];
  assert.equal(splitBlackjack(game).reason, 'split-unavailable');
  assert.equal(getBlackjackState(game).canDouble, true);
  hitBlackjack(game); assert.equal(getBlackjackState(game).canDouble, false);
});
