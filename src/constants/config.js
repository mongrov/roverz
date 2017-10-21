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
  ga: null,

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
    if (this.instance == null) {
      this.reset(this.space);
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

  setUserId(uid) {
    this.userId = uid;
  },

  reset(space) {
    this.space = space;
    this.instance = `${this.space}.${this.brand}`;
    this.urls.resetPassword = `https://${this.instance}`;
    this.urls.signUp = `https://${this.instance}`;
    this.urls.SERVER_URL = `https://${this.instance}`;
    this.urls.WS_URL = `wss://${this.instance}/websocket`;
  },

};
