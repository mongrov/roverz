/**
 * ProfileView Contents
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  Icon,
} from 'react-native-elements';

import { Actions } from 'react-native-router-flux';
import RNRestart from 'react-native-restart';
import { Text, Network, AppColors, MemberDetailView, NavBarBack } from 'roverz-chat';
import AppConfig from '../../../constants/config';


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
    this.net = new Network();
    const userData = { _id: '', email: '', username: '', avatar: '../../../images/empty_photo.png', name: '' };
    this.state = {
      menu: [
        {
          id: 0,
          title: 'Profile',
          icon: 'account-outline',
          onPress: this.showProfile,
        },
        /* {
          id: 1,
          title: 'Preferences',
          icon: 'settings',
          onPress: () => { this.props.closeSideMenu(); Actions.comingSoon(); },
        }, */
        {
          id: 2,
          title: 'Logout',
          icon: 'logout-variant',
          onPress: () => {
            Alert.alert(
              'Logout',
              'Do you want to logout?',
              [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes',
                  onPress: () => {
                    this.net.meteor.logout();
                    this.net.db.setUserId(null);
                    AppConfig.setUserId(null);
                    this.net.chat.logout();
                    setTimeout(() => {
                      RNRestart.Restart();
                    }, 300);
                  },
                },
              ],
              { cancelable: false },
            );
          },
        },
      ],
      currentUser: {
        _id: userData._id,
        email: userData.emails,
        username: userData.username,
        avatar: userData.avatar,
        name: userData.name,
      },
    };
  }

  componentDidMount() {
    Meteor.getData().on('onLogin', () => {
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
    return this.net.chat.getCurrentUser();
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

  showProfile() {
    const currUser = this.getCurrentUser();
    if (currUser) {
      Actions.memberDetail({ memberId: currUser._id });
    }
  }

  render() {
    /* eslint-disable global-require */
    return (
      <View style={[styles.container, { paddingBottom: 50 }]}>
        <NavBarBack />
        <MemberDetailView memberId={AppConfig.userId} avHeight={200} />
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
                      this.net.meteor.logout();
                      this.net.db.setUserId(null);
                      AppConfig.setUserId(null);
                      this.net.chat.logout();
                      setTimeout(() => {
                        RNRestart.Restart();
                      }, 300);
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
    /* eslint-enable global-require */
  }
}

/* Export Component ==================================================================== */
export default ProfileView;

ProfileView.propTypes = {

};

ProfileView.defaultProps = {

};
