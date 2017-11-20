import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Image from 'react-native-transformable-image';
import PropTypes from 'prop-types';

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
      <View style={{
        bottom: 0,
        height: 65,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '100%',
        position: 'absolute',
        justifyContent: 'center',
      }}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, fontStyle: 'italic' }}>
          {(images[index] && images[index].caption) || ''}
        </Text>
      </View>
    );
  }

  get header() {
    return (
      <View style={{
        top: 0,
        height: 65,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '100%',
        position: 'absolute',
        justifyContent: 'center',
      }}
      />
    );
  }

  get galleryCount() {
    const { index, images } = this.state;
    return (
      <View style={{
        top: 0,
        height: 65,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '100%',
        position: 'absolute',
        justifyContent: 'center',
      }}
      >
        <Text style={{ textAlign: 'right', color: 'white', fontSize: 15, fontStyle: 'italic', paddingRight: '10%' }}>
          {index + 1} / {images.length}</Text>
      </View>
    );
  }

  renderError() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>This image cannot be displayed...</Text>
        <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>... please check supported images :)</Text>
      </View>
    );
  }

  // @todo: don't ask why we set pixels to this value, actually we have to
  // move to a decent image gallery software that takes care of caching
  // and image pan/zoom-to
  render() {
    const screen = Dimensions.get('window');
    return (
      <View style={{ flex: 1, backgroundColor: '#696969' }} >
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
