/**
 * App Theme - Colors
 *
 */

const app = {
  background: '#E9EBEE',
  cardBackground: '#FFFFFF',
  listItemBackground: '#FFFFFF',
};

const brand = {
  brandColors: {
    primary: '#373856',
    secondary: '#50527F',
    third: '#7377C9',
    fourth: '#7D7FA7',
    fifth: '#636AFF',
    sixth: '#4C4D75',
    // aboutview
    aV_paraText: 'rgba(255,255,255,0.7)',
    aV_paraTextLight: 'rgba(255,255,255,0.5)',
    aV_headText: 'rgba(255,255,255,1)',
    // ImageGallery
    iG_containerBg: '#000',
    iG_captionContainerBg: 'rgba(0,0,0,0.05)',
    iG_captionTextColor: 'white',
    iG_headerBg: 'rgba(0, 0, 0, 0.05)',
    iG_galleryCountBg: 'rgba(0, 0, 0, 0.7)',
    iG_galleryTextColor: 'white',
    iG_errorBg: 'black',
    iG_errorTextColor: 'white',
    // ImagePreview
    iP_textInputBg: '#F5F5F5',
    iP_keyboardViewBg: 'rgba(0,0,0,0.4)',
    iP_arrowbackColor: '#000',
    // Change Password
    cP_logoutTextColor: '#FFF',
    cP_subContainerBg: '#FFF',
    // Crop Image
    cI_buttonBg: 'blue',
    cI_textColor: 'white',
    // ProfileView
    pV_logoutBorderBottomColor: 'rgba(255,255,255,0.3)',
    pV_logoutTextColor: '#FFF',
    pV_iconColor: 'rgba(255,255,255,0.4)',
    // MenuView
    mV_menuBg: '#345291',
    mV_menuItem_textColor: '#EEEFF0',
    mV_menuBottom_textColor: '#EEEFF0',
    mV_avatarImageBc: 'rgba(255, 255, 255, 0.2)',
    // NavbarMenuButtonView
    nav_iconColor: '#FFF',
    // VideoPlayer
    vP_containerBg: '#000',
    vP_backButtonBg: 'rgba(143, 143, 143, 0.65)',
    vP_iconColor: 'rgba(255,255,255,0.75)',
    // chat folder
      // AttachAudio
    aA_textColor: '#fff',
    aA_sendIconColor: 'green',
    aA_cancelColor: 'red',
      // AudioUpload - file not using now
      // CameraActions
    cA_bottomOverlayBg: 'rgba(0,0,0,0.4)',
    cA_captureButtonBg: 'white',
    cA_closeButtonBg: 'white',
    cA_textInputBg: '#F5F5F5',
    cA_timerViewBg: 'red',
    cA_timerTextColor: '#fff',
    cA_videoRecorderBg: 'red',
    cA_camUnderlayColor: 'rgba(0,0,0,0.3)',
    cA_cameraIconColor: '#000',
    cA_closeIconColor: '#000',
  },
  chatColors: {
    bubbleLeft: '#f0f0f0',
    textLeft: '#000',
    linkLeft: '#0000EE',
    bubbleRight: '#0084ff',
    textRight: '#FFF',
    linkRight: '#FFF',
    replyBubbleL: 'rgba(0,0,0,0.07)',
    replyTextL: 'rgba(0,0,0,0.6)',
    replyBubbleR: 'rgba(255,255,255,0.1)',
    replyTextR: 'rgba(255,255,255,0.6)',
  },
  statusColors: {
    online: '#35ac19',
    away: '#fcb316',
    busy: '#d30230',
    default: '#a8a8a8',
  },
  avatarColors: ['#339194',
    '#93a42a', '#cac640', '#fb6b41', '#a70267', '#0065a4', '#76787a',
    '#76787a', '#65a400', '#2fadd2', '#2a53c3', '#613177'],
  brand() { return this.brandColors; },
  chat() { return this.chatColors; },
  status() { return this.statusColors; },
  avatar() { return this.avatarColors; },
  setBrandColors(obj) {
    this.brandColors = obj;
  },
  setChatColors(obj) {
    this.chatColors = obj;
  },
  setAvatarColors(array) {
    this.avatarColors = array;
  },
};

const text = {
  textPrimary: '#222222',
  textSecondary: '#777777',
  headingPrimary: brand.brand().primary,
  headingSecondary: brand.brand().primary,
  brandP: '#63659c',
  brandS: '#50527F',
  brandT: '#6b6b6b',
};

const borders = {
  border: '#D0D1D5',
};

const tabbar = {
  tabbar: {
    background: '#E9EAEF',
    iconDefault: '#8C8C8C',
    iconSelected: '#787BC6',
  },
};

export default {
  ...app,
  ...brand,
  ...text,
  ...borders,
  ...tabbar,
};
