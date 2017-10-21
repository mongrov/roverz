import React from 'react';
import {
  View,
} from 'react-native';
// import { Actions } from 'react-native-router-flux';
import { CachedImage } from 'react-native-img-cache';
import UserAvatar from 'react-native-user-avatar';

function titleCase(str) {
  return (str.toLowerCase().split(' ').map(word => word.replace(word[0], word[0].toUpperCase())).join(' '))
  .replace(/(([^\s]+\s\s*){2})(.*)/, '$1');
}

export default class ChatAvatar extends React.Component {
  constructor(props) {
    super(props);
    const avatarUri = this.props.avatar;
    const displayTitle = this.props.name;
    const size = this.props.size;
    const borderRad = this.props.borderRad;
    this.state = {
      avatarUri,
      displayTitle,
      size,
      borderRad,
      showAvatar: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('memberDetail', 'componentWillReceiveProps', nextProps);
    this.setState({
      avatarUri: nextProps.avatar,
      avatarName: nextProps.name,
      showAvatar: true,
    });
  }

  _hideAvatarView() {
    this.setState({
      showAvatar: false,
    });
  }

  render() {
    if (this.state.showAvatar) {
      return (
        <View
          style={{
            width: this.state.size,
            height: this.state.size,
            justifyContent: 'center',
            alignItems: 'center' }}
        >
          <CachedImage
            style={{
              width: this.state.size,
              height: this.state.size,
              borderRadius: this.state.borderRad ? this.state.borderRad : this.state.size / 2,
            }}
            source={{ uri: this.state.avatarUri }}
            onError={() => { this._hideAvatarView(); }}
          />
        </View>
      );
    }
    return (
      <View
        style={{ width: this.state.size, height: this.state.size, justifyContent: 'center', alignItems: 'center' }}
      >
        <UserAvatar
          name={this.state.displayTitle ? titleCase(this.state.displayTitle) : 'A'}
          size={this.state.size}
          style={{
            borderRadius: this.state.borderRad ? this.state.borderRad : this.state.size / 2,
          }}
        />
      </View>
    );
  }
}

ChatAvatar.defaultProps = {
  avatar: '',
  name: '',
  size: 0,
  borderRad: null,
};

ChatAvatar.propTypes = {
  avatar: React.PropTypes.string,
  name: React.PropTypes.string,
  size: React.PropTypes.number,
  borderRad: React.PropTypes.number,
};
