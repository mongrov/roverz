/*
 * User Manager class
 */
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
          console.log('***** user status updated ****', usr.status, userData.status);
          usr.status = userData.status;
        }
        const activ = `${userData.active}`;
        if (userData.active && usr.active !== activ) {
          console.log('***** user active updated ****', usr.active, activ);
          usr.active = activ;
        }
        if (userData.statusConnection && usr.statusConnection !== userData.statusConnection) {
          console.log('***** user statusConnection updated ****', usr.statusConnection, userData.statusConnection);
          usr.statusConnection = userData.statusConnection;
        }
        const utc = `${userData.utcOffset}`;
        if (userData.utcOffset && usr.utcOffset !== utc) {
          console.log('***** user utcOffset updated ****', usr.utcOffset, utc);
          usr.utcOffset = utc;
        }
        if (userData.lastLogin && usr.lastLogin !== userData.lastLogin) {
          console.log('***** user lastLogin updated ****', usr.lastLogin, userData.lastLogin);
          usr.lastLogin = userData.lastLogin;
        }
        if (userData.createdAt && usr.createdAt !== userData.createdAt) {
          console.log('***** user createdAt updated ****', usr.createdAt, userData.createdAt);
          usr.createdAt = userData.createdAt;
        }
        const r = userData.roles && userData.roles.join(',');
        if (userData.roles && userData.roles.length > 0 && usr.roles !== r) {
          console.log('***** user roles updated ****', usr.roles, r);
          usr.roles = r;
        }
        const e = userData.emails && userData.emails.map(elem => elem.address).join(',');
        if (userData.emails && userData.emails.length > 0 && usr.emails !== e) {
          console.log('***** user emails updated ****', usr.emails, e);
          usr.emails = userData.emails.map(elem => elem.address).join(',');
        }
        if (userData.type && usr.type !== userData.type) {
          console.log('***** user type updated ****', usr.type, userData.type);
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
