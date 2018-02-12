/**
 * Tabs Scenes
 */
import React from 'react';
import { Scene } from 'react-native-router-flux';
import {
  TabIcon,
  WebView,
  Placeholder,
  AppStyles,
  GroupList,
  ProfileView,
  SupportGroup,
} from 'roverz-chat';

// Scenes
import AppTabs from '@app/tabs';

/* @todo component naming mapper. ideally we should refine our component name
 * to be the same
*/
function getComponent(name) {
  switch (name) {
    case 'ProfileView': return ProfileView;
    case 'ChatList': return GroupList;  // lets update code on load
    case 'PlaceHolder': return Placeholder;
    case 'WebView': return WebView;
    default: return null;
  }
}

/* Routes ==================================================================== */
const scenes = (
  <Scene key={'tabBar'} tabs tabBarIconContainerStyle={AppStyles.tabbar} pressOpacity={0.95}>
    {AppTabs.map(item =>
      (<Scene
        key={item.key}
        {...item.props}
        title={item.title}
        subTitle={item.subTitle}
        duration={0}
        component={getComponent(item.component)}
        icon={props => TabIcon({ ...props, icon: item.icon })}
        analyticsDesc={item.title}
      />))
    }
  </Scene>
);

export default scenes;
