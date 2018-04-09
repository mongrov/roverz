import Meteor from 'react-native-meteor';
import { Actions } from 'react-native-router-flux';
import md5 from 'react-native-md5';
import moment from 'moment';

import AppUtil from '../lib/util';
import Application from '../constants/config';
import NetworkUtil from './util';
import DBConstants from '../models/constants';

const PushNotification = require('react-native-push-notification');

class ChatService {

  init(meteor, db, service) {
    this.meteor = meteor;
    this.db = db;
    this._cache = db.remotefiles ? db.remotefiles.cacheList : {};
    Application.setUserId(db.userId);

    // set service object
    this._service = service;
    this._rc = this._service.provider;
  }

  resetDbHandle(newDb) {
    this.db = newDb;
    // this._service.db = this.db;
    this._cache = newDb.remotefiles.cacheList;
  }

  get service() {
    return this._service;
  }
  get rc() {
    return this._rc;
  }

  // profile view: fullUserData
  // https://instance/avatar/kumar

  setUserPassword(newPwd, callBack) {
    this.meteor.call('setUserPassword', newPwd, (err) => {
      if (err) {
        callBack(err);
      }
    });
  }

  // use like searchUserOrRoom('e');
  searchUserOrRoom(searchKey, callBack) {
    var searchConf = { users: true, rooms: true };
    this.meteor.call('spotlight', searchKey, null, searchConf, (err, res) => {
      if (res) {
        const currUser = this.service.loggedInUserObj;
        if (currUser) {
          const dataUsers = res.users;
          const dataRooms = res.rooms;
          let userKeyToRemove = NetworkUtil.findUserKeyInArray(dataUsers, currUser._id);
          if (userKeyToRemove) {
            res.users.splice(userKeyToRemove, 1);
          }
          if (Application.filterRooms) {
            Object.keys(Application.filterRooms).forEach((k) => {
              const filterRoom = Application.filterRooms[k];
              userKeyToRemove = NetworkUtil.findRoomKeyInArray(dataRooms, filterRoom);
              if (userKeyToRemove) {
                res.rooms.splice(userKeyToRemove, 1);
              }
            });
          }
          callBack(res, 'SUCCESS');
        } else {
          callBack(res, 'FAILURE');
        }
      } else {
        callBack(err, 'FAILURE');
      }
    });
  }

  loginWithSaml(credential) {
    const _super = this;
    setTimeout(() => {
      const loginParams = { saml: true, credentialToken: credential };
      _super.meteor.call('login', loginParams, (err, res) => {
        // console.log('****** login with saml ****');
        // console.log(err);
        // console.log(res);
        if (!err) {
          // lets call login / resume and see if we get the user id
          Meteor._loginWithToken(res.token);
          Application.setUserId(res.id);
          setTimeout(() => {
            // console.log(Meteor.user());
            // console.log(Meteor.userId());
            Actions.app({ type: 'reset' });
          }, 100);
        }
      });
    }, 2000);
  }

  // getUsersOfRoom, groupId, true (show all)
  // getUsersOfRoom, groupId, false (show online)
  getMembersList(groupId, callBack, onlineUserList) {
    const _super = this;
    const offline = !!onlineUserList;
    this.meteor.call('getUsersOfRoom', groupId, offline, (err, res) => {
      if (res && res.records) {
        for (let i = 0; i < res.records.length; i += 1) {
          // need to have findorupdate with realm  in UM
          let updateStatus = true;
          if (onlineUserList) {
            for (let j = 0; j < onlineUserList.length; j += 1) {
              if (onlineUserList[j]._id === res.records[i]._id) {
                updateStatus = false;
                break;
              }
            }
          }
          if (updateStatus) {
            _super.db.users.updateStatus(
              res.records[i]._id, res.records[i].username, res.records[i].name, offline ? 'offline' : 'online');
          }
        }
        callBack(res, 'SUCCESS');
      } else {
        callBack(err, 'FAILURE');
      }
    });
  }

  searchRoom(roomId, searchText, resultSize, callBack) {
    this.meteor.call('messageSearch', searchText, roomId, resultSize, (err, res) => {
      if (res && res.messages) {
        // duplicate code need to have in a single method and reuse
        const yaps = {};
        for (let i = 0; i < res.messages.length; i += 1) {
          const inM = res.messages[i];
          const m = this.yap2message(inM._id, inM.rid, inM.msg, inM.ts, inM.u._id, inM.u.username, inM.u.name);
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
          yaps[m._id] = m;
        }
        callBack(yaps, 'SUCCESS');
      } else {
        callBack(err, 'FAILURE');
      }
    });
  }

  // fetch old 'n' messages from a given groupId
  fetchOldMessages(group, n) {
    const _super = this;
    var msgList = group.sortedMessages;
    if (msgList.length > 0) {
      const req1 = this.meteor.call('loadHistory', group._id, msgList[msgList.length - 1].createdAt, n, null);
      Promise.all([req1]).then((results) => {
        // // console.log('Then: ', results);
        // results[0] is from 'loadHistory'
        const msgs = results[0].messages;
        _super.yaps2db(group, msgs);
        if (msgs.length < n) {
          _super.db.groups.updateNoMoreMessages(group);
        }
      }).catch((/* err */) => {
        // console.log('Catch: ', err);
      });
    }
  }

  // ----- [private] methods -------

  // fix s3Url
  // pass array of fileIds []
  fixS3Urls(fileIds, callBack, loadNotFromCache) {
    const imageReqs = [];
    var res = [];
    const lookups = {};
    AppUtil.debug(new Date().toLocaleString(), '[Performance] fixS3Urls');
    for (let i = 0; i < fileIds.length; i += 1) {
      const tmpId = fileIds[i];
      const tmp = { fileId: tmpId, url: '' };
      if (loadNotFromCache || !Object.prototype.hasOwnProperty.call(this._cache, tmpId)) {
        const imgReq = new Promise((resolve, reject) => {
          Meteor.call('getS3FileUrl', tmpId, (err, resp) => {
            // @todo: we need to handle deleted message, so for now we are not rejecting promising
            if (err) { // reject(err);
              resolve('');
            }
            resolve(resp);
            // nothing, this would never be called
            reject(resp);
          });
        });
        imageReqs.push(imgReq);
        lookups[imageReqs.length - 1] = i;
      } else {
        tmp.url = this._cache[tmpId];
      }
      res.push(tmp);
    }
    // // console.log(res);
    if (imageReqs.length > 0) {
      // fetch all image urls
      Promise.all(imageReqs).then((results) => {
        // results is an array of [{url:result}, {url:result} ...]
        for (let i = 0; i < results.length; i += 1) {
          const tmp = res[lookups[i]];
          tmp.url = results[i];
          if (!loadNotFromCache) {
            this._cache[tmp.fileId] = tmp.url;
          }
          res[lookups[i]] = tmp;
          // AppUtil.debug(lookups[i]);
          // AppUtil.debug(tmp);
        }
        AppUtil.debug(new Date().toLocaleString(), '[Performance] fixS3Urls - remote lookups');
        AppUtil.debug(res);
        this.db.remotefiles.addAll(this._cache);
        callBack(res);
      }).catch((/* err */) => {
        // console.log('Catch: ', err);
        // need to see if any error we bail out or just leave the failed one
      });
    } else {
      AppUtil.debug(new Date().toLocaleString(), '[Performance] fixS3Urls - NO remote lookups');
      AppUtil.debug(res);
      callBack(res);
    }
  }

  // fix image urls
  fixYapImageUrls(messages, callBack) {
    // process attachments if any
    const imageReqs = [];
    const videoReqs = [];
    const lookups = {};
    const vlookups = {};
    const urlMessages = messages;
    for (let i = 0; i < urlMessages.length; i += 1) {
      const m = urlMessages[i];
      const tmp = Object.assign({}, m);
      const orig = JSON.parse(tmp.original);
      if (orig.attachments && orig.attachments[0] && orig.attachments[0].video_url) {
        tmp.video = orig.attachments[0].video_url;
        // dirty fix
//        tmp.image = tmp.video;
        tmp.remoteFile = orig.file._id;
      }
      tmp.user.avatar = `${Application.urls.SERVER_URL}/avatar/${tmp.user.username}?_dc=undefined`;
      urlMessages[i] = tmp;
      if (tmp.remoteFile) {
        if (!tmp.video) {
          imageReqs.push(tmp.remoteFile);  // just save the fileid
          lookups[imageReqs.length - 1] = i;
        } else {
          videoReqs.push(tmp.remoteFile);  // just save the fileid
          vlookups[videoReqs.length - 1] = i;
        }
      }
    }
    if (videoReqs.length > 0) {
      this.fixS3Urls(videoReqs, (results) => {
        // AppUtil.debug(results, 'fixYapImageUrls - result');
        for (let i = 0; i < results.length; i += 1) {
          const tmp = urlMessages[vlookups[i]];
          tmp.image = null;
          tmp.remoteFile = null;
          tmp.video = results[i].url;
          urlMessages[vlookups[i]] = tmp;
        }
        if (imageReqs.length > 0) {
          // fetch all image urls
          this.fixS3Urls(imageReqs, (imgresults) => {
            // AppUtil.debug(results, 'fixYapImageUrls - result');
            for (let i = 0; i < imgresults.length; i += 1) {
              const tmp = urlMessages[lookups[i]];
              tmp.image = imgresults[i].url;
              urlMessages[lookups[i]] = tmp;
            }
            callBack(urlMessages);
          }, false);
        } else {
          callBack(urlMessages);
        }
      }, true);
    } else if (imageReqs.length > 0) {
      // fetch all image urls
      this.fixS3Urls(imageReqs, (results) => {
        // AppUtil.debug(results, 'fixYapImageUrls - result');
        for (let i = 0; i < results.length; i += 1) {
          const tmp = urlMessages[lookups[i]];
          tmp.image = results[i].url;
          urlMessages[lookups[i]] = tmp;
        }
        callBack(urlMessages);
      }, false);
    } else {
      callBack(urlMessages);
    }
  }

  // convert yap message to internal message
  yap2message(id, rid, text, createdAt, userId, userUserName, userName) {
    return { _id: id, rid, text, createdAt, user: { _id: userId, username: userUserName, name: userName } };
  }

  // yap messages from server
  yaps2db(group, msgs) {
    if (!msgs || !group || msgs.length === 0) return;
    const yaps = {};
    const editedYaps = {};
    const currUser = this.service.loggedInUserObj;
    for (let i = 0; i < msgs.length; i += 1) {
      const inM = msgs[i];
      console.log('Ezhil chatservice message ', inM);
      let msgText = inM.msg;
      if (inM.t && inM.t === 'mgcall_init') {
        msgText = 'Started a Call!';
        if (!(inM.u._id === currUser._id) && (group.findMessageById(inM._id) === null)) {
          if (group && group.type === 'direct') {
            msgText = 'Started a Call!';
            this.incomingVC(currUser, inM.ts, inM.rid, group);
          } else {
            const msgTs = moment(inM.ts);
            const currentTsDiff = moment().diff(msgTs, 'minutes');
            if (currentTsDiff < 1) {
              PushNotification.localNotificationSchedule({
                message: `Video Call started in ${group.name}`, // (required)
                playSound: true,
                soundName: 'vcring.mp3',
                date: new Date(Date.now()), // in 60 secs
              });
            }
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
      m.status = DBConstants.M_DELIVERED;
      if (inM.location) {
        m.location = inM.location;
      }
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
    this.db.addMessages(group, yaps);
    this.db.updateMessages(group, editedYaps);
  }

  incomingVC(currUser, ts, gid, group) {
    if (group && group.type === 'direct') {
      const msgTs = moment(ts);
      const currentTsDiff = moment().diff(msgTs, 'minutes');
      if (currentTsDiff < 1) {
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

}

export default ChatService;
