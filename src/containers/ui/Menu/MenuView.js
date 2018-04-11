/**
 * Menu Contents
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import Meteor from 'react-native-meteor';

import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  Icon,
} from 'react-native-elements';

import { Actions } from 'react-native-router-flux';
import { CachedImage } from 'react-native-img-cache';
import { AppSizes, AppColors } from '../../../theme/';
import Network from '../../../network';
import Text from '../../../components/ui/Text';
import Application from '../../../constants/config';
import t from '../../../i18n';


/* Styles ==================================================================== */
const MENU_BG_COLOR = AppColors.brand().twenty_fourth;

const styles = StyleSheet.create({
  backgroundFill: {
    backgroundColor: MENU_BG_COLOR,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  container: {
    position: 'relative',
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    left: 0,
    right: 0,
    backgroundColor: MENU_BG_COLOR,
  },

  // Main Menu
  menu: {
    flex: 4,
    left: 0,
    right: 0,
    backgroundColor: MENU_BG_COLOR,
    padding: 20,
    paddingTop: AppSizes.statusBarHeight,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
    paddingBottom: 10,
  },
  menuItem_text: {
    fontSize: 18,
    lineHeight: parseInt(18 + (18 * 0.5), 10),
    fontWeight: '500',
    marginTop: 10,
    color: AppColors.brand().twenty_fifth,
  },

  // Menu Bottom
  menuBottom: {
    flex: 1,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  menuBottom_text: {
    color: AppColors.brand().twenty_sixth,
  },
  avatarImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    // borderRadius: 8,
    borderWidth: 3,
    borderColor: AppColors.brand().twenty_seventh,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* Component ==================================================================== */
class Menu extends Component {
  constructor() {
    super();
    this.net = new Network();
    const userData = { _id: '', email: '', username: '', avatar: '../../../images/empty_photo.png', name: '' };
    this.state = {
      menu: [
        {
          id: 0,
          title: t('lbl_profile'),
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
          title: t('lbl_logout'),
          icon: 'logout-variant',
          onPress: () => {
            Alert.alert(
              t('txt_logout'),
              t('txt_want_to_logout'),
              [
                { text: t('txt_no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: t('txt_yes'),
                  onPress: () => {
                    this.net.logout();
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

  /* returns
    { _id: '6Qk76sozAy6oNSopT',
    name: 'kumar',
    username: 'kumar',
    status: 'online',
    active: 'true',
    statusConnection: 'online',
    utcOffset: '5.5 ',
    emails: 'emailID,',
    lastLogin: null,
    createdAt: null,
    type: null,
    roles: 'user,admin,livechat-agent,' }
   */
  getCurrentUser() {
    /* {
      _id: '6Qk76sozAy6oNSopT',
      emails: [ { address: 'emailID', verified: true } ],
      username: 'kumar',
      _version: 1
    } */
    return this.net.service.loggedInUserObj;
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

  showProfile = () => {
    // this.props.closeSideMenu();
    const currUser = this.getCurrentUser();
    if (currUser) {
      Actions.memberDetail({ memberId: currUser._id });
    }
  }

  render = () => {
    const { menu } = this.state;
    // this.getCurrentUser();

    // Build the actual Menu Items
    const menuItems = [];
    menu.map((item) => {
      const { id, title, icon, onPress } = item;

      return menuItems.push(
        <TouchableOpacity
          onPress={onPress}
          key={id}
          style={{
            flexDirection: 'row',
            paddingTop: 7,
            paddingBottom: 7,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: AppColors.brand().sixth,
          }}
        >
          <Icon
            name={icon}
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
          >{title}</Text>
        </TouchableOpacity>,
      );
    });

    /* eslint-disable global-require */
    return (
      <View style={[styles.container]}>
        <View style={[styles.backgroundFill]} />
        <View style={[styles.menuContainer]}>
          <View style={[styles.menu, {
            flexDirection: 'column',
            justifyContent: 'space-between',
          }]}
          >
            <View style={{
              paddingTop: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >
              <TouchableOpacity
                style={{
                  position: 'relative',
                  width: 100,
                  height: 100,
                }}
                onPress={this.showProfile}
              >
                <CachedImage
                  source={{ uri: this.state.currentUser.avatar }}
                  style={[styles.avatarImage, {
                    zIndex: 999,
                  }]}
                />
                <Image
                  source={require('../../../images/empty_photo.png')}
                  style={[styles.avatarImage, {
                    zIndex: 0,
                    backgroundColor: AppColors.brand().secondary,
                  }]}
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: '#FFF',
                  fontSize: 22,
                  fontWeight: '500',
                  paddingTop: 20,
                  zIndex: 999,
                }}
              >{this.state.currentUser.name}</Text>
              <Text
                style={{
                  color: '#A4A5A5',
                  fontSize: 14,
                  fontWeight: '400',
                }}
              >{`@${this.state.currentUser.username}`}</Text>
            </View>
            <View>
              {menuItems}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.menuBottom, { alignItems: 'center' }]}
            onPress={() => {
              Actions.aboutView();
            }}
          >
            <Image
              source={Application.logo}
              style={{
                width: 150,
                height: 100,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
    /* eslint-enable global-require */
  }
}

/* Export Component ==================================================================== */
export default Menu;

Menu.propTypes = {
  // logout: PropTypes.func.isRequired,
  // closeSideMenu: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
};

Menu.defaultProps = {
  user: null,
};
