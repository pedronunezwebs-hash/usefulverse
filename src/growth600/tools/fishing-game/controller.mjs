import { castFishingLine, createFishingGame, loseFishingCatch, reelFishingCatch, triggerFishingBite } from './logic.mjs';

const root = document.querySelector('[data-tool="fishing-game"]');
if (root) {
  const form = root.querySelector('[data-pending-form]'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  let game = createFishingGame(); let biteTimer = null; let escapeTimer = null;
  const clearTimers = () => { clearTimeout(biteTimer); clearTimeout(escapeTimer); biteTimer = null; escapeTimer = null; };
  const make = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = String(text); if (className) node.className = className; return node; };
  const cast = () => {
    clearTimers();
    try {
      game = castFishingLine(game); status.textContent = copy.messages.waiting; status.classList.remove('status--error'); render();
      biteTimer = setTimeout(() => {
        try { game = triggerFishingBite(game); status.textContent = copy.messages.bite; render();
          escapeTimer = setTimeout(() => { game = loseFishingCatch(game); status.textContent = copy.messages.escaped; render(); }, 2000);
        } catch { status.textContent = copy.messages.error; status.classList.add('status--error'); }
      }, game.biteDelayMs);
    } catch { status.textContent = copy.messages.error; status.classList.add('status--error'); }
  };
  const render = () => {
    content.replaceChildren();
    const score = make('p', `${copy.fields.casts}: ${game.casts} · ${copy.fields.catches}: ${game.catches} · ${copy.fields.escapes}: ${game.escapes}`, 'pending-fishing-score'); content.append(score);
    if (game.phase === 'waiting') content.append(make('p', copy.fields.waiting, 'hint'));
    if (game.phase === 'bite') content.append(make('p', copy.fields.bitePrompt, 'pending-fishing-bite'));
    if (game.phase === 'finished' && game.catchKind) content.append(make('h3', `${copy.fields.caught} ${copy.fields[game.catchKind]}`, 'pending-fishing-result'));
    if (game.phase === 'finished' && !game.catchKind) content.append(make('p', copy.fields.fishEscaped, 'pending-fishing-result'));
    const actions = make('div', undefined, 'pending-fishing-actions');
    const reel = make('button', copy.fields.reel, 'button button--primary'); reel.type = 'button'; reel.disabled = game.phase !== 'bite';
    reel.addEventListener('click', () => { if (game.phase !== 'bite') return; clearTimeout(escapeTimer); game = reelFishingCatch(game); status.textContent = copy.messages.caught; render(); }); actions.append(reel);
    const newCast = make('button', copy.fields.cast, 'button button--secondary'); newCast.type = 'button'; newCast.disabled = !['idle', 'finished'].includes(game.phase); newCast.addEventListener('click', cast); actions.append(newCast);
    content.append(actions); result.hidden = false;
  };
  form.addEventListener('submit', (event) => { event.preventDefault(); cast(); });
  form.addEventListener('reset', () => queueMicrotask(() => { clearTimers(); game = createFishingGame(); content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
  window.addEventListener('pagehide', clearTimers, { once: true });
}
