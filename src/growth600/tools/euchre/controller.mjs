import {
  bidEuchre, chooseEuchreBid, chooseEuchreCard, chooseEuchreDiscard,
  createEuchreGame, discardEuchreCard, getEuchreCardSuit,
  getEuchreCardStrength, getLegalEuchreCards, playEuchreCard,
} from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="euchre"]');
if (root) {
  const copy = readToolCopy(root);
  const target = root.querySelector('[data-target]');
  const handList = root.querySelector('[data-hand]');
  const trickList = root.querySelector('[data-trick]');
  const bidPanel = root.querySelector('[data-bidding]');
  const bidTitle = root.querySelector('[data-bidding-title]');
  const trumpChoices = root.querySelector('[data-trump-choice]');
  const trumpSelect = root.querySelector('[data-trump-choice-select]');
  const orderButton = root.querySelector('[data-action="order-up"]');
  const nameButton = root.querySelector('[data-action="name-trump"]');
  const passButton = root.querySelector('[data-action="pass"]');
  const discardButton = root.querySelector('[data-action="discard"]');
  const result = root.querySelector('[data-result]');
  const resultText = root.querySelector('[data-result-content]');
  const suitLabels = { clubs: copy.fields.clubs, diamonds: copy.fields.diamonds, hearts: copy.fields.hearts, spades: copy.fields.spades };
  const suitSymbols = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
  const seatLabels = [copy.fields.playerSouth, copy.fields.seatWest, copy.fields.seatNorth, copy.fields.seatEast];
  let game = createEuchreGame({ target: Number(target.value) });
  let selectedDiscard = '';

  function msg(template, values = {}) {
    return template.replace(/\{([a-zA-Z]+)\}/gu, (_, key) => String(values[key] ?? ''));
  }

  function cardLabel(card) { return `${card.rank} ${suitLabels[card.suit]}`; }
  function cardText(card) { return `${card.rank}${suitSymbols[card.suit]}`; }

  function buildCardButton(card, { playable = false, discardable = false } = {}) {
    const item = document.createElement('li');
    item.className = `euchre-card euchre-card--${card.suit}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button--secondary euchre-card__button';
    button.dataset.cardId = card.id;
    button.textContent = cardText(card);
    button.setAttribute('aria-label', `${playable ? copy.actions.play : copy.actions.discard}: ${cardLabel(card)}`);
    button.disabled = !playable && !discardable;
    button.setAttribute('aria-pressed', String(discardable && selectedDiscard === card.id));
    if (discardable && selectedDiscard === card.id) button.classList.add('is-selected');
    item.append(button);
    return item;
  }

  function updateBiddingControls() {
    const canBid = game.phase === 'bidding' && game.currentPlayer === 0;
    bidPanel.hidden = game.phase !== 'bidding';
    if (!canBid) return;
    bidTitle.textContent = copy.fields[`round${game.bidRound === 1 ? 'One' : 'Two'}`];
    const firstRound = game.bidRound === 1;
    orderButton.hidden = !firstRound;
    nameButton.hidden = firstRound;
    passButton.hidden = false;
    trumpChoices.hidden = firstRound;
    [...trumpSelect.options].forEach((option) => {
      option.disabled = option.value === game.upcard.suit;
      option.hidden = option.disabled;
    });
    if (trumpSelect.selectedOptions[0]?.disabled) trumpSelect.value = [...trumpSelect.options].find((option) => !option.disabled)?.value ?? 'clubs';
  }

  function render() {
    for (const team of [0, 1]) root.querySelector(`[data-score="${team}"]`).textContent = String(game.scores[team]);
    root.querySelector('[data-dealer]').textContent = seatLabels[game.dealer];
    root.querySelector('[data-upcard]').textContent = cardLabel(game.upcard);
    root.querySelector('[data-trump]').textContent = game.trump ? suitLabels[game.trump] : copy.messages.noTrump;
    root.querySelector('[data-tricks]').textContent = `${game.tricks[0]}–${game.tricks[1]}`;
    trickList.replaceChildren();
    for (const play of game.trick) {
      const item = document.createElement('li');
      item.className = `euchre-trick__play euchre-card--${play.card.suit}`;
      item.textContent = `${seatLabels[play.player]}: ${cardLabel(play.card)}`;
      trickList.append(item);
    }
    handList.replaceChildren();
    const playable = game.phase === 'play' && game.currentPlayer === 0
      ? getLegalEuchreCards(game.hands[0], game.trick.length ? getEuchreCardSuit(game.trick[0].card, game.trump) : null, game.trump)
      : [];
    const playableIds = new Set(playable.map(({ id }) => id));
    const canDiscard = game.phase === 'discard' && game.maker === 0;
    const hand = game.hands[0].slice().sort((a, b) => getEuchreCardStrength(b, game.trump ?? game.upcard.suit) - getEuchreCardStrength(a, game.trump ?? game.upcard.suit));
    for (const card of hand) handList.append(buildCardButton(card, { playable: playableIds.has(card.id), discardable: canDiscard }));
    discardButton.hidden = !canDiscard;
    discardButton.disabled = !selectedDiscard || !hand.some(({ id }) => id === selectedDiscard);
    updateBiddingControls();
    result.hidden = game.phase !== 'over';
    if (game.phase === 'over') {
      const team = game.winner === 0 ? copy.messages.southTeam : copy.messages.northTeam;
      resultText.textContent = msg(copy.messages.teamWins, { team, score: game.scores[game.winner] });
      announce(root, resultText.textContent, 'success');
    }
  }

  function statusText() {
    if (game.phase === 'over') return '';
    if (game.phase === 'bidding' && game.currentPlayer === 0) return msg(copy.messages.bidding, { round: game.bidRound, player: copy.fields.playerSouth });
    if (game.phase === 'discard' && game.maker === 0) return copy.messages.chooseDiscard;
    if (game.phase === 'play' && game.currentPlayer === 0) return copy.messages.chooseCard;
    const who = seatLabels[game.currentPlayer];
    if (game.phase === 'bidding') return msg(copy.messages.bidding, { round: game.bidRound, player: who });
    return msg(copy.messages.botTurn, { player: who });
  }

  function runBots() {
    let steps = 0;
    while (game.phase !== 'over' && game.currentPlayer !== 0 && steps < 40) {
      steps += 1;
      if (game.phase === 'bidding') game = bidEuchre(game, chooseEuchreBid(game));
      else if (game.phase === 'discard') game = discardEuchreCard(game, chooseEuchreDiscard(game));
      else if (game.phase === 'play') game = playEuchreCard(game, chooseEuchreCard(game));
      else break;
      if (!game) break;
    }
    render();
    announce(root, statusText(), 'info');
  }

  function actBid(action) {
    const next = bidEuchre(game, action);
    if (!next) return announce(root, copy.messages.invalidAction, 'error');
    game = next;
    selectedDiscard = '';
    render();
    runBots();
  }

  handList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-card-id]');
    if (!button || !handList.contains(button)) return;
    if (game.phase === 'discard' && game.maker === 0) {
      selectedDiscard = button.dataset.cardId;
      render();
      return;
    }
    if (game.phase !== 'play' || game.currentPlayer !== 0) return;
    const next = playEuchreCard(game, button.dataset.cardId);
    if (!next) return announce(root, copy.messages.invalidAction, 'error');
    game = next;
    selectedDiscard = '';
    render();
    runBots();
  });
  orderButton.addEventListener('click', () => actBid({ type: 'order-up' }));
  nameButton.addEventListener('click', () => actBid({ type: 'name-trump', suit: trumpSelect.value }));
  passButton.addEventListener('click', () => actBid({ type: 'pass' }));
  discardButton.addEventListener('click', () => {
    const next = discardEuchreCard(game, selectedDiscard);
    if (!next) return announce(root, copy.messages.invalidAction, 'error');
    game = next;
    selectedDiscard = '';
    render();
    runBots();
  });
  root.querySelector('[data-action="new-game"]').addEventListener('click', () => {
    game = createEuchreGame({ target: Number(target.value) });
    selectedDiscard = '';
    render();
    runBots();
  });
  target.addEventListener('change', () => {
    if (!Number.isInteger(Number(target.value)) || Number(target.value) < 5 || Number(target.value) > 10) target.value = '10';
  });
  render();
  runBots();
}
