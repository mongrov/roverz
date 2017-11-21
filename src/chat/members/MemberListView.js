/**
 * MemberList Screen
 */
import React, { Component } from 'react';
import { List, ListItem } from 'react-native-elements';
import { ListView } from 'realm/react-native';

import { Actions } from 'react-native-router-flux';
import UserAvatar from 'react-native-user-avatar';

import {
  ScrollView,
  StatusBar,
  Text,
  View,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { Loading, AppUtil } from 'roverz-chat';

// import { Actions } from 'react-native-router-flux';
import Network from '../../network';
import Group from '../../models/group';
import { AppStyles, AppSizes } from '../../theme/';
import { ListItemAvatar } from '../ui';
import ModuleConfig from '../../constants/config';

const memberListData = [];

var { height, width } = Dimensions.get('window');

export default class MemberListView extends Component {

  constructor(props) {
    super(props);
    const n = new Network();
    this._group = this.props.group;
    this.roomName = this.props.roomTitle ? this.props.roomTitle : this.props.roomName;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      _network: n,
      dataSource: dataSource.cloneWithRows(memberListData),
      loaded: false,
      totalMembers: 0,
      onlineMembers: 0,
      // items: db.groups.sortedList,
      roomObj: this.props.group,
      roomName: this.roomName,
      layout: {
        height,
        width,
      },
    };
    this._membersCallback = this._membersCallback.bind(this);
    this._offlineMembersCallback = this._offlineMembersCallback.bind(this);
  }

  componentDidMount() {
    this.getMembers();
  }

  componentWillUnmount() {

  }

  getMembers() {
    this.state._network.chat.getMembersList(this._group._id, this._membersCallback, null);
  }

  _onLayout = (event) => {
    this.setState({
      layout: {
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      },
    });
  }

  _membersCallback(data, msg) {
    const _su = this;
    if (msg === 'SUCCESS') {
      _su.memberListData = data.records;
      _su.setState({
        totalMembers: data.total,
        onlineMembers: _su.memberListData.length,
      });
      this.state._network.chat.getMembersList(this._group._id, this._offlineMembersCallback, data.records);
    }
  }

  _offlineMembersCallback(data, msg) {
    const _su = this;
    if (msg === 'SUCCESS') {
      _su.memberListData = data.records;
      _su.setState({
        dataSource: _su.state.dataSource.cloneWithRows(_su.memberListData),
        loaded: true,
      });
    }
  }

  renderRow(rowData, sectionID) {
    return (
      <ListItem
        key={sectionID}
        title={rowData.name}
        titleStyle={AppStyles.memberListTitle}
        subtitle={`@${rowData.username}`}
        subtitleStyle={AppStyles.memberListSubTitle}
        onPress={() => Actions.memberDetail({ memberId: rowData._id })}
        leftIcon={
          <ListItemAvatar
            source={`${ModuleConfig.urls.SERVER_URL}/avatar/${rowData.username}?_dc=undefined`}
            name={rowData.name}
            size={36}
          />}
      />
    );
  }

  renderMemberList() {
    if (!this.state.loaded) {
      return (<Loading />);
    }
    return (
      <List style={{ }}>
        <ListView
          renderRow={this.renderRow}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
        />
      </List>
    );
  }

  render() {
    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        style={[AppStyles.container, {
          marginTop: AppSizes.navbarHeight,
        }]}
        onLayout={this._onLayout}
      >
        <StatusBar barStyle="light-content" />
        <UserAvatar
          name={AppUtil.avatarInitials(this.state.roomName)}
          size={150}
          style={{
            width: this.state.layout.width,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
            borderRadius: 0,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            flexDirection: 'column',
            borderBottomColor: 'rgba(0,0,0,0.3)',
            borderBottomWidth: 1,
            paddingBottom: 15,
            paddingTop: 150,
          }}
        >
          <Text
            style={[AppStyles.memberDetailsLG, { marginTop: 10, textAlign: 'center' }]}
          >{this.state.roomName}</Text>
          <Text
            style={[AppStyles.memberDetailsMD, { textAlign: 'center' }]}
          >{this.state.totalMembers} members ({this.state.onlineMembers} online)</Text>
        </View>
        {this.renderMemberList()}
      </ScrollView>
    );
  }
}

MemberListView.defaultProps = {
  group: null,
  roomName: '',
  roomTitle: '',
};

MemberListView.propTypes = {
  group: PropTypes.instanceOf(Group),
  roomName: React.PropTypes.string,
  roomTitle: React.PropTypes.string,
};

