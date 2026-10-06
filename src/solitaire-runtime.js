import { cloneSolitaireGame, drawSolitaireStock, isSolitaireWon, moveFoundationCardToTableau, moveTableauCardToFoundation, moveTableauRun, moveWasteCardToFoundation, moveWasteCardToTableau, newSolitaireGame } from './solitaire-logic.mjs';

const SUIT_GLYPHS = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
const SUIT_NAMES = { clubs: 'Clubs', diamonds: 'Diamonds', hearts: 'Hearts', spades: 'Spades' };
const RANK_NAMES = { 1: 'Ace', 11: 'Jack', 12: 'Queen', 13: 'King' };

function randomSolitaireValue() {
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] / 0x1_0000_0000;
  }
  return Math.random();
}

export function setupSolitaire(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll('{' + name + '}', String(value)), messages[key] ?? key);
  const stockButton = root.querySelector('[data-solitaire-stock]');
  const wasteElement = root.querySelector('[data-solitaire-waste]');
  const foundationElement = root.querySelector('[data-solitaire-foundations]');
  const tableauElement = root.querySelector('[data-solitaire-tableau]');
  const drawSelect = root.querySelector('[data-solitaire-draw-count]');
  const statusElement = root.querySelector('#op-status');
  let game = newSolitaireGame(randomSolitaireValue);
  let selected = null;
  let history = [];
  const remember = (snapshot) => {
    history.push(snapshot);
    if (history.length > 100) history = history.slice(-100);
  };

  const status = (key, values = {}, type = '') => {
    statusElement.textContent = say(key, values);
    statusElement.className = 'tool-status' + (type ? ' is-' + type : '');
  };
  const cardName = (card) => say('Card {rank} of {suit}', { rank: say(RANK_NAMES[card.rank] ?? String(card.rank)), suit: say(SUIT_NAMES[card.suit]) });
  const cardButton = (card, source, index, selectedCard = false) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'local-solitaire__card' + (card.red ? ' is-red' : '') + (card.faceUp ? '' : ' is-face-down') + (selectedCard ? ' is-selected' : '');
    button.dataset.solitaireSource = source; button.dataset.solitaireIndex = String(index); button.dataset.solitaireCardId = card.id;
    button.setAttribute('aria-pressed', String(selectedCard));
    if (card.faceUp) {
      button.setAttribute('aria-label', cardName(card));
      button.textContent = (RANK_NAMES[card.rank] ? (card.rank === 1 ? 'A' : RANK_NAMES[card.rank][0]) : String(card.rank)) + SUIT_GLYPHS[card.suit];
    } else { button.setAttribute('aria-label', say('Face-down card')); button.textContent = '▧'; }
    return button;
  };
  const isSelectedCard = (source, column, index) => selected && selected.type === source && (source !== 'tableau' || (selected.column === column && index >= selected.index));
  const render = () => {
    stockButton.replaceChildren();
    stockButton.disabled = !game.stock.length && !game.waste.length;
    stockButton.setAttribute('aria-label', say('Stock pile'));
    stockButton.textContent = game.stock.length ? '▧' : game.waste.length ? '↶' : '—';
    stockButton.classList.remove('is-selected');
    wasteElement.replaceChildren();
    wasteElement.setAttribute('aria-label', say('Waste pile'));
    const wasteTop = game.waste.at(-1);
    if (wasteTop) wasteElement.append(cardButton(wasteTop, 'waste', game.waste.length - 1, isSelectedCard('waste')));
    else { const empty = document.createElement('span'); empty.className = 'local-solitaire__empty'; empty.textContent = '·'; empty.setAttribute('aria-hidden', 'true'); wasteElement.append(empty); }
    foundationElement.replaceChildren();
    for (const suit of ['clubs', 'diamonds', 'hearts', 'spades']) {
      const pile = game.foundations[suit]; const button = document.createElement('button');
      button.type = 'button'; button.className = 'local-solitaire__pile' + (pile.length ? '' : ' is-empty'); button.dataset.solitaireFoundation = suit;
      button.setAttribute('aria-label', say('Foundation for {suit}', { suit: say(SUIT_NAMES[suit]) }));
      if (pile.length) {
        const top = pile.at(-1);
        const selectedFoundation = isSelectedCard('foundation:' + suit);
        button.classList.toggle('is-selected', Boolean(selectedFoundation));
        button.setAttribute('aria-pressed', String(Boolean(selectedFoundation)));
        button.setAttribute('aria-label', say('Foundation for {suit}: {card}', { suit: say(SUIT_NAMES[suit]), card: cardName(top) }));
        button.textContent = (RANK_NAMES[top.rank] ? (top.rank === 1 ? 'A' : RANK_NAMES[top.rank][0]) : String(top.rank)) + SUIT_GLYPHS[top.suit];
        if (top.red) button.classList.add('is-red');
      }
      else { const mark = document.createElement('span'); mark.textContent = SUIT_GLYPHS[suit]; mark.setAttribute('aria-hidden', 'true'); button.append(mark); }
      foundationElement.append(button);
    }
    tableauElement.replaceChildren();
    for (let column = 0; column < game.tableau.length; column += 1) {
      const pile = document.createElement('div'); pile.className = 'local-solitaire__column'; pile.dataset.solitaireColumn = String(column); pile.setAttribute('aria-label', say('Tableau column {number}', { number: column + 1 }));
      if (!game.tableau[column].length) {
        const empty = document.createElement('button'); empty.type = 'button'; empty.className = 'local-solitaire__pile is-empty'; empty.dataset.solitaireEmptyColumn = String(column); empty.setAttribute('aria-label', say('Tableau column {number}', { number: column + 1 }) + ': ' + say('Empty pile')); empty.textContent = 'K'; pile.append(empty);
      } else {
        game.tableau[column].forEach((card, index) => { const button = cardButton(card, 'tableau', index, isSelectedCard('tableau', column, index)); button.dataset.solitaireColumn = String(column); pile.append(button); });
      }
      tableauElement.append(pile);
    }
  };
  const commit = (action) => {
    const before = cloneSolitaireGame(game);
    if (!action()) { status('That move is not allowed.', {}, 'error'); return false; }
    remember(before);
    selected = null; render();
    status(isSolitaireWon(game) ? 'You won!' : 'Select a card, then choose a legal pile.', {}, isSolitaireWon(game) ? 'success' : '');
    return true;
  };
  const tryTableauMove = (column) => {
    if (!selected) return false;
    if (selected.type === 'waste') return commit(() => moveWasteCardToTableau(game, column));
    if (selected.type === 'tableau') return commit(() => moveTableauRun(game, selected.column, selected.index, column));
    if (selected.type.startsWith('foundation:')) return commit(() => moveFoundationCardToTableau(game, selected.type.slice('foundation:'.length), column));
    return false;
  };
  root.addEventListener('change', (event) => {
    if (event.target.matches('[data-solitaire-draw-count]')) game.drawCount = Number(event.target.value) === 3 ? 3 : 1;
  });
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-solitaire-new]')) { game = newSolitaireGame(randomSolitaireValue); history = []; selected = null; render(); status('Game started.'); return; }
    if (event.target.closest('[data-solitaire-undo]')) {
      const previous = history.pop();
      if (!previous) return status('No move to undo.');
      game = previous; selected = null; render(); status('Select a card, then choose a legal pile.'); return;
    }
    if (event.target.closest('[data-solitaire-stock]')) {
      const before = cloneSolitaireGame(game); const result = drawSolitaireStock(game);
      if (result === 'empty') return status('No cards to draw.');
      remember(before); selected = null; render(); status(result === 'recycled' ? 'Waste returned to stock.' : 'Cards drawn.'); return;
    }
    const foundation = event.target.closest('[data-solitaire-foundation]');
    if (foundation) {
      const suit = foundation.dataset.solitaireFoundation;
      if (selected) {
        const selectedSuit = selected.type === 'waste' ? game.waste.at(-1)?.suit : selected.type === 'tableau' ? game.tableau[selected.column]?.[selected.index]?.suit : null;
        const moved = selectedSuit === suit && selected.type === 'waste' ? commit(() => moveWasteCardToFoundation(game)) : selectedSuit === suit && selected.type === 'tableau' && selected.index === game.tableau[selected.column].length - 1 ? commit(() => moveTableauCardToFoundation(game, selected.column)) : false;
        if (!moved && selected) status('That move is not allowed.', {}, 'error');
      } else if (game.foundations[suit].length) { selected = { type: 'foundation:' + suit }; render(); status('Select a card, then choose a legal pile.'); }
      return;
    }
    const card = event.target.closest('[data-solitaire-card-id]');
    if (card) {
      const source = card.dataset.solitaireSource;
      if (source === 'tableau') {
        const column = Number(card.dataset.solitaireColumn); const index = Number(card.dataset.solitaireIndex); const value = game.tableau[column][index];
        if (!value.faceUp) {
          if (index !== game.tableau[column].length - 1) return;
          return commit(() => { value.faceUp = true; return true; });
        }
        if (selected && (selected.type !== 'tableau' || selected.column !== column) && index === game.tableau[column].length - 1) return tryTableauMove(column);
        if (selected && selected.type === 'tableau' && selected.column === column && selected.index === index) selected = null;
        else selected = { type: 'tableau', column, index };
      } else if (source === 'waste') {
        if (selected && selected.type === 'waste') selected = null; else selected = { type: 'waste' };
      }
      if (selected) {
        const selectedCard = selected.type === 'tableau' ? game.tableau[selected.column][selected.index] : selected.type === 'waste' ? game.waste.at(-1) : game.foundations[selected.type.slice('foundation:'.length)].at(-1);
        status('Selected: {card}', { card: cardName(selectedCard) });
      } else status('Select a card, then choose a legal pile.');
      render(); return;
    }
    const emptyColumn = event.target.closest('[data-solitaire-empty-column]');
    if (emptyColumn && selected) return tryTableauMove(Number(emptyColumn.dataset.solitaireEmptyColumn));
    const column = event.target.closest('[data-solitaire-column]');
    if (column && selected) return tryTableauMove(Number(column.dataset.solitaireColumn));
  });
  drawSelect.value = '1';
  render();
}
