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
  setLastSync() {
    this._realm.write(() => {
      var obj = { _id: 0, lastSync: new Date() };
      AppUtil.debug(obj, `${Constants.MODULE}: saving App State`);
      this._realm.create(Constants.App, obj, true);
    });
  }
  get state() {
    var res = this._realm.objects(Constants.App).filtered('_id = 0');
    return (res && res.length > 0) ? res['0'] : null;
  }
}
