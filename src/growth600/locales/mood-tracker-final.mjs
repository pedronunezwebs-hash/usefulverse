import { localeEntries } from '../../locales.mjs';
import { moodTrackerEnglishCopy as english } from './mood-tracker.en.mjs';

const copies = Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})]));

export default Object.freeze(copies);
