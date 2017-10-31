import React from 'react';
import {
  View,
} from 'react-native';
import { CachedImage } from 'react-native-img-cache';
import UserAvatar from 'react-native-user-avatar';
import { AppColors } from '../../theme/';

function titleCase(str) {
  return (str.toLowerCase().split(' ').map(word => word.replace(word[0], word[0].toUpperCase())).join(' '))
  .replace(/(([^\s]+\s\s*){2})(.*)/, '$1');
}

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
          style={{
            position: 'relative',
            width: this.state.imageHeight,
            height: this.state.imageHeight,
            backgroundColor: '#f0f0f0',
            borderRadius: this.state.imageHeight / 2,
            justifyContent: 'center',
            alignItems: 'center' }}
        >
          <CachedImage
            style={{
              zIndex: 200,
              position: 'absolute',
              left: 0,
              top: 0,
              width: this.state.imageHeight,
              height: this.state.imageHeight,
              borderRadius: this.state.imageHeight / 2 }}
            source={{ uri: this.state.avatarUri }}
            onError={() => { this._hideAvatarView(); }}
          />
          <UserAvatar
            name={titleCase(this.state.avatarName)}
            colors={AppColors.avatar()}
            size={this.state.imageHeight}
            style={{
              zIndex: 190,
              position: 'absolute',
              left: -this.state.imageHeight / 2,
              top: -this.state.imageHeight / 2,
              width: this.state.imageHeight,
              height: this.state.imageHeight,
              borderRadius: this.state.imageHeight / 2 }}
          />
        </View>
      );
    }
    return (
      <View
        style={{
          width: this.state.imageHeight,
          height: this.state.imageHeight,
          justifyContent: 'center',
          alignItems: 'center' }}
      >
        <UserAvatar
          name={titleCase(this.state.avatarName)}
          colors={AppColors.avatar()}
          size={this.state.imageHeight}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{
        marginRight: 10,
        width: this.state.imageHeight,
        height: this.state.imageHeight,
        justifyContent: 'center',
        alignItems: 'center',
      }}
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
