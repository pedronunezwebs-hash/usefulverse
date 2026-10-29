// Independent decoder is QA-only: install @zxing/library@0.21.3 in the owned QA prefix.
import {createRequire} from 'node:module';import assert from 'node:assert/strict';
import {generate} from '../../src/quality/barcode-generator/logic.mjs';
import refs from '../../docs/quality/tools/barcode-generator/references.json' with {type:'json'};
const require=createRequire(import.meta.url),z=require('@zxing/library');assert.equal(require('@zxing/library/package.json').version,'0.21.3');
const opts={module:2,height:90,showValue:true},readers={CODE128:z.Code128Reader,CODE39:z.Code39Reader,EAN13:z.EAN13Reader,EAN8:require('@zxing/library/cjs/core/oned/EAN8Reader').default,UPC:require('@zxing/library/cjs/core/oned/UPCAReader').default};let checked=0;
function decode(s){const r=generate({...opts,...s}),pixels='0'.repeat(24)+[...r.bits].map(c=>c.repeat(2)).join('')+'0'.repeat(24),row=new z.BitArray(pixels.length);for(let i=0;i<pixels.length;i++)if(pixels[i]==='1')row.set(i);const actual=new readers[s.format]().decodeRow(0,row).getText();assert.equal(actual,r.value);checked++;}
for(const r of refs.cases)decode({format:r.format,input:r.body});
for(let i=0;i<1000;i++)decode({format:i%2?'CODE39':'CODE128',input:'UV-'+String(i).padStart(8,'0')});
for(const input of [' A ','<script>&"\'','~!@#$%^&*()','A'.repeat(1000)])decode({format:'CODE128',input});
console.log(JSON.stringify({decoder:'@zxing/library@0.21.3',rowsDecoded:checked,source:'actual generated bar bitmaps, independent implementation',passed:true,physicalPrintVerified:false}));
