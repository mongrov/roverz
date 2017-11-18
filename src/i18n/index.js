import en from './locales/en';

//@todo this file needs to be fixed
//with real i18n - for now this is just a lookup

function t(key) {
    return en[key];
}

export { t }
