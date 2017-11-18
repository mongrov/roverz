import en from './locales/en';

// @todo this file needs to be fixed
// with real i18n - for now this is just a lookup

export default function t(key) {
  return en[key];
}
