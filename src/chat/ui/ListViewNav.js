import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { Network } from 'roverz-chat';
import { AppStyles, AppColors } from '../../theme/';
import ModuleConfig from '../../constants/config';

class ListViewNav extends React.Component {
  constructor(props) {
    super(props);
    this.net = new Network();
    this.state = {
      title: '',
    };
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }

  componentWillMount() {
    this.setState({
      title: ModuleConfig.instance,
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.updateCurrentUserInfo();
    }, 100);
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getCurrentUser() {
    return this.net.chat.getCurrentUser();
  }

  updateCurrentUserInfo() {
    const userData = this.getCurrentUser();
    if (userData && this._mounted) {
      this.setState({
        currentUser: {
          _id: userData._id,
          email: userData.emails,
          username: userData.username,
          avatar: userData.avatar,
          name: userData.name,
        },
      });
    }
  }

  showProfile() {
    const currUser = this.getCurrentUser();
    if (currUser) {
      Actions.memberDetail({ memberId: currUser._id });
    }
  }

  renderNavBrand() {
    if (ModuleConfig.navLogo) {
      return (
        <Image
          source={ModuleConfig.navLogo}
          style={{ opacity: 1, width: 130, height: 30 }}
          resizeMode={'contain'}
        />
      );
    }
    return (
      <Text style={[AppStyles.navbarTitle, { paddingHorizontal: 43 }]}>{this.state.title}</Text>
    );
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
        backgroundColor: AppColors.brand().secondary,
      }]}
      >
        <View style={{ width: 50 }} />
        <TouchableOpacity
          onPress={() => {
            Actions.aboutView();
          }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          {this.renderNavBrand()}
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: 50, alignItems: 'center', justifyContent: 'center',
          }}
          onPress={Actions.profileView}
        >
          <Icon
            name={'account-outline'}
            type="material-community"
            size={24}
            color={'#FFF'}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

ListViewNav.defaultProps = {

};

ListViewNav.propTypes = {

};

/* Export Component ==================================================================== */
export default ListViewNav;
