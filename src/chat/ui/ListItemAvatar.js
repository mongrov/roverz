import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { CachedImage } from 'react-native-img-cache';
import UserAvatar from 'react-native-user-avatar';
import { AppUtil } from 'roverz-chat';

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    position: 'relative',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    zIndex: 200,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  userAvatar: {
    zIndex: 190,
    position: 'absolute',
  },
  noAvatarView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});


class ListItemAvatar extends React.Component {
  constructor(props) {
    super(props);
    const source = this.props.source;
    const name = this.props.name;
    const avType = this.props.avType;
    this.state = {
      avatarUri: source,
      avatarName: name,
      avatarType: avType,
      imageHeight: this.props.size ? this.props.size : 60,
      showAvatar: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.avatarUri !== nextProps.source) {
      this.setState({
        avatarUri: nextProps.source,
        avatarName: nextProps.name,
        avatarType: nextProps.avType,
      });
    }
  }

  setAvType() {
    if (this.state.avatarType === 'private') {
      return 'lock';
    } else if (this.state.avatarType === 'direct') {
      return 'perm-identity';
    }
    return 'supervisor-account';
  }

  _hideAvatarView() {
    this.setState({
      showAvatar: false,
    });
  }

  _renderAvatar() {
    if (this.state.showAvatar) {
      return (
        <View
          style={[styles.avatar, {
            width: this.state.imageHeight,
            height: this.state.imageHeight,
            borderRadius: this.state.imageHeight / 2 }]}
        >
          <CachedImage
            style={[styles.avatarImage, {
              width: this.state.imageHeight,
              height: this.state.imageHeight,
              borderRadius: this.state.imageHeight / 2 }]}
            source={{ uri: this.state.avatarUri }}
            onError={() => { this._hideAvatarView(); }}
          />
          <UserAvatar
            name={AppUtil.avatarInitials(this.state.avatarName)}
            size={this.state.imageHeight}
            style={[styles.userAvatar, {
              left: -this.state.imageHeight / 2,
              top: -this.state.imageHeight / 2,
              width: this.state.imageHeight,
              height: this.state.imageHeight,
              borderRadius: this.state.imageHeight / 2 }]}
          />
        </View>
      );
    }
    return (
      <View
        style={[styles.noAvatarView, {
          width: this.state.imageHeight,
          height: this.state.imageHeight,
        }]}
      >
        <UserAvatar
          name={AppUtil.avatarInitials(this.state.avatarName)}
          size={this.state.imageHeight}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={[styles.container, {
        width: this.state.imageHeight,
        height: this.state.imageHeight,
      }]}
      >
        {this._renderAvatar()}
      </View>
    );
  }
}

ListItemAvatar.defaultProps = {
  source: null,
  name: null,
  avType: null,
  size: null,
};

ListItemAvatar.propTypes = {
  source: React.PropTypes.string,
  name: React.PropTypes.string,
  avType: React.PropTypes.string,
  size: React.PropTypes.number,
};

/* Export Component ==================================================================== */
export default ListItemAvatar;
