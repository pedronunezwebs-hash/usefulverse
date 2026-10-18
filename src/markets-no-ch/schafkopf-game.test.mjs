import test from 'node:test';
import assert from 'node:assert/strict';
import { SCHAFKOPF_EYES, availableSchafkopfCalls, callSchafkopfAce, createSchafkopfGame, legalSchafkopfCards, playSchafkopfCard, playSchafkopfCpuUntilHuman, schafkopfCpuCard, schafkopfIsTrump, winningSchafkopfPlay } from './schafkopf-game.mjs';

const c = (suit, rank) => ({ id: suit * 8 + rank, suit, rank });

test('deal creates 32 unique cards, four hands of eight and a callable ace', () => {
  const game = createSchafkopfGame({ seed: 77 });
  assert.equal(game.hands.length, 4);
  assert.ok(game.hands.every((hand) => hand.length === 8));
  assert.equal(new Set(game.hands.flat().map((card) => card.id)).size, 32);
  assert.ok(availableSchafkopfCalls(game).length > 0);
  assert.deepEqual(createSchafkopfGame({ seed: 77 }), game);
});

test('call choices exclude hearts, held aces and suits without a companion card', () => {
  const game = { phase: 'call', hands: [[c(0, 7), c(1, 2), c(2, 0), c(3, 7), c(3, 5)], [c(1, 7)], [], []] };
  assert.deepEqual(availableSchafkopfCalls(game), [1]);
  game.hands[0] = [c(1, 0), c(1, 7), c(2, 0), c(3, 7)];
  assert.deepEqual(availableSchafkopfCalls(game), []);
});

test('trump hierarchy is Ober, Unter, then hearts with ace above ten', () => {
  assert.ok(schafkopfIsTrump(c(0, 5), 1));
  assert.ok(schafkopfIsTrump(c(3, 6), 1));
  assert.ok(schafkopfIsTrump(c(2, 7), 1));
  assert.ok(!schafkopfIsTrump(c(0, 7), 1));
  const plays = [
    { seat: 0, card: c(2, 3) }, { seat: 1, card: c(1, 5) },
    { seat: 2, card: c(0, 5) }, { seat: 3, card: c(2, 7) },
  ];
  assert.equal(winningSchafkopfPlay(plays, 1).seat, 2);
  assert.equal(SCHAFKOPF_EYES.reduce((a, b) => a + b, 0) * 4, 120);
});

test('players must follow the led plain suit or trump when possible', () => {
  const plain = [c(0, 1), c(0, 7), c(2, 0)];
  assert.deepEqual(legalSchafkopfCards(plain, [{ seat: 1, card: c(0, 2) }], 3).map((x) => x.id), [1, 7]);
  assert.deepEqual(legalSchafkopfCards(plain, [{ seat: 1, card: c(2, 1) }], 3).map((x) => x.id), [16]);
  assert.equal(legalSchafkopfCards([c(1, 3)], [{ seat: 1, card: c(0, 2) }], 3).length, 1);
});

test('called ace reveals partner only when played; eight tricks decide 61 eyes', () => {
  const game = createSchafkopfGame({ seed: 123 });
  const suit = availableSchafkopfCalls(game)[0];
  callSchafkopfAce(game, suit);
  assert.ok(game.partner > 0);
  assert.equal(game.teamsKnown, false);
  const partner = game.partner;
  while (game.phase === 'play') {
    const seat = game.toMove;
    const play = schafkopfCpuCard(game, seat);
    playSchafkopfCard(game, seat, play);
    if (game.phase === 'play') playSchafkopfCpuUntilHuman(game, 3);
  }
  assert.equal(game.tricks.length, 8);
  assert.equal(game.tricksWon.reduce((a, b) => a + b, 0), 8);
  assert.equal(game.pointsWon.reduce((a, b) => a + b, 0), 120);
  assert.equal(game.teamsKnown, true);
  assert.ok(partner > 0);
  assert.ok(['callers', 'defenders'].includes(game.score.winner));
  assert.equal(game.score.winner, game.score.callerSide >= 61 ? 'callers' : 'defenders');
});

test('illegal play is rejected without mutating a hand', () => {
  const game = createSchafkopfGame({ seed: 4 }); const suit = availableSchafkopfCalls(game)[0]; callSchafkopfAce(game, suit);
  game.toMove = 0; game.trick = [{ seat: 3, card: c(0, 1) }];
  const illegal = game.hands[0].find((card) => card.suit !== 0 && !schafkopfIsTrump(card, suit));
  if (illegal) {
    const before = game.hands[0].length;
    assert.throws(() => playSchafkopfCard(game, 0, illegal.id));
    assert.equal(game.hands[0].length, before);
  }
});
