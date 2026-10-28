import { uz, TranslationKeys } from './uz';
import { ru } from './ru';
import { en } from './en';

export type SupportedLanguage = 'uz' | 'ru' | 'en';

export const translations: Record<SupportedLanguage, TranslationKeys> = {
  uz,
  ru,
  en,
};

export { uz, ru, en, TranslationKeys };
