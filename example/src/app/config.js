/**
 * App Config
 */
/* global __DEV__ */
import { ModuleConfig, AppColors, AppStyles, AppSizes, AppAPI } from 'roverz-chat';
import DeviceInfo from 'react-native-device-info';

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
    ModuleConfig.appName = 'roverz';
    ModuleConfig.space = 'roverz';
    ModuleConfig.brand = 'mongrov.com';
    ModuleConfig.bootstrapUrl = 'roverz.mongrov.com';
    ModuleConfig.gaTrackingId = 'UA-110176262-1';
    ModuleConfig.init();
    ModuleConfig.setLogo(require('../images/logo.png'));  // eslint-disable-line global-require
    ModuleConfig.setNavLogo(require('../images/logo-flat.png'));  // eslint-disable-line global-require
    ModuleConfig.setFilterRooms([
      'support', 'exceptions',
    ]);

    // set user agent
    let ua = ModuleConfig.appName;
    try {
      // Build user agent string
      ua = `${ModuleConfig.appName} ` +
        `${DeviceInfo.getVersion()}; ${DeviceInfo.getSystemName()}  ` +
        `${DeviceInfo.getSystemVersion()}; ${DeviceInfo.getBrand()} ` +
        `${DeviceInfo.getDeviceId()}`;
    } catch (e) {
      // do nothing
    }
    AppAPI.setUserAgent(ua);
  },

  // Navbar Props
  navbarProps: {
    hideNavBar: false,
    titleStyle: AppStyles.navbarTitle,
    navigationBarStyle: [AppStyles.navbar, { backgroundColor: '#5986E1' }],
    leftButtonIconStyle: AppStyles.navbarButton,
    rightButtonIconStyle: AppStyles.navbarButton,
    sceneStyle: {
      backgroundColor: AppColors.background,
      paddingTop: AppSizes.navbarHeight,
    },
  },

};
