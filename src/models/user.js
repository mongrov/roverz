/*
 * User
 */
import Application from '../constants/config';
import Constants from './constants';

const UserSchema = {
  name: Constants.User,
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    username: 'string',
    status: { type: 'string', default: Constants.U_OFFLINE }, // ONLINE, OFFLINE, AWAY, BUSY
    active: { type: 'string', optional: true },
    statusConnection: { type: 'string', default: Constants.U_OFFLINE }, // ONLINE, OFFLINE, AWAY, BUSY
    utcOffset: { type: 'string', optional: true },
    emails: { type: 'string', optional: true },
    lastLogin: { type: 'date', optional: true },
    createdAt: { type: 'date', optional: true },
    type: { type: 'string', optional: true },
    roles: { type: 'string', optional: true },
  },
};
export default class User {
  get avatar() {
    return `${Application.urls.SERVER_URL}/avatar/${this.username}?_dc=undefined`;
  }
}
User.schema = UserSchema;
