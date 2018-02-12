/**
 * App Navigation
 */
import React from 'react';
import {
  StatusBar,
} from 'react-native';
import { Actions, Scene, ActionConst } from 'react-native-router-flux';

import {
  ChatNavBar,
  NavBarBack,
  RoomView,
  CameraActions,
  SearchRoomView,
  SearchListView,
  MessageImageView,
  ReplyMessageView,
  Placeholder,
  PhotoLibrary,
} from 'roverz-chat';

// Consts and Libs
import Application from '@app/config';
// Scenes
import AuthScenes from './auth';
import TabsScenes from './tabs';

/* Routes ==================================================================== */
export default Actions.create(
  <Scene key={'root'} {...Application.navbarProps}>

    {/* Auth */}
    {AuthScenes}

    {/* Main App */}
    <Scene
      key={'app'}
      {...Application.navbarProps}
      title={Application.base.appName}
      hideNavBar={false}
      type={ActionConst.RESET}
    >
      <StatusBar barStyle="light-content" />
      {/* Drawer Side Menu */}
      <Scene key={'home'} initial={'tabBar'}>
        {/* Tabbar */}
        {TabsScenes}
      </Scene>

      {/* Chat */}
      <Scene
        hideTabBar
        clone
        key={'chatDetail'}
        title={'Chat'}
        duration={0}
        navBar={ChatNavBar}
        component={RoomView}
        analyticsDesc={'ChatDetails: chat'}
      />

      {/* Search Room */}
      <Scene
        hideTabBar
        navBar={NavBarBack}
        clone
        key={'searchRoom'}
        title={'Search Users/Rooms'}
        component={SearchRoomView}
        analyticsDesc={'Member List'}
      />

      {/* SearchListView */}
      <Scene
        hideTabBar
        navBar={NavBarBack}
        clone
        key={'messageSearch'}
        title={'Message Search'}
        component={SearchListView}
        analyticsDesc={'Message Search'}
      />

      {/* CameraActions for Send Image */}
      <Scene
        hideTabBar
        hideNavBar
        key={'cameraActions'}
        title={'Photo Library'}
        component={CameraActions}
        analyticsDesc={'Camera Actions'}
      />

      {/* MessageImaeView for Chat room */}
      <Scene
        hideTabBar
        hideNavBar
        key={'imagePreview'}
        title={'Image Preview'}
        component={MessageImageView}
        analyticsDesc={'Image Preview'}
      />

      {/* Reply Message for Chat room */}
      <Scene
        hideTabBar
        hideNavBar
        key={'replyMessage'}
        title={'Reply Message'}
        component={ReplyMessageView}
        analyticsDesc={'Reply Message'}
      />

      {/* PhotoPreview for Send Image */}
      <Scene
        hideTabBar
        hideNavBar
        key={'photoLibrary'}
        title={'Photo Library'}
        component={PhotoLibrary}
        analyticsDesc={'Photo Library'}
      />

      {/* General */}
      <Scene
        clone
        key={'comingSoon'}
        title={'Coming Soon'}
        component={Placeholder}
        analyticsDesc={'Placeholder: Coming Soon'}
      />

      {/* ------------------------------- */}

      {Application.base.containers.map(item =>
        (<Scene
          key={item.key}
          {...item.props}
          hideNavBar={item.nav ? !item.nav : false}
          hideTabBar={item.tab ? !item.tab : false}
          navBar={item.navBar ? item.navBar : null}
          title={item.title}
          subTitle={item.subTitle}
          component={item.component}
          analyticsDesc={item.title}
        />))
      }

    </Scene>
  </Scene>,
);
