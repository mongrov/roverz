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
    seventh: 'rgba(255,255,255,0.7)',
    eighth: 'rgba(255,255,255,0.5)',
    ninth: 'rgba(255,255,255,1)',
    // ImageGallery
    tenth: '#000',
    eleventh: 'rgba(0,0,0,0.05)',
    twelfth: 'rgba(0, 0, 0, 0.05)',
    thirteenth: 'rgba(0, 0, 0, 0.7)',
    // ImagePreview
    fourteenth: '#F5F5F5',
    fifteenth: 'rgba(0,0,0,0.4)',
    sixteenth: '#000',
    // Change Password
    seventeenth: '#FFF',
    eighteenth: '#FFF',
    // Crop Image
    nineteenth: 'blue',
    twentieth: 'white',
    // ProfileView
    twenty_first: 'rgba(255,255,255,0.3)',
    twenty_second: '#FFF',
    twenty_third: 'rgba(255,255,255,0.4)',
    // MenuView
    twenty_fourth: '#345291',
    twenty_fifth: '#EEEFF0',
    twenty_sixth: '#EEEFF0',
    twenty_seventh: 'rgba(255, 255, 255, 0.2)',
    // NavbarMenuButtonView
    twenty_eighth: '#FFF',
    // VideoPlayer
    twenty_ninth: '#000',
    thirtieth: 'rgba(143, 143, 143, 0.65)',
    thirty_first: 'rgba(255,255,255,0.75)',
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
