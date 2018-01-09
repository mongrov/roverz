/*
 * App Manager class
 */
import AppUtil from '../lib/util';

// import App from './App';
import Constants from './constants';

// app master/global holder
export default class AppManager {
  constructor(realm) {
    this._realm = realm;
  }
  get list() {
    return this._realm.objects(Constants.App);
  }

  setLastSync() {
    var res = this._realm.objects(Constants.App).filtered('_id = 0');
    if (res && res.length > 0) {
      const obj = res['0'];
      this._realm.write(() => {
        obj.lastSync = new Date();
        this._realm.create(Constants.App, obj, true);
      });
    } else {
      this._realm.write(() => {
        const obj = { _id: 0, lastSync: new Date() };
        AppUtil.debug(obj, `${Constants.MODULE}: saving app state`);
        this._realm.create(Constants.App, obj, true);
      });
    }
    // this._realm.write(() => {
    //   var obj = { _id: 0, lastSync: new Date() };
    //   AppUtil.debug(obj, `${Constants.MODULE}: saving App State`);
    //   this._realm.create(Constants.App, obj, true);
    // });
  }
  get state() {
    var res = this._realm.objects(Constants.App).filtered('_id = 0');
    return (res && res.length > 0) ? res['0'] : null;
  }

  setServerConnectionStatus(isConnected) {
    var res = this._realm.objects(Constants.App).filtered('_id = 0');
    if (res && res.length > 0) {
      const obj = res['0'];
      this._realm.write(() => {
        obj.isServerConnected = isConnected;
        this._realm.create(Constants.App, obj, true);
      });
    } else {
      this._realm.write(() => {
        const obj = { _id: 0, isServerConnected: isConnected };
        AppUtil.debug(obj, `${Constants.MODULE}: saving setServerConnectionStatus`);
        this._realm.create(Constants.App, obj, true);
      });
    }
  }

  get isServerConnected() {
    var res = this._realm.objects(Constants.App).filtered('_id = 0');
    return (res && res.length > 0) ? res['0'].isServerConnected : false;
  }
}
