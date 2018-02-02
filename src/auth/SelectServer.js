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
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import AppUtil from '../lib/util';

import { Alerts, Spacer, Button } from '../components/ui/';
import Network from '../network';
import t from '../i18n';
import { AppColors, AppStyles } from '../theme/';
import Application from '../constants/config';

const styles = StyleSheet.create({
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
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  logo: { opacity: 1 },
  loadText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  centerAll: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workspace: { color: '#FFF', fontSize: 16 },
});

export default class SelectServer extends React.Component {
  constructor(props) {
    super(props);
    this._service = new Network();
    this._mounted = false;
    const switchServer = props.switchServer;
    this.state = {
      isLoading: true,
      loadText: t('loading'),
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
    this._service.onLogin(() => {
      if (this._mounted && this._service.service.loggedInUser) {
//        this._service.switchToLoggedInUser();
        Actions.app({ type: 'reset' });
      }
    });
    // Get server name
    setTimeout(() => {
      if (this._mounted) {
        const serverUrl = this._service.getServer();
        if (serverUrl && !this.state.switchServer) {
          Application.resetInstance(serverUrl);
          this.connectToServer(serverUrl);
        } else {
          this.setState({ isLoading: false });
        }
      }
    }, 100);
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  settingsCallback = (data) => {
    if (this._mounted) {
      if (!data) {
        // error, no settings could be fetched
        this.setState({ isLoading: false });
      } else {
        Actions.login({ type: 'reset' });
      }
    }
  }

  connectToServer(serverUrl) {
    AppUtil.debug(new Date().toLocaleString(), '[Performance] SelectServer');
    this._service.setServer(serverUrl, this.settingsCallback);
    if (this._service.db.realm) {
      // data base loaded, lets go straight to home
      Actions.app({ type: 'reset' });
      return;
    }
    // if login happens before timeout, switch gears to logged in screen
    const loadStrings = [
      t('loading_text_init_screens'),
      t('loading_text_conn_to_server'),
      t('loading_text_still_reaching'),
      t('dots'),
    ];
    // don't increase this timeout as this would impact the experience of folks
    // who are logging in for the first time
    for (let i = 0; i < loadStrings.length; i += 1) {
      setTimeout(() => {
        if (this._mounted) {
          if (i === loadStrings.length - 1) {
            if (!this._service.isConnected) {
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
    const inputServerVal = this.state.serverUrl ? this.state.serverUrl.trim() : undefined;
    // inputServerVal = inputServerVal.trim();
    // Validation for alphanumeric, dash and dots
    if (inputServerVal) {
//      inputServerVal = inputServerVal.replace(`.${Application.brandName}`, '');
      const regexp = /^[a-zA-Z0-9-.]+$/;
      if (regexp.test(inputServerVal)) {
        Application.resetInstance(inputServerVal);
        this.setState({
          isLoading: true,
          resultMsg: {
            status: '',
            success: '',
            error: '',
          },
        });
        this.connectToServer(Application.instance);
      } else {
        this.setState({ resultMsg: { error: t('err_enter_valid_workspace') } });
      }
    } else {
      this.setState({ resultMsg: { error: t('err_workspace_name_empty') } });
    }
  };

  render() {
    return (
      <View
        style={[styles.viewContainer, { backgroundColor: AppColors.brand().secondary }]}
        testID={'welcome'}
      >
        <StatusBar barStyle="light-content" />
        {this.state.isLoading === true &&
        <View style={[AppStyles.windowSize, AppStyles.containerCentered]}>
          <Image
            source={Application.logo}
            style={[AppStyles.loginLogoSplash, styles.logo]}
          />
          <Text
            style={[styles.loadText, AppStyles.baseFont]}
          >{this.state.loadText}</Text>
        </View>
        }
        {this.state.isLoading === false &&
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
        >
          <KeyboardAvoidingView
            behavior={'position'}
            style={styles.messageContainer}
          >
            <View style={[AppStyles.row]}>
              <View style={[styles.centerAll]}>
                <Image
                  source={Application.logo}
                  style={[AppStyles.loginLogoSplash]}
                />
                <Alerts
                  error={this.state.resultMsg.error}
                />
                <Text style={
                [AppStyles.ListItemTitle, styles.workspace]
                }
                >{t('lbl_enter_your_workspace')}</Text>
              </View>
            </View>
            <View style={[AppStyles.row]}>
              <View style={[AppStyles.flex1, { height: 40 }]}>
                <TextInput
                  placeholder={`[workspace].${Application.brandName}`}
                  autoCapitalize={'none'}
                  style={[styles.textInput, AppStyles.baseFont]}
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
                  title={t('confirm')}
                  onPress={this.sendServerUrl}
                  backgroundColor="transparent"
                />
              </View>
            </View>
            <View style={[AppStyles.row, { alignItems: 'center', justifyContent: 'center' }]}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  paddingHorizontal: 15,
                  paddingVertical: 2,
                  marginTop: 20,
                  borderColor: '#fff',
                  borderRadius: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => Actions.pop({ type: 'reset' })}
              >
                <Text
                  style={[AppStyles.ListItemTitle, styles.workspace]}
                >{t('txt_back')}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          </ScrollView>
        }
      </View>
    );
  }
}

SelectServer.defaultProps = {
  switchServer: false,
};

SelectServer.propTypes = {
  switchServer: PropTypes.bool,
};
