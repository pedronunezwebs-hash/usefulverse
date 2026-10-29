import JsBarcode from 'jsbarcode';
const fail=code=>{throw new RangeError(code);};
export const formats=['CODE128','EAN13','UPC','EAN8','CODE39'];
export function checkDigit(body){if(!/^\d+$/u.test(body))fail('DIGITS');let sum=0;for(let i=body.length-1,j=0;i>=0;i--,j++)sum+=Number(body[i])*(j%2?1:3);return String((10-sum%10)%10);}
export function normalize(value,format){
 if(typeof value!=='string'||!formats.includes(format))fail('OPTIONS');
 if(format==='CODE128'){if(!value||!/^[\x20-\x7e]+$/u.test(value))fail('ASCII');return value;}
 if(format==='CODE39'){if(!value||!/^[0-9A-Z .$/+%\-]+$/u.test(value))fail('CODE39');return value;}
 const text=value.trim(),length={EAN13:13,UPC:12,EAN8:8}[format];if(!/^\d+$/u.test(text)||![length-1,length].includes(text.length))fail('LENGTH');
 const body=text.slice(0,length-1),digit=checkDigit(body);if(text.length===length&&text.at(-1)!==digit)fail('CHECK_DIGIT');return body+digit;
}
export function options(s){
 if(!formats.includes(s.format)||typeof s.showValue!=='boolean'||!Number.isInteger(s.module)||s.module<1||s.module>6||!Number.isInteger(s.height)||s.height<40||s.height>300)fail('OPTIONS');
 return {format:s.format,showValue:s.showValue,module:s.module,height:s.height};
}
const xml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
export function generate(s){
 const opt=options(s),value=normalize(s.input,s.format),data={};JsBarcode(data,value,{format:s.format,displayValue:false});
 const bits=data.encodings.map(e=>e.data).join(''),quiet=12*opt.module,width=bits.length*opt.module+quiet*2,height=opt.height+(opt.showValue?30:0)+20;
 let bars='';for(let start=0;start<bits.length;){if(bits[start]==='0'){start++;continue;}let end=start+1;while(bits[end]==='1')end++;bars+=`<rect x="${quiet+start*opt.module}" y="10" width="${(end-start)*opt.module}" height="${opt.height}"/>`;start=end;}
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xml(s.format+' '+value)}"><title>${xml(s.format+' '+value)}</title><rect width="${width}" height="${height}" fill="#fff"/><g fill="#000" shape-rendering="crispEdges">${bars}</g>${opt.showValue?`<text x="${width/2}" y="${height-12}" text-anchor="middle" font-family="monospace" font-size="16" fill="#000">${xml(value)}</text>`:''}</svg>`;
 return {value,format:s.format,svg,width,height,modules:bits.length,bits,quietModules:12,addedDigit:!['CODE128','CODE39'].includes(s.format)&&s.input.trim().length===value.length-1};
}
export function csvCell(v){let s=String(v??'');if(/^\s*[=+\-@\t\r]/u.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function stateToURL(s){generate(s);return '?'+new URLSearchParams({format:s.format,input:s.input,module:String(s.module),height:String(s.height),show:s.showValue?'1':'0'});}
export function stateFromURL(search){const p=new URLSearchParams(search);if(!p.size)return null;for(const k of p.keys())if(p.getAll(k).length!==1)fail('LINK');if(!['0','1'].includes(p.get('show'))||!/^\d+$/u.test(p.get('module')??'')||!/^\d+$/u.test(p.get('height')??''))fail('LINK');const s={format:p.get('format'),input:p.get('input'),module:Number(p.get('module')),height:Number(p.get('height')),showValue:p.get('show')==='1'};try{generate(s);}catch{fail('LINK');}return s;}
