import { localeEntries } from '../../locales.mjs';
import { photoToSketchEnglishCopy as english } from './photo-to-sketch.en.mjs';

const drafts = Object.fromEntries(localeEntries.map(({ key }) => [key, Object.freeze({
  ...english,
  copyLanguage: key,
  localizationStatus: key === 'en' ? 'approved' : 'pending-tool-specific-translation',
})]));

export default Object.freeze(drafts);
