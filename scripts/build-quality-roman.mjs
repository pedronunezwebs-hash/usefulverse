import {readFile} from 'node:fs/promises';
import {buildQualityPage} from './build-quality-page.mjs';
import {renderRomanQuality} from '../src/quality/roman-numeral-converter/render.mjs';
const cssExtra=await readFile(new URL('../src/quality/roman-numeral-converter/style.css',import.meta.url),'utf8');
await buildQualityPage({toolId:'roman-numeral-converter',render:renderRomanQuality,cssExtra,workerEntry:'worker.mjs'});
