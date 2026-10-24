import { bidPinochle, choosePinochleBotBid, choosePinochleBotCard, choosePinochleExchangeCards, choosePinochleTrump, createPinochleGame, legalPinochleCards, playPinochleCard, returnPinochleExchange } from './logic.mjs';

const root = document.querySelector('[data-tool="pinochle"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const deckSelect = root.querySelector('[data-decks]');
  const start = root.querySelector('[data-start]');
  const newHand = root.querySelector('[data-new-hand]');
  const bidPanel = root.querySelector('[data-bid-panel]');
  const bidButton = root.querySelector('[data-bid]');
  const passButton = root.querySelector('[data-pass]');
  const trumpPanel = root.querySelector('[data-trump-panel]');
  const trumpSelect = root.querySelector('[data-trump]');
  const callTrump = root.querySelector('[data-call-trump]');
  const exchangePanel = root.querySelector('[data-exchange-panel]');
  const returnCards = root.querySelector('[data-return-cards]');
  const handList = root.querySelector('[data-hand]');
  const trickList = root.querySelector('[data-trick]');
  const opponents = root.querySelector('[data-opponents]');
  const scores = root.querySelector('[data-scores]');
  const contract = root.querySelector('[data-contract]');
  const handPoints = root.querySelector('[data-hand-points]');
  const status = root.querySelector('[data-status]');
  let game = null;
  let persistentScores = [0, 0];
  let dealer = 3;
  let selectedExchange = new Set();

  const cardLabel = (card) => `${copy.fields[card.suit]} ${copy.fields[`rank${card.rank}`]}`;
  const announce = (message, error = false) => { status.textContent = message; status.classList.toggle('status--error', error); };
  const render = () => {
    const teamNames = [copy.fields.yourTeam, copy.fields.opponentsTeam];
    scores.replaceChildren(...(game?.teamScores ?? persistentScores).map((score, i) => {
      const item = document.createElement('li');
      item.textContent = `${teamNames[i]}: ${score}`;
      return item;
    }));
    opponents.replaceChildren(...[1, 2, 3].map((player) => {
      const item = document.createElement('li');
      item.textContent = `${copy.fields[`player${player}`]} · ${game?.hands[player]?.length ?? 0} ${copy.fields.cards}`;
      return item;
    }));
    handList.replaceChildren();
    trickList.replaceChildren();
    if (!game) return;
    for (const play of game.currentTrick) {
      const item = document.createElement('li');
      item.textContent = `${copy.fields[`player${play.player}`]}: ${cardLabel(play.card)}`;
      trickList.append(item);
    }
    const legal = new Set(legalPinochleCards(game, 0).map(({ id }) => id));
    for (const card of [...game.hands[0]].sort((a, b) => a.suit.localeCompare(b.suit) || [9,11,12,13,10,14].indexOf(b.rank) - [9,11,12,13,10,14].indexOf(a.rank))) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button'; button.className = `button button--secondary pinochle-card pinochle-card--${card.suit}`;
      button.dataset.cardId = card.id; button.disabled = game.phase === 'exchange-return' ? game.declarer !== 0 || (selectedExchange.size >= 4 && !selectedExchange.has(card.id)) : !legal.has(card.id); button.textContent = cardLabel(card); button.setAttribute('aria-label', cardLabel(card));
      if (selectedExchange.has(card.id)) { button.classList.add('is-selected'); button.setAttribute('aria-pressed','true'); }
      item.append(button); handList.append(item);
    }
    bidPanel.hidden = game.phase !== 'auction' || game.currentPlayer !== 0;
    if (!bidPanel.hidden) bidButton.textContent = `${copy.actions.bid} ${game.highestBid ? game.highestBid + (game.decks === 1 ? 10 : game.highestBid < 60 ? 1 : 5) : game.decks === 1 ? 250 : 50}`;
    trumpPanel.hidden = game.phase !== 'choose-trump' || game.declarer !== 0;
    exchangePanel.hidden = game.phase !== 'exchange-return' || game.declarer !== 0;
    returnCards.disabled = selectedExchange.size !== 4;
    contract.textContent = game.highestBid ? `${copy.fields.contract}: ${game.highestBid}${game.trump ? ` · ${copy.fields.trump}: ${copy.fields[game.trump]}` : ''} · ${copy.fields.declarer}: ${copy.fields[`player${game.declarer}`]}` : '';
    handPoints.textContent = game.phase === 'playing' || game.phase === 'complete'
      ? `${copy.fields.currentMeld}: ${game.meldScores[0]}–${game.meldScores[1]} · ${copy.fields.currentTrickPoints}: ${game.trickPoints[0]}–${game.trickPoints[1]}`
      : '';
    start.hidden = !(game.phase === 'complete' && game.winner !== null);
    start.textContent = game.winner !== null ? copy.actions.newMatch : copy.actions.startGame;
    deckSelect.disabled = !(game.phase === 'complete' && game.winner !== null);
    newHand.hidden = game.phase !== 'complete' || game.winner !== null;
    if (game.phase === 'complete') announce(game.winner === 0 ? copy.messages.gameWon : game.winner === 1 ? copy.messages.gameLost : copy.messages.handComplete);
  };
  const chooseBotTrump = () => {
    const counts = ['clubs','diamonds','hearts','spades'].map((suit) => ({ suit, count: game.hands[game.declarer].filter((card) => card.suit === suit).length, meld: game.hands[game.declarer].filter((card) => card.suit === suit && [12,13].includes(card.rank)).length }));
    counts.sort((a,b) => b.meld-a.meld || b.count-a.count);
    game = choosePinochleTrump(game, game.declarer, counts[0].suit);
  };
  const runBots = () => {
    let guard = 0;
    while (game && guard++ < 80) {
      if (game.phase === 'auction' && game.currentPlayer !== 0) game = bidPinochle(game, game.currentPlayer, choosePinochleBotBid(game, game.currentPlayer));
      else if (game.phase === 'choose-trump' && game.declarer !== 0) chooseBotTrump();
      else if (game.phase === 'exchange-return' && game.declarer !== 0) { game = returnPinochleExchange(game, game.declarer, choosePinochleExchangeCards(game.hands[game.declarer], game.trump, 4).map(({id})=>id)); selectedExchange = new Set(); }
      else if (game.phase === 'playing' && game.currentPlayer !== 0) game = playPinochleCard(game, game.currentPlayer, choosePinochleBotCard(game).id);
      else break;
    }
    render();
    if (game?.phase === 'auction' && game.currentPlayer === 0) announce(`${copy.messages.yourBid}${game.highestBid ? ` ${copy.fields.highBid}: ${game.highestBid}` : ''}`);
    else if (game?.phase === 'choose-trump' && game.declarer === 0) announce(copy.messages.chooseTrump);
    else if (game?.phase === 'exchange-return' && game.declarer === 0) announce(copy.messages.returnFour);
    else if (game?.phase === 'playing' && game.currentPlayer === 0) announce(copy.messages.yourTurn);
  };
  const deal = () => {
    try {
      if (game?.winner !== null && game?.winner !== undefined) { persistentScores = [0, 0]; dealer = 3; }
      game = createPinochleGame({ decks: Number(deckSelect.value), scores: persistentScores, dealer }); render(); runBots();
    }
    catch { announce(copy.messages.startError, true); }
  };
  start.addEventListener('click', deal);
  newHand.addEventListener('click', () => { if (!game || game.phase !== 'complete' || game.winner !== null) return; persistentScores = [...game.teamScores]; dealer = (dealer + 1) % 4; deal(); });
  bidButton.addEventListener('click', () => { try { game = bidPinochle(game, 0, game.highestBid ? game.highestBid + (game.decks === 1 ? 10 : game.highestBid < 60 ? 1 : 5) : game.decks === 1 ? 250 : 50); runBots(); } catch { announce(copy.messages.bidError, true); } });
  passButton.addEventListener('click', () => { try { game = bidPinochle(game, 0, null); runBots(); } catch { announce(copy.messages.bidError, true); } });
  callTrump.addEventListener('click', () => { try { game = choosePinochleTrump(game, 0, trumpSelect.value); selectedExchange = new Set(); announce(game.phase === 'exchange-return' ? copy.messages.returnFour : copy.messages.yourTurn); render(); runBots(); } catch { announce(copy.messages.trumpError, true); } });
  returnCards.addEventListener('click', () => {
    try { game = returnPinochleExchange(game, 0, [...selectedExchange]); selectedExchange = new Set(); announce(copy.messages.yourTurn); render(); runBots(); }
    catch { announce(copy.messages.returnError, true); }
  });
  handList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-card-id]');
    if (!button || !game || game.currentPlayer !== 0) return;
    if (game.phase === 'exchange-return') {
      if (selectedExchange.has(button.dataset.cardId)) selectedExchange.delete(button.dataset.cardId);
      else if (selectedExchange.size < 4) selectedExchange.add(button.dataset.cardId);
      render();
      return;
    }
    try { game = playPinochleCard(game, 0, button.dataset.cardId); render(); runBots(); }
    catch { announce(copy.messages.illegalCard, true); }
  });
  render();
}
