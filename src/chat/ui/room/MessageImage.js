import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { CachedImage } from 'react-native-img-cache';

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
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

export default class MessageImage extends React.Component {
  constructor(props) {
    super(props);
    const obj = this.props.obj;
    this.state = {
      obj,
      modalVisible: false,
    };
  }
  render() {
    console.log('this.props.currentMessage', this.props.currentMessage);
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          /* onPress={() => Actions.imagePreview({
            imageUri: this.props.currentMessage.image,
            obj: this.props.obj,
            msgId: this.props.currentMessage._id,
            msgLikes: this.props.currentMessage.likes,
            msgTitle: this.props.currentMessage.text,
          })} */
          onPress={() => {
            Actions.photoPreview({
              imgUrl: this.props.currentMessage.image,
              imgTitle: this.props.currentMessage.text,
            });
          }}
        >
          <CachedImage
            {...this.props.imageProps}
            style={[styles.image, this.props.imageStyle]}
            source={{ uri: this.props.currentMessage.image }}
          />
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
};

MessageImage.propTypes = {
  currentMessage: React.PropTypes.object,   // eslint-disable-line react/forbid-prop-types
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: React.PropTypes.object,       // eslint-disable-line react/forbid-prop-types
  lightboxProps: React.PropTypes.object,    // eslint-disable-line react/forbid-prop-types
  obj: React.PropTypes.object,    // eslint-disable-line react/forbid-prop-types
};
