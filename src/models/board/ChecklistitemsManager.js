/*
 * User Manager class
 */
import AppUtil from '../../lib/util';
import Constants from '../constants';

// wrapper class for all user related db functions
export default class ChecklistitemsManager {
  constructor(realm) {
    this._realm = realm;
  }

  get list() {
    return this._realm.objects(Constants.Checklistitems);
  }

  findByBoardIdAsList(cid) {
    const res = this.list.filtered(`cardId = "${cid}"`);
    return (res && res.length > 0) ? res : null;
  }

  addAll(checkListitems) {
    if (!checkListitems || Object.keys(checkListitems).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: addAll`);
    this._realm.write(() => {
      Object.keys(checkListitems).forEach((k) => {
        var obj = checkListitems[k];
        obj = AppUtil.removeEmptyValues(obj);
        if (obj._id) {
          const objToStore = {
            _id: obj._id,
            title: obj.title,
            userId: obj.userId ? obj.userId : 'unknown',
            sort: obj.sort,
            cardId: obj.cardId,
            checklistId: obj.checklistId,
            isFinished: obj.isFinished,
          };
          AppUtil.debug(objToStore, null);
          this._realm.create(Constants.Checklistitems, objToStore, true);
        }
      });
    });
  }


}
