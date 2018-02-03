/**
 * RocketChat specific methods/functionality
 */
// import { ModuleConfig } from '../constants/';
// import Application from '../constants/config';
import AppUtil from '../lib/util';

// Enable debug output when in Debug mode
// const DEBUG_MODE = ModuleConfig.DEV;

// lifecycle methods of service
//  - connect()
//  - reconnect()
//  - disconnect()
//  - server settings
//  - events for the same
//  --- connected
//  --- disconnected
// lifecycle methods for user
//  - login()
//  - logout()
//  - user settings

// const ServiceConfig = {
//   constructor() {
//     this.name = 'RocketChat',
//     this.server = 'xyz'
//   }
// };

// basic criteria:
// 1) we want to do things, only if meteor is connected
//

// Open Questions to be addressed
// - why do we have to subscribe to all groups separately ?

const MODULE = 'RC';

class RC {
  constructor(serviceObj) {
    if (!RC._service) {
      RC._service = serviceObj;
      RC._meteor = null;
      RC._groupSubsriptionMap = {};
    }
  }

  // @todo - do any reinitializations here
  set meteor(meteorObj) {
    console.log('****** RC meteor is set ********');
    RC._meteor = meteorObj;
  }

  get meteor() {
    return RC._meteor;
  }
  get userId() {
    return this.meteor.userId;
  }

  get service() {
    return RC._service;
  }

  // -- RC connection lifecycle methods

  connect(serverName) {
    AppUtil.debug(null, `${MODULE}: connect - ${serverName}`);
    this._initNetworkSubscriptions();
  }

  login(serverName, userName) {
    AppUtil.debug(null, `${MODULE}: login - ${userName} at ${serverName}`);
    this._initUserSubscriptions(this.userId);
  }

  // --- RC calls, general signature of a call would be
  //  any callback would carry (error, result) / (err,res) as two arguments

  get loggedInUser() {
    return this.meteor.loggedInUser;
  }

  // use like createDirectMessage('ananth');
  createDirectMessage(userName, cb) {
    this.meteor.call('createDirectMessage', userName, cb);
  }

  joinRoom(roomId, cb) {
    this.meteor.call('joinRoom', roomId, null, cb);
  }

  createChannel(channelName, isPrivate, isReadonly, userList, cb) {
    var methodName = !isPrivate ? 'createChannel' : 'createPrivateGroup';
    this.meteor.call(methodName, channelName, userList, isReadonly, cb);
  }

  // presence api's
  // @todo - this also is a set method, should be renamed appropriately
  getUserPresence(state, cb) {
    const methodType = `UserPresence:${state}`;
    this.meteor.call(methodType, cb);
  }
  setUserPresence(presenceStatus, cb) {
    this.meteor.call('UserPresence:setDefaultStatus', presenceStatus, cb);
  }

  // reaction api's
  setReaction(reaction, messageId, cb) {
    this.meteor.call('setReaction', reaction, messageId, cb);
  }
  // use like setLikeReaction('kXLJrEEMKa9WSziPn');
  setLikeReaction(messageId, cb) {
    this.setReaction(':thumbsup:', messageId, cb);
  }

  // conference calls
  // @todo: check if we want to replace null with cb
  startVideoConference(rid) {
    this.meteor.call('mgvc:updateTimeout', rid, null);
  }

  // ---- local methods ---- (not to be called outside)

  // @todo: need to decide when to call
  _cleanup() {
    // unsubscribe and clean the handles
    // RC._mUsers
    // RC._mStreamNotifyUser
  }

  // call this method once connection is made to a meteor server
  // @todo: check each of the enabled subscriptions, if required/not
  _initNetworkSubscriptions() {
    // this._subscribe('meteor.loginServiceConfiguration');
    this.meteor.subscribe('roles');
    this.meteor.subscribe('userData');
    this.meteor.subscribe('activeUsers');
    // this._subscribe('stream-notify-logged', "permissions-changed", false);
    // this._subscribe('stream-notify-logged', 'roles-change', false);
    // this._subscribe('stream-notify-logged', 'updateEmojiCustom', false); // no
    // this._subscribe('stream-notify-logged', 'deleteEmojiCustom', false); // no
    // this._subscribe('stream-notify-logged', 'Users:NameChanged', false);
    // this._subscribe('stream-notify-logged', 'updateAvatar', false);
    // this._subscribe('stream-notify-all', 'updateCustomSound', false); // no
    // this._subscribe('stream-notify-all', 'deleteCustomSound', false); // no

    // monitor for any updates and send it to service
    RC._mUsers = this.meteor.monitorChanges('users', (results) => {
      this.service._updateUsers(results);
    });
  }

  // subscriptions to user
  _initUserSubscriptions(uid) {
    var _super = this;
    // Need to vet all these and see what all we actually use in client
    // this._subscribe('stream-notify-all', "public-settings-changed", false);
    this.meteor.subscribe('stream-notify-user', `${uid}/subscriptions-changed`, false);
    this.meteor.subscribe('stream-notify-user', `${uid}/notification`, false);
    this.meteor.subscribe('stream-notify-user', `${uid}/rooms-changed`, false);
    this.meteor.subscribe('stream-notify-user', `${uid}/message`, false);
    this.meteor.subscribe('stream-notify-user', `${uid}/webrtc`, false);
    // this.meteor.subscribe('stream-notify-user', `${Meteor.userId()}/rooms-changed`, false);
    // this._subscribe('stream-notify-user', Meteor.userId()+"/otr", false);

    // monitor for any updates and send it to service
    // @todo: The return value to be used for unsubscribe
    RC._mStreamNotifyUser = this.meteor.monitorChanges('stream-notify-user', (results) => {
      if (results && results.length > 0) {
        // // console.log('User changes:', results);
        const resEventName = results[0].eventName;
        // take some action here
        // update subscriptions-changed
        if (resEventName.endsWith('subscriptions-changed') || resEventName.endsWith('rooms-changed')) {
          // console.log('User Subscription updated:', results[0].args[0], results[0].args[1]);
          const msgs = [];
          msgs.push(results[0].args[1]);
          const groups = _super._subscription2group(msgs);
          if (results[0].args[0] === 'removed') {
            // TODO no need to create group object and send for delete instead use ID
            _super.service._deleteGroups(groups);
          } else {
            _super.service._updateGroups(groups);
            for (let i = 0; i < groups.length; i += 1) {
              _super._subscribeToGroup(groups[i]._id);
            }
          }
        }
        // check for webrtc
        // [ { _id: 'id',
        // eventName: 'wKk3sXsCYvTkXJeLY/webrtc',
        // args:
        //  [ 'call',
        //    { from: 'xvx4w2hLb29SYXsK4',
        //      room: 'wKk3sXsCYvTkXJeLYxvx4w2hLb29SYXsK4',
        //      media: { audio: true } } ],
        // _version: 3 } ]
        if (resEventName.endsWith('/webrtc')) {
          // console.log('WebRTC updates', results);
          if (results[0].args[0] === 'call') {
            // new incoming call, lets for now show ios call
            // showCallScreen(results[0].args[1]);
          }
        }
      }
    });
  }

  // subscribe to all changes in group
  // @todo: where do we monitor the tables?
  //  - need to cleanup the subscriptions based on map
  _subscribeToGroup(groupId) {
    if (!Object.prototype.hasOwnProperty.call(RC._groupSubsriptionMap, groupId)) {
      this.meteor.subscribe('stream-room-messages', groupId, false);
      this.meteor.subscribe('stream-notify-room', `${groupId}/deleteMessage`, false);
      RC._groupSubsriptionMap[groupId] = 'ADDED'; // use set or array instead of map
    }
  }

  // ---- utilities ----

  // convert subscriptions to group structure
  _subscription2group(inSubscriptions) {
    const groups = [];
    if (inSubscriptions && inSubscriptions.length > 0) {
      for (let i = 0; i < inSubscriptions.length; i += 1) {
        const obj = inSubscriptions[i];
        if (obj.t !== 'l') { // ignore live chat for now
          let r = { _id: obj.rid, name: obj.name, title: obj.fname, updatedAt: obj._updatedAt, unread: obj.unread };
          r = AppUtil.removeEmptyValues(r);
          if (r._id) {
            groups[r._id] = r;
          }
        }
      }
    }
    return groups;
  }

}

/* Export ==================================================================== */
export default RC;
