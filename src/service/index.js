/**
 * Chat specific methods/functionality
 *
 * -- This is the business logic layer for chat --
 */
// import { ModuleConfig } from '../constants/';
import queueFactory from 'react-native-queue';
import Application from '../constants/config';
import AppUtil from '../lib/util';

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
    console.log('****** service login  *****', serverName, userName);
    this.db.setUserId(this.provider.userId);
    Application.setUserId(this.provider.userId);
    this.provider.login(serverName, userName);
    this.db.app.allMessages.addListener(this._messagesListener);
  }

  // logout
  // removeListener - messagesListener

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

  // -- internal service call backs

  _reset() {
    this.settings = null;
    this.loginSettings = [];
  }

  // @todo: convert this to a single call in db (batch txn update)
  _updateUsers(users) {
    // console.log("**** update users **** ====> ", this.db);
    // console.log("**** update users **** ====> ", this.db && this.db.users && this.db.users.list);
    if (users && users.length > 0) {
      for (let i = 0; i < users.length; i += 1) {
        this.db.users.updateFullUserData(users[i]);
      }
    }
  }
  _deleteGroups(groups) {
    this.db.groups.deleteGroups(groups);
  }
  _updateGroups(groups) {
    this.db.groups.addAll(groups);
  }
  _updateLoginConfig(loginDetails) {
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
    console.log('**** loggedin to ', serverName, userName);
    const uname = userName || DEFAULT_USER;
    // lets set the user to db
    this.db.switchDb(serverName, uname);
    // if (this.db && this.db.app) {
    //   this.db.app.setServerConnectionStatus(false);
    // }
    // this.chat.resetDbHandle(Network._db);
    this.login(serverName, uname);
    console.log('************* connection status **************');
    this.db.app.setServerConnectionStatus(true);
    // this.dbSync();
  }

  _messagesListener(messages, changes) {
    console.log('****** messages db updated with ******', changes);
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

      console.log('The above jobs are processing in the background of app now.');
    });
  }
}

/* Export ==================================================================== */
export default ChatService;
