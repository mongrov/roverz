/*
 * User model/schema file
 */
import Application from '../constants/config';
import Constants from './constants';

const UserSchema = {
  name: Constants.User,
  primaryKey: '_id',
  properties: {
    // -- identity
    _id: 'string',
    username: 'string',
    name: 'string',
    emails: { type: 'string', optional: true },

    // -- type & status
    type: { type: 'string', optional: true },
    active: { type: 'string', optional: true },
    status: { type: 'string', default: Constants.U_OFFLINE }, // ONLINE, OFFLINE, AWAY, BUSY
    statusConnection: { type: 'string', default: Constants.U_OFFLINE }, // ONLINE, OFFLINE, AWAY, BUSY
    utcOffset: { type: 'string', optional: true },
    roles: { type: 'string', optional: true },

    // -- meta data
    lastLogin: { type: 'date', optional: true },
    createdAt: { type: 'date', optional: true },
  },
};
export default class User {
  get avatar() {
    return `${Application.urls.SERVER_URL}/avatar/${this.username}?_dc=undefined`;
  }
}
User.schema = UserSchema;
