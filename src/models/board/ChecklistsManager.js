/*
 * User Manager class
 */
import AppUtil from '../../lib/util';
import Constants from '../constants';

// wrapper class for all user related db functions
export default class ChecklistsManager {
  constructor(realm) {
    this._realm = realm;
  }

  get list() {
    return this._realm.objects(Constants.Checklists);
  }

  findByBoardIdAsList(cid) {
    const res = this.list.filtered(`cardId = "${cid}"`);
    return (res && res.length > 0) ? res : null;
  }

  addAll(checkList) {
    if (!checkList || Object.keys(checkList).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: addAll`);
    this._realm.write(() => {
      Object.keys(checkList).forEach((k) => {
        var obj = checkList[k];
        obj = AppUtil.removeEmptyValues(obj);
        if (obj._id) {
          const objToStore = {
            _id: obj._id,
            title: obj.title,
            userId: obj.userId,
            sort: obj.sort,
            cardId: obj.cardId,
            createdAt: obj.createdAt,
          };
          AppUtil.debug(objToStore, null);
          this._realm.create(Constants.Checklists, objToStore, true);
        }
      });
    });
  }


}
