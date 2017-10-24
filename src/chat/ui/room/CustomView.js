import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { AppColors } from '../../../theme/';

const styles = StyleSheet.create({
  container: {
  },
  mapView: {
    width: 250,
    height: 150,
    borderRadius: 10,
    margin: 3,
    backgroundColor: 'white',
  },
});

export default class CustomView extends React.Component {
  render() {
    if (this.props.currentMessage.video) {
      return (
        <View style={[styles.mapView]}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => Actions.videoPreview({ videoUrl: this.props.currentMessage.video })}
          >
            <Icon
              name="video-library"
              size={48}
              color={AppColors.brand().third}
            />
            <Text>Play Video</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }
}

CustomView.defaultProps = {
  currentMessage: null,
};

CustomView.propTypes = {
  currentMessage: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
};

