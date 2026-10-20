const RANKS=Object.freeze(['A','2','3','4','5','6','7','8','9','10','J','Q','K']);
const SUITS=Object.freeze(['♠','♥','♦','♣']);

export function baccaratCardValue(rank){
  if(rank==='A')return 1;
  if(['10','J','Q','K'].includes(rank))return 0;
  const value=Number(rank);if(Number.isInteger(value)&&value>=2&&value<=9)return value;
  throw new RangeError('Unknown card rank.');
}

export function baccaratTotal(cards){return cards.reduce((sum,card)=>sum+baccaratCardValue(card.rank),0)%10;}

export function shouldBankerDraw(bankTotal,playerDrew,playerThirdValue=null){
  if(!Number.isInteger(bankTotal)||bankTotal<0||bankTotal>9)throw new RangeError('Bank total must be 0–9.');
  if(!playerDrew)return bankTotal<=5;
  if(!Number.isInteger(playerThirdValue)||playerThirdValue<0||playerThirdValue>9)throw new RangeError('The player third-card value must be 0–9.');
  if(bankTotal<=2)return true;
  if(bankTotal===3)return playerThirdValue!==8;
  if(bankTotal===4)return playerThirdValue>=2&&playerThirdValue<=7;
  if(bankTotal===5)return playerThirdValue>=4&&playerThirdValue<=7;
  if(bankTotal===6)return playerThirdValue===6||playerThirdValue===7;
  return false;
}

export function createBaccaratShoe(random=Math.random){
  if(typeof random!=='function')throw new TypeError('A random source is required.');
  const cards=[];for(let deck=0;deck<8;deck++)for(const suit of SUITS)for(const rank of RANKS)cards.push(Object.freeze({rank,suit}));
  for(let index=cards.length-1;index>0;index--){const value=random();if(!Number.isFinite(value)||value<0||value>=1)throw new RangeError('Random values must be from 0 up to 1.');const swap=Math.floor(value*(index+1));[cards[index],cards[swap]]=[cards[swap],cards[index]];}
  return cards;
}

export function dealBaccaratHand({random=Math.random}={}){
  const shoe=createBaccaratShoe(random);let cursor=0;
  const draw=()=>{const card=shoe[cursor++];if(!card)throw new RangeError('The shoe has no cards left.');return card;};
  const player=[draw()];const banker=[draw()];player.push(draw());banker.push(draw());
  let playerTotal=baccaratTotal(player);let bankerTotal=baccaratTotal(banker);let natural=playerTotal>=8||bankerTotal>=8;
  let playerThird=null;let bankerThird=null;
  if(!natural){
    if(playerTotal<=5){playerThird=draw();player.push(playerThird);playerTotal=baccaratTotal(player);}
    if(shouldBankerDraw(bankerTotal,playerThird!==null,playerThird?baccaratCardValue(playerThird.rank):null)){bankerThird=draw();banker.push(bankerThird);bankerTotal=baccaratTotal(banker);}
  }
  const winner=playerTotal>bankerTotal?'player':bankerTotal>playerTotal?'banker':'tie';
  return Object.freeze({player:Object.freeze(player),banker:Object.freeze(banker),playerTotal,bankerTotal,playerThird,bankerThird,natural,winner,cardsDealt:cursor});
}

export function scoreBaccaratPrediction(prediction,winner){
  if(!['player','banker','tie'].includes(prediction)||!['player','banker','tie'].includes(winner))throw new RangeError('Choose player, banker, or tie.');
  return prediction===winner;
}

export function settleBaccaratPractice(balance,stake,prediction,winner){
  if(!Number.isInteger(balance)||balance<0||!Number.isInteger(stake)||stake<1||stake>100||stake>balance)throw new RangeError('Choose a valid practice-chip amount within the current balance.');
  const correct=scoreBaccaratPrediction(prediction,winner);const pushed=winner==='tie'&&prediction!=='tie';const change=correct?stake:pushed?0:-stake;
  return Object.freeze({balance:balance+change,change,correct,pushed});
}
