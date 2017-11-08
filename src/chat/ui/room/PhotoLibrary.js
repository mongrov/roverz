import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import CameraRollPicker from 'react-native-camera-roll-picker';
import { Actions } from 'react-native-router-flux';
import NavBar, {
  NavButton,
  NavButtonText,
  NavTitle,
} from 'react-native-nav';
import { AppColors } from '../../../theme/';

import ImageUtil from './ImageUtil';

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: (Platform.OS === 'ios') ? 16 : 0,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    padding: 5,
    marginRight: 8,
    height: 40,
    flex: 1,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  sendButton: {
    height: 40,
    width: 40,
  },
  buttonsSpace: {
    width: 30,
  },
});

export default class PhotoLibrary extends React.Component {
  constructor(props) {
    super(props);
    this._images = [];
    const groupId = this.props.groupId;
    this.state = {
      groupId,
      modalPreviewVisible: false,
      imageData: {},
      imageMessage: '',
    };
    this.selectImages = this.selectImages.bind(this);
  }

  setImages(images) {
    this._images = images;
  }

  getImages() {
    return this._images;
  }

  setPreviewModalVisible(visible = false) {
    this.setState({ modalPreviewVisible: visible });
  }

  selectImages(images) {
    this.setImages(images);
  }

  selectPictureForPreview = (data) => {
    this.setState({
      imageData: data,
      previewImageUri: data.path,
      modalPreviewVisible: true,
    });

    const images = this.getImages().map(image => ({
      image: image.uri,
    }));
    this.props.onSend(images);
    this.setImages([]);
    this.setPreviewModalVisible(true);
  }

  sendImageMessages() {
    const images = this.getImages().map(image => ({
      image: image.uri,
    }));

    if (images && images.length > 0) {
      if (images.length === 1) {
        const data = { path: images[0].image };
        this.selectPictureForPreview(data);
      } else {
        for (let i = 0; i < images.length; i += 1) {
          const data = { path: images[i].image };
          const _progressCallback = this.props.progressCallback;
          new ImageUtil().uploadImage(data, this.state.groupId, true, this.state.imageMessage,
          (fuFileName, fuPercent, fuMsg) => {
            // console.log(fuFileName, ':', fuPercent, ':', fuMsg);
            const fileNameCount = fuFileName;
            const percentage = Math.round(Number(parseFloat(fuPercent).toFixed(2) * 100));
            if (_progressCallback) {
              _progressCallback(fileNameCount, fuMsg, percentage, images.length, i);
            }
          });
        }
        this.props.onSend(images);
        this.setImages([]);
        Actions.pop();
      }
    }
  }

  sendLibraryImage() {
    const _progressCallback = this.props.progressCallback;
    new ImageUtil().uploadImage(this.state.imageData, this.state.groupId, true, this.state.imageMessage,
    (fuFileName, fuPercent, fuMsg) => {
      // console.log(fuFileName, ':', fuPercent, ':', fuMsg);
      const percentage = Math.round(Number(parseFloat(fuPercent).toFixed(2) * 100));
      if (_progressCallback) {
        _progressCallback(fuFileName, fuMsg, percentage, 1, 0);
      }
    });
    this.setState({
      imageData: {},
      imageMessage: '',
    });
    Actions.pop();
  }

  renderNavBar() {
    return (
      <NavBar style={{
        statusBar: {
          backgroundColor: '#FFF',
        },
        navBar: {
          backgroundColor: '#FFF',
        },
      }}
      >
        <NavButton onPress={() => {
          this.setState({ imageData: {} });
          Actions.pop({ duration: 0 });
        }}
        >
          <NavButtonText style={{
            color: '#000',
          }}
          >
            {'Cancel'}
          </NavButtonText>
        </NavButton>
        <NavTitle style={{
          color: '#000',
        }}
        >
          {'Camera Roll'}
        </NavTitle>
        <NavButton onPress={() => {
          this.sendImageMessages();
        }}
        >
          <NavButtonText style={{
            color: '#000',
          }}
          >
            {'Send'}
          </NavButtonText>
        </NavButton>
      </NavBar>
    );
  }

  renderPreview() {
    return (
      <Modal
        animationType={'none'}
        transparent={false}
        visible={this.state.modalPreviewVisible}
        onRequestClose={() => {
          this.setPreviewModalVisible(false);
        }}
      >
        <Image
          style={styles.preview}
          source={{ uri: this.state.previewImageUri }}
        />
        <KeyboardAvoidingView
          behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
          style={[styles.overlay, {
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }]}
        >
          <View
            style={styles.messageContainer}
          >
            <TextInput
              placeholder={'Image caption..'}
              style={[styles.textInput]}
              onChangeText={(text) => { this.setState({ imageMessage: text }); }}
              value={this.state.imageMessage}
              underlineColorAndroid={'transparent'}
            />
            <TouchableOpacity
              style={[styles.sendButton]}
              onPress={() => {
                this.setPreviewModalVisible(false);
                this.sendLibraryImage();
              }}
            >
              <Icon
                name="send"
                size={34}
                color={AppColors.brand().third}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <TouchableOpacity
          style={[styles.captureButton, {
            position: 'absolute',
            top: 20,
            left: 20,
          }]}
          onPress={() => {
            this.setPreviewModalVisible(false);
            this.setState({ imageData: {} });
          }}
        >
          <Icon
            name="arrow-back"
            size={20}
            color="#000"
            width={20}
          />
        </TouchableOpacity>
      </Modal>
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        {this.renderPreview()}
        {this.renderNavBar()}
        <CameraRollPicker
          maximum={10}
          assetType={'All'}
          pageSize={2}
          imagesPerRow={3}
          callback={this.selectImages}
          selected={[]}
        />
      </View>
    );
  }
}

PhotoLibrary.defaultProps = {
  onSend: () => {},
  containerStyle: {},
  textStyle: {},
  groupId: null,
  progressCallback: () => {},
};

PhotoLibrary.propTypes = {
  onSend: React.PropTypes.func,
  containerStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
  groupId: PropTypes.string,
  progressCallback: PropTypes.func,
};
