import {buildQualityPage} from './build-quality-page.mjs';
import {renderDateQuality} from '../src/quality/date-calculator/render.mjs';
await buildQualityPage({toolId:'date-calculator',render:renderDateQuality});
