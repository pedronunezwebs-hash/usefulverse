import { createTripeaksGame, drawTripeaksCard, getTripeaksState, removeTripeaksCard, undoTripeaksMove } from './logic.mjs';
import { readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="tripeaks-solitaire"]');
if (root) {
  const copy = readToolCopy(root); const board = root.querySelector('[data-tableau]'); let game = createTripeaksGame(); let hintedId = '';
  const suitSymbol = (suit) => suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : suit === 'clubs' ? '♣' : '♠';
  function cardLabel(card) { return card.rank + ' ' + suitSymbol(card.suit); }
  function setStatus(text) { root.querySelector('[data-status]').textContent = text; }
  function render() {
    const state = getTripeaksState(game); const fragment = document.createDocumentFragment();
    for (const card of state.tableau) {
      if (card.removed) { const empty = document.createElement('span'); empty.className = 'tripeaks__slot is-cleared'; empty.setAttribute('aria-hidden', 'true'); empty.dataset.row = String(card.row); empty.dataset.column = String(card.column); fragment.append(empty); continue; }
      const button = document.createElement('button'); button.type = 'button'; button.className = 'tripeaks__card' + (card.exposed ? ' is-exposed' : ' is-covered') + (hintedId === card.id ? ' is-hinted' : ''); button.dataset.card = card.id; button.dataset.row = String(card.row); button.dataset.column = String(card.column); button.dataset.suit = card.suit; if (card.row === 3) button.style.gridColumnStart = String(card.column + 1); button.disabled = !card.exposed || state.status !== 'playing';
      button.setAttribute('aria-label', card.exposed ? cardLabel(card) + ', ' + copy.fields.exposed : copy.fields.covered); button.setAttribute('aria-pressed', String(hintedId === card.id)); button.textContent = card.exposed ? card.rank + ' ' + suitSymbol(card.suit) : '◆'; fragment.append(button);
    }
    board.replaceChildren(fragment);
    const top = state.waste.at(-1); root.querySelector('[data-waste]').replaceChildren();
    if (top) { const wasteCard = document.createElement('span'); wasteCard.className = 'tripeaks__card is-exposed'; wasteCard.dataset.suit = top.suit; wasteCard.setAttribute('aria-label', cardLabel(top)); wasteCard.textContent = top.rank + ' ' + suitSymbol(top.suit); root.querySelector('[data-waste]').append(wasteCard); }
    else root.querySelector('[data-waste]').textContent = copy.fields.emptyWaste;
    root.querySelector('[data-stock-count]').textContent = String(state.stockRemaining); root.querySelector('[data-moves]').textContent = String(state.moves); root.querySelector('[data-score]').textContent = String(state.score); root.querySelector('[data-cards-left]').textContent = String(state.tableau.filter((card) => !card.removed).length);
    root.querySelector('[data-action="draw"]').disabled = state.status !== 'playing' || state.stockRemaining === 0;
    root.querySelector('[data-action="undo"]').disabled = game.history.length === 0;
    root.querySelector('[data-action="hint"]').disabled = state.status !== 'playing';
  }
  function finishMessage() { return game.status === 'won' ? copy.messages.won : game.status === 'stuck' ? copy.messages.stuck : ''; }
  function newDeal() { game = createTripeaksGame(); hintedId = ''; render(); setStatus(copy.messages.ready); }
  board.addEventListener('click', (event) => {
    const button = event.target.closest('[data-card]'); if (!button || !board.contains(button)) return;
    const result = removeTripeaksCard(game, button.dataset.card); if (!result.ok) { setStatus(copy.messages.invalidMove); return; }
    hintedId = ''; render(); setStatus(finishMessage() || copy.messages.removed);
  });
  function drawCard() { const result = drawTripeaksCard(game); if (!result.ok) { setStatus(copy.messages.stockEmpty); return; } hintedId = ''; render(); setStatus(finishMessage() || (getTripeaksState(game).hints.length ? copy.messages.drawn : copy.messages.noMove)); }
  root.querySelector('[data-action="draw"]').addEventListener('click', drawCard);
  root.querySelector('[data-stock-draw]').addEventListener('click', drawCard);
  root.querySelector('[data-action="undo"]').addEventListener('click', () => { const result = undoTripeaksMove(game); if (result.ok) { hintedId = ''; render(); setStatus(copy.messages.undone); } });
    root.querySelector('[data-action="hint"]').addEventListener('click', () => { const state = getTripeaksState(game); hintedId = state.hints[0] ?? ''; render(); setStatus(hintedId ? copy.fields.hint : copy.messages.noHint); });
  root.querySelector('[data-action="new-game"]').addEventListener('click', newDeal);
  render(); setStatus(copy.messages.ready);
}
