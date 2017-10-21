/**
 * Login Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  AsyncStorage,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import Meteor from 'react-native-meteor';
import { Actions } from 'react-native-router-flux';
import { Alerts, Spacer, Text, Button, AppAPI, AppUtil } from 'roverz-chat';

import Network from '@network';

// Consts and Libs
import { AppStyles, AppColors } from '@theme/';

/* Styles ==================================================================== */
// const styles = StyleSheet.create({
//   background: {
//     backgroundColor: 'transparent',
//     height: AppSizes.screen.height,
//     width: AppSizes.screen.width,
//   },
//   logo: {
//     width: AppSizes.screen.width * 0.85,
//     resizeMode: 'contain',
//   },
//   whiteText: {
//     color: '#FFF',
//   },
// });

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

    this._net = new Network();
    const serverUrl = '';

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
      serverUrl,
      loading: true,
      showForm: false,
      showSSO: false,
      form_fields: FormValidation.struct({
        Email_or_Username: validEmail,
        Password: validPassword,
      }),
      empty_form_values: {
        Email: 'Username or Email',
        Password: '',
      },
      form_values: {},
      options: {
        fields: {
          Email_or_Username: {
            error: 'Please enter a valid username or email',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            keyboardType: 'email-address',
            autoCorrect: false,
          },
          Password: {
            error: 'Please enter a valid password',
            clearButtonMode: 'while-editing',
            secureTextEntry: true,
            autoCorrect: false,
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
    Meteor.getData().on('onLogin', () => {
      if (this._net.meteor.getCurrentUser() && this._mounted) {
        this._net.switchToLoggedInUser();
        // looks like we have logged in as an user, skip this screen
        Actions.app({ type: 'reset' });
      }
    });
    this._mounted = true;

    // @todo- not sure if so many setStates would affect the
    // refresh - Kumar - pls check
    const serverUrl = this._net.getServer();
    if (serverUrl) {
      this.setState({ serverUrl });
    }
    const saml = this._net.getLoginSetting('service');
    if (saml && saml === 'saml') {
      this.setState({ showSSO: true });
    }
    const loginFormConf = this._net.getServerSetting('Accounts_ShowFormLogin');
    this.setState({ showForm: loginFormConf && loginFormConf.value });

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
        this.setState({ resultMsg: { status: 'One moment...' } });

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
              resultMsg: { success: 'Awesome, you\'re now logged in!' },
            });
          }
        }).catch((err) => {
          const error = AppAPI.handleError(err);
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
          style={{
            padding: 30,
          }}
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
          <View style={[AppStyles.row]}>
            <View style={[AppStyles.flex1]}>
              <Button
                title={'Login'}
                onPress={this.login}
                backgroundColor="transparent"
                style={[]}
              />
            </View>
          </View>
          <Spacer size={20} />
          <TouchableOpacity onPress={Actions.passwordReset}>
            <Text p style={[{ color: '#BABABA', textAlign: 'center', marginTop: 0, fontSize: 14 }]}>
              Forgot your password?
            </Text>
          </TouchableOpacity>

          <Spacer size={10} />

        </View>
      );
    }
    if (this.state.showSSO) {
      return (
        <View
          style={{
            padding: 30,
          }}
        >
          {/* @release: If enterprise does not have SSO comment below */}
          {this.renderSSO()}
          <Spacer size={20} />
        </View>
      );
    }
    return (
      <ActivityIndicator
        animating
        size={'large'}
        color={'rgba(255,255,255,0.3)'}
        style={[AppStyles.windowSize, AppStyles.containerCentered]}
      />
    );
  }

  renderSSO() {
    if (this.state.showSSO) {
      return (
        <View style={[AppStyles.row]}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: AppColors.brand.third,
              height: 40,
              borderRadius: 5,
              marginBottom: 15,
            }}
            onPress={Actions.ssoTest}
          >
            <Text style={{ color: 'white' }}>SSO Login</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  render() {
    // const Form = FormValidation.form.Form;
    if (this.state.loading) {
      return (
        <ActivityIndicator
          animating
          size={'large'}
          color={'rgba(255,255,255,0.3)'}
          style={[AppStyles.windowSize, AppStyles.containerCentered]}
        />
      );
    }
    /* eslint-disable global-require */
    return (
      <KeyboardAvoidingView
      // style={styles.container}
        behavior="padding"
        style={[AppStyles.windowSize]}
      >
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1, backgroundColor: '#373856', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require('../../images/logo.png')}
            style={[AppStyles.loginLogo, { flex: 1, marginTop: 30 }]}
          />
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
              marginBottom: 15,
            }}
            onPress={() => { Actions.chooseInstance({ switchServer: true }); }}
          >
            <Text
              style={{
                fontSize: 10,
                color: '#FFF',
              }}
            >WORKSPACE</Text>
            <Text
              style={{
                fontSize: 14,
                color: '#FFF',
              }}
            >{this.state.serverUrl}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: 'white' }}>
          {this.renderForm()}
        </View>
      </KeyboardAvoidingView>
    );
    /* eslint-enable global-require */
  }

}

/* Export Component ==================================================================== */
export default Login;
