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
  AuthWebView,
  AuthLogin,
  SelectServer,
  SamlLogin,
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
    <Scene
      clone
      hideNavBar
      hideTabBar
      key={'samlLogin'}
      title={'SAML Login'}
      component={SamlLogin}
      analyticsDesc={'SSO: SAML Login'}
    />
    <Scene
      {...AppConfig.navbarProps}
      key={'signUp'}
      title={'Sign Up'}
      clone
      component={AuthWebView}
      url={AppConfig.base.urls.signUp}
      analyticsDesc={'AuthWebView: Sign Up'}
    />
    <Scene
      {...AppConfig.navbarProps}
      key={'passwordReset'}
      title={'Password Reset'}
      clone
      component={AuthWebView}
      url={AppConfig.base.urls.resetPassword}
      analyticsDesc={'AuthWebView: Password Reset'}
    />
  </Scene>
);

export default scenes;
