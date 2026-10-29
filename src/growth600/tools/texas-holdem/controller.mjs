import { actHoldem, continueHoldemHand, createHoldemHand, evaluatePokerHand } from './logic.mjs';

const root=document.querySelector('[data-tool="texas-holdem"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const result=root.querySelector('[data-result]');const content=root.querySelector('[data-result-content]');const status=root.querySelector('[data-status]');const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}');
  const action=form.querySelector('[data-input="action"]');let hand=null;
  const node=(tag,text,className)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=String(text);if(className)el.className=className;return el;};
  const cardText=(cards)=>cards.map((c)=>`${c.rank}${c.suit}`).join('  ');
  const render=()=>{content.replaceChildren();if(!hand)return;const table=node('section',undefined,'holdem-table');table.append(node('p',`${copy.fields.stage}: ${copy.fields[hand.stage]||hand.stage} · ${copy.fields.pot}: ${hand.pot} ${copy.fields.practiceChips}`));table.append(node('p',`${copy.fields.board}: ${cardText(hand.board.slice(0,hand.revealed))||'—'}`));
    for(const player of hand.seats){const row=node('article',undefined,'holdem-seat');row.append(node('h3',player.id==='you'?copy.fields.you:player.id==='bot-1'?copy.fields.botOne:copy.fields.botTwo));row.append(node('p',`${copy.fields.stack}: ${player.stack} ${copy.fields.practiceChips}`));const visible=player.id==='you'||hand.stage==='complete';if(visible)row.append(node('p',cardText(player.hole)));else row.append(node('p',copy.fields.hiddenCards));if(player.folded)row.append(node('p',copy.fields.folded));if(player.allIn)row.append(node('p',copy.fields.allIn));table.append(row);}
    if(hand.stage==='complete'){const winners=hand.result.winners.map((id)=>id==='you'?copy.fields.you:id==='bot-1'?copy.fields.botOne:copy.fields.botTwo).join(', ');table.append(node('h3',`${copy.fields.winner}: ${winners}`));table.append(node('p',`${copy.fields.hand}: ${copy.fields[hand.result.category]||hand.result.category}`));table.append(node('p',`${copy.fields.potAwarded}: ${hand.result.awarded}`));action.value='start';}
    table.append(node('p',copy.fields.noMoney));content.append(table);if(hand.stage!=='complete'){const you=hand.seats.find((s)=>s.id==='you');action.value=hand.currentBet>you.committed?'call':'check';}result.hidden=false;
  };
  form.addEventListener('submit',(event)=>{event.preventDefault();status.textContent='';status.classList.remove('status--error');try{if(!hand||hand.stage==='complete'){hand=createHoldemHand();status.textContent=copy.messages.handStarted;}else{actHoldem(hand,action.value);if(!hand.pending.includes('you'))continueHoldemHand(hand);status.textContent=hand.stage==='complete'?copy.messages.handComplete:copy.messages.yourTurn;}render();}catch{status.textContent=copy.messages.actionError;status.classList.add('status--error');result.hidden=false;}});
  form.addEventListener('reset',()=>queueMicrotask(()=>{hand=null;content.replaceChildren();result.hidden=true;status.textContent='';status.classList.remove('status--error');}));
}
