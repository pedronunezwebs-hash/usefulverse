import {generate,csvCell} from './logic.mjs';
import {zipSync,strToU8} from 'fflate';
self.onmessage=async({data:{id,state:s}})=>{try{
 if(!s.batch){const r=generate(s);delete r.bits;self.postMessage({id,type:'result',result:r});return;}
 if(!s.input.trim())throw Error('EMPTY_BATCH');const lines=s.input.split(/\r?\n/u),files={},rows=[['Line','Input','Value','File','Error']],preview=[];let count=0,errors=0;
 for(let start=0;start<lines.length;start+=25){for(let i=start;i<Math.min(start+25,lines.length);i++){
  const input=lines[i];if(!input.length)continue;count++;const file=`barcode-${String(i+1).padStart(6,'0')}.svg`;
  try{const r=generate({...s,input});files[file]=strToU8(r.svg);rows.push([i+1,input,r.value,file,'']);if(preview.length<5)preview.push({line:i+1,value:r.value,svg:r.svg});}
  catch(e){errors++;rows.push([i+1,input,'','',e.message]);}
 }self.postMessage({id,type:'progress',done:Math.min(start+25,lines.length),total:lines.length});await new Promise(r=>setTimeout(r,0));}
 if(!count)throw Error('EMPTY_BATCH');files['manifest.csv']=strToU8(rows.map(r=>r.map(csvCell).join(',')).join('\r\n')+'\r\n');
 const zip=zipSync(files,{level:1});self.postMessage({id,type:'complete',zip,count,errors,preview},[zip.buffer]);
}catch(e){self.postMessage({id,type:'error',code:e.message});}};
