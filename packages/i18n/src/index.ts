import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

import en from './locales/en.json';

i18n.use(initReactI18next).init({
  showSupportNotice: false, // disables console.log advertisement spam
  resources: {
    en: { translation: en },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export { i18n, useTranslation };
