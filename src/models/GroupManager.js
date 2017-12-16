/*
 * Group Manager class
 */
import AppUtil from '../lib/util';

import Constants from './constants';

// wrapper class for all groups related db functions
export default class GroupManager {
  constructor(realm) {
    this._realm = realm;
  }

  get list() {
    return this._realm.objects(Constants.Group);
  }
  // ----- simple filters ----
  get sortedList() {
    return this.list.sorted(Constants.LAST_MESSAGE_AT, true);
  }
  get privateList() {
    return this.list.filtered(`type="${Constants.G_PRIVATE}"`);
  }
  get publicList() {
    return this.list.filtered(`type="${Constants.G_PUBLIC}"`);
  }
  get directList() {
    return this.list.filtered(`type="${Constants.G_DIRECT}"`);
  }
  findById(gid) {
    const res = this.list.filtered(`_id = "${gid}"`);
    return (res && res.length > 0) ? res['0'] : null;
  }
  // case insensitve find (returns only first)
  findByName(gname) {
    const res = this.list.filtered(`name =[c] "${gname}"`);
    return (res && res.length > 0) ? res['0'] : null;
  }

  // case insensitve find (returns only first)
  search(gname) {
    const res = this.list.filtered(`name CONTAINS[c] "${gname}"`);
    return res;
  }

  // ----- mutation helpers ----

  // add all groups passed {id: {group obj}, id2: {group}}
  addAll(groups) {
    if (!groups || Object.keys(groups).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: addAll`);
    this._realm.write(() => {
      Object.keys(groups).forEach((k) => {
        let obj = groups[k];
        if (obj && obj._id) {
          let typ = Constants.G_PRIVATE;
          if (obj.type) {
            switch (obj.type) {
              case 'd': typ = Constants.G_DIRECT; break;
              case 'c': typ = Constants.G_PUBLIC; break;
              default: typ = Constants.G_PRIVATE; break;
            }
          }
          obj.type = typ;
          const existingGroup = this.findById(obj._id);
          if (existingGroup) {
            obj.lastMessageAt = existingGroup.lastMessageAt;
          }
          obj = AppUtil.removeEmptyValues(obj);
          AppUtil.debug(obj, null);
          this._realm.create(Constants.Group, obj, true);
        }
      });
    });
  }

  // delete all groups passed {id: {group obj}, id2: {group}}
  deleteGroups(groups) {
    if (!groups || Object.keys(groups).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: deleteGroups`);
    this._realm.write(() => {
      Object.keys(groups).forEach((k) => {
        var obj = groups[k];
        const existingGroup = this.findById(obj._id);
        if (existingGroup) {
          AppUtil.debug(obj, null);
          this._realm.delete(existingGroup);
        }
      });
    });
  }

  updateNoMoreMessages(group) {
    if (group) {
      const groupToChange = group;
      this._realm.write(() => {
        groupToChange.moreMessages = false;
      });
    }
  }

}
