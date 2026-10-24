const SUITS = Object.freeze(['♠', '♥', '♦', '♣']);
const RANKS = Object.freeze(['2','3','4','5','6','7','8','9','10','J','Q','K','A']);
const rankValue = (rank) => RANKS.indexOf(rank) + 2;

export function createPokerDeck(random = Math.random) {
  if (typeof random !== 'function') throw new TypeError('A random source is required.');
  const cards = SUITS.flatMap((suit) => RANKS.map((rank) => Object.freeze({ suit, rank, value: rankValue(rank) })));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random values must be from 0 up to 1.');
    const j = Math.floor(sample * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function combinations(cards, size) {
  const out = [];
  const visit = (start, picked) => {
    if (picked.length === size) { out.push(picked); return; }
    for (let i = start; i <= cards.length - (size - picked.length); i += 1) visit(i + 1, [...picked, cards[i]]);
  };
  visit(0, []); return out;
}

function straightHigh(values) {
  const unique = [...new Set(values)].sort((a,b) => b-a);
  if (unique[0] === 14) unique.push(1);
  for (let i = 0; i <= unique.length - 5; i += 1) if (unique[i] - unique[i+4] === 4) return unique[i];
  return 0;
}

function rankFive(cards) {
  const values = cards.map((c) => c.value).sort((a,b) => b-a);
  const counts = new Map(); for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  const groups = [...counts].map(([value,count]) => ({value,count})).sort((a,b) => b.count-a.count || b.value-a.value);
  const flush = cards.every((card) => card.suit === cards[0].suit);
  const straight = straightHigh(values);
  if (flush && straight) return [8, straight];
  if (groups[0].count === 4) return [7, groups[0].value, groups[1].value];
  if (groups[0].count === 3 && groups[1].count === 2) return [6, groups[0].value, groups[1].value];
  if (flush) return [5, ...values];
  if (straight) return [4, straight];
  if (groups[0].count === 3) return [3, groups[0].value, ...groups.slice(1).map((g) => g.value)];
  if (groups[0].count === 2 && groups[1].count === 2) return [2, groups[0].value, groups[1].value, groups[2].value];
  if (groups[0].count === 2) return [1, groups[0].value, ...groups.slice(1).map((g) => g.value)];
  return [0, ...values];
}

export function evaluatePokerHand(cards) {
  if (!Array.isArray(cards) || cards.length < 5 || cards.length > 7 || cards.some((c) => !SUITS.includes(c?.suit) || !RANKS.includes(c?.rank))) throw new RangeError('Provide five to seven valid cards.');
  const best = combinations(cards, 5).map(rankFive).sort(comparePokerRanks).at(-1);
  return Object.freeze({ rank: Object.freeze(best), category: ['high-card','one-pair','two-pair','three-of-a-kind','straight','flush','full-house','four-of-a-kind','straight-flush'][best[0]] });
}

export function comparePokerRanks(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) { const diff = (a[i] || 0) - (b[i] || 0); if (diff) return diff; }
  return 0;
}

export function createHoldemHand({ random = Math.random, startingStack = 1000, smallBlind = 10, bigBlind = 20 } = {}) {
  if (![startingStack,smallBlind,bigBlind].every(Number.isInteger) || smallBlind < 1 || bigBlind < smallBlind * 2 || startingStack < bigBlind * 2) throw new RangeError('Choose valid integer chip amounts.');
  const deck = createPokerDeck(random); let cursor = 0;
  const draw = () => deck[cursor++];
  const human = { id:'you', stack:startingStack, hole:[draw(),draw()], folded:false, allIn:false, committed:0 };
  const bots = [0,1].map((i) => ({ id:`bot-${i+1}`, stack:startingStack, hole:[draw(),draw()], folded:false, allIn:false, committed:0 }));
  const seats = [human,...bots]; const pot = { amount:0 };
  const post = (seat, amount) => { const paid = Math.min(seat.stack,amount); seat.stack-=paid; seat.committed+=paid; pot.amount+=paid; seat.allIn=seat.stack===0; return paid; };
  post(bots[0],smallBlind); post(bots[1],bigBlind);
  const board = [draw(),draw(),draw(),draw(),draw()];
  return { seats, board, revealed:0, pot:pot.amount, bigBlind, currentBet:bigBlind, stage:'preflop', pending:['you','bot-1','bot-2'], result:null, deckPosition:cursor };
}

const seat = (hand,id) => hand.seats.find((s)=>s.id===id);
function nextStage(hand) { if(hand.stage==='preflop')hand.stage='flop';else if(hand.stage==='flop')hand.stage='turn';else if(hand.stage==='turn')hand.stage='river';else hand.stage='showdown';hand.revealed=hand.stage==='flop'?3:hand.stage==='turn'?4:hand.stage==='river'?5:hand.revealed;for(const s of hand.seats)s.committed=0;hand.currentBet=0;hand.pending=hand.seats.filter((s)=>!s.folded&&!s.allIn).map((s)=>s.id); }
function settle(hand) {
  const active=hand.seats.filter((s)=>!s.folded);let winners=[];
  if(active.length===1) winners=active;
  else { const scored=active.map((s)=>({s,r:evaluatePokerHand([...s.hole,...hand.board.slice(0,hand.revealed||5)]).rank}));const top=scored.map((x)=>x.r).sort(comparePokerRanks).at(-1);winners=scored.filter((x)=>comparePokerRanks(x.r,top)===0).map((x)=>x.s); }
  const awarded=hand.pot;const share=Math.floor(awarded/winners.length); for(const w of winners)w.stack+=share;hand.result={winners:winners.map((w)=>w.id),category:active.length===1?'fold-win':evaluatePokerHand([...winners[0].hole,...hand.board.slice(0,hand.revealed||5)]).category,split:awarded%winners.length,awarded};hand.pot=0;hand.stage='complete';hand.pending=[];
}

export function actHoldem(hand, playerAction) {
  if(!hand||hand.stage==='complete'||!hand.pending.includes('you'))throw new RangeError('It is not your turn.');
  const human=seat(hand,'you');const toCall=Math.max(0,hand.currentBet-human.committed);
  if(playerAction==='fold')human.folded=true;
  else if(playerAction==='check'&&toCall===0){}
  else if(playerAction==='call') { const paid=Math.min(human.stack,toCall);human.stack-=paid;human.committed+=paid;hand.pot+=paid;human.allIn=human.stack===0; }
  else if(playerAction==='raise') { const target=hand.currentBet+hand.bigBlind*2;const paid=Math.min(human.stack,toCall+hand.bigBlind*2);if(paid<=toCall)throw new RangeError('A raise must add at least one big blind.');human.stack-=paid;human.committed+=paid;hand.pot+=paid;human.allIn=human.stack===0;hand.currentBet=human.committed; }
  else throw new RangeError('Choose fold, check, call or raise.');
  hand.pending=hand.pending.filter((id)=>id!=='you');
  for(const id of [...hand.pending]){const bot=seat(hand,id);if(!bot||bot.folded||bot.allIn){hand.pending=hand.pending.filter((x)=>x!==id);continue;}const due=Math.max(0,hand.currentBet-bot.committed);const strength=(bot.hole[0].value+bot.hole[1].value)/28+(hand.revealed?0.15:0);if(due>bot.stack|| (due>0&&strength<0.48)){bot.folded=true;}else{const paid=Math.min(bot.stack,due);bot.stack-=paid;bot.committed+=paid;hand.pot+=paid;bot.allIn=bot.stack===0;}hand.pending=hand.pending.filter((x)=>x!==id);}
  if(hand.seats.filter((s)=>!s.folded).length===1){settle(hand);return hand;}
  if(hand.pending.length===0){if(hand.stage==='river'||hand.seats.filter((s)=>!s.folded&&!s.allIn).length===0){hand.revealed=5;settle(hand);}else nextStage(hand);}
  return hand;
}

export function continueHoldemHand(hand) {
  if(!hand||hand.stage==='complete'||hand.pending.includes('you'))throw new RangeError('The hand is not ready to continue.');
  while(hand.stage!=='complete'&&!hand.pending.includes('you')){
    if(hand.pending.length===0){if(hand.stage==='river'||hand.seats.filter((s)=>!s.folded&&!s.allIn).length===0){hand.revealed=5;settle(hand);}else nextStage(hand);continue;}
    const id=hand.pending.shift();const bot=seat(hand,id);if(!bot||bot.folded||bot.allIn)continue;
    const due=Math.max(0,hand.currentBet-bot.committed);const strength=(bot.hole[0].value+bot.hole[1].value)/28+(hand.revealed?0.15:0);
    if(due>0&&strength<0.46)bot.folded=true;else{const paid=Math.min(bot.stack,due);bot.stack-=paid;bot.committed+=paid;hand.pot+=paid;bot.allIn=bot.stack===0;}
    if(hand.seats.filter((s)=>!s.folded).length===1){settle(hand);break;}
  }
  return hand;
}
