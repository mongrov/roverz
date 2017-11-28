import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { CachedImage } from 'react-native-img-cache';

import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 285,
    height: 150,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageActive: {
    resizeMode: 'contain',
  },
  mapView: {
    width: 250,
    height: 150,
    borderRadius: 13,
    margin: 3,
    backgroundColor: 'white',
  },
});

const videoThumbnail = require('../../../images/video-thumb.jpg');

export default class CustomView extends React.Component {
  render() {
    if (this.props.currentMessage.video) {
      return (
        <View style={[styles.container]}>
          <TouchableOpacity
            onPress={() => Actions.videoPreview({ videoUrl: this.props.currentMessage.video })}
          >
            <CachedImage
              style={[styles.image]}
              source={videoThumbnail}
            >
              <Icon
                name="play-circle-filled"
                size={48}
                color={'#000'}
              />
            </CachedImage>
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

