import { drawTruthOrDare } from '../pending-23/logic.mjs';

const root = document.querySelector('[data-tool="truth-or-dare"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const make = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };
  let session = null;
  const clear = () => { session = null; content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); };
  const draw = () => {
    const prefix = session.ageMode === 'adult' ? 'adult' : 'family';
    const prompts = (kind) => Array.from({ length: 8 }, (_, index) => copy.fields[`${kind}_${prefix}_${String(index + 1).padStart(2, '0')}`]).filter((value) => typeof value === 'string' && value.trim());
    const prompt = drawTruthOrDare({ kind: session.kind, ageMode: session.ageMode, truths: prompts('truth'), dares: prompts('dare'), players: session.players, turn: session.turn, usedPromptsByKind: session.used, playerLabel: copy.fields.defaultPlayer });
    session.turn += 1;
    session.used[prompt.kind].push(prompt.prompt);
    content.replaceChildren();
    const stats = make('dl');
    for (const [label, value] of [[copy.fields.currentPlayer, prompt.player], [copy.fields.turnNumber, new Intl.NumberFormat(document.documentElement.lang || 'en').format(prompt.turn)], [copy.fields.truthPromptCount, prompt.truthCount], [copy.fields.darePromptCount, prompt.dareCount]]) stats.append(make('dt', label), make('dd', value));
    content.append(stats);
    const panel = make('section', undefined, 'pending-charades-prompt');
    panel.append(make('h3', copy.fields[prompt.kind]));
    const text = make('p', prompt.prompt, 'pending-charades-prompt__word'); text.hidden = true;
    let complete = null;
    const reveal = make('button', copy.fields.revealPrompt, 'button button--secondary'); reveal.type = 'button';
    reveal.addEventListener('click', () => { text.hidden = !text.hidden; reveal.textContent = text.hidden ? copy.fields.revealPrompt : copy.fields.hidePrompt; if (complete && !text.hidden) complete.disabled = false; });
    panel.append(text, reveal, make('p', copy.fields.skipAnytime, 'hint')); content.append(panel);
    if (session.scoring) {
      const scoreList = make('ol'); scoreList.setAttribute('aria-label', copy.fields.score);
      session.players.forEach((player, index) => scoreList.append(make('li', `${player}: ${new Intl.NumberFormat(document.documentElement.lang || 'en').format(session.scores[index])}`)));
      content.append(scoreList);
      complete = make('button', copy.fields.completePrompt, 'button button--primary'); complete.type = 'button'; complete.disabled = true;
      complete.addEventListener('click', () => { session.scores[prompt.playerIndex] += 1; advance(); }); content.append(complete);
    }
    const next = make('button', copy.fields.passPrompt, 'button button--secondary'); next.type = 'button';
    next.addEventListener('click', advance); content.append(next);
    result.hidden = false; status.classList.remove('status--error'); status.textContent = copy.messages.complete;
  };
  const advance = () => {
    try { draw(); } catch { clear(); status.textContent = copy.messages.error; status.classList.add('status--error'); }
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault(); clear();
    const fields = Object.fromEntries([...form.querySelectorAll('[data-input]')].map((control) => [control.dataset.input, control.type === 'checkbox' ? control.checked : control.value]));
    try {
      session = { ageMode: fields.ageMode, kind: fields.kind, players: String(fields.players ?? '').split(/\r?\n/u).map((name) => name.trim()).filter(Boolean), scoring: fields.scoring === true, scores: [], turn: 0, used: { truth: [], dare: [] } };
      if (!session.players.length) session.players = [copy.fields.defaultPlayer + ' 1', copy.fields.defaultPlayer + ' 2'];
      session.scores = session.players.map(() => 0);
      draw();
    } catch { clear(); status.textContent = copy.messages.error; status.classList.add('status--error'); }
  });
  form.addEventListener('reset', () => queueMicrotask(clear));
  for (const control of form.querySelectorAll('[data-input]')) control.addEventListener('input', clear);
  for (const control of form.querySelectorAll('[data-input][type="checkbox"]')) control.addEventListener('change', clear);
}
