import test from 'node:test';
import assert from 'node:assert/strict';
import { TUTE_SUITS, availableTuteSings, chooseTuteBotCard, chooseTuteBotSinging, createTuteDeck, createTuteGame, declareTute, declareTuteFour, legalTuteCards, playTuteCard, skipTuteSinging, tuteCardPoints } from './logic.mjs';

const random=()=>0.23;

test('uses a 40-card Spanish deck with standard card points',()=>{
  const deck=createTuteDeck();
  assert.equal(deck.length,40);
  assert.equal(new Set(deck.map((card)=>card.id)).size,40);
  assert.equal(deck.reduce((sum,card)=>sum+card.points,0),120);
  assert.deepEqual([1,3,12,11,10,7].map(tuteCardPoints),[11,10,4,3,2,0]);
});

test('deals four-player pairs or individual two-player stock profile',()=>{
  const pairs=createTuteGame({mode:'pairs',random});
  assert.deepEqual(pairs.hands.map((hand)=>hand.length),[10,10,10,10]);
  assert.equal(pairs.stock.length,0);
  assert.ok(pairs.hands[3].some((card)=>card.id===pairs.trumpCard.id));
  const individual=createTuteGame({mode:'individual',random});
  assert.deepEqual(individual.hands.map((hand)=>hand.length),[10,10]);
  assert.equal(individual.stock.length,20);
  assert.equal(individual.stock.at(-1).id,individual.trumpCard.id);
});

test('individual play is free while stock remains; strict Tute obligations apply after it empties',()=>{
  const cards=[{id:'cups-7',suit:'cups',rank:7},{id:'cups-3',suit:'cups',rank:3},{id:'cups-5',suit:'cups',rank:5},{id:'coins-1',suit:'coins',rank:1}];
  const base={mode:'individual',phase:'playing',currentPlayer:1,trumpSuit:'swords',hands:[[],cards.slice(1)],trick:[{player:0,card:cards[0]}],stock:[],trickPoints:[0,0],declarationPoints:[0,0],declaredTwenty:[false,false],declaredForty:[false,false],totalTricks:20,trickNumber:1};
  assert.deepEqual(legalTuteCards(base,1).map((card)=>card.id),['cups-3']);
  const free={...base,stock:[{id:'clubs-2',suit:'clubs',rank:2}]};
  assert.equal(legalTuteCards(free,1).length,3);
});

test('must trump when void before trumps appear, and must beat a trump when possible',()=>{
  const hand=[{id:'s-2',suit:'swords',rank:2},{id:'s-3',suit:'swords',rank:3},{id:'coins-1',suit:'coins',rank:1}];
  const game={mode:'pairs',phase:'playing',currentPlayer:1,trumpSuit:'swords',hands:[[],hand],trick:[{player:0,card:{id:'cups-7',suit:'cups',rank:7}}],stock:[]};
  assert.deepEqual(legalTuteCards(game,1).map((card)=>card.id),['s-2','s-3']);
  const trumpPlayed={...game,trick:[...game.trick,{player:2,card:{id:'s-2-top',suit:'swords',rank:2}}]};
  assert.deepEqual(legalTuteCards(trumpPlayed,1).map((card)=>card.id),['s-3']);
});

test('singing awards twenty or forty after a won trick and tute can end the hand',()=>{
  const kings=[12,12,12,12].map((rank,index)=>({id:`${TUTE_SUITS[index]}-${rank}`,suit:TUTE_SUITS[index],rank}));
  const horses=[11,11,11,11].map((rank,index)=>({id:`${TUTE_SUITS[index]}-${rank}`,suit:TUTE_SUITS[index],rank}));
  const game={mode:'pairs',phase:'singing',currentPlayer:0,singAvailableFor:0,trumpSuit:'coins',hands:[[{id:'coins-12',suit:'coins',rank:12},{id:'coins-11',suit:'coins',rank:11},{id:'cups-12',suit:'cups',rank:12},{id:'cups-11',suit:'cups',rank:11}],[],[],[]],declarationPoints:[0,0,0,0],declaredTwenty:[false,false,false,false],declaredForty:[false,false,false,false],allowTute:true};
  assert.deepEqual(availableTuteSings(game,0).map((sing)=>sing.value),[40,20]);
  const sung=declareTute(game,0,'coins');
  assert.equal(sung.declarationPoints[0],40);
  const nextSinging={...sung,phase:'singing',singAvailableFor:0};
  assert.deepEqual(availableTuteSings(nextSinging,0).map((sing)=>sing.value),[20]);
  const twentyFirst=declareTute(nextSinging,0,'cups');
  assert.equal(twentyFirst.declarationPoints[0],60);
  assert.equal(availableTuteSings(twentyFirst,0).length,0);
  assert.equal(skipTuteSinging(game,0).phase,'playing');
  assert.equal(declareTuteFour({...game,hands:[kings,[],[],[]]},0,'kings').phase,'complete');
  assert.equal(declareTuteFour({...game,hands:[horses,[],[],[]]},0,'horses').phase,'complete');
});

test('plays full partnership and individual hands and applies last-trick scoring',()=>{
  for(const mode of ['pairs','individual']){
    let game=createTuteGame({mode,random});
    let guard=0;
    while(game.phase!=='complete'&&guard++<100){
      if(game.phase==='singing'){game=chooseTuteBotSinging(game,game.currentPlayer);continue;}
      const card=chooseTuteBotCard(game);
      assert.ok(legalTuteCards(game).some((item)=>item.id===card.id));
      game=playTuteCard(game,game.currentPlayer,card.id);
    }
    assert.equal(game.phase,'complete');
    assert.equal(game.lastTrickWinner!==null,true);
    const total=game.trickPoints.reduce((a,b)=>a+b,0);
    assert.ok(total>=130);
    assert.ok(Array.isArray(game.winner));
  }
});
