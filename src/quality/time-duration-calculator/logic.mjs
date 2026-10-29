import { Temporal } from 'temporal-polyfill';
const fail=(code,field)=>{const e=new RangeError(code);e.field=field;throw e;};
export function parseDateTime(text){
  if(typeof text!=='string')fail('DATE_INVALID');
  const m=/^(\d{4,6})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/u.exec(text);
  if(!m)fail('DATE_INVALID');
  const [year,month,day,hour,minute,second]=m.slice(1).map(v=>Number(v??0));
  if(year<1||hour>23||minute>59||second>59)fail('DATE_INVALID');
  try{return Temporal.PlainDateTime.from({year,month,day,hour,minute,second},{overflow:'reject'});}catch{fail('DATE_INVALID');}
}
export function resolveTime(text,zone,occurrence='reject',field){
  const plain=parseDateTime(text);
  if(!['reject','earlier','later'].includes(occurrence))fail('OPTIONS_INVALID',field);
  let early,late;
  try{early=plain.toZonedDateTime(zone,{disambiguation:'earlier'});late=plain.toZonedDateTime(zone,{disambiguation:'later'});}catch{fail('ZONE_INVALID',field);}
  // Never silently shift a nonexistent clock time, even with an occurrence selected.
  if(!early.toPlainDateTime().equals(plain)||!late.toPlainDateTime().equals(plain))fail('TIME_GAP',field);
  const repeated=early.epochNanoseconds!==late.epochNanoseconds;
  if(repeated&&occurrence==='reject')fail('TIME_REPEAT',field);
  const result=occurrence==='later'?late:early;
  return {epochSeconds:Number(result.epochNanoseconds/1_000_000_000n),utc:result.toInstant().toString(),offset:result.offset,zone:result.timeZoneId,repeated,occurrence};
}
export function clockSeconds(text){
  if(typeof text!=='string'||!/^\d{2}:\d{2}(?::\d{2})?$/u.test(text))fail('CLOCK_INVALID');
  const [h,m,s=0]=text.split(':').map(Number);if(h>23||m>59||s>59)fail('CLOCK_INVALID');return h*3600+m*60+s;
}
function whole(value){
  if(value===''||value===undefined)return 0;
  if(typeof value!=='number'&&typeof value!=='string'||typeof value==='string'&&!/^\d+$/u.test(value))fail('BREAK_INVALID','break');
  const n=Number(value);if(!Number.isSafeInteger(n)||n<0)fail('BREAK_INVALID','break');return n;
}
export function duration(state){
  const {mode}=state;let signed,start,end;
  if(mode==='dates'){
    start=resolveTime(state.start,state.startZone,state.startOccurrence??'reject','start');
    end=resolveTime(state.end,state.endZone,state.endOccurrence??'reject','end');signed=end.epochSeconds-start.epochSeconds;
  }else if(mode==='clock'){
    if(typeof state.nextDay!=='boolean')fail('OPTIONS_INVALID');
    signed=clockSeconds(state.end)-clockSeconds(state.start)+(state.nextDay?86400:0);
    if(signed<0)fail('CLOCK_ORDER','end');
  }else fail('OPTIONS_INVALID');
  const beforeBreakSeconds=Math.abs(signed),breakMinutes=whole(state.breakMinutes),removed=breakMinutes*60;
  if(!Number.isSafeInteger(removed)||removed>beforeBreakSeconds)fail('BREAK_TOO_LONG','break');
  const seconds=beforeBreakSeconds-removed;
  const parts={days:Math.floor(seconds/86400),hours:Math.floor(seconds%86400/3600),minutes:Math.floor(seconds%3600/60),seconds:seconds%60};
  return {seconds,beforeBreakSeconds,breakMinutes,reversed:signed<0,parts,totalHours:seconds/3600,iso:`PT${Math.floor(seconds/3600)}H${parts.minutes}M${parts.seconds}S`,start,end};
}
export function stateToURL(state){
  duration(state);const p=new URLSearchParams({mode:state.mode,start:state.start,end:state.end,break:String(state.breakMinutes||0)});
  if(state.mode==='clock')p.set('nextDay',state.nextDay?'1':'0');
  else for(const k of ['startZone','endZone','startOccurrence','endOccurrence'])p.set(k,state[k]??'reject');
  return '?'+p;
}
export function stateFromURL(search){
  const p=new URLSearchParams(search);if(!p.size)return null;
  for(const k of p.keys())if(p.getAll(k).length!==1)fail('LINK_INVALID');
  const mode=p.get('mode'),start=p.get('start'),end=p.get('end');
  const state={mode,start,end,breakMinutes:p.get('break')??'0'};
  if(mode==='clock'){
    if(!['0','1'].includes(p.get('nextDay')))fail('LINK_INVALID');state.nextDay=p.get('nextDay')==='1';
  }else for(const k of ['startZone','endZone','startOccurrence','endOccurrence'])state[k]=p.get(k);
  try{duration(state);}catch{fail('LINK_INVALID');}return state;
}
