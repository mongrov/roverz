/**
 * Login Screen
 */
import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import AppUtil from '../../lib/util';

import { Alerts, Spacer, Text, Button } from '../../components/ui/';
import Preloader from '../../components/general/ActivityIndicator';
import t from '../../i18n/';
import Network from '../../network';
import { AppStyles, AppColors } from '../../theme/';
import Application from '../../constants/config';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  ssoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 5,
    marginBottom: 15,
  },
  ssoParent: {
    padding: 30,
    paddingBottom: 50,
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: { flex: 1, marginTop: 30 },
  workspaceBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginBottom: 15,
  },
  workspaceTxt: {
    fontSize: 15,
    color: '#FFF',
  },
  formContainer: { backgroundColor: 'white' },
  textWork: {
    fontSize: 12,
    color: '#FFF',
  },
});

/* Component ==================================================================== */
class Login extends Component {
  static componentName = 'Login';

  static propTypes = {
    login: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    // username Email Validation
    const validEmail = FormValidation.refinement(
      FormValidation.String, (email) => {
        if (email.trim().length < 3) return false;
        return true;
      },
    );

    // Password Validation - Must be 6 chars long
    const validPassword = FormValidation.refinement(
      FormValidation.String, (password) => {
        if (password.length < 6) return false;
        return true;
      },
    );

    this._service = new Network();
    const serverUrl = '';

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
      style: [AppStyles.windowSize, AppStyles.containerCentered],
      serverUrl,
      loading: true,
      showForm: false,
      showSSO: false,
      ssoText: t('lbl_sso'),
      form_fields: FormValidation.struct({
        Email_or_Username: validEmail,
        Password: validPassword,
      }),
      empty_form_values: {
        Email: t('lbl_login_username'),
        Password: '',
      },
      form_values: {},
      options: {
        fields: {
          Email_or_Username: {
            error: t('err_login_valid_username'),
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            keyboardType: 'email-address',
            autoCorrect: false,
            disableFullscreenUI: true,
            testID: 'email-text',
          },
          Password: {
            error: t('err_login_valid_password'),
            clearButtonMode: 'while-editing',
            secureTextEntry: true,
            autoCorrect: false,
            disableFullscreenUI: true,
          },
        },
      },
    };
    this._mounted = false;
  }

  componentDidMount = async () => {
    AppUtil.debug(new Date().toLocaleString(), '[Performance] LoginView');
    // @todo: This would clash with the regular skip/login buttons
    // to fix that
    this._service.onLogin(() => {
      if (this._mounted && this._service.service.loggedInUser) {
//        this._service.switchToLoggedInUser();
        // looks like we have logged in as an user, skip this screen
        Actions.app({ type: 'reset' });
      }
    });
    this._mounted = true;

    // @todo- not sure if so many setStates would affect the
    // refresh - Kumar - pls check
    const serverUrl = this._service.getServer();
    if (serverUrl) {
      this.setState({ serverUrl });
    }
    const saml = this._service.chat.getLoginSetting('service');
    if (saml && saml === 'saml') {
      const tempText = this._service.chat.getLoginSetting('buttonLabelText');
      this.setState({ showSSO: true });
      if (tempText) {
        this.setState({ ssoText: tempText });
      }
    }
    this.setState({ showForm: this._service.showLogin });

    // Get user data from AsyncStorage to populate fields
    const values = await AsyncStorage.getItem('api/credentials');
    if (this._mounted) {
      if (values !== null) {
        const jsonValues = JSON.parse(values);
        this.setState({
          form_values: {
            Email: jsonValues.username,
            Password: jsonValues.password,
          },
        });
      }
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  /**
    * Login
    */
  login = () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    // Form is valid
    if (credentials) {
      this.setState({ form_values: credentials }, () => {
        this.setState({ resultMsg: { status: t('info_logging_in') } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }
        this.props.login({
          username: credentials.Email_or_Username.trim(),
          password: credentials.Password,
        }, true).then(() => {
          if (this._mounted) {
            this.setState({
              resultMsg: { success: t('info_logged_in') },
            });
          }
        }).catch(() => {
          const error = t('err_login_failed'); // AppAPI.handleError(err);
          this.setState({ resultMsg: { error } });
        });
      });
    }
  }

  renderForm() {
    const Form = FormValidation.form.Form;
    if (this.state.showForm) {
      return (
        <View
          style={[styles.ssoParent]}
        >
          {/* @release: If enterprise does not have SSO comment below */}
          {this.renderSSO()}
          <Alerts
            status={this.state.resultMsg.status}
            success={this.state.resultMsg.success}
            error={this.state.resultMsg.error}
          />

          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />
          <Spacer size={10} />
          <View style={[AppStyles.row]}>
            <View style={[AppStyles.flex1]}>
              <Button
                title={t('lbl_login_btn')}
                onPress={this.login}
                backgroundColor="transparent"
                style={[]}
                testID={'login-button'}
              />
            </View>
          </View>
        </View>
      );
    }
    if (this.state.showSSO) {
      return (
        <View
          style={[styles.ssoParent]}
        >
          {/* @release: If enterprise does not have SSO comment below */}
          {this.renderSSO()}
        </View>
      );
    }
    return (
      <Preloader style={this.state.style} />
    );
  }

  renderSSO() {
    if (this.state.showSSO) {
      return (
        <View style={[AppStyles.row]}>
          <TouchableOpacity
            style={[styles.ssoContainer, { backgroundColor: AppColors.brand().third }]}
            onPress={Actions.samlLogin}
          >
            <Text style={{ color: 'white' }}>{this.state.ssoText}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  render() {
    let getServerUrl = this._service.getServer();
    if (!getServerUrl) getServerUrl = this.state.serverUrl;
    // const Form = FormValidation.form.Form;
    if (this.state.loading) {
      return (
        <Preloader style={this.state.style} />
      );
    }
    return (
      <View style={[styles.viewContainer, { backgroundColor: AppColors.brand().secondary }]}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          keyboardShouldPersistTaps={'handled'}
        >
          <KeyboardAvoidingView
            behavior="position"
          >
            <StatusBar barStyle="light-content" />
            <View style={[styles.topContainer, { backgroundColor: AppColors.brand().secondary }]}>
              <Image
                source={Application.logo}
                style={[AppStyles.loginLogo, styles.logoImg]}
              />
              <TouchableOpacity
                style={[styles.workspaceBtn]}
                onPress={() => { Actions.chooseInstance({ switchServer: true }); }}
              >
                <Text
                  style={[styles.textWork]}
                >{t('txt_Workspace')}</Text>
                <Text
                  style={[styles.workspaceTxt]}
                >{getServerUrl}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.formContainer]}>
              {this.renderForm()}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }

}

/* Export Component ==================================================================== */
export default Login;
