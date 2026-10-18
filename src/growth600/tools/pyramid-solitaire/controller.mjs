import { clonePyramidGame, createPyramidGame, drawPyramidCard, getPyramidMoves, getPyramidStatus, isPyramidCardExposed, recyclePyramidWaste, removePyramidMove } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="pyramid-solitaire"]');
if (root) {
  const copy = readToolCopy(root);
  const board = root.querySelector('[data-board]');
  const ruleSelect = root.querySelector('[data-recycle-rule]');
  const suitMarks = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
  let game = createPyramidGame();
  let initialDeal = clonePyramidGame(game);
  let history = [];
  let selected = [];
  let hinted = [];

  function rankName(rank) {
    if (rank === 1) return copy.fields.rankAce;
    if (rank === 11) return copy.fields.rankJack;
    if (rank === 12) return copy.fields.rankQueen;
    if (rank === 13) return copy.fields.rankKing;
    return String(rank);
  }
  function suitName(suit) { return copy.fields[`suit${suit[0].toUpperCase()}${suit.slice(1)}`]; }
  function cardDescription(card) { return `${rankName(card.rank)} ${suitName(card.suit)}`; }
  function currentRecycleLimit() { return ruleSelect.value === 'unlimited' ? Infinity : Number(ruleSelect.value); }
  function addHistory() { history.push(clonePyramidGame(game)); if (history.length > 250) history.shift(); }

  function render(focusId = null) {
    const fragment = document.createDocumentFragment();
    for (const card of game.pyramid) {
      const exposed = isPyramidCardExposed(game, card.id);
      const button = document.createElement('button');
      button.type = 'button'; button.className = `pyramid-card${card.suit === 'hearts' || card.suit === 'diamonds' ? ' is-red' : ''}${exposed ? '' : ' is-covered'}${selected.includes(card.id) ? ' is-selected' : ''}${hinted.includes(card.id) ? ' is-hint' : ''}`;
      button.dataset.cardId = card.id; button.disabled = !exposed;
      button.style.gridRow = String(card.row + 1); button.style.gridColumn = `${Math.floor((7 - (card.row + 1)) / 2) + card.column + 1}`;
      button.setAttribute('aria-pressed', String(selected.includes(card.id)));
      button.setAttribute('aria-label', `${cardDescription(card)}, ${exposed ? copy.fields.exposed : copy.fields.covered}`);
      const face = document.createElement('span'); face.textContent = `${rankName(card.rank)} ${suitMarks[card.suit]}`; button.append(face); fragment.append(button);
    }
    board.replaceChildren(fragment);
    root.querySelector('[data-stock-count]').textContent = String(game.stock.length);
    root.querySelector('[data-stock-remaining]').textContent = String(game.stock.length);
    root.querySelector('[data-waste-remaining]').textContent = String(game.waste.length);
    root.querySelector('[data-removed-count]').textContent = String(game.removed.length);
    root.querySelector('[data-pyramid-left]').textContent = String(game.pyramid.length);
    root.querySelector('[data-recycle-count]').textContent = String(game.recycleCount);
    const wasteButton = root.querySelector('[data-pyramid-waste]');
    const wasteTop = game.waste.at(-1);
    const wasteFace = root.querySelector('[data-waste-card]');
    wasteFace.textContent = wasteTop ? `${rankName(wasteTop.rank)} ${suitMarks[wasteTop.suit]}` : copy.fields.emptyPile;
    wasteButton.disabled = !wasteTop;
    wasteButton.setAttribute('aria-label', wasteTop ? `${copy.fields.waste}: ${cardDescription(wasteTop)}` : `${copy.fields.waste}: ${copy.fields.emptyPile}`);
    const canRecycle = !game.stock.length && game.waste.length && (game.recycleLimit === Infinity || game.recycleCount < game.recycleLimit);
    root.querySelector('[data-action="recycle"]').disabled = !canRecycle;
    const drawButton = root.querySelector('[data-action="draw"]');
    drawButton.disabled = !game.stock.length;
    drawButton.setAttribute('aria-label', `${copy.actions.draw}; ${copy.fields.stockStatus}: ${game.stock.length}; ${copy.fields.cardFaceDown}`);
    root.querySelector('[data-action="undo"]').disabled = !history.length;
    if (focusId) board.querySelector(`[data-card-id="${CSS.escape(focusId)}"]`)?.focus();
  }

  function commit(next, focusId = null) {
    if (!next) return false;
    addHistory(); game = next; selected = []; hinted = []; render(focusId);
    const status = getPyramidStatus(game);
    if (status === 'won') announce(root, copy.messages.won, 'success');
    else if (status === 'no-moves') announce(root, copy.messages.noMoves, 'info');
    return true;
  }

  function remove(cards, focusId = null) {
    const next = removePyramidMove(game, cards);
    if (!next) { announce(root, copy.messages.invalidPair, 'info'); return; }
    const count = next.pyramid.length;
    if (commit(next, focusId) && getPyramidStatus(game) === 'playing') announce(root, copy.messages.removed.replace('{count}', String(count)), 'success');
  }

  function clickPyramidCard(cardId) {
    const card = game.pyramid.find((item) => item.id === cardId);
    if (!card || !isPyramidCardExposed(game, cardId)) return;
    if (card.rank === 13) { remove([cardId], cardId); return; }
    if (!selected.length) { selected = [cardId]; hinted = []; render(cardId); announce(root, copy.messages.selected, 'info'); return; }
    if (selected[0] === cardId) { selected = []; render(cardId); return; }
    remove([selected[0], cardId], cardId);
  }

  board.addEventListener('click', (event) => {
    const button = event.target.closest('[data-card-id]');
    if (button && board.contains(button)) clickPyramidCard(button.dataset.cardId);
  });
  root.querySelector('[data-pyramid-waste]').addEventListener('click', () => {
    const top = game.waste.at(-1);
    if (!top) return;
    if (top.rank === 13) { remove([top.id]); return; }
    if (!selected.length) { announce(root, copy.messages.chooseFirst, 'info'); return; }
    remove([selected[0], top.id]);
  });
  root.querySelector('[data-action="draw"]').addEventListener('click', () => {
    const next = drawPyramidCard(game);
    if (!next) { announce(root, copy.messages.stockEmpty, 'info'); return; }
    if (commit(next)) announce(root, copy.messages.drawn, 'success');
  });
  root.querySelector('[data-action="recycle"]').addEventListener('click', () => {
    const next = recyclePyramidWaste(game);
    if (!next) { announce(root, copy.messages.recycleUnavailable, 'info'); return; }
    if (commit(next)) announce(root, copy.messages.recycled, 'success');
  });
  root.querySelector('[data-action="new-game"]').addEventListener('click', () => {
    game = createPyramidGame({ recycleLimit: currentRecycleLimit() }); initialDeal = clonePyramidGame(game); history = []; selected = []; hinted = []; render(); announce(root, '');
  });
  root.querySelector('[data-action="restart"]').addEventListener('click', () => {
    game = clonePyramidGame(initialDeal); history = []; selected = []; hinted = []; render(); announce(root, '');
  });
  root.querySelector('[data-action="undo"]').addEventListener('click', () => {
    if (!history.length) return;
    game = history.pop(); selected = []; hinted = []; render(); announce(root, copy.messages.undone, 'success');
  });
  root.querySelector('[data-action="hint"]').addEventListener('click', () => {
    const move = getPyramidMoves(game)[0];
    if (move) {
      hinted = [...move.cards]; selected = [];
      const label = move.kind === 'king' ? copy.messages.hintKing : copy.messages.hintPair;
      render(move.cards[0]); announce(root, label, 'info'); return;
    }
    hinted = []; selected = []; render();
    if (game.stock.length) announce(root, copy.messages.hintDraw, 'info');
    else if (game.waste.length && (game.recycleLimit === Infinity || game.recycleCount < game.recycleLimit)) announce(root, copy.messages.hintRecycle, 'info');
    else announce(root, copy.messages.hintNone, 'info');
  });
  ruleSelect.addEventListener('change', () => announce(root, copy.fields.ruleAppliesNext, 'info'));
  render();
}
