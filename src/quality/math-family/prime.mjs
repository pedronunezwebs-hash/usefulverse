import{fail}from'./exact.mjs';
const bases=[2n,325n,9375n,28178n,450775n,9780504n,1795265022n];
function pow(a,d,n){let r=1n;a%=n;while(d){if(d&1n)r=r*a%n;a=a*a%n;d>>=1n;}return r;}
function witness(a,n,d,k){a%=n;if(a<2n)return false;let x=pow(a,d,n);if(x===1n||x===n-1n)return false;for(let r=1;r<k;r++){x=x*x%n;if(x===n-1n)return false;}return true;}
function randomBelow(n){const size=Math.ceil(n.toString(2).length/8),bytes=new Uint8Array(size);for(;;){crypto.getRandomValues(bytes);const spare=size*8-n.toString(2).length;if(spare)bytes[0]&=255>>>spare;let x=0n;for(const b of bytes)x=(x<<8n)+BigInt(b);if(x<n)return x;}}
export function calculate(s){if(typeof s.a!=='string'||!/^\+?\d+$/u.test(s.a.trim()))fail('INTEGER');const n=BigInt(s.a.trim());if(n<2n)return {answerKey:'neither',details:[],steps:[n+' < 2']};
for(let p=2n;p<=997n;p++){let prime=true;for(let q=2n;q*q<=p;q++)if(p%q===0n){prime=false;break;}if(!prime)continue;if(n===p)return {answerKey:'prime',details:[],steps:[String(n)]};if(n%p===0n)return {answerKey:'composite',details:[{key:'factor',value:String(p)},{key:'cofactor',value:String(n/p)}],steps:[n+' = '+p+' × '+n/p]};}
let d=n-1n,k=0;while(!(d&1n)){d>>=1n;k++;}const deterministic=n<2n**64n,rounds=deterministic?bases:Array.from({length:32},()=>randomBelow(n-3n)+2n);for(const a of rounds)if(witness(a,n,d,k))return {answerKey:'composite',details:[{key:'witness',value:String(a)}],steps:[`n − 1 = ${d} × 2^${k}`]};return {answerKey:deterministic?'prime':'probable',details:[{key:'rounds',value:String(rounds.length)}],steps:[`n − 1 = ${d} × 2^${k}`]};}
