import React from 'react';
import { Icon } from 'react-native-elements';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import md5 from 'react-native-md5';
import PropTypes from 'prop-types';
import { NavButton } from 'react-native-nav';
import { Actions } from 'react-native-router-flux';
import { CachedImage } from 'react-native-img-cache';
import UserAvatar from 'react-native-user-avatar';
import AppUtil from '../../lib/util';
import { AppStyles, AppColors } from '../../theme/';
import Group from '../../models/group';
import Network from '../../network';
import Application from '../../constants/config';

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    flex: 1,
    paddingLeft: 0,
    flexDirection: 'row',
    paddingRight: 10,
    alignItems: 'center',
  },
  navButton: {
    width: 35,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  roomInformation: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    zIndex: 200,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  avIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    textAlign: 'left',
    flex: 1,
    fontSize: 14,
  },
  titleText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginBottom: 5,
    paddingLeft: 2,
    textAlign: 'left',
  },
  avatarView: {
    width: 36,
    height: 36,
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    zIndex: 20,
    left: 0,
    top: 0,
  },
  userAvatar: {
    position: 'absolute',
    zIndex: 10,
    left: -18,
    top: -18,
  },
  noAvatarView: {
    width: 36,
    height: 36,
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUserAvatar: {
    position: 'absolute',
    zIndex: 20,
    left: -18,
    top: -18,
  },
  iconWidth: {
    width: 20,
  },
  iconViews: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

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
      icon: '',
    };
    this.goToRoomInfo = this.goToRoomInfo.bind(this);
  }

  componentWillMount() {
    let icon = '';
    switch (this.state.roomType) {
      case 'direct':
        icon = 'at';
        break;
      case 'public':
        icon = 'pound';
        break;
      case 'private':
        icon = 'lock';
        break;
      default:
        icon = 'pound';
    }
    this.setState({ icon });
  }

  _renderAvatar() {
    if (this.state.showAvatar) {
      return (
        <View
          style={[styles.avatarView]}
        >
          <CachedImage
            style={[styles.avatarImage]}
            source={{ uri: this.avatarUri }}
            onError={() => { this._hideAvatarView(); }}
          />
          <UserAvatar
            name={AppUtil.avatarInitials(this.state.displayTitle ? this.state.displayTitle : this.state.displayName)}
            size={36}
            style={[styles.userAvatar]}
          />
        </View>
      );
    }
    return (
      <View
        style={[styles.noAvatarView]}
      >
        <UserAvatar
          name={AppUtil.avatarInitials(this.state.displayTitle ? this.state.displayTitle : this.state.displayName)}
          size={36}
          style={[styles.noUserAvatar]}
        />
      </View>
    );
  }

  _hideAvatarView() {
    this.setState({
      showAvatar: false,
    });
  }

  iconColor() {
    return 'rgba(255, 255, 255, 0.7)';
  }

  goToRoomInfo() {
    Keyboard.dismiss();
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

  renderSearchIcon() {
    return (
      <NavButton
        style={[styles.iconViews]}
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

  renderVideoConfIcon() {
    const mgvcConf = this._net.getServerSetting('MGVC_Enabled');
    const mgvcEnabled = mgvcConf && mgvcConf.value;
    if (mgvcEnabled === true) {
      const gname = this.state.obj.name;
      const gid = this.state.obj._id;
      const user = this._net.chat.getCurrentUser();
      const _super = this;
      const gtype = this.state.roomType;
      return (
        <NavButton
          style={[styles.iconViews]}
          onPress={() => {
            Keyboard.dismiss();
            const vcuserID = user ? md5.hex_md5(user._id) : '0';
            _super._net.chat.startVideoCall(gid);
            // const tempMsg = '@all Started Video conference';
            // _super._net.chat.sendMessage(gid, tempMsg);
            if (gtype === 'direct') {
              Actions.directConference({
                instance: Application.instance,
                groupName: gname,
                groupID: gid,
                groupType: gtype,
                userID: vcuserID,
                callType: 'OUTGOING',
              });
            } else {
              Actions.videoConference({
                instance: Application.instance,
                groupName: gname,
                groupID: gid,
                groupType: gtype,
                userID: vcuserID,
                callType: 'OUTGOING',
              });
            }
          }}
        >
          <Icon
            name={gtype === 'direct' ? 'phone' : 'videocam'}
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
      <View
        style={[AppStyles.navbar, AppStyles.navbarHeight, styles.navContainer, {
          backgroundColor: AppColors.brand().secondary,
        },
        ]}
      >
        <NavButton
          style={[styles.navButton]}
          // onPress={() => { Actions.groups({ type: 'replace', duration: 0 }); }}
          onPress={() => { Actions.pop(); }}
        >
          <Icon
            name="keyboard-arrow-left"
            size={32}
            color={'#FFF'}
          />
        </NavButton>
        <TouchableOpacity
          style={[styles.roomInformation]}
          onPress={this.goToRoomInfo}
        >
          {this._renderAvatar()}
          <View style={[styles.titleContainer]}>
            <View style={styles.avIcon}>
              <Icon
                name={this.state.icon}
                type="material-community"
                size={14}
                style={{ height: 14 }}
                color={this.iconColor()}
              />
              <Text
                numberOfLines={1}
                style={[AppStyles.navbarTitle, styles.nameText]}
              >
                {this.state.displayName}
              </Text>
            </View>
            {(!!this.state.displayTitle &&
              <Text
                numberOfLines={1}
                style={[AppStyles.navbarTitle, styles.titleText]}
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
