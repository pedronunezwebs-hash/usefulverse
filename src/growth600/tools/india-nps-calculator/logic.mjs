export const INDIA_NPS_MAINTENANCE=Object.freeze({effectiveFrom:'2026-07-20',checkedAt:'2026-10-19',reviewDue:'2026-11-19',sourceUrl:'https://www.pfrda.org.in/schemes/national-pension-system/nps-for-all-citizen-models'});
export const NPS_RULES_EFFECTIVE=INDIA_NPS_MAINTENANCE.effectiveFrom;
export function projectIndiaNps({startingCorpus=0,monthlyContribution,years,annualReturnPercent,annualAnnuityRatePercent,exitType='normal',smallBalanceOption=false,asOf=new Date().toISOString().slice(0,10)}){
 if(!/^\d{4}-\d{2}-\d{2}$/u.test(String(asOf))||new Date(`${asOf}T00:00:00.000Z`).toISOString().slice(0,10)!==asOf)throw new RangeError('Choose a valid estimate date.');
 if(asOf<INDIA_NPS_MAINTENANCE.effectiveFrom){const error=Object.assign(new RangeError('These NPS exit rules are not effective for the selected date.'),{code:'rules-not-effective'});throw error;}
 if(asOf>INDIA_NPS_MAINTENANCE.reviewDue){const error=Object.assign(new RangeError('These NPS exit rules need a fresh official-source review.'),{code:'rules-expired'});throw error;}
 const start=Number(startingCorpus),monthly=Number(monthlyContribution),duration=Number(years),returns=Number(annualReturnPercent),annuityRate=Number(annualAnnuityRatePercent);
 if(![start,monthly,duration,returns,annuityRate].every(Number.isFinite)||start<0||start>1e12||monthly<0||monthly>1e9||duration<1||duration>80||!Number.isInteger(duration)||returns< -100||returns>100||annuityRate<0||annuityRate>20||!['normal','premature'].includes(exitType))throw new RangeError('Check the contribution, duration and scenario assumptions.');
 const months=duration*12,rate=returns/1200,growth=Math.pow(1+rate,months),contributionGrowth=rate===0?months:(growth-1)/rate;
 const corpus=start*growth+monthly*contributionGrowth;if(!Number.isFinite(corpus))throw new RangeError('Projection is outside the supported numeric range.');
 let lumpPercent,annuityPercent,exception='standard';
 if(exitType==='normal'&&smallBalanceOption&&corpus<=800000){lumpPercent=100;annuityPercent=0;exception='normal-small-balance';}
 else if(exitType==='premature'&&corpus<=500000){lumpPercent=100;annuityPercent=0;exception='premature-small-balance';}
 else if(exitType==='premature'){lumpPercent=20;annuityPercent=80;}
 else{lumpPercent=80;annuityPercent=20;}
 const lumpSum=corpus*lumpPercent/100,annuitized=corpus*annuityPercent/100,estimatedMonthlyPension=annuitized*annuityRate/1200;
 return Object.freeze({rulesEffective:NPS_RULES_EFFECTIVE,checkedAt:INDIA_NPS_MAINTENANCE.checkedAt,reviewDue:INDIA_NPS_MAINTENANCE.reviewDue,sourceUrl:INDIA_NPS_MAINTENANCE.sourceUrl,startingCorpus:start,monthlyContribution:monthly,years:duration,annualReturnPercent:returns,totalContributions:start+monthly*months,projectedCorpus:corpus,exitType,exception,lumpPercent,annuityPercent,lumpSum,annuitized,annualAnnuityRatePercent:annuityRate,estimatedMonthlyPension});
}
