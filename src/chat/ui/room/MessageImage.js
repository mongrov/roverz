import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { CachedImage } from 'react-native-img-cache';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 230,
    height: 230,
    borderRadius: 8,
    margin: 3,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
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

export default class MessageImage extends React.Component {
  constructor(props) {
    super(props);
    const obj = this.props.obj;
    // const _network = new Network();
    this.state = {
      obj,
      modalVisible: false,
      loaded: false,
    };
  }

  componentWillMount = () => {
    // console.log(this.props.currentMessage.image);
    // Image.prefetch('this.props.currentMessage.image', id => console.log(id));
    // this._network.chat.fixS3Urls(
    //   [this.props.currentMessage.image],
    //   (res) => {
    //     console.log('fixS3Urls');
    //     console.log(res);
    //   },
    //   true,
    // );
    // Image.getSize('https://facebook.github.io/react-native/img/header_logo.png', (width, height) => {
    //   // this.setState({width, height})
    //   console.log(width, height);
    // });
  }

  handleLongPress = () => {
    // this.props.pressLong();
  }

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
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          onPress={() => {
            Actions.imageGallery({
              imgUrl: this.props.currentMessage.image,
              imgTitle: this.props.currentMessage.text,
            });
          }}
          onLongPress={this.handleLongPress}
        >
          <CachedImage
            {...this.props.imageProps}
            style={[styles.image, this.props.imageStyle]}
            source={{ uri: this.props.currentMessage.image }}
            onLoad={() => { this.setState({ loaded: true }); }}
            resizeMethod={'scale'}
          >
            {
              !this.state.loaded &&
              (
                <View
                  style={{
                    flex: 1,
                    height: 150,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ActivityIndicator
                    animating
                    size={'large'}
                    color={'#AAA'}
                  />
                </View>
              )
            }
          </CachedImage>
        </TouchableOpacity>
      </View>
    );
  }
}

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  lightboxProps: {},
  obj: {},
  pressLong: null,
};

MessageImage.propTypes = {
  currentMessage: React.PropTypes.object,   // eslint-disable-line react/forbid-prop-types
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: React.PropTypes.object,       // eslint-disable-line react/forbid-prop-types
  lightboxProps: React.PropTypes.object,    // eslint-disable-line react/forbid-prop-types
  obj: React.PropTypes.object,    // eslint-disable-line react/forbid-prop-types
  pressLong: React.PropTypes.func,
};
