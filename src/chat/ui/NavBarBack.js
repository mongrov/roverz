import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { NavButton } from 'react-native-nav';
import { Actions } from 'react-native-router-flux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import PropTypes from 'prop-types';
import { AppStyles, AppColors } from '../../theme/';

const icon = AppColors.brand().nB_Icon;

export default class NavBarBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
    };
  }

  componentWillMount() {
    /* this.setState({
      title: Application.base.instance,
    }); */
  }

  componentDidMount() {

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
        alignItems: 'center',
        backgroundColor: AppColors.brand().secondary,
        zIndex: 999,
        height: isIphoneX() ? 90 : AppStyles.navbarHeight.height,
        paddingTop: isIphoneX() ? 30 : AppStyles.navbarHeight.paddingTop,
      }]}
      >
        <NavButton
          style={{ width: 35, paddingRight: 15, justifyContent: 'center', alignItems: 'flex-start' }}
          onPress={Actions.pop}
        >
          <Icon
            name="keyboard-arrow-left"
            size={32}
            color={icon}
          />
        </NavButton>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginRight: 30 }}>
          <Text style={[AppStyles.navbarTitle]}>{this.state.title}</Text>
        </View>
      </View>
    );
  }
}

NavBarBack.defaultProps = {
  title: '',
};

NavBarBack.propTypes = {
  title: PropTypes.string,
};
