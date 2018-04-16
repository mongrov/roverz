/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
  Alert,
  Keyboard,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import {
  MessageText,
  // MessageImage,
  Time,
} from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import { CachedImage } from 'react-native-img-cache';
import { Icon } from 'react-native-elements';

// import MessageText from './MessageText';
import MessageImage from './MessageImage';
// import Time from './Time';

import { isSameUser, isSameDay, warnDeprecated } from './utils';
import Network from '../../../network';
import { AppColors } from '../../../theme/';
import t from '../../../i18n';
import Color from './Color';
import Constants from '../../../models/constants';

const iconColor = AppColors.brand().bubble_iconColor;

const styl = StyleSheet.create({
  bubbleView: {
    width: '100%',
    height: 1,
    backgroundColor: AppColors.brand().bubble_bubbleViewBg,
  },
  bubbleText: {
    paddingLeft: 5,
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    color: AppColors.brand().bubble_bubbleTextColor,
  },
  modalAction: {
    flex: 1,
    backgroundColor: AppColors.brand().bubble_modalActionBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animated: {
    backgroundColor: AppColors.brand().bubble_animatedBg,
    borderRadius: 5,
    padding: 15,
    width: 300,
  },
  likeText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: AppColors.brand().bubble_likeTextColor,
  },
});


export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
    this._network = new Network();
    this.obj = this.props.obj;
    this.roomType = this.obj.type;
    this.pressLong = this.pressLong.bind(this);
    const likes = this.props.currentMessage.likes;
    const isReply = this.props.currentMessage.isReply;
    const original = JSON.parse(this.props.currentMessage.original);
    const canDelete = this._network.service.canDelete(original);
    this.state = {
      roomType: this.roomType,
      showActions: false,
      likes,
      isReply,
      original,
      parentMessage: null,
      canDelete,
      actionsModal: false,
    };
    this.handleMsgCopy = this.handleMsgCopy.bind(this);
  }

  componentWillMount() {
    const _super = this;
    if (this.state.isReply) {
      // let getReplyMess = this.obj.findMessageById(this.props.currentMessage.replyMessageId);
      // while (getReplyMess && getReplyMess.isReply) {
      //   getReplyMess = this.obj.findMessageById(getReplyMess.replyMessageId);
      // }
      // this._network.chat.fixYapImageUrls(Array.prototype.slice.call([replyMessage]),
      const getReplyMess = this.obj.findRootMessage(this.props.currentMessage.replyMessageId);
      if (getReplyMess) {
        const replyMessage = [getReplyMess];
        this.prepareMessages(replyMessage, (parentMessage) => {
          _super.setState({
            parentMessage: parentMessage[0],
          });
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentMessage) {
      this.setState({
        likes: nextProps.currentMessage.likes,
      });
    }
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage);
    } else if (this.props.currentMessage.text) {
      const options = ['Copy Text', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(this.props.currentMessage.text);
              break;
            default:
              break;
          }
        },
      );
      // this.toggleActions();
    }
  }

  toggleActions = () => {
    // const action = this.state.showActions;
    // this.setState({ showActions: !action });
    const action = this.state.actionsModal;
    this.setState({ actionsModal: !action });
  }

  toggleModalActions = () => {
    const action = this.state.actionsModal;
    this.setState({ actionsModal: !action });
    this.animatedValue = new Animated.Value(0.8);
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.sin,
    }).start();
  }

  _onPressLike = () => {
    console.log('**** like pressed **** ');
    this._network.service.setLike(this.state.original._id);
    this.toggleModalActions();
  }

  _handleDelete = () => {
    this._network.service.deleteMessage(this.state.original._id, (err, msg) => {
      console.log('deleteMessage', err, msg);
      if (err) {
        Alert.alert(
          t('info_delete_err'),
          t('info_del_not_allowed'),
          [
            { text: t('txt_ok') },
          ],
          { cancelable: false },
        );
      }
    });
  }

  _deleteMessage = () => {
    this.setState({ actionsModal: false });
    setTimeout(() => {
      Alert.alert(
        t('info_delete'),
        t('info_del_message'),
        [
          { text: t('txt_no'), onPress: () => {}, style: 'cancel' },
          { text: t('txt_yes'),
            onPress: () => this._handleDelete(),
          },
        ],
        { cancelable: false },
      );
    }, 100);
  }

  _handleComments = () => {
    /*
    text !this.state.original.file, this.state.parentMessage=null
    img this.state.original.file, this.state.parentMessage=null
    text - text reply !this.state.original.file, this.state.parentMessage!=null
    img -text reply this.state.original.file, this.state.parentMessage!=null
    */
    if (!this.state.original.file && this.state.parentMessage === null) {
      Keyboard.dismiss();
      Actions.replyMessage({
        obj: this.props.obj,
        msgId: this.props.currentMessage._id,
        actualMessage: this.props.currentMessage.text,
        msgLikes: this.props.currentMessage.likes,
        msgTitle: this.props.currentMessage.text,
        canDelete: this.state.canDelete,
      });
    } else if (this.state.original.file && this.state.parentMessage === null) {
      Keyboard.dismiss();
      Actions.imagePreview({
        imageUri: this.props.currentMessage.image,
        obj: this.props.obj,
        msgId: this.props.currentMessage._id,
        msgLikes: this.props.currentMessage.likes,
        msgTitle: this.props.currentMessage.text,
        canDelete: this.state.canDelete,
      });
    } else if (!this.state.original.file && this.state.parentMessage !== null) {
      if (this.state.parentMessage.image) {
        Keyboard.dismiss();
        Actions.imagePreview({
          imageUri: this.state.parentMessage.image,
          obj: this.props.obj,
          msgId: this.state.parentMessage._id,
          msgLikes: this.state.parentMessage.likes,
          msgTitle: this.state.parentMessage.text,
          canDelete: this.state.canDelete,
        });
      } else {
        Keyboard.dismiss();
        Actions.replyMessage({
          obj: this.props.obj,
          msgId: this.state.parentMessage._id,
          actualMessage: this.state.parentMessage.text,
          msgLikes: this.state.parentMessage.likes,
          msgTitle: this.state.parentMessage.text,
          canDelete: this.state.canDelete,
        });
      }
    } else if (this.state.original.file && this.state.parentMessage !== null) {
      Keyboard.dismiss();
      Actions.imagePreview({
        imageUri: this.state.parentMessage.image,
        obj: this.props.obj,
        msgId: this.state.parentMessage._id,
        msgLikes: this.state.parentMessage.likes,
        msgTitle: this.state.parentMessage.text,
        canDelete: this.state.canDelete,
      });
    }
    this.toggleModalActions();
  }

  _handleCopy = () => {
    Clipboard.setString(this.props.currentMessage.text);
    this.handleMsgCopy();
    this.toggleModalActions();
  }

  prepareMessages(messages, callback) {
    this._network.chat.fixYapImageUrls(Array.prototype.slice.call(messages), (msg) => {
      callback(msg);
    });
  }

  handleBubbleToNext() {
    if (
      isSameUser(this.props.currentMessage, this.props.nextMessage) &&
      isSameDay(this.props.currentMessage, this.props.nextMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToNext,
        this.props.containerToNextStyle[this.props.position],
      ]);
    }
    return null;
  }

  handleBubbleToPrevious() {
    if (
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToPrevious,
        this.props.containerToPreviousStyle[this.props.position],
      ]);
    }
    return null;
  }

  pressLong = () => {
    this.toggleModalActions();
  }

  handleMsgCopy() {
    this.props.msgCopy();
  }

  renderDelete() {
    if (this.state.canDelete) {
      return (
        <TouchableOpacity
          style={[styles.actionBtn]}
          onPress={this._deleteMessage}
        >
          <Icon
            name={'delete'}
            type={'material-community'}
            size={22}
            color={AppColors.brand().secondary}
          />
          <Text style={styl.bubbleText}>{t('txt_delete')}</Text>
        </TouchableOpacity>);
    }
    return null;
  }

  renderActionsModal() {
    const animatedStyle = { transform: [{ scale: this.animatedValue }] };
    if (this.state.actionsModal) {
      return (
        <Modal
          animationType={'none'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // alert('Modal has been closed.');
          }}
        >
          <TouchableOpacity
            style={styl.modalAction}
            onPress={this.toggleModalActions}
          >
            <Animated.View
              style={[styl.animated, animatedStyle]}
            >
              <View
                style={{
                  alignItems: 'flex-start',
                  padding: 3,
                  flexDirection: 'column',
                  marginVertical: 5,
                }}
              >
                <TouchableOpacity
                  style={[styles.actionBtn]}
                  onPress={this._onPressLike}
                >
                  <Icon
                    name={'heart-outline'}
                    type={'material-community'}
                    size={22}
                    color={AppColors.brand().secondary}
                  />
                  <Text style={styl.bubbleText}>{t('txt_like_txt')}</Text>
                </TouchableOpacity>
                <View style={styl.bubbleView} />
                <TouchableOpacity
                  style={[styles.actionBtn]}
                  onPress={this._handleComments}
                >
                  <Icon
                    name={'comment-text-outline'}
                    type={'material-community'}
                    size={22}
                    color={AppColors.brand().secondary}
                  />
                  <Text style={styl.bubbleText}>{t('txt_rply')}</Text>
                </TouchableOpacity>
                <View style={styl.bubbleView} />
                {
                  !this.props.currentMessage.image &&
                  (
                    <TouchableOpacity
                      style={[styles.actionBtn]}
                      onPress={this._handleCopy}
                    >
                      <Icon
                        name={'content-copy'}
                        type={'material-community'}
                        size={22}
                        color={AppColors.brand().secondary}
                      />
                      <Text style={styl.bubbleText}>{t('txt_copy')}</Text>
                    </TouchableOpacity>
                  )
                }
                <View style={styl.bubbleView} />
                {this.renderDelete()}
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      );
    }
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return <MessageText {...messageTextProps} />;
    }
    return null;
  }

  renderMessageTextWrapper() {
    return (
      <View>
        {
          !this.props.currentMessage.image && (
            <View
              style={{
                flex: 1,
                marginRight: 5,
                marginTop: 5,
                alignItems: 'flex-end',
              }}
            >
              {this.renderLikes()}
            </View>
          )
        }
        {this.renderMessageText()}
      </View>
    );
  }

  renderReply() {
    const { replyStyle } = this.props;
    if (this.state.parentMessage) {
      return (
        <View
          style={[
            styles.replyWrapper,
            styles[this.props.position].replyContainer,
            replyStyle[this.props.position].replyBubble,
          ]}
        >
          <View
            style={{
              flexDirection: 'column',
              minWidth: 100,
            }}
          >
            <Text
              style={[
                styles[this.props.position].replyText,
                replyStyle[this.props.position].replyText,
                { fontWeight: '500' },
              ]}
              numberOfLines={1}
            >{`${this.state.parentMessage.user.name}:`}</Text>
            <Text
              style={[
                styles[this.props.position].replyText,
                replyStyle[this.props.position].replyText,
              ]}
            >{this.state.parentMessage.text}</Text>
          </View>
          {
            (this.state.parentMessage.image &&
              <CachedImage
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: 5,
                  borderRadius: 2 }}
                source={{ uri: this.state.parentMessage.image }}
              />
            )
          }
        </View>
      );
    }
  }

  renderMessageImage() {
    if (this.props.currentMessage.image || this.props.currentMessage.video) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return <MessageImage {...messageImageProps} />;
    }
    return null;
  }

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={styles.tickView}>
          {currentMessage.sent && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.received && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
        </View>
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return <Time {...timeProps} />;
    }
    return null;
  }
  renderUsername() {
    if (this.state.roomType !== Constants.G_DIRECT) {
      const username = this.props.currentMessage.user.name;
      if (username) {
        console.log('renderUsername', username);
        const { containerStyle, wrapperStyle, ...usernameProps } = this.props;
        if (this.props.renderUsername) {
          return this.props.renderUsername(usernameProps);
        }
        return (
          <Text style={[styles.standardFont, styles.headerItem, styles.username, this.props.usernameStyle]}>
            {username}:
          </Text>
        );
      }
      return null;
    }
  }


  renderCustomView() {
    // if (this.props.renderCustomView) {
    //   return this.props.renderCustomView(this.props);
    // }
    // return null;
    let cvStyle = {};
    if (this.props.currentMessage.image || this.state.parentMessage != null) {
      cvStyle = {
        position: 'absolute',
        top: 5,
        right: 0,
        zIndex: 999,
      };
    } else {
      cvStyle = {
        alignItems: 'flex-end',
      };
    }
    return (
      <View
        style={cvStyle}
      >
        {this.renderLikes()}
      </View>
    );
  }

  renderLikes() {
    if (this.state.likes) {
      return (
        <View style={{
          backgroundColor: AppColors.brand().secondary,
          flexDirection: 'row',
          height: 24,
          minWidth: 40,
          maxWidth: 60,
          padding: 3,
          borderTopLeftRadius: 3,
          borderBottomLeftRadius: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Icon
            name={'heart-outline'}
            type={'material-community'}
            size={16}
            color={iconColor}
          />
          <Text
            style={styl.likeText}
          >{this.state.likes > 0 ? this.state.likes : t('txt_like')}</Text>
        </View>
      );
    }
  }

  renderActions() {
    if (this.state.showActions) {
      return (
        <View
          style={{
            marginHorizontal: 5,
          }}
        >
          <View
            style={{
              alignItems: 'flex-start',
              padding: 3,
              flexDirection: 'row',
              marginVertical: 5,
            }}
          >
            <TouchableOpacity
              style={[styles.actionBtn]}
              onPress={this._onPressLike}
            >
              <Icon
                name={'heart-outline'}
                type={'material-community'}
                size={22}
                color={iconColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn]}
              onPress={this._handleComments}
            >
              <Icon
                name={'comment-text-outline'}
                type={'material-community'}
                size={22}
                color={iconColor}
              />
            </TouchableOpacity>
            {
              !this.props.currentMessage.image &&
              (
                <TouchableOpacity
                  style={[styles.actionBtn]}
                  onPress={this._handleCopy}
                >
                  <Icon
                    name={'content-copy'}
                    type={'material-community'}
                    size={22}
                    color={iconColor}
                  />
                </TouchableOpacity>
              )
            }
            {this.renderDelete()}
          </View>
        </View>
      );
    }
  }

  render() {
    // console.log('aumess', JSON.parse(this.props.currentMessage.original));
    return (
      <View
        style={[
          styles[this.props.position].container,
          this.props.containerStyle[this.props.position],
        ]}
      >
        <View
          style={[
            styles[this.props.position].wrapper,
            this.props.wrapperStyle[this.props.position],
            this.handleBubbleToNext(),
            this.handleBubbleToPrevious(),
          ]}
        >
          <TouchableWithoutFeedback
            onLongPress={this.onLongPress}
            accessibilityTraits="text"
            onPress={this.toggleModalActions}
            {...this.props.touchableProps}
          >
            <View>
              {this.renderCustomView()}
              {this.renderReply()}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                {
            (this.props.position === 'left' &&
              <View>
                {this.renderUsername()}
                {this.renderMessageImage()}
                {this.renderMessageText()}
              </View>)
              ||
              <View>
                {this.renderMessageImage()}
                {this.renderMessageText()}
              </View>
            }
              </View>
              <View style={[styles.bottom, this.props.bottomContainerStyle[this.props.position]]}>
                {this.renderActionsModal()}
                {this.renderActions()}
                <View>
                  {this.renderTime()}
                  {this.renderTicks()}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

}

const chatColors = {
  replyBubbleR: AppColors.chat().replyBubbleR,
};


const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
    },
    replyContainer: {
      backgroundColor: AppColors.chat().replyBubbleL,
    },
    replyText: {
      fontSize: 12,
      color: AppColors.chat().replyTextL,
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: Color.leftBubbleBackground,
      marginRight: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
    standardFont: {
      fontSize: 15,
    },
    username: {
      fontWeight: 'bold',
      color: AppColors.brand().primary,
    },
    headerItem: {
      marginLeft: 10,
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end',
    },
    replyContainer: {
      backgroundColor: chatColors.replyBubbleR,
    },
    replyText: {
      fontSize: 12,
      color: AppColors.chat().replyTextR,
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: Color.defaultBlue,
      marginLeft: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
  }),
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tick: {
    fontSize: 10,
    backgroundColor: Color.backgroundTransparent,
    color: Color.white,
  },
  tickView: {
    flexDirection: 'row',
    marginRight: 10,
  },
  actionBtn: {
    padding: 5,
    borderRadius: 3,
    // borderColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
    // borderTopColor: 'rgba(0,0,0,0.5)',
    // borderTopWidth: 1,
    // borderWidth:1,
  },
  replyWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 8,
    margin: 5,
    borderRadius: 3,
    borderColor: AppColors.brand().bubble_replyWrapperBorderColor,
    borderWidth: 1,
  },
  standardFont: {
    fontSize: 15,
  },
  username: {
    fontWeight: 'bold',
    color: AppColors.brand().primary,
  },
  headerItem: {
    marginLeft: 5,
  },
};

Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
  touchableProps: {},
  renderUsername: null,
  onLongPress: null,
  renderMessageImage: null,
  renderMessageText: null,
  renderCustomView: null,
  renderTicks: null,
  renderTime: null,
  position: 'left',
  currentMessage: {
    text: null,
    createdAt: null,
    image: null,
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  replyStyle: {},
  wrapperStyle: {},
  bottomContainerStyle: {},
  usernameStyle: {},
  tickStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},
  // TODO: remove in next major release
  isSameDay: warnDeprecated(isSameDay),
  isSameUser: warnDeprecated(isSameUser),
  obj: {},
  user: {},
  msgCopy: null,
};

Bubble.propTypes = {
  touchableProps: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
  renderUsername: PropTypes.func,
  onLongPress: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderCustomView: PropTypes.func,
  renderTime: PropTypes.func,
  renderTicks: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
  nextMessage: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
  previousMessage: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  replyStyle: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  wrapperStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  bottomContainerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  usernameStyle: Text.propTypes.style,
  tickStyle: Text.propTypes.style,
  containerToNextStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  // TODO: remove in next major release
  isSameDay: PropTypes.func,
  isSameUser: PropTypes.func,
  obj: React.PropTypes.object,    // eslint-disable-line react/forbid-prop-types
  user: React.PropTypes.object,    // eslint-disable-line react/forbid-prop-types
  msgCopy: PropTypes.func,
};
