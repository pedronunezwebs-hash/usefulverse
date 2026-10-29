import {readFile} from 'node:fs/promises';
import {buildQualityPage} from './build-quality-page.mjs';
import {renderTimeQuality} from '../src/quality/time-duration-calculator/render.mjs';
const cssExtra=await readFile(new URL('../src/quality/time-duration-calculator/style.css',import.meta.url),'utf8');
await buildQualityPage({toolId:'time-duration-calculator',render:renderTimeQuality,cssExtra,licenses:['node_modules/temporal-polyfill/LICENSE','node_modules/temporal-spec/LICENSE']});
