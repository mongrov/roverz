import React from 'react';
import {
  ProgressBarAndroid,
  ProgressViewIOS,
  Platform,
} from 'react-native';

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    const progress = this.props.progress;
    this.state = {
      progress,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      progress: nextProps.progress,
    });
  }

  render() {
    if (Platform.OS === 'ios') {
      return (
        <ProgressViewIOS
          progress={this.state.progress}
          progressTintColor={'#43D35D'}
          trackTintColor={'#DCDCDC'}
        />
      );
    }
    return (
      <ProgressBarAndroid
        progress={this.state.progress}
        color={'#43D35D'}
        styleAttr={'Small'}
      />
    );
  }
}

ProgressBar.defaultProps = {
  progress: 0.5,
};

ProgressBar.propTypes = {
  progress: React.PropTypes.number,
};
