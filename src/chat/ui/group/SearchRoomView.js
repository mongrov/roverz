/**
 * PhotoBrowser Screen
 */
import React, { Component } from 'react';
import { List, ListItem } from 'react-native-elements';
import {
  ListView,
} from 'realm/react-native';
import { Actions } from 'react-native-router-flux';

import {
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

// import { Actions } from 'react-native-router-flux';
import Network from '@network';
import Group from '@models/group';
import { AppStyles, AppSizes, AppColors } from '@theme/';
import { Loading } from 'roverz-chat';
import AppConfig from '@app/config';

const memberListData = [];

export default class SearchRoomView extends Component {

  constructor(props) {
    super(props);
    const n = new Network();
    this._group = this.props.group;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      _network: n,
      dataSource: dataSource.cloneWithRows(memberListData),
      loaded: false,
      roomObj: this.props.group,
      text: '',
    };
    this._searchRoomsCallback = this._searchRoomsCallback.bind(this);
    this._createRoomCallback = this._createRoomCallback.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  componentDidMount() {
    this.searchRooms('');
  }

  searchRooms(keyword) {
    this.state._network.chat.searchUserOrRoom(keyword, this._searchRoomsCallback);
  }

  _searchRoomsCallback(data, msg) {
    const _su = this;
    if (msg === 'SUCCESS') {
      const dataUsers = data.users;
      const dataRooms = data.rooms;
      _su.memberListData = dataUsers.concat(dataRooms);
      console.log('_searchRoomsCallback', _su.memberListData, msg);
      _su.setState({
        dataSource: _su.state.dataSource.cloneWithRows(_su.memberListData),
        loaded: true,
      });
    }
  }

  // 'User Subscription updated:', 'inserted', { _id: 'mWWvnMk2nA4hmDRcArxRs9yFCKjs8yoPLX', t: 'd' }

  createRoom(username, _id) {
    if (username) {
      this.state._network.chat.createDirectMessage(username, this._createRoomCallback);
    } else {
      this.state._network.chat.joinRoom(_id, this._createRoomCallback);
    }
  }

  _createRoomCallback(data, msg) {
    // { rid: 'iShcWCPEu9vANd6zQrxRs9yFCKjs8yoPLX' }, 'SUCCESS'
    console.log('_createRoomCallback', data, msg);
    Actions.pop();
    // Actions.chatDetail({ obj: {}, title: '' });
  }

  renderRow = (rowData, sectionID) => {
    console.log('rowData');
    console.log(rowData);
    return (
      <ListItem
        roundAvatar
        key={sectionID}
        title={rowData.name}
        titleStyle={AppStyles.memberListTitle}
        subtitle={rowData.username ? `@${rowData.username}` : ''}
        subtitleStyle={AppStyles.memberListSubTitle}
        avatar={{
          uri: `${AppConfig.base.urls.SERVER_URL}/avatar/${rowData.username}?_dc=undefined`,
        }}
        onPress={() => this.createRoom(rowData.username, rowData._id)}
      />
    );
  }

  render() {
    if (!this.state.loaded) {
      return (<Loading />);
    }
    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        style={[AppStyles.container, { paddingTop: AppSizes.navbarHeight }]}
      >
        <StatusBar barStyle="light-content" />
        <View
          style={{
            borderBottomColor: AppColors.brand.third,
            borderBottomWidth: 1,
            marginHorizontal: 10,
          }}
        >
          <TextInput
            style={{
              height: 40,
              fontSize: 16,
              fontFamily: 'OpenSans-Regular',
            }}
            autoCorrect={false}
            autoFocus={true}
            placeholder={'Type member/group name...'}
            onChangeText={(text) => { this.setState({ text }); this.searchRooms(this.state.text); }}
            value={this.state.text}
            underlineColorAndroid={'transparent'}
          />
        </View>
        <List style={{ paddingTop: 0, backgroundColor: '#fff' }}>
          <ListView
            renderRow={this.renderRow}
            dataSource={this.state.dataSource}
            enableEmptySections={true}
          />
        </List>
      </ScrollView>
    );
  }
}

SearchRoomView.defaultProps = {
  group: null,
};

SearchRoomView.propTypes = {
  group: PropTypes.instanceOf(Group),
};

