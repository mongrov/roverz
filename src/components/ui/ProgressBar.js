import React from 'react';
import {
  ProgressViewIOS,
  Platform,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { AppColors } from '../../theme/';
import t from '../../i18n';

const pTColor = AppColors.brand().pB_progressTintColor;
const tTColor = AppColors.brand().pB_trackTintColor;

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
          progressTintColor={pTColor}
          trackTintColor={tTColor}
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
