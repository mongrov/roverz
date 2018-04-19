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
      // PhotoLibrary - file not using now
      // GroupView
    gV_subTitleText01: '#4B5155',
    gV_subTitleText02: '#7B8287',
    gV_subTitleMessage: '#7B8287',
    gV_badgeTextColor: 'white',
    gV_badgeContainerBg: '#37C7A1',
    gV_plusButtonShadowColor: '#000000',
    gV_toastTextColor: '#fff',
    gV_addIconColor: '#fff',
      // MemberDetailView
    mD_imageBg: 'rgba(0,0,0,0.05)',
    mD_dataContainerBorderTopColor: 'rgba(0,0,0,0.1)',
    mD_statusTextColor: 'rgba(0,0,0,0.5)',
    mD_statColor: 'rgba(0,0,0,0.3)',
      // MemberListView
    mL_detailViewBorderBottomColor: 'rgba(0,0,0,0.3)',
    mL_statColor: '#a8a8a8',
      // SearchRoomView
    sR_listStyleBg: '#fff',
      // AudioPlay
    aP_buttonBg: 'white',
    aP_containerBorderColor: '#d6d7da',
    aP_errorMessageColor: 'red',
    aP_sliderTintColor: '#a4bef2',
    aP_iconColor: '#FFF',
      // Bubble
    bubble_bubbleViewBg: 'rgba(0,0,0,0.5)',
    bubble_bubbleTextColor: '#000000',
    bubble_modalActionBg: 'rgba(0,0,0,0.6)',
    bubble_animatedBg: '#FFF',
    bubble_iconColor: '#FFF',
    bubble_likeTextColor: '#fff',
    bubble_replyWrapperBorderColor: 'rgba(0,0,0,0.1)',
      // CustomView - file not using now
      // MessageImage
    mI_mapViewBg: 'white',
    mI_playCircleIconColor: '#000',
    mI_activityIndicatorColor: '#AAA',
      // MessageImageView & ReplyMessageView
    mIV_bubbleStylRightTextColor: 'white',
    mIV_loadingIconColor: 'rgba(255,255,255,0.3)',
    mIV_deleteIconColor: '#FFF',
    mIV_popIconColor: '#FFF',
    mIV_thumbIconColor: '#b2b2b2',
    mIV_bubbleRightColor: '#FFF',
    mIV_inputToolbarSubViewBg: 'rgba(0,0,0,0.05)',
    mIV_inputToolbarSubViewBTC: 'rgba(0,0,0,0.15)',
    mIV_toolthumbIconColor: 'rgba(0,0,0,0.4)',
    mIV_composerInputStyleBg: '#FFF',
    mIV_renderComposerTextStyleBg: '#F5F5F5',
    mIV_renderContainerBg: '#fff',
    mIV_likeTextStyleColor: '#FFF',
    mIV_heartIconColor: '#FFF',
      // ReplyMessageView
    rMV_textDisplayBg: '#f0f0f0',
      // ChatRoomView
    room_photoIconColor: '#ff5608',
    room_videoIconColor: '#609',
    room_cameraIconColor: '#01bcd7',
    room_audioIconColor: '#0ba83a',
    room_footerTextColor: '#aaa',
    room_chatFooterTextColor: '#fff',
    room_footerViewBg: '#F3F3F3',
    room_sentBgColor: '#A7FED7',
    room_failedBgColor: '#F59F96',
    room_playlistAddIconColor: 'rgba(0,0,0,0.4)',
    room_placeholderTextColor: 'rgba(0,0,0,0.3)',
    room_textInputStyleBg: '#FFF',
    room_inputToolbarBg: '#f4f4f4',
    room_toastTextColor: '#fff',
    room_loadingIndicator: 'rgba(0,0,0,0.3)',
    room_containerBg: '#FFF',
      // SendImageMessage - file not using now
      // ChatNavBar
    cB_titleText: 'rgba(255,255,255,0.5)',
    cB_Icon: '#FFF',
    cB_statColor: '#a8a8a8',
    cB_iconColor: 'rgba(255, 255, 255, 0.7)',
    // Send
    sD_text: '#0084ff',
    // NavBarMessages
    nM_Icon: '#FFF',
    // NavBarBack
    nB_Icon: '#FFF',
     // NavBackAbs
    nA_style: 'white',
    nA_Icon: '#000',
    // ListViewNav
    lN_Icon: '#FFF',
    // ListItemAvatar
    lA_avatar: '#f0f0f0',
    // auth folder
       // LoginView
    lV_viewContainer: 'yellow',
    lV_workspaceTxt: '#FFF',
    lV_textWork: '#FFF',
    lV_ssoTxt: 'white',
    lV_formContainer: 'white',
    lV_signupBg: 'transparent',
    // SelectServer
    sS_textInput: '#F5F5F5',
    sS_loadText: 'rgba(255,255,255,0.7)',
    sS_workspace: '#FFF',
    sS_style: '#fff',
    // Register
    res_signBg: '#1855ba',
    //  Components
// ActivityIndicator.js
    aI_preloader: 'rgba(255,255,255,0.3)',

//  Error.js
    eR_iconColor: '#CCC',

//  Loading.js
    lD_style: 'rgba(255,255,255,0.75)',
    lD_animYesColor: '#000',
    lD_animNoColor: '#AAA',
//  ui
//  Alerts.js
    aT_msg_borderColor: '#1C854C',
    aT_msg_backgroundColor: '#59DC9A',
    aT_msgtextborderColor: '#16693c',
    aT_msgErrorborderColor: '#C02827',
    aT_msgErrorbackgroundColor: '#FB6567',
    aT_msgErrorTextColor: '#7f1a1a',
    aT_msgStatusBorderColor: '#408491',
    aT_msgStatusbackgroundColor: '#8EDBE5',
    aT_msgStatustextColor: '#2f606a',
//  Button.js
    bN_props: '#fff',
    // FormInput
    fI_containerStyle: 'rgba(255,255,255,0.05)',
    //  ProgressBar.js
    pB_progressTintColor: '#43D35D',
    pB_trackTintColor: '#DCDCDC',

// TabIcon.js
    tI_style: '#A3A3A3',

// TextInput.js
    tP_containerStyle: 'rgba(255,255,255,0.05)',
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
