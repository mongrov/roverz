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
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import t from '../../i18n/';
import Loading from '../../components/general/Loading';
import AppUtil from '../../lib/util';
import Network from '../../network';
import Group from '../../models/group';
import { AppStyles, AppSizes, AppColors } from '../../theme/';
import { ListItemAvatar } from '../ui';
import Application from '../../constants/config';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  avatar: {
    width,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    borderRadius: 0,
  },
  detailView: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 1,
    paddingBottom: 15,
    paddingTop: 300,
  },
  detailText01: { marginTop: 10, textAlign: 'center' },
  detailText02: { textAlign: 'center' },
});

export default class MemberListView extends Component {

  constructor(props) {
    super(props);
    this._service = new Network();
    this._group = this.props.group;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this._mounted = false;
    this._memberListData = [];
    this.state = {
      dataSource: dataSource.cloneWithRows(this._memberListData),
      loaded: false,
      totalMembers: 0,
      onlineMembers: 0,
      roomName: this.props.roomTitle ? this.props.roomTitle : this.props.roomName,
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
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getMembers() {
    this._service.chat.getMembersList(this._group._id, this._membersCallback, null);
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
    if (msg === Application.response_success && this._mounted) {
      _su._memberListData = data.records;
      _su.setState({
        totalMembers: data.total,
        onlineMembers: _su._memberListData.length,
      });
      this._service.chat.getMembersList(this._group._id, this._offlineMembersCallback, data.records);
    }
  }

  _offlineMembersCallback(data, msg) {
    const _su = this;
    if (msg === Application.response_success && this._mounted) {
      _su._memberListData = data.records;
      _su.setState({
        dataSource: _su.state.dataSource.cloneWithRows(_su._memberListData),
        loaded: true,
      });
    }
  }

  renderRow = (rowData, sectionID) => {
    const userObj = this._service.chat.getUserByID(rowData._id);
    const avatar = userObj.avatar;
    const status = userObj.status;
    let statColor = '#a8a8a8';
    switch (status) {
      case 'online':
        statColor = AppColors.status().online; break;
      case 'away':
        statColor = AppColors.status().away; break;
      case 'busy':
        statColor = AppColors.status().busy; break;
      default:
        statColor = AppColors.status().default;
    }
    return (
      <ListItem
        key={sectionID}
        title={rowData.name}
        titleStyle={AppStyles.memberListTitle}
        subtitle={`@${rowData.username}`}
        subtitleStyle={AppStyles.memberListSubTitle}
        onPress={() => Actions.memberDetail({ memberId: rowData._id })}
        // badge={{ value: status, textStyle: { color: statColor }, containerStyle: { marginTop: 8 } }}
        leftIcon={
          <View>
            <ListItemAvatar
              source={avatar}
              name={rowData.name}
              size={36}
            />
            <View style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              position: 'absolute',
              left: 0,
              top: 0,
              backgroundColor: statColor,
            }}
            />
          </View>
          }
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
          size={this.props.avHeight ? this.props.avHeight : 300}
          style={[styles.avatar, {
            width: this.state.layout.width,
          }]}
        />
        <View
          style={[styles.detailView]}
        >
          <Text
            style={[AppStyles.memberDetailsLG, styles.detailText01]}
          >{this.state.roomName}</Text>
          <Text
            style={[AppStyles.memberDetailsMD, styles.detailText02]}
          >{`${this.state.totalMembers} ${t('txt_members')} (${this.state.onlineMembers}) ${t('txt_online')}`}</Text>
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
  avHeight: null,
};

MemberListView.propTypes = {
  group: PropTypes.instanceOf(Group),
  roomName: React.PropTypes.string,
  roomTitle: React.PropTypes.string,
  avHeight: PropTypes.number,
};

