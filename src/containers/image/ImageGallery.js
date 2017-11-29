import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Image from 'react-native-transformable-image';
import PropTypes from 'prop-types';
import t from '../../i18n/';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#696969' },
  captionContainer: {
    bottom: 0,
    height: 65,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
  },
  captionText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontStyle: 'italic',
  },
  header: {
    top: 0,
    height: 65,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
  },
  galleryCount: {
    top: 0,
    height: 65,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
  },
  galleryText: {
    textAlign: 'right',
    color: 'white',
    fontSize: 15,
    fontStyle: 'italic',
    paddingRight: '10%',
  },
  error: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 15,
    fontStyle: 'italic',
  },
});

export default class ImageGallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      images: [
        { caption: this.props.imgTitle, source: { uri: this.props.imgUrl } },
      ],
    };
    this.onChangeImage = this.onChangeImage.bind(this);

    // this.addImages();
    // this.removeImages();
    // this.removeImage(2, 3000);
  }

  onChangeImage(index) {
    this.setState({ index });
  }

  get caption() {
    const { images, index } = this.state;
    return (
      <View style={[styles.captionContainer]}>
        <Text style={[styles.captionText]}>
          {(images[index] && images[index].caption) || ''}
        </Text>
      </View>
    );
  }

  get header() {
    return (
      <View style={[styles.header]} />
    );
  }

  get galleryCount() {
    const { index, images } = this.state;
    return (
      <View style={[styles.galleryCount]} >
        <Text style={[styles.galleryText]}>
          {index + 1} / {images.length}</Text>
      </View>
    );
  }

  renderError() {
    return (
      <View style={[styles.error]}>
        <Text style={[styles.errorText]}>{t('err_img_loading_err_1')}</Text>
        <Text style={[styles.errorText]}>{t('err_img_loading_err_2')}</Text>
      </View>
    );
  }

  // @todo: don't ask why we set pixels to this value, actually we have to
  // move to a decent image gallery software that takes care of caching
  // and image pan/zoom-to
  render() {
    const screen = Dimensions.get('window');
    return (
      <View style={[styles.container]} >
        <Image
          style={{ width: screen.width, height: screen.height }}
          source={{ uri: this.props.imgUrl }}
          pixels={{ width: 3607, height: 2400 }}
        />
        {this.caption}
        {this.header}
      </View>
    );
  }
}

ImageGallery.defaultProps = {
  imgUrl: '',
  imgTitle: '',
};

ImageGallery.propTypes = {
  imgUrl: PropTypes.string,
  imgTitle: PropTypes.string,
};
