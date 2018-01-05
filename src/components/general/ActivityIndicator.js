import React from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { AppStyles } from '../../theme/';

export default class CustomActivityIndicator extends React.Component {
  constructor(props) {
    super(props);
    const size = this.props.size;
    const color = this.props.color;
    this.state = {
      size,
      color,
    };
  }

  render() {
    return (
      <ActivityIndicator
        animating
        size={this.state.size}
        color={this.state.color}
        style={[AppStyles.windowSize, AppStyles.containerCentered]}
      />
    );
  }
}

CustomActivityIndicator.defaultProps = {
  size: 'large',
  color: 'rgba(255,255,255,0.3)',
};

CustomActivityIndicator.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
};
