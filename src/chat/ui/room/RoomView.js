/**
 * ChatRoom Screen
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import Meteor from 'react-native-meteor';
import emoji from 'node-emoji';

import {
  GiftedChat,
  // Bubble,
  Composer,
  // Actions as GCActions,
 } from 'react-native-gifted-chat';
// import Markdown from 'react-native-simple-markdown'
import { MarkdownView } from 'react-native-markdown-view';
import { Actions } from 'react-native-router-flux';

// Components
import Network from '@network';
import Group from '@models/group';
import { AppUtil } from 'roverz-chat';
import { Send, ProgressBar } from '@chat/ui/';
import { AppStyles, AppSizes, AppColors } from '@theme/';
import AppConfig from '@app/config';

import SendImageMessage from './SendImageMessage';
import MessageImage from './MessageImage';
import ChatAvatar from './ChatAvatar';
import CustomView from './CustomView';
import Bubble from './Bubble';

const NO_OF_MSGS = 20;

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
      color: 'black',
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
      color: 'white',
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
    AppUtil.debug(this._group, '[Performance] RoomView');
    this.state = {
      messages: [],
      typingText: null,
      inProgress: false,
      uploadingFile: [],
      showActions: true,
      loadEarlier: true,
      isLoadingEarlier: false,
    };
    this.onSend = this.onSend.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderMessageImage = this.renderMessageImage.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderAvatar = this.renderAvatar.bind(this);
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
    this.renderK = this.renderK.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this._progressCallback = this._progressCallback.bind(this);
    this.subscriptions();
    this._didMount = false;
  }

  componentDidMount() {
    const _super = this;
    this._callOutstanding = false;
    this._changeListener = (messages, changes) => {
      // @todo: This check can be removed after upgrading to react-native 0.45
      if (_super._changeListener == null || _super._callOutstanding === true || !_super._didMount) return;
      console.log(`***** [chat-${_super._group.name}] got updated  **** `);
      // @todo: there seems to be a bug in realm that doesn't remove the listener
      console.log(changes);

      // first mark the channel as read
      // @todo: There is a scenario, when this msg and subscription message is out of order
      // still the unread is present
      if (_super._group.unread > 0) {
        this._network.chat.setRoomAsRead(_super._group._id);
      }
      _super.prepareMessages();
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
    // this._network.chat.fetchMessages(this._group, NO_OF_MSGS);
    // quick hack to see if this works for this scroll bug
    // https://github.com/facebook/react-native/issues/1831, &
    // https://github.com/facebook/react-native/issues/1831#issuecomment-231069668
    _super.prepareMessages();
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
      Meteor.call('sendMessage', {
        rid: this._group._id, msg: unEmoMsg,
      }, (err, res) => {
        console.log('Any errors:'); console.log(err);
        console.log('Result:'); console.log(res);
      });
    }
  }

  onLoadEarlier() {
    console.log('**** load earlier pressed ****');
    this._network.chat.fetchOldMessages(this._group, NO_OF_MSGS);
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
    Meteor.subscribe('stream-notify-room', `${this._group._id}/typing`, false);
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
      console.log(_super.state.uploadingFile);
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

  renderCustomActions(props) {
    if (this.state.showActions) {
      return (
        <SendImageMessage
          {...props}
          group={this._group}
          progressCallback={this._progressCallback}
        />
      );
    }
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            // backgroundColor: '#FFF',
            borderRadius: 8,
          },
          right: {
            backgroundColor: AppColors.chat.bubbleRight,
            borderRadius: 8,
          },
        }}
        textStyle={{
          left: {
            // color: '#4C6070',
            fontFamily: 'OpenSans-Regular',
          },
          right: {
            color: AppColors.chat.textRight,
            fontFamily: 'OpenSans-Regular',
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

  renderSend(props) {
    return (
      <Send
        {...props}
      />
    );
  }

  renderComposer(props) {
    return (
      <Composer
        {...props}
        multiline={(Platform.OS === 'ios')}
        placeholder={'Type your message..'}
        textInputProps={{
          onChange: () => { this.state.showActions = false; },
          onEndEditing: () => { this.state.showActions = true; },
        }}
        textInputStyle={{
          backgroundColor: '#F5F5F5',
          borderRadius: 3,
          paddingHorizontal: 5,
          lineHeight: 20,
          marginRight: 5,
          fontFamily: 'OpenSans-Regular',
        }}
      />
    );
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

      if (uploadProgress.length === 0) {
        this.setState({ inProgress: false });
      }
      return (
        <View style={[styles.footerContainer]}>
          { uploadProgress }
        </View>
      );
    }
    return null;
  }

  renderK() {
    return (
      <View style={{ flex: 1, backgroundColor: 'green', height: 5 }} />
    );
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
          backgroundColor: 'rgba(0,0,0,0.1)',
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
                  marginTop: 7,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name={'format-align-left'}
                  size={22}
                  color={'rgba(0,0,0,0.4)'}
                />
              </TouchableOpacity>
            )
          }
          <Composer
            {...props}
            multiline={(Platform.OS === 'ios')}
            placeholder={'Type your message..'}
            textInputProps={{
              onChange: () => { this.state.showActions = false; },
              onEndEditing: () => { this.state.showActions = true; },
            }}
            textInputStyle={{
              backgroundColor: '#F5F5F5',
              borderRadius: 3,
              paddingHorizontal: 5,
              lineHeight: 20,
              marginRight: 5,
              fontFamily: 'OpenSans-Regular',
            }}
          />
          {
            this.state.showActions && (
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 30,
                  marginTop: 7,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => Actions.cameraActions({
                  group: this._group._id,
                  progressCallback: this._progressCallback,
                })}
              >
                <Icon
                  name={'camera-alt'}
                  size={22}
                  color={'rgba(0,0,0,0.4)'}
                />
              </TouchableOpacity>
            )
          }
          <Send
            {...props}
          />
        </View>
      </View>
    );
  }

  renderMessageText(props) {
    return (
      <View style={[styl[props.position].container]}>
        <MarkdownView
          styles={{
            paragraph: {
              paddingLeft: 10,
              paddingRight: 10,
              color: (props.position === 'left' ? 'black' : 'white'),
              fontFamily: 'OpenSans-Regular',
              fontSize: 14,
            },
            link: {
              color: (props.position === 'left' ? '#0000EE' : '#FFF'),
              textDecorationLine: 'underline',
            },
          }}
        >
          {props.currentMessage.text}
        </MarkdownView>
      </View>
    );
  }

  renderMessageImage(props) {
    return (
      <MessageImage
        {...props}
        obj={this._group}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
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

// renderMessageText={this.renderMessageText}

  render() {
    let filteredMessages = this.state.messages;
    // mess = mess.slice(0, 1);
    filteredMessages = filteredMessages.filter((obj) => {
      const objOriginal = JSON.parse(obj.original);
      if (!objOriginal.msg.includes('[ ](msg=')) {
        return (obj);
      }
      return null;
    });
    // AppUtil.debug(filteredMessages, '[Performance] RoomView render');
    return (
      <View style={{ backgroundColor: '#FFF', flex: 1, marginTop: AppSizes.navbarHeight }}>
        <StatusBar barStyle="light-content" />
        <GiftedChat
          messages={filteredMessages}// this.state.messages
          onSend={this.onSend}
          renderActions={this.renderCustomActions}
          renderFooter={this.renderFooter}
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          renderComposer={this.renderComposer}
          renderCustomView={this.renderCustomView}
          renderMessageText={this.renderMessageText}
          renderMessageImage={this.renderMessageImage}
          renderAvatar={this.renderAvatar}
          renderAvatarOnTop={true}
          // renderInputToolbar={this.renderInputToolbar}
          // renderAccessory={this.renderK}
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={this.onLoadEarlier}
          isLoadingEarlier={this.state.isLoadingEarlier}
          user={{
            _id: AppConfig.base.userId,
          }}
        />
      </View>
    );
  }
}

ChatRoomView.propTypes = {
  obj: PropTypes.instanceOf(Group).isRequired,
};

/* Export Component ==================================================================== */
export default ChatRoomView;
