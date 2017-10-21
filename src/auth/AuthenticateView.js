/**
 * Authenticate Screen
 *  - Entry screen for all authentication
 *  - User can tap to login, forget password, signup...
 */
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

// Components
import { Spacer, Text, Button } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  background: {
    backgroundColor: 'transparent',
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
  },
  logo: {
    width: AppSizes.screen.width * 0.85,
    resizeMode: 'contain',
  },
  whiteText: {
    color: '#FFF',
  },
});

/* Component ==================================================================== */
class Authenticate extends Component {
  static componentName = 'Authenticate';
  /* eslint-disable global-require */
  render = () => (
    <View
      style={[AppStyles.containerCentered, AppStyles.container, styles.background]}
    >
      <View
        style={[AppStyles.containerCentered, AppStyles.container, styles.background]}
        backgroundColor="#373856"
      >
        <Image
          source={require('../../images/logo.png')}
          style={[AppStyles.loginLogo]}
        />
      </View>
      <Spacer size={50} />
      <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
        <View style={[AppStyles.flex1, AppStyles.loginButtonBig]}>
          <Button
            title={'Login'}
            icon={{ name: 'lock' }}
            onPress={Actions.login}
            backgroundColor="transparent"
            style={[]}
          />
        </View>
      </View>

      <Spacer size={10} />

      <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
        <View style={[AppStyles.flex1, AppStyles.loginButtonBig]}>
          <Button
            title={'Sign up'}
            icon={{ name: 'face' }}
            onPress={Actions.signUp}
            backgroundColor="transparent"
            style={[]}
          />
        </View>
      </View>

      <Spacer size={15} />

      <Text p style={[AppStyles.textCenterAligned, styles.whiteText]}>
        - or -
      </Text>

      <Spacer size={10} />

      <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
        <View style={[AppStyles.flex1]} />
        <View style={[AppStyles.flex2, AppStyles.loginButton]}>
          <Button
            small
            title={'Skip'}
            onPress={Actions.app}
            raised={false}
            backgroundColor="transparent"
            style={[]}
          />
        </View>
        <View style={[AppStyles.flex1]} />
      </View>

      <Spacer size={40} />
    </View>
  )
  /* eslint-enable global-require */
}

/* Export Component ==================================================================== */
export default Authenticate;
