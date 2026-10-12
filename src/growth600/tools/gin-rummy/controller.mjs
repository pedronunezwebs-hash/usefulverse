import { discardGinRummyCard, drawGinRummyCard, playGinRummyBotTurn, scoreGinRummyHand, startGinRummyGame } from './logic.mjs';

const root = document.querySelector('[data-tool="gin-rummy"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const fields = copy.fields ?? {};
  const actions = copy.actions ?? {};
  let game = startGinRummyGame();
  let botTimer = 0;

  const rankLabel = (rank) => rank === 1 ? fields.ace : rank === 11 ? fields.jack : rank === 12 ? fields.queen : rank === 13 ? fields.king : String(rank);
  const suitGlyph = (suit) => ({ clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' })[suit];
  const textAt = (selector, value) => { const node = root.querySelector(selector); if (node) node.textContent = value; };
  const setStatus = (message) => textAt('[data-status]', message);
  const roundMessage = () => {
    const result = game.roundResult;
    if (!result) return '';
    let template;
    if (result.type === 'gin') template = result.winner === 0 ? copy.messages.roundGinYou : copy.messages.roundGinOpponent;
    else if (result.type === 'undercut') template = result.winner === 0 ? copy.messages.undercutOpponent : copy.messages.undercutYou;
    else template = result.winner === 0 ? copy.messages.roundKnockYou : copy.messages.roundKnockOpponent;
    return template.replaceAll('{points}', String(result.points));
  };
  const renderCards = () => {
    const handNode = root.querySelector('[data-hand]');
    if (!handNode) return;
    handNode.replaceChildren();
    const isHumanDiscard = game.phase === 'discard' && game.currentPlayer === 0;
    game.hands[0].forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gin-rummy__card';
      button.dataset.cardIndex = String(index);
      button.disabled = !isHumanDiscard;
      button.textContent = `${rankLabel(card.rank)} ${suitGlyph(card.suit)}`;
      button.setAttribute('aria-label', `${actions.discard}: ${rankLabel(card.rank)} ${fields[card.suit]}`);
      handNode.append(button);
    });
    const backs = root.querySelector('[data-opponent-hand]');
    backs?.replaceChildren(...game.hands[1].map(() => {
      const back = document.createElement('span');
      back.className = 'gin-rummy__card gin-rummy__card--back';
      back.setAttribute('role', 'img');
      back.setAttribute('aria-label', fields.hiddenCard);
      back.textContent = '▧';
      return back;
    }));
  };
  const render = () => {
    const isHumanDiscard = game.phase === 'discard' && game.currentPlayer === 0;
    const drawEnabled = game.phase === 'draw' && game.currentPlayer === 0;
    root.querySelectorAll('[data-action="draw-stock"], [data-action="draw-discard"]').forEach((button) => { button.disabled = !drawEnabled; });
    const discardTop = game.discardPile.at(-1);
    textAt('[data-stock-count]', String(game.stock.length));
    textAt('[data-discard-top]', discardTop ? `${rankLabel(discardTop.rank)} ${suitGlyph(discardTop.suit)} — ${fields[discardTop.suit]}` : '—');
    textAt('[data-score]', String(game.scores[0]));
    textAt('[data-opponent-score]', String(game.scores[1]));
    textAt('[data-deadwood]', String(scoreGinRummyHand(game.hands[0]).deadwoodPoints));
    const knock = root.querySelector('[data-knock]');
    if (knock) knock.disabled = !isHumanDiscard;
    renderCards();
    if (game.phase === 'finished') setStatus(roundMessage());
    else if (game.phase === 'discard' && game.currentPlayer === 0) setStatus(copy.messages.chooseDiscard);
    else if (game.phase === 'draw' && game.currentPlayer === 0) setStatus(copy.messages.chooseDraw);
  };
  const playBotIfNeeded = () => {
    if (game.phase !== 'draw' || game.currentPlayer !== 1) return;
    setStatus(copy.messages.opponentThinking);
    root.querySelectorAll('button').forEach((button) => { button.disabled = true; });
    clearTimeout(botTimer);
    botTimer = setTimeout(() => {
      if (!root.isConnected || game.phase !== 'draw' || game.currentPlayer !== 1) return;
      try {
        game = playGinRummyBotTurn(game);
        render();
      } catch {
        setStatus(copy.messages.stockEmpty);
      }
    }, 180);
  };

  root.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target || !root.contains(target)) return;
    try {
      if (target.dataset.action === 'new-game') {
        clearTimeout(botTimer);
        game = startGinRummyGame();
        render();
        setStatus(copy.messages.gameStarted);
        return;
      }
      if (target.dataset.action === 'draw-stock' || target.dataset.action === 'draw-discard') {
        const source = target.dataset.action === 'draw-stock' ? 'stock' : 'discard';
        game = drawGinRummyCard(game, source);
        render();
        setStatus(source === 'stock' ? copy.messages.drewStock : copy.messages.drewDiscard);
        return;
      }
      if (target.hasAttribute('data-card-index')) {
        const knock = Boolean(root.querySelector('[data-knock]')?.checked);
        game = discardGinRummyCard(game, Number(target.dataset.cardIndex), { knock });
        const knockInput = root.querySelector('[data-knock]');
        if (knockInput) knockInput.checked = false;
        render();
        playBotIfNeeded();
      }
    } catch (error) {
      setStatus(error instanceof RangeError && error.message.includes('Knock') ? copy.messages.invalidKnock : copy.messages.stockEmpty);
    }
  });

  render();
}
