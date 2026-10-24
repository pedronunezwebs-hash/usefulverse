import { PREFERANS_RANKS, PREFERANS_SUITS, bidPreferans, choosePreferansBotBid, choosePreferansBotCard, createPreferansGame, decidePreferansDefense, exchangePreferans, legalPreferansCards, playPreferansCard } from './logic.mjs';

const root = document.querySelector('[data-preferans]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const start = root.querySelector('[data-start]'), newHand = root.querySelector('[data-new]');
  const auction = root.querySelector('[data-auction]'), auctionStatus = root.querySelector('[data-auction-status]'), bidActions = root.querySelector('[data-bid-actions]');
  const exchange = root.querySelector('[data-exchange]'), exchangeCards = root.querySelector('[data-exchange-cards]'), confirmExchange = root.querySelector('[data-confirm-exchange]');
  const defense = root.querySelector('[data-defense]'), scores = root.querySelector('[data-scores]'), trick = root.querySelector('[data-trick]'), hand = root.querySelector('[data-hand]'), status = root.querySelector('[data-status]');
  let game = null, dealer = 2, selectedExchange = new Set();
  const cardLabel = (card) => `${copy.fields[`rank${card.rank}`]} ${copy.fields[`suit_${card.suit}`]}`;
  const announce = (message, error = false) => { status.textContent = message; status.classList.toggle('status--error', error); };
  const node = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = text; if (className) element.className = className; return element; };
  const createAction = (text, action, value, primary = false) => { const button = node('button', text, `button button--${primary ? 'primary' : 'secondary'}`); button.type = 'button'; button.dataset[action] = value; return button; };
  function render() {
    scores.replaceChildren(); trick.replaceChildren(); hand.replaceChildren(); bidActions.replaceChildren(); exchangeCards.replaceChildren();
    auction.hidden = !game || game.phase !== 'auction'; exchange.hidden = !game || game.phase !== 'exchange' || game.declarer !== 0;
    defense.hidden = !game || game.phase !== 'defend' || game.currentPlayer !== 0;
    newHand.hidden = !game || game.phase !== 'complete';
    if (!game) return;
    auctionStatus.textContent = `${copy.fields[`player${game.currentPlayer}`]} · ${copy.fields.currentBid}: ${game.highestBid ? copy.fields[`suit_${PREFERANS_SUITS[game.highestBid - 1]}`] : copy.fields.noBid}`;
    if (game.phase === 'auction' && game.currentPlayer === 0) {
      if (game.highestBid < 4) bidActions.append(createAction(copy.actions[`bid${game.highestBid + 1}`], 'bid', PREFERANS_SUITS[game.highestBid], true));
      bidActions.append(createAction(copy.actions.pass, 'bid', 'pass'));
    }
    if (game.phase === 'exchange' && game.declarer === 0) {
      for (const card of [...game.hands[0], ...game.talon]) {
        const item = node('li'); const button = createAction(`${selectedExchange.has(card.id) ? '✓ ' : ''}${cardLabel(card)}${game.talon.some((talonCard) => talonCard.id === card.id) ? ` · ${copy.fields.talon}` : ''}`, 'exchange-card', card.id);
        button.setAttribute('aria-pressed', String(selectedExchange.has(card.id))); item.append(button); exchangeCards.append(item);
      }
      confirmExchange.disabled = selectedExchange.size !== 2;
    }
    if (game.phase === 'complete') {
      const declarerTricks = game.tricksWon[game.declarer];
      for (let seat = 0; seat < 3; seat += 1) {
        const points = new Intl.NumberFormat(document.documentElement.lang || 'en', { signDisplay: 'always', maximumFractionDigits: 0 }).format(game.scoreDelta?.[seat] ?? 0);
        scores.append(node('li', `${copy.fields[`player${seat}`]}: ${game.tricksWon[seat]} ${copy.fields.tricks} · ${points} ${copy.fields.practicePoints}${seat === game.declarer ? ` · ${copy.fields.declarer}` : game.defenders.includes(seat) ? ` · ${game.tricksWon[seat] >= 2 ? copy.fields.quotaMet : copy.fields.quotaMissed}` : ''}`));
      }
      announce(game.redeal ? copy.messages.redeal : declarerTricks >= 6 ? copy.messages.declarerMade : copy.messages.declarerFailed);
    } else {
      for (let seat = 0; seat < 3; seat += 1) scores.append(node('li', `${copy.fields[`player${seat}`]} · ${game.hands[seat].length} ${copy.fields.cards}${game.defenders.includes(seat) ? ` · ${copy.fields.defending}` : ''}`));
    }
    for (const play of game.trick) trick.append(node('li', `${copy.fields[`player${play.player}`]}: ${cardLabel(play.card)}`));
    const legal = new Set(legalPreferansCards(game, 0).map((card) => card.id));
    for (const card of game.hands[0]) {
      const button = createAction(cardLabel(card), 'play-card', card.id); button.disabled = game.phase !== 'playing' || game.currentPlayer !== 0 || !legal.has(card.id);
      button.setAttribute('aria-label', cardLabel(card)); hand.append(node('li', undefined, 'preferans-card-item')); hand.lastElementChild.append(button);
    }
  }
  function botDiscard() {
    return [...game.hands[game.declarer], ...game.talon].sort((a, b) => PREFERANS_RANKS.indexOf(a.rank) - PREFERANS_RANKS.indexOf(b.rank)).slice(0, 2).map((card) => card.id);
  }
  function runBots() {
    let guard = 0;
    while (game && !['complete'].includes(game.phase) && game.currentPlayer !== 0 && guard++ < 100) {
      if (game.phase === 'auction') game = bidPreferans(game, game.currentPlayer, choosePreferansBotBid(game, game.currentPlayer));
      else if (game.phase === 'exchange') game = exchangePreferans(game, game.declarer, botDiscard());
      else if (game.phase === 'defend') game = decidePreferansDefense(game, game.currentPlayer, true);
      else if (game.phase === 'playing') { const card = choosePreferansBotCard(game, game.currentPlayer); if (!card) break; game = playPreferansCard(game, game.currentPlayer, card.id); }
    }
    render();
    if (game?.phase === 'auction' && game.currentPlayer === 0) announce(copy.messages.yourBid);
    else if (game?.phase === 'exchange' && game.declarer === 0) announce(copy.messages.yourExchange);
    else if (game?.phase === 'defend' && game.currentPlayer === 0) announce(copy.messages.yourDefense);
    else if (game?.phase === 'playing' && game.currentPlayer === 0) announce(copy.messages.yourTurn);
  }
  start.addEventListener('click', () => { try { game = createPreferansGame({ dealer }); dealer = (dealer + 1) % 3; selectedExchange.clear(); announce(copy.messages.started); runBots(); } catch { announce(copy.messages.startError, true); } });
  newHand.addEventListener('click', () => { game = null; selectedExchange.clear(); render(); start.click(); });
  bidActions.addEventListener('click', (event) => { const button = event.target.closest('[data-bid]'); if (!button || !game || game.currentPlayer !== 0) return; try { game = bidPreferans(game, 0, button.dataset.bid === 'pass' ? null : button.dataset.bid); runBots(); } catch { announce(copy.messages.invalidBid, true); } });
  exchangeCards.addEventListener('click', (event) => { const button = event.target.closest('[data-exchange-card]'); if (!button) return; if (selectedExchange.has(button.dataset.exchangeCard)) selectedExchange.delete(button.dataset.exchangeCard); else if (selectedExchange.size < 2) selectedExchange.add(button.dataset.exchangeCard); render(); });
  confirmExchange.addEventListener('click', () => { try { game = exchangePreferans(game, 0, [...selectedExchange]); selectedExchange.clear(); runBots(); } catch { announce(copy.messages.invalidExchange, true); } });
  root.querySelector('[data-defend]').addEventListener('click', () => { game = decidePreferansDefense(game, 0, true); runBots(); });
  root.querySelector('[data-drop]').addEventListener('click', () => { game = decidePreferansDefense(game, 0, false); runBots(); });
  hand.addEventListener('click', (event) => { const button = event.target.closest('[data-play-card]'); if (!button || !game || game.currentPlayer !== 0) return; try { game = playPreferansCard(game, 0, button.dataset.playCard); runBots(); } catch { announce(copy.messages.invalidCard, true); } });
  render();
}
