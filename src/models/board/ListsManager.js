/*
 * User Manager class
 */
import AppUtil from '../../lib/util';
import Constants from '../constants';

// wrapper class for all user related db functions
export default class ListsManager {
  constructor(realm) {
    this._realm = realm;
  }

  get list() {
    return this._realm.objects(Constants.Lists);
  }

    // find card by id
  findById(lid) {
    const res = this.list.filtered(`_id = "${lid}"`);
    return (res && res.length > 0) ? res['0'] : null;
  }


  findByBoardIdAsList(bid) {
    const res = this.list.filtered(`boardId = "${bid}"`);
    return (res && res.length > 0) ? res : null;
  }

  addAll(listsList) {
    if (!listsList || Object.keys(listsList).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: addAll`);
    this._realm.write(() => {
      Object.keys(listsList).forEach((k) => {
        var obj = listsList[k];
        obj = AppUtil.removeEmptyValues(obj);
        if (obj._id) {
          const objToStore = {
            _id: obj._id,
            title: obj.title,
            boardId: obj.boardId,
            createdAt: obj.createdAt,
          };
          AppUtil.debug(objToStore, null);
          this._realm.create(Constants.Lists, objToStore, true);
        }
      });
    });
  }


}
