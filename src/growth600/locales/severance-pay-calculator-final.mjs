import { localeEntries } from '../../locales.mjs';
import { severancePayCalculatorEnglishCopy as english } from './severance-pay-calculator.en.mjs';

const drafts = Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})]));

export default Object.freeze(drafts);
