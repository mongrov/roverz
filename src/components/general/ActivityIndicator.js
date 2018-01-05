import React from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

export default class Preloader extends React.Component {
  constructor(props) {
    super(props);
    const size = this.props.size;
    const color = this.props.color;
    const style = this.props.style;
    this.state = {
      size,
      color,
      style,
    };
  }

  render() {
    return (
      <ActivityIndicator
        animating
        size={this.state.size}
        color={this.state.color}
        style={[this.state.style]}
      />
    );
  }
}

Preloader.defaultProps = {
  size: 'large',
  color: 'rgba(255,255,255,0.3)',
  style: [],
};

Preloader.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({}),
  ]),
};
