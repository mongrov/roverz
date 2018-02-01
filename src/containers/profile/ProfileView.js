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

import { Actions } from 'react-native-router-flux';

import t from '../../i18n/';
import { Text } from '../../components/ui/';
import MemberDetailView from '../../chat/members/MemberDetailView';
import NavBarBack from '../../chat/ui/NavBarBack';
import Network from '../../network';
import { AppColors } from '../../theme/';
import Application from '../../constants/config';

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
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  logoutText: {
    marginLeft: 10,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '400',
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

  updateCurrentUserInfo() {
    const userData = this._service.service.loggedInUser;
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
      <View style={[styles.container]}>
        <NavBarBack />
        <MemberDetailView memberId={Application.userId} avHeight={300} />
        <View
          style={{ backgroundColor: AppColors.brand().primary }}
        >
          <TouchableOpacity
            onPress={Actions.cropImage}
            style={[styles.logout]}
          >
            <Icon
              name={'logout-variant'}
              type={'material-community'}
              color={'rgba(255,255,255,0.4)'}
            />
            <Text
              style={[styles.logoutText]}
            >{t('txt_set_profile_pic')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={Actions.changePassword}
            style={[styles.logout]}
          >
            <Icon
              name={'logout-variant'}
              type={'material-community'}
              color={'rgba(255,255,255,0.4)'}
            />
            <Text
              style={[styles.logoutText]}
            >{t('txt_change_password')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                t('txt_logout'),
                t('txt_want_to_logout'),
                [
                  { text: t('txt_no'), onPress: () => {}, style: 'cancel' },
                  { text: t('txt_yes'),
                    onPress: () => {
                      this._service.logout();
                    },
                  },
                ],
                { cancelable: false },
              );
            }}
            style={[styles.logout]}
          >
            <Icon
              name={'logout-variant'}
              type={'material-community'}
              color={'rgba(255,255,255,0.4)'}
            />
            <Text
              style={[styles.logoutText]}
            >{t('txt_logout')}</Text>
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
