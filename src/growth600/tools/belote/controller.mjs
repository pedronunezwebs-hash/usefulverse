import { BELOTE_SUITS, chooseBeloteBotCard, createBeloteGame, legalBeloteCards, playBeloteCard } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="belote"]');
if (root) {
  const copy = readToolCopy(root);
  const trumpSelect = root.querySelector('[data-trump]');
  const startButton = root.querySelector('[data-action="start-game"]');
  const newButton = root.querySelector('[data-action="new-game"]');
  const scoreList = root.querySelector('[data-scores]');
  const opponentList = root.querySelector('[data-opponents]');
  const trickList = root.querySelector('[data-trick]');
  const handList = root.querySelector('[data-hand]');
  let game = null;

  const playerName = (player) => [copy.messages.you, copy.messages.opponentOne, copy.messages.partner, copy.messages.opponentTwo][player];
  const rankName = (rank) => ({ 11: copy.fields.jack, 12: copy.fields.queen, 13: copy.fields.king, 14: copy.fields.ace })[rank] ?? String(rank);
  const suitName = (suit) => copy.fields[suit];
  const suitSymbol = (suit) => ({ clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' })[suit];
  const cardLabel = (card) => `${rankName(card.rank)} ${suitName(card.suit)}`;
  const addListText = (list, text, className = '') => {
    const item = document.createElement('li');
    if (className) item.className = className;
    item.textContent = text;
    list.append(item);
  };

  const render = () => {
    scoreList.replaceChildren();
    opponentList.replaceChildren();
    trickList.replaceChildren();
    handList.replaceChildren();
    if (!game) {
      startButton.hidden = false;
      newButton.hidden = true;
      return;
    }
    startButton.hidden = true;
    newButton.hidden = false;
    addListText(scoreList, `${copy.fields.teamYou}: ${game.teamPoints[0]}`);
    addListText(scoreList, `${copy.fields.teamOpponents}: ${game.teamPoints[1]}`);
    for (const player of [1, 2, 3]) addListText(opponentList, `${playerName(player)}: ${game.hands[player].length} ${copy.fields.cardsLeft}`);
    for (const play of game.trick) addListText(trickList, `${playerName(play.player)} — ${cardLabel(play.card)}`, play.player === game.currentPlayer ? 'belote-trick-card belote-trick-card--active' : 'belote-trick-card');
    const legalIds = new Set(legalBeloteCards(game, 0).map(({ id }) => id));
    const orderedHand = [...game.hands[0]].sort((a, b) => BELOTE_SUITS.indexOf(a.suit) - BELOTE_SUITS.indexOf(b.suit) || a.rank - b.rank);
    for (const card of orderedHand) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `button button--secondary belote-card${card.suit === 'hearts' || card.suit === 'diamonds' ? ' belote-card--red' : ''}`;
      button.dataset.cardId = card.id;
      button.textContent = `${rankName(card.rank)} ${suitSymbol(card.suit)}`;
      button.setAttribute('aria-label', cardLabel(card));
      button.disabled = game.phase !== 'playing' || game.currentPlayer !== 0 || !legalIds.has(card.id);
      item.append(button);
      handList.append(item);
    }
    if (game.phase === 'complete') {
      announce(root, game.winnerTeam === 0 ? copy.messages.contractMade : copy.messages.contractFailed, 'success');
    } else {
      announce(root, game.currentPlayer === 0 ? copy.messages.yourTurn : copy.messages.botsTurn, 'info');
    }
  };

  const runBots = () => {
    let guard = 0;
    while (game?.phase === 'playing' && game.currentPlayer !== 0 && guard < 32) {
      guard += 1;
      const card = chooseBeloteBotCard(game);
      if (!card) break;
      game = playBeloteCard(game, game.currentPlayer, card.id);
    }
  };

  const deal = () => {
    try {
      game = createBeloteGame({ trump: trumpSelect.value });
      render();
    } catch {
      announce(root, copy.messages.chooseTrump, 'error');
    }
  };

  startButton.addEventListener('click', deal);
  newButton.addEventListener('click', deal);
  handList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-card-id]');
    if (!button || game?.phase !== 'playing' || game.currentPlayer !== 0) return;
    try {
      game = playBeloteCard(game, 0, button.dataset.cardId);
      runBots();
      render();
    } catch {
      announce(root, copy.messages.invalidMove, 'error');
    }
  });
  render();
}
