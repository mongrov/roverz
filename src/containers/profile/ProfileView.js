import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  Icon,
} from 'react-native-elements';
import { Text, MemberDetailView, NavBarBack } from 'roverz-chat';

import Network from '../../network';
import { AppColors } from '../../theme/';
import Application from '../../constants/config';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
});

/* Component ==================================================================== */
class ProfileView extends Component {
  constructor() {
    super();
    this._service = new Network();
    const currentUser = { _id: '', email: '', username: '', avatar: '../../../images/empty_photo.png', name: '' };
    this.state = {
      currentUser,
    };
    this._mounted = false;
  }

  componentDidMount() {
    this._service.onLogin(() => {
      // on login, lets sync
      this.updateCurrentUserInfo();
    });
    // very first time we still have to handle a corner case
    // to update the user info
    setTimeout(() => {
      this.updateCurrentUserInfo();
    }, 100);
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getCurrentUser() {
    return this._service.chat.getCurrentUser();
  }

  updateCurrentUserInfo() {
    const userData = this.getCurrentUser();
    if (userData && this._mounted) {
      this.setState({
        currentUser: {
          _id: userData._id,
          email: userData.emails,
          username: userData.username,
          avatar: userData.avatar,
          name: userData.name,
        },
      });
    }
  }

  render() {
    return (
      <View style={[styles.container, { paddingBottom: 50 }]}>
        <NavBarBack />
        <MemberDetailView memberId={Application.userId} avHeight={200} />
        <View
          style={{ backgroundColor: AppColors.brand().primary }}
        >
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Logout',
                'Do you want to logout?',
                [
                  { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                  { text: 'Yes',
                    onPress: () => {
                      this._service.logout();
                    },
                  },
                ],
                { cancelable: false },
              );
            }}
            style={{
              flexDirection: 'row',
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomWidth: 1,
              borderBottomColor: AppColors.brand().sixth,
            }}
          >
            <Icon
              name={'logout-variant'}
              type={'material-community'}
              color={'rgba(255,255,255,0.4)'}
            />
            <Text
              style={{
                marginLeft: 10,
                color: '#FFF',
                fontSize: 16,
                fontWeight: '400',
              }}
            >Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default ProfileView;

ProfileView.propTypes = {

};

ProfileView.defaultProps = {

};
