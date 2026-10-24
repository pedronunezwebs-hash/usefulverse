export const BRAZIL_INSS_2026 = Object.freeze({ start: '2026-01-01', end: '2026-12-31', minimum: 1621, ceiling: 8475.55, fixed: Object.freeze({ simplified: 178.31, lowIncome: 81.05, mei: 81.05 }), bands: Object.freeze([[0,1621,0.075],[1621,2902.84,0.09],[2902.84,4354.27,0.12],[4354.27,8475.55,0.14]]) });
const roundMoney=(value)=>Math.round((value+Number.EPSILON)*100)/100;
export function hasCurrentBrazilINSSRates(now=new Date()){return now instanceof Date&&Number(new Intl.DateTimeFormat('en',{timeZone:'America/Sao_Paulo',year:'numeric'}).format(now))===2026;}
export function calculateBrazilINSS({ category, salary, now = new Date() } = {}) {
  if(!hasCurrentBrazilINSSRates(now))throw Object.assign(new RangeError('Current official rates are only loaded for 2026.'),{code:'rates-not-current'});
  const types=['employee','individual-normal','individual-simplified','facultative-low-income','mei'];
  if(!types.includes(category))throw Object.assign(new RangeError('Choose a contribution category.'),{code:'invalid-category'});
  let base=Number(salary);if(!Number.isFinite(base)||base<0||base>100_000_000||Math.abs(base*100-Math.round(base*100))>1e-7)throw Object.assign(new RangeError('Enter a valid monthly contribution base.'),{code:'invalid-salary'});
  if(category==='employee'){
    const capped=Math.min(base,BRAZIL_INSS_2026.ceiling);let unroundedAmount=0;const rows=[];
    for(const[lower,upper,rate]of BRAZIL_INSS_2026.bands){const portion=Math.max(0,Math.min(capped,upper)-lower);if(portion>0){const contribution=roundMoney(portion*rate);unroundedAmount+=portion*rate;rows.push(Object.freeze({lower,upper:Math.min(upper,capped),rate,portion,contribution}));}}
    const amount=roundMoney(unroundedAmount);return Object.freeze({category,base:roundMoney(base),cappedBase:roundMoney(capped),amount,effectiveRate:base?amount/base*100:0,rows:Object.freeze(rows),fixed:false});
  }
  if(category==='individual-normal'){
    if(base<BRAZIL_INSS_2026.minimum||base>BRAZIL_INSS_2026.ceiling)throw Object.assign(new RangeError('The contribution base must be within the 2026 minimum and ceiling.'),{code:'salary-range'});
    return Object.freeze({category,base:roundMoney(base),cappedBase:roundMoney(base),amount:roundMoney(base*0.2),effectiveRate:20,rows:Object.freeze([]),fixed:false});
  }
  const amount=BRAZIL_INSS_2026.fixed[category==='individual-simplified'?'simplified':category==='facultative-low-income'?'lowIncome':'mei'];
  return Object.freeze({category,base:BRAZIL_INSS_2026.minimum,cappedBase:BRAZIL_INSS_2026.minimum,amount,effectiveRate:amount/BRAZIL_INSS_2026.minimum*100,rows:Object.freeze([]),fixed:true});
}
