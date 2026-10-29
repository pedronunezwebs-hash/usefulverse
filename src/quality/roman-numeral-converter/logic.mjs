import {parseCivil} from '../date-calculator/logic.mjs';
const fail=code=>{throw new RangeError(code);};
const places=[['','M','MM','MMM'],['','C','CC','CCC','CD','D','DC','DCC','DCCC','CM'],['','X','XX','XXX','XL','L','LX','LXX','LXXX','XC'],['','I','II','III','IV','V','VI','VII','VIII','IX']];
const small=n=>[Math.floor(n/1000),Math.floor(n%1000/100),Math.floor(n%100/10),n%10].map((d,i)=>places[i][d]).join('');
function positive(text){if(typeof text!=='string'||!/^\d+$/u.test(text.trim()))fail('NUMBER_INVALID');const n=BigInt(text.trim());if(n===0n)fail('ZERO');return n;}
export function toRoman(text,extended=true){
  let n=positive(text);if(typeof extended!=='boolean')fail('OPTIONS_INVALID');if(!extended&&n>3999n)fail('STANDARD_RANGE');
  const tails=[];while(n>3999n){tails.push(small(Number(n%1000n)));n/=1000n;}
  // Iterative, including nested groups: no recursive call-stack limit.
  const pieces=['('.repeat(tails.length),small(Number(n))];for(let i=tails.length-1;i>=0;i--)pieces.push(')',tails[i]);return pieces.join('');
}
export function normalizeRoman(text){
  if(typeof text!=='string')fail('ROMAN_INVALID');
  return text.trim().replace(/[\u2160-\u217f]/gu,c=>c.normalize('NFKC')).toUpperCase();
}
const value={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
function runValue(s){let n=0;for(let i=0;i<s.length;i++)n+=value[s[i]]<(value[s[i+1]]||0)?-value[s[i]]:value[s[i]];return BigInt(n);}
export function fromRoman(text,extended=true){
  const input=normalizeRoman(text);if(!input||!/^[IVXLCDM()]+$/u.test(input))fail('ROMAN_INVALID');
  const stack=[{sum:0n,run:'',seen:false}];
  for(const c of input){const current=stack.at(-1);
    if(c==='('){current.sum+=runValue(current.run);current.run='';stack.push({sum:0n,run:'',seen:false});}
    else if(c===')'){if(stack.length===1||!current.seen)fail('ROMAN_INVALID');const n=current.sum+runValue(current.run);stack.pop();stack.at(-1).sum+=n*1000n;stack.at(-1).seen=true;}
    else{current.run+=c;current.seen=true;}
  }
  if(stack.length!==1)fail('ROMAN_INVALID');const n=stack[0].sum+runValue(stack[0].run);if(n<1n)fail('ROMAN_INVALID');
  if(toRoman(n.toString(),extended)!==input)fail('ROMAN_INVALID');return n.toString();
}
export function convert(state){
  const extended=state.extended??true;if(typeof extended!=='boolean')fail('OPTIONS_INVALID');
  if(state.mode==='date'){
    let date;try{date=parseCivil(state.input);}catch{fail('DATE_INVALID');}
    if(!['dmy','mdy','ymd'].includes(state.order))fail('OPTIONS_INVALID');
    const v={d:date.getUTCDate(),m:date.getUTCMonth()+1,y:date.getUTCFullYear()};
    const parts=[...state.order].map(k=>({part:k,number:String(v[k]),roman:toRoman(String(v[k]),extended)}));
    return {mode:'date',input:state.input,roman:parts.map(p=>p.roman).join(' / '),parts};
  }
  if(!['number','roman','auto'].includes(state.mode))fail('OPTIONS_INVALID');
  const mode=state.mode==='auto'?(/^\d+$/u.test(String(state.input).trim())?'number':'roman'):state.mode;
  const number=mode==='number'?positive(state.input).toString():fromRoman(state.input,extended),roman=toRoman(number,extended);
  const n=BigInt(number),parts=n>3999n?[]:[1000,100,10,1].map((place,i)=>{const v=Math.floor(Number(n)/place)%(i?10:4);return {roman:places[i][v],number:String(v*place)};}).filter(p=>p.roman);
  return {mode,input:state.input,number,roman,parts,extended:n>3999n};
}
export function convertRows(text,extended=true){
  return text.split(/\r?\n/u).flatMap((input,i)=>{if(!input.trim())return [];try{return [{line:i+1,input,...convert({mode:'auto',input,extended})}];}catch(e){return [{line:i+1,input,error:e.message}];}});
}
export function rowsToCSV(rows,headers=['Line','Input','Number','Roman','Error']){
  const cell=v=>{let s=String(v??'');if(/^\s*[=+\-@\t\r]/u.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
  return [headers,...rows.map(r=>[r.line,r.input,r.number,r.roman,r.error])].map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';
}
export function stateToURL(state){convert(state);const p=new URLSearchParams({mode:state.mode,input:state.input,extended:state.extended===false?'0':'1'});if(state.mode==='date')p.set('order',state.order);return '?'+p;}
export function stateFromURL(search){const p=new URLSearchParams(search);if(!p.size)return null;for(const k of p.keys())if(p.getAll(k).length!==1)fail('LINK_INVALID');if(!['0','1'].includes(p.get('extended')))fail('LINK_INVALID');if(!['number','roman','date'].includes(p.get('mode')))fail('LINK_INVALID');const state={mode:p.get('mode'),input:p.get('input'),extended:p.get('extended')==='1'};if(state.mode==='date')state.order=p.get('order');try{convert(state);}catch{fail('LINK_INVALID');}return state;}
