import english from './en.mjs';
import values from './data/uk.mjs';
import { materializeGrowthLocale } from '../locale-utils.mjs';

export default materializeGrowthLocale(english, values, 'uk');
