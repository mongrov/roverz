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
  // Linking,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import emoji from 'node-emoji';

import {
  GiftedChat,
  // Bubble,
  Composer,
  // Actions as GCActions,
 } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import AppUtil from '../../../lib/util';

// Components
import Network from '../../../network';
import Group from '../../../models/group';
import { Send } from '../../../chat/ui/';
import { ProgressBar } from '../../../components/ui/';

import { AppStyles, AppSizes, AppColors } from '../../../theme/';
import Application from '../../../constants/config';

import ChatAvatar from './ChatAvatar';
import Bubble from './Bubble';
import ImageUtil from '../../attachments/ImageUtil';
import t from '../../../i18n';

const NO_OF_MSGS = 30;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 10,
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
    };
    this.onSend = this.onSend.bind(this);
    this.renderChatFooter = this.renderChatFooter.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderAvatar = this.renderAvatar.bind(this);
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this._progressCallback = this._progressCallback.bind(this);
    this.messageCopy = this.messageCopy.bind(this);
    this.subscriptions();
    this._didMount = false;
  }

  componentDidMount() {
    const _super = this;
    AppUtil.debug(new Date().toLocaleString(), '[Performance] RoomView');
    this._callOutstanding = false;
    this._changeListener = (messages, changes) => {
      // @todo: This check can be removed after upgrading to react-native 0.45
      if (_super._changeListener == null || _super._callOutstanding === true || !_super._didMount) return;
      // console.log(`***** [chat-${_super._group.name}] got updated  **** `);
      // @todo: there seems to be a bug in realm that doesn't remove the listener
      // console.log(changes);
      if (changes.modifications && changes.modifications.length > 0) {
        AppUtil.debug(changes, '[Debug] RoomView changes');
      }
      // first mark the channel as read
      // @todo: There is a scenario, when this msg and subscription message is out of order
      // still the unread is present
      if (_super._group.unread > 0) {
        this._network.chat.setRoomAsRead(_super._group._id);
      }
      _super.prepareMessages();
      setTimeout(() => { this.setState({ loaded: true }); }, 100);
    };
    this._group.messages.addListener(this._changeListener);

    this._userTyping = this._network.meteor.monitorChanges('stream-notify-room', (result) => {
      // AppUtil.debug(result, '[Performance] RoomView userTyping');
      // user is typing message here result[0].args
      // args: [ 'test', true ],  - format user, true/false (typing or stopped)
      if (this._didMount && result[0] !== undefined) {
        if (result[0].args[1]) {
          this.setState(({
            typingText: `${result[0].args[0]} is typing...`,
          }));
        } else {
          this.setState(({
            typingText: null,
          }));
        }
      }
    });
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
    if (this.state.attach !== nextProps.attach) {
      // console.log('this.state.attach', nextProps.attach);
      this.setState({
        attach: nextProps.attach,
      });
      this.sendCameraImage(nextProps.attach.cameraData, nextProps.attach.cameraMessage, nextProps.attach.video);
    }
  }

  componentWillUnmount() {
    this._network.meteor.stopMonitoringChanges(this._userTyping);
    this._group.messages.removeListener(this._changeListener);
    this._changeListener = null;
    this._didMount = false;
    AppUtil.debug('Component unmounted', '[Performance] RoomView');
  }

  onSend(messages = []) {
    /* [ { text: 'Hello', user: { _id: 'wKk3sXsCYvTkXJeLY' }, createdAt: Wed Jun 07 2017 00:26:46 GMT-0700 (PDT),
       _id: 'e6fa1c61-e77d-4935-aefd-9ee3e10bbdb1' } ] */
    // lets not send an empty message
    if (messages.length > 0 && messages[0].text && messages[0].text.trim().length > 0) {
      const unEmoMsg = emoji.unemojify(messages[0].text.trim());
      this._network.chat.sendMessage(
        this._group._id,
        unEmoMsg,
      );
    }
  }

  onLoadEarlier() {
    this._network.chat.fetchOldMessages(this._group, NO_OF_MSGS);
  }

  isMarkDownEnabled() {
    const markdownConf = this._network.getServerSetting('Markdown_Parser');
    if (markdownConf && !(markdownConf.value === 'disabled')) {
      return true;
    }
    return false;
  }

  prepareMessages() {
    this._callOutstanding = true;
    // refresh control
    this._network.chat.fixYapImageUrls(Array.prototype.slice.call(this._group.sortedMessages), (msg) => {
      AppUtil.debug(msg, '[Performance] RoomView msg updates');
      this.setState({
        messages: msg,
        loadEarlier: this._group.moreMessages,
      });
      this._callOutstanding = false;
    });
  }

  // @todo: the subscriptions are not getting evicted, we have to fix it - especially for typing
  subscriptions() {
    // callback is usually used for when subscription is ready
    // Meteor.subscribe('stream-notify-room', `${this._group._id}/updateMessage`, false, this._roomChanges);
    // Meteor.subscribe('stream-notify-room', `${this._group._id}/typing`, false);
  }

  sendCameraImage(cameraData, cameraMessage, video) {
    const _super = this;
    new ImageUtil().uploadImage(cameraData, this._group._id, video, cameraMessage,
    (fuFileName, fuPercent, fuMsg) => {
      const percentage = Math.round(Number(parseFloat(fuPercent).toFixed(2) * 100));
      _super._progressCallback(fuFileName, fuMsg, percentage, 1, 0);
    });
  }

  _progressCallback(id, msg, percent, totalFiles, fileCount) {
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
        imageStyle={{
          width: AppStyles.windowSize.width - 90,
          height: 150,
          borderRadius: 8,
        }}
      />
    );
  }

  renderChatFooter() {
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
              style={{
                backgroundColor: '#F3F3F3',
                borderRadius: 3,
                padding: 10,
                marginVertical: 5,
              }}
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
            bgColor = '#A7FED7';
          } else if (this.state.uploadingFile[i].msg === 'FAILED') {
            bgColor = '#F59F96';
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

  renderInputToolbar(props) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderTopColor: 'rgba(0,0,0,0.15)',
          borderTopWidth: 1,
        }}
        >
          {
            this.state.showActions && (
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 30,
                  marginBottom: 7,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  Actions.photoLibrary({
                    groupId: this._group._id,
                    progressCallback: this._progressCallback,
                    duration: 0,
                  });
                }}
              >
                <Icon
                  name={'attach-file'}
                  size={28}
                  color={'rgba(0,0,0,0.4)'}
                />
              </TouchableOpacity>
            )
          }
          {
            this.state.showActions && (
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 30,
                  marginBottom: 7,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  // console.log('hi');
                  Keyboard.dismiss();
                  Actions.cameraActions({
                    group: this._group,
                    groupId: this._group._id,
                    progressCallback: this._progressCallback,
                    duration: 0,
                  });
                }}
              >
                <Icon
                  name={'camera-alt'}
                  size={28}
                  color={'rgba(0,0,0,0.4)'}
                />
              </TouchableOpacity>
            )
          }
          <Composer
            {...props}
            placeholder={t('ph_type_message')}
            textInputProps={{
              disableFullscreenUI: true,
            }}
            numberOfLines={6}
            textInputStyle={{
              backgroundColor: '#FFF',
              borderRadius: 3,
              paddingHorizontal: 5,
              lineHeight: 20,
              fontSize: 14,
              fontFamily: 'OpenSans-Regular',
            }}
          />
          <Send
            {...props}
          />
        </View>
      </View>
    );
  }

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
              style={{
                color: '#fff',
                fontFamily: 'OpenSans-Regular',
                fontSize: 12,
              }}
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
          color={'red'}
        />
      </View>
    );
  }

  renderChat() {
    return (
      <GiftedChat
        // **** start base
        messages={this.state.messages}
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
        // **** end custom renders

        // onLongPress={() => alert('hi')}

        parsePatterns={() => [
          { type: 'url', style: styl.left.link },
          { type: 'phone', style: styl.left.link },
        ]}
        renderChatFooter={this.renderChatFooter}
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
        style={[AppStyles.container, {
          marginTop: AppSizes.navbarHeight,
          position: 'relative',
          backgroundColor: '#FFF',
        }]}
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
};

ChatRoomView.propTypes = {
  obj: PropTypes.instanceOf(Group).isRequired,
  attach: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

/* Export Component ==================================================================== */
export default ChatRoomView;
