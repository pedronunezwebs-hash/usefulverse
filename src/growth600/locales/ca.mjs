import english from './en.mjs';
import values from './data/ca.mjs';
import { materializeGrowthLocale } from '../locale-utils.mjs';

export default materializeGrowthLocale(english, values, 'ca');
