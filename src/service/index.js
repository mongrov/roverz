/**
 * Chat specific methods/functionality
 *
 * -- This is the business logic layer for chat --
 */
// import { ModuleConfig } from '../constants/';
import queueFactory from 'react-native-queue';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import md5 from 'react-native-md5';

import Application from '../constants/config';
import AppUtil from '../lib/util';
import DBConstants from '../models/constants';

const PushNotification = require('react-native-push-notification');

const MODULE = 'ChatService';
const DEFAULT_USER = 'default';

// use cases:
// 1) user sends a message:
//  (a) UI would send message to db
//  (b) this layer that observes DB changes would get the message
//  (c) queues the request to send to backend
// 2) user deletes a message:
//  (a) UI checks permission to delete - from this layer
//  (b) this layer co-ordinates with RC layer to check permissions
//  (c) UI deletes from db
//  (d) this layer observes db changes and would get the change
//  (e) queues the request

// NOTE: for timebeing this is by design a singleton class for both chat & service classes

class ChatService {
  constructor() {
    if (!ChatService._db && !ChatService._provider) {
      ChatService._db = null;
      ChatService._provider = null;
      ChatService._serverSettings = null;
      ChatService._loginSettings = [];
    }
  }

  // @todo - do any reinitializations here
  set db(dbHandle) {
    console.log('****** servicedb is set ********', dbHandle);
    ChatService._db = dbHandle;
  }
  get db() {
    return ChatService._db;
  }

  set provider(backendService) {
    ChatService._provider = backendService;
  }
  get provider() {
    return ChatService._provider;
  }
  set settings(s) {
    ChatService._serverSettings = s;
  }
  get settings() {
    return ChatService._serverSettings;
  }
  set loginSettings(ls) {
    ChatService._loginSettings = ls;
  }
  get loginSettings() {
    return ChatService._loginSettings;
  }
  getLoginSetting(key) {
    for (let i = 0; i < this.loginSettings.length; i += 1) {
      if (Object.prototype.hasOwnProperty.call(this.loginSettings[i], key)) {
        // @todo: sending just 'saml' is stupidity, need to send the whole array
        return this.loginSettings[i][key];
      }
    }
    return null;
  }
  get lastSync() {
    const dbAppState = this.db.app.state;
    return (dbAppState && dbAppState.lastSync) ? dbAppState.lastSync.getTime() : 0;
  }
  set lastSync(lastSyncTime) {
    this.db.app.setLastSync(lastSyncTime);
  }

  // @todo - to remove the callback later
  // for timebeing using the same logic to
  // fetch the settings and return back cb
  connect(serverName, cb) {
    console.log('****** service connect to server  *****', serverName);
    this._reset();
    this.provider.connect(serverName);
    this.provider.getPublicSettings((err, settings) => {
      this.settings = settings;
      cb(err, settings);
    });
  }

  login(serverName, userName) {
    this._resetHandlers();
    this.db.setUserId(this.provider.userId);
    Application.setUserId(this.provider.userId);
    this.db.app.allMessages.addListener(this._messagesListener);

    // figure out last sync date/time from db
    this.provider.login(serverName, userName);
  }

  // logout
  logout() {
    this._resetHandlers();
    this.db.setDBPath(null);
    this.db.setUserId(null);
    Application.setUserId(null);
    this.provider.logout();
  }

  // ---- init section over, service methods follow ----

  // return available channels/groups to display
  get availableChannels() {
    return this.db.groups.filteredSortedList(Application.filterRooms);
  }

  // @todo: cache this lookup, no need to do db find every time ?
  get loggedInUserObj() {
    var user = this.loggedInUser;
    /*
      { _id: '6Qk76sozAy6oNSopT',
      emails: [ { address: 'emailID', verified: true } ],
      username: 'kumar',
      _version: 1 }
    */
    if (user) {
      return this.db.users.findById(user._id);
    }
    return null;
  }

  // @todo: move this method to lookup message as a db object (message)
  canDelete(message) {
    //    var deletePermission = false;
    var deleteOwn = false;
    const currentUsr = this.loggedInUserObj;
    if (currentUsr && message && message.u && message.u._id) {
      deleteOwn = (message.u._id === currentUsr._id);
    }
    //    deletePermission = this.deleteAllowed && deleteOwn;
    // if (this.blockDeleteInMinutes && this.blockDeleteInMinutes !== 0) {
    //   const msgTs = moment(message.ts);
    //   const currentTsDiff = moment().diff(msgTs, 'minutes');
    //   if (currentTsDiff > this.blockDeleteInMinutes) {
    //     return false;
    //   }
    // }
    return deleteOwn;
  }


  // ---- service actions -----

  // @todo: need to remove this from any reference in UI - lets use the above obj from db
  get loggedInUser() {
    return this.provider.loggedInUser;
  }

  // Todo
  // - these can be disabled in UI and can be shown only
  //   only if connectivity present ? - TBD

  // Direct messages (DMs) are private, 1-on-1 conversation between team members. You can
  // think of a DM as a private group with only two members.
  createDirectMessage(userName, cb) {
    this.provider.createDirectMessage(userName, cb);
  }
  createChannel(channelName, isReadonly, userList, cb) {
    this.provider.createChannel(channelName, false, isReadonly, userList, cb);
  }
  createGroup(channelName, isReadonly, userList, cb) {
    this.provider.createChannel(channelName, true, isReadonly, userList, cb);
  }
  joinRoom(roomId, cb) {
    this.provider.joinRoom(roomId, cb);
  }

  // - presence
  setUserPresence(presenceStatus, cb) {
    this.provider.setUserPresence(presenceStatus, (err, res) => {
      AppUtil.debug(res, `${MODULE}: setUserPresence - ${presenceStatus}`);
      if (cb) cb(err, res);
    });
  }
  getUserPresence(state, cb) {
    this.provider.getUserPresence(state, (err, res) => {
      AppUtil.debug(res, `${MODULE}: getUserPresence - ${state}`);
      if (cb) cb(err, res);
    });
  }

  // - reactions
  setLike(messageId, cb) {
    this.provider.setLikeReaction(messageId, cb);
  }

  // - conference calls
  startVideoConference(rid) {
    this.provider.startVideoConference(rid);
  }

  // - conference calls
  updateVideoCallStatus(rid, status) {
    this.provider.updateVideoCallStatus(rid, status);
  }

  // - conference calls
  getVideoCallStatus(rid, cb) {
    this.provider.getVideoCallStatus(rid, cb);
  }

  // -- message calls
  sendMessage(groupObj, msg, cb) {
    this.provider.sendMessage(groupObj._id, msg, cb);
    // this.db.groups.addMessage(groupObj, msg);
  }

  // -- message calls
  sendLocationMessage(groupObj, long, lat, cb) {
    this.provider.sendLocationMessage(groupObj._id, long, lat, cb);
    // this.db.groups.addMessage(groupObj, msg);
  }

  deleteMessage(msgID, cb) {
    this.provider.deleteMessage(msgID, cb);
  }

  replyMessage(groupObj, msgId, replyText, cb) {
    this.provider.replyMessage(groupObj, msgId, replyText, cb);
  }

  setRoomAsRead(rid) {
    this.provider.setRoomAsRead(rid);
  }

  // -- internal service call backs

  // login/logout related handlers
  _resetHandlers() {
    if (this.db && this.db.app) {
      this.db.app.allMessages.removeListener(this._messagesListener);
    }
  }

  // connection related handlers
  _reset() {
    this.settings = null;
    this.loginSettings = [];
  }

  _updateUsers(users) {
    // console.log('**** update users **** ====> ', users);
    this.db.users.updateFullUserData(users);
  }
  _deleteGroups(groups) {
    console.log('**** delete groups **** ====> ', groups);
    this.db.groups.deleteGroups(groups);
  }
  _updateGroups(groups) {
    // console.log('**** update groups **** ====> ', groups);
    this.db.groups.addAll(groups);
  }
  _deleteMessage(groupId, messageId) {
    // console.log('**** delete message **** ====> ', groupId, messageId);
    this.db.deleteMessage(groupId, messageId);
  }
  _updateLoginConfig(loginDetails) {
    // console.log('**** update login config **** ====> ', loginDetails);
    this.loginSettings = this.loginSettings.concat(loginDetails);
  }

  // connection life cycle from servie
  _connectionChange(serverName, isConnected) {
    console.log('**** _connectionChange', serverName, isConnected);
    if (!isConnected && this.db && this.db.app) {
      this.db.app.setServerConnectionStatus(isConnected);
    }
  }

  _onLogin(serverName, userName) {
    const uname = userName || DEFAULT_USER;
    // lets set the user to db
    this.db.switchDb(serverName, uname);
    // if (this.db && this.db.app) {
    //   this.db.app.setServerConnectionStatus(false);
    // }
    // this.chat.resetDbHandle(Network._db);
    this.login(serverName, uname);
    this.db.app.setServerConnectionStatus(true);
    // this.dbSync();
    // this._test();
  }

  _lastMessageAt(groupId) {
    const groupObj = this.db.groups.findById(groupId);
    return (groupObj && groupObj.lastMessageAt) || 0;
  }

  _messagesListener(messages, changes) {
    changes.insertions.forEach((index) => {
      const insertedMsg = messages[index];
      if (insertedMsg.type === 0) {
        console.log('***** This message needs to be sent to backend ****', insertedMsg);
      }
    });
    changes.deletions.forEach((index) => {
      const deletedMsg = messages[index];
      if (deletedMsg.type === 0) {
        console.log('***** This message needs to be deleted at backend ****', deletedMsg);
      }
    });
  }

  // -- following three methods need to be cleanedup --

  // convert yap message to internal message
  yap2message(id, rid, text, createdAt, userId, userUserName, userName) {
    return { _id: id, rid, text, createdAt, user: { _id: userId, username: userUserName, name: userName } };
  }

  // yap messages from server
  // @todo:
  // if (msgs.length < n) {
  //   _super.db.groups.updateNoMoreMessages(group);
  // }
  yaps2db(group, msgs) {
    const groupObj = this.db.groups.findById(group._id);
    if (!msgs || !groupObj || msgs.length === 0) return;
    const yaps = {};
    const editedYaps = {};
    const currUser = this.loggedInUserObj;
    for (let i = 0; i < msgs.length; i += 1) {
      const inM = msgs[i];
      let msgText = inM.msg;
      if (inM.t && inM.t === 'mgcall_init') {
        msgText = 'Started a Call!';
        if (!(inM.u._id === currUser._id) && (groupObj.findMessageById(inM._id) === null)) {
          this.incomingVC(currUser, inM.ts, inM.rid, groupObj);
        }
      }
      if (inM.actionLinks && inM.actionLinks[0].method_id === 'joinMGVCCall') {
        msgText = 'Started a Video Call!';
        if (!(inM.u._id === currUser._id) && (groupObj.findMessageById(inM._id) === null)) {
          const msgTs = moment(inM.ts);
          const currentTsDiff = moment().diff(msgTs, 'minutes');
          if (currentTsDiff < 1) {
            PushNotification.localNotificationSchedule({
              message: `Video Call started in ${groupObj.name}`, // (required)
              playSound: true,
              soundName: 'vcring.mp3',
              date: new Date(Date.now()), // in 60 secs
            });
          }
        }
      }
      const m = this.yap2message(inM._id, inM.rid, msgText, inM.ts, inM.u._id, inM.u.username, inM.u.name);
      m.original = inM;
      if (inM.attachments && inM.attachments.length > 0) {
        const atM = inM.attachments[0];
        if (m.text === '') {
          if (atM.description) {
            m.text = atM.description;
          } else {
            m.text = atM.text ? atM.text : atM.title;
          }
        }
        if (atM.image_url) {
          m.image = atM.image_url.startsWith('http') ||
          atM.image_url.startsWith('//') ? atM.image_url : `${Application.urls.SERVER_URL}${atM.image_url}`;
          if (inM.file) {
            m.remoteFile = inM.file._id;
          }
        }
      }
      m.likes = 0;
      m.type = DBConstants.M_DELIVERED;
      if (inM.reactions) {
        Object.keys(inM.reactions).forEach((key) => {
          if (key.indexOf('thumbsup') >= 0) {
            const tempUsers = inM.reactions[key];
            m.likes = tempUsers.usernames.length;
          }
        });
      }
      if (inM.editedAt || inM.reactions) {
        editedYaps[m._id] = m;
      } else {
        yaps[m._id] = m;
      }
    }
    this.db.addMessages(groupObj, yaps);
    this.db.updateMessages(groupObj, editedYaps);
  }

  incomingVC(currUser, ts, gid, group) {
    if (group && group.type === 'direct') {
      const msgTs = moment(ts);
      const currentTsDiff = moment().diff(msgTs, 'seconds');
      if (currentTsDiff < 20) {
        const vcuserID = currUser ? md5.hex_md5(currUser._id) : '0';
        Actions.directConference({
          instance: Application.instance,
          groupName: group.name,
          groupID: gid,
          groupType: group.type,
          userID: vcuserID,
          callType: 'INCOMING',
        });
      }
    }
  }

  _test() {
    queueFactory().then((queue) => {
      console.log('******* queuefactory created *******');
      // Register the worker function for "example-job" jobs.
      queue.addWorker('example-job', async (id, payload) => {
        console.log(`EXECUTING "example-job" with id: ${id}`);
        console.log(payload, 'payload');

        await new Promise((resolve) => {
          setTimeout(() => {
            console.log('"example-job" has completed!');
            resolve();
          }, 5000);
        });
      });

      // Create a couple "example-job" jobs.

      // Example job passes a payload of data to 'example-job' worker.
      // Default settings are used (note the empty options object).
      // Because false is passed, the queue won't automatically start when this job is created, so usually queue.start()
      // would have to be manually called. However in the final createJob() below we don't pass false so it will start
      // the queue.
      // NOTE: We pass false for example purposes. In most scenarios starting queue on createJob() is perfectly fine.
      queue.createJob('example-job', {
        emailAddress: 'foo@bar.com',
        randomData: {
          random: 'object',
          of: 'arbitrary data',
        },
      }, {}, false);

      // Create another job with an example timeout option set.
      // false is passed so queue still hasn't started up.
      queue.createJob('example-job', {
        emailAddress: 'example@gmail.com',
        randomData: {
          random: 'object',
          of: 'arbitrary data',
        },
      }, {
        timeout: 1000, // This job will timeout in 1000 ms and be marked failed
      }, false);

      // This will automatically start the queue after adding the new job so
      // we don't have to manually call queue.start().
      queue.createJob('example-job', {
        emailAddress: 'another@gmail.com',
        randomData: {
          random: 'object',
          of: 'arbitrary data',
        },
      });

      console.log('*********************** The above jobs are processing in the background of app now.');
    });
  }
}

/* Export ==================================================================== */
export default ChatService;
