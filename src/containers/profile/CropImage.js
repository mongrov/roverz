import React, { Component } from 'react';
import {
 View, StyleSheet, ScrollView, Alert,
 Image, NativeModules,
} from 'react-native';

import Video from 'react-native-video';
import { Button, Spacer } from '../../components/ui';
import { AppColors } from '../../theme/';


var ImagePicker = NativeModules.ImageCropPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: AppColors.brand().cI_buttonBg,
    marginBottom: 10,
  },
  text: {
    color: AppColors.brand().cI_textColor,
    fontSize: 20,
    textAlign: 'center',
  },
});

export default class CropImage extends Component {

  constructor() {
    super();
    this.state = {
      image: null,
      images: null,
    };
    this.pickMultiple = this.pickMultiple.bind(this);
    this.cleanupImages = this.cleanupImages.bind(this);
    this.cleanupSingleImage = this.cleanupSingleImage.bind(this);
  }

  pickSingleWithCamera(croppin) {
    ImagePicker.openCamera({
      cropping: croppin,
      width: 500,
      height: 500,
      includeExif: true,
    }).then((image) => {
      console.log('received image', image);
      this.setState({
        image: { uri: image.path, width: image.width, height: image.height },
        images: null,
      });
    }).catch(e => console.log(e));
  }

  pickSingleBase64(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      includeBase64: true,
      includeExif: true,
    }).then((image) => {
      console.log('received base64 image');
      this.setState({
        image: { uri: `data:${image.mime};base64,${image.data}`, width: image.width, height: image.height },
        images: null,
      });
      console.log('viswa', image);
    }).catch(e => console.log(e));
  }

  cleanupImages() {
    ImagePicker.clean().then(() => {
      console.log('removed tmp images from tmp directory');
    }).catch((e) => {
      console.log(e);
    });
  }

  cleanupSingleImage() {
    const image = this.state.image || (this.state.images && this.state.images.length ? this.state.images[0] : null);
    console.log('will cleanup image', image);

    ImagePicker.cleanSingle(image ? image.uri : null).then(() => {
      console.log(`removed tmp image ${image.uri} from tmp directory`);
    }).catch((e) => {
      console.log(e);
    });
  }

  cropLast() {
    if (!this.state.image) {
      return Alert.alert('No image', 'Before open cropping only, please select image');
    }

    ImagePicker.openCropper({
      path: this.state.image.uri,
      width: 200,
      height: 200,
    }).then((image) => {
      console.log('received cropped image', image);
      this.setState({
        image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
        images: null,
      });
    }).catch((e) => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }

  pickSingle(cropit, circular = false) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
      compressImageQuality: 0.5,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    }).then((image) => {
      console.log('received image', image);
      this.setState({
        image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
        images: null,
      });
    }).catch((e) => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
    }).then((images) => {
      this.setState({
        image: null,
        images: images.map((i) => {
          console.log('received image', i);
          return { uri: i.path, width: i.width, height: i.height, mime: i.mime };
        }),
      });
    }).catch(e => (e));
  }

  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }

  renderVideo(video) {
    return (<View style={{ height: 300, width: 300 }}>
      <Video
        source={{ uri: video.uri, type: video.mime }}
        style={{ position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        rate={1}
        paused={false}
        volume={1}
        muted={false}
        resizeMode={'cover'}
        onError={e => console.log(e)}
        onLoad={load => console.log(load)}
        repeat={true}
      />
    </View>);
  }

  renderImage(image) {
    return <Image style={{ width: 300, height: 300, resizeMode: 'contain' }} source={image} />;
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }

  render() {
    return (<View style={styles.container}>
      <ScrollView>
        {this.state.image ? this.renderAsset(this.state.image) : null}
        {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
      </ScrollView>
      <Button
        title={'Select Single With Camera With Cropping'}
        onPress={() => this.pickSingleWithCamera(true)}
        backgroundColor="transparent"
        style={{}}
      />
      <Spacer />
      <Button
        title={'Select Single With Cropping'}
        onPress={() => this.pickSingle(true)}
        backgroundColor="transparent"
        style={{}}
      />
    </View>);
  }
}
