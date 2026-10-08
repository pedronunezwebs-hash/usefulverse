import { localeEntries } from '../../locales.mjs';
import { laplaceTransformEnglishCopy as english } from './laplace-transform-calculator.en.mjs';

export default Object.freeze(Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})])));
