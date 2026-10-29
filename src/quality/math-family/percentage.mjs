import{parse,rational,add,sub,mul,div,abs,text,result,fail}from'./exact.mjs';
export function calculate(s){const a=parse(s.a,'a'),b=parse(s.b,'b'),hundred=rational(100n);let r,formula,unit='%';switch(s.mode){
case'of':r=div(mul(a,b),hundred);formula=`${text(a)} ÷ 100 × ${text(b)}`;unit='';break;
case'share':r=mul(div(a,b),hundred);formula=`${text(a)} ÷ ${text(b)} × 100`;break;
case'whole':r=mul(div(a,b),hundred);formula=`${text(a)} ÷ ${text(b)} × 100`;unit='';break;
case'change':if(!a.n)fail('ZERO_BASE');r=mul(div(sub(b,a),rational(abs(a.n),a.d)),hundred);formula=`(${text(b)} − ${text(a)}) ÷ |${text(a)}| × 100`;break;
case'difference':if(a.n<0n||b.n<0n)fail('NONNEGATIVE');if(!a.n&&!b.n)fail('ZERO_BASE');r=mul(div(rational(abs(sub(a,b).n),sub(a,b).d),div(add(a,b),rational(2n))),hundred);formula=`|${text(a)} − ${text(b)}| ÷ ((${text(a)} + ${text(b)}) ÷ 2) × 100`;break;
case'increase':r=mul(a,add(rational(1n),div(b,hundred)));formula=`${text(a)} × (1 + ${text(b)} ÷ 100)`;unit='';break;
case'decrease':r=mul(a,sub(rational(1n),div(b,hundred)));formula=`${text(a)} × (1 − ${text(b)} ÷ 100)`;unit='';break;
case'error':if(!b.n)fail('ZERO_BASE');r=mul(div(rational(abs(sub(a,b).n),sub(a,b).d),rational(abs(b.n),b.d)),hundred);formula=`|${text(a)} − ${text(b)}| ÷ |${text(b)}| × 100`;break;
default:fail('OPTIONS');}return result(r,[formula+' = '+text(r)+unit],unit);}
