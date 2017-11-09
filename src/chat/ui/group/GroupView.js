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
//  AppState,
  TouchableOpacity,
} from 'react-native';
import { ListView } from 'realm/react-native';
import moment from 'moment';
import Meteor from 'react-native-meteor';
import { Loading, List, ListItem } from 'roverz-chat';
import { Badge, Icon } from 'react-native-elements';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '../../../theme/';
import Network from '../../../network';
import {
  ListItemAvatar,
} from '../';

/* Styles ==================================================================== */


/* Component ==================================================================== */
class GroupList extends Component {
  static componentName = 'GroupList';

  constructor(props) {
    super(props);
    const n = new Network();
    const db = n.db;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this._mounted = false;
    this.state = {
      _network: n,
      _db: db,
      dataSource: dataSource.cloneWithRows(dataSource),
      loaded: false,
      items: n.chat.getFilteredChannels(db.groups.sortedList),
      connected: false,
    };
  }

  componentDidMount() {
    Meteor.getData().on('onLogin', () => {
      // on login, lets sync
      if (this._mounted && this.state._network.meteor.getCurrentUser()) {
        this.state._network.switchToLoggedInUser();
        this.setState({ connected: true });
      }
    });
    this._insideStateUpdate = false;
    this.state._db.groups.list.addListener(() => {
      if (!this._mounted || this._insideStateUpdate || !this.state._network.meteor.getCurrentUser()) return;
      this._insideStateUpdate = true;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state._network.chat.getFilteredChannels(this.state.items)),
        loaded: true,
        connected: this.state._network.meteor.getCurrentUser(),
      });
      this._insideStateUpdate = false;
    });
    this._mounted = true;
    setTimeout(() => {
      if (this._mounted && this.state.items && this.state.items.length > 0 && !this.state.loaded) {
        this.setState({
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(
            this.state._network.chat.getFilteredChannels(this.state.items)),
        });
      }
    }, 100);
//    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    this._mounted = false;
//    AppState.removeEventListener('change', this._handleAppStateChange);
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
      return 'Image';
    }

    if (lastMsg.remoteFile) {
      return 'Attachment';
    }
    return lastMsg.text;
  }


  // _handleAppStateChange = (nextAppState) => {
  //   if (nextAppState === 'background') {
  //     this.state._network.chat.setUserPresence('away');
  //   } else if (nextAppState === 'active') {
  //     this.state._network.chat.setUserPresence('online');
  //   }
  // }

  renderRow = (data, sectionID) => {
    const lastMsg = data.lastMessage;
    return (
      <ListItem
        key={`list-row-${sectionID}`}
        onPress={() => {
          Actions.chatDetail({ obj: data, title: data.heading, duration: 0 });
        }}
        title={data.heading}
        titleStyle={{ paddingRight: 40 }}
        subtitle={
          <View style={{ paddingTop: 0, marginLeft: 0, flex: 1, flexDirection: 'column' }}>
            <View
              style={{ flexDirection: 'row' }}
            >
              <Text
                style={{ textAlign: 'left', color: '#4B5155', fontSize: 14, flex: 1 }}
                numberOfLines={1}
              >{lastMsg ? this.getUser(lastMsg) : 'No Messages'}:</Text>
              <Text
                style={{ textAlign: 'right', color: '#7B8287', fontSize: 12 }}
              >{lastMsg ? moment(lastMsg && lastMsg.createdAt).fromNow() : '----'}</Text>
            </View>
            <View style={{ width: 20 }} />
            <Text
              style={{ textAlign: 'left', color: '#7B8287', fontSize: 12, marginRight: 40 }}
              numberOfLines={1}
            >{this.getLastMsgText(lastMsg)}</Text>
          </View>
        }
        badge={data.unread > 0 ? {
          element:
          <Badge
            value={data.unread < 50 ? data.unread : '50+'}
            textStyle={{
              color: 'white',
              width: 24,
              height: 24,
              paddingTop: 5,
              textAlign: 'center',
              backgroundColor: 'transparent',
              fontSize: 11,
            }}
            containerStyle={{
              position: 'absolute',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              right: 0,
              top: 0,
              backgroundColor: '#37C7A1',
              width: 24,
              height: 24,
              borderRadius: 12 }}
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
    /* @todo: Kumar, please show 'connected state variable' some visual
     * indication here
     */
    return (
      <View style={{
        flex: 1,
        position: 'relative',
      }}
      >
        <TouchableOpacity
          style={{
            width: 45,
            height: 45,
            borderRadius: 23,
            backgroundColor: AppColors.brand().third,
            position: 'absolute',
            bottom: 90,
            right: 30,
            zIndex: 200,
            shadowColor: '#000000',
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowRadius: 2,
            shadowOpacity: 0.3,
            alignItems: 'center',
          }}
          onPress={Actions.searchRoom}
        >
          <Icon
            name="add"
            type="MaterialIcons"
            size={45}
            color={'#fff'}
          />
        </TouchableOpacity>
        {
          !this.state.connected &&
          <View
            style={{
              flex: 1,
              position: 'absolute',
              top: AppSizes.navbarHeight + 10,
              width: AppSizes.screen.width,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
          >
            <View
              style={{
                backgroundColor: AppColors.brand().third,
                paddingVertical: 5,
                paddingHorizontal: 15,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: '#fff', fontFamily: 'OpenSans-Regular', fontSize: 12 }}>Connecting...</Text>
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
          <List style={{ paddingBottom: 110 }}>
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
