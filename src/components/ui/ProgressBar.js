import React from 'react';
import {
  ProgressViewIOS,
  Platform,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import t from '../../i18n';


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
    return (<Text>{t('txt_loading')}</Text>);
  }
}

ProgressBar.defaultProps = {
  progress: 0.5,
};

ProgressBar.propTypes = {
  progress: PropTypes.number,
};
