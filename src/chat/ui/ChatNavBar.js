import React from 'react';
import { Icon } from 'react-native-elements';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { NavButton } from 'react-native-nav';
import { Actions } from 'react-native-router-flux';
import { CachedImage } from 'react-native-img-cache';
import UserAvatar from 'react-native-user-avatar';
import { AppUtil } from 'roverz-chat';
import md5 from 'md5';
import { AppStyles, AppColors } from '../../theme/';
import Group from '../../models/group';
import Network from '../../network';


class ChatNavBar extends React.Component {
  constructor(props) {
    super(props);
    const obj = this.props.obj;
    this._net = new Network();
    this.displayName = obj.name;
    this.displayTitle = obj.title;
    this.roomType = obj.type;
    this.avatarUri = obj.avatar;
    this.state = {
      obj,
      displayName: this.displayName,
      displayTitle: this.displayTitle,
      avatarUri: this.avatarUri,
      showAvatar: true,
      roomType: this.roomType,
    };
    this.goToRoomInfo = this.goToRoomInfo.bind(this);
  }

  componentDidMount() {
    console.log('this.state.obj', this.state.obj);
  }

  setAvType() {
    if (this.state.roomType === 'private') {
      return 'lock';
    } else if (this.state.roomType === 'direct') {
      return 'perm-identity';
    }
    return 'supervisor-account';
  }

  _renderAvatar() {
    if (this.state.showAvatar) {
      return (
        <View
          style={{
            width: 36,
            height: 36,
            paddingHorizontal: 7,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CachedImage
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              position: 'absolute',
              zIndex: 20,
              left: 0,
              top: 0,
            }}
            source={{ uri: this.avatarUri }}
            onError={() => { this._hideAvatarView(); }}
          />
          <UserAvatar
            name={AppUtil.avatarInitials(this.state.displayTitle ? this.state.displayTitle : this.state.displayName)}
            size={36}
            style={{
              position: 'absolute',
              zIndex: 10,
              left: -18,
              top: -18,
            }}
          />
        </View>
      );
    }
    return (
      <View
        style={{
          width: 36,
          height: 36,
          paddingHorizontal: 7,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <UserAvatar
          name={AppUtil.avatarInitials(this.state.displayTitle ? this.state.displayTitle : this.state.displayName)}
          size={36}
          style={{
            position: 'absolute',
            zIndex: 20,
            left: -18,
            top: -18,
          }}
        />
      </View>
    );
  }

  _hideAvatarView() {
    this.setState({
      showAvatar: false,
    });
  }

  iconType() {
    switch (this.state.roomType) {
      case 'direct':
        return 'at';
      case 'public':
        return 'pound';
      case 'private':
        return 'lock';
      default:
        return 'pound';
    }
  }

  iconColor() {
    return 'rgba(255, 255, 255, 0.3)';
  }

  chooseAvIcon(icon) {
    return (
      <Icon
        name={icon}
        type="material-community"
        size={16}
        style={{ width: 20 }}
        color={this.iconColor()}
      />
    );
  }

  goToRoomInfo() {
    if (this.state.roomType !== 'direct') {
      Actions.roomInfo({
        group: this.state.obj,
        roomName: this.state.displayName,
        roomTitle: this.state.displayTitle,
        duration: 0,
      });
    } else {
      const user = this._net.chat.findUserByUserName(this.state.displayName);
      if (user) {
        Actions.memberDetail({ memberId: user._id, duration: 0 });
      }
    }
  }

  renderAvIcon() {
    switch (this.state.roomType) {
      case 'direct':
        return this.chooseAvIcon('at');
      case 'public':
        return this.chooseAvIcon('pound');
      case 'private':
        return this.chooseAvIcon('lock');
      default:
        return this.chooseAvIcon('pound');
    }
  }

  renderSearchIcon() {
    return (
      <NavButton
        style={{ width: 40, height: 50, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => Actions.messageSearch({ group: this.state.obj })}
      >
        <Icon
          name="search"
          size={24}
          color={'#FFF'}
        />
      </NavButton>
    );
  }

  renderUploads() {
    return (
      <NavButton
        style={{ width: 40, height: 50, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => Actions.photoBrowser({ group: this.state.obj })}
      >
        <Icon
          name="insert-photo"
          size={24}
          color={'#FFF'}
        />
      </NavButton>
    );
  }

  renderVideoConfIcon() {
    const jitsiConf = this._net.getServerSetting('Jitsi_Enabled');
    const jitsiEnabled = jitsiConf && jitsiConf.value;
    if (jitsiEnabled === true) {
      const jitsiPrefix = this._net.getServerSetting('Jitsi_URL_Room_Prefix').value;
      let uniqueID = (this._net.getServerSetting('uniqueID').value);
      const roomID = this.state.obj._id;
      uniqueID += roomID;
      const jitsiID = jitsiPrefix + md5(uniqueID);
      const name = this.state.displayName;
      const avatar = this.state.avatarUri;
      return (
        <NavButton
          style={{ width: 40, height: 50, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            this._net.chat.startVideoCall(roomID);
            Actions.videoConference({
              jitsiURL: jitsiID,
              displayName: name,
              avatarUri: avatar,
            });
          }}
        >
          <Icon
            name="videocam"
            size={32}
            color={'#FFF'}
          />
        </NavButton>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={[AppStyles.navbar, AppStyles.navbarHeight, {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        flex: 1,
        paddingLeft: 0,
        flexDirection: 'row',
        paddingRight: 10,
        alignItems: 'center',
        backgroundColor: AppColors.brand().secondary,
      }]}
      >
        <NavButton
          style={{ width: 35, paddingRight: 15, justifyContent: 'center', alignItems: 'flex-start' }}
          onPress={() => { Actions.groups({ duration: 0 }); }}
        >
          <Icon
            name="keyboard-arrow-left"
            size={32}
            color={'#FFF'}
          />
        </NavButton>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={this.goToRoomInfo}
        >
          {this._renderAvatar()}
          <View style={{ flex: 1, zIndex: 200, flexDirection: 'column', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              {this.renderAvIcon()}
              <Text
                numberOfLines={1}
                style={[AppStyles.navbarTitle, {
                  textAlign: 'left',
                  flex: 1,
                  fontSize: 14,
                }]}
              >
                {this.state.displayName}
              </Text>
            </View>
            {(!!this.state.displayTitle &&
              <Text
                numberOfLines={1}
                style={[AppStyles.navbarTitle,
                { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 5, paddingLeft: 2, textAlign: 'left' }]}
              >{this.state.displayTitle}</Text>
            )}
          </View>
        </TouchableOpacity>
        {this.renderVideoConfIcon()}
      </View>
    );
  }
}

ChatNavBar.defaultProps = {
  obj: null,
};

ChatNavBar.propTypes = {
  obj: PropTypes.instanceOf(Group),
};

/* Export Component ==================================================================== */
export default ChatNavBar;
