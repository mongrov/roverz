/**
 * RocketChat specific methods/functionality
 */
// import { ModuleConfig } from '../constants/';
// import Application from '../constants/config';
import AppUtil from '../lib/util';
import Application from '../constants/config';

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
// - why service calls should be starting with '_' ? follow a naming pattern

const MODULE = 'RC';
const FETCH_GROUP_MIN_MSGS = 5;

class RC {
  constructor(serviceObj) {
    if (!RC._service) {
      RC._service = serviceObj;
      RC._meteor = null;
      RC._groupSubscriptionMap = {};
      RC._serverName = null;
      RC._pendingMessages = [];
      RC._initialFetchPending = false;
      RC._state = {
        _server: false, // meteor server side connection status
        _login: false, // logged in state
      };
    }
  }

  // @todo - do any reinitializations here
  set meteor(meteorObj) {
    console.log('****** RC meteor is set ********');
    RC._meteor = meteorObj;
    this.meteor.monitorConnection((isConnected) => {
      this._meteorConnectionChange(isConnected);
    });
    this.meteor.monitorAction('onLogin', () => {
      this._onLogin();
    });
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
  get serverName() {
    return RC._serverName;
  }

  // -- RC connection lifecycle methods

  // @todo - don't do anything for now, should see where it would be useful
  _meteorConnectionChange(isConnected) {
    AppUtil.debug(null, `${MODULE}: _meteorConnectionChange - ${isConnected}`);
    if (RC._state._server !== isConnected) {
      RC._state._server = isConnected;
      if (!isConnected) {
        RC._state._login = false;
      }
      this.service._connectionChange(this.serverName, isConnected);
    }
  }

  _onLogin() {
    AppUtil.debug(null, `${MODULE}: _onLogin`);
    if (!RC._state._login) {
      RC._state._login = true;
      this.service._onLogin(this.serverName, this.loggedInUser && this.loggedInUser.username);
    }
  }

  connect(serverName) {
    AppUtil.debug(null, `${MODULE}: connect - ${serverName}`);
    RC._serverName = serverName;
    this._cleanupNetwork();
    this._initNetworkSubscriptions();
  }

  login(serverName, userName) {
    AppUtil.debug(null, `${MODULE}: login - ${userName} at ${serverName}`);
    this._cleanupLogin();
    this._initUserSubscriptions(this.userId);
    this._fetchChannels();
    // @todo - @ezhil - why are we calling this ?
    this.getUserPresence('online');
  }

  logout() {
    this._cleanupLogin();
    this.meteor.logout();
  }

  // --- RC calls, general signature of a call would be
  //  any callback would carry (error, result) / (err,res) as two arguments

  get loggedInUser() {
    return this.meteor.loggedInUser;
  }

  mgbdGetChecklistItems(cardID, cb) {
    this.meteor.call('mgbdGetChecklistItems', cardID, cb);
  }

  mgbdGetChecklists(cardID, cb) {
    this.meteor.call('mgbdGetChecklists', cardID, cb);
  }

  mgbdGetCardComments(cardID, cb) {
    this.meteor.call('mgbdGetCardComments', cardID, cb);
  }

  mgbdCreateCardComments(boardID, cardID, cardComments, cb) {
    this.meteor.call('mgbdCreateCardComments', boardID, cardID, cardComments, cb);
  }

  mgbdUpdateChecklistItems(checklistID, title, isFinished, cb) {
    this.meteor.call('mgbdUpdateChecklistItems', checklistID, title, isFinished, cb);
  }

  mgbdGetBoardDetails(roomName, cb) {
    this.meteor.call('mgbdGetBoardDetails', roomName, cb);
  }

  mgbdGetList(roomName, cb) {
    this.meteor.call('mgbdGetList', roomName, cb);
  }

  mgbdGetCardList(listID, cb) {
    this.meteor.call('mgbdGetCardList', listID, cb);
  }

  registerUser(email, pass, name, cb) {
    this.meteor.call('registerUser', { name, email, pass }, cb);
  }
  getUsernameSuggestion(cb) {
    this.meteor.call('getUsernameSuggestion', cb);
  }
  setUsername(name, cb) {
    this.meteor.call('setUsername', name, cb);
  }
  changePassword(oldPassword, newPassword, cb) {
    this.meteor.accounts.changePassword(oldPassword, newPassword, cb);
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

    // conference calls
  // @todo: check if we want to replace null with cb
  updateVideoCallStatus(rid, status) {
    this.meteor.call('mgcall:updateStatus', rid, status);
  }

  // - conference calls
  getVideoCallStatus(rid, cb) {
    this.meteor.call('mgcall:getStatus', rid, cb);
  }

  getPublicSettings(cb) {
    this.meteor.call('public-settings/get', (err, res) => {
      if (err) {
        cb(err, null);
      } else {
        const settingsList = {};
        if (res && res.length > 0) {
          for (let i = 0; i < res.length; i += 1) {
            const resdata = res[i];
            settingsList[resdata._id] = resdata;
            // if (resdata._id === 'Message_AllowDeleting' && resdata.value) {
            //   this.deleteAllowed = resdata.value;
            // }
            // if (resdata._id === 'Message_AllowDeleting_BlockDeleteInMinutes' && resdata.value) {
            //   this.blockDeleteInMinutes = resdata.value;
            // }
          }
        }
        cb(null, settingsList);
      }
    });
  }

  // message api's
  sendMessage(rid, msg, cb) {
    this.meteor.call('sendMessage', { rid, msg }, cb);
  }

  sendLocationMessage(roomid, msgObj, lon, lat, cb) {
    this.meteor.call('sendMessage',
    { rid: roomid, msg: JSON.stringify(msgObj), location: { type: 'Point', coordinates: [lon, lat] } }, cb);
  }

  deleteMessage(msgID, cb) {
    this.meteor.call('deleteMessage', { _id: msgID }, cb);
  }

  // @todo - need to have server url not referenced here
  replyMessage(groupObj, msgId, replyText, cb) {
    var grptype = 'direct';
    if (groupObj.isPrivate) {
      grptype = 'group';
    } else if (groupObj.isPublic) {
      grptype = 'channel';
    }
    const replyFormat = `[ ](${Application.urls.SERVER_URL}/${grptype}/${groupObj.name}?msg=${msgId})`;
    const rMsg = `${replyFormat} ${replyText}`;
    this.sendMessage(groupObj._id, rMsg, cb);
  }

  // set room as read
  // @todo: need to add cb
  setRoomAsRead(rid) {
    this.meteor.call('readMessages', rid);
  }

  // ---- local methods ---- (not to be called outside)

  _cleanupNetwork() {
    this.meteor.stopMonitoringChanges(RC._mLoginCfg);
    RC._mLoginCfg = null;
  }

  _cleanupLogin() {
    RC._groupSubscriptionMap = {};
    // unsubscribe and clean the handles
    // RC._mUsers
    // RC._mStreamNotifyUser
    this.meteor.stopMonitoringChanges(RC._mUsers);
    RC._mUsers = null;
    this.meteor.stopMonitoringChanges(RC._mStreamNotifyUser);
    RC._mStreamNotifyUser = null;
    this.meteor.stopMonitoringChanges(RC._mStreamRoomMessages);
    RC._mStreamRoomMessages = null;
    this.meteor.stopMonitoringChanges(RC._mStreamNotifyRoom);
    RC._mStreamNotifyRoom = null;
    RC._pendingMessages = [];
  }

  // call this method once connection is made to a meteor server
  // @todo: check each of the enabled subscriptions, if required/not
  _initNetworkSubscriptions() {
    var _super = this;
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

    // login configs
    this.meteor.subscribe('meteor.loginServiceConfiguration');

    // monitor for any updates and send it to service
    RC._mLoginCfg = this.meteor.monitorChanges('meteor_accounts_loginServiceConfiguration', (results) => {
      _super.service._updateLoginConfig(results);
    });
  }

  // subscriptions to user
  _initUserSubscriptions(uid) {
    var _super = this;
    RC._initialFetchPending = true;
    // Need to vet all these and see what all we actually use in client
    // this._subscribe('stream-notify-all', "public-settings-changed", false);
    this.meteor.subscribe('stream-notify-user', `${uid}/subscriptions-changed`, false);
    this.meteor.subscribe('stream-notify-user', `${uid}/notification`, false);
    this.meteor.subscribe('stream-notify-user', `${uid}/rooms-changed`, false);
    this.meteor.subscribe('stream-notify-user', `${uid}/message`, false);
    this.meteor.subscribe('stream-notify-user', `${uid}/webrtc`, false);
    // this.meteor.subscribe('stream-notify-user', `${Meteor.userId()}/rooms-changed`, false);
    // this._subscribe('stream-notify-user', Meteor.userId()+"/otr", false);

    RC._mUsers = this.meteor.monitorChanges('users', (results) => {
      _super.service._updateUsers(results);
    });

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
            _super._updateGroups(groups, false);
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

    // monitor for any updates on room
    RC._mStreamRoomMessages = this.meteor.monitorChanges('stream-room-messages', (results) => {
      if (results && results.length > 0) {
        // console.log("***** new message ****", results[0].eventName, results[0].args);
        // group id is the name of the event
        // const group = _super.db.groups.findById(results[0].eventName);
        RC._pendingMessages.push({ _id: results[0].eventName, msgs: results[0].args });
        console.log('****** live message ******', RC._initialFetchPending, results[0].args);
        if (!RC._initialFetchPending) {
          console.log('****** flush messages ******');
          _super._flushMessages();
        }
      }
    });
    // message deleed and updated should reflect here
    RC._mStreamNotifyRoom = this.meteor.monitorChanges('stream-notify-room', (result) => {
      if (result && result.length > 0) {
        const resEventName = result[0].eventName;
        if (resEventName && resEventName.endsWith('/deleteMessage')) {
          const groupId = resEventName.substring(0, resEventName.lastIndexOf('/deleteMessage'));
          _super.service._deleteMessage(groupId, result[0].args[0]._id);
        }
      }
    });
  }

  // subscribe to all changes in group
  // @todo: where do we monitor the tables?
  //  - need to cleanup the subscriptions based on map
  _subscribeToGroup(groupId) {
    if (!Object.prototype.hasOwnProperty.call(RC._groupSubscriptionMap, groupId)) {
      this.meteor.subscribe('stream-room-messages', groupId, false);
      this.meteor.subscribe('stream-notify-room', `${groupId}/deleteMessage`, false);
      RC._groupSubscriptionMap[groupId] = 'ADDED'; // use set or array instead of map
    }
  }

  // subscribe for changes from all groups
  // pass array of groups
  _subscribeToGroups(groups) {
    // console.log("***** subscribe to groups ****** ", groups);
    Object.keys(groups).forEach((k) => {
      this._subscribeToGroup(groups[k]._id);
    });
  }

  // fetch groups from a given date/time
  _fetchChannels() {
    const _super = this;
    const lastSync = this.service.lastSync;
    // const temp = lastSync > 0 ? Math.floor(lastSync / 1000) : 0;
    const req1 = this.meteor.call('rooms/get', { $date: lastSync });
    const req2 = this.meteor.call('subscriptions/get', { $date: lastSync });
    Promise.all([req1, req2]).then((results) => {
      // results[0] -  rooms, [1] - subscriptions
      // @todo: move this to util - shallowMerge?
      const rooms = results[0];
      const groups = _super._room2group(rooms);
      const subscriptions = _super._subscription2group(results[1]);
      Object.keys(groups).forEach((k) => {
        if (k in subscriptions) {
          groups[k] = Object.assign(subscriptions[k], groups[k]);
        }
      });
      // console.log('********** groups to be updated *********', groups);
      _super._updateGroups(groups, true);

      // lets see if anything in message list that needs to be sync
    }).catch(() => {
      // cb(err, null);
      // todo - this path is bound to choke, need to see how to recover
      RC._initialFetchPending = false;
    });
  }

  _flushMessages() {
    while (RC._pendingMessages.length > 0) {
      const msgObj = RC._pendingMessages.shift();
      // console.log('******** pushing now the pre-fetched change ****** ', msgObj);
      this.service.yaps2db({ _id: msgObj._id }, msgObj.msgs);
    }
    RC._initialFetchPending = false;
  }

  // fetch 'n' messages from a given list of groups
  _fetchMessages(groups, n) {
    const _super = this;
    const reqs = [];
    const fetchingGroups = [];
    Object.keys(groups).forEach((k) => {
      const group = groups[k];
      // console.log('==== fetch ====', group.name);
      const req = this.meteor.call('loadHistory', group._id, null, n, null);
      reqs.push(req);
      fetchingGroups.push(group);
    });
    Promise.all(reqs).then((results) => {
      // console.log('Then: ', results);
      // results[0] is from 'loadHistory'
      // const msgs = results[0].messages;
      for (let i = 0; i < results.length; i += 1) {
        _super.service.yaps2db(fetchingGroups[i], results[i].messages);
      }
      _super._flushMessages();
    }).catch((/* err */) => {
      // console.log('Catch: ', err);
    });
  }

  // fetch messages from a given time for list of groups
  _fetchMissedMessages(groups, lastSyncTs) {
    const _super = this;
    const reqs = [];
    const fetchingGroups = [];
    Object.keys(groups).forEach((k) => {
      const group = groups[k];
      // console.log('==== group ====', group.name, lastSyncTs, group.updatedAt.getTime());
      if (lastSyncTs < group.updatedAt.getTime()) {
        const gID = group._id;
        // sync from last date when the group had message
        let lastMessageAt = _super.service._lastMessageAt(gID);
        if (lastMessageAt === 0) {
          lastMessageAt = new Date(lastSyncTs);
        }
        console.log('==== group ====', group.name, new Date(lastSyncTs), gID, lastMessageAt);
        // rid, lastMessage.ts
        const req = this.meteor.call('loadMissedMessages', gID, lastMessageAt);
        reqs.push(req);
        fetchingGroups.push(group);
      }
    });
    // console.log('===== fetchMissedMessages ====', reqs);
    if (reqs.length > 0) {
      Promise.all(reqs).then((results) => {
        // console.log('Then: ', results);
        // const msgs = results ? results[0] : null;
        for (let i = 0; i < results.length; i += 1) {
          // console.log('**** loaded missing messages *****', results[i], fetchingGroups[i]);
          _super.service.yaps2db(fetchingGroups[i], results[i]);
        }
        _super._flushMessages();
      }).catch((err) => {
        console.log('Catch: ', err);
      });
    } else {
      _super._flushMessages();
    }
  }

  // ---- utilities ----

  _updateGroups(groups, fetchMessages) {
    if (!groups || Object.keys(groups).length <= 0) return;
    const lastSync = this.service.lastSync;
    const newSyncDate = new Date();
    this.service._updateGroups(groups);
    // subscription in case of fetching path, should happen
    // after fetch is done, so this call would happen within
    // fetch methods
    this._subscribeToGroups(groups);
    if (fetchMessages) {
      if (lastSync === 0) {
        this._fetchMessages(groups, FETCH_GROUP_MIN_MSGS);
      } else {
        this._fetchMissedMessages(groups, lastSync);
      }
      // console.log('======== setting new last sync date========', newSyncDate);
      this.service.lastSync = newSyncDate;
    }
  }

  _room2group(inRooms) {
    const groups = {};
    if (inRooms && inRooms.length > 0) {
      for (let i = 0; i < inRooms.length; i += 1) {
        const obj = inRooms[i];
        if (obj.t !== 'l') { // ignore live chat
          let r = { _id: obj._id,
            name: obj.name,
            type: obj.t,
            title: obj.topic || obj.fname,
            updatedAt: obj._updatedAt,
            readonly: obj.ro || false };
          r = AppUtil.removeEmptyValues(r);
          groups[r._id] = r;
          // console.log(' room ===> ', r.name, r.updatedAt);
        }
      }
    }
    return groups;
  }

  // convert subscriptions to group structure
  _subscription2group(inSubscriptions) {
    const groups = {};
    if (inSubscriptions && inSubscriptions.length > 0) {
      for (let i = 0; i < inSubscriptions.length; i += 1) {
        const obj = inSubscriptions[i];
        if (obj.t !== 'l') { // ignore live chat for now
          let r = {
            _id: obj.rid,
            name: obj.name,
            title: obj.fname,
            updatedAt: obj._updatedAt,
            unread: obj.unread,
            type: obj.t,
          };
          r = AppUtil.removeEmptyValues(r);
          if (r._id) {
            groups[r._id] = r;
            // console.log(' subscription  ===> ', r.name, r.updatedAt);
          }
        }
      }
    }
    return groups;
  }

}

/* Export ==================================================================== */
export default RC;
