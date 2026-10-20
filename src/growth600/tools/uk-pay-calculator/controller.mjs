import { estimateUkTakeHome } from './logic.mjs';
const root = document.querySelector('[data-tool="uk-pay-calculator"]');
if (root) {
 const form=root.querySelector('[data-pending-form]'), result=root.querySelector('[data-result]'), content=root.querySelector('[data-result-content]'), status=root.querySelector('[data-status]');
 const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}'), f=copy.fields, locale=copy.copyLanguage?.replaceAll('_','-')??undefined;
 const clear=()=>{result.hidden=true;content.replaceChildren();status.textContent='';status.classList.remove('status--error');};
 form.addEventListener('input',clear);form.addEventListener('reset',()=>queueMicrotask(clear));
 form.addEventListener('submit',(event)=>{event.preventDefault();clear();try{
  const data=estimateUkTakeHome({annualSalary:form.elements.namedItem('annualSalary').value,territory:form.elements.namedItem('territory').value,pensionPercent:form.elements.namedItem('pensionPercent').value});
  const money=new Intl.NumberFormat(locale,{style:'currency',currency:'GBP',maximumFractionDigits:2});const table=document.createElement('table');table.className='pending-table';const body=document.createElement('tbody');
  for(const [key,value] of [['annualSalary',data.annualSalary],['personalAllowance',data.personalAllowance],['pension',data.pension],['incomeTax',data.incomeTax],['nationalInsurance',data.nationalInsurance],['annualTakeHome',data.annualTakeHome],['monthlyTakeHome',data.monthlyTakeHome],['weeklyTakeHome',data.weeklyTakeHome]]){const tr=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');th.scope='row';th.textContent=f[key];td.textContent=money.format(value);tr.append(th,td);body.append(tr);}table.append(body);content.append(table);
  const refs=document.createElement('nav');refs.className='uk-pay-references';refs.setAttribute('aria-label',f.officialSources);for(const [label,url] of [[f.hmrcIncomeTax,'https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past'],[f.hmrcNationalInsurance,'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027'],[f.pensionRules,'https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay']]){const a=document.createElement('a');a.textContent=label;a.href=url;a.target='_blank';a.rel='noopener noreferrer';refs.append(a);}content.append(refs);
  status.textContent=copy.messages.calculationNote;result.hidden=false;
 }catch{status.textContent=copy.messages.error;status.classList.add('status--error');result.hidden=false;}});
}
