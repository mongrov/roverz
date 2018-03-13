import React from 'react';
import { Icon } from 'react-native-elements';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

import PropTypes from 'prop-types';
import { NavButton } from 'react-native-nav';
import { Actions } from 'react-native-router-flux';
import AppUtil from '../../lib/util';
import { AppStyles, AppColors } from '../../theme/';
import Group from '../../models/group';
import Network from '../../network';

import { ListItemAvatar } from './';
import Constants from '../../models/constants';


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
    this.customButtons = this.props.customButtons;
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
      status: '',
    };
    this.goToRoomInfo = this.goToRoomInfo.bind(this);
  }

  componentWillMount() {
    let icon = '';
    let usr = {};
    switch (this.state.roomType) {
      case Constants.G_DIRECT:
        icon = 'at';
        break;
      case Constants.G_PUBLIC:
        icon = 'pound';
        break;
      case Constants.G_PRIVATE:
        icon = 'lock';
        break;
      default:
        icon = 'pound';
    }
    if (this.state.roomType === Constants.G_DIRECT) {
      usr = this._net.chat.service.db.users.findByUserName(this.state.displayName);
    } else {
      usr.status = Constants.U_OFFLINE;
    }
    this.setState({
      icon,
      status: (usr && usr.status) || Constants.U_OFFLINE,
    });
  }

  _renderAvatar() {
    if (this.state.showAvatar) {
      if (this.state.roomType === Constants.G_DIRECT) {
        let statColor = '#a8a8a8';
        switch (this.state.status) {
          case Constants.U_ONLINE:
            statColor = AppColors.status().online; break;
          case Constants.U_AWAY:
            statColor = AppColors.status().away; break;
          case Constants.U_BUSY:
            statColor = AppColors.status().busy; break;
          default:
            statColor = AppColors.status().default;
        }
        return (
          <View>
            <ListItemAvatar
              source={this.avatarUri}
              name={AppUtil.avatarInitials(this.state.displayTitle ? this.state.displayTitle : this.state.displayName)}
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
        );
      }
      return (
        <View>
          <ListItemAvatar
            source={this.avatarUri}
            name={AppUtil.avatarInitials(this.state.displayTitle ? this.state.displayTitle : this.state.displayName)}
            size={36}
          />
        </View>
      );
    }
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
    if (this.state.roomType !== Constants.G_DIRECT) {
      Actions.roomInfo({
        group: this.state.obj,
        roomName: this.state.displayName,
        roomTitle: this.state.displayTitle,
        duration: 0,
      });
    } else {
      const user = this._net.chat.service.db.users.findByUserName(this.state.displayName);
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
                {this.state.roomType === Constants.G_DIRECT ? this.state.displayTitle : this.state.displayName}
              </Text>
            </View>
            <Text
              numberOfLines={1}
              style={[AppStyles.navbarTitle, styles.titleText]}
            >{this.state.status && this.state.roomType === Constants.G_DIRECT ?
              this.state.status : this.state.displayTitle}
            </Text>
          </View>
        </TouchableOpacity>
        {this.customButtons()}
      </View>
    );
  }
}

ChatNavBar.defaultProps = {
  obj: null,
  customButtons: () => {},
};

ChatNavBar.propTypes = {
  obj: PropTypes.instanceOf(Group),
  customButtons: PropTypes.func,
};

/* Export Component ==================================================================== */
export default ChatNavBar;

