function randomDie(randomInt){const value=randomInt?randomInt(6):Math.floor(Math.random()*6);if(!Number.isInteger(value)||value<0||value>5)throw new RangeError('Random die source is invalid.');return value+1;}
export function createCrapsRound(stake,bankroll,prediction='pass'){const wager=Number(stake),chips=Number(bankroll);if(!Number.isInteger(wager)||wager<1||wager>100||!Number.isInteger(chips)||chips<0||wager>chips||!['pass','dont-pass'].includes(prediction))throw new RangeError('Choose a 1–100 chip practice stake and a valid line within the chip balance.');return Object.freeze({stake:wager,bankroll:chips-wager,point:null,prediction,status:'come-out',rolls:Object.freeze([]),netResult:null});}
export function rollCrapsRound(round,randomInt){if(!round||!['come-out','point'].includes(round.status))throw Object.assign(new RangeError('Start a new practice round before rolling.'),{code:'round-closed'});const dieOne=randomDie(randomInt),dieTwo=randomDie(randomInt),sum=dieOne+dieTwo,roll=Object.freeze({dieOne,dieTwo,sum});let status=round.status,point=round.point,netResult=null,bankroll=round.bankroll;
 let passOutcome=null;
 if(status==='come-out'){if(sum===7||sum===11)passOutcome='won';else if(sum===2||sum===3||sum===12)passOutcome='lost';else{status='point';point=sum;}}
 else if(sum===point)passOutcome='won';else if(sum===7)passOutcome='lost';
 if(passOutcome){if(round.prediction==='pass'){status=passOutcome;netResult=passOutcome==='won'?round.stake:-round.stake;if(passOutcome==='won')bankroll+=2*round.stake;}
 else if(status==='come-out'&&sum===12){status='push';netResult=0;bankroll+=round.stake;}
 else{status=passOutcome==='won'?'lost':'won';netResult=status==='won'?round.stake:-round.stake;if(status==='won')bankroll+=2*round.stake;}}
 return Object.freeze({...round,bankroll,point,status,netResult,rolls:Object.freeze([...round.rolls,roll])});}
export function standardPassLineOdds(){return Object.freeze({passWinPercent:244/495*100,passLossPercent:251/495*100,passHouseEdge:7/495*100,dontPassWinPercent:1-244/495-1/36, dontPassLossPercent:244/495*100,pushPercent:100/36,dontPassHouseEdge:(244/495-(1-244/495-1/36))*100});}
