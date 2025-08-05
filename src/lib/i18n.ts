
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-resources-to-backend';

export const supportedLngs = {
    en: 'English',
    bn: 'বাংলা',
    fr: 'Français',
    de: 'Deutsch',
    hi: 'हिन्दी',
    it: 'Italiano',
    ja: '日本語',
    ko: '한국어',
    ru: 'Русский',
    es: 'Español',
};


i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: Object.keys(supportedLngs),
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
     backend: {
      loadPath: '/locales/{{lng}}/common.json',
    },
  });

export default i18n;
