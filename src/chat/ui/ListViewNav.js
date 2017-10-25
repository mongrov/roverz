import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
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
        <View style={{ padding: 7, marginLeft: 3 }}>
          <NavbarMenuButton />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginRight: 45 }}>
          {this.renderNavBrand()}
        </View>
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
