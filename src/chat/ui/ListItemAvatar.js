import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { CachedImage } from 'react-native-img-cache';
import UserAvatar from 'react-native-user-avatar';
import PropTypes from 'prop-types';
import AppUtil from '../../lib/util';
import { AppColors } from '../../theme';


const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    position: 'relative',
    backgroundColor: AppColors.brand().lA_avatar,
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
      sqrAvatar: this.props.sqrAvatar,
      showAvatar: true,
      width: this.props.width ? this.props.width : null,
      height: this.props.height ? this.props.height : null,
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
            width: this.state.width ? this.state.width : this.state.imageHeight,
            height: this.state.height ? this.state.height : this.state.imageHeight,
            borderRadius: this.state.sqrAvatar ? 0 : this.state.imageHeight / 2 }]}
        >
          <CachedImage
            style={[styles.avatarImage, {
              width: this.state.width ? this.state.width : this.state.imageHeight,
              height: this.state.height ? this.state.height : this.state.imageHeight,
              borderRadius: this.state.sqrAvatar ? 0 : this.state.imageHeight / 2 }]}
            source={{ uri: this.state.avatarUri }}
            onError={() => { this._hideAvatarView(); }}
          />
          <UserAvatar
            name={AppUtil.avatarInitials(this.state.avatarName)}
            size={this.state.imageHeight}
            style={[styles.userAvatar, {
              left: this.state.width ? -this.state.width / 2 : -this.state.imageHeight / 2,
              top: this.state.height ? -this.state.height / 2 : -this.state.imageHeight / 2,
              width: this.state.width ? this.state.width : this.state.imageHeight,
              height: this.state.height ? this.state.height : this.state.imageHeight,
              borderRadius: this.state.sqrAvatar ? 0 : this.state.imageHeight / 2 }]}
          />
        </View>
      );
    }
    return (
      <View
        style={[styles.noAvatarView, {
          width: this.state.width ? this.state.width : this.state.imageHeight,
          height: this.state.height ? this.state.height : this.state.imageHeight,
        }]}
      >
        <UserAvatar
          name={AppUtil.avatarInitials(this.state.avatarName)}
          size={this.state.imageHeight}
          style={{
            borderRadius: this.state.sqrAvatar ? 0 : this.state.imageHeight / 2,
            width: this.state.width ? this.state.width : this.state.imageHeight,
            height: this.state.height ? this.state.height : this.state.imageHeight,
          }}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={[styles.container, {
        width: this.state.width ? this.state.width : this.state.imageHeight,
        height: this.state.height ? this.state.height : this.state.imageHeight,
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
  sqrAvatar: false,
  width: null,
  height: null,
};

ListItemAvatar.propTypes = {
  source: PropTypes.string,
  name: PropTypes.string,
  avType: PropTypes.string,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  sqrAvatar: PropTypes.bool,
};

/* Export Component ==================================================================== */
export default ListItemAvatar;
