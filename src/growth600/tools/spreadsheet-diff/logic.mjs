const MAX_TEXT=100000,MAX_ROWS=5000,MAX_COLS=100;
function fail(code){throw Object.assign(new Error(code),{code});}
export function parseCsv(text){
  const source=String(text??'').replace(/^\uFEFF/u,'');
  if(source.length>MAX_TEXT)fail('too-large');
  const rows=[];let row=[],cell='',quoted=false,closed=false;
  for(let i=0;i<source.length;i++){
    const ch=source[i];
    if(quoted){if(ch==='"'){if(source[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=ch;continue;}
    if(closed&&ch!==','&&ch!=='\r'&&ch!=='\n')fail('malformed-csv');
    if(ch==='"'){if(cell.length)fail('malformed-csv');quoted=true;closed=false;}
    else if(ch===','){row.push(cell);cell='';closed=false;if(row.length>=MAX_COLS)fail('too-many-columns');}
    else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&source[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';closed=false;if(rows.length>MAX_ROWS)fail('too-many-rows');}
    else{cell+=ch;closed=false;}
  }
  if(quoted)fail('malformed-csv');
  if(cell.length||row.length||(!rows.length&&source.length)){row.push(cell);rows.push(row);}
  if(rows.length>MAX_ROWS)fail('too-many-rows');
  if(!rows.length||rows.every(r=>r.every(v=>v.trim()==='')))fail('empty-csv');
  const width=Math.max(...rows.map(r=>r.length));
  if(width>MAX_COLS)fail('too-many-columns');
  return rows.map(r=>Array.from({length:width},(_,i)=>r[i]??''));
}
export function compareCsv(beforeText,afterText,keyColumn=1){
  const before=parseCsv(beforeText),after=parseCsv(afterText),keyIndex=Number(keyColumn)-1;
  if(!Number.isInteger(keyIndex)||keyIndex<0||keyIndex>=Math.min(before[0].length,after[0].length))fail('invalid-key-column');
  const headers=after[0].map((v,i)=>v||before[0][i]||`Column ${i+1}`);
  const index=(rows)=>{const map=new Map();for(let i=1;i<rows.length;i++){const key=rows[i][keyIndex];if(!key.trim())fail('blank-key');if(map.has(key))fail('duplicate-key');map.set(key,rows[i]);}return map;};
  const oldRows=index(before),newRows=index(after),changes=[];
  for(const [key,newRow] of newRows){if(!oldRows.has(key)){changes.push({type:'added-row',key,values:newRow});continue;}const oldRow=oldRows.get(key);for(let col=0;col<Math.max(oldRow.length,newRow.length);col++){const previous=oldRow[col]??'',current=newRow[col]??'';if(previous!==current)changes.push({type:'changed-cell',key,column:headers[col]??`Column ${col+1}`,before:previous,after:current});}}
  for(const [key,oldRow] of oldRows)if(!newRows.has(key))changes.push({type:'removed-row',key,values:oldRow});
  return Object.freeze({headers,changes:Object.freeze(changes),summary:Object.freeze({addedRows:changes.filter(x=>x.type==='added-row').length,removedRows:changes.filter(x=>x.type==='removed-row').length,changedCells:changes.filter(x=>x.type==='changed-cell').length,total:changes.length,shown:Math.min(changes.length,2000)}),truncated:changes.length>2000});
}
