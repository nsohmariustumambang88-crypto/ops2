'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'fr';

const dict: Record<Lang, Record<string, string>> = {
  en: {
    about: 'About us',
    search: 'Search',
    country: 'Cameroon',
    language: 'Language',
    portal: 'Customer portal',
    track: 'Track',
    ship: 'Ship',
    quote: 'Quote',
    help: 'Help',
  },
  fr: {
    about: 'À propos',
    search: 'Rechercher',
    country: 'Cameroun',
    language: 'Langue',
    portal: 'Portail client',
    track: 'Suivre',
    ship: 'Expédier',
    quote: 'Devis',
    help: 'Aide',
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };

const LanguageContext = createContext<Ctx>({
  lang: 'en',
  setLang: () => {},
  t: (key) => dict.en[key] ?? key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const t = (key: string) => dict[lang][key] ?? dict.en[key] ?? key;
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
