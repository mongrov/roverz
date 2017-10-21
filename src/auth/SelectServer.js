import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  Platform,
  StatusBar,
  Image,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Network from '@network';
import Meteor from 'react-native-meteor';
import { Alerts, Spacer, Button, AppUtil } from 'roverz-chat';

import { AppColors, AppStyles } from '@theme/';
import AppConfig from '@app/config';

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  closeButton: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: (Platform.OS === 'ios') ? 16 : 0,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    padding: 10,
    height: 40,
    flex: 1,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  sendButton: {
    height: 40,
    width: 40,
  },
  buttonsSpace: {
    width: 30,
  },
});

// todo
// - input should be taken (maybe) similar to website [].brandName
// -
export default class SelectServer extends React.Component {
  constructor(props) {
    super(props);
    this._net = new Network();
    const switchServer = props.switchServer;
    this.state = {
      isLoading: true,
      loadText: 'Loading...',
      switchServer,
      serverUrl: '',
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
    };
  }

  componentDidMount() {
    Meteor.getData().on('onLogin', () => {
      if (this._mounted && this._net.meteor.getCurrentUser()) {
        this._net.switchToLoggedInUser();
        Actions.app({ type: 'reset' });
      }
    });
    // Get server name
    setTimeout(() => {
      const serverUrl = this._net.getServer();
      if (serverUrl && !this.state.switchServer) {
        this.connectToServer(serverUrl);
      } else {
        this.setState({ isLoading: false });
      }
    }, 100);
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  settingsCallback = (data) => {
    // console.log('***** settings came back*****');
    // console.log(data);
    if (this._mounted) {
      if (!data) {
        // error, no settings could be fetched
        this.setState({ isLoading: false });
      } else {
        Actions.login();
      }
    }
  }

  connectToServer(serverUrl) {
    AppUtil.debug(new Date().toLocaleString(), '[Performance] SelectServer');
    this._net.setServer(serverUrl, this.settingsCallback);
    if (this._net.db.realm) {
      // data base loaded, lets go straight to home
      Actions.app({ type: 'reset' });
      return;
    }
    // if login happens before timeout, switch gears to logged in screen
    const loadStrings = [
      'Initializing screens',
      'Connecting to server...',
      'Still reaching out to server...',
      '...',
    ];
    // don't increase this timeout as this would impact the experience of folks
    // who are logging in for the first time
    for (let i = 0; i < loadStrings.length; i += 1) {
      setTimeout(() => {
        if (this._mounted) {
          if (i === loadStrings.length - 1) {
            const meteorStatus = Meteor.status();
            if (!meteorStatus.connected) {
              // we should throw exception to user and ask to selectserver
              this.setState({ isLoading: false });
            }
          }
          this.setState({
            loadText: loadStrings[i],
          });
        }
      }, (2000 * (i + 1)));
    }
  }

  sendServerUrl = () => {
    let inputServerVal = this.state.serverUrl ? this.state.serverUrl : undefined;
    inputServerVal = inputServerVal.trim();
    // Validation for alphanumeric, dash and dots
    const regexp = /^[a-zA-Z0-9-.]+$/;
    if (inputServerVal) {
      inputServerVal = inputServerVal.replace(`.${AppConfig.base.brandName}`, '');
      if (regexp.test(inputServerVal)) {
        this.setState({ isLoading: true });
        this.connectToServer(inputServerVal);
        // Method to verify Server URL
        // this._net.setServer(inputServerVal, this.settingsCallback);
        // Actions.login();
        // Actions.ssoTest();
      } else {
        this.setState({ resultMsg: { error: 'Enter a valid workspace name' } });
      }
    } else {
      this.setState({ resultMsg: { error: 'Workspace name is empty' } });
    }
  };

  /* eslint-disable global-require */
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: AppColors.brand.secondary,
          padding: 15,
        }}
      >
        <StatusBar barStyle="light-content" />
        {this.state.isLoading === true &&
        <View style={[AppStyles.windowSize, AppStyles.containerCentered]}>
          <Image
            source={require('../images/logo.png')}
            style={[AppStyles.loginLogoSplash, { opacity: 1, width: 150 }]}
          />
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'OpenSans-Regular',
              color: 'rgba(255,255,255,0.7)',
            }}
          >{this.state.loadText}</Text>
        </View>
        }
        {this.state.isLoading === false &&
          <KeyboardAvoidingView
            behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
            style={styles.messageContainer}
          >
            <View style={[AppStyles.row]}>
              <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              >
                <Image
                  source={require('../images/logo.png')}
                  style={[AppStyles.loginLogoSplash]}
                />
                <Alerts
                  error={this.state.resultMsg.error}
                />
                <Text style={
                [AppStyles.ListItemTitle, { color: '#FFF', fontSize: 16 }]
                }
                >Please enter your workspace name</Text>
              </View>
            </View>
            <View style={[AppStyles.row]}>
              <View style={[AppStyles.flex1, { height: 40 }]}>
                <TextInput
                  placeholder={`[workspace].${AppConfig.base.brandName}`}
                  autoCapitalize={'none'}
                  style={[styles.textInput]}
                  onChangeText={(text) => { this.setState({ serverUrl: text }); }}
                  value={this.state.serverUrl}
                  underlineColorAndroid={'transparent'}
                  autoCorrect={false}
                />
              </View>
            </View>
            <Spacer size={20} />
            <View style={[AppStyles.row]}>
              <View style={[AppStyles.flex1]}>
                <Button
                  title={'Confirm'}
                  onPress={this.sendServerUrl}
                  backgroundColor="transparent"
                  style={{ marginBottom: 10 }}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        }
      </View>
    );
  }
}
/* eslint-enable global-require */

SelectServer.defaultProps = {
  switchServer: false,
};

SelectServer.propTypes = {
  switchServer: React.PropTypes.bool,
};
