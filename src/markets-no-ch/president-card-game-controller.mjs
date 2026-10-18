import {
  choosePresidentCpuAction, createPresidentGame, PRESIDENT_DEFAULT_RULES, presidentInventory,
  presidentIsLegalPlay, presidentPass, presidentPlay, presidentRankLabel, presidentReturnExchange,
  presidentRole,
} from './president-game.mjs';

const root = document.querySelector('[data-market-tool="presidentCardGame"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const q = (selector) => root.querySelector(selector);
  const storageKey = 'usefulverse.president-card-game.v1';
  const suits = ['♠', '♥', '♦', '♣'];
  let game = null; let selected = new Set(); let statusText = copy.ready ?? '';
  let storageAvailable = true; let cpuTimer = 0;
  const text = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)), copy[key] ?? key);
  const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const playerName = (id) => id === 0 ? copy.you ?? 'You' : text('opponent', { number: id });
  const cardLabel = (card) => `${copy[`rank${card.rank}`] ?? presidentRankLabel(card.rank)} ${copy[`suit${card.suit}`] ?? ''}`;
  const activeExchange = () => game?.exchangeQueue?.[game.exchangeIndex];
  const humanExchange = () => game?.status === 'exchange' && activeExchange()?.to <= 1;
  const validSave = (saved) => {
    if (!saved || !Array.isArray(saved.players) || saved.players.length < 3 || saved.players.length > 8
      || !saved.players.every((player, id) => player?.id === id && Array.isArray(player.hand) && Number.isInteger(player.score) && player.score >= 0)
      || !['playing', 'exchange', 'complete'].includes(saved.status)
      || saved.status === 'playing' && (!Number.isInteger(saved.currentPlayer) || !saved.players[saved.currentPlayer]?.hand.length)
      || !Array.isArray(saved.trick) || !Array.isArray(saved.discard) || !Array.isArray(saved.placements) || !Array.isArray(saved.lastPlacements)
      || !Array.isArray(saved.exchangeQueue) || !Number.isInteger(saved.exchangeIndex) || !Number.isInteger(saved.round)
      || !Number.isInteger(saved.targetScore) || !Number.isInteger(saved.deckCount) || !Number.isInteger(saved.seed)) return false;
    if (saved.rules !== undefined && (!saved.rules || !['three-clubs', 'player-one'].includes(saved.rules.opening)
      || typeof saved.rules.allowReentry !== 'boolean' || typeof saved.rules.exchangeCards !== 'boolean')) return false;
    const cards = [...saved.players.flatMap(({ hand }) => hand), ...saved.trick, ...saved.discard];
    return cards.length === saved.deckCount * 52 && new Set(cards.map(({ id }) => id)).size === cards.length
      && cards.every((card) => card && Number.isInteger(card.deck) && Number.isInteger(card.suit) && card.suit >= 0 && card.suit < 4 && Number.isInteger(card.rank) && card.rank >= 2 && card.rank <= 14 && card.id === `${card.deck}-${card.suit}-${card.rank}`);
  };
  const hasSave = () => { try { return Boolean(localStorage.getItem(storageKey)); } catch { storageAvailable = false; return false; } };
  function persist() {
    try { if (game) localStorage.setItem(storageKey, JSON.stringify(game)); }
    catch { storageAvailable = false; }
    q('[data-president-save-note]').textContent = storageAvailable ? (game ? copy.saveNote : '') : copy.saveUnavailable;
  }
  function cardButton(card, index, isSelected, canSelect, hidden = false) {
    const label = hidden ? text('hiddenCard', { number: index + 1 }) : cardLabel(card);
    return `<button type="button" class="crazy-card${!hidden && (card.suit === 1 || card.suit === 2) ? ' is-red' : ''}${isSelected ? ' is-selected' : ''}" data-president-card="${escapeHtml(card.id)}" aria-label="${escapeHtml(label)}" aria-pressed="${isSelected}" ${canSelect ? '' : 'disabled'}><span>${hidden ? '◆' : escapeHtml(copy[`rank${card.rank}`] ?? presidentRankLabel(card.rank))}</span><span aria-hidden="true">${hidden ? '●' : suits[card.suit]}</span></button>`;
  }
  function render() {
    q('[data-president-status]').textContent = statusText || copy.ready;
    q('[data-president-match]').hidden = !game;
    q('[data-president-resume]').hidden = Boolean(game) || !hasSave();
    q('[data-president-delete]').disabled = !game && !hasSave();
    q('[data-president-export]').disabled = !game;
    const opening = q('[data-president-opening]');
    const reentry = q('[data-president-reentry]');
    const exchanges = q('[data-president-exchange-rules]');
    for (const control of [opening, reentry, exchanges]) control.disabled = Boolean(game);
    if (game) {
      const rules = { ...PRESIDENT_DEFAULT_RULES, ...(game.rules ?? {}) };
      opening.value = rules.opening;
      reentry.value = String(rules.allowReentry);
      exchanges.value = String(rules.exchangeCards);
    }
    if (!game) return;
    const exchange = activeExchange();
    const isExchanging = game.status === 'exchange';
    const humanTurn = game.status === 'playing' && game.currentPlayer === 0;
    q('[data-president-scoreboard]').innerHTML = game.players.map((player) => {
      const role = presidentRole(game, player.id);
      const roleLabel = role === 'neutral' ? copy.player : copy[role] ?? copy.player;
      return `<p>${escapeHtml(playerName(player.id))} · ${escapeHtml(roleLabel)} · ${escapeHtml(copy.score)}: <strong>${player.score}</strong> · ${escapeHtml(copy.cards)}: ${player.id === 0 ? player.hand.length : player.hand.length}</p>`;
    }).join('');
    const humanSelectsReturn = humanExchange() && exchange.to === game.exchangeQueue[game.exchangeIndex].to;
    const canChoose = humanTurn || humanSelectsReturn;
    q('[data-president-hand]').innerHTML = game.players[0].hand.map((card, index) => cardButton(card, index, selected.has(card.id), canChoose)).join('');
    const chosen = [...selected].map((id) => game.players[0].hand.find((card) => card.id === id)).filter(Boolean);
    q('[data-president-selected]').textContent = chosen.length ? `${copy.selected}: ${chosen.map(cardLabel).join(', ')}` : '';
    q('[data-president-play]').disabled = !humanTurn || !presidentIsLegalPlay(game, 0, [...selected]);
    q('[data-president-pass]').disabled = !humanTurn || !game.trick.length;
    q('[data-president-clear]').disabled = !selected.size;
    q('[data-president-exchange]').hidden = !humanSelectsReturn;
    if (humanSelectsReturn) {
      const count = exchange.count;
      q('[data-president-exchange-help]').textContent = text('exchangePrompt', { player: playerName(exchange.to), count });
      q('[data-president-return]').disabled = selected.size !== count;
    }
    q('[data-president-trick]').innerHTML = game.trick.length ? game.trick.map((card) => `<span class="crazy-card${card.suit === 1 || card.suit === 2 ? ' is-red' : ''}" aria-label="${escapeHtml(cardLabel(card))}">${escapeHtml(copy[`rank${card.rank}`] ?? presidentRankLabel(card.rank))}<span aria-hidden="true">${suits[card.suit]}</span></span>`).join('') : `<p>${escapeHtml(copy.noTrick)}</p>`;
    q('[data-president-turn]').textContent = game.status === 'complete' ? playerName(game.winner) : humanSelectsReturn ? playerName(exchange.to) : game.status === 'exchange' ? playerName(exchange?.to) : playerName(game.currentPlayer);
    q('[data-president-round]').textContent = String(game.round);
    q('[data-president-others]').textContent = isExchanging ? text('exchangePrompt', { player: playerName(exchange?.to), count: exchange?.count ?? 0 }) : game.players.filter(({ hand }) => hand.length).map((player) => `${playerName(player.id)}: ${player.hand.length}`).join(' · ');
    const rules = { ...PRESIDENT_DEFAULT_RULES, ...(game.rules ?? {}) };
    q('[data-president-rules]').textContent = text('rulesSummary', {
      target: rules.targetScore ?? game.targetScore ?? 11,
      opening: rules.opening === 'three-clubs' ? copy.clubThree : copy.playerOne,
      reentry: rules.allowReentry ? copy.reentryYes : copy.reentryNo,
      exchange: rules.exchangeCards ? copy.exchangeOn : copy.exchangeOff,
    });
    persist();
    if (game.status === 'playing' && game.currentPlayer !== 0 || humanExchange() && exchange.to > 1) scheduleCpu();
  }
  function updateStatus() {
    if (game.status === 'complete') statusText = game.winner === 0 ? text('gameWon', { score: game.players[0].score }) : text('cpuWon', { player: playerName(game.winner), score: game.players[game.winner].score });
    else if (game.status === 'exchange' && humanExchange()) statusText = text('exchangePrompt', { player: playerName(activeExchange().to), count: activeExchange().count });
    else if (game.status === 'exchange') statusText = copy.exchangeGiven;
    else if (game.lastAction === 'trickCleared') statusText = text('trickCleared', { player: playerName(game.currentPlayer) });
    else if (game.lastAction === 'roundReady') statusText = copy.started;
    else statusText = game.currentPlayer === 0 ? copy.yourTurn : text('cpuTurn', { player: playerName(game.currentPlayer) });
  }
  function scheduleCpu() {
    clearTimeout(cpuTimer);
    cpuTimer = setTimeout(() => {
      if (!game) return;
      if (game.status === 'exchange') {
        const exchange = activeExchange();
        if (!exchange || exchange.to <= 1) return;
        const before = game.exchangeIndex;
        const cards = game.players[exchange.to].hand.slice(0, exchange.count).map(({ id }) => id);
        try { presidentReturnExchange(game, cards); statusText = game.exchangeIndex === before ? copy.exchangeReturned : copy.viceExchange; }
        catch { statusText = copy.illegal; }
      } else if (game.status === 'playing' && game.currentPlayer !== 0) {
        const player = game.currentPlayer;
        const action = choosePresidentCpuAction(game, player);
        try {
          if (action.type === 'play') presidentPlay(game, player, action.cardIds);
          else presidentPass(game, player);
          if (action.type === 'play') statusText = text('cpuPlayed', { player: playerName(player), cards: action.cardIds.map((id) => { const card = game.trick.find((entry) => entry.id === id) ?? game.discard.find((entry) => entry.id === id); return card ? cardLabel(card) : ''; }).filter(Boolean).join(', ') });
          else statusText = text('cpuPassed', { player: playerName(player) });
        } catch { statusText = copy.illegal; }
        updateStatus();
      }
      selected.clear(); render();
    }, 420);
  }
  q('[data-president-new]').addEventListener('click', () => {
    clearTimeout(cpuTimer); selected.clear();
    game = createPresidentGame({
      players: Number(q('[data-president-players]').value),
      targetScore: Number(q('[data-president-target]').value),
      rules: {
        opening: q('[data-president-opening]').value,
        allowReentry: q('[data-president-reentry]').value === 'true',
        exchangeCards: q('[data-president-exchange-rules]').value === 'true',
      },
    });
    statusText = game.rules.opening === 'player-one' ? copy.startedPlayerOne : game.currentPlayer === 0 ? copy.started : text('cpuTurn', { player: playerName(game.currentPlayer) }); render();
  });
  q('[data-president-hand]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-president-card]'); if (!button || button.disabled || !game) return;
    const id = button.dataset.presidentCard;
    if (selected.has(id)) selected.delete(id); else selected.add(id);
    render();
  });
  q('[data-president-play]').addEventListener('click', () => {
    try { presidentPlay(game, 0, [...selected]); selected.clear(); statusText = text('played', { cards: game.lastPlay?.cards.map(cardLabel).join(', ') ?? '' }); updateStatus(); render(); }
    catch { statusText = copy.illegal; render(); }
  });
  q('[data-president-pass]').addEventListener('click', () => {
    try { presidentPass(game, 0); selected.clear(); statusText = copy.passed; updateStatus(); render(); }
    catch { statusText = copy.illegal; render(); }
  });
  q('[data-president-clear]').addEventListener('click', () => { selected.clear(); render(); });
  q('[data-president-return]').addEventListener('click', () => {
    try { presidentReturnExchange(game, [...selected]); selected.clear(); statusText = copy.exchangeReturned; updateStatus(); render(); }
    catch { statusText = copy.illegal; render(); }
  });
  q('[data-president-resume]').addEventListener('click', () => {
    try { const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null'); if (!validSave(saved)) throw new Error('invalid'); saved.rules ??= { ...PRESIDENT_DEFAULT_RULES }; game = saved; selected.clear(); statusText = copy.resumed; render(); }
    catch { statusText = hasSave() ? copy.saveDamaged : (storageAvailable ? copy.noSave : copy.saveUnavailable); render(); }
  });
  q('[data-president-delete]').addEventListener('click', () => {
    clearTimeout(cpuTimer); try { localStorage.removeItem(storageKey); } catch { storageAvailable = false; }
    game = null; selected.clear(); statusText = copy.deleted; render();
  });
  q('[data-president-export]').addEventListener('click', () => {
    if (!game) return;
    const rows = [[copy.round, copy.score], ...game.players.map((player) => [playerName(player.id), player.score, presidentRole(game, player.id)]), ...game.lastPlacements.map((player, index) => [index + 1, playerName(player)])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'president-card-game-results.csv'; link.click(); URL.revokeObjectURL(url);
  });
  render();
}
