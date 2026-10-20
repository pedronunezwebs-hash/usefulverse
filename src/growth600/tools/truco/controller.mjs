import { callArgentineEnvido, callNextTrucoStake, playTrucoCard, respondToTrucoOffer, startNextTrucoHand, startTrucoGame } from './logic.mjs';

const root = document.querySelector('[data-tool="truco"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields;
  let game = null;
  let showHand = false;
  const node = (tag, text, className) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = String(text); if (className) el.className = className; return el; };
  const secureRandomIndex = (max) => {
    if (!globalThis.crypto?.getRandomValues) return Math.floor(Math.random() * max);
    const range = 0x100000000;
    const ceiling = range - (range % max);
    const sample = new Uint32Array(1);
    do { crypto.getRandomValues(sample); } while (sample[0] >= ceiling);
    return sample[0] % max;
  };
  const teamName = (team) => team === 0 ? f.teamOne : f.teamTwo;
  const suitLabel = (suit) => f[`suit_${suit}`] ?? suit;
  const cardName = (card) => {
    const rankKey = game.variant === 'argentina'
      ? ({ 1: 'rankAce', 10: 'rankSota', 11: 'rankCaballo', 12: 'rankRey' })[card.rank]
      : ({ 1: 'rankAce', 10: 'rankQueen', 11: 'rankJack', 12: 'rankKing' })[card.rank];
    const rank = rankKey ? f[rankKey] : String(card.rank);
    return `${rank} ${suitLabel(card.suit)}`;
  };
  const makeAction = (label, action) => {
    const button = node('button', label, 'button button--secondary');
    button.type = 'button'; button.addEventListener('click', action); return button;
  };
  function setStatus(code) {
    status.textContent = copy.messages[code] ?? '';
    status.classList.toggle('status--error', ['invalid-action','invalid-response','invalid-card'].includes(code));
  }
  function addReferenceLinks() {
    const links = [
      ['argentinaReference', 'https://www.argentina.gob.ar/turismoydeportes/juegosevita/truco'],
      ['argentinaTournamentReference', 'https://www.argentina.gob.ar/sites/default/files/2023/04/truco.pdf'],
      ['brazilReference', 'https://www.querencia.mt.gov.br/fotos_noticias/1334.pdf'],
      ['brazilCardReference', 'https://www.trucozone.com/regras-do-truco-paulista'],
    ];
    const nav = node('nav'); nav.className = 'truco-references'; nav.setAttribute('aria-label', f.rulesReferences);
    for (const [key, href] of links) { const link = node('a', f[key]); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; nav.append(link); }
    content.append(nav);
  }
  function addTrickHistory() {
    if (!game.currentTrick.length && !game.tricks.length) return;
    const table = node('ol', undefined, 'truco-tricks'); table.setAttribute('aria-label', f.trickTable);
    const allTricks = [...game.tricks.map((trick) => ({ ...trick, current: false })), ...(game.currentTrick.length ? [{ plays: game.currentTrick, winner: null, current: true }] : [])];
    allTricks.forEach((trick, index) => {
      const item = node('li'); item.append(node('strong', `${f.trick} ${index + 1}`));
      const plays = node('ul'); for (const play of trick.plays) plays.append(node('li', `${game.names[play.player]}: ${cardName(play.card)}`)); item.append(plays);
      if (!trick.current) item.append(node('small', trick.winner === null ? f.trickTied : `${f.teamWinsTrick}: ${teamName(trick.winner)}`));
      table.append(item);
    });
    content.append(table);
  }
  function render() {
    content.replaceChildren();
    if (!game) return;
    const rules = node('details', undefined, 'truco-rules');
    const summary = node('summary', f.rulesForSelectedVariant); rules.append(summary);
    rules.append(node('p', game.variant === 'argentina' ? f.rulesArgentina : f.rulesBrazil));
    content.append(rules);
    const scoreboard = node('div', undefined, 'truco-scoreboard');
    scoreboard.setAttribute('aria-label', f.matchScore);
    for (const team of [0,1]) {
      const scoreCard = node('div', undefined, 'truco-score');
      scoreCard.append(node('strong', teamName(team)), node('span', String(game.score[team])));
      const teamPlayers = game.names.filter((_, index) => index % 2 === team);
      scoreCard.append(node('small', teamPlayers.join(' · ')));
      scoreboard.append(scoreCard);
    }
    content.append(scoreboard);
    const meta = node('p', `${f.handNumber}: ${game.handNumber} · ${f.stake}: ${game.stake}`); content.append(meta);
    if (game.variant === 'brazil-paulista' && game.vira) {
      const vira = node('p', `${f.vira}: ${cardName(game.vira)}`, 'truco-vira'); content.append(vira);
    }
    addTrickHistory();
    if (game.matchWinner !== null) {
      content.append(node('h3', `${f.matchWinner}: ${teamName(game.matchWinner)}`, 'truco-winner'));
      content.append(makeAction(f.newMatch, () => { game = null; result.hidden = true; content.replaceChildren(); status.textContent = ''; }));
      addReferenceLinks(); return;
    }
    if (game.handClosed) {
      content.append(node('h3', game.handWinner === null ? f.handTied : `${f.handWinner}: ${teamName(game.handWinner)}`, 'truco-winner'));
      content.append(makeAction(f.nextHand, () => { game = startNextTrucoHand(game, secureRandomIndex); showHand = true; setStatus('newHand'); render(); }));
      addReferenceLinks(); return;
    }
    const currentName = game.names[game.currentPlayer];
    content.append(node('p', `${f.currentTurn}: ${currentName}`, 'truco-current-player'));
    if (!showHand) {
      content.append(makeAction(f.passDevice, () => { showHand = true; setStatus(''); render(); }));
      if (game.offer) content.append(node('p', `${f.offerLabel}: ${game.names[game.offer.caller]} · ${game.offer.type === 'envido' ? f.callEnvido : `${f.proposedStake}: ${game.offer.proposedStake}`}`, 'hint'));
    } else if (game.offer) {
      content.append(node('p', `${f.offerLabel}: ${game.names[game.offer.caller]} · ${game.offer.type === 'envido' ? f.callEnvido : `${f.proposedStake}: ${game.offer.proposedStake}`}`, 'hint'));
      const actions = node('div', undefined, 'actions');
      actions.append(makeAction(f.acceptOffer, () => { game = respondToTrucoOffer(game, game.currentPlayer, true); showHand = false; setStatus(game.lastResult.code); render(); }));
      actions.append(makeAction(f.declineOffer, () => { game = respondToTrucoOffer(game, game.currentPlayer, false); showHand = false; setStatus(game.lastResult.code); render(); }));
      content.append(actions);
    } else {
      const hand = game.hands[game.currentPlayer];
      const cards = node('div', undefined, 'truco-hand'); cards.setAttribute('role', 'group'); cards.setAttribute('aria-label', f.cardsInHand);
      for (const card of hand) {
        const button = node('button', undefined, `truco-card${['cups','hearts','coins','diamonds'].includes(card.suit) ? ' truco-card--red' : ''}`);
        button.type = 'button'; button.setAttribute('aria-label', `${f.playCard}: ${cardName(card)}`);
        button.append(node('span', card.displayRank), node('span', ({spades:'♠',clubs:'♣',coins:'♦',cups:'♥',hearts:'♥',diamonds:'♦'})[card.suit]));
        button.addEventListener('click', () => { game = playTrucoCard(game, game.currentPlayer, card.id); showHand = false; setStatus(game.lastResult.code); render(); });
        cards.append(button);
      }
      content.append(node('h3', `${currentName} · ${f.cardsInHand}`), cards);
      const actions = node('div', undefined, 'actions');
      if (game.variant === 'argentina' && !game.envidoUsed && !game.tricks.length && !game.currentTrick.length) actions.append(makeAction(f.callEnvido, () => { game = callArgentineEnvido(game); showHand = false; setStatus(game.lastResult.code); render(); }));
      const callFields = game.variant === 'argentina' ? ['callTruco','callRetruco','callValeCuatro'] : ['callTruco','callSeis','callNove','callDoze'];
      const callKey = callFields[game.stakeIndex];
      if (callKey) actions.append(makeAction(f[callKey], () => { game = callNextTrucoStake(game); showHand = false; setStatus(game.lastResult.code); render(); }));
      content.append(actions);
    }
    addReferenceLinks();
  }

  form.elements.namedItem('variant').addEventListener('change', () => {
    const variant = form.elements.namedItem('variant').value;
    form.elements.namedItem('target').value = variant === 'brazil-paulista' ? '12' : variant === 'argentina' ? '30' : '';
  });
  form.querySelector('[data-action="example"]')?.remove();
  form.addEventListener('submit', (event) => {
    event.preventDefault(); content.replaceChildren(); status.classList.remove('status--error');
    try {
      const names = ['playerOne','playerTwo','playerThree','playerFour'].map((key,index) => form.elements.namedItem(key).value.trim() || f[`defaultPlayer${index+1}`]);
      game = startTrucoGame({ variant: form.elements.namedItem('variant').value, target: form.elements.namedItem('target').value, playerNames: names, randomIndex: secureRandomIndex });
      showHand = true; result.hidden = false; setStatus('newHand'); render();
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = false; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { game = null; showHand = false; content.replaceChildren(); status.textContent = ''; status.classList.remove('status--error'); result.hidden = true; }));
}
