import test from 'node:test';
import assert from 'node:assert/strict';
import {
  baccaratCardValue,
  baccaratTotal,
  createBaccaratShoe,
  dealBaccaratHand,
  scoreBaccaratPrediction,
  settleBaccaratPractice,
  shouldBankerDraw,
} from './logic.mjs';

test('card values and point counts follow Punto Banco rules', () => {
  assert.equal(baccaratCardValue('A'), 1);
  for (const rank of ['10', 'J', 'Q', 'K']) assert.equal(baccaratCardValue(rank), 0);
  for (let value = 2; value <= 9; value++) assert.equal(baccaratCardValue(String(value)), value);
  assert.equal(baccaratTotal([{ rank: 'K' }, { rank: '9' }, { rank: '7' }]), 6);
  assert.throws(() => baccaratCardValue('joker'), RangeError);
});

test('shoe contains eight standard decks and deals without replacement within a hand', () => {
  const shoe = createBaccaratShoe(() => 0.5);
  assert.equal(shoe.length, 416);
  const counts = new Map();
  for (const { rank, suit } of shoe) counts.set(`${rank}${suit}`, (counts.get(`${rank}${suit}`) ?? 0) + 1);
  assert.equal(counts.size, 52);
  assert.ok([...counts.values()].every((count) => count === 8));
  const hand = dealBaccaratHand({ random: () => 0.5 });
  const dealt = [...hand.player, ...hand.banker];
  assert.ok(dealt.length <= hand.cardsDealt);
  assert.ok(hand.cardsDealt >= 4 && hand.cardsDealt <= 6);
  assert.equal(hand.playerTotal, baccaratTotal(hand.player));
  assert.equal(hand.bankerTotal, baccaratTotal(hand.banker));
  assert.equal(hand.winner, hand.playerTotal > hand.bankerTotal ? 'player' : hand.bankerTotal > hand.playerTotal ? 'banker' : 'tie');
});

test('Banker tableau handles every total and Player third-card value', () => {
  for (let banker = 0; banker <= 9; banker++) {
    for (let third = 0; third <= 9; third++) {
      const expected = banker <= 2
        || (banker === 3 && third !== 8)
        || (banker === 4 && third >= 2 && third <= 7)
        || (banker === 5 && third >= 4 && third <= 7)
        || (banker === 6 && (third === 6 || third === 7));
      assert.equal(shouldBankerDraw(banker, true, third), expected, `banker ${banker}, player third ${third}`);
    }
    assert.equal(shouldBankerDraw(banker, false), banker <= 5);
  }
  assert.throws(() => shouldBankerDraw(10, false), RangeError);
  assert.throws(() => shouldBankerDraw(4, true), RangeError);
});

test('prediction scoring has no payout odds and ties push Player or Banker picks', () => {
  assert.equal(scoreBaccaratPrediction('player', 'player'), true);
  assert.equal(scoreBaccaratPrediction('player', 'banker'), false);
  assert.deepEqual(settleBaccaratPractice(100, 10, 'player', 'tie'), { balance: 100, change: 0, correct: false, pushed: true });
  assert.deepEqual(settleBaccaratPractice(100, 10, 'tie', 'tie'), { balance: 110, change: 10, correct: true, pushed: false });
  assert.deepEqual(settleBaccaratPractice(100, 10, 'banker', 'player'), { balance: 90, change: -10, correct: false, pushed: false });
  assert.throws(() => settleBaccaratPractice(5, 6, 'player', 'banker'), RangeError);
  assert.throws(() => scoreBaccaratPrediction('house', 'player'), RangeError);
});
