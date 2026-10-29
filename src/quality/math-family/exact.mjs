export const fail=code=>{throw new RangeError(code);};
export const abs=n=>n<0n?-n:n;
export function gcd(a,b){a=abs(a);b=abs(b);while(b)[a,b]=[b,a%b];return a;}
export function rational(n,d=1n){if(d===0n)fail('ZERO_DENOMINATOR');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return {n:n/g,d:d/g};}
function parseCore(value){if(typeof value!=='string')fail('NUMBER');const s=value.trim();let m;if((m=s.match(/^([+-]?)(\d+)\s+(\d+)\/(\d+)$/u))){const d=BigInt(m[4]);if(!d)fail('ZERO_DENOMINATOR');return rational((m[1]==='-'?-1n:1n)*(BigInt(m[2])*d+BigInt(m[3])),d);}if((m=s.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/u)))return rational(BigInt(m[1]),BigInt(m[2]));if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(s))fail('NUMBER');const [whole,dec='']=s.split('.'),sign=s.startsWith('-')?-1n:1n,d=10n**BigInt(dec.length);return rational(BigInt((whole.replace(/^[+-]/u,'')||'0')+dec)*sign,d);}
export const add=(a,b)=>rational(a.n*b.d+b.n*a.d,a.d*b.d);
export const sub=(a,b)=>rational(a.n*b.d-b.n*a.d,a.d*b.d);
export const mul=(a,b)=>rational(a.n*b.n,a.d*b.d);
export function div(a,b){if(!b.n)fail('DIVIDE_ZERO');return rational(a.n*b.d,a.d*b.n);}
export const text=a=>a.d===1n?String(a.n):a.n+'/'+a.d;
export function decimal(a,places=12){const factor=10n**BigInt(places),v=abs(a.n)*factor/a.d,rem=abs(a.n)*factor%a.d,rounded=v+(rem*2n>=a.d?1n:0n);let digits=String(rounded).padStart(places+1,'0');let result=digits.slice(0,-places)+'.'+digits.slice(-places);result=result.replace(/\.?0+$/u,'');if(a.n<0n&&rounded)result='-'+result;return {value:result,exact:rem===0n};}
export function mixed(a){const n=abs(a.n),whole=n/a.d,rem=n%a.d;return !whole||!rem?text(a):(a.n<0n?'-':'')+whole+' '+rem+'/'+a.d;}
export function result(a,steps=[],unit=''){return {answer:text(a)+unit,details:[{key:'decimal',value:(decimal(a).exact?'':'≈ ')+decimal(a).value+unit},{key:'mixed',value:mixed(a)+unit}],steps};}

export function parse(value,field){try{return parseCore(value);}catch(e){if(field)e.field=field;throw e;}}
