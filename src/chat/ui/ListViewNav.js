import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { AppStyles, AppColors } from '../../theme/';
import ModuleConfig from '../../constants/config';
import { NavbarMenuButton } from '../../containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

class ListViewNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
    };
  }

  componentWillMount() {
    this.setState({
      title: ModuleConfig.instance,
    });
  }

  componentDidMount() {

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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {this.renderNavBrand()}
        </View>
        <TouchableOpacity
          style={{ width: 50, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon
            name={'alert-circle-outline'}
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
