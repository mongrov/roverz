import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Network from '../../network';
import { AppStyles, AppColors } from '../../theme/';
import ModuleConfig from '../../constants/config';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    flex: 1,
    paddingLeft: 0,
    flexDirection: 'row',
  },
  widthView: {
    width: 50,
  },
  about: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navImage: {
    opacity: 1,
    width: 130,
    height: 50,
  },
  titleText: {
    paddingHorizontal: 43,
  },
});

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
    return this.net.service.loggedInUserObj;
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
          style={styles.navImage}
          resizeMode={'contain'}
        />
      );
    }
    return (
      <Text style={[AppStyles.navbarTitle, styles.titleText]}>{this.state.title}</Text>
    );
  }

  render() {
    return (
      <View style={[AppStyles.navbar, AppStyles.navbarHeight, styles.container, {
        backgroundColor: AppColors.brand().secondary,
      }]}
      >
        <View style={[styles.widthView]} />
        <TouchableOpacity
          onPress={() => {
            Actions.aboutView({
              logo: ModuleConfig.logo,
              instance: ModuleConfig.instance,
              aboutDetails: ModuleConfig.aboutDetails,
            });
          }}
          style={[styles.about]}
        >
          {this.renderNavBrand()}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.profile]}
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
