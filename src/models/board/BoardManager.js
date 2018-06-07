/*
 * User Manager class
 */
import AppUtil from '../../lib/util';
import Constants from '../constants';

// wrapper class for all user related db functions
export default class BoardManager {
  constructor(realm) {
    this._realm = realm;
  }

  get list() {
    return this._realm.objects(Constants.Board);
  }

    // find card by id
  findByName(boardName) {
    const res = this.list.filtered(`title = "${boardName}"`);
    return (res && res.length > 0) ? res['0'] : null;
  }

  addBoard(boardObj) {
    if (!boardObj || !boardObj._id) return;
    AppUtil.debug(null, `${Constants.MODULE}: addBoard`);
    this._realm.write(() => {
      const objToStore = {
        _id: boardObj._id,
        title: boardObj.title,
        archived: boardObj.archived,
        createdAt: boardObj.createdAt,
        stars: boardObj.stars,
      };
      AppUtil.debug(objToStore, null);
      this._realm.create(Constants.Board, objToStore, true);
    });
  }


}
