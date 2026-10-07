import english from './en.mjs';
import values from './data/pt.mjs';
import { materializeGrowthLocale } from '../locale-utils.mjs';

export default materializeGrowthLocale(english, values, 'pt');
