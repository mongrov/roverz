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
  brand() { return this.brandColors; },
  chat() { return this.chatColors; },
  setBrandColors(obj) {
    this.brandColors = obj;
  },
  setChatColors(obj) {
    this.chatColors = obj;
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
