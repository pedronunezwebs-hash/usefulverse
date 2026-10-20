import assert from 'node:assert/strict';
import test from 'node:test';
import { actMus, advanceMusBots, chooseMusBotAction, createMusGame } from './game.mjs';
const fixedRandom = () => 0.314159;

test('deal makes four private four-card hands from one unique 40-card deck', () => {
  const game = createMusGame({ random: fixedRandom });
  assert.equal(game.phase, 'mus');
  assert.equal(game.turn, game.mano);
  assert.deepEqual(game.hands.map((hand) => hand.length), [4, 4, 4, 4]);
  assert.equal(game.drawPile.length, 24);
  assert.equal(new Set([...game.hands.flat(), ...game.drawPile].map(({ id }) => id)).size, 40);
});

test('all four Mus votes open a discard round, replace selected cards and preserve all deck cards', () => {
  let game = createMusGame({ random: fixedRandom });
  for (let seat = 0; seat < 4; seat += 1) game = actMus(game, seat, { type: 'mus' }, { random: fixedRandom });
  assert.equal(game.phase, 'discard');
  for (let seat = 0; seat < 4; seat += 1) {
    const selected = game.hands[seat].slice(0, seat === 0 ? 2 : 1).map(({ id }) => id);
    game = actMus(game, seat, { type: 'discard', cardIds: selected }, { random: fixedRandom });
  }
  assert.equal(game.phase, 'mus');
  assert.equal(game.drawPile.length, 19);
  assert.equal(game.discardPile.length, 5);
  const allCards = [...game.hands.flat(), ...game.drawPile, ...game.discardPile];
  assert.equal(allCards.length, 40);
  assert.equal(new Set(allCards.map(({ id }) => id)).size, 40);
});

test('one No Mus vote immediately ends exchange and begins Grande', () => {
  const game = createMusGame({ random: fixedRandom });
  const noMus = actMus(game, game.turn, { type: 'no-mus' }, { random: fixedRandom });
  assert.equal(noMus.phase, 'betting');
  assert.equal(noMus.lanceName, 'grande');
  assert.equal(noMus.drawPile.length, 24);
});

test('opening wager, raise and response follow team turns and record an accepted lance', () => {
  let game = createMusGame({ random: fixedRandom });
  game = actMus(game, game.turn, { type: 'no-mus' }, { random: fixedRandom });
  game = actMus(game, 0, { type: 'bet', amount: 2 }, { random: fixedRandom });
  assert.equal(game.turn, 1);
  game = actMus(game, 1, { type: 'raise', amount: 4 }, { random: fixedRandom });
  assert.equal(game.turn, 0);
  game = actMus(game, 0, { type: 'see' }, { random: fixedRandom });
  assert.equal(game.lanceResults[0].outcome, 'accepted');
  assert.equal(game.lanceResults[0].amount, 4);
  assert.equal(game.lanceName, 'chica');
});

test('an accepted órdago awards the entire game immediately to the winner of the lance', () => {
  let game = createMusGame({ random: fixedRandom });
  game = actMus(game, 0, { type: 'no-mus' }, { random: fixedRandom });
  game = actMus(game, 0, { type: 'ordago' }, { random: fixedRandom });
  game = actMus(game, game.turn, { type: 'see' }, { random: fixedRandom });
  const result = game.handHistory.at(-1);
  assert.equal(game.phase, 'game-won');
  assert.equal(game.gamesWon[result.winningTeam], 1);
  assert.equal(result.results.at(-1).outcome, 'ordago-accepted');
});

test('a folded opening órdago scores one stone and continues the hand', () => {
  let game = createMusGame({ random: fixedRandom });
  game = actMus(game, 0, { type: 'no-mus' }, { random: fixedRandom });
  game = actMus(game, 0, { type: 'ordago' }, { random: fixedRandom });
  game = actMus(game, game.turn, { type: 'fold' }, { random: fixedRandom });
  assert.equal(game.phase, 'betting');
  assert.equal(game.lanceName, 'chica');
  assert.equal(game.scores[0], 0);
  assert.equal(game.lanceResults[0].outcome, 'folded');
  assert.equal(game.lanceResults[0].foldBonus, 1);
  assert.equal(game.gamesWon[0], 0);
});

test('a complete bot-assisted hand reaches showdown and can start the next hand', () => {
  let game = createMusGame({ random: fixedRandom });
  game = actMus(game, 0, { type: 'no-mus' }, { random: fixedRandom });
  for (let count = 0; game.phase !== 'showdown' && game.phase !== 'game-won' && game.phase !== 'finished' && count < 80; count += 1) {
    if (game.turn === 0) game = actMus(game, 0, game.betAmount ? { type: 'see' } : { type: 'pass' }, { random: fixedRandom });
    else game = advanceMusBots(game, { random: fixedRandom }).state;
  }
  assert.ok(['showdown', 'game-won', 'finished'].includes(game.phase), `Stopped in ${game.phase}/${game.lanceName}/${game.turn}`);
  assert.equal(game.handHistory.length, 1);
  if (game.phase !== 'finished') {
    const next = actMus(game, 0, { type: 'next-hand' }, { random: fixedRandom });
    assert.equal(next.phase, 'mus');
    assert.equal(next.mano, (game.mano + 1) % 4);
  }
});

test('local bots choose valid discards and do not expose partner hands in their action', () => {
  let game = createMusGame({ random: fixedRandom });
  for (let seat = 0; seat < 4; seat += 1) game = actMus(game, seat, { type: 'mus' }, { random: fixedRandom });
  game = actMus(game, 0, { type: 'discard', cardIds: [] }, { random: fixedRandom });
  const action = chooseMusBotAction(game, 1);
  assert.equal(action.type, 'discard');
  assert.ok(action.cardIds.length < 4, 'the strategy should not invent a pair by padding its hand with repeated pretend aces');
  assert.ok(action.cardIds.every((id) => game.hands[1].some((card) => card.id === id)));
  assert.equal(Object.hasOwn(action, 'partnerHand'), false);
});
