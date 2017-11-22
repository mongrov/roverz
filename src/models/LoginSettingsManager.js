/*
 * app related data structures
 */
import { AppUtil } from 'roverz-chat';

import Constants from './constants';

// roverz master/global holder

export default class LoginSettingsManager {
  constructor(realm) {
    this._realm = realm;
  }

  get list() {
    return this._realm.objects(Constants.LoginSettings);
  }

  findByKey(key) {
    const res = this.list.filtered(`key = "${key}"`);
    let value = (res && res.length > 0) ? res['0'].value : null;
    console.log('ezhil ', key, value);
    if (value) {
      value = JSON.parse(value);
    }
    return value;
  }

  addAll(settings) {
    if (!settings || Object.keys(settings).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: addAll`);
    this._realm.write(() => {
      Object.keys(settings).forEach((k) => {
        var obj = settings[k];
        Object.keys(obj).forEach((j) => {
          var objdata = obj[j];
          let objToStore = { key: j, value: JSON.stringify(objdata) };
          objToStore = AppUtil.removeEmptyValues(objToStore);
          AppUtil.debug(objToStore, null);
          this._realm.create(Constants.LoginSettings, objToStore, true);
        });
      });
    });
  }

  // delete all settings
  deleteAll() {
    const settingsList = this.list;
    if (!settingsList || Object.keys(settingsList).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: deleteAll`);
    this._realm.write(() => {
      this._realm.deleteAll();
    });
  }
}
