import english from './en.mjs';
import values from './data/zh_tw.mjs';
import { materializeGrowthLocale } from '../locale-utils.mjs';

export default materializeGrowthLocale(english, values, 'zh_tw');
