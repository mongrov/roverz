/**
 * App Config
 */
/* global __DEV__ */
import { ModuleConfig, AppColors, AppStyles, AppSizes, AppAPI } from 'roverz-chat';

export default {

  // Build Configuration - eg. Debug or Release?
  DEV: __DEV__,

  // use this to access all ModuleConfig configurations
  get base() {
    return ModuleConfig;
  },

  // initialize ModuleConfig constants here
  init() {
    // @todo - set these variables to app specific config
    ModuleConfig.appName = 'demo';
    ModuleConfig.space = 'demo';
    ModuleConfig.brand = 'mongrov.com';
    ModuleConfig.bootstrapUrl = 'demo.mongrov.com';
    ModuleConfig.gaTrackingId = (__DEV__) ? 'UA-84284256-2' : 'UA-84284256-1';
    ModuleConfig.init();
    ModuleConfig.setLogo(require('../images/logo.png'));  // eslint-disable-line global-require
    
    // set user agent
    let ua = ModuleConfig.appName;
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
