import React from 'react';
import {
  View,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import { AppColors } from '../../theme/';
import t from '../../i18n/';

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
  keyboardView: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default class ImagePreview extends React.Component {
  constructor(props) {
    super(props);
    const imageUrl = this.props.imageUrl;
    const cameraData = this.props.cameraData;
    this.state = {
      cameraData,
      previewImageUri: imageUrl,
      messageText: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    if (this.state.cameraData !== nextProps.cameraData) {
      this.setState({
        cameraData: nextProps.cameraData,
        previewImageUri: nextProps.imageUrl,
      });
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar hidden={(Platform.OS === 'ios') !== false} />
        <Image
          style={styles.preview}
          source={{ uri: this.state.previewImageUri }}
        />
        <KeyboardAvoidingView
          behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
          style={[styles.overlay, styles.keyboardView]}
        >
          <View
            style={styles.messageContainer}
          >
            <TextInput
              placeholder={t('txt_img_preview')}
              style={[styles.textInput]}
              onChangeText={(text) => { this.setState({ messageText: text }); }}
              value={this.state.messageText}
              underlineColorAndroid={'transparent'}
            />
            <TouchableOpacity
              style={[styles.sendButton]}
              onPress={() => {
                Actions.pop({
                  popNum: 2,
                });
                setTimeout(() => {
                  Actions.refresh({
                    attach: {
                      cameraData: this.state.cameraData,
                      cameraMessage: this.state.messageText,
                      video: true,
                    },
                  });
                }, 0);
                // Actions.chatDetail({
                //   type: 'reset',
                //   obj: this.props.group,
                //   title: this.props.group.heading,
                //   attach: {
                //     cameraData: this.state.cameraData,
                //     cameraMessage: this.state.messageText,
                //   },
                //   duration: 0,
                // });
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
          style={[styles.captureButton]}
          onPress={() => {
            Actions.pop();
          }}
        >
          <Icon
            name="arrow-back"
            size={20}
            color="#000"
            width={20}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

ImagePreview.defaultProps = {
  imageUrl: '',
  cameraData: {},
};

ImagePreview.propTypes = {
  imageUrl: React.PropTypes.string,
  cameraData: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
