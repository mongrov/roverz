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
} from 'roverz-chat';
// import { AddressBook } from 'roverz-contacts';
// import { MapStyle } from 'roverz-geo';
// import { EventAgenda, AgendaScreen } from 'roverz-event';
// import { MapTracking } from 'roverz-container-geolocation';

// Scenes
// import SocialFeed from '@social/AggregatedFeed';
import AppTabs from '@app/tabs';
// import NewsList from './news';

/* @todo component naming mapper. ideally we should refine our component name
 * to be the same
*/
function getComponent(name) {
  switch (name) {
    case 'ChatList': return GroupList;
    // case 'SocialFeed': return SocialFeed;
    // case 'EventSchedule': return EventAgenda;
    // case 'GeoTracking': return MapTracking;
    // case 'MyAgenda': return AgendaScreen;
    // case 'MapsWithPOI': return MapStyle;
    // case 'AddressBook': return AddressBook;
    case 'PlaceHolder': return Placeholder;
    case 'WebView': return WebView;
    // case 'NewsList': return NewsList;
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
