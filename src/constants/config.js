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
  bootstrapUrl: null,
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

  setUserId(uid) {
    this.userId = uid;
  },

  setBrand(brandName) {
    this.brand = brandName;
  },

  reset(space) {
    this.space = space;
    this.instance = `${this.space}.${this.brand}`;
    this.resetInstance(this.instance);
  },

  resetInstance(instanceUrl){
    const noOfDots = (instanceUrl.match(/./g) || []).length;
    if(noOfDots<=1){
      instanceUrl = `${instanceUrl}.${this.brand}`;
    }
    let instanceIp = instanceUrl;
    let brandIp = this.brand;
    if(noOfDots>1){
      var res = instanceUrl.split(".");
      instanceIp = res[0];
      var i;
      for(i = 1; i < res.length-2; i++){
        instanceIp = instanceIp + '.' +res[i];
      }
      brandIp = res[res.length-2]+'.'+res[res.length-1];
      this.setBrand(brandIp);
    }
    this.space = instanceIp;
    this.instance = instanceUrl;
    this.urls.resetPassword = `https://${this.instance}`;
    this.urls.signUp = `https://${this.instance}`;
    this.urls.SERVER_URL = `https://${this.instance}`;
    this.urls.WS_URL = `wss://${this.instance}/websocket`;
    
  }

};
