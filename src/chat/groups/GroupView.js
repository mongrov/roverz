/**
 * Groups Screen
 */
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  ScrollView,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  AppState,
  Platform,
} from 'react-native';

import { ListView } from 'realm/react-native';
import moment from 'moment';
import { Badge, Icon } from 'react-native-elements';
import RNExitApp from 'react-native-exit-app';
import { List, ListItem } from '../../components/ui';
import Loading from '../../components/general/Loading';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '../../theme/';
import Network from '../../network';
import {
  ListItemAvatar,
} from '../ui';
import t from '../../i18n';

/* Styles ==================================================================== */
const addIconColor = '#fff';
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  lItemTitle: { paddingRight: 40 },
  lItemSubTitle: { paddingTop: 0, marginLeft: 0, flex: 1, flexDirection: 'column' },
  row: { flexDirection: 'row' },
  subTitleText01: { textAlign: 'left', color: AppColors.brand().gV_subTitleText01, fontSize: 14, flex: 1 },
  subTitleText02: { textAlign: 'right', color: AppColors.brand().gV_subTitleText02, fontSize: 12 },
  subTitleMessage: { textAlign: 'left', color: AppColors.brand().gV_subTitleMessage, fontSize: 12, marginRight: 40 },
  badgeText: {
    color: AppColors.brand().gV_badgeTextColor,
    width: 24,
    height: 24,
    paddingTop: 5,
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 11,
  },
  badgeContainer: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    top: 0,
    backgroundColor: AppColors.brand().gV_badgeContainerBg,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  plusButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    position: 'absolute',
    bottom: 90,
    right: 30,
    zIndex: 200,
    shadowColor: AppColors.brand().gV_plusButtonShadowColor,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 2,
    shadowOpacity: 0.3,
    alignItems: 'center',
  },
  toastContainer: {
    flex: 1,
    position: 'absolute',
    top: AppSizes.navbarHeight + 10,
    width: AppSizes.screen.width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  toastView: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  toastText: { color: AppColors.brand().gV_toastTextColor, fontSize: 12 },
  list: { paddingBottom: 110 },
});

/* Component ==================================================================== */
class GroupList extends Component {
  static componentName = 'GroupList';

  constructor(props) {
    super(props);
    this._service = new Network();
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this._mounted = false;
    this.state = {
      dataSource: dataSource.cloneWithRows(dataSource),
      loaded: false,
      items: this._service.chat.service.availableChannels,
      connected: false,
      appState: AppState.currentState,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    // this._service.onLogin(() => {
    //   console.log('APPSTATE GV - onLogin');
    //   // on login, lets sync
    //   if (this._mounted && this._service.currentUser) {
    //     this._service.switchToLoggedInUser();
    //     this.setState({ connected: true });
    //     console.log('APPSTATE GV - switchToLoggedInUser');
    //   }
    // });
    this._insideStateUpdate = false;
    this._service.db.groups.list.addListener(() => {
      if (!this._mounted
        || this._insideStateUpdate ||
        !this._service.service.loggedInUser ||
        this.state.appState.match(/inactive|background/)) return;
      this._insideStateUpdate = true;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        loaded: true,
        connected: this._service.service.loggedInUser,
      }, () => { this._insideStateUpdate = false; });
    });
    this._mounted = true;
    setTimeout(() => {
      if (this._mounted && this.state.items && this.state.items.length > 0 && !this.state.loaded) {
        this.setState({
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        }, () => {
          // this._service.chat.setAppState(1);
          // this._service.chat.setUserPresence('online');
          // console.log('APPSTATE GV - setTimeout callback');
        });
      }
    }, 100);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    this._mounted = false;
    AppState.removeEventListener('change', this._handleAppStateChange);
    if (Platform.OS === 'android') {
      RNExitApp.exitApp();
    }
  }

  getUser = (msg) => {
    const usr = 'None';
    if (msg && msg.user) {
      if (msg.user.name) return msg.user.name;
      return msg.user.username ? msg.user.username : usr;
    }
    return usr;
  }

  getLastMsgText(lastMsg) {
    if (!lastMsg) {
      return '';
    }
    if (lastMsg.image) {
      return t('txt_image');
    }

    if (lastMsg.remoteFile) {
      return t('txt_attachment');
    }
    return lastMsg.text;
  }

  _handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState });
    this._service.handleAppStateChange(nextAppState);
  }

  renderRow = (data, sectionID) => {
    const lastMsg = data.lastMessage;
    return (
      <ListItem
        key={`list-row-${sectionID}`}
        testID={`user-${data.name}`}
        onPress={() => {
          Actions.chatDetail({ obj: data, title: data.heading, duration: 0 });
        }}
        title={data.heading}
        titleStyle={[styles.lItemTitle]}
        subtitle={
          <View style={[styles.lItemSubTitle]}>
            <View
              style={[styles.row]}
            >
              <Text
                style={styles.subTitleText01}
                numberOfLines={1}
              >{lastMsg ? this.getUser(lastMsg) : t('txt_no_messages')}:</Text>
              <Text
                style={[styles.subTitleText02]}
              >{lastMsg ? moment(lastMsg && lastMsg.createdAt).fromNow() : t('hyphen')}</Text>
            </View>
            <View style={{ width: 20 }} />
            <Text
              style={[styles.subTitleMessage]}
              numberOfLines={1}
            >{this.getLastMsgText(lastMsg)}</Text>
          </View>
        }
        badge={data.unread > 0 ? {
          element:
          <Badge
            value={data.unread < 50 ? data.unread : t('txt_50_plus')}
            textStyle={[styles.badgeText]}
            containerStyle={[styles.badgeContainer]}
          />,
        } : null}
        hideChevron={true}
        roundAvatar
        leftIcon={<ListItemAvatar source={data.avatar} name={data.title ? data.title : data.name} avType={data.type} />}
      />
    );
  }

  render = () => {
    if (!this.state.loaded) {
      return (<Loading />);
    }
    return (
      <View style={[styles.mainContainer]} testID={'group-view'} >
        <TouchableOpacity
          style={[styles.plusButton, { backgroundColor: AppColors.brand().third }]}
          onPress={Actions.searchRoom}
        >
          <Icon
            name="add"
            type="MaterialIcons"
            size={45}
            color={addIconColor}
          />
        </TouchableOpacity>
        {
          !this.state.connected &&
          <View
            style={[styles.toastContainer]}
          >
            <View
              style={[styles.toastView, { backgroundColor: AppColors.brand().third }]}
            >
              <Text style={[styles.toastText, AppStyles.baseFont]}>{t('txt_connecting')}</Text>
            </View>
          </View>
        }
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={[AppStyles.container, {
            marginTop: AppSizes.navbarHeight,
            position: 'relative',
          }]}
        >
          <StatusBar barStyle="light-content" hidden={false} />
          <List style={[styles.list]}>
            <ListView
              renderRow={this.renderRow}
              dataSource={this.state.dataSource}
              enableEmptySections={true}
            />
          </List>
        </ScrollView>
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default GroupList;
