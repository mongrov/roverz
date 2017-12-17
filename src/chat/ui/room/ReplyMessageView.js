import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
  Keyboard,
  ActionSheetIOS,
  ScrollView,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { NavButton } from 'react-native-nav';
import { Actions } from 'react-native-router-flux';
import {
  GiftedChat,
  Composer,
  Bubble,
 } from 'react-native-gifted-chat';
import Meteor from 'react-native-meteor';
import { MarkdownView } from 'react-native-markdown-view';
// import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { CachedImage } from 'react-native-img-cache';
import UserAvatar from 'react-native-user-avatar';
import emoji from 'node-emoji';
import AppUtil from '../../../lib/util';

import Network from '../../../network';
// import Group from '../../../models/group';
import { AppStyles, AppColors } from '../../../theme/';
import ModuleConfig from '../../../constants/config';
import { Send } from '../';
import ChatAvatar from './ChatAvatar';
import t from '../../../i18n';

const textStyle = {
  // fontSize: 30,
  // lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};


const styles = StyleSheet.create({
  actionContainer: {
    width: 40,
    height: 30,
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 26,
    height: 26,
    flex: 1,
  },
  container: {
    width: 26,
    height: 26,
    flex: 1,
  },
});

const bubbleStyl = {
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
      // color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
    },
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      // color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

export default class ReplyMessageView extends React.Component {
  constructor(props) {
    super(props);
    this._network = new Network();
    this._db = this._network.db;
    this._group = props.obj;
    const actualMessage = this.props.actualMessage;
    const obj = this.props.obj;
    const msgTitle = this.props.msgTitle;
    this.displayName = obj.name;
    this.displayTitle = obj.title;
    this.roomType = obj.type;
    this.avatarUri = obj.avatar;
    const msgLikes = this.props.msgLikes;
    const msgId = this.props.msgId;
    const canDelete = this.props.canDelete;
    this.state = {
      messages: [],
      typingText: null,
      inProgress: false,
      uploadingFile: [],
      showActions: true,
      actualMessage,
      hasLoaded: false,
      obj,
      msgTitle,
      msgId,
      msgLikes,
      displayName: this.displayName,
      displayTitle: this.displayTitle,
      avatarUri: this.avatarUri,
      showAvatar: true,
      roomType: this.roomType,
      modalVisible: false,
      canDelete,
    };
    this.loadingComplete = this.loadingComplete.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.onSend = this.onSend.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderAvatar = this.renderAvatar.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this.onChangeVisibleRow = this.onChangeVisibleRow.bind(this);
    this._progressCallback = this._progressCallback.bind(this);
    this.subscriptions();
    this._onActionButton = this._onActionButton.bind(this);
  }

  componentDidMount() {
    const _super = this;
    // this._network.chat.fetchMessages(this._group, NO_OF_MSGS);
    this._network.chat.fixYapImageUrls(Array.prototype.slice.call(this._group.sortedMessages), (msg) => {
      _super.setState({
        messages: msg,
      });
    });
    this._changeListener = (messages, changes) => {
      // @todo: This check can be removed after upgrading to react-native 0.45
      if (_super._changeListener == null) return;
      // console.log(`***** [chat-${_super._group.name}] got updated  **** `);
      // @todo: there seems to be a bug in realm that doesn't remove the listener
      // console.log(changes);
      if (changes.modifications && changes.modifications.length > 0) {
        const msg = this._group.findMessageById(this.state.msgId);
        if (msg) {
          _super.setState({
            msgLikes: msg.likes,
          });
        }
      }

      // first mark the channel as read
      // @todo: There is a scenario, when this msg and subscription message is out of order
      // still the unread is present
      if (_super._group.unread > 0) {
        Meteor.call('readMessages', _super._group._id);
      }
      // refresh control
      this._network.chat.fixYapImageUrls(Array.prototype.slice.call(this._group.sortedMessages), (msg) => {
        _super.setState({
          messages: msg,
        });
      });
    };
    this._group.messages.addListener(this._changeListener);

    this._userTyping = this._network.meteor.monitorChanges('stream-notify-room', (result) => {
      // user is typing message here result[0].args
      // args: [ 'test', true ],  - format user, true/false (typing or stopped)
      if (result[0] !== undefined) {
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
  }

  componentWillUnmount() {
    this._network.meteor.stopMonitoringChanges(this._userTyping);
    this._group.messages.removeListener(this._changeListener);
    this._changeListener = null;
  }

  onChangeVisibleRow(/* visibleRows, changedRows */) {
  }

  onSend(messages = []) {
    /* [ { text: 'Hello', user: { _id: 'wKk3sXsCYvTkXJeLY' }, createdAt: Wed Jun 07 2017 00:26:46 GMT-0700 (PDT),
       _id: 'e6fa1c61-e77d-4935-aefd-9ee3e10bbdb1' } ] */
    // lets not send an empty message
    if (messages.length > 0 && messages[0].text && messages[0].text.trim().length > 0) {
      const unEmoMsg = emoji.unemojify(messages[0].text.trim());
      this._network.chat.replyMessage(this._group, this.state.msgId, unEmoMsg);
    }
  }

  onLoadEarlier() {
    // console.log('**** load earlier pressed ****');
  }

  setAvType() {
    if (this.state.roomType === 'private') {
      return 'lock';
    } else if (this.state.roomType === 'direct') {
      return 'perm-identity';
    }
    return 'supervisor-account';
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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

  _onPressLike = () => {
    // console.log('**** like pressed **** ');
    this._network.chat.setPhotoLike(this.state.msgId);
  }

  _deleteMessage = () => {
    Alert.alert(
      t('info_del'),
      t('info_del_message'),
      [
        { text: t('txt_no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: t('txt_yes'),
          onPress: () => {
            this._network.chat.deleteMessage(this.state.msgId);
            Actions.pop();
          },
        },
      ],
      { cancelable: false },
    );
  }

  isLoading() {
    if (!this.state.hasLoaded) {
      return (
        <ActivityIndicator
          animating
          size={'large'}
          color={'rgba(255,255,255,0.3)'}
          style={[AppStyles.windowSize, AppStyles.containerCentered]}
        />
      );
    }
  }

  loadingComplete() {
    this.setState({ hasLoaded: true });
    // console.log('img load complt');
  }

  _renderAvatar() {
    if (this.state.showAvatar) {
      return (
        <View
          style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}
        >
          <CachedImage
            style={{ width: 40, height: 40, borderRadius: 20 }}
            source={{ uri: this.avatarUri }}
            onError={() => { this._hideAvatarView(); }}
          />
        </View>
      );
    }
    return (
      <View
        style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}
      >
        <UserAvatar
          name={AppUtil.avatarInitials(this.state.displayTitle ? this.state.displayTitle : this.state.displayName)}
          size={36}
        />
      </View>
    );
  }

  _hideAvatarView() {
    this.setState({
      showAvatar: false,
    });
  }

  _onActionButton(media/* , index */) {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showShareActionSheetWithOptions({
        url: media.photo,
        message: media.caption,
      },
      () => {},
      () => {});
    } else {
      // console.log(`handle sharing on android for ${media.photo}, index: ${index}`);
    }
  }

  iconType() {
    switch (this.state.roomType) {
      case 'direct':
        return 'at';
      case 'public':
        return 'pound';
      case 'private':
        return 'lock';
      default:
        return 'pound';
    }
  }

  iconColor() {
    return AppColors.brand().fourth;
  }

  chooseAvIcon(icon) {
    return (
      <Icon
        name={icon}
        type="material-community"
        size={20}
        style={{ width: 20, paddingTop: 3 }}
        color={this.iconColor()}
      />
    );
  }

  renderDelete() {
    if (this.state.canDelete) {
      return (
        <NavButton
          style={{
            paddingHorizontal: 5,
            marginRight: 15,
            justifyContent: 'center',
            alignItems: 'flex-start',
            // backgroundColor: 'red',
          }}
          onPress={this._deleteMessage}
        >
          <Icon
            name="delete"
            size={24}
            color={'#FFF'}
          />
        </NavButton>
      );
    }
    return null;
  }

  renderNav() {
    return (
      <View style={[AppStyles.navbar, AppStyles.navbarHeight, {
        paddingLeft: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.brand().secondary,
      }]}
      >
        <NavButton
          style={{ width: 35, paddingRight: 15, justifyContent: 'center', alignItems: 'flex-start' }}
          onPress={Actions.pop}
        >
          <Icon
            name="keyboard-arrow-left"
            size={32}
            color={'#FFF'}
          />
        </NavButton>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Text
            numberOfLines={1}
            style={[AppStyles.navbarTitle, {
              textAlign: 'left',
              fontSize: 14,
            }]}
          >
            Reply
          </Text>
        </View>
        {this.renderDelete()}
      </View>
    );
  }

  renderAvIcon() {
    switch (this.state.roomType) {
      case 'direct':
        return this.chooseAvIcon('at');
      case 'public':
        return this.chooseAvIcon('pound');
      case 'private':
        return null;
      default:
        return this.chooseAvIcon('pound');
    }
  }

  renderActions() {
    return (
      <View style={[styles.actionContainer]}>
        <TouchableOpacity
          onPress={this._onPressLike}
        >
          <Icon
            name={'thumb-up'}
            size={28}
            color={'#b2b2b2'}
            width={30}
          />
        </TouchableOpacity>
      </View>
    );
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
            // backgroundColor: '#638BD5',
            borderRadius: 8,
          },
        }}
        textStyle={{
          left: {
            // color: '#4C6070',
            fontFamily: 'OpenSans-Regular',
          },
          right: {
            color: '#FFF',
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
    const newText = props.text;
    return (
      <Send
        {...props}
        text={newText}
      />
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
                  this._onPressLike();
                }}
              >
                <Icon
                  name={'thumb-up'}
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
              // disableFullscreenUI: true,
            }}
            numberOfLines={6}
            textInputStyle={{
              backgroundColor: '#FFF',
              borderRadius: 3,
              lineHeight: 20,
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

  renderMessageText(props) {
    return (
      <View style={[bubbleStyl[props.position].container]}>
        <MarkdownView
          styles={{
            paragraph: {
              paddingLeft: 10,
              paddingRight: 10,
              color: (props.position === 'left' ? 'black' : 'white'),
              fontFamily: 'OpenSans-Regular',
              fontSize: 15,
            },
          }}
        >
          {props.currentMessage.text}
        </MarkdownView>
      </View>
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
    }
    return null;
  }

  renderComposer(props) {
    return (
      <Composer
        {...props}
        placeholder={t('ph_type_message')}
        textInputProps={{
          onFocus: () => { },
          onBlur: () => { },
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
        textInputStyle={{
          backgroundColor: '#F5F5F5',
          borderRadius: 3,
          paddingLeft: 8,
          paddingRight: 8,
          marginRight: 5,
          fontFamily: 'OpenSans-Regular',
        }}
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

  render() {
    // console.log('this.state.obj1', this.state.obj);
    let filteredMessages = this.state.messages;
    // mess = mess.slice(0, 1);
    filteredMessages = filteredMessages.filter((obj) => {
      const objOriginal = JSON.parse(obj.original);
      if (objOriginal.msg.includes(this.state.msgId)) {
        return (obj);
      }
      return null;
    });

    const { width, height } = Dimensions.get('window');
    let imgHeight = height / 3;
    if (width > height) {
      imgHeight = height / 8;
    }

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: '#fff',
        }}
      >
        {this.renderNav()}
        <StatusBar barStyle="light-content" />
        <View
          style={{
            // alignItems: 'center',
            position: 'relative',
            backgroundColor: '#f0f0f0',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: 15,
            maxHeight: imgHeight,
          }}
        >
          <ScrollView>
            <Text
              style={{
                fontSize: 16,
                flex: 1,
              }}
            >{this.state.actualMessage}</Text>
          </ScrollView>
          <View
            style={{
              padding: 5,
              backgroundColor: AppColors.brand().third,
              borderRadius: 3,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#FFF',
                fontSize: 12,
                marginHorizontal: 5,
              }}
            >{this.state.msgLikes}</Text>
            <Icon
              name={'heart-outline'}
              type={'material-community'}
              size={20}
              color={'#FFF'}
            />
          </View>
        </View>
        <GiftedChat
          messages={filteredMessages}
          onSend={this.onSend}
          renderActions={this.renderActions}
          renderFooter={this.renderFooter}
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          renderComposer={this.renderComposer}
          renderCustomView={this.renderCustomView}
          renderInputToolbar={this.renderInputToolbar}
          renderMessageText={this.renderMessageText}
          renderAvatar={this.renderAvatar}
          renderMessageImage={this.renderMessageImage}
          renderAvatarOnTop={true}
          listViewProps={
            { onChangeVisibleRows: this.onChangeVisibleRow }
          }
          user={{
            _id: ModuleConfig.userId,
          }}
        />
      </View>
    );
  }
}

ReplyMessageView.defaultProps = {
  containerStyle: {},
  textStyle: {},
  actualMessage: '',
  msgId: '',
  msgLikes: 0,
  msgTitle: '',
  obj: {},
  canDelete: false,
};

ReplyMessageView.propTypes = {
  containerStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
  actualMessage: PropTypes.string,
  msgId: PropTypes.string,
  msgTitle: PropTypes.string,
  msgLikes: PropTypes.number,
  obj: React.PropTypes.object,    // eslint-disable-line react/forbid-prop-types
  canDelete: React.PropTypes.bool,
};
