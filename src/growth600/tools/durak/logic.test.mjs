import test from 'node:test';
import assert from 'node:assert/strict';
import { createDurakGame, playDurakComputerTurn, playDurakAttack, defendDurakAttack } from './logic.mjs';

test('Durak deals a complete unique deck and picks the lower trump as initial attacker', () => {
  const game = createDurakGame();
  const cards = [...game.humanHand, ...game.computerHand, ...game.deck, game.trumpCard];
  assert.equal(cards.length, 36);
  assert.equal(new Set(cards.map(({ id }) => id)).size, 36);
  assert.equal(game.humanHand.length, 6);
  assert.equal(game.computerHand.length, 6);
  const humanTrump = game.humanHand.filter(({ suit }) => suit === game.trump).sort((a, b) => a.value - b.value)[0];
  const computerTrump = game.computerHand.filter(({ suit }) => suit === game.trump).sort((a, b) => a.value - b.value)[0];
  if (humanTrump && computerTrump) assert.equal(game.attacker, humanTrump.value < computerTrump.value ? 'human' : 'computer');
});

test('Durak rejects an illegal defense and the computer acts only on its own turn', () => {
  const game = createDurakGame();
  assert.throws(() => defendDurakAttack(game, 'missing-card'));
  if (game.attacker === 'human') assert.throws(() => playDurakComputerTurn(game));
  else {
    const next = playDurakComputerTurn(game);
    assert.equal(next.phase, 'defend');
    assert.equal(next.attacker, 'computer');
  }
  assert.throws(() => playDurakAttack(game, 'missing-card'));
});
