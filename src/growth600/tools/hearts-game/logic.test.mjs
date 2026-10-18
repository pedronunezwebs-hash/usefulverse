import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseComputerCard, createDeck, createHeartsGame, legalCards, passCards, playCard, playComputerTurns, startHeartsHand } from './logic.mjs';

const card = (id) => createDeck().find((item) => item.id === id);

test('a deck has 52 unique cards and a new deal distributes each card once', () => {
  const deck = createDeck();
  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map(({ id }) => id)).size, 52);
  const game = createHeartsGame({ random: () => 0.37 });
  assert.deepEqual(game.hands.map((hand) => hand.length), [13, 13, 13, 13]);
  assert.equal(new Set(game.hands.flat().map(({ id }) => id)).size, 52);
});

test('passing sends three cards in the correct direction and rejects malformed selections', () => {
  const hands = Array.from({ length: 4 }, (_, player) => createDeck().slice(player * 13, player * 13 + 13));
  const selected = hands.map((hand) => hand.slice(0, 3).map(({ id }) => id));
  const result = passCards(hands, 'left', selected);
  assert.equal(result[1].filter(({ id }) => selected[0].includes(id)).length, 3);
  assert.equal(result.every((hand) => hand.length === 13), true);
  assert.throws(() => passCards(hands, 'left', [[], [], [], []]), /exactly three/u);
  assert.throws(() => passCards(hands, 'sideways', selected), /Unknown pass direction/u);
});

test('starting a hand requires exactly three owned cards unless this is a hold round', () => {
  const game = createHeartsGame({ random: () => 0.63, passDirection: 'left' });
  assert.equal(game.phase, 'passing');
  assert.equal(startHeartsHand(game, ['not-a-card']), null);
  const started = startHeartsHand(game, game.hands[0].slice(0, 3).map(({ id }) => id));
  assert.equal(started.phase, 'playing');
  assert.deepEqual(started.hands.map((hand) => hand.length), [13, 13, 13, 13]);
  assert.equal(new Set(started.hands.flat().map(({ id }) => id)).size, 52);
});

test('the opening lead must be the two of clubs; follow suit and first-trick discards are enforced', () => {
  const game = {
    phase: 'playing', over: false, currentPlayer: 0, heartsBroken: false, scores: [0, 0, 0, 0],
    hands: [[card('clubs-2'), card('spades-12'), card('hearts-14')], [card('clubs-3')], [card('clubs-4')], [card('clubs-5')]],
    tricks: [],
  };
  assert.deepEqual(legalCards(game).map(({ id }) => id), ['clubs-2']);
  let state = playCard(game, 'clubs-2');
  assert.deepEqual(legalCards(state).map(({ id }) => id), ['clubs-3']);
  state = playCard(state, 'clubs-3');
  state = playCard(state, 'clubs-4');
  state = playCard(state, 'clubs-5');
  assert.equal(state.tricks[0].points, 0);
  state = { ...game, currentPlayer: 0, hands: [[card('hearts-14'), card('spades-12'), card('diamonds-2')], [card('clubs-3')], [card('clubs-4')], [card('clubs-5')]], tricks: [{ plays: [{ player: 1, card: card('clubs-3') }], winner: null, points: 0 }] };
  assert.deepEqual(legalCards(state).map(({ id }) => id), ['diamonds-2']);
});

test('each heart is one point and the queen of spades is thirteen', () => {
  const game = {
    phase: 'playing', over: false, currentPlayer: 0, heartsBroken: true, scores: [0, 0, 0, 0],
    hands: [[card('spades-14')], [card('spades-13')], [card('spades-12')], [card('hearts-14')]],
    tricks: [],
  };
  let state = game;
  for (const id of ['spades-14', 'spades-13', 'spades-12', 'hearts-14']) state = playCard(state, id);
  assert.equal(state.tricks[0].winner, 0);
  assert.equal(state.tricks[0].points, 14);
  assert.equal(state.scores[0], 14);
  assert.equal(state.over, true);
});

test('shooting the moon gives the shooter zero and each opponent 26 for the hand', () => {
  const game = {
    phase: 'playing', over: false, currentPlayer: 0, heartsBroken: true, scores: [25, 0, 0, 0],
    hands: [[card('hearts-2')], [card('clubs-3')], [card('clubs-4')], [card('clubs-5')]],
    tricks: Array.from({ length: 12 }, () => ({ plays: [1, 2, 3, 4].map((rank) => ({ player: 0, card: card(`clubs-${rank + 2}`) })), winner: 0, points: 0 })),
  };
  let state = game;
  for (const id of ['hearts-2', 'clubs-3', 'clubs-4', 'clubs-5']) state = playCard(state, id);
  assert.equal(state.over, true);
  assert.deepEqual(state.scores, [0, 26, 26, 26]);
});

test('holding does not change hands and invalid random sources fail clearly', () => {
  const game = createHeartsGame({ random: () => 0.5, passDirection: 'hold' });
  assert.equal(game.phase, 'playing');
  assert.throws(() => createHeartsGame({ random: () => 1 }), /Random source/u);
});

test('complete hands preserve all 13 tricks and account for all 26 penalty points', () => {
  for (let seed = 1; seed <= 32; seed += 1) {
    let state = seed;
    const random = () => ((state = (state * 48_271) % 2_147_483_647) - 1) / 2_147_483_646;
    const direction = ['left', 'right', 'across', 'hold'][seed % 4];
    let game = createHeartsGame({ random, passDirection: direction });
    if (direction !== 'hold') game = startHeartsHand(game, game.hands[0].slice(0, 3).map(({ id }) => id));
    let guard = 0;
    while (!game.over && guard < 60) {
      guard += 1;
      if (game.currentPlayer !== 0) game = playComputerTurns(game);
      else {
        const card = chooseComputerCard(game, 0);
        assert.ok(card && legalCards(game, 0).some(({ id }) => id === card.id), `seed ${seed}: human seat has a legal move`);
        game = playComputerTurns(playCard(game, card.id));
      }
    }
    assert.equal(game.over, true, `seed ${seed}: hand ends`);
    assert.equal(game.tricks.length, 13, `seed ${seed}: every trick is retained`);
    const totalPoints = game.scores.reduce((sum, score) => sum + score, 0);
    assert.ok(totalPoints === 26 || totalPoints === 78, `seed ${seed}: hand points or moon-shot scores are accounted for`);
  }
});
