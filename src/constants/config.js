/**
 * Module App Config
 */
/* global __DEV__ */
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
import * as Containers from '../containers';

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
  filterRoomList: [],
  containers: [],

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

  get filterRooms() {
    return this.filterRoomList;
  },

  // URLs
  urls: {
    resetPassword: null,
    signUp: null,
    SERVER_URL: null,
    WS_URL: null,
  },

  addContainer(key, title, subTitle, component, analyticsDesc) {
    const c = {
      key,
      title,
      subTitle,
      component,
      analyticsDesc,
    };
    this.containers.push(c);
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
    if (this.containers.length === 0) {
      // lets init reusable containers
      this.addContainer('aboutView', 'About', '', Containers.AboutView, 'About View');
      this.addContainer('profileView', 'Profile', '', Containers.ProfileView, 'Profile View');
      this.addContainer('imageGallery', 'Image Preview', '', Containers.ImageGallery, 'Image Preview');
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

  setFilterRooms(filterList) {
    this.filterRoomList = filterList;
  },

  reset(space) {
    this.space = space;
    this.instance = `${this.space}.${this.brand}`;
    this.resetInstance(this.instance);
  },

  resetInstance(instanceUrl) {
    const noOfDots = (instanceUrl.match(/\./g) || []).length;
    let instanceIp = instanceUrl; // x.y.m.com
    let brandIp = this.brand;
    let resetInstanceUrl = '';
    if (noOfDots <= 1) {
      resetInstanceUrl = `${instanceIp}.${this.brand}`;
    } else {
      const res = instanceUrl.split('.'); // [x,y,m,com]
      instanceIp = res[0]; // x
      let i;
      let newInstanceIp = '';
      for (i = 1; i < res.length; i += 1) {
        newInstanceIp = `${newInstanceIp}.${res[i]}`; // .m.com
      }
      brandIp = `${res[res.length - 2]}.${res[res.length - 1]}`; // m.com
      instanceIp = instanceUrl.replace(`.${brandIp}`, '');
      resetInstanceUrl = instanceUrl;
      this.setBrand(brandIp);
    }
    // console.log('Resetting instance to:', instanceIp, resetInstanceUrl);
    this.space = instanceIp;
    this.instance = resetInstanceUrl;
    this.urls.resetPassword = `https://${this.instance}`;
    this.urls.signUp = this.urls.resetPassword;
    this.urls.SERVER_URL = this.urls.resetPassword;
    this.urls.WS_URL = `wss://${this.instance}/websocket`;
  },

};
