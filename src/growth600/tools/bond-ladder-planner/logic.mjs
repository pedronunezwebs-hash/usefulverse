const MAX_ROWS=30;
function error(code){throw Object.assign(new Error(code),{code});}
function dateParts(value){if(!/^\d{4}-\d{2}-\d{2}$/u.test(value??''))return null;const [y,m,d]=value.split('-').map(Number),dt=new Date(Date.UTC(y,m-1,d));return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d?{y,m,d}:null;}
function addMonths(base,offset){const absolute=base.y*12+(base.m-1)+offset,y=Math.floor(absolute/12),m=absolute%12+1,last=new Date(Date.UTC(y,m,0)).getUTCDate();return `${String(y).padStart(4,'0')}-${String(m).padStart(2,'0')}-${String(Math.min(base.d,last)).padStart(2,'0')}`;}
function printable(value,max){return value.length>0&&value.length<=max&&!/[\u0000-\u001f\u007f]/u.test(value);}
export function buildBondLadder({rows='',currency=''}={}){
 if(!printable(String(currency),12))error('invalid-currency');
 const lines=String(rows).split(/\r?\n/u).map(x=>x.trim()).filter(Boolean);
 if(!lines.length||lines.length>MAX_ROWS)error('invalid-count');
 const bonds=lines.map((line,index)=>{const p=line.split('|').map(x=>x.trim());if(p.length!==6)error('invalid-row');const [name,principalRaw,rateRaw,intervalRaw,firstRaw,maturityRaw]=p;const principal=Number(principalRaw),annualRate=Number(rateRaw),interval=Number(intervalRaw),first=dateParts(firstRaw),maturity=dateParts(maturityRaw);if(!printable(name,80))error('invalid-name');if(!Number.isFinite(principal)||principal<=0||principal>1e12)error('invalid-principal');if(!Number.isFinite(annualRate)||annualRate<0||annualRate>1000)error('invalid-rate');if(!Number.isInteger(interval)||interval<1||interval>12||12%interval!==0)error('invalid-interval');if(!first||!maturity||firstRaw>maturityRaw)error('invalid-date');return {name,principal,annualRate,interval,first:firstRaw,maturity:maturityRaw,index};});
 const payments=[];
 for(const bond of bonds){const base=dateParts(bond.first),coupon=bond.principal*(bond.annualRate/100)*(bond.interval/12);for(let n=0;n<2400;n++){const date=addMonths(base,n*bond.interval);if(date>bond.maturity)break;payments.push({date,name:bond.name,type:'coupon',amount:coupon,currency});if(payments.length>5000)error('too-many-payments');if(n===2399)error('too-many-payments');}payments.push({date:bond.maturity,name:bond.name,type:'principal',amount:bond.principal,currency});if(payments.length>5000)error('too-many-payments');}
 payments.sort((a,b)=>a.date.localeCompare(b.date)||a.name.localeCompare(b.name)||a.type.localeCompare(b.type));
 const totals=new Map();for(const p of payments){const year=p.date.slice(0,4),v=totals.get(year)??{year,coupons:0,principal:0,total:0};if(p.type==='coupon')v.coupons+=p.amount;else v.principal+=p.amount;v.total+=p.amount;totals.set(year,v);}
 const summary=Object.freeze({bondCount:bonds.length,paymentCount:payments.length,principal:bonds.reduce((s,b)=>s+b.principal,0),coupons:payments.filter(p=>p.type==='coupon').reduce((s,p)=>s+p.amount,0),byYear:Object.freeze([...totals.values()].map(Object.freeze))});
 return Object.freeze({currency,bonds:Object.freeze(bonds),payments:Object.freeze(payments.map(Object.freeze)),summary});
}
