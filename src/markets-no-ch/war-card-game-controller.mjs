import { createWarGame, warContinue, warFlip } from './war-game.mjs';

const root = document.querySelector('[data-market-tool="warCardGame"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse.war-card-game.v1';
  const suits = ['♠', '♥', '♦', '♣'];
  let game = null;
  let statusText = copy.ready ?? '';
  let storageAvailable = true;
  let autoTimer = null;
  let autoSeen = new Set();
  let autoActions = 0;
  const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const text = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)), copy[key] ?? key);
  const playerName = (id) => id === 0 ? copy.you ?? 'You' : text('opponent', { number: id });
  const validSave = (saved) => {
    if (!saved || !Array.isArray(saved.players) || saved.players.length < 2 || saved.players.length > 4
      || !saved.players.every((player, id) => player?.id === id && Array.isArray(player.pile) && Number.isInteger(player.battlesWon) && player.battlesWon >= 0)
      || !Array.isArray(saved.sidelined) || !Array.isArray(saved.table) || !Array.isArray(saved.warParticipants)
      || !['playing', 'war', 'complete', 'draw'].includes(saved.status) || !Number.isInteger(saved.seed)
      || !Number.isInteger(saved.turns) || saved.turns < 0 || !Number.isInteger(saved.wars) || saved.wars < 0
      || saved.status === 'complete' && (!Number.isInteger(saved.winner) || !saved.players[saved.winner])) return false;
    const cards = [...saved.players.flatMap(({ pile }) => pile), ...saved.table.map(({ card }) => card), ...saved.sidelined];
    return cards.length === 52 && new Set(cards.map(({ id }) => id)).size === 52
      && cards.every((card) => card && Number.isInteger(card.suit) && card.suit >= 0 && card.suit < 4
        && Number.isInteger(card.rank) && card.rank >= 2 && card.rank <= 14 && card.id === `${card.suit}-${card.rank}`)
      && saved.table.every((entry) => entry && Number.isInteger(entry.playerId) && saved.players[entry.playerId] && typeof entry.faceUp === 'boolean')
      && saved.warParticipants.every((id) => Number.isInteger(id) && saved.players[id]);
  };
  const hasSave = () => { try { return Boolean(localStorage.getItem(storageKey)); } catch { storageAvailable = false; return false; } };
  function persist() {
    try { if (game) localStorage.setItem(storageKey, JSON.stringify(game)); }
    catch { storageAvailable = false; }
    q('[data-war-save-note]').textContent = storageAvailable ? (game ? copy.saved : '') : copy.saveUnavailable;
  }
  function cardMarkup({ card, faceUp }) {
    if (!faceUp) return `<span class="crazy-card" aria-label="${escapeHtml(copy.faceDown)}"><span aria-hidden="true">◆</span><span aria-hidden="true">●</span></span>`;
    const rank = ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' })[card.rank] ?? String(card.rank);
    const label = `${rank} ${copy[`suit${card.suit}`] ?? ['Spades', 'Hearts', 'Diamonds', 'Clubs'][card.suit]}`;
    return `<span class="crazy-card${card.suit === 1 || card.suit === 2 ? ' is-red' : ''}" aria-label="${escapeHtml(label)}"><span>${rank}</span><span aria-hidden="true">${suits[card.suit]}</span></span>`;
  }
  function render() {
    q('[data-war-status]').textContent = statusText || copy.ready;
    q('[data-war-match]').hidden = !game;
    q('[data-war-resume]').hidden = Boolean(game) || !hasSave();
    q('[data-war-delete]').disabled = !game && !hasSave();
    q('[data-war-export]').disabled = !game;
    if (!game) return;
    const canFlip = game.status === 'playing';
    q('[data-war-flip]').disabled = !canFlip || autoTimer !== null;
    q('[data-war-continue]').hidden = game.status !== 'war';
    q('[data-war-continue]').disabled = game.status !== 'war' || autoTimer !== null;
    const autoButton = q('[data-war-auto]');
    autoButton.disabled = ['complete', 'draw'].includes(game.status);
    autoButton.textContent = autoTimer === null ? copy.autoPlay : copy.stopAutoPlay;
    autoButton.setAttribute('aria-pressed', String(autoTimer !== null));
    q('[data-war-scoreboard]').innerHTML = game.players.map((player) => `<p>${escapeHtml(playerName(player.id))} · ${escapeHtml(copy.cards)}: <strong>${player.pile.length}</strong>${player.eliminated ? ` · ${escapeHtml(copy.eliminated)}` : ''}</p>`).join('');
    q('[data-war-piles]').innerHTML = game.players.map((player) => `<p><strong>${escapeHtml(playerName(player.id))}</strong>: ${player.pile.length}</p>`).join('');
    q('[data-war-table]').innerHTML = game.table.length ? game.table.map((entry) => `<div class="war-reveal"><span>${escapeHtml(playerName(entry.playerId))}</span>${cardMarkup(entry)}</div>`).join('') : `<p>${escapeHtml(copy.noCards)}</p>`;
    q('[data-war-round]').textContent = String(game.turns);
    q('[data-war-wars]').textContent = String(game.wars);
    q('[data-war-summary]').textContent = copy.summary;
    persist();
  }
  function updateStatus() {
    if (game.status === 'complete') statusText = text('gameWon', { player: playerName(game.winner) });
    else if (game.status === 'draw') statusText = copy.draw;
    else if (game.status === 'war') statusText = copy.warStarted;
    else if (game.lastAction === 'battleWon') statusText = text('battleWon', { player: playerName(game.lastWinnerId), count: game.lastWonCount });
    else statusText = copy.started;
  }
  function clearAutoPlay() {
    if (autoTimer !== null) clearTimeout(autoTimer);
    autoTimer = null;
  }
  function gameSignature() {
    return JSON.stringify({ status: game.status, players: game.players.map(({ pile, eliminated }) => [pile.map(({ id }) => id), eliminated]), table: game.table.map(({ playerId, card, faceUp }) => [playerId, card.id, faceUp]), war: game.warParticipants });
  }
  function scheduleAutoPlay() {
    autoTimer = setTimeout(autoPlayStep, Number(q('[data-war-speed]').value));
    render();
  }
  function autoPlayStep() {
    autoTimer = null;
    if (!game || !['playing', 'war'].includes(game.status)) { render(); return; }
    const signature = gameSignature();
    if (autoSeen.has(signature)) { statusText = copy.autoCycleStopped; render(); return; }
    autoSeen.add(signature);
    try {
      if (game.status === 'playing') warFlip(game);
      else warContinue(game);
    } catch { statusText = copy.draw; render(); return; }
    autoActions += 1;
    updateStatus();
    if (['complete', 'draw'].includes(game.status)) { render(); return; }
    if (autoActions >= 500) { statusText = copy.autoLimitStopped; render(); return; }
    scheduleAutoPlay();
  }
  q('[data-war-new]').addEventListener('click', () => {
    clearAutoPlay(); autoSeen = new Set(); autoActions = 0;
    game = createWarGame({ players: Number(q('[data-war-players]').value) });
    statusText = copy.started;
    render();
  });
  q('[data-war-flip]').addEventListener('click', () => {
    try { warFlip(game); updateStatus(); render(); } catch { statusText = copy.draw; render(); }
  });
  q('[data-war-continue]').addEventListener('click', () => {
    try { warContinue(game); updateStatus(); render(); } catch { statusText = copy.draw; render(); }
  });
  q('[data-war-auto]').addEventListener('click', () => {
    if (autoTimer !== null) { clearAutoPlay(); statusText = copy.pauseAutoPlay; render(); return; }
    if (!game || !['playing', 'war'].includes(game.status)) return;
    autoSeen = new Set(); autoActions = 0; statusText = copy.started; scheduleAutoPlay();
  });
  q('[data-war-resume]').addEventListener('click', () => {
    try { const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null'); if (!validSave(saved)) throw new Error('invalid'); clearAutoPlay(); autoSeen = new Set(); autoActions = 0; game = saved; statusText = copy.resumed; render(); }
    catch { statusText = hasSave() ? copy.saveDamaged : (storageAvailable ? copy.noSave : copy.saveUnavailable); render(); }
  });
  q('[data-war-delete]').addEventListener('click', () => {
    clearAutoPlay(); autoSeen = new Set(); autoActions = 0;
    try { localStorage.removeItem(storageKey); } catch { storageAvailable = false; }
    game = null; statusText = copy.deleted; render();
  });
  q('[data-war-export]').addEventListener('click', () => {
    if (!game) return;
    const rows = [[copy.player, copy.cards], ...game.players.map((player) => [playerName(player.id), player.pile.length]), ['Status', game.status], [copy.round, game.turns], [copy.wars, game.wars]];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'war-card-game-results.csv'; link.click(); URL.revokeObjectURL(url);
  });
  render();
}

