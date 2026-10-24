export function parseMergeCsv(input, delimiter = ',') {
  if(![',',';','\t'].includes(delimiter))throw new RangeError('Choose comma, semicolon or tab as the CSV delimiter.');
  const text=String(input??'');if(!text.trim())throw new RangeError('Choose or paste a CSV file first.');if(text.length>200000)throw new RangeError('Keep the CSV under 200,000 characters.');
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++){const char=text[i];if(quoted){if(char==='"'&&text[i+1]==='"'){field+='"';i++;}else if(char==='"')quoted=false;else field+=char;continue;}if(char==='"'){if(field)throw new RangeError('A quoted CSV cell must start with a quote at the beginning of that cell.');quoted=true;}else if(char===delimiter){row.push(field);field='';}else if(char==='\n'||char==='\r'){if(char==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some((cell)=>cell.trim()))rows.push(row);row=[];field='';}else field+=char;}
  if(quoted)throw new RangeError('A CSV quoted cell is missing its closing quote.');row.push(field);if(row.some((cell)=>cell.trim()))rows.push(row);
  if(rows.length<2||rows.length>501)throw new RangeError('Include a header row and between 1 and 500 recipient rows.');
  const headers=rows[0].map((value)=>value.trim());if(headers.length<1||headers.length>40||headers.some((value)=>!value||[...value].length>80))throw new RangeError('Use 1–40 non-empty column headers, each no longer than 80 characters.');
  const normalized=headers.map((value)=>value.normalize('NFKC').toLocaleLowerCase());if(new Set(normalized).size!==headers.length)throw new RangeError('Column headers must be unique, ignoring case.');
  const recipients=rows.slice(1).map((values,index)=>{if(values.length!==headers.length)throw new RangeError(`CSV row ${index+2} has ${values.length} cells; expected ${headers.length}.`);return Object.freeze(Object.fromEntries(headers.map((key,position)=>[key,values[position]])));});
  return Object.freeze({headers:Object.freeze(headers),recipients:Object.freeze(recipients)});
}

export function mergeTemplate(template, record, headers) {
  const text=String(template??'');if(!text.trim())throw new RangeError('Enter a document template.');if(text.length>50000)throw new RangeError('Keep the template under 50,000 characters.');
  const placeholders=[...text.matchAll(/\{\{\s*([^{}]+?)\s*\}\}/gu)].map((match)=>match[1].trim());if(!placeholders.length)throw new RangeError('Add at least one {{Column header}} placeholder to the template.');
  const missing=[...new Set(placeholders.filter((key)=>!headers.includes(key)))];if(missing.length)throw new RangeError(`CSV header not found: ${missing.join(', ')}.`);
  return text.replace(/\{\{\s*([^{}]+?)\s*\}\}/gu,(_,key)=>record[key.trim()]??'');
}

const CRC32_TABLE=Object.freeze(Array.from({length:256},(_,index)=>{let value=index;for(let bit=0;bit<8;bit++)value=(value>>>1)^((value&1)?0xedb88320:0);return value>>>0;}));
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes)crc=(crc>>>8)^CRC32_TABLE[(crc^byte)&0xff];return(crc^0xffffffff)>>>0;}
function header(signature,size=30){const bytes=new Uint8Array(size),view=new DataView(bytes.buffer);view.setUint32(0,signature,true);return{bytes,view};}
function join(parts){const length=parts.reduce((sum,part)=>sum+part.length,0),result=new Uint8Array(length);let offset=0;for(const part of parts){result.set(part,offset);offset+=part.length;}return result;}

export function createStoredZip(files){
  if(!Array.isArray(files)||!files.length||files.length>502)throw new RangeError('The archive must contain between one and 502 files.');
  const encoder=new TextEncoder(),local=[],central=[];let offset=0;
  for(const file of files){const name=encoder.encode(file.name),data=encoder.encode(file.content);if(name.length>255||data.length>0xffffffff)throw new RangeError('A generated document is too large for this archive.');const checksum=crc32(data),{bytes:localHeader,view:localView}=header(0x04034b50);localView.setUint16(4,20,true);localView.setUint16(6,0x0800,true);localView.setUint16(8,0,true);localView.setUint16(10,0,true);localView.setUint16(12,0x21,true);localView.setUint32(14,checksum,true);localView.setUint32(18,data.length,true);localView.setUint32(22,data.length,true);localView.setUint16(26,name.length,true);localView.setUint16(28,0,true);local.push(localHeader,name,data);
    const{bytes:centralHeader,view:centralView}=header(0x02014b50,46);centralView.setUint16(4,20,true);centralView.setUint16(6,20,true);centralView.setUint16(8,0x0800,true);centralView.setUint16(10,0,true);centralView.setUint16(12,0,true);centralView.setUint16(14,0x21,true);centralView.setUint32(16,checksum,true);centralView.setUint32(20,data.length,true);centralView.setUint32(24,data.length,true);centralView.setUint16(28,name.length,true);centralView.setUint16(30,0,true);centralView.setUint16(32,0,true);centralView.setUint16(34,0,true);centralView.setUint16(36,0,true);centralView.setUint32(38,0,true);centralView.setUint32(42,offset,true);central.push(centralHeader,name);offset+=localHeader.length+name.length+data.length;
  }
  const directory=join(central),end=header(0x06054b50,22);end.view.setUint16(8,files.length,true);end.view.setUint16(10,files.length,true);end.view.setUint32(12,directory.length,true);end.view.setUint32(16,offset,true);return join([...local,directory,end.bytes]);
}
