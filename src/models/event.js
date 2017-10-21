/*
 * Message data structure
 */
import Constants from './constants';

const EventSchema = {
  name: Constants.Event,
  primaryKey: '_id',
  properties: {
    _id: 'string',
    eventName: { type: 'string', optional: true }, // TODO mandatory
    eventDesc: { type: 'string', optional: true },
    startAt: { type: 'date', optional: true },
    endAt: { type: 'date', optional: true },
  },
};
export default class Event {
}
Event.schema = EventSchema;
