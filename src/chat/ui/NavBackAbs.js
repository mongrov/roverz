import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { AppColors } from '../../theme/';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 5,
    backgroundColor: AppColors.brand().nA_style,
    borderRadius: 40,
  },
});
const icon = AppColors.brand().nA_Icon;

export default class NavBackAbs extends React.Component {
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
      <TouchableOpacity
        style={[styles.container, { top: isIphoneX() ? 40 : 20 }]}
        onPress={Actions.pop}
      >
        <Icon
          name="arrow-back"
          size={30}
          color={icon}
          width={30}
        />
      </TouchableOpacity>
    );
  }
}

NavBackAbs.defaultProps = {
  title: '',
};

NavBackAbs.propTypes = {
  title: PropTypes.string,
};
