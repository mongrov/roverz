import Realm from 'realm';
import md5 from 'react-native-md5';
import {
  AsyncStorage,
} from 'react-native';
import emoji from 'node-emoji';
import AppUtil from '../lib/util';
import Application from '../constants/config';

// local package refs
import SchemaV1 from './schema';
import Constants from './constants';
import AppManager from './AppManager';
import GroupManager from './GroupManager';
import UserManager from './UserManager';
import RemoteFileManager from './RemoteFileManager';
import CardManager from './board/CardManager';

/*
* Todos
*  - need to use realm to handle user and server
*  - use realm authentication?
*  - encryption of data saved to disk
*/

class Database {
  constructor() {
    if (!Database._servers) {
      // for now load the servers here, it should be moved to appropriate place later
      this._loadServers();
    }
  }

  get realm() {
    return Database._realm;
  }
  // refer to AppManager for methods that can be accessed
  get app() {
    return Database._app;
  }
  // refer to GroupManager for methods that can be accessed
  get groups() {
    return Database._gm;
  }
  // refer to UserManager for methods that can be accessed
  get users() {
    return Database._um;
  }
  // refer to RemoteFileManager for methods that can be accessed
  get remotefiles() {
    return Database._rf;
  }

  // refer to cards for methods that can be accessed
  get cards() {
    return Database._card;
  }

  get userId() {
    return Database._userId;
  }

  // init variables
  initManagers(realm) {
    Database._app = new AppManager(realm);
    Database._gm = new GroupManager(realm);
    Database._um = new UserManager(realm);
    Database._rf = new RemoteFileManager(realm);
    Database._card = new CardManager(realm);
  }

  // switch realm database
  switchDb(server, user) {
    AppUtil.debug(`***** switching to db ****${server}:${user}`, Constants.MODULE);
    const path = md5.hex_md5(`${server}:${user}`);
    this.loadDb(path);
  }

  // load realm database
  loadDb(path) {
    AppUtil.debug(`realm set to: ${path}`, Constants.MODULE);
    if (this.realm) {
      // check if already loaded realm is same
      if (path === Database._dbPath) return;
      this.realm.close();
    }
    AppUtil.debug(`loading realm: ${path}`, Constants.MODULE);
    const db = SchemaV1;
    db.path = path;
    Database._realm = new Realm(SchemaV1);
    this.initManagers(this.realm);
    this.setDBPath(path);
  }

  // WARNING!!! dangerous method, call only if you are sure about it
  reset() {
    this.realm.write(() => {
      this.realm.deleteAll();
    });
  }

  // TODO
  _loadServers = async () => {
    // @release: load url name for enterprise editions
    Database._servers = [];
    Database._dbPath = null;
    Database._realm = null;
    try {
      let res = await AsyncStorage.getItem(Constants.Servers);
      if (res !== null) {
        // We have data!!
        AppUtil.debug(`realm path set to: ${res}`, Constants.MODULE);
        Database._servers = JSON.parse(res);
      }
      // lets load the last used db as well
      res = await AsyncStorage.getItem(Constants.LastDBUsed);
      if (res !== null) {
        // We have data!!
        AppUtil.debug(`Last loaded database: ${res}`, Constants.LastDBUsed);
        Database._dbPath = res;
        this.loadDb(Database._dbPath);
      }
      // lets load the user id as well in one shot
      res = await AsyncStorage.getItem(Constants.LastUserId);
      if (res !== null) {
        // We have data!!
        AppUtil.debug(`Last used userId: ${res}`, Constants.LastUserId);
        Database._userId = res;
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  // get server and username/password - if present
  getServer() {
    if (Database._servers.length <= 0) {
      return Application.bootstrapUrl === null ? undefined : Application.bootstrapUrl;
    }
    return Database._servers[0];
  }

  // save server name
  setServer = async (serverName) => {
    const server = serverName.trim().toLowerCase();
    Application.resetInstance(server);
    Database._servers = [server];
    try {
      await AsyncStorage.setItem(Constants.Servers, JSON.stringify(Database._servers));
    } catch (error) {
      // Error saving data
    }
  }

  _persistKeyValue = async (key, value) => {
    // save the k,v to async storage
    try {
      if (value) {
        await AsyncStorage.setItem(key, value);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      // Error saving data
    }
  }

  // save userId
  setUserId = (userId) => {
    this._persistKeyValue(Constants.LastUserId, userId);
  }

  // save db path
  setDBPath = (path) => {
    this._persistKeyValue(Constants.LastDBUsed, path);
    Database._dbPath = path;
  }

  // some helpers for adding messages to a group, pass an object of {id: {message obj}}
  // @todo: need to convert filtered to a efficient way, as it might not be  best performant
  /* eslint no-param-reassign: ["error", { "props": false }] */
  addMessages(group, messages) {
    if (!group || !messages || Object.keys(messages).length <= 0) return;
    const missingMessages = group.findMissingMessages(messages);
    if (Object.keys(missingMessages).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: addMessages to [Group:${group.name}]`);
    // write messages
    this.realm.write(() => {
      Object.keys(missingMessages).forEach((k) => {
        const obj = missingMessages[k];
        const existingMsg = group.findMessageById(obj._id);
        if (existingMsg) {
          existingMsg.text = missingMessages[k].text || '';
          existingMsg.likes = missingMessages[k].likes || 0;
          if (existingMsg.text) {
            // convert any emojis in the text
            existingMsg.text = emoji.emojify(existingMsg.text);
            existingMsg.isReply = existingMsg.text.includes('?msg=');
            if (existingMsg.isReply) {
              let res = existingMsg.text.split('?msg=');
              res = res[res.length - 1].split(')');
              const replyMsgId = res[0];
              existingMsg.replyMessageId = replyMsgId;
              if (res[1]) {
                existingMsg.text = res[1].trim();
              }
            }
          }
        } else {
          obj.user = this.users._findOrCreate(obj.user._id, obj.user.username, obj.user.name);
          obj.likes = messages[k].likes;
          if (messages[k].likes) {
            obj.likes = messages[k].likes;
          } else {
            obj.likes = 0;
          }
          if (obj.text) {
          // convert any emojis in the text
            obj.text = emoji.emojify(obj.text);
            obj.isReply = obj.text.includes('?msg=');
            if (obj.isReply) {
              let res = obj.text.split('?msg=');
              res = res[res.length - 1].split(')');
              const replyMsgId = res[0];
              obj.replyMessageId = replyMsgId;
              if (res[1]) {
                obj.text = res[1].trim();
              }
            }
          }
          if (obj.location) {
            obj.location = obj.text;
            obj.text = '';
            obj.type = Constants.M_TYPE_LOCATION;
          }
          AppUtil.debug(obj, null);
          obj.original = JSON.stringify(obj.original);
          group.messages.push(obj);
        }
      });
      const lastMessage = group.lastMessage;
      if (lastMessage) {
        group.lastMessageAt = lastMessage.createdAt;
      }
    });
  }

  // called only if messages have editedAt field
  updateMessages(inGroup, messages) {
    if (!inGroup || !messages || Object.keys(messages).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: updateMessages to [Group:${inGroup.name}]`);
    this.realm.write(() => {
      Object.keys(messages).forEach((k) => {
        const obj = inGroup.findMessageById(messages[k]._id);
        if (!obj) { // new message with like/edit
          const msg = messages[k];
          msg.user = this.users._findOrCreate(msg.user._id, msg.user.username, msg.user.name);
          msg.likes = messages[k].likes;
          if (messages[k].likes) {
            msg.likes = messages[k].likes;
          } else {
            msg.likes = 0;
          }
          if (msg.text) {
          // convert any emojis in the text
            msg.text = emoji.emojify(msg.text);
            msg.isReply = msg.text.includes('?msg=');
            if (msg.isReply) {
              let res = msg.text.split('?msg=');
              res = res[res.length - 1].split(')');
              const replyMsgId = res[0];
              msg.replyMessageId = replyMsgId;
              if (res[1]) {
                msg.text = res[1].trim();
              }
            }
          }
          if (msg.location) {
            msg.location = msg.text;
            msg.text = '';
            msg.type = Constants.M_TYPE_LOCATION;
          }
          AppUtil.debug(msg, null);
          msg.original = JSON.stringify(msg.original);
          inGroup.messages.push(msg);
        } else {
          if (obj) {
            obj.text = messages[k].text || '';
            obj.likes = messages[k].likes || 0;
          }
          if (obj && obj.text) {
            // convert any emojis in the text
            obj.text = emoji.emojify(obj.text);
            obj.isReply = obj.text.includes('?msg=');
            if (obj.isReply) {
              let res = obj.text.split('?msg=');
              res = res[res.length - 1].split(')');
              const replyMsgId = res[0];
              obj.replyMessageId = replyMsgId;
              if (res[1]) {
                obj.text = res[1].trim();
              }
            }
          }
        }
        AppUtil.debug(obj, null);
      });
      const lastMessage = inGroup.lastMessage;
      if (lastMessage) {
        inGroup.lastMessageAt = lastMessage.createdAt;
      }
    });
  }

  deleteMessage(groupId, msgId) {
    // AppUtil.debug(null, `${Constants.MODULE}: deleteMessage [Group:${groupId},message:${msgId}]`);
    this.groups.deleteMessage(groupId, msgId);
  }

}

export default Database;
