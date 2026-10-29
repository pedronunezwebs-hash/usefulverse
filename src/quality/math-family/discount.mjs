import{parse,rational,add,sub,mul,div,text,result,fail}from'./exact.mjs';import{money}from'./money.mjs';
const zero=rational(0n),one=rational(1n),hundred=rational(100n);
export function calculate(s){const a=parse(s.a,'a');if(a.n<=0n)fail('POSITIVE');let final,steps=[];const rate=r=>{if(r.n<0n||r.n>100n*r.d)fail('PERCENT_RANGE');return div(r,hundred);};
if(s.mode==='percent'){const b=parse(s.b,'b');final=mul(a,sub(one,rate(b)));steps=[text(a)+' × (1 − '+text(b)+' / 100)'];}
else if(s.mode==='amount'){const b=parse(s.b,'b');if(b.n<0n||b.n*a.d>a.n*b.d)fail('AMOUNT_RANGE');final=sub(a,b);steps=[text(a)+' − '+text(b)];}
else if(s.mode==='reverse'){final=parse(s.b,'b');if(final.n<0n||final.n*a.d>a.n*final.d)fail('AMOUNT_RANGE');steps=[`(${text(a)} − ${text(final)}) / ${text(a)} × 100`];}
else if(s.mode==='recover'){const b=rate(parse(s.b,'b'));if(b.n===b.d)fail('ZERO_BASE');const original=div(a,sub(one,b));return {answer:money(original),details:[{key:'exact',value:text(original)}],steps:[text(a)+' / (1 − '+text(b)+') = '+text(original)]};}
else if(s.mode==='stack'){const list=s.b.split(/[\s,;]+/u).filter(Boolean);if(!list.length)fail('NUMBER');final=a;for(const item of list){const b=parse(item,'b');const before=final;final=mul(final,sub(one,rate(b)));steps.push(text(before)+' × (1 − '+text(b)+' / 100) = '+text(final));}}
else fail('OPTIONS');const saved=sub(a,final),percentage=mul(div(saved,a),hundred);return {answer:money(final),details:[{key:'saved',value:money(saved)},{key:'discountRate',value:text(percentage)+'%'},{key:'exact',value:text(final)}],steps};}
