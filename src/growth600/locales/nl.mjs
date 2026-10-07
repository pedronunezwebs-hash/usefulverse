import english from './en.mjs';
import values from './data/nl.mjs';
import { materializeGrowthLocale } from '../locale-utils.mjs';

export default materializeGrowthLocale(english, values, 'nl');
