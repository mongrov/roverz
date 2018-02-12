/**
 * Application specific Tab Scenes
 */
import React from 'react';
// Consts and Libs
import AppConfig from '@app/config';
// Components
import { ListViewNav, NavbarMenuButton } from 'roverz-chat';

const navbarPropsTabs = {
  ...AppConfig.navbarProps,
  renderLeftButton: () => <NavbarMenuButton />,
  instanceName: `${AppConfig.base.brandName}`,
  sceneStyle: {
    ...AppConfig.navbarProps.sceneStyle,
    paddingBottom: 50,
  },
};

const appTabs = [
  {
    key: 'groups',
    title: '',
    subTitle: 'Messages',
    component: 'ChatList',
    icon: 'message-text-outline',
    props: { navBar: ListViewNav },
  }
];

export default appTabs;
