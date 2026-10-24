import { actMus, advanceMusBots, createMusGame } from './game.mjs';
const root = document.querySelector('[data-mus-game]');
if (root) {
  const copyNode = root.closest('[data-tool]')?.querySelector('[data-tool-copy]') ?? document.querySelector('[data-tool-copy]');
  const copy = JSON.parse(copyNode?.textContent ?? '{}');
  const fields = copy.fields, actions = copy.actions, messages = copy.messages;
  const handList = root.querySelector('[data-hand]'), playersList = root.querySelector('[data-players]'), actionsBox = root.querySelector('[data-actions]');
  const status = root.querySelector('[data-status]'), lanceLabel = root.querySelector('[data-lance]'), results = root.querySelector('[data-results]'), history = root.querySelector('[data-history]');
  const ownScore = root.querySelector('[data-own-score]'), rivalScore = root.querySelector('[data-rival-score]'), ownGames = root.querySelector('[data-own-games]'), rivalGames = root.querySelector('[data-rival-games]');
  const startButton = root.querySelector('[data-start]'), newButton = root.querySelector('[data-new-game]');
  let state = null, selected = new Set();
  const playerNames = [fields.you, fields.botOne, fields.partnerBot, fields.botTwo];
  const lanceName = (value) => fields.lanceNames[value] ?? value;
  function cardName(card) { return `${fields.rankNames[card.rank]} of ${fields.suitNames[card.suit]}`; }
  function button(label, type, disabled = false) {
    const element = document.createElement('button'); element.type = 'button'; element.className = 'button button--secondary'; element.textContent = label; element.dataset.action = type; element.disabled = disabled; return element;
  }
  function renderHand() {
    handList.replaceChildren();
    if (!state) return;
    for (const card of state.hands[0]) {
      const item = document.createElement('li'), select = button(cardName(card), 'select-card');
      select.dataset.cardId = card.id; select.setAttribute('aria-pressed', String(selected.has(card.id)));
      select.classList.toggle('is-selected', selected.has(card.id)); select.disabled = state.phase !== 'discard';
      item.append(select); handList.append(item);
    }
  }
  function renderPlayers() {
    playersList.replaceChildren();
    if (!state) return;
    state.hands.forEach((hand, seat) => {
      const item = document.createElement('li'), label = document.createElement('strong');
      const active = state.turn === seat && ['mus','discard','betting'].includes(state.phase);
      label.textContent = `${playerNames[seat]}${active ? ` · ${fields.activeTurn}` : ''}`;
      item.append(label);
      const cards = document.createElement('span');
      const reveal = ['showdown','game-won','finished'].includes(state.phase);
      cards.textContent = reveal ? ` — ${hand.map(cardName).join(', ')}` : ` — ${seat === 0 ? fields.youHaveFour : fields.hiddenCards}`;
      item.append(cards); playersList.append(item);
    });
  }
  function renderActions() {
    actionsBox.replaceChildren();
    if (!state) return;
    const add = (key, type, disabled = false) => actionsBox.append(button(actions[key], type, disabled));
    if (state.phase === 'mus' && state.turn === 0) { add('mus','mus'); add('noMus','no-mus'); }
    if (state.phase === 'discard' && state.turn === 0) {
      add('exchange','discard',selected.size === 0); add('keep','discard',false);
    }
    if (state.phase === 'betting' && state.turn === 0) {
      if (!state.betAmount) { add('pass','pass'); add('bet','bet-two'); add('ordago','ordago'); }
      else if (state.betTeam !== 0) { add('see','see'); add('fold','fold'); if (state.betAmount <= 38) add('raise','raise-four'); add('ordago','ordago'); }
      else { add('pass','pass',true); }
    }
    if (['showdown','game-won'].includes(state.phase)) add('nextHand','next-hand');
  }
  function renderHistory() {
    history.replaceChildren();
    if (!state) return;
    const latest = state.handHistory.at(-1);
    if (!latest) return;
    for (const event of latest.results) {
      const item = document.createElement('li');
      item.textContent = `${lanceName(event.lance)}: ${event.points ? `+${event.points}` : '0'} ${event.winnerTeam === 0 ? fields.ownTeam : event.winnerTeam === 1 ? fields.rivalTeam : fields.noWinner}`;
      history.append(item);
    }
  }
  function render() {
    const active = Boolean(state);
    startButton.hidden = active; newButton.hidden = !active || state.phase !== 'finished';
    ownScore.textContent = String(state?.scores[0] ?? 0); rivalScore.textContent = String(state?.scores[1] ?? 0);
    ownGames.textContent = String(state?.gamesWon[0] ?? 0); rivalGames.textContent = String(state?.gamesWon[1] ?? 0);
    lanceLabel.textContent = state ? `${fields.phase}: ${lanceName(state.lanceName ?? state.phase)} · ${fields.mano}: ${playerNames[state.mano]}` : fields.ready;
    results.hidden = !state || !['showdown','game-won','finished'].includes(state.phase);
    renderHand(); renderPlayers(); renderActions(); renderHistory();
  }
  function advanceBots() {
    if (!state) return;
    state = advanceMusBots(state).state;
  }
  function start() {
    state = createMusGame(); selected.clear(); advanceBots(); status.classList.remove('status--error'); render();
    status.textContent = state.phase === 'discard' ? messages.musAgreed : messages.yourTurn;
  }
  function perform(action) {
    try {
      if (action.type === 'restart') { state = null; selected.clear(); status.textContent = ''; render(); return; }
      if (action.type === 'next-hand') { state = actMus(state, 0, action); selected.clear(); advanceBots(); }
      else { state = actMus(state, 0, action); selected.clear(); advanceBots(); }
      render();
      status.classList.remove('status--error');
      if (state.phase === 'showdown') {
        const latest = state.handHistory.at(-1), winner = latest.winningTeam;
        status.textContent = winner === null ? messages.handResult.replace('{own}', String(state.scores[0])).replace('{rival}', String(state.scores[1]))
          : winner === 0 ? messages.gameWon : messages.opponentsWonGame;
      } else if (state.phase === 'game-won') status.textContent = state.handHistory.at(-1)?.winningTeam === 0 ? messages.gameWon : messages.opponentsWonGame;
      else if (state.phase === 'finished') status.textContent = state.gamesWon[0] > state.gamesWon[1] ? messages.matchWon : messages.opponentsWonMatch;
      else if (action.type === 'mus' && state.phase === 'discard') status.textContent = messages.musAgreed;
      else if (action.type === 'no-mus') status.textContent = messages.musStopped;
      else if (action.type === 'see') status.textContent = messages.accepted;
      else if (action.type === 'fold') status.textContent = messages.folded;
      else status.textContent = messages.yourTurn;
    } catch { status.textContent = messages.error; status.classList.add('status--error'); }
  }
  root.addEventListener('click', (event) => {
    const control = event.target.closest('[data-action]'); if (!control) return;
    if (control.dataset.action === 'select-card') {
      const id = control.dataset.cardId; selected.has(id) ? selected.delete(id) : selected.add(id); renderHand(); return;
    }
    const actionsByType = {
      'mus': { type: 'mus' }, 'no-mus': { type: 'no-mus' }, 'discard': { type: 'discard', cardIds: [...selected] },
      'pass': { type: 'pass' }, 'bet-two': { type: 'bet', amount: 2 }, 'raise-four': { type: 'raise', amount: (state?.betAmount ?? 2) + 2 },
      'see': { type: 'see' }, 'fold': { type: 'fold' }, 'ordago': { type: 'ordago' }, 'next-hand': { type: 'next-hand' }, 'restart': { type: 'restart' },
    };
    if (actionsByType[control.dataset.action]) perform(actionsByType[control.dataset.action]);
  });
  startButton.addEventListener('click', start); newButton.addEventListener('click', start);
  render();
}
