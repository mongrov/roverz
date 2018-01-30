/**
 * App Styles
 */
import { Platform } from 'react-native';

import Colors from './colors';
import Fonts from './fonts';
import Sizes from './sizes';

export default {
  appContainer: {
    backgroundColor: '#000',
  },

  // Default
  container: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.background,
  },
  socialContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  listContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.background,
    paddingTop: 65,
  },
  containerCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  windowSize: {
    height: Sizes.screen.height,
    width: Sizes.screen.width,
  },
  windowWidth: {
    width: Sizes.screen.width,
  },
  windowWidthPad: {
    width: Sizes.screen.width - 20,
  },
  loginContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.background,
  },

  // Aligning items
  leftAligned: {
    alignItems: 'flex-start',
  },
  centerAligned: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAligned: {
    alignItems: 'flex-end',
  },

  // Text Styles
  baseFont: {
    fontFamily: Fonts.base.family,
  },
  baseText: {
    fontFamily: Fonts.base.family,
    fontSize: Fonts.base.size,
    lineHeight: Fonts.base.lineHeight,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  ListItemTitle: {
    fontFamily: Fonts.base.family,
    fontSize: Fonts.base.size,
    color: Colors.textPrimary,
    fontWeight: '400',
    height: 25,
    marginBottom: 2,
  },
  p: {
    fontFamily: Fonts.base.family,
    fontSize: Fonts.base.size,
    lineHeight: Fonts.base.lineHeight,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: 8,
  },
  h1: {
    fontFamily: Fonts.h1.family,
    fontSize: Fonts.h1.size,
    lineHeight: Fonts.h1.lineHeight,
    color: Colors.headingPrimary,
    fontWeight: '800',
    margin: 0,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  h2: {
    fontFamily: Fonts.h2.family,
    fontSize: Fonts.h2.size,
    lineHeight: Fonts.h2.lineHeight,
    color: Colors.headingPrimary,
    fontWeight: '800',
    margin: 0,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  h3: {
    fontFamily: Fonts.h3.family,
    fontSize: Fonts.h3.size,
    lineHeight: Fonts.h3.lineHeight,
    color: Colors.headingPrimary,
    fontWeight: '500',
    margin: 0,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  h4: {
    fontFamily: Fonts.h4.family,
    fontSize: Fonts.h4.size,
    lineHeight: Fonts.h4.lineHeight,
    color: Colors.headingPrimary,
    fontWeight: '800',
    margin: 0,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  h5: {
    fontFamily: Fonts.h5.family,
    fontSize: Fonts.h5.size,
    lineHeight: Fonts.h5.lineHeight,
    color: Colors.headingPrimary,
    fontWeight: '800',
    margin: 0,
    marginTop: 4,
    marginBottom: 4,
    left: 0,
    right: 0,
  },
  strong: {
    fontWeight: '900',
  },
  link: {
    textDecorationLine: 'underline',
    color: Colors.brand().primary,
  },
  subtext: {
    fontFamily: Fonts.base.family,
    fontSize: Fonts.base.size * 0.8,
    lineHeight: parseInt(Fonts.base.lineHeight * 0.8, 10),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  subtext1: {
    fontFamily: Fonts.base.family,
    fontSize: Fonts.base.size * 0.7,
    lineHeight: parseInt(Fonts.base.lineHeight * 0.8, 10),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 5,
  },
  // Helper Text Styles
  textCenterAligned: {
    textAlign: 'center',
  },
  textRightAligned: {
    textAlign: 'right',
  },
  memberListTitle: {
    fontFamily: Fonts.base.family,
    fontSize: 16,
    color: Colors.headingPrimary,
    fontWeight: '400',
  },
  memberListSubTitle: {
    fontFamily: Fonts.base.family,
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '400',
  },
  memberDetailsLG: {
    fontFamily: Fonts.base.family,
    fontSize: 30,
    color: Colors.brand().secondary,
    fontWeight: '300',
  },
  memberDetailsMD: {
    fontFamily: Fonts.base.family,
    fontSize: 16,
    color: Colors.brand().third,
    fontWeight: '400',
  },
  memberDetailsSM: {
    fontFamily: Fonts.base.family,
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '400',
  },

  // Give me padding
  padding: {
    paddingVertical: Sizes.padding,
    paddingHorizontal: Sizes.padding,
  },
  paddingHorizontal: {
    paddingHorizontal: Sizes.padding,
  },
  paddingLeft: {
    paddingLeft: Sizes.padding,
  },
  paddingRight: {
    paddingRight: Sizes.padding,
  },
  paddingVertical: {
    paddingVertical: Sizes.padding,
  },
  paddingTop: {
    paddingTop: Sizes.padding,
  },
  paddingBottom: {
    paddingBottom: Sizes.padding,
  },
  paddingSml: {
    paddingVertical: Sizes.paddingSml,
    paddingHorizontal: Sizes.paddingSml,
  },
  paddingHorizontalSml: {
    paddingHorizontal: Sizes.paddingSml,
  },
  paddingLeftSml: {
    paddingLeft: Sizes.paddingSml,
  },
  paddingRightSml: {
    paddingRight: Sizes.paddingSml,
  },
  paddingVerticalSml: {
    paddingVertical: Sizes.paddingSml,
  },
  paddingTopSml: {
    paddingTop: Sizes.paddingSml,
  },
  paddingBottomSml: {
    paddingBottom: Sizes.paddingSml,
  },

  // General HTML-like Elements
  hr: {
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 1,
    backgroundColor: 'transparent',
    marginTop: Sizes.padding,
    marginBottom: Sizes.padding,
  },

  // Grid
  row: {
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  flex5: {
    flex: 5,
  },
  flex6: {
    flex: 6,
  },

  // Navbar
  navbarHeight: {
    height: Sizes.navbarHeight,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
  },
  navbar: {
    backgroundColor: Colors.brand().secondary,
    borderBottomWidth: 0,
  },
  navbarTitle: {
    color: '#ffffff',
    fontWeight: 'normal',
    fontFamily: Fonts.base.family,
    fontSize: 16,
  },
  navbarButton: {
    tintColor: '#ffffff',
  },

  // TabBar
  tabbar: {
    backgroundColor: Colors.tabbar.background,
    borderColor: Colors.border,
    borderRightColor: Colors.border,
    borderTopWidth: 1,
    borderRightWidth: 1,
    height: 60,
  },

  // Login
  loginLogo: {
    width: 270,
    resizeMode: 'contain',
  },
  loginLogoSplash: {
    width: 270,
    resizeMode: 'contain',
  },
  loginButton: {
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: Colors.brand().third,
  },
  loginButtonBig: {
    borderRadius: 35,
    borderWidth: 1,
    height: 50,
    borderColor: Colors.brand().third,
    backgroundColor: Colors.brand().third,
  },
  selectServerButton: {
    borderRadius: 5,
    height: 50,
    borderColor: Colors.brand().third,
    backgroundColor: Colors.brand().third,
  },
  loginButtonSmall: {
    borderRadius: 35,
    borderWidth: 1,
    height: 30,
    width: 100,
    borderColor: Colors.brand().third,
    backgroundColor: Colors.brand().third,
  },
  listItemTest: {
    backgroundColor: Colors.brand().third,
  },
};
