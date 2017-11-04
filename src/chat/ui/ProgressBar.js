import React from 'react';
import {
  ProgressViewIOS,
  Platform,
  Text,
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
    return (<Text>Loading</Text>);
  }
}

ProgressBar.defaultProps = {
  progress: 0.5,
};

ProgressBar.propTypes = {
  progress: React.PropTypes.number,
};
