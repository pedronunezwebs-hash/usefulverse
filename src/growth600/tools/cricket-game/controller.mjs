import { createCricketMatch, playCricketBall } from './logic.mjs';

const root = document.querySelector('[data-tool="cricket-game"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const make = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };
  let match = null;
  const overs = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;
  const clear = () => { match = null; content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); };
  const render = () => {
    if (!match) return;
    content.replaceChildren();
    const board = make('section', undefined, 'pending-cricket-board');
    board.setAttribute('aria-label', copy.fields.scoreboard);
    const title = make('h3', `${copy.fields.innings} ${match.innings}`); board.append(title);
    const table = make('table', undefined, 'pending-table');
    const head = make('tr'); for (const label of [copy.fields.team, copy.fields.score, copy.fields.wickets, copy.fields.overs]) head.append(make('th', label));
    const thead = make('thead'); thead.append(head); table.append(thead);
    const body = make('tbody');
    const entries = [
      [match.userBatsFirst ? copy.fields.userTeam : copy.fields.computerTeam, match.inningsData[0]],
      [match.userBatsFirst ? copy.fields.computerTeam : copy.fields.userTeam, match.inningsData[1]],
    ];
    for (const [team, inning] of entries) { const row = make('tr'); for (const value of [team, inning.runs, inning.wickets, overs(inning.balls)]) row.append(make('td', value)); body.append(row); }
    table.append(body); board.append(table);
    if (match.target !== null && match.status === 'playing') board.append(make('p', `${copy.fields.target}: ${match.target}`));
    content.append(board);
    if (match.lastDelivery) {
      const last = match.lastDelivery;
      const selection = last.userBatting ? copy.fields[last.userChoice] : copy.fields[last.userChoice];
      const outcome = last.wicket ? copy.fields.wicket : `${new Intl.NumberFormat(document.documentElement.lang || 'en').format(last.runs)} ${copy.fields.runs}`;
      content.append(make('p', `${copy.fields.lastBall}: ${selection} · ${outcome}`, 'status'));
    }
    if (match.status === 'finished') {
      const resultKey = match.result === 'tie' ? 'matchTied' : match.result === 'user-win' ? 'youWon' : 'computerWon';
      content.append(make('h3', copy.fields[resultKey], 'pending-cricket-result'));
    } else {
      const userBatting = (match.innings === 1) === match.userBatsFirst;
      const prompt = make('p', userBatting ? copy.fields.chooseShot : copy.fields.chooseBall, 'hint'); content.append(prompt);
      const controls = make('div', undefined, 'actions pending-result-actions');
      const keys = userBatting ? ['defend', 'ground', 'loft'] : ['pace', 'spin', 'yorker'];
      for (const key of keys) { const button = make('button', copy.fields[key], 'button button--secondary'); button.type = 'button'; button.addEventListener('click', () => { try { match = playCricketBall(match, key); render(); status.textContent = copy.messages.complete; } catch { status.textContent = copy.messages.error; status.classList.add('status--error'); } }); controls.append(button); }
      content.append(controls);
    }
    result.hidden = false;
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault(); clear();
    const fields = Object.fromEntries([...form.querySelectorAll('[data-input]')].map((control) => [control.dataset.input, control.value]));
    try { match = createCricketMatch(fields); render(); status.textContent = copy.messages.complete; }
    catch { result.hidden = false; status.textContent = copy.messages.error; status.classList.add('status--error'); }
  });
  form.addEventListener('reset', () => queueMicrotask(clear));
}
