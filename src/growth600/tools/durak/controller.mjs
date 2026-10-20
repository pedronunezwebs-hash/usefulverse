import { createDurakGame, defendDurakAttack, finishDurakAttack, playDurakAttack, playDurakComputerTurn, takeDurakCards, throwInDurakCard } from './logic.mjs';

const root = document.querySelector('[data-tool="durak"]');
if (root) {
  const form = root.querySelector('[data-pending-form]'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const suitSymbols = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
  let match = null; let busy = false;
  const make = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };
  const activePlayer = (state) => state.phase === 'defend' ? state.defender : state.attacker;
  const addCard = (parent, card, onChoose) => {
    const label = `${card.rank}${suitSymbols[card.suit]}`;
    const button = make('button', label, `pending-durak-card${card.suit === 'hearts' || card.suit === 'diamonds' ? ' pending-durak-card--red' : ''}`);
    button.type = 'button'; button.disabled = busy; button.setAttribute('aria-label', `${copy.fields.card} ${card.rank} ${copy.fields[card.suit]}`);
    button.addEventListener('click', onChoose); parent.append(button);
  };
  const render = () => {
    if (!match) return;
    content.replaceChildren();
    const header = make('section', undefined, 'pending-durak-header');
    header.append(make('p', `${copy.fields.trump}: ${copy.fields[match.trump]} (${match.trumpCard.rank}${suitSymbols[match.trump]})`));
    header.append(make('p', `${copy.fields.cardsRemaining}: ${match.deck.length} · ${copy.fields.computerCards}: ${match.computerHand.length}`));
    content.append(header);
    const table = make('section', undefined, 'pending-durak-table'); table.setAttribute('aria-label', copy.fields.table);
    table.append(make('h3', copy.fields.table));
    if (!match.table.length) table.append(make('p', copy.fields.tableEmpty));
    for (const row of match.table) {
      const pair = make('div', undefined, 'pending-durak-pair');
      const attack = make('span', `${row.attack.rank}${suitSymbols[row.attack.suit]}`, 'pending-durak-card pending-durak-card--table');
      attack.setAttribute('aria-label', `${copy.fields.attackCard}: ${row.attack.rank} ${copy.fields[row.attack.suit]}`); pair.append(attack);
      const defense = row.defense ? make('span', `${row.defense.rank}${suitSymbols[row.defense.suit]}`, 'pending-durak-card pending-durak-card--table') : make('span', '—', 'pending-durak-uncovered');
      if (row.defense) defense.setAttribute('aria-label', `${copy.fields.defenseCard}: ${row.defense.rank} ${copy.fields[row.defense.suit]}`);
      pair.append(defense); table.append(pair);
    }
    content.append(table);
    if (match.phase === 'finished') {
      const key = match.winner === 'draw' ? 'draw' : match.winner === 'human' ? 'youWin' : 'computerWins';
      content.append(make('h3', copy.fields[key], 'pending-durak-result'));
    } else {
      const player = activePlayer(match);
      const prompt = player === 'computer' ? copy.fields.computerTurn : copy.fields[match.phase === 'attack' ? 'yourAttack' : match.phase === 'defend' ? 'yourDefense' : 'yourThrowIn'];
      content.append(make('p', prompt, 'hint'));
      const hand = make('section', undefined, 'pending-durak-hand'); hand.setAttribute('aria-label', copy.fields.yourHand); hand.append(make('h3', copy.fields.yourHand));
      for (const card of match.humanHand) addCard(hand, card, async () => {
        if (busy || activePlayer(match) !== 'human') return;
        try {
          busy = true;
          if (match.phase === 'attack') match = playDurakAttack(match, card.id);
          else if (match.phase === 'defend') match = defendDurakAttack(match, card.id);
          else if (match.phase === 'throw-in') match = throwInDurakCard(match, card.id);
          status.textContent = ''; status.classList.remove('status--error'); await advanceComputer();
        } catch { status.textContent = copy.messages.invalidMove; status.classList.add('status--error'); }
        finally { busy = false; render(); }
      });
      content.append(hand);
      const actions = make('div', undefined, 'pending-durak-actions');
      if (match.phase === 'defend' && match.defender === 'human') {
        const take = make('button', copy.fields.takeCards, 'button button--secondary'); take.type = 'button'; take.disabled = busy;
        take.addEventListener('click', async () => {
          if (busy) return;
          try { busy = true; match = takeDurakCards(match); await advanceComputer(); }
          catch { status.textContent = copy.messages.error; status.classList.add('status--error'); }
          finally { busy = false; render(); }
        }); actions.append(take);
      }
      if (match.phase === 'throw-in' && match.attacker === 'human') {
        const stop = make('button', copy.fields.endAttack, 'button button--secondary'); stop.type = 'button'; stop.disabled = busy;
        stop.addEventListener('click', async () => { if (busy) return; try { busy = true; match = finishDurakAttack(match); await advanceComputer(); } catch { status.textContent = copy.messages.invalidMove; status.classList.add('status--error'); } finally { busy = false; render(); } }); actions.append(stop);
      }
      if (actions.childElementCount) content.append(actions);
    }
    result.hidden = false;
  };
  const advanceComputer = async () => {
    while (match?.phase !== 'finished' && activePlayer(match) === 'computer') {
      await new Promise((resolve) => setTimeout(resolve, 350));
      match = playDurakComputerTurn(match); render();
    }
    if (match?.phase === 'finished') status.textContent = copy.messages.complete;
  };
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); match = createDurakGame(); busy = true; status.textContent = ''; status.classList.remove('status--error'); render();
    try { await advanceComputer(); } catch { status.textContent = copy.messages.error; status.classList.add('status--error'); }
    finally { busy = false; render(); }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { match = null; content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
