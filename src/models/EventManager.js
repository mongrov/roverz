/*
 * Event Manager class
 */
import { AppUtil } from 'roverz-chat';

import Constants from './constants';

// wrapper class for all event related db functions
export default class EventManager {
  constructor(realm) {
    this._realm = realm;
  }

  get list() {
    return this._realm.objects(Constants.Event);
  }

  findById(eid) {
    const res = this.list.filtered(`_id = "${eid}"`);
    return (res && res.length > 0) ? res['0'] : null;
  }

  // ----- mutation helpers ----

  // add all events passed
  addAll(events) {
    if (!events || Object.keys(events).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: addAll`);
    this._realm.write(() => {
      Object.keys(events).forEach((k) => {
        var obj = events[k];
        obj = AppUtil.removeEmptyValues(obj);
        AppUtil.debug(obj, null);
        this._realm.create(Constants.Event, obj, true);
      });
    });
  }

  // delete all event passed
  deleteEvents(events) {
    if (!events || Object.keys(events).length <= 0) return;
    AppUtil.debug(null, `${Constants.MODULE}: deleteEvents`);
    this._realm.write(() => {
      Object.keys(events).forEach((k) => {
        var obj = events[k];
        const existingEvent = this.findById(obj._id);
        if (existingEvent) {
          AppUtil.debug(obj, null);
          this._realm.delete(existingEvent);
        }
      });
    });
  }


}
