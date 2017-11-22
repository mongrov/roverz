import React, { Component } from 'react';

import {
  View,
  ScrollView,
  Text,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { CachedImage } from 'react-native-img-cache';
import UserAvatar from 'react-native-user-avatar';
import { AppUtil } from 'roverz-chat';

import Network from '../../network';
import Group from '../../models/group';
import { AppStyles, AppSizes } from '../../theme/';

export default class MemberDetailView extends Component {

  constructor(props) {
    super(props);
    const { height, width } = Dimensions.get('window');
    const memberId = this.props.memberId;
    this._service = new Network();
    this._mounted = false;
    this.state = {
      memberId,
      memberDetail: {
        _id: '',
        email: '',
        username: '',
        name: '',
        utcOffset: '',
        avatar: '',
        type: '',
        status: '',
        statColor: 'rgba(0,0,0,0.3)',
      },
      layout: {
        height,
        width,
      },
    };
  }

  componentDidMount() {
    const userDetailList = this._service.chat.getUserAsList(this.props.memberId);
    userDetailList.addListener((list/* , changes */) => {
      if (!this._mounted) return;
      let statColor = '';
      switch (list[0].status) {
        case 'online':
          statColor = '#35ac19'; break;
        case 'away':
          statColor = '#fcb316'; break;
        case 'busy':
          statColor = '#d30230'; break;
        default:
          statColor = 'rgba(0,0,0,0.3)';
      }
      this.setState({
        memberDetail: {
          _id: list[0]._id,
          email: list[0].emails,
          username: list[0].username,
          name: list[0].name,
          utcOffset: list[0].utcOffset,
          avatar: list[0].avatar,
          type: list[0].type,
          status: list[0].status,
          statColor,
          avatarSuccess: true,
        },
      });
    });
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _onLayout = (event) => {
    this.setState({
      layout: {
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      },
    });
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
        {
          this.state.memberDetail.name !== '' &&
          <View
            style={{
              position: 'relative',
              // flex: 3,
              height: this.props.avHeight ? this.props.avHeight : 300,
            }}
          >
            <CachedImage
              source={{ uri: this.state.memberDetail.avatar }}
              style={{
                width: this.state.layout.width,
                height: this.props.avHeight ? this.props.avHeight : 300,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 999,
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
            />
            <UserAvatar
              name={AppUtil.avatarInitials(this.state.memberDetail.name)}
              size={this.props.avHeight ? this.props.avHeight : 300}
              style={{
                width: this.state.layout.width,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 0,
                borderRadius: 0,
              }}
            />
          </View>
        }
        <View
          style={{
            alignItems: 'center',
            paddingBottom: 20,
          }}
        >
          <Text
            style={[AppStyles.memberDetailsLG, { marginTop: 10 }]}
          >{ this.state.memberDetail.name }</Text>
          <Text
            style={[AppStyles.memberDetailsMD]}
          >{ `@${this.state.memberDetail.username}` }</Text>
          <Text
            style={[AppStyles.memberDetailsSM]}
          >{ this.state.memberDetail.email }</Text>
          {
            this.state.memberDetail.utcOffset !== null &&
            <Text
              style={[AppStyles.memberDetailsSM]}
            >{ `Time Zone: GMT ${this.state.memberDetail.utcOffset}` }</Text>
          }
          <View
            style={{
              borderTopColor: 'rgba(0,0,0,0.1)',
              borderTopWidth: 1,
              width: 150,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: this.state.memberDetail.statColor,
                marginRight: 5,
              }}
            />
            <Text
              style={{
                color: 'rgba(0,0,0,0.5)',
              }}
            >{this.state.memberDetail.status}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

MemberDetailView.defaultProps = {
  group: null,
  memberId: '',
  memberUsername: '',
  avHeight: null,
};

MemberDetailView.propTypes = {
  group: PropTypes.instanceOf(Group),
  memberId: PropTypes.string,
  memberUsername: PropTypes.string,
  avHeight: PropTypes.number,
};

