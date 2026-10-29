import {readFile} from 'node:fs/promises';
import {buildQualityPage} from './build-quality-page.mjs';
import {renderBarcodeQuality} from '../src/quality/barcode-generator/render.mjs';
const cssExtra=await readFile(new URL('../src/quality/barcode-generator/style.css',import.meta.url),'utf8');
await buildQualityPage({toolId:'barcode-generator',render:renderBarcodeQuality,cssExtra,workerEntry:'worker.mjs',licenses:['node_modules/jsbarcode/MIT-LICENSE.txt','node_modules/fflate/LICENSE']});
