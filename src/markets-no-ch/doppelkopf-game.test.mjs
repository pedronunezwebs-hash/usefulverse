import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DOKO_CARD_POINTS, DOKO_TRUMP_ORDER, announceDoppelkopf, canAnnounceDoppelkopf,
  chooseDoppelkopfCpuCard, createDoppelkopfDeck, createDoppelkopfGame,
  doppelkopfCardCount, legalDoppelkopfCards, playDoppelkopfCard,
  playDoppelkopfCpuTurn, scoreDoppelkopfGame, winningDoppelkopfPlay,
} from './doppelkopf-game.mjs';

const card = (suit, rank, copy = 0) => ({ id: suit * 12 + rank * 2 + copy, suit, rank, copy });
const seedWithoutWedding = () => {
  for (let seed = 1; seed < 200; seed += 1) {
    const game = createDoppelkopfGame({ seed, leader: 0 });
    if (!game.wedding) return seed;
  }
  throw new Error('No normal deal found in deterministic seed range.');
};
const seedWithWedding = () => {
  for (let seed = 1; seed < 200; seed += 1) {
    const game = createDoppelkopfGame({ seed, leader: 0 });
    if (game.wedding) return seed;
  }
  throw new Error('No wedding deal found in deterministic seed range.');
};

test('the double deck has 48 unique physical cards, 24 paired faces and 240 eyes', () => {
  const deck = createDoppelkopfDeck(123);
  assert.equal(deck.length, 48);
  assert.equal(new Set(deck.map(({ id }) => id)).size, 48);
  assert.equal(new Set(deck.map(({ suit, rank }) => `${suit}:${rank}`)).size, 24);
  assert.equal(DOKO_CARD_POINTS.reduce((sum, points) => sum + points, 0) * 8, 240);
});

test('a deal gives each of four seats 12 cards and records exact card ownership', () => {
  const game = createDoppelkopfGame({ seed: 9, leader: 2 });
  assert.deepEqual(game.hands.map((hand) => hand.length), [12, 12, 12, 12]);
  assert.equal(doppelkopfCardCount(game), 48);
  assert.equal(game.owners.length, 48);
  assert.equal(game.owners.filter((owner) => Number.isInteger(owner)).length, 48);
  assert.equal(game.teams.filter((side) => side === 're').length, 2);
  assert.equal(game.teams.filter((side) => side === 'kontra').length, 2);
});

test('normal trump order and duplicate-card ties follow the first played card', () => {
  assert.deepEqual(DOKO_TRUMP_ORDER.slice(0, 5), ['0:4', '2:2', '3:2', '0:2', '1:2']);
  const tenBeatsQueen = winningDoppelkopfPlay([
    { seat: 1, card: card(2, 2) },
    { seat: 2, card: card(0, 4) },
  ]);
  assert.equal(tenBeatsQueen.seat, 2);
  const duplicate = winningDoppelkopfPlay([
    { seat: 3, card: card(3, 0, 0) },
    { seat: 0, card: card(3, 0, 1) },
  ]);
  assert.equal(duplicate.seat, 3);
});

test('players must follow a non-trump suit or trump when it was led', () => {
  const clubNine = card(2, 0);
  const hand = [card(2, 5), card(1, 0), card(3, 4)];
  assert.deepEqual(legalDoppelkopfCards(hand, [{ seat: 0, card: clubNine }]).map(({ id }) => id), [card(2, 5).id]);
  const trumpHand = [card(0, 4), card(2, 2), card(3, 5)];
  assert.deepEqual(legalDoppelkopfCards(trumpHand, [{ seat: 0, card: card(0, 4) }]).map(({ id }) => id), [card(0, 4).id, card(2, 2).id]);
  const invalid = createDoppelkopfGame({ seed: seedWithoutWedding(), leader: 0 });
  invalid.trick = [{ seat: 3, card: clubNine }];
  invalid.toMove = 0;
  const offSuit = invalid.hands[0].find((item) => item.suit !== 2 || item.rank === 2 || item.rank === 1);
  if (offSuit && invalid.hands[0].some((item) => item.suit === 2 && item.rank !== 2 && item.rank !== 1)) {
    assert.throws(() => playDoppelkopfCard(invalid, 0, offSuit.id), /follow/u);
  }
});

test('only one Re and one Kontra announcement are accepted in the opening window', () => {
  const game = createDoppelkopfGame({ seed: seedWithoutWedding(), leader: 0 });
  const reSeat = game.teams.findIndex((side) => side === 're');
  game.toMove = reSeat;
  assert.equal(canAnnounceDoppelkopf(game, reSeat), true);
  announceDoppelkopf(game, reSeat);
  assert.equal(game.announcements.re, true);
  assert.equal(canAnnounceDoppelkopf(game, reSeat), false);
  game.toMove = (reSeat + 1) % 4;
  while (game.teams[game.toMove] === 're') game.toMove = (game.toMove + 1) % 4;
  const kontraSeat = game.toMove;
  assert.equal(canAnnounceDoppelkopf(game, kontraSeat), true);
  announceDoppelkopf(game, kontraSeat);
  assert.equal(game.announcements.kontra, true);
  assert.equal(game.announcementEvents.length, 2);
});

test('a wedding resolves to the first outside trick winner in the first three tricks', () => {
  const game = createDoppelkopfGame({ seed: seedWithWedding(), leader: 0 });
  const weddingSeat = game.wedding.seat;
  const partner = (weddingSeat + 1) % 4;
  const order = [partner, (partner + 1) % 4, (partner + 2) % 4, weddingSeat];
  game.tricks = [
    { plays: [], winner: weddingSeat, eyes: 0 },
    { plays: [], winner: weddingSeat, eyes: 0 },
  ];
  game.trick = [
    { seat: order[0], card: card(0, 4) },
    { seat: order[1], card: card(2, 2) },
    { seat: order[2], card: card(3, 2) },
  ];
  game.hands[weddingSeat] = [card(0, 2)];
  game.toMove = weddingSeat;
  playDoppelkopfCard(game, weddingSeat, card(0, 2).id);
  assert.equal(game.wedding.status, 'partnerFound');
  assert.equal(game.wedding.partner, partner);
  assert.equal(game.teams[weddingSeat], 're');
  assert.equal(game.teams[partner], 're');
  assert.equal(game.teams.filter((side) => side === 'kontra').length, 2);
});

test('a wedding that wins the first three tricks becomes a one-player diamond solo', () => {
  const game = createDoppelkopfGame({ seed: seedWithWedding(), leader: 0 });
  const weddingSeat = game.wedding.seat;
  const order = [1, 2, 3].map((offset) => (weddingSeat + offset) % 4);
  game.tricks = [
    { plays: [], winner: weddingSeat, eyes: 0 },
    { plays: [], winner: weddingSeat, eyes: 0 },
  ];
  game.trick = [
    { seat: order[0], card: card(2, 0) },
    { seat: order[1], card: card(2, 0, 1) },
    { seat: order[2], card: card(1, 0) },
  ];
  game.hands[weddingSeat] = [card(0, 4)];
  game.toMove = weddingSeat;
  playDoppelkopfCard(game, weddingSeat, card(0, 4).id);
  assert.equal(game.wedding.status, 'diamondSolo');
  assert.deepEqual(game.teams, game.teams.map((_, seat) => seat === weddingSeat ? 're' : 'kontra'));
});

test('the Kontra call changes the 120-eye boundary and settlement remains zero-sum', () => {
  const seed = seedWithoutWedding();
  const reWins = createDoppelkopfGame({ seed });
  reWins.teams = ['re', 're', 'kontra', 'kontra'];
  reWins.pointsWon = { re: 120, kontra: 120 };
  reWins.tricksWon = { re: 6, kontra: 6 };
  reWins.announcements = { re: false, kontra: true };
  assert.equal(scoreDoppelkopfGame(reWins).winner, 're');
  assert.equal(reWins.roundScore.reduce((sum, value) => sum + value, 0), 0);

  const plain = createDoppelkopfGame({ seed });
  plain.teams = ['re', 're', 'kontra', 'kontra'];
  plain.pointsWon = { re: 120, kontra: 120 };
  plain.tricksWon = { re: 6, kontra: 6 };
  assert.equal(scoreDoppelkopfGame(plain).winner, 'kontra');
});

test('three local CPUs and the player can finish a full deal with all 240 eyes', () => {
  const game = createDoppelkopfGame({ seed: seedWithoutWedding(), leader: 2 });
  let actions = 0;
  while (game.status === 'playing' && actions < 48) {
    const seat = game.toMove;
    const id = chooseDoppelkopfCpuCard(game, seat);
    playDoppelkopfCard(game, seat, id);
    actions += 1;
  }
  assert.equal(actions, 48);
  assert.equal(game.status, 'complete');
  assert.equal(game.tricks.length, 12);
  assert.equal(game.pointsWon.re + game.pointsWon.kontra, 240);
  assert.equal(game.tricksWon.re + game.tricksWon.kontra, 12);
  assert.equal(game.scores.reduce((sum, score) => sum + score, 0), 0);
});

test('CPU turn may announce only once and plays a legal card', () => {
  const game = createDoppelkopfGame({ seed: seedWithoutWedding(), leader: 1 });
  game.toMove = 1;
  const before = game.hands[1].length;
  playDoppelkopfCpuTurn(game, 1);
  assert.equal(game.hands[1].length, before - 1);
  assert.equal(game.trick.length, 1);
});

