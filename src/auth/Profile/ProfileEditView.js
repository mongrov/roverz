/**
 * PhotoBrowser Screen
 */
import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { FormInputSimple, FormLabelSimple } from 'roverz-chat';

import { AppStyles, AppSizes, AppColors } from '../../theme/';

/* Component ==================================================================== */

class ProfileEditView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: 'Your Name',
      username: '@username',
      email: 'youremail@company.com',
      password: 'somePass',
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <View
        style={[AppStyles.container, { paddingTop: AppSizes.navbarHeight, backgroundColor: '#FFF' }]}
      >
        <FormLabelSimple>{'Name'.toUpperCase()}</FormLabelSimple>
        <FormInputSimple
          value={this.state.name}
          onChangeText={text => this.setState({ name: text })}
        />
        <FormLabelSimple>{'Username'.toUpperCase()}</FormLabelSimple>
        <FormInputSimple
          value={this.state.username}
          onChangeText={text => this.setState({ username: text })}
        />
        <FormLabelSimple>{'Email'.toUpperCase()}</FormLabelSimple>
        <FormInputSimple
          value={this.state.email}
          onChangeText={text => this.setState({ email: text })}
        />
        <FormLabelSimple>{'New Password'.toUpperCase()}</FormLabelSimple>
        <FormInputSimple
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={text => this.setState({ password: text })}
        />
        <TouchableOpacity
          onPress={() => {}}
          style={{
            padding: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: AppColors.brand().secondary,
            margin: 15,
            borderRadius: 5,
          }}
        >
          <Text style={[AppStyles.baseText, {
            color: 'white',
            fontSize: 16,
          }]}
          >Save changes</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

/* Export Component ==================================================================== */
export default ProfileEditView;
