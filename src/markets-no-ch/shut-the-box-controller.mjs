import { advanceShutBoxRound, advanceShutBoxTurn, applyShutBoxSelection, createShutBoxGame, legalShutBoxCombinations, playComputerShutBoxTurn, rollShutBoxDice, SHUT_BOX_TILES, toggleShutBoxTile } from './shut-the-box.mjs';

const root = document.querySelector('[data-market-tool="shutBox"]');
if (root) {
  const f = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const storeKey = 'usefulverse.shut-the-box.v1';
  let game = null;
  let storageAvailable = true;
  let timer = null;
  const template = (text, values) => Object.entries(values).reduce((output, [key, value]) => output.replaceAll(`{${key}}`, String(value)), text ?? '');
  const seed = () => { const words = new Uint32Array(1); globalThis.crypto?.getRandomValues?.(words); return words[0] || Math.floor(Math.random() * 0xffffffff); };
  const load = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(storeKey) || 'null');
      if (raw?.players?.length && Number.isInteger(raw.round) && Array.isArray(raw.players[0]?.open)) return raw;
    } catch { storageAvailable = false; }
    return null;
  };
  const persist = () => { try { localStorage.setItem(storeKey, JSON.stringify(game)); storageAvailable = true; } catch { storageAvailable = false; } };
  const status = (message) => { $('[data-box-status]').textContent = message; };
  const scoreTotal = (player) => player.scores.reduce((sum, score) => sum + score, 0);
  const tileButtons = (player, active) => SHUT_BOX_TILES.map((tile) => {
    const open = player.open.includes(tile); const selected = active && game.selected.includes(tile);
    const state = !open ? f.closed : selected ? f.selected : f.open;
    return `<button type="button" class="box-tile${open ? '' : ' is-closed'}${selected ? ' is-selected' : ''}" data-box-tile="${tile}" aria-pressed="${selected}" aria-label="${template(f.tileLabel, { number: tile, state })}"${!open || !active ? ' disabled' : ''}>${tile}</button>`;
  }).join('');
  const draw = () => {
    const match = $('[data-box-match]'); match.hidden = !game;
    $('[data-box-roll]').disabled = !game || game.stage !== 'rolling' || game.players[game.activePlayer]?.kind !== 'human';
    $('[data-box-close]').disabled = !game || game.stage !== 'selecting' || game.selected.length === 0;
    $('[data-box-clear]').disabled = !game || game.stage !== 'selecting' || !game.selected.length;
    $('[data-box-next]').hidden = !game || game.stage !== 'round-complete' || game.round >= game.rounds;
    $('[data-box-new]').textContent = game ? f.newGame : f.newGame;
    $('[data-box-resume]').hidden = !load();
    if (!game) { status(f.ready); return; }
    const current = game.players[game.activePlayer];
    $('[data-box-round]').textContent = `${game.round}/${game.rounds}`;
    $('[data-box-turn]').textContent = current.kind === 'human' ? (game.mode === 'computer' && game.activePlayer === 0 ? f.you : f.you) : f.computerName;
    $('[data-box-dice]').textContent = game.dice.length ? game.dice.join(' + ') : '—';
    $('[data-box-your-score]').textContent = String(scoreTotal(game.players[0]));
    $('[data-box-computer-score]').textContent = game.players[1] ? String(scoreTotal(game.players[1])) : '—';
    $('[data-box-computer-score-row]').hidden = !game.players[1];
    $('[data-box-computer-board]').hidden = !game.players[1];
    $('[data-box-your-open]').innerHTML = tileButtons(game.players[0], game.activePlayer === 0 && ['rolling', 'selecting'].includes(game.stage));
    if (game.players[1]) $('[data-box-computer-open]').innerHTML = tileButtons(game.players[1], game.activePlayer === 1 && ['rolling', 'selecting'].includes(game.stage));
    const total = game.dice.reduce((sum, face) => sum + face, 0);
    const humanTotal = scoreTotal(game.players[0]); const computerTotal = game.players[1] ? scoreTotal(game.players[1]) : null;
    const statusText = game.stage === 'round-complete' && game.winner === 0 ? f.youClosedBox
      : game.stage === 'round-complete' && game.winner === 1 ? f.computerClosedBox
      : game.stage === 'round-complete' && game.round === game.rounds && game.players[1] && humanTotal === computerTotal ? template(f.tie, { score: humanTotal })
      : game.stage === 'round-complete' && game.round === game.rounds && game.players[1] ? template(f.matchComplete, { winner: humanTotal < computerTotal ? f.you : f.computerName, score: Math.min(humanTotal, computerTotal) })
      : game.stage === 'round-complete' && game.round === game.rounds ? template(f.roundComplete, { round: game.round, player: f.you, score: game.turnScore ?? 0 })
      : game.stage === 'rolling' && current.kind === 'human' ? f.yourTurn
      : game.stage === 'selecting' ? template(f.chooseTiles, { total })
        : game.stage === 'round-complete' ? template(f.roundComplete, { round: game.round, player: f.you, score: game.turnScore ?? 0 })
          : game.stage === 'turn-complete' ? template(f.turnEnded, { player: current.kind === 'human' ? f.you : f.computerName, score: game.turnScore ?? 0 })
            : f.ready;
    status(statusText);
    $('[data-box-save-note]').textContent = storageAvailable ? f.saved : f.saveUnavailable;
    $('[data-box-rules-note]').textContent = $('[data-box-dice-rule]').selectedOptions[0]?.textContent ?? '';
  };
  const advance = () => {
    if (!game || game.stage !== 'turn-complete') return;
    game = advanceShutBoxTurn(game);
    if (game.stage === 'rolling' && game.players[game.activePlayer].kind === 'computer') {
      status(f.computerTurn); persist(); draw();
      timer = window.setTimeout(() => { game = playComputerShutBoxTurn(game); if (game.stage === 'turn-complete') game = advanceShutBoxTurn(game); persist(); draw(); }, 350);
      return;
    }
    persist(); draw();
  };
  $('[data-box-new]').addEventListener('click', () => {
    window.clearTimeout(timer);
    game = createShutBoxGame({ mode: $('[data-box-mode]').value, diceRule: $('[data-box-dice-rule]').value, rounds: Number($('[data-box-rounds]').value), seed: seed() }); persist(); draw();
  });
  $('[data-box-roll]').addEventListener('click', () => { if (!game || game.stage !== 'rolling') return; game = rollShutBoxDice(game); if (game.stage === 'turn-complete') advance(); else { persist(); draw(); } });
  root.addEventListener('click', (event) => {
    const tile = event.target.closest('[data-box-tile]');
    if (tile && game?.stage === 'selecting') { game = toggleShutBoxTile(game, Number(tile.dataset.boxTile)); draw(); }
  });
  $('[data-box-close]').addEventListener('click', () => {
    if (!game || game.stage !== 'selecting') return;
    try { game = applyShutBoxSelection(game); if (game.stage === 'round-complete') status(game.winner === 0 ? f.youClosedBox : f.computerClosedBox); else if (game.stage === 'rolling') status(f.validMove); persist(); draw(); }
    catch (error) { status(error?.message?.includes('equal the dice') ? template(f.wrongSum, { total: game.dice.reduce((sum, face) => sum + face, 0) }) : f.selectTile); }
  });
  $('[data-box-clear]').addEventListener('click', () => { for (const tile of [...game.selected]) game = toggleShutBoxTile(game, tile); draw(); });
  $('[data-box-next]').addEventListener('click', () => { if (game?.stage === 'round-complete') { game = advanceShutBoxRound(game); persist(); draw(); } });
  $('[data-box-resume]').addEventListener('click', () => { const saved = load(); if (saved) { game = saved; draw(); } else status(f.noSavedGame); });
  $('[data-box-delete]').addEventListener('click', () => { if (!window.confirm(f.confirmDelete)) return; window.clearTimeout(timer); try { localStorage.removeItem(storeKey); storageAvailable = true; } catch { storageAvailable = false; } game = null; draw(); });
  window.addEventListener('beforeunload', () => window.clearTimeout(timer), { once: true });
  if (load()) status(f.noSavedGame);
  draw();
}
