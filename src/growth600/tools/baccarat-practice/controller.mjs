import { dealBaccaratHand, settleBaccaratPractice } from './logic.mjs';

const root=document.querySelector('[data-tool="baccarat-practice"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const result=root.querySelector('[data-result]');const content=root.querySelector('[data-result-content]');const status=root.querySelector('[data-status]');const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}');let practiceChips=1000;
  const announce=(message,error=false)=>{status.textContent=message;status.classList.toggle('status--error',error);};
  const node=(tag,text)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=String(text);return element;};
  const clear=()=>{content.replaceChildren();result.hidden=true;announce('');};
  form.addEventListener('reset',()=>queueMicrotask(()=>{practiceChips=1000;clear();}));
  form.addEventListener('submit',(event)=>{
    event.preventDefault();clear();const prediction=form.elements.namedItem('prediction')?.value;
    if(!['player','banker','tie'].includes(prediction)){announce(copy.messages.choosePrediction,true);return;}
    const stake=Number(form.elements.namedItem('stake')?.value);if(!Number.isInteger(stake)||stake<1||stake>100){announce(copy.messages.invalidStake,true);return;}if(stake>practiceChips){announce(copy.messages.insufficientChips,true);return;}
    try{
      const hand=dealBaccaratHand();const settlement=settleBaccaratPractice(practiceChips,stake,prediction,hand.winner);practiceChips=settlement.balance;
      content.append(node('p',`${copy.fields.practiceBalance}: ${practiceChips} ${copy.fields.practiceChips}`));
      const table=node('table');table.setAttribute('aria-label',copy.fields.roundTableLabel);const head=node('thead');const header=node('tr');for(const label of [copy.fields.hand,copy.fields.cards,copy.fields.total])header.append(node('th',label));head.append(header);table.append(head);
      const body=node('tbody');for(const [key,cards,total] of [['player',hand.player,hand.playerTotal],['banker',hand.banker,hand.bankerTotal]]){const row=node('tr');row.append(node('th',copy.fields[key]));row.append(node('td',cards.map(({rank,suit})=>`${rank}${suit}`).join('  ')));row.append(node('td',String(total)));body.append(row);}table.append(body);content.append(table);
      const natural=hand.natural?copy.fields.naturalNotice:'';if(natural)content.append(node('p',natural));
      const outcome=settlement.pushed?copy.messages.tiePush:settlement.correct?copy.messages.correctPrediction:copy.messages.incorrectPrediction;content.append(node('p',outcome));
      content.append(node('p',`${copy.fields.winner}: ${copy.fields[hand.winner]}. ${copy.fields.practiceChipChange}: ${settlement.change>0?'+':''}${settlement.change} ${copy.fields.practiceChips}.`));
      const rules=node('a',copy.fields.rulesSource);rules.href='https://www.dia.govt.nz/diawebsite.nsf/wpg_url/services-casino-and-non-casino-gaming-rules-of-casino-table-games';rules.target='_blank';rules.rel='noopener noreferrer';content.append(rules);
      result.hidden=false;announce(copy.messages.complete);
    }catch{announce(copy.messages.error,true);}
  });
}
