import { APY_OPTIONS, getApyContribution } from './logic.mjs';

const root=document.querySelector('[data-tool="india-apy-calculator"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const result=root.querySelector('[data-result]');const content=root.querySelector('[data-result-content]');const status=root.querySelector('[data-status]');
  const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}');const {fields:f,messages:m}=copy;
  const references=[['https://www.pfrda.org.in/schemes/atal-pension-yojana-apy',f.officialScheme],['https://jansuraksha.gov.in/Files/APY/ENGLISH/APY.pdf',f.officialContributionChart]];
  function display(event){
    event.preventDefault();const age=Number(form.elements.entryAge.value);const pension=Number(form.elements.pension.value);const frequency=form.elements.frequency.value;
    try{
      const estimate=getApyContribution(age,pension,frequency);const money=new Intl.NumberFormat(copy.copyLanguage||'en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
      const card=document.createElement('dl');card.className='pending-apy-results';
      const rows=[[f.entryAge,`${estimate.entryAge}`],[f.pensionTarget,money.format(estimate.pension)],[f.contribution,`${money.format(estimate.contribution)} · ${f[estimate.frequency]}`],[f.vestingYears,`${estimate.vestingYears} ${f.years}`],[f.paymentCount,`${estimate.paymentCount}`],[f.nominalTotal,money.format(estimate.nominalContributions)]];
      for(const [label,value] of rows){const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=value;card.append(dt,dd);}
      const note=document.createElement('p');note.className='hint';note.textContent=f.resultCaveat;
      const links=document.createElement('ul');links.className='pending-apy-sources';
      for(const [url,label] of references){const li=document.createElement('li');const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label;li.append(a);links.append(li);}
      content.replaceChildren(card,note,links);result.hidden=false;status.textContent=m.complete;status.classList.remove('status--error');
    }catch{status.textContent=m.invalid;status.classList.add('status--error');}
  }
  form.addEventListener('submit',display);
  form.addEventListener('reset',()=>queueMicrotask(()=>{content.replaceChildren();result.hidden=true;status.textContent='';status.classList.remove('status--error');}));
  const freshness=form.querySelector('[data-tool-note]');if(freshness)freshness.textContent+=` ${f.tableChecked}: ${APY_OPTIONS.tableVerified}.`;
}
