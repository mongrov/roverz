/*
 * User Manager class
 */
import AppUtil from '../lib/util';
import Constants from './constants';

// wrapper class for all user related db functions
export default class UserManager {
  constructor(realm) {
    this._realm = realm;
  }

  get list() {
    return this._realm.objects(Constants.User);
  }

  get getOnlineUsers() {
    return this.list.filtered(`status="${Constants.U_ONLINE}"`);
  }

  // find user by id
  findById(uid) {
    const res = this.findByIdAsList(uid);
    return res ? res['0'] : null;
  }

  // find user by username
  findByUserName(uname) {
    const res = this.list.filtered(`username = "${uname}"`);
    return (res && res.length > 0) ? res['0'] : null;
  }

  // find user by id
  findByIdAsList(uid) {
    const res = this.list.filtered(`_id = "${uid}"`);
    return (res && res.length > 0) ? res : null;
  }

  // ----- mutation helpers ----

  // callers responsibility to enclose within write txn
  // any _ methods should not be used outside models
  _findOrCreate(uid, uname, name) {
    if (!uid) return null;
    let usr = this.findById(uid);
    if (usr) return usr;
    const tname = name || uname;
    usr = { _id: uid, username: uname, name: tname, status: Constants.U_OFFLINE };
    return this._realm.create(Constants.User, usr, true);
  }

  // TODO bulk status update
  updateStatus(uid, uname, name, ustatus) {
    if (!ustatus) return;
    this._realm.write(() => {
      const usr = this._findOrCreate(uid, uname, name);
      usr.status = ustatus;
    });
  }

  // pass array of userData
  updateFullUserData(usersData) {
    if (!usersData || usersData.length <= 0) return;
    this._realm.write(() => {
      usersData.forEach((userData) => {
        const usr = this._findOrCreate(userData._id, userData.username, userData.name);
        if (userData.status && usr.status !== userData.status) {
          AppUtil.debug(null, `${Constants.MODULE}:status[${usr.username},${usr.status},${userData.status}]`);
          usr.status = userData.status;
        }
        const activ = `${userData.active}`;
        if (userData.active && usr.active !== activ) {
          AppUtil.debug(null, `${Constants.MODULE}:active[${usr.username},${usr.active},${activ}]`);
          usr.active = activ;
        }
        if (userData.statusConnection && usr.statusConnection !== userData.statusConnection) {
          const usc = userData.statusConnection;
          AppUtil.debug(null, `${Constants.MODULE}:statusConnection[${usr.username},${usr.statusConnection},${usc}]`);
          usr.statusConnection = usc;
        }
        const utc = `${userData.utcOffset}`;
        if (userData.utcOffset && usr.utcOffset !== utc) {
          AppUtil.debug(null, `${Constants.MODULE}:utcOffset[${usr.username},${usr.utcOffset},${utc}]`);
          usr.utcOffset = utc;
        }
        if (userData.lastLogin && usr.lastLogin !== userData.lastLogin) {
          AppUtil.debug(null, `${Constants.MODULE}:lastLogin[${usr.username},${usr.lastLogin},${userData.lastLogin}]`);
          usr.lastLogin = userData.lastLogin;
        }
        if (userData.createdAt && usr.createdAt !== userData.createdAt) {
          AppUtil.debug(null, `${Constants.MODULE}:createdAt[${usr.username},${usr.createdAt},${userData.createdAt}]`);
          usr.createdAt = userData.createdAt;
        }
        const r = userData.roles && userData.roles.join(',');
        if (userData.roles && userData.roles.length > 0 && usr.roles !== r) {
          AppUtil.debug(null, `${Constants.MODULE}:roles[${usr.username},${usr.roles},${r}]`);
          usr.roles = r;
        }
        const e = userData.emails && userData.emails.map(elem => elem.address).join(',');
        if (userData.emails && userData.emails.length > 0 && usr.emails !== e) {
          AppUtil.debug(null, `${Constants.MODULE}:emails[${usr.username},${usr.emails},${e}]`);
          usr.emails = userData.emails.map(elem => elem.address).join(',');
        }
        if (userData.type && usr.type !== userData.type) {
          AppUtil.debug(null, `${Constants.MODULE}:type[${usr.username},${usr.type},${userData.type}]`);
          usr.type = userData.type;
        }
      });
    });
  }

  getStatus(uid) {
    const usr = this.findById(uid);
    return usr ? usr.status : usr;
  }

}
