/*
 * User Manager class
 */
import AppUtil from '../../lib/util';
import Constants from '../constants';

// wrapper class for all user related db functions
export default class CardCommentsManager {
  constructor(realm) {
    this._realm = realm;
  }

  get list() {
    return this._realm.objects(Constants.CardComments);
  }

  findByBoardIdAsList(cid) {
    const res = this.list.filtered(`cardId = "${cid}"`);
    return (res && res.length > 0) ? res : null;
  }

  addAll(commentList) {
    if (!commentList || Object.keys(commentList).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: addAll`);
    this._realm.write(() => {
      Object.keys(commentList).forEach((k) => {
        var obj = commentList[k];
        obj = AppUtil.removeEmptyValues(obj);
        if (obj._id) {
          const objToStore = {
            _id: obj._id,
            text: obj.text,
            userId: obj.userId,
            boardId: obj.boardId,
            cardId: obj.cardId,
            createdAt: obj.createdAt,
          };
          AppUtil.debug(objToStore, null);
          this._realm.create(Constants.CardComments, objToStore, true);
        }
      });
    });
  }


}
