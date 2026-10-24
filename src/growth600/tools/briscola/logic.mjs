export const BRISCOLA_SUITS = Object.freeze(['coins','cups','swords','clubs']);
export const BRISCOLA_RANKS = Object.freeze([1,2,3,4,5,6,7,10,11,12]);
const POWER = Object.freeze({1:10,3:9,12:8,11:7,10:6,7:5,6:4,5:3,4:2,2:1});
const POINTS = Object.freeze({1:11,3:10,12:4,11:3,10:2});

export function createBriscolaGame({random=Math.random,opponent='computer'}={}){
  const deck=BRISCOLA_SUITS.flatMap((suit)=>BRISCOLA_RANKS.map((rank)=>({id:`${suit}-${rank}`,suit,rank,points:POINTS[rank]??0})));
  for(let i=deck.length-1;i>0;i-=1){const value=random();if(!Number.isFinite(value)||value<0||value>=1)throw new RangeError('Card shuffler must return a value from zero to below one.');const j=Math.floor(value*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
  const handOne=deck.slice(0,3);const handTwo=deck.slice(3,6);const stock=deck.slice(6);
  return {hands:{one:handOne,two:handTwo},stock,trumpSuit:stock.at(-1).suit,trumpCardId:stock.at(-1).id,turn:'one',lead:'one',trick:[],points:{one:0,two:0},tricks:{one:0,two:0},round:0,winner:null,draw:false,opponent};
}

export function briscolaTrickWinner(first,second,trumpSuit){
  if(first.suit===second.suit)return POWER[first.rank]>=POWER[second.rank]?'one':'two';
  if(second.suit===trumpSuit&&first.suit!==trumpSuit)return 'two';
  if(first.suit===trumpSuit&&second.suit!==trumpSuit)return 'one';
  return 'one';
}

export function playBriscolaCard(game,player,cardId){
  if(game.winner||game.turn!==player)return {played:false,reason:'turn'};
  const cardIndex=game.hands[player].findIndex((card)=>card.id===cardId);if(cardIndex<0)return {played:false,reason:'card'};
  const [card]=game.hands[player].splice(cardIndex,1);game.trick.push({player,card});
  if(game.trick.length===1){game.turn=player==='one'?'two':'one';return {played:true,complete:false};}
  const [first,second]=game.trick;const winner=briscolaTrickWinner(first.card,second.card,game.trumpSuit)==='one'?first.player:second.player;
  game.points[winner]+=first.card.points+second.card.points;game.tricks[winner]+=1;game.round+=1;game.lead=winner;game.turn=winner;
  const loser=winner==='one'?'two':'one';
  if(game.stock.length){game.hands[winner].push(game.stock.shift());if(game.stock.length)game.hands[loser].push(game.stock.shift());}
  game.trick=[];
  if(!game.hands.one.length&&!game.hands.two.length){game.draw=game.points.one===game.points.two;game.winner=game.draw?null:game.points.one>game.points.two?'one':'two';}
  return {played:true,complete:true,winner,roundPoints:first.card.points+second.card.points,gameOver:!game.hands.one.length&&!game.hands.two.length};
}

export function chooseBriscolaBotCard(game,player='two'){
  const hand=game.hands[player];if(!hand?.length)throw new RangeError('The selected player has no cards.');
  if(!game.trick.length)return [...hand].sort((a,b)=>(a.points-b.points)||Number(a.suit===game.trumpSuit)-Number(b.suit===game.trumpSuit)||(POWER[a.rank]-POWER[b.rank]))[0].id;
  const lead=game.trick[0];const winning=hand.filter((card)=>{
    const relative=briscolaTrickWinner(lead.card,card,game.trumpSuit);
    return (relative==='one'?lead.player:player)===player;
  });
  const choices=winning.length?winning:hand;
  return [...choices].sort((a,b)=>(a.points-b.points)||(Number(a.suit===game.trumpSuit)-Number(b.suit===game.trumpSuit))||(POWER[a.rank]-POWER[b.rank]))[0].id;
}

export function briscolaCardLabel(card){return `${card.rank} ${card.suit}`;}
