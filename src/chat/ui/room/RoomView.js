/**
 * ChatRoom Screen
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Keyboard,
  TextInput,
  Dimensions,
  Platform,
  AppState,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import emoji from 'node-emoji';
import ImagePicker from 'react-native-image-crop-picker';


import {
  GiftedChat,
  InputToolbar,
  Composer,
 } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import AppUtil from '../../../lib/util';

// Components
import Network from '../../../network';
import Group from '../../../models/group';
import { ProgressBar } from '../../../components/ui/';
import AttachAudio from '../../attachments/AttachAudio';

import { AppStyles, AppSizes, AppColors } from '../../../theme/';
import Application from '../../../constants/config';

import ChatAvatar from './ChatAvatar';
import Bubble from './Bubble';
import ImageUtil from '../../attachments/ImageUtil';
import t from '../../../i18n';


const NO_OF_MSGS = 30;
const photoIconColor = AppColors.brand().room_photoIconColor;
// const videoIconColor = AppColors.brand().room_videoIconColor;
const cameraIconColor = AppColors.brand().room_cameraIconColor;
// const audioIconColor = AppColors.brand().room_audioIconColor;
const sentBgColor = AppColors.brand().room_sentBgColor;
const failedBgColor = AppColors.brand().room_failedBgColor;
const playlistAddIconColor = AppColors.brand().room_playlistAddIconColor;
const placeholderTextColor = AppColors.brand().room_placeholderTextColor;
const inputToolbarBg = AppColors.brand().room_inputToolbarBg;
const loadingIndicator = AppColors.brand().room_loadingIndicator;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: AppColors.brand().room_containerBg,
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: AppColors.brand().room_footerTextColor,
    marginBottom: 10,
  },
  chatFooterText: {
    color: AppColors.brand().room_chatFooterTextColor,
  },
  footerView: {
    backgroundColor: AppColors.brand().room_footerViewBg,
    borderRadius: 3,
    padding: 10,
    marginVertical: 5,
  },
  textInputStyleAndroid: {
    flex: 1,
    padding: 5,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    borderRadius: 5,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: AppColors.brand().room_textInputStyleBg,
  },
  textInputStyleIos: {
    backgroundColor: AppColors.brand().room_textInputStyleBg,
    borderRadius: 3,
    padding: 5,
    marginRight: 5,
    marginLeft: 0,
    lineHeight: 16,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  toastText: {
    color: AppColors.brand().room_toastTextColor,
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
  },
});

const textStyle = {
  // fontSize: 30,
  // lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styl = {
  left: StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
    },
    text: {
      // color: 'black',
      ...textStyle,
    },
    link: {
      color: AppColors.chat().linkLeft,
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
    },
    text: {
      color: 'red',
      ...textStyle,
    },
    link: {
      color: AppColors.chat().linkRight,
      textDecorationLine: 'underline',
    },
  }),
};

/* Component ==================================================================== */
class ChatRoomView extends React.Component {
  constructor(props) {
    super(props);
    this._network = new Network();
    this._db = this._network.db;
    this._group = props.obj;
    this.attach = props.attach;
    this.state = {
      messages: [],
      typingText: null,
      inProgress: false,
      uploadingFile: [],
      showActions: true,
      loadEarlier: true,
      isLoadingEarlier: false,
      msgCopied: false,
      loaded: true,
      attach: this.attach,
      composerText: '',
      attachMenu: false,
      attachAudio: false,
      recordTime: 0,
      height: 44,
      text: '',
      layout: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      },
      appState: AppState.currentState,
      attachAudioBtn: false,
    };
    console.log('APPSTATE RV - constructor', `${AppState.currentState}`);
    this.onSend = this.onSend.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderChatFooter = this.renderChatFooter.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderAvatar = this.renderAvatar.bind(this);
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this._progressCallback = this._progressCallback.bind(this);
    this.messageCopy = this.messageCopy.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.subscriptions();
    this._didMount = false;
  }

  componentWillMount() {
    const mgAudio = this._network.getServerSetting('Message_AudioRecorderEnabled');
    const mgAudioEnabled = mgAudio && mgAudio.value;
    if (mgAudioEnabled) {
      this.setState({ attachAudioBtn: true });
    }
    console.log('APPSTATE RV - componentWillMount');
  }

  componentDidMount() {
    console.log('APPSTATE RV - componentDidMount start');
    AppState.addEventListener('change', this._handleAppStateChange);
    const _super = this;
    AppUtil.debug(new Date().toLocaleString(), '[Performance] RoomView');
    this._callOutstanding = false;
    this._changeListener = (messages, changes) => {
      console.log('APPSTATE RV - componentDidMount _changeListener');
      // @todo: This check can be removed after upgrading to react-native 0.45
      if (_super._changeListener == null ||
        _super._callOutstanding === true ||
        !_super._didMount ||
        _super.state.appState.match(/inactive|background/)) return;
      console.log('APPSTATE RV - componentDidMount _super._changeListener');
      // console.log(`***** [chat-${_super._group.name}] got updated  **** `);
      // @todo: there seems to be a bug in realm that doesn't remove the listener
      console.log('APPSTATE RV - componentDidMount _super._changeListener', changes);
      // if (changes.modifications && changes.modifications.length > 0) {
      //   AppUtil.debug(changes, '[Debug] RoomView changes');
      // }
      // first mark the channel as read
      // @todo: There is a scenario, when this msg and subscription message is out of order
      // still the unread is present
      if (_super._group.unread > 0) {
        this._network.service.setRoomAsRead(_super._group._id);
      }
      _super.prepareMessages();
      // setTimeout(() => { this.setState({ loaded: true }); }, 100);
    };
    this._group.messages.addListener(this._changeListener);


    // this._userTyping = this._network.meteor.monitorChanges('stream-notify-room', (result) => {
    //   // AppUtil.debug(result, '[Performance] RoomView userTyping');
    //   // user is typing message here result[0].args
    //   // args: [ 'test', true ],  - format user, true/false (typing or stopped)
    //   if (this._didMount && result[0] !== undefined) {
    //     if (result[0].args[1]) {
    //       this.setState(({
    //         typingText: `${result[0].args[0]} is typing...`,
    //       }));
    //     } else {
    //       this.setState(({
    //         typingText: null,
    //       }));
    //     }
    //   }
    // });
    this._didMount = true;
    // if (this._group.moreMessages && this._group.sortedMessages.length < NO_OF_MSGS) {
    //   this._network.chat.fetchMessages(this._group, NO_OF_MSGS);
    // }
    // quick hack to see if this works for this scroll bug
    // https://github.com/facebook/react-native/issues/1831, &
    // https://github.com/facebook/react-native/issues/1831#issuecomment-231069668
    _super.prepareMessages();
    AppUtil.debug(new Date().toLocaleString(), '[Performance] RoomView');
    if (this.props.attach.cameraData) {
      this.sendCameraImage(this.props.attach.cameraData, this.props.attach.cameraMessage);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('APPSTATE RV - componentWillReceiveProps');
    if (this.state.attach !== nextProps.attach) {
      // console.log('this.state.attach', nextProps.attach);
      this.setState({
        attach: nextProps.attach,
      });
      this.sendCameraImage(nextProps.attach.cameraData, nextProps.attach.cameraMessage, nextProps.attach.video);
    }
    this.setState({
      attachAudio: nextProps.attachAudio,
    });
  }

  componentWillUnmount() {
    console.log('APPSTATE RV - componentWillUnmount');
    AppState.removeEventListener('change', this._handleAppStateChange);
    // this._network.meteor.stopMonitoringChanges(this._userTyping);
    this._group.messages.removeListener(this._changeListener);
    this._changeListener = null;
    this._didMount = false;
    AppUtil.debug('Component unmounted', '[Performance] RoomView');
  }


  onSend() {
    if (this.state.text.trim().length > 0) {
      const unEmoMsg = emoji.unemojify(this.state.text.trim());
      this._network.service.sendMessage(
        this._group,
        unEmoMsg,
      );
      this.setState({
        text: '',
        height: 44,
      });
    }
  }

  onLoadEarlier() {
    this._network.chat.fetchOldMessages(this._group, NO_OF_MSGS);
  }

  _handleAppStateChange = (nextAppState) => {
    console.log('APPSTATE RV', `${AppState.currentState} => ${nextAppState}`);
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('APPSTATE - App has come to the foreground!');
    }
    this.setState({ appState: nextAppState });
  }

  // isMarkDownEnabled() {
  //   const markdownConf = this._network.getServerSetting('Markdown_Parser');
  //   if (markdownConf && !(markdownConf.value === 'disabled')) {
  //     return true;
  //   }
  //   return false;
  // }

  prepareMessages() {
    console.log('APPSTATE RV - prepareMessages start');
    this._callOutstanding = true;
    // refresh control
    this._network.chat.fixYapImageUrls(Array.prototype.slice.call(this._group.sortedMessages), (msg) => {
      console.log('APPSTATE RV - prepareMessages fixYapImageUrls');
      AppUtil.debug(msg, '[Performance] RoomView msg updates');
      this.setState({
        messages: msg,
        loadEarlier: this._group.moreMessages,
        loaded: true,
      }, () => { this._callOutstanding = false; console.log('APPSTATE RV - prepareMessages setState'); });
    });
  }

  // @todo: the subscriptions are not getting evicted, we have to fix it - especially for typing
  subscriptions() {
    // callback is usually used for when subscription is ready
    // Meteor.subscribe('stream-notify-room', `${this._group._id}/updateMessage`, false, this._roomChanges);
    // Meteor.subscribe('stream-notify-room', `${this._group._id}/typing`, false);
  }

  sendCameraImage(cameraData, cameraMessage, video) {
    console.log('APPSTATE RV - sendCameraImage');
    const _super = this;
    new ImageUtil().uploadImage(cameraData, this._group._id, video, cameraMessage,
    (fuFileName, fuPercent, fuMsg) => {
      const percentage = Math.round(Number(parseFloat(fuPercent).toFixed(2) * 100));
      _super._progressCallback(fuFileName, fuMsg, percentage, 1, 0);
      console.log('APPSTATE RV - sendCameraImage callback');
    });
  }
  pickMultipleVideos() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      mediaType: 'video',
      maxFiles: 10,
    }).then((videos) => {
      console.log('received image 1', videos);
      videos.map((video) => {
        for (let i = 0; i <= videos.length; i += 1) {
          console.log('PM - imageafter', video);
          const videoAdd = { path: videos[i].path };
          console.log('PM - roomview', videoAdd);
          const _progressCallback = this._progressCallback;
          new ImageUtil().uploadImage(videoAdd, this._group._id, false, 'Video',
          (fuFileName, fuPercent, fuMsg) => {
            console.log(fuFileName, ':', fuPercent, ':', fuMsg);
            const fileNameCount = fuFileName;
            console.log('PM - fileNameCount', fileNameCount);
            const percentage = Math.round(Number(parseFloat(fuPercent).toFixed(2) * 100));
            if (_progressCallback) {
              _progressCallback(fileNameCount, fuMsg, percentage, videos.length, i);
            }
          });
        }
        return null;
      });
      this.setState({
        image: null,
        videos: videos.map((i) => {
          console.log('received image 2', i);
          return { uri: i.path, width: i.width, height: i.height, mime: i.mime };
        }),
      });
    }).catch(e => console.log(e));
  }

  pickMultiplePhotos() {
    console.log('LogOut - pickMultiplePhotos', this._network.service.loggedInUser);
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      mediaType: 'photo',
      maxFiles: 10,
    })
    .then((images) => {
      console.log('LogOut - imagemap', this._network.service.loggedInUser);
      console.log('PM - images', images);
      if (images && images.length > 0) {
        if (images.length === 1 && images[0].mime !== 'image/gif' && Platform.OS !== 'ios') {
          console.log('LogOut - singleimageselection', this._network.service.loggedInUser);
          // Cropper
          ImagePicker.openCropper({
            path: images[0].path,
            width: 1000,
            height: 1000,
          }).then((data) => {
            console.log('LogOut - singleimagecrop', this._network.service.loggedInUser);
            console.log('PM - data', data);
            const _progressCallback = this._progressCallback;
            new ImageUtil().uploadImage(data, this._group._id, true, 'Image',
            (fuFileName, fuPercent, fuMsg) => {
              console.log(fuFileName, ':', fuPercent, ':', fuMsg);
              const fileNameCount = fuFileName;
              console.log('LogOut - roomview', this._network.service.loggedInUser);
              const percentage = Math.round(Number(parseFloat(fuPercent).toFixed(2) * 100));
              if (_progressCallback) {
                _progressCallback(fileNameCount, fuMsg, percentage, 1, 0);
              }
            });
          });
        } else {
          // send
          images.map((image) => {
            for (let i = 0; i <= images.length; i += 1) {
              console.log('LogOut - multipleimageselection', this._network.service.loggedInUser);
              console.log('PM - imageafter', image);
              const imageAdd = { path: images[i].path };
              // console.log('PM - roomview', imaging);
              const _progressCallback = this._progressCallback;
              new ImageUtil().uploadImage(imageAdd, this._group._id, true, 'Image',
              (fuFileName, fuPercent, fuMsg) => {
                console.log(fuFileName, ':', fuPercent, ':', fuMsg);
                const fileNameCount = fuFileName;
                console.log('PM - fileNameCount', fileNameCount);
                console.log('LogOut - roomview', this._network.service.loggedInUser);
                const percentage = Math.round(Number(parseFloat(fuPercent).toFixed(2) * 100));
                if (_progressCallback) {
                  _progressCallback(fileNameCount, fuMsg, percentage, images.length, i);
                }
              });
            }
            return null;
          });
        }
      }
      this.setState({
        image: null,
        images: images.map((i) => {
          console.log('ph-received image 2', i);
          return { uri: i.path, width: i.width, height: i.height, mime: i.mime };
        }),
      });
    })
    .catch(e => console.log(e));
  }

  _progressCallback(id, msg, percent, totalFiles, fileCount) {
    console.log('APPSTATE RV - sendCameraImage');
    const _super = this;
    _super.setState({ inProgress: true });
    const { uploadingFile } = _super.state;

    if (msg === 'INPROGRESS' || msg === 'COMPLETE' || msg === 'STARTED') {
      uploadingFile[fileCount] = {
        id,
        msg,
        percent,
        modal: false,
      };
      _super.setState({ uploadingFile });
      // console.log(_super.state.uploadingFile);
    } else {
      uploadingFile[fileCount] = {
        id,
        msg,
        percent,
        modal: true,
      };
      _super.setState({ uploadingFile });
      setTimeout(() => {
        uploadingFile[fileCount] = {};
        _super.setState({ uploadingFile });
      }, 3000);
    }
  }

  messageCopy() {
    this.setState({ msgCopied: true });
    setTimeout(() => {
      this.setState({ msgCopied: false });
    }, 1000);
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        obj={this._group}
        msgCopy={this.messageCopy}
        wrapperStyle={{
          left: {
            // backgroundColor: '#FFF',
            borderRadius: 8,
          },
          right: {
            backgroundColor: AppColors.chat().bubbleRight,
            borderRadius: 8,
          },
        }}
        textStyle={{
          left: {
            // color: '#4C6070',
            fontFamily: 'OpenSans-Regular',
            lineHeight: 24,
          },
          right: {
            color: AppColors.chat().textRight,
            fontFamily: 'OpenSans-Regular',
            lineHeight: 24,
          },
        }}
        replyStyle={{
          left: {
            replyBubble: { backgroundColor: AppColors.chat().replyBubbleL },
            replyText: { color: AppColors.chat().replyTextL },
          },
          right: {
            replyBubble: { backgroundColor: AppColors.chat().replyBubbleR },
            replyText: { color: AppColors.chat().replyTextR },
          },
        }}
        // imageStyle={{
        //   width: AppStyles.windowSize.width - 90,
        //   height: 150,
        //   borderRadius: 8,
        // }}
      />
    );
  }

  renderChatFooter() {
    console.log('renderChat', this.state.attachMenu);
    if (this.state.attachAudio) {
      return (
        <AttachAudio />
      );
    }
    if (this.state.attachMenu) {
      return (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 5,
            padding: 5,
            backgroundColor: AppColors.brand().fourth,
          }}
        >
          <View
            style={{
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              padding: 3,
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 5,
                width: 60,
              }}
              onPress={() => {
                Keyboard.dismiss();
                this.setState({
                  attachMenu: !this.state.attachMenu,
                  text: '',
                });
                Actions.photoLibrary({
                  group: this._group,
                  groupId: this._group._id,
                  progressCallback: this._progressCallback,
                  duration: 0,
                });
              }}
            >
              <Icon
                raised
                name={'image-multiple'}
                type={'material-community'}
                color={photoIconColor}
                reverse
              />
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.chatFooterText}
              >Photos</Text>
            </TouchableOpacity>
            { /* <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 5,
                width: 60,
              }}
              onPress={() => {
                Keyboard.dismiss();
                this.setState({
                  attachMenu: !this.state.attachMenu,
                  text: '',
                });
                this.pickMultipleVideos();
              }}
            >
              <Icon
                raised
                name={'video-library'}
                type={'MaterialIcons'}
                color={videoIconColor}
                reverse
              />
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.chatFooterText}
              >Videos</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 5,
                width: 60,
              }}
              onPress={() => {
                Keyboard.dismiss();
                this.setState({
                  attachMenu: !this.state.attachMenu,
                  text: '',
                });
                Actions.cameraActions({
                  group: this._group,
                  groupId: this._group._id,
                  progressCallback: this._progressCallback,
                  duration: 0,
                });
              }}
            >
              <Icon
                raised
                name={'camera'}
                type={'material-community'}
                color={cameraIconColor}
                reverse
              />
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.chatFooterText}
              >{t('txt_camera')}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 5,
                width: 60,
              }}
              onPress={() => {
                Keyboard.dismiss();
                this.setState({
                  attachMenu: !this.state.attachMenu,
                  attachAudio: !this.state.attachAudio,
                  text: '',
                });
              }}
            >
              <Icon
                raised
                name={'microphone'}
                type={'material-community'}
                color={audioIconColor}
                reverse
              />
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.chatFooterText}
              >{'Audio'}</Text>
            </TouchableOpacity> */}
            <View style={{ flex: 2 }} />
          </View>
        </View>
      );
    }
  }

  renderFooter() {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    } else if (this.state.inProgress) {
      const uploadProgress = [];
      for (let i = 0; i < this.state.uploadingFile.length; i += 1) {
        // Progress status: STARTED, INPROGRESS, COMPLETE, SENT
        if (this.state.uploadingFile[i].msg === 'STARTED' ||
        this.state.uploadingFile[i].msg === 'INPROGRESS' ||
      this.state.uploadingFile[i].msg === 'COMPLETE') {
          uploadProgress.push(
            <View
              key={i}
              style={styles.footerView}
            >
              <Text style={styles.footerText}>
                {`Uploading: ${this.state.uploadingFile[i].id}, ${this.state.uploadingFile[i].percent}% Completed..`}
              </Text>
              <ProgressBar progress={this.state.uploadingFile[i].percent / 100} />
            </View>,
        );
        } else {
          let bgColor = '';
          // const visible = true;

          if (this.state.uploadingFile[i].msg === 'SENT') {
            bgColor = sentBgColor;
          } else if (this.state.uploadingFile[i].msg === 'FAILED') {
            bgColor = failedBgColor;
          }

          if (this.state.uploadingFile[i].modal) {
            uploadProgress.push(
              <View
                key={i}
                style={{
                  backgroundColor: bgColor,
                  borderRadius: 3,
                  padding: 10,
                  marginVertical: 5,
                  // height: this.state.uploadingFile[i].modal ? 30 : 0,
                }}
              >
                <Text style={[styles.footerText, { color: '#000', marginBottom: 0 }]}>
                  {`Uploading: ${this.state.uploadingFile[i].id}, ${this.state.uploadingFile[i].msg}`}
                </Text>
              </View>,
          );
          }
        }
      }

      // if (uploadProgress.length === 0) {
      //   this.setState({ inProgress: false });
      // }
      return (
        <View style={[styles.footerContainer]}>
          { uploadProgress }
        </View>
      );
    }
    return null;
  }

  renderActions = () => (
    <TouchableOpacity
      style={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => {
        Keyboard.dismiss();
        this.setState({ attachMenu: !this.state.attachMenu });
      }}
    >
      <Icon
        name={'playlist-add'}
        size={28}
        color={playlistAddIconColor}
      />
    </TouchableOpacity>
  )

  renderSendButton = () => {
    if (this.state.text.length > 0) {
      return (
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={this.onSend}
        >
          <Icon
            name="send"
            size={30}
            color={AppColors.brand().third}
          />
        </TouchableOpacity>
      );
    } else if (this.state.text.length === 0 && this.state.attachAudioBtn) {
      return (
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            Keyboard.dismiss();
            this.setState({
              attachMenu: false,
              attachAudio: true,
              text: '',
            });
          }}
        >
          <Icon
            name={'microphone'}
            type={'material-community'}
            size={30}
            color={AppColors.brand().third}
          />
        </TouchableOpacity>
      );
    }
  }

  renderComposer(props) {
    if (Platform.OS !== 'ios') {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingRight: 7,
          }}
        >
          <TextInput
            multiline
            placeholder={t('ph_type_message')}
            placeholderTextColor={placeholderTextColor}
            style={[styles.textInputStyleAndroid,
              { width: this.state.width,
                height: Math.min(120, Math.max(44, this.state.height)),
              }]}
            onChange={(event) => {
              this.setState({
                height: event.nativeEvent.contentSize.height,
              });
            }}
            value={this.state.text}
            onChangeText={text => this.setState({
              text,
              attachMenu: false,
            })}
            underlineColorAndroid={'rgba(0,0,0,0)'}
            disableFullscreenUI={true}
            onLayout={(event) => {
              this.setState({
                layout: {
                  width: event.nativeEvent.layout.width,
                },
              });
            }}
          />
          {this.renderSendButton()}
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <Composer
          {...props}
          placeholder={t('ph_type_message')}
          textInputProps={{
            disableFullscreenUI: true,
            value: this.state.text,
            onChangeText: (text) => {
              this.setState({
                text,
                attachMenu: false,
              });
            },
          }}
          numberOfLines={6}
          textInputStyle={styles.textInputStyleIos}
        />
        {this.renderSendButton()}
      </View>
    );
  }

  renderInputToolbar = props =>
    (<InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: inputToolbarBg,
        paddingVertical: 3,
        width: Dimensions.get('window').width,
      }}
    />)

  renderAvatar(props) {
    return (
      <ChatAvatar
        avatar={props.currentMessage.user.avatar}
        name={props.currentMessage.user.name}
        size={36}
      />
    );
  }

  renderToast() {
    if (this.state.msgCopied) {
      return (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            top: 10,
            width: AppSizes.screen.width,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}
        >
          <View
            style={{
              backgroundColor: AppColors.brand().third,
              paddingVertical: 5,
              paddingHorizontal: 15,
              borderRadius: 5,
            }}
          >
            <Text
              style={styles.toastText}
            >
              {t('txt_copy_clipboard')}</Text>
          </View>
        </View>
      );
    }
  }

  renderLoading() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          animating
          size={'large'}
          color={loadingIndicator}
        />
      </View>
    );
  }

  renderChat() {
    if (this._group.readonly === false) {
      console.log('readonly', this.state.readonly);
      return (
        <GiftedChat
          // **** start base
          messages={this.state.messages}
          text={this.state.text}
          textInputProps={{
            autoCorrect: false,
          }}
          onSend={this.onSend}
          user={{
            _id: Application.userId,
          }}
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={this.onLoadEarlier}
          keyboardShouldPersistTaps={'handled'}
          renderAvatarOnTop={true}
          isAnimated={true}
          // **** end base

          // **** start custom renders
          renderAvatar={this.renderAvatar}
          renderInputToolbar={this.renderInputToolbar}
          renderBubble={this.renderBubble}
          renderLoading={this.renderLoading}
          renderFooter={this.renderFooter}
          renderChatFooter={this.renderChatFooter}
          renderComposer={this.renderComposer}
          renderActions={this.renderActions}
          renderSend={() => {}}
          // renderInputToolbar={() => null}
          // renderComposer={() => null}
          // minInputToolbarHeight={0}
          // **** end custom renders

          // onLongPress={() => alert('hi')}

          parsePatterns={() => [
            { type: 'url',
              style: styl.left.link,
              onPress: (url) => {
                Linking.openURL(url).catch(err => console.error('An error occurred', err));
              },
            },
            { type: 'phone',
              style: styl.left.link,
              onPress: (url) => {
                Linking.openURL(`tel:${url}`).catch(err => console.error('An error occurred', err));
              },
            },
          ]}
          // renderSend={this.renderSend}
          // renderAccessory={() => <View style={{ height: 50, backgroundColor: 'teal' }} />}
          // minInputToolbarHeight={this.state.height}
          // renderFooter={() => <View style={{ flex: 1, height: 30, backgroundColor: 'yellow' }} />}
          // onPressActionButton={() => alert('ji')}
          // renderChatFooter={() => <View style={{ height: 20, backgroundColor: 'red' }} />}
          // renderCustomView={() => <View style={{ height: 20, backgroundColor: 'green' }} />}
          // renderCustomView={this.renderCustomView}
          // renderMessageText={this.isMarkDownEnabled() ? this.renderMessageText : null}
          // isLoadingEarlier={this.state.isLoadingEarlier}
          // renderLoading={this.renderLoading}
          // style={{ backgroundColor: 'red', zIndex: 100 }}
        />
      );
    }
    return (
      <GiftedChat
        // **** start base
        messages={this.state.messages}
        text={this.state.text}
        onInputTextChanged={text => this.setCustomText(text)}
        onSend={this.onSend}
        user={{
          _id: Application.userId,
        }}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        keyboardShouldPersistTaps={'handled'}
        renderAvatarOnTop={true}
        isAnimated={true}
        // **** end base

        // **** start custom renders
        renderAvatar={this.renderAvatar}
        // renderInputToolbar={this.renderInputToolbar}
        renderBubble={this.renderBubble}
        renderLoading={this.renderLoading}
        renderFooter={this.renderFooter}
        renderChatFooter={this.renderChatFooter}
        // renderComposer={this.renderComposer}
        // renderActions={this.renderActions}
        renderSend={() => {}}
        renderInputToolbar={() => null}
        renderComposer={() => null}
        minInputToolbarHeight={0}
        // **** end custom renders

        // onLongPress={() => alert('hi')}

        parsePatterns={() => [
          { type: 'url',
            style: styl.left.link,
            onPress: (url) => {
              Linking.openURL(url).catch(err => console.error('An error occurred', err));
            },
          },
          { type: 'phone',
            style: styl.left.link,
            onPress: (url) => {
              Linking.openURL(`tel:${url}`).catch(err => console.error('An error occurred', err));
            },
          },
        ]}
        // renderSend={this.renderSend}
        // renderAccessory={() => <View style={{ height: 50, backgroundColor: 'teal' }} />}
        // minInputToolbarHeight={this.state.height}
        // renderFooter={() => <View style={{ flex: 1, height: 30, backgroundColor: 'yellow' }} />}
        // onPressActionButton={() => alert('ji')}
        // renderChatFooter={() => <View style={{ height: 20, backgroundColor: 'red' }} />}
        // renderCustomView={() => <View style={{ height: 20, backgroundColor: 'green' }} />}
        // renderCustomView={this.renderCustomView}
        // renderMessageText={this.isMarkDownEnabled() ? this.renderMessageText : null}
        // isLoadingEarlier={this.state.isLoadingEarlier}
        // renderLoading={this.renderLoading}
        // style={{ backgroundColor: 'red', zIndex: 100 }}
      />
    );
  }

  render() {
    return (
      <View
        style={[AppStyles.container, styles.container, {
          marginTop: AppSizes.navbarHeight,
        }]}
        testID={'chatroom-display'}
      >
        <StatusBar barStyle="light-content" hidden={false} />
        {this.renderChat()}
        {this.renderToast()}
      </View>
    );
  }
}
ChatRoomView.defaultProps = {
  obj: {},
  attach: {},
  attachAudio: false,

};

ChatRoomView.propTypes = {
  obj: PropTypes.instanceOf(Group).isRequired,
  attach: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  attachAudio: React.PropTypes.bool,
};

/* Export Component ==================================================================== */
export default ChatRoomView;
