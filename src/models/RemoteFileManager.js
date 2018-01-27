/*
 * remotefile related methods
 */
import AppUtil from '../lib/util';
import Constants from './constants';

export default class RemoteFileManager {
  constructor(realm) {
    this._realm = realm;
  }

  get list() {
    return this._realm.objects(Constants.RemoteFile);
  }

  get cacheList() {
    const rfList = this.list;
    const _cache = {};
    if (!rfList || Object.keys(rfList).length <= 0) return _cache;
    AppUtil.debug(null, `${Constants.MODULE}: cacheList`);
    Object.keys(rfList).forEach((k) => {
      var obj = rfList[k];
      _cache[obj.fileId] = obj.url;
    });
    return _cache;
  }

  findById(fid) {
    const res = this.list.filtered(`fileId = "${fid}"`);
    return (res && res.length > 0) ? res['0'].value : null;
  }

  addAll(rfList) {
    if (!rfList || Object.keys(rfList).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: addAll`);
    this._realm.write(() => {
      Object.keys(rfList).forEach((k) => {
        var obj = rfList[k];
        let objToStore = { fileId: k, url: obj || '' };
        objToStore = AppUtil.removeEmptyValues(objToStore);
        AppUtil.debug(objToStore, null);
        this._realm.create(Constants.RemoteFile, objToStore, true);
      });
    });
  }

  // delete all remotefile items
  deleteAll() {
    const settingsList = this.list;
    if (!settingsList || Object.keys(settingsList).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: deleteAll`);
    this._realm.write(() => {
      this._realm.delete(settingsList);
    });
  }

}
