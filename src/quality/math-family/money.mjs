import{decimal}from'./exact.mjs';export function money(r){const s=decimal(r,2).value,[a,b='']=s.split('.');return a+'.'+b.padEnd(2,'0');}
