function chance(random){const value=random();if(!Number.isFinite(value)||value<0||value>=1)throw new RangeError('Random values must be from 0 up to 1.');return value;}
function countPitch(game,isStrike){let balls=game.balls;let strikes=game.strikes;let outcome;
  if(isStrike){if(strikes===2)outcome='strikeout';else{strikes+=1;outcome='strike';}}
  else if(balls===3)outcome='walk';else{balls+=1;outcome='ball';}
  return {...game,balls:outcome==='walk'?0:balls,strikes:outcome==='walk'?0:strikes,outcome};
}
function resolvePitchCount(game,isStrike){const next=countPitch(game,isStrike);if(next.outcome==='walk')return walk(next);if(next.outcome==='strikeout')return finishOut(next,'strikeout');return next;}
function walk(game){const bases=[...game.bases];let runs=0;if(bases[0]){if(bases[1]){if(bases[2])runs+=1;bases[2]=true;}bases[1]=true;}bases[0]=true;return{...game,bases,score:{...game.score,[game.half==='top'?'visitors':'home']:game.score[game.half==='top'?'visitors':'home']+runs},balls:0,strikes:0,outcome:runs?`walk-runs-${runs}`:'walk'};}
function hit(game,kind){const bases=[...game.bases];const side=game.half==='top'?'visitors':'home';let runs=0;const advance=(distance)=>{for(let i=2;i>=0;i--)if(bases[i]){const to=i+distance;if(to>2)runs+=1;else bases[to]=true;bases[i]=false;}};
  const distance={single:1,double:2,triple:3,homeRun:4}[kind];advance(distance);if(distance<=3)bases[distance-1]=true;else runs+=1;
  return{...game,bases,score:{...game.score,[side]:game.score[side]+runs},balls:0,strikes:0,outcome:runs?`${kind}-runs-${runs}`:kind};
}
function finishOut(game,kind='out'){const outs=game.outs+1;const next={...game,outs,balls:0,strikes:0,outcome:kind};if(outs>=3){next.outs=0;next.bases=[false,false,false];if(next.half==='top'){if(next.inning>=3&&next.score.home>next.score.visitors)next.complete=true;else next.half='bottom';}else if(next.inning>=3)next.complete=true;else{next.inning+=1;next.half='top';}}return next;}
function resultOnContact(game,random){const r=chance(random);if(r<0.08)return resolvePitchCount(game,true);if(r<0.22)return{...game,balls:0,strikes:game.strikes===2?2:game.strikes+1,outcome:'foul'};if(r<0.40)return finishOut(game);if(r<0.79)return hit(game,'single');if(r<0.91)return hit(game,'double');if(r<0.94)return hit(game,'triple');return hit(game,'homeRun');}
function processPitch(game,pitch,action,random){const strikeChance=pitch==='fastball'?0.65:0.57;const isStrike=chance(random)<strikeChance;
  if(action==='take')return resolvePitchCount(game,isStrike);
  const contactChance=pitch==='fastball'?0.73:0.66;if(chance(random)>=contactChance)return resolvePitchCount(game,true);
  return resultOnContact(game,random);
}
export function createBaseballGame(random=Math.random){if(typeof random!=='function')throw new TypeError('A random source is required.');return Object.freeze({inning:1,half:'top',outs:0,balls:0,strikes:0,bases:Object.freeze([false,false,false]),score:Object.freeze({visitors:0,home:0}),complete:false,outcome:'game-started',random});}
export function playBaseballTurn(game,action){
  if(!game||game.complete||!['fastball','changeup','swing','take'].includes(action))throw new RangeError('Choose an available action in an active game.');const random=game.random;
  if(game.half==='top'){
    if(!['fastball','changeup'].includes(action))throw new RangeError('Choose a pitch while defending.');const cpuAction=chance(random)<(game.strikes===2?0.72:game.balls===3?0.82:0.64)?'swing':'take';const pitchResult=processPitch(game,action,cpuAction,random);return Object.freeze({...pitchResult,bases:Object.freeze([...pitchResult.bases]),score:Object.freeze({...pitchResult.score}),lastAction:`${action}-${cpuAction}`});
  }
  if(!['swing','take'].includes(action))throw new RangeError('Choose swing or take while batting.');const pitch=chance(random)<0.62?'fastball':'changeup';const pitchResult=processPitch(game,pitch,action,random);return Object.freeze({...pitchResult,bases:Object.freeze([...pitchResult.bases]),score:Object.freeze({...pitchResult.score}),lastAction:`${action}-${pitch}`});
}
