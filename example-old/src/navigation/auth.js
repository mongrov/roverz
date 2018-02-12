/**
 * Auth Scenes
 */
import React from 'react';
import { Scene } from 'react-native-router-flux';
import { StatusBar } from 'react-native';

// Consts and Libs
import AppConfig from '@app/config';

// Scenes
import {
  AuthLogin,
  SelectServer,
} from 'roverz-chat';

/* Routes ==================================================================== */
const scenes = (

  <Scene key={'authenticate'}>
    <StatusBar barStyle="light-content" />
    <Scene
      clone
      hideNavBar
      hideTabBar
      key={'chooseInstance'}
      title={'Coming Soon'}
      component={SelectServer}
      analyticsDesc={'Placeholder: Coming Soon'}
    />
    <Scene
      // {...AppConfig.navbarProps}
      hideNavBar
      hideTabBar
      key={'login'}
      title={'Login'}
      clone
      component={AuthLogin}
      analyticsDesc={'AuthLogin: Login'}
    />
  </Scene>
);

export default scenes;
