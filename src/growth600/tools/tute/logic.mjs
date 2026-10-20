export const TUTE_SUITS = Object.freeze(['coins','cups','swords','clubs']);
export const TUTE_RANKS = Object.freeze([1,2,3,4,5,6,7,10,11,12]);
const TRICK_ORDER = Object.freeze([2,4,5,6,7,10,11,12,3,1]);
const points = Object.freeze({1:11,3:10,12:4,11:3,10:2,2:0,4:0,5:0,6:0,7:0});
const strength = (card) => TRICK_ORDER.indexOf(card.rank);

function randomIndex(length, random, cryptoImpl) {
  if (random) {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return a number in [0, 1).');
    return Math.floor(value * length);
  }
  if (!cryptoImpl?.getRandomValues) throw new TypeError('Secure local randomness is unavailable.');
  const limit = Math.floor(0x1_0000_0000 / length) * length;
  const value = new Uint32Array(1);
  do { cryptoImpl.getRandomValues(value); } while (value[0] >= limit);
  return value[0] % length;
}

export function createTuteDeck() {
  return TUTE_SUITS.flatMap((suit) => TUTE_RANKS.map((rank) => Object.freeze({ id:`${suit}-${rank}`,suit,rank,points:points[rank] })));
}

export function createTuteGame({ mode='pairs',random,cryptoImpl=globalThis.crypto,allowTute=true }={}) {
  if (!['pairs','individual'].includes(mode)) throw new RangeError('Choose partnership or individual Tute.');
  const deck=createTuteDeck();
  for(let i=deck.length-1;i>0;i-=1){const j=randomIndex(i+1,random,cryptoImpl);[deck[i],deck[j]]=[deck[j],deck[i]];}
  const hands=mode==='pairs'?[deck.slice(0,10),deck.slice(10,20),deck.slice(20,30),deck.slice(30,40)]:[deck.slice(0,10),deck.slice(10,20)];
  const trumpCard=mode==='pairs'?hands[3][9]:deck[20];
  const stock=mode==='pairs'?[]:[...deck.slice(21),trumpCard];
  return Object.freeze({mode,phase:'playing',hands:Object.freeze(hands.map((hand)=>Object.freeze(hand))),stock:Object.freeze(stock),trumpCard,trumpSuit:trumpCard.suit,allowTute,currentPlayer:mode==='pairs'?0:0,trick:Object.freeze([]),trickNumber:1,totalTricks:mode==='pairs'?10:20,trickPoints:Object.freeze(Array(hands.length).fill(0)),declarationPoints:Object.freeze(Array(hands.length).fill(0)),declaredTwenty:Object.freeze(Array(hands.length).fill(false)),declaredTwentySuits:Object.freeze(Array.from({length:hands.length},()=>Object.freeze([]))),declaredForty:Object.freeze(Array(hands.length).fill(false)),singAvailableFor:null,lastTrickWinner:null,winner:null,draw:false});
}

function currentWinner(trick,trumpSuit){
  const leadSuit=trick[0].card.suit;
  const trumps=trick.filter(({card})=>card.suit===trumpSuit);
  const candidates=trumps.length?trumps:trick.filter(({card})=>card.suit===leadSuit);
  return candidates.reduce((best,play)=>strength(play.card)>strength(best.card)?play:best);
}

export function legalTuteCards(game,player=game?.currentPlayer){
  if(!game||game.phase!=='playing'||player!==game.currentPlayer)return [];
  const hand=game.hands[player];
  if(!game.trick.length)return hand;
  if(game.mode==='individual'&&game.stock.length)return hand;
  const leadSuit=game.trick[0].card.suit;
  const following=hand.filter((card)=>card.suit===leadSuit);
  const winning=currentWinner(game.trick,game.trumpSuit);
  const trumpOnTable=game.trick.some(({card})=>card.suit===game.trumpSuit);
  if(following.length){
    if(trumpOnTable&&leadSuit!==game.trumpSuit)return following;
    const canBeat=following.filter((card)=>card.suit===winning.card.suit&&strength(card)>strength(winning.card));
    return canBeat.length?canBeat:following;
  }
  const trumps=hand.filter((card)=>card.suit===game.trumpSuit);
  if(!trumps.length)return hand;
  if(!trumpOnTable)return trumps;
  const overtrumps=trumps.filter((card)=>strength(card)>strength(winning.card));
  return overtrumps.length?overtrumps:hand;
}

function singable(game,player){
  if(!game||game.phase!=='singing'||game.singAvailableFor!==player)return [];
  const hand=game.hands[player];
  const allowed=game.mode==='pairs'?[player]:[player];
  return TUTE_SUITS.flatMap((suit)=>{
    const king=hand.find((card)=>card.suit===suit&&card.rank===12);
    const horse=hand.find((card)=>card.suit===suit&&card.rank===11);
    if(!king||!horse)return [];
    if(suit===game.trumpSuit&&!game.declaredForty[player]&&!game.declaredTwenty[player])return [{suit,value:40,ids:[king.id,horse.id]}];
    if(suit!==game.trumpSuit&&!(game.declaredTwentySuits?.[player]??[]).includes(suit))return [{suit,value:20,ids:[king.id,horse.id]}];
    return [];
  });
}

export function availableTuteSings(game,player=game?.currentPlayer){return Object.freeze(singable(game,player).map((item)=>Object.freeze(item)));}

export function declareTute(game,player,suit){
  const options=singable(game,player);
  const declaration=options.find((item)=>item.suit===suit);
  if(!declaration)throw new RangeError('That king-horse declaration is not available.');
  const declarationPoints=[...game.declarationPoints],declaredTwenty=[...game.declaredTwenty],declaredTwentySuits=(game.declaredTwentySuits??game.hands.map(()=>[])).map((items)=>[...items]),declaredForty=[...game.declaredForty];
  declarationPoints[player]+=declaration.value;
  if(declaration.value===40)declaredForty[player]=true;else{declaredTwenty[player]=true;declaredTwentySuits[player].push(suit);}
  return Object.freeze({...game,phase:'playing',currentPlayer:player,singAvailableFor:null,declarationPoints:Object.freeze(declarationPoints),declaredTwenty:Object.freeze(declaredTwenty),declaredTwentySuits:Object.freeze(declaredTwentySuits.map((items)=>Object.freeze(items))),declaredForty:Object.freeze(declaredForty)});
}

export function skipTuteSinging(game,player){
  if(!game||game.phase!=='singing'||game.singAvailableFor!==player)throw new RangeError('There is no singing decision for this player.');
  return Object.freeze({...game,phase:'playing',singAvailableFor:null,currentPlayer:player});
}

export function declareTuteFour(game,player,kind){
  if(!game||game.phase!=='singing'||!game.allowTute||game.singAvailableFor!==player||!['kings','horses'].includes(kind))throw new RangeError('A Tute declaration is not available.');
  const rank=kind==='kings'?12:11;
  if(!TUTE_SUITS.every((suit)=>game.hands[player].some((card)=>card.suit===suit&&card.rank===rank)))throw new RangeError('A Tute requires all four Kings or all four Horses in hand.');
  const winners=game.mode==='pairs'?Array.from({length:4},(_,seat)=>seat%2===player%2):[player];
  return Object.freeze({...game,phase:'complete',winner:Object.freeze(winners),tute:kind});
}

export function playTuteCard(game,player,cardId){
  const legal=legalTuteCards(game,player);
  const card=game?.hands?.[player]?.find(({id})=>id===cardId);
  if(!card||!legal.some(({id})=>id===cardId))throw new RangeError('That card is not legal for this trick.');
  const hands=game.hands.map((hand,seat)=>Object.freeze(seat===player?hand.filter(({id})=>id!==cardId):[...hand]));
  const trick=[...game.trick,Object.freeze({player,card})];
  if(trick.length<(game.mode==='pairs'?4:2))return Object.freeze({...game,hands:Object.freeze(hands),trick:Object.freeze(trick),currentPlayer:(player+1)%hands.length});
  const won=currentWinner(trick,game.trumpSuit);
  const trickPoints=[...game.trickPoints];
  const score=trick.reduce((sum,play)=>sum+play.card.points,0);
  trickPoints[won.player]+=score;
  let stock=[...game.stock];
  if(game.mode==='individual'&&stock.length){
    for(const seat of [won.player,(won.player+1)%2])if(stock.length)hands[seat]=Object.freeze([...hands[seat],stock.shift()]);
  }
  const last=game.trickNumber===game.totalTricks;
  if(last)trickPoints[won.player]+=10;
  const completed=game.mode==='pairs'?game.trickNumber===game.totalTricks:game.trickNumber===game.totalTricks;
  if(completed){
    const totals=trickPoints.map((value,seat)=>value+game.declarationPoints[seat]);
    if(game.mode==='pairs'){
      const teams=[totals[0]+totals[2],totals[1]+totals[3]];
      const winningTeam=teams[0]===teams[1]?won.player%2:teams[0]>teams[1]?0:1;
      return Object.freeze({...game,phase:'complete',hands:Object.freeze(hands),stock:Object.freeze(stock),trick:Object.freeze([]),trickPoints:Object.freeze(trickPoints),lastTrickWinner:won.player,winner:Object.freeze(winningTeam===0?[0,2]:[1,3]),draw:false});
    }
    const winningPlayer=totals[0]===totals[1]?won.player:totals[0]>totals[1]?0:1;
    return Object.freeze({...game,phase:'complete',hands:Object.freeze(hands),stock:Object.freeze(stock),trick:Object.freeze([]),trickPoints:Object.freeze(trickPoints),lastTrickWinner:won.player,winner:Object.freeze([winningPlayer]),draw:false,totals:Object.freeze(totals)});
  }
  const next=Object.freeze({...game,phase:'playing',hands:Object.freeze(hands.map((hand)=>Object.freeze([...hand]))),stock:Object.freeze(stock),trick:Object.freeze([]),trickPoints:Object.freeze(trickPoints),currentPlayer:won.player,trickNumber:game.trickNumber+1,lastTrickWinner:won.player,singAvailableFor:won.player});
  if(availableTuteSings({...next,phase:'singing'},won.player).length||game.allowTute&&[11,12].some((rank)=>TUTE_SUITS.every((suit)=>next.hands[won.player].some((item)=>item.suit===suit&&item.rank===rank))))return Object.freeze({...next,phase:'singing'});
  return next;
}

export function chooseTuteBotCard(game){
  const legal=legalTuteCards(game);
  if(!legal.length)return null;
  if(!game.trick.length)return [...legal].sort((a,b)=>a.points-b.points||strength(a)-strength(b))[0];
  const leadSuit=game.trick[0].card.suit;
  const trumps=game.trick.filter(({card})=>card.suit===game.trumpSuit);
  const winner=currentWinner(game.trick,game.trumpSuit);
  const canWin=legal.some((card)=>(card.suit===game.trumpSuit&&winner.card.suit!==game.trumpSuit)||(card.suit===winner.card.suit&&strength(card)>strength(winner.card)));
  return [...legal].sort((a,b)=>canWin?(a.points-b.points||strength(a)-strength(b)):(a.points-b.points||strength(a)-strength(b)))[0];
}

export function chooseTuteBotSinging(game,player=game?.currentPlayer){
  const tute=game?.allowTute&&['kings','horses'].find((kind)=>TUTE_SUITS.every((suit)=>game.hands[player]?.some((card)=>card.suit===suit&&card.rank===(kind==='kings'?12:11))));
  if(tute)return declareTuteFour(game,player,tute);
  const declaration=availableTuteSings(game,player).sort((a,b)=>b.value-a.value)[0];
  return declaration?declareTute(game,player,declaration.suit):skipTuteSinging(game,player);
}

export function tuteCardPoints(rank){if(!(rank in points))throw new RangeError('Unknown Tute rank.');return points[rank];}
