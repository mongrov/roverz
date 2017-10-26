/**
 * Module App Config
 */
/* global __DEV__ */
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

export default {
  // App Details
  appName: 'roverZ',

  // Build Configuration - eg. Debug or Release?
  DEV: __DEV__,

  // Google Analytics - uses a 'dev' account while we're testing
  gaTrackingId: (__DEV__) ? 'UA-84284256-2' : 'UA-84284256-1',

  userId: null,

  space: 'workspace',
  brand: 'domain',
  instance: null,
  logo: null,
  navLogo: null,
  bootstrapUrl: null,
  ga: null,

  aboutDetails: {
    version: '2.0.1',
    build: '1027',
    website: 'www.mongrov.com',
    email: 'support@mongrov.com',
    company: 'Powered by Mongrov, Inc.',
  },

  get brandName() {
    return this.brand;
  },

  get gaTracker() {
    return this.ga;
  },

  // URLs
  urls: {
    resetPassword: null,
    signUp: null,
    SERVER_URL: null,
    WS_URL: null,
  },

  init() {
    if (this.instance === null) {
      if (this.bootstrapUrl !== null) {
        this.resetInstance(this.bootstrapUrl);
      } else {
        this.resetInstance(`${this.space}.${this.brand}`);
      }
    }
    if (this.ga == null) {
      this.ga = new GoogleAnalyticsTracker(this.gaTrackingId);
    }
    if (this.logo == null) {
      this.logo = require('../images/logo.png');  // eslint-disable-line global-require
    }
  },

  setLogo(logo) {
    this.logo = logo;
  },

  setNavLogo(logo) {
    this.navLogo = logo;
  },

  setUserId(uid) {
    this.userId = uid;
  },

  setBrand(brandName) {
    this.brand = brandName;
  },

  setAboutDetails(about) {
    this.aboutDetails = about;
  },

  reset(space) {
    this.space = space;
    this.instance = `${this.space}.${this.brand}`;
    this.resetInstance(this.instance);
  },

  resetInstance(instanceUrl) {
    const noOfDots = (instanceUrl.match(/./g) || []).length;
    let instanceIp = instanceUrl; // ib.elix.yap.im
    let brandIp = this.brand;
    let resetInstanceUrl = '';
    console.log('conff', instanceIp, brandIp);
    if (noOfDots <= 1) {
      resetInstanceUrl = `${instanceIp}.${this.brand}`;
    } else {
      const res = instanceUrl.split('.'); // [ib,elix,yap,im]
      instanceIp = res[0]; // elix
      let i;
      let newInstanceIp = '';
      for (i = 1; i < res.length; i += 1) {
        newInstanceIp = `${newInstanceIp}.${res[i]}`; // .yap.im
      }
      brandIp = `${res[res.length - 2]}.${res[res.length - 1]}`; // yap.im
      instanceIp = instanceUrl.replace(`.${brandIp}`, '');
      resetInstanceUrl = instanceUrl;
      this.setBrand(brandIp);
    }
    this.space = instanceIp;
    this.instance = resetInstanceUrl;
    this.urls.resetPassword = `https://${this.instance}`;
    this.urls.signUp = `https://${this.instance}`;
    this.urls.SERVER_URL = `https://${this.instance}`;
    this.urls.WS_URL = `wss://${this.instance}/websocket`;
  },

};
