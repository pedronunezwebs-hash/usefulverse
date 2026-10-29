import {convert,convertRows,rowsToCSV} from './logic.mjs';
self.onmessage=async({data})=>{
  const {id,state}=data;
  try{
    if(state.mode!=='batch'){self.postMessage({id,type:'result',result:convert(state)});return;}
    if(!state.input.trim())throw new RangeError('BATCH_EMPTY');
    const allRows=[];
    const lines=state.input.split(/\r?\n/u);let count=0;
    for(let start=0;start<lines.length;start+=25){
      const rows=convertRows(lines.slice(start,start+25).join('\n'),state.extended).map(r=>({...r,line:r.line+start}));count+=rows.length;allRows.push(...rows);
      self.postMessage({id,type:'rows',rows,done:Math.min(start+25,lines.length),total:lines.length});
      await new Promise(resolve=>setTimeout(resolve,0));
    }
    self.postMessage({id,type:'complete',count,csv:rowsToCSV(allRows,data.headers)});
  }catch(e){self.postMessage({id,type:'error',code:e.message});}
};
