import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  // TouchableOpacity,
  // Alert,
} from 'react-native';

// import {
//   Icon,
// } from 'react-native-elements';

import FormValidation from 'tcomb-form-native';

// import t from '../../i18n/';
// import { Text } from '../../components/ui/';
// import MemberDetailView from '../../chat/members/MemberDetailView';
import NavBarBack from '../../chat/ui/NavBarBack';
import Network from '../../network';
import { AppColors } from '../../theme/';
// import Application from '../../constants/config';
import { Alerts, Button } from '../../components/ui/';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  logout: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.brand().sixth,
  },
  logoutText: {
    marginLeft: 10,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '400',
  },
});

/* Component ==================================================================== */
class ChangePassword extends Component {
  constructor() {
    super();
    this._service = new Network();
    this.Form = FormValidation.form.Form;

    // here we are: define your domain model
    this.userPassword = FormValidation.struct({
      // OldPassword: FormValidation.String,
      NewPassword: FormValidation.String,
      PasswordAgain: FormValidation.String,
    });

    this.options = {
      fields: {
        // OldPassword: {
        //   error: 'Enter your current password',
        //   clearButtonMode: 'while-editing',
        //   secureTextEntry: true,
        //   autoCorrect: false,
        //   disableFullscreenUI: true,
        // },
        NewPassword: {
          error: 'Enter new password',
          clearButtonMode: 'while-editing',
          secureTextEntry: true,
          autoCorrect: false,
          disableFullscreenUI: true,
        },
        PasswordAgain: {
          error: 'Enter new password again',
          clearButtonMode: 'while-editing',
          secureTextEntry: true,
          autoCorrect: false,
          disableFullscreenUI: true,
        },
      },
    }; // optional rendering options (see documentation)

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
    };

    this._mounted = false;
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  updatePassword = () => {
    var pwdValue = this.refs.pwdForm.getValue();

    // Form is valid
    if (pwdValue) {
      console.log(pwdValue.NewPassword);
      console.log(pwdValue.PasswordAgain);
      if (pwdValue.NewPassword !== pwdValue.PasswordAgain) {
        this.setState({ resultMsg: { error: 'Passwords not matching' } });
      } else {
        this.setState({ resultMsg: { success: 'Processing...' } });
        this._service.chat.setUserPassword(pwdValue.NewPassword, (res) => {
          console.log(res);
          this.setState({ resultMsg: { success: 'success...' } });
        });
      }
      // this.setState({ form_values: credentials }, () => {
      //   this.setState({ resultMsg: { status: t('info_logging_in') } });

      //   // Scroll to top, to show message
      //   if (this.scrollView) {
      //     this.scrollView.scrollTo({ y: 0 });
      //   }
      //   this.props.login({
      //     username: credentials.Email_or_Username.trim(),
      //     password: credentials.Password,
      //   }, true).then(() => {
      //     if (this._mounted) {
      //       this.setState({
      //         resultMsg: { success: t('info_logged_in') },
      //       });
      //     }
      //   }).catch(() => {
      //     const error = t('err_login_failed'); // AppAPI.handleError(err);
      //     this.setState({ resultMsg: { error } });
      //   });
      // });
    }
  }

  render() {
    return (
      <View style={[styles.container]}>
        <NavBarBack />
        <View style={{ backgroundColor: '#FFF', flex: 1, padding: 15, paddingTop: 70 }}>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.state.resultMsg.success}
            error={this.state.resultMsg.error}
          />
          <this.Form
            ref="pwdForm"
            type={this.userPassword}
            options={this.options}
          />
          <Button
            title={'Update password'}
            onPress={this.updatePassword}
            backgroundColor="transparent"
            style={[]}
          />
        </View>
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default ChangePassword;

ChangePassword.propTypes = {

};

ChangePassword.defaultProps = {

};
