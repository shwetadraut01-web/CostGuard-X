import en from '../locales/en.json';
import ja from '../locales/ja.json';

export type Language = 'en' | 'ja';

const dictionaries: Record<Language, any> = { en, ja };

export function getTranslation(lang: Language, keyPath: string): string {
  const keys = keyPath.split('.');
  let current = dictionaries[lang] || dictionaries.en;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback to English dictionary
      let fallback = dictionaries.en;
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return keyPath;
        }
      }
      return typeof fallback === 'string' ? fallback : keyPath;
    }
  }

  return typeof current === 'string' ? current : keyPath;
}
