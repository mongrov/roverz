/**
 * Global App Config
 */
/* global __DEV__ */
import { AppColors, AppStyles, AppSizes } from '@theme/';

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

  get brandName() {
    return this.brand;
  },

  // URLs
  urls: {
    resetPassword: null,
    signUp: null,
    SERVER_URL: null,
    PREFERENCES_URL: null,
    METEOR_URL: null,
  },

  init() {
    if (this.instance == null) {
      this.reset(this.space);
    }
  },

  setUserId(uid) {
    this.userId = uid;
  },

  reset(space) {
    this.space = space;
    this.instance = `${this.space}.${this.brand}`;
    this.urls.signUp = `https://${this.instance}`;
    this.urls.SERVER_URL = `https://${this.instance}`;
    this.urls.PREFERENCES_URL = `https://${this.instance}/account/preferences`;
    this.urls.METEOR_URL = `wss://${this.instance}/websocket`;
  },

  // Navbar Props
  navbarProps: {
    hideNavBar: false,
    titleStyle: AppStyles.navbarTitle,
    navigationBarStyle: AppStyles.navbar,
    leftButtonIconStyle: AppStyles.navbarButton,
    rightButtonIconStyle: AppStyles.navbarButton,
    sceneStyle: {
      backgroundColor: AppColors.background,
      paddingTop: AppSizes.navbarHeight,
    },
  },
};
