/**
 * tasks package
 */

import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Keyboard,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// import { Icon } from 'react-native-elements';

import Application from '../../constants/config';
import { Alerts } from '../../components/ui/';
import { AppColors } from '../../theme/';
import Network from '../../network';

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const namePattern = /^[a-zA-Z. ]{3,20}$/;
const passPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 15,
  },
  inputLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#FFF',
    marginBottom: 5,
    marginTop: 15,
  },
  inputStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    height: 40,
    backgroundColor: '#FFF',
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: '#000',
  },
  errorMessage: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#ff5132',
    marginTop: 5,
  },
});

export default class Register extends Component {
  constructor(props) {
    super(props);
    this._net = new Network();
    console.log('RegCB1');
    this.state = {
      inputName: '',
      inputEmail: '',
      inputPass: '',
      alert: {
        status: '',
        success: '',
        error: '',
      },
      inputError: {
        name: false,
        email: false,
        password: false,
      },
    };
  }

  validateRegistrationForm = () => {
    if (this.state.inputName.length > 0 &&
      this.state.inputEmail.length > 0 &&
      this.state.inputPass.length > 0
    ) {
      this.setState({ alert: { status: 'Please wait...' } });
    }
    const errorStates = {};
    if (!namePattern.test(this.state.inputName)) {
      errorStates.name = true;
    }
    if (!emailPattern.test(this.state.inputEmail)) {
      errorStates.email = true;
    }
    if (!passPattern.test(this.state.inputPass)) {
      errorStates.password = true;
    }
    this.setState({ inputError: errorStates });
    if (namePattern.test(this.state.inputName) &&
      emailPattern.test(this.state.inputEmail) &&
      passPattern.test(this.state.inputPass)) {
      this._net.service.registerUser(this.state.inputEmail,
      this.state.inputPass, this.state.inputName, (err, res) => {
        console.log('RegCB', err, res);
        if (err) {
          this.setState({ alert: { error: 'Error in registration!' } });
        }
        this.setState({ alert: { success: 'Registration successful!' } });
        Alert.alert(
          'Sign up',
          'Please check your email for verification. You can login after verification.',
          [
            { text: 'OK',
              onPress: () => {
                Actions.login({ type: 'replace' });
              },
            },
          ],
          { cancelable: false },
        );
      });
    } else {
      this.setState({ alert: { error: 'Enter valid details' } });
    }
  }

  render() {
    const { height } = Dimensions.get('window');
    return (
      <View
        style={{
          flex: 1,
          zIndex: 100,
        }}
      >
        <ScrollView style={{
          flexDirection: 'column',
          backgroundColor: AppColors.brand().third,
        }}
        >
          <View style={{
            height: height / 3,
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingVertical: 15,
          }}
          >
            <Image
              source={Application.logo}
              style={{ width: 250, height: 50 }}
            />
            <Text style={styles.titleText}>Create a new account</Text>
          </View>
          <KeyboardAvoidingView behavior={'position'} style={{ paddingVertical: 15, paddingHorizontal: 30 }}>
            <Alerts
              status={this.state.alert.status}
              success={this.state.alert.success}
              error={this.state.alert.error}
            />
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              placeholder={'Your name'}
              onChangeText={inputName => this.setState({ inputName })}
              value={this.state.name}
              autoCorrect={false}
              clearButtonMode={'while-editing'}
              autoCapitalize="none"
              disableFullscreenUI
              style={styles.inputStyle}
            />
            {
              this.state.inputError.name &&
              <Text style={styles.errorMessage}>Please enter a valid name</Text>
            }
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              placeholder={'you@domain.com'}
              onChangeText={inputEmail => this.setState({ inputEmail })}
              autoCorrect={false}
              value={this.state.email}
              keyboardType="email-address"
              clearButtonMode={'while-editing'}
              autoCapitalize="none"
              disableFullscreenUI
              style={styles.inputStyle}
            />
            {
              this.state.inputError.email &&
              <Text style={styles.errorMessage}>Please enter a valid email</Text>
            }
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              placeholder={'Create a new password'}
              onChangeText={inputPass => this.setState({ inputPass })}
              value={this.state.password}
              secureTextEntry
              autoCorrect={false}
              clearButtonMode={'while-editing'}
              autoCapitalize="none"
              disableFullscreenUI
              style={styles.inputStyle}
            />
            {
              this.state.inputError.password &&
              <Text style={styles.errorMessage}>Please enter a stronger password</Text>
            }
          </KeyboardAvoidingView>
          <TouchableOpacity
            style={{
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
            }}
            onPress={() => {
              Actions.pop();
            }}
          >
            <Text style={{
              marginLeft: 10,
              color: '#FFF',
              fontSize: 16,
              fontWeight: '400',
            }}
            >Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity
          style={{
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#636363',
          }}
          onPress={() => {
            Keyboard.dismiss();
            this.validateRegistrationForm();
          }}
        >
          <Text style={{
            marginLeft: 10,
            color: '#FFF',
            fontSize: 16,
            fontWeight: '400',
          }}
          >Sign up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
