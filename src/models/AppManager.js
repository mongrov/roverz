/*
 * App Manager
 */
import Constants from './constants';

// app master/global holder
export default class AppManager {
  constructor(realm) {
    this._realm = realm;
  }
  get state() {
    var res = this._realm.objects(Constants.App).filtered('_id = 0');
    return (res && res.length > 0) ? res['0'] : null;
  }

  setLastSync(lastSyncTime) {
    var obj = this.state || { _id: 0, lastSync: null };
    this._realm.write(() => {
      obj.lastSync = lastSyncTime || new Date();
      this._realm.create(Constants.App, obj, true);
    });
  }

  setServerConnectionStatus(isConnected) {
    var obj = this.state || { _id: 0, isServerConnected: false };
    this._realm.write(() => {
      obj.isServerConnected = isConnected || false;
      this._realm.create(Constants.App, obj, true);
    });
  }

  get isServerConnected() {
    const res = this.state;
    return res ? res.isServerConnected : false;
  }
}
