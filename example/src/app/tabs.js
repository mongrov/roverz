/**
 * Application specific Tab Scenes
 */

// Consts and Libs
import AppConfig from '@app/config';
// Components
import { ListViewNav } from 'roverz-chat';

// @todo: This piece of configuration to be moved mostly to
//    AppConfig.navbarProps (only app specific items and NavbarMenuButton)
const navbarPropsTabs = {
  ...AppConfig.navbarProps,
  renderLeftButton: () => null,
  instanceName: `${AppConfig.base.brandName}`,
  sceneStyle: {
    ...AppConfig.navbarProps.sceneStyle,
    paddingBottom: 50,
  },
};

const appTabs = [
  {
    key: 'groups',
    title: '', // navbarPropsTabs.instanceName,
    subTitle: 'Messages',
    component: 'ChatList',
    icon: 'message-text-outline',
    props: { navBar: ListViewNav },
  },
];

export default appTabs;
