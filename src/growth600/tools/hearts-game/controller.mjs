import { chooseComputerCard, createHeartsGame, legalCards, playCard, startHeartsHand } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="hearts-game"]');
if (root) {
  const copy = readToolCopy(root);
  const direction = root.querySelector('[data-pass-direction]');
  const hand = root.querySelector('[data-hand]');
  const scoreList = root.querySelector('[data-scores]');
  const trickList = root.querySelector('[data-trick]');
  const passButton = root.querySelector('[data-action="pass-cards"]');
  let game;
  let selected = new Set();

  function playerName(player) { return player === 0 ? copy.messages.you : `${copy.messages.computer} ${player}`; }
  function rankName(rank) { return ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' })[rank] ?? String(rank); }
  function cardName(card) { return `${rankName(card.rank)} ${copy.fields[card.suit]}`; }

  function render() {
    scoreList.replaceChildren();
    game.scores.forEach((score, player) => {
      const row = document.createElement('li');
      row.textContent = `${playerName(player)}: ${score}`;
      scoreList.append(row);
    });
    trickList.replaceChildren();
    const trick = game.tricks.at(-1);
    for (const play of trick?.plays ?? []) {
      const row = document.createElement('li');
      row.textContent = `${playerName(play.player)} — ${cardName(play.card)}`;
      trickList.append(row);
    }
    hand.replaceChildren();
    const passing = game.phase === 'passing';
    const humanTurn = game.currentPlayer === 0 && !game.over;
    for (const card of game.hands[0]) {
      const row = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button button--secondary hearts-card';
      button.dataset.cardId = card.id;
      button.textContent = cardName(card);
      button.setAttribute('aria-label', cardName(card));
      if (passing) {
        button.setAttribute('aria-pressed', String(selected.has(card.id)));
        button.classList.toggle('is-selected', selected.has(card.id));
      } else {
        button.disabled = !humanTurn || !legalCards(game, 0).some(({ id }) => id === card.id);
      }
      row.append(button);
      hand.append(row);
    }
    passButton.hidden = !passing;
    passButton.disabled = !passing || (direction.value !== 'hold' && selected.size !== 3);
    passButton.textContent = direction.value === 'hold' ? copy.actions.hold : copy.actions.passCards;
    const status = passing
      ? direction.value === 'hold' ? copy.messages.holdReady : copy.messages.selectThree.replace('{count}', String(selected.size))
      : game.over ? copy.messages.roundComplete : humanTurn ? copy.messages.yourTurn : copy.messages.computerTurn;
    announce(root, status, game.over ? 'success' : 'info');
  }

  function runBots() {
    let guard = 0;
    while (!game.over && game.currentPlayer !== 0 && guard < 4) {
      guard += 1;
      const card = chooseComputerCard(game);
      if (!card) break;
      game = playCard(game, card.id);
    }
    if (game.over) announce(root, copy.messages.roundComplete, 'success');
  }

  function newGame() {
    game = createHeartsGame({ passDirection: direction.value });
    selected = new Set();
    render();
  }

  hand.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-card-id]');
    if (!button || !hand.contains(button)) return;
    const { cardId } = button.dataset;
    if (game.phase === 'passing') {
      if (selected.has(cardId)) selected.delete(cardId);
      else if (selected.size < 3 && direction.value !== 'hold') selected.add(cardId);
      render();
      return;
    }
    if (game.currentPlayer !== 0 || !legalCards(game, 0).some(({ id }) => id === cardId)) return;
    const next = playCard(game, cardId);
    if (!next) return;
    game = next;
    runBots();
    render();
  });

  passButton.addEventListener('click', () => {
    if (direction.value !== 'hold' && selected.size !== 3) return;
    const next = startHeartsHand(game, [...selected]);
    if (!next) {
      announce(root, copy.messages.invalidPass, 'error');
      return;
    }
    game = next;
    selected = new Set();
    runBots();
    render();
  });
  direction.addEventListener('change', newGame);
  root.querySelector('[data-action="new-game"]')?.addEventListener('click', newGame);
  newGame();
}
