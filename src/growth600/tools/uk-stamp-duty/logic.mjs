const GBP=Object.freeze({
  england:[{upper:125000,rate:0},{upper:250000,rate:2},{upper:925000,rate:5},{upper:1500000,rate:10},{upper:Infinity,rate:12}],
  englandFirstTime:[{upper:300000,rate:0},{upper:500000,rate:5}],
  scotland:[{upper:145000,rate:0},{upper:250000,rate:2},{upper:325000,rate:5},{upper:750000,rate:10},{upper:Infinity,rate:12}],
  scotlandFirstTime:[{upper:175000,rate:0},{upper:250000,rate:2},{upper:325000,rate:5},{upper:750000,rate:10},{upper:Infinity,rate:12}],
  walesMain:[{upper:225000,rate:0},{upper:400000,rate:6},{upper:750000,rate:7.5},{upper:1500000,rate:10},{upper:Infinity,rate:12}],
  walesHigher:[{upper:180000,rate:5},{upper:250000,rate:8.5},{upper:400000,rate:10},{upper:750000,rate:12.5},{upper:1500000,rate:15},{upper:Infinity,rate:17}],
});
export const UK_PROPERTY_TAX_SOURCES=Object.freeze({england:'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates',scotland:'https://www.gov.scot/publications/scottish-budget-2026-2027-scottish-tax-ready-reckoners/pages/4/',wales:'https://www.gov.wales/land-transaction-tax-rates-and-bands'});
export const UK_PROPERTY_TAX_MAINTENANCE=Object.freeze({effectiveFrom:'2026-04-01',checkedAt:'2026-10-19',reviewDue:'2026-11-19',sources:Object.freeze(Object.values(UK_PROPERTY_TAX_SOURCES))});
function marginalTax(price,bands){let lower=0;let total=0;const breakdown=[];for(const band of bands){if(price<=lower)break;const taxable=Math.min(price,band.upper)-lower;const tax=taxable*band.rate/100;total+=tax;breakdown.push(Object.freeze({from:lower,to:Math.min(price,band.upper),rate:band.rate,tax}));lower=band.upper;if(price<=band.upper)break;}return{total,breakdown};}
export function estimateUKPurchaseTax({price,region='england',firstTime=false,additionalProperty=false,nonResident=false,asOf=new Date().toISOString().slice(0,10)}={}){
  if(!/^\d{4}-\d{2}-\d{2}$/u.test(String(asOf))||new Date(`${asOf}T00:00:00.000Z`).toISOString().slice(0,10)!==asOf)throw new RangeError('Choose a valid as-of date.');
  if(asOf<UK_PROPERTY_TAX_MAINTENANCE.effectiveFrom){const error=new RangeError('These UK property tax rules are not effective for the selected date.');error.code='rules-not-effective';throw error;}
  if(asOf>UK_PROPERTY_TAX_MAINTENANCE.reviewDue){const error=new RangeError('These property tax bands need a fresh official-source review.');error.code='rules-expired';throw error;}
  const amount=Number(price);if(!Number.isFinite(amount)||amount<0||amount>1000000000)throw new RangeError('Enter a non-negative UK residential purchase price.');
  if(!['england','northern-ireland','scotland','wales'].includes(region))throw new RangeError('Choose England, Northern Ireland, Scotland, or Wales.');
  if(typeof firstTime!=='boolean'||typeof additionalProperty!=='boolean'||typeof nonResident!=='boolean')throw new TypeError('Choose explicit buyer and residence options.');
  if(nonResident&&!['england','northern-ireland'].includes(region))throw new RangeError('The non-UK residence surcharge applies only to England and Northern Ireland.');
  if(firstTime&&region==='wales')throw new RangeError('This calculator does not apply a Welsh first-time buyer relief.');
  if(firstTime&&additionalProperty)throw new RangeError('First-time buyer relief cannot be combined with the additional-property selection.');
  const territory=region==='northern-ireland'?'england':region;let bands;let additionalCharge=0;let note='';let noteKey='';
  if(territory==='england'&&firstTime){if(amount>500000){bands=GBP.england;note='Price exceeds the £500,000 first-time buyer relief limit; standard residential bands used.';noteKey='ftbLimitNote';}else{bands=GBP.englandFirstTime;}}
  else if(territory==='scotland'){bands=firstTime?GBP.scotlandFirstTime:GBP.scotland;if(additionalProperty&&amount>=40000)additionalCharge=amount*0.08;}
  else if(territory==='wales'){bands=additionalProperty&&amount>=40000?GBP.walesHigher:GBP.walesMain;}
  else {bands=GBP.england;if(additionalProperty&&amount>=40000)additionalCharge+=amount*0.05;if(nonResident&&amount>=40000)additionalCharge+=amount*0.02;}
  if(additionalProperty&&amount<40000){note='The selected additional-property supplement threshold is £40,000; no supplement is applied below that price.';noteKey='additionalThresholdNote';}
  const calculation=marginalTax(amount,bands);const total=calculation.total+additionalCharge;
  return Object.freeze({region,territory,price:amount,tax:Math.round(total*100)/100,mainTax:Math.round(calculation.total*100)/100,additionalCharge:Math.round(additionalCharge*100)/100,effectiveRate:amount?total/amount*100:0,breakdown:calculation.breakdown,sourceUrl:UK_PROPERTY_TAX_SOURCES[territory],checkedDate:UK_PROPERTY_TAX_MAINTENANCE.checkedAt,additionalProperty,firstTimeApplied:firstTime&&((territory==='scotland')||(territory==='england'&&amount<=500000)),nonResidentApplied:nonResident&&territory==='england',note,noteKey});
}
